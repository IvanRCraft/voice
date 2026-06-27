/**
 * Voice SDK
 *
 * Public Data Models
 */

/* ============================================================
 * Common
 * ============================================================ */

export type VoiceId = string

export type VoiceCode = number

export type IsoDateTime = string

/* ============================================================
 * Driver
 * ============================================================ */

export enum DriverStatus {
    Offline = "offline",
    Online = "online",
    Available = "available",
    Busy = "busy"
}

/* ============================================================
 * Order
 * ============================================================ */

export enum OrderStatus {
    New = "new",
    Offered = "offered",
    Accepted = "accepted",
    Arrived = "arrived",
    Started = "started",
    Finished = "finished",
    Cancelled = "cancelled"
}

export interface VoiceOrder {
    id: VoiceId
    code: VoiceCode
    status: OrderStatus
}

/* ============================================================
 * Trip
 * ============================================================ */

export enum TripStatus {
    None = "none",
    Active = "active",
    Finished = "finished"
}

export interface VoiceTrip {
    id: VoiceId
    orderId: VoiceId
    status: TripStatus
}

/* ============================================================
 * Location
 * ============================================================ */

export interface VoiceLocation {
    latitude: number
    longitude: number
}

/* ============================================================
 * Session
 * ============================================================ */

export enum SessionStatus {
    Idle = "idle",
    Listening = "listening",
    Thinking = "thinking",
    Speaking = "speaking"
}

/* ============================================================
 * Network
 * ============================================================ */

export enum NetworkStatus {
    Online = "online",
    Offline = "offline"
}

/* ============================================================
 * Speech
 * ============================================================ */

export interface SpeechTask {
    id: VoiceId
    text: string
}

/* ============================================================
 * App State
 * ============================================================ */

export interface VoiceAppState {
    driverStatus: DriverStatus
    networkStatus: NetworkStatus
    sessionStatus: SessionStatus
    activeOrders: readonly VoiceOrder[]
    activeTrip: VoiceTrip | null
}