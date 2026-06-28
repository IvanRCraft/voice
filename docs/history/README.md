# История развития платформы

Этот документ описывает последовательность Pull Request, которые
сформировали текущую архитектуру платформы. Каждый раздел отражает:
цель, что было реализовано, почему именно такое решение было принято,
и каким следующим шагом оно развивалось.

---

## PR-1 — Bootstrap

**Цель:** создать независимый, полностью рабочий каркас проекта
voice-assistant (React + TypeScript + Vite), без какой-либо
бизнес-логики.

**Что добавлено:**
- Инициализация проекта (package.json, tsconfig, vite.config.ts).
- ESLint в Flat Config формате.
- Заготовки каталогов: sdk, emulator, service, demo, shared, tests.
- Минимальный App.tsx, отображающий "Voice Assistant MVP".

**Почему так:** прежде чем писать любой код голосовой подсистемы,
нужна гарантированно собираемая и запускаемая основа. Любая
дальнейшая работа была бы рискованной без проверенного фундамента.

**Развитие:** на этой основе в PR-2 появился первый универсальный
контракт взаимодействия.
---

## PR-2 — interaction-contract

**Цель:** создать стабильный универсальный контракт взаимодействия
между любым каналом (Voice, Web, WhatsApp, AI Agent, Phone и т.д.)
и предметной областью приложения.

**Что добавлено:**
- Пакет `packages/interaction-contract` (version, model, action,
  event, error, api, index).
- `InteractionAction`, `InteractionEvent` с полем `type` (discriminated
  union), а не `id` — финальное архитектурное решение после ревью.
- `InteractionContract` с тремя методами: `dispatch()`, `subscribe()`,
  `snapshot()`.

**Почему так:** после нескольких неудачных попыток (voice-sdk,
interaction-sdk, с разными наборами полей) был сделан вывод: контракт
должен быть полностью независим от голоса, такси, React, WebSocket
и Python. Только тогда он может стать платформенным.

**Развитие:** PR-3 формализовал этот пакет как часть Platform Core.

---

## PR-3 — Minimal Platform Core

**Цель:** зафиксировать в структуре репозитория результаты
архитектурного аудита: какие компоненты являются платформенными.

**Что добавлено:**
- `packages/platform-core/README.md`, описывающий, что Platform Core
  на данном этапе включает только `interaction-contract`.
- Evolution Policy: новые компоненты включаются в Platform Core
  только после независимого архитектурного аудита и появления как
  минимум двух независимых реализаций.

**Почему так:** не вводить платформенные абстракции (Provider,
Adapter, Runtime, Registry и т.д.) преждевременно, до появления
повторного подтверждения их необходимости.

**Развитие:** PR-4 стал первой специализированной реализацией поверх
Platform Core.

---

## PR-4 — Voice Contracts

**Цель:** создать первые контракты голосовой подсистемы поверх
`interaction-contract`.

**Что добавлено:**
- `packages/voice` с `RecognitionProvider`, `SpeechProvider`.
- Модели `RecognitionResult`, `SpeechOptions`.

**Почему так:** изначально был предложен `VoiceProvider` как
композиция `RecognitionProvider` + `SpeechProvider`, но ревью показало,
что это "пустой контейнер" без поведения. Решение — не вводить
композицию, пока её необходимость не подтвердится повторно.

**Развитие:** PR-5 стал первой реализацией этих контрактов поверх
Browser Web Speech API.

---

## PR-5 — Browser Voice Providers

**Цель:** первая реальная реализация `RecognitionProvider` и
`SpeechProvider` поверх Browser Web Speech API.

**Что добавлено:**
- `BrowserRecognitionProvider`, `BrowserSpeechProvider`.
- `browser-types.ts` — объявления типов Web Speech API.

**Почему так:** реализация показала, что контракты PR-4 практически
не потребовали изменений — это подтвердило, что выбранная модель
контракта удачна. По итогам ревью функция получения конструктора
SpeechRecognition перенесена из browser-types.ts в сам провайдер;
обращение к результатам распознавания сделано безопаснее; console.error
убран — провайдер не должен сам решать, как логировать ошибки.

**Развитие:** PR-6 связал эти провайдеры с interaction-contract через
VoiceChannel.

---

## PR-6 — Voice Channel

**Цель:** реализовать транспортный канал, соединяющий голосовые
провайдеры с interaction-contract, без какой-либо бизнес-логики.

**Что добавлено:**
- VoiceChannel — управляет жизненным циклом, подписками и
  координацией.
- RecognitionMapper, SpeechMapper — выделены отдельно по итогам
  ревью, чтобы VoiceChannel оставался чистым транспортом.

**Почему так:** первая версия VoiceChannel содержала конвертацию
данных внутри себя — это смешивало транспорт и интерпретацию.
Вынесение мапперов сохранило принцип единственной ответственности.

**Развитие:** PR-7 стал первым потребителем VoiceChannel.

---

## PR-7 — Voice Emulator

**Цель:** создать автономную реализацию InteractionContract для
тестирования всего голосового стека без Taxi/FSM/backend.

**Что добавлено:**
- EmulatorContract — полная реализация InteractionContract.
- EmulatorState, EmulatorEventBus.

**Почему так:** по итогам ревью удалено неиспользуемое состояние
Listening. Fallback-событие переименовано из voice.unknown-command в
interaction.unhandled-action, так как эмулятор реализует весь
InteractionContract, а не только голос.

**Развитие:** PR-8 заменил встроенные в эмулятор сценарии на отдельный
декларативный движок.
---

## PR-8 — Scenario Engine

**Цель:** выделить сценарии работы эмулятора в самостоятельный,
декларативный движок.

**Что добавлено:**
- packages/scenario-engine: Scenario, ScenarioStep, ScenarioRegistry,
  ScenarioEngine, BuiltinScenarios.
- DelayProvider — выделен отдельно по итогам ревью, чтобы
  ScenarioEngine не зависел от реального времени напрямую
  (RealTimeDelayProvider для продакшна, InstantDelayProvider для CI).
- EmulatorContract интегрирован с ScenarioEngine; EmulatorScenario
  удалён.

**Почему так:** изначально ScenarioEngine содержал собственную
функцию delay(). Ревью показало, что это создаёт скрытую зависимость
от времени, которая в будущем потребует изменения движка для ускоренных
тестов или виртуальных часов. Вынесение DelayProvider решило эту
проблему заранее.

**Развитие:** PR-9 объединил все компоненты (Browser Providers,
VoiceChannel, EmulatorContract, ScenarioEngine) в работающий
демо-стенд.

---

## PR-9 — Demo & Test Harness

**Цель:** создать демонстрационное приложение и тестовый стенд,
объединяющий все ранее разработанные компоненты.

**Что добавлено:**
- apps/voice-demo: Bootstrap.ts (связывает все компоненты),
  App.ts (минимальный UI: Start/Stop/журнал событий), main.ts,
  DemoRegistry.ts (регистрирует встроенные сценарии).

**Почему так:** до этого момента все PR создавали изолированные
библиотеки. PR-9 стал первой точкой, где голос реально проходит через
весь стек: микрофон -> BrowserRecognitionProvider -> VoiceChannel ->
EmulatorContract -> ScenarioEngine -> обратно через SpeechProvider.

**Развитие:** по итогам ревью логирование (PR-9a) и автоматическая
проверка сценариев (PR-9b) были выделены в отдельные PR, чтобы не
смешивать "собрать систему", "сделать её наблюдаемой" и "сделать её
автоматически проверяемой".

---

## PR-9a — Execution Log Infrastructure

**Цель:** выделить независимую инфраструктуру логирования выполнения,
используемую демо-стендом и последующим Verification Harness.

**Что добавлено:**
- packages/execution-log: LogEntry, LogSink (контракт),
  ConsoleLogSink, MemoryLogSink, LogDispatcher, ExecutionLog.
- Demo (apps/voice-demo) больше не переопределяет console.log
  напрямую — пишет события через ExecutionLog.

**Почему так:** до этого PR Demo выводил журнал через прямое
переопределение console.log — рабочее решение для прототипа, но не
масштабируемое. ExecutionLog не знает, куда выводятся записи (Console,
память, файл, HTML) — это решает LogDispatcher через подключаемые
LogSink.

**Развитие:** PR-9b использует MemoryLogSink/ExecutionLog как
источник данных для автоматической проверки сценариев.

---

## PR-9b — Verification Harness

**Цель:** построить инфраструктуру автоматической проверки сценариев
на основе ExecutionLog, без изменения процесса выполнения.

**Что добавлено:**
- packages/verification: VerificationScenario, VerificationExpectation,
  VerificationResult, VerificationReport, ScenarioVerifier,
  VerificationRunner.

**Почему так:** Verification Harness только читает ExecutionLog и
никогда не пишет в него — это разделение гарантирует, что проверка
не может повлиять на исполняемое поведение системы. ScenarioVerifier
сравнивает последовательность ожиданий (VerificationExpectation) с
фактическими записями журнала; VerificationRunner поддерживает запуск
одного, нескольких или всех сценариев.

**Развитие:** PR-9c добавил интерактивный визуальный стенд
(Validation Bench) поверх этой инфраструктуры.

---

## PR-9c — Interactive Validation Bench

**Цель:** дать визуальный, интерактивный интерфейс для запуска
сценариев и просмотра отчётов Verification Harness, не требуя работы
исключительно через консоль/код.

**Статус:** APPROVED.

**Развитие:** платформа считается готовой к этапу "Release for
Handover" — подготовке репозитория к передаче для миграции новой
подсистемы (например, карты) на существующую архитектуру.