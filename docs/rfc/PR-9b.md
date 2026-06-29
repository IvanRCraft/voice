# PR-9b — Verification Harness

## Статус
READY FOR IMPLEMENTATION

## Цель
Построить инфраструктуру автоматической проверки сценариев, используя ExecutionLog из PR-9a.

Verification Harness не участвует в выполнении сценариев. Он анализирует уже зарегистрированные результаты.

## Архитектурный принцип
Scenario Execution → ExecutionLog → Verification Harness → Verification Report

Verification никогда не пишет в ExecutionLog.
ExecutionLog никогда не знает о Verification.

## Новый пакет
packages/verification/src/
- VerificationScenario.ts
- VerificationExpectation.ts
- VerificationResult.ts
- VerificationReport.ts
- ScenarioVerifier.ts
- VerificationRunner.ts
- index.ts

## Основные компоненты
- ScenarioVerifier — проверяет последовательность записей ExecutionLog
- VerificationRunner — запускает полный набор проверок
- VerificationReport — сводный отчёт (Passed, Failed, ошибки, длительность)

## Definition of Done
- создан пакет verification;
- реализован ScenarioVerifier;
- реализован VerificationRunner;
- реализован VerificationReport;
- проверка использует только ExecutionLog;
- формируется отчёт PASS / FAIL;
- отсутствует предметная логика.