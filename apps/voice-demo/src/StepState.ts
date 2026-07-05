export enum StepState {
    Idle = "idle",
    WaitingSpeech = "waiting-speech",
    Recognizing = "recognizing",
    Speaking = "speaking",
    WaitingConfirmation = "waiting-confirmation",
    ReadyForNext = "ready-for-next",
    Paused = "paused",
    Finished = "finished"
}