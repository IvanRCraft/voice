# PR-5 — Browser Voice Providers

**Status:** Implemented, APPROVED WITH MINOR COMMENTS

## Цель

Первая реальная реализация `RecognitionProvider`/`SpeechProvider`
поверх Browser Web Speech API.

## Состав

`packages/voice/src/browser/`: `BrowserRecognitionProvider.ts`,
`BrowserSpeechProvider.ts`, `browser-types.ts`, `index.ts`.

## Итог ревью

Контракты PR-4 практически не потребовали изменений при реализации —
подтверждение, что выбранная модель контракта удачна.

## Правки по ревью

- функция получения конструктора SpeechRecognition перенесена из
  `browser-types.ts` (только типы) в провайдер;
- `console.error` убран — провайдер не решает сам, как логировать;
- обращение к результатам распознавания сделано безопасным
  (проверка пустых результатов).

## Definition of Done

- `BrowserRecognitionProvider` полностью реализует `RecognitionProvider`;
- `BrowserSpeechProvider` полностью реализует `SpeechProvider`;
- пакет компилируется;
- публичный API через `browser/index.ts`.