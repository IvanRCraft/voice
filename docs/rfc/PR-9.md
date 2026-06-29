# PR-9 — Demo & Test Harness

## Статус
READY FOR IMPLEMENTATION

## Цель
Создать демонстрационное приложение и тестовый стенд, объединяющий все ранее разработанные компоненты.

PR-9 предназначен для:
- ручного тестирования;
- демонстрации SDK;
- разработки новых сценариев;
- подготовки автоматических тестов.

## Используемые компоненты
- BrowserRecognitionProvider
- BrowserSpeechProvider
- VoiceChannel
- InteractionContract
- EmulatorContract
- ScenarioEngine
- ScenarioRegistry
- BuiltinScenarios

## Структура
apps/voice-demo/src/
- main.ts
- App.ts
- Bootstrap.ts
- DemoRegistry.ts
- ConsoleLogger.ts
- index.html

## Definition of Done
- все компоненты предыдущих PR работают совместно;
- голос проходит через полный цикл;
- сценарии выполняются через ScenarioEngine;
- журнал показывает поток Action/Event;
- отсутствует предметная логика;
- стенд пригоден для демонстрации и ручного тестирования.