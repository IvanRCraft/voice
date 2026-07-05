import { StepState } from "./StepState"
import type { ProgressModel } from "./ProgressModel"

export class SessionController {

    private state = StepState.Idle
    private previousState: StepState | null = null

    private progress: ProgressModel = {
        currentScenario: 0,
        totalScenarios: 0,
        currentStep: 0,
        totalSteps: 0,
        progressPercent: 0
    }

    getState(): StepState {
        return this.state
    }

    getProgress(): Readonly<ProgressModel> {
        return this.progress
    }

    /** Called once when the interactive session begins. */
    startSession(totalScenarios: number): void {
        this.state = StepState.Idle
        this.progress = {
            currentScenario: 1,
            totalScenarios,
            currentStep: 0,
            totalSteps: totalScenarios,
            progressPercent: 0
        }
    }

    /** Tester clicks "Начать шаг" — begin waiting for the tester's speech. */
    beginWaitingSpeech(): void {
        this.state = StepState.WaitingSpeech
    }

    /** Simulated recognition phase. */
    beginRecognizing(): void {
        this.state = StepState.Recognizing
    }

    /** Scenario engine is producing its response. */
    beginSpeaking(): void {
        this.state = StepState.Speaking
    }

    /** Response delivered — tester must now confirm recognized/heard. */
    beginConfirmation(): void {
        this.state = StepState.WaitingConfirmation
    }

    /** Both recognized+heard confirmations were provided. */
    markReadyForNext(): void {
        this.state = StepState.ReadyForNext
    }

    /** Advances to the next scenario and resets to Idle for the next step. */
    advanceToNextScenario(): void {
        this.progress.currentScenario++
        this.progress.currentStep++
        this.updateProgress()
        this.state = StepState.Idle
    }

    pause(): void {
        if (
            this.state === StepState.WaitingConfirmation ||
            this.state === StepState.ReadyForNext ||
            this.state === StepState.Finished ||
            this.state === StepState.Paused
        ) return
        this.previousState = this.state
        this.state = StepState.Paused
    }

    resume(): void {
        if (this.state !== StepState.Paused) return
        this.state = this.previousState ?? StepState.Idle
        this.previousState = null
    }

    stop(): void {
        this.state = StepState.Finished
    }

    private updateProgress(): void {
        if (this.progress.totalSteps === 0) {
            this.progress.progressPercent = 0
            return
        }
        this.progress.progressPercent = Math.round(
            this.progress.currentStep / this.progress.totalSteps * 100
        )
    }
}