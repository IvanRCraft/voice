# PR-3 — Minimal Platform Core

**Status:** Implemented, APPROVED, Baseline FROZEN

## Цель

Зафиксировать в структуре репозитория результаты архитектурного
аудита: какие компоненты являются платформенными.

## Состав

`packages/platform-core/README.md` — описывает, что Platform Core
на данном этапе включает только `interaction-contract`.

## Evolution Policy

Новые компоненты включаются в Platform Core только после
независимого архитектурного аудита и появления как минимум двух
независимых реализаций, подтверждающих совпадение архитектурных
ролей.

## Definition of Done

- создан `packages/platform-core/README.md`;
- `interaction-contract` не изменён;
- отсутствуют переносы кода, новые библиотеки, интерфейсы, зависимости.