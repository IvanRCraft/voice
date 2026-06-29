# PR-7 — Voice Emulator

**Status:** Implemented, APPROVED

## Цель

Создать эмулятор приложения, реализующий `InteractionContract`, для
автономной проверки голосового контура без Taxi/FSM/backend.

## Состав

`packages/emulator/src/`: `EmulatorContract.ts`, `EmulatorState.ts`,
`EmulatorEventBus.ts`, `index.ts`.

(`EmulatorScenario.ts` существовал изначально, удалён в PR-8 при
интеграции со Scenario Engine.)

## Правки по ревью

- удалено неиспользуемое состояние `Listening` (модель состояния
  должна отражать только то, что реально происходит в коде —
  dispatch() переходит Idle -> Processing -> Responding -> Idle);
- fallback-событие переименовано из `voice.unknown-command` в
  `interaction.unhandled-action`, так как эмулятор реализует весь
  `InteractionContract`, а не только голос.

## Definition of Done

- реализован `InteractionContract` (`dispatch`, `subscribe`, `snapshot`);
- существует внутреннее состояние;
- отсутствует бизнес-логика;
- отсутствуют зависимости на Taxi и Voice.