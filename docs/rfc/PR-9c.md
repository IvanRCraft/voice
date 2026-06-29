# PR-9c — Interactive Validation Bench

## Цель
Преобразовать Demo & Test Harness в полноценный испытательный стенд,
позволяющий тестировщикам выполнять ручное и автоматизированное
тестирование без подключения к реальному приложению.

## Компоненты стенда
- Voice Channel
- Browser Providers
- Emulator
- Scenario Engine
- Execution Log
- Verification Harness

## Что реализуется

### 1. Панель Test Session
Поля: Tester, Language, Recognition Provider, Speech Provider,
Scenario Set, Build Version, Commit, Environment.

### 2. Backend
POST /api/v1/auth/ — авторизация при открытии стенда.
Отображается статус: Connected / Authentication failed / Mail unavailable.

### 3. Управление выполнением
Режимы: Manual Step, Auto Step, Run Scenario, Run All.
Кнопки: Start, Pause, Stop, Next Step, Previous Step, Repeat Step, Restart Scenario.

### 4. Прогресс выполнения
- текущий сценарий;
- номер шага;
- общее количество шагов;
- индикатор выполнения;
- состояние Voice Channel.

### 5. Наблюдаемое выполнение
- распознанный текст;
- последнее Action и Event;
- текст SpeechProvider;
- состояние Emulator;
- журнал Execution Log.

### 6. Verification Harness
После завершения сценария автоматически запускается VerificationRunner.
Отображаются PASS/FAIL и список ошибок.

### 7. Отчёт
JSON Validation Report содержит: tester, language, build, commit,
browser, os, scenario set, startedAt, finishedAt, duration,
verification results, execution log.

### 8. Отправка отчёта
Кнопка Send Report вызывает POST /api/v1/mail/.
Собственный SMTP отсутствует.

### 9. Развёртывание
Стенд публикуется на Vercel.
Для работы достаточно открыть страницу в браузере.

## Definition of Done
- стенд доступен через браузер;
- поддерживаются ручной и автоматический режимы;
- формируется JSON Validation Report;
- отчёт отправляется через /api/v1/mail/;
- стенд развёрнут на Vercel.