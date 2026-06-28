# @voice/emulator

Автономная реализация `InteractionContract`, позволяющая
тестировать весь голосовой стек без подключения к реальному
приложению (Taxi/FSM/backend).

## Назначение

`EmulatorContract` реализует `dispatch()`, `subscribe()`,
`snapshot()` — выполнение сценариев делегируется `ScenarioEngine`
(`@voice/scenario-engine`), сам эмулятор не содержит бизнес-логики.

## Технический долг

Имя пакета (`@voice/emulator`) исторически голосовое, хотя по факту
эмулятор реализует универсальный `InteractionContract` и может
использоваться для тестирования любых каналов (не только голоса).
Переименование отложено до появления второго независимого
потребителя (например, эмулятора для карты).

## Зависимости

`@interaction/contract`, `@voice/scenario-engine`.

## Сборка
cd packages/emulator

npx tsc -p tsconfig.json

## История

См. `docs/history/README.md`, раздел PR-7 (и интеграция со
Scenario Engine в PR-8).