# PR-2 — interaction-contract

**Status:** Implemented, APPROVED, Baseline 1.0 FROZEN

## Цель

Создать стабильный универсальный контракт взаимодействия между
любым каналом и предметной областью приложения.

## Состав пакета

`packages/interaction-contract/src/`: version.ts, model.ts, action.ts,
event.ts, error.ts, api.ts, index.ts.

## Ключевое решение

`InteractionAction`/`InteractionEvent` используют поле `type`
(discriminated union), а не `id` — финальная редакция после ревью.

## Definition of Done

- компиляция без ошибок;
- отсутствие предметной логики;
- публичный API только через index.ts;
- отсутствие платформенной зависимости (React, Browser, Python).

## Технический долг (отмечен ревью, не блокирует)

- `typescript` в `devDependencies`, не `peerDependencies`;
- `Object.setPrototypeOf` в error.ts для корректного наследования Error;
- `verbatimModuleSyntax: true` в tsconfig.