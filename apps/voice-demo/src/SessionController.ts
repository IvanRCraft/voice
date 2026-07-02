import { StepState } from "./StepState"
import type { ProgressModel } from "./ProgressModel"

export class SessionController {

    private state = StepState.Idle

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

    startSession(totalScenarios: number): void {
        this.state = StepState.Running
        this.progress = {
            currentScenario: 1,
            totalScenarios,
            currentStep: 0,
            totalSteps: 0,
            progressPercent: 0
        }
    }

    beginScenario(totalSteps: number): void {
        this.progress.totalSteps = totalSteps
        this.progress.currentStep = 0
    }

    nextStep(): void {
        if (this.progress.currentStep < this.progress.totalSteps) {
            this.progress.currentStep++
        }
        this.updateProgress()
        this.state = StepState.Running
    }

    repeatStep(): void {
        this.state = StepState.WaitingTester
    }

    skipStep(): void {
        this.nextStep()
    }

    pause(): void {
        this.state = StepState.Paused
    }

    resume(): void {
        this.state = StepState.Running
    }

    waitForTester(): void {
        this.state = StepState.WaitingTester
    }

    finishScenario(): void {
        this.progress.currentScenario++
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