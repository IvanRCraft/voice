# PR-8 — Scenario Engine

**Status:** Implemented, APPROVED

## Цель

Выделить сценарии работы эмулятора в самостоятельный декларативный
движок — сценарий становится данными, а не кодом.

## Состав

`packages/scenario-engine/src/`: `Scenario.ts`, `ScenarioStep.ts`,
`ScenarioRegistry.ts`, `ScenarioEngine.ts`, `DelayProvider.ts`,
`BuiltinScenarios.ts`, `index.ts`.

## Изменения в Emulator

`EmulatorScenario` удалён; `EmulatorContract` использует
`ScenarioEngine`.

## Правка по ревью

Изначально `ScenarioEngine` содержал собственную функцию `delay()`.
Ревью показало скрытую зависимость от реального времени — проблема
для ускоренных тестов/CI/виртуальных часов в будущем. Решение:
`DelayProvider` выделен отдельно (`RealTimeDelayProvider` для
продакшна, `InstantDelayProvider` для CI).

## Definition of Done

- реализован `ScenarioEngine`;
- сценарии регистрируются через `ScenarioRegistry`;
- `EmulatorContract` использует `ScenarioEngine`;
- встроенные сценарии вынесены отдельно (`BuiltinScenarios`);
- отсутствуют зависимости на голосовой стек.