# @voice/execution-log

Общая инфраструктура логирования выполнения, используемая Demo,
Verification Harness и будущими средствами анализа.

## Структура

- `LogEntry` — одна запись журнала (timestamp, kind, payload).
- `LogSink` — контракт для вывода (`write(entry)`).
- `ConsoleLogSink` — выводит в консоль.
- `MemoryLogSink` — хранит в памяти (используется Verification
  Harness и автотестами).
- `LogDispatcher` — рассылает одну запись нескольким LogSink
  одновременно.
- `ExecutionLog` — центральное хранилище последовательности
  выполнения; не занимается отображением.

## Зависимости

Нет зависимостей на другие пакеты платформы — execution-log
полностью самодостаточен.

## Сборка
cd packages/execution-log

npx tsc -p tsconfig.json

(если возникает ошибка вида "tsc@2.0.4 ... This is not the tsc
command you are looking for" — использовать локальный компилятор:
`node_modules\.bin\tsc -p tsconfig.json` вместо `npx tsc`.)

## История

См. `docs/history/README.md`, раздел PR-9a.