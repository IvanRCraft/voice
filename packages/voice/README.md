# @voice/contracts

Контракты и реализации голосовой подсистемы: распознавание речи
(Recognition) и синтез речи (Speech), а также транспортный канал,
связывающий их с `@interaction/contract`.

## Структура
src/

├── types/              -- RecognitionResult, SpeechOptions

├── provider/            -- RecognitionProvider, SpeechProvider (контракты)

├── browser/             -- BrowserRecognitionProvider, BrowserSpeechProvider

│                            (реализация поверх Web Speech API)

└── channel/             -- VoiceChannel, RecognitionMapper, SpeechMapper

(транспорт + конвертация в/из InteractionContract)
## Назначение

- `provider/` не знает о Browser, Taxi, FSM, React.
- `browser/` — первая (и пока единственная) реализация контрактов,
  специфичная для браузера.
- `channel/` — связывает голосовые провайдеры с любым
  `InteractionContract` (например, `EmulatorContract` или будущим
  адаптером к реальному приложению).

## Зависимости

`@interaction/contract` (только типы).

## Сборка
cd packages/voice

npx tsc -p tsconfig.json

## История

См. `docs/history/README.md`, разделы PR-4, PR-5, PR-6.