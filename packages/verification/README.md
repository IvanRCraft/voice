# @voice/verification

Инфраструктура автоматической проверки сценариев на основе
ExecutionLog.

## Архитектурный принцип
Scenario Execution

│

▼

ExecutionLog

│

▼

Verification Harness

│

▼

Verification Report

Verification никогда не пишет в ExecutionLog. ExecutionLog никогда
не знает о Verification — зависимость только в одну сторону.

## Структура

- `VerificationScenario` — проверяемый сценарий (имя, ожидаемые
  события, ожидаемый результат).
- `VerificationExpectation` — одно ожидание (Action/Event/Speak/
  Snapshot/State).
- `ScenarioVerifier` — сравнивает записи ExecutionLog с ожиданиями
  одного сценария, возвращает `VerificationResult`.
- `VerificationRunner` — запускает один, несколько или все сценарии,
  агрегирует результаты в `VerificationReport` (passed/failed/errors).

## Зависимости

`@voice/execution-log` (только тип `ExecutionLog`, импортируется
через относительный путь к `dist/`, см. технический долг ниже).

## Технический долг

Импорты идут через относительный путь
(`../../execution-log/dist/index`), а не через имя пакета
(`@voice/execution-log`), так как пакеты платформы пока не объединены
через npm/pnpm workspaces.

## Сборка
cd packages/verification

node_modules.bin\tsc -p tsconfig.json

(если нет node_modules — выполнить сборку из корня репозитория:
`node_modules\.bin\tsc -p packages\verification\tsconfig.json`)

## История

См. `docs/history/README.md`, раздел PR-9b.