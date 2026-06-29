# PR-4 — Voice Contracts

**Status:** Implemented, APPROVED

## Цель

Создать первые контракты голосовой подсистемы поверх
`interaction-contract`: `RecognitionProvider`, `SpeechProvider`.

## Состав

`packages/voice/src/`: `types/RecognitionResult.ts`,
`types/SpeechOptions.ts`, `provider/RecognitionProvider.ts`,
`provider/SpeechProvider.ts`, `index.ts`.

## Архитектурное решение

`VoiceProvider` (композиция Recognition+Speech) был предложен
изначально, но удалён по итогам ревью — "пустой контейнер" без
поведения. Решение: не вводить композицию, пока её необходимость
не подтвердится повторно (Rule "Platform Evolution").

## Definition of Done

- пакет собирается;
- отсутствует бизнес-логика;
- отсутствуют реализации Browser API;
- определены `RecognitionProvider`, `SpeechProvider`;
- публичный API только через index.ts.