# @voice/scenario-engine

Декларативный движок сценариев: описывает, какие события
(`InteractionEvent`) должны быть опубликованы в ответ на
входящее действие (`InteractionAction`), без хардкода в коде.

## Структура

- `Scenario` / `ScenarioStep` — декларативные данные (emit, delay, end).
- `ScenarioRegistry` — хранит сценарии по их триггеру.
- `ScenarioEngine` — выполняет сценарий, не зависит от реального
  времени (см. `DelayProvider`).
- `DelayProvider` — стратегия ожидания (`RealTimeDelayProvider` для
  продакшна, `InstantDelayProvider` для CI/тестов).
- `BuiltinScenarios` — небольшой набор примеров для проверки
  инфраструктуры.

## Технический долг

Имя пакета исторически голосовое, хотя движок не знает о Voice,
Browser, Taxi или FSM и может использоваться для любых каналов.

## Сборка
cd packages/scenario-engine

npx tsc -p tsconfig.json

## История

См. `docs/history/README.md`, раздел PR-8.