Tasdiqlandi — bu Vite shabloni standart README (PR-1 dan beri o'zgartirilmagan). Buni butunlay qaytadan yozaylik, haqiqiy loyiha haqida ma'lumot bilan:
notepad README.md
Butun matnni o'chirib (Ctrl+A, Delete), quyidagini joylashtiring:
markdown# Voice Assistant Platform

Платформа для голосового взаимодействия с приложениями через
универсальный контракт `InteractionContract`, не зависящий от
конкретного канала (Voice, Web, WhatsApp, AI Agent и т.д.) или
предметной области (Taxi и т.д.).

## Статус

Платформа прошла полный цикл разработки от Bootstrap (PR-1) до
Interactive Validation Bench (PR-9c). Все PR подробно описаны в
`docs/history/README.md`.

## Структура репозитория
voice-assistant/

├── docs/

│   ├── history/          -- история развития (PR-1 ... PR-9c)

│   └── rfc/               -- архитектурные RFC (если применимо)

│

├── packages/

│   ├── interaction-contract/   -- универсальный контракт (Platform Core)

│   ├── platform-core/           -- README, описывающий состав Platform Core

│   ├── voice/                    -- голосовые контракты + браузерные провайдеры + канал

│   ├── emulator/                 -- автономная реализация InteractionContract

│   ├── scenario-engine/          -- декларативные сценарии для эмулятора

│   ├── execution-log/            -- инфраструктура логирования выполнения

│   └── verification/             -- автоматическая проверка сценариев

│

└── apps/

└── voice-demo/         -- демонстрационный стенд (Demo & Test Harness)

## Архитектурные принципы

1. **Platform Core минимален.** Новые платформенные абстракции
   вводятся только после независимого архитектурного аудита и
   появления как минимум двух независимых реализаций (см.
   `packages/platform-core/README.md`).

2. **Контракт не знает о реализации.** `interaction-contract` не
   зависит от голоса, такси, React, Browser API, Python или
   WebSocket.

3. **Эволюционное выделение абстракций.** Композиции (например,
   `VoiceProvider` как объединение Recognition+Speech) вводятся
   только когда их необходимость подтверждена повторно — иначе они
   остаются раздельными контрактами.

4. **Verification не вмешивается в выполнение.** Verification
   Harness только читает ExecutionLog, никогда не пишет в него.

## Сборка всех пакетов

Каждый пакет собирается независимо (npm/pnpm workspaces пока не
настроены — это зафиксированный технический долг):
cd packages/interaction-contract && npx tsc -p tsconfig.json && cd ../..

cd packages/voice && npx tsc -p tsconfig.json && cd ../..

cd packages/emulator && npx tsc -p tsconfig.json && cd ../..

cd packages/scenario-engine && npx tsc -p tsconfig.json && cd ../..

cd packages/execution-log && npx tsc -p tsconfig.json && cd ../..

cd packages/verification && node_modules.bin\tsc -p tsconfig.json && cd ../..

Порядок важен: `interaction-contract` собирается первым (от него
зависят остальные), `execution-log` — перед `verification`.

## Запуск Demo
cd apps/voice-demo

npm install

npm run dev

(требует наличия установленных зависимостей — `@interaction/contract`,
`@voice/contracts`, `@voice/emulator`, `@voice/scenario-engine`,
подключённых через относительные пути к `dist/` соответствующих
пакетов, см. исходный код `apps/voice-demo/src/Bootstrap.ts`).

## Документация

- `docs/history/README.md` — полная история всех PR с целью, что
  было реализовано и почему.
- `packages/platform-core/README.md` — состав Platform Core и
  политика его эволюции.
- README каждого пакета — назначение, зависимости, известный
  технический долг, сборка.

## Известный технический долг

- Пакеты не объединены через npm/pnpm workspaces — импорты между
  пакетами идут через относительные пути к `dist/` (а не через
  имена пакетов из `package.json`).
- Несколько пакетов (`@voice/emulator`, `@voice/scenario-engine`)
  носят историческое имя "voice", хотя их логика универсальна и не
  зависит от голосового канала. Переименование отложено до появления
  второго независимого потребителя (например, эмулятора для карты).