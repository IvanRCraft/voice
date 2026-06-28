# @interaction/contract

Универсальный контракт взаимодействия между любым каналом (Voice,
Web, WhatsApp, Telegram, AI Agent, Phone) и предметной областью
приложения.

## Назначение

Не зависит от:
- голоса;
- такси;
- React;
- WebSocket;
- Python.

Определяет только:
- `InteractionAction` — действие, отправленное в приложение;
- `InteractionEvent` — событие, опубликованное приложением;
- `InteractionContract` — интерфейс с тремя методами:
  `dispatch()`, `subscribe()`, `snapshot()`.

## Статус

Часть Platform Core (см. `packages/platform-core/README.md`).
Baseline 1.0, Frozen.

## Сборка

## История

См. `docs/history/README.md`, раздел PR-2.