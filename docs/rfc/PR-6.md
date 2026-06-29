# PR-6 — Voice Channel

**Status:** Implemented, APPROVED

## Цель

Реализовать транспортный канал, соединяющий голосовые провайдеры
с `interaction-contract`, без бизнес-логики.

## Состав

`packages/voice/src/channel/`: `VoiceChannel.ts`,
`VoiceChannelOptions.ts`, `VoiceChannelState.ts`,
`RecognitionMapper.ts`, `SpeechMapper.ts`, `index.ts`.

## Поток обработки
RecognitionProvider -> RecognitionMapper -> InteractionAction
-> VoiceChannel -> InteractionContract.dispatch()
InteractionContract.subscribe() -> InteractionEvent -> SpeechMapper
-> SpeechOptions -> VoiceChannel -> SpeechProvider.speak()

## Правка по ревью

Изначально `VoiceChannel` содержал конвертацию данных внутри себя
(stub-логика для recognition->action и event->speech). Ревью
показало, что это смешивает транспорт и интерпретацию. Решение:
`RecognitionMapper`/`SpeechMapper` выделены отдельно — `VoiceChannel`
остаётся чистым транспортом.

## Definition of Done

- реализован `VoiceChannel` с `start()`/`stop()`;
- подписка на `RecognitionProvider`;
- `dispatch()` в `InteractionContract`;
- подписка на события `InteractionContract`;
- корректное освобождение подписок при остановке;
- отсутствует предметная логика.