/**
 * Validation Bench
 *
 * Handles authentication and report sending via backend API.
 * No own SMTP. No own auth mechanism.
 * Uses only existing backend public API.
 *
 * Auth flow (per backend documentation):
 *  1. POST /auth (form-urlencoded: login, password, type) -> auth_hash
 *  2. POST /token (form-urlencoded: auth_hash) -> token, u_hash
 */

export type ConnectionStatus = "connected" | "auth-failed" | "mail-unavailable"

export interface BackendSession {
    token: string
    u_hash: string
    status: ConnectionStatus
}

function encodeFormData(obj: Record<string, string>): string {
    return Object.keys(obj)
        .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]))
        .join("&")
}

export class BackendClient {

    private session: BackendSession | null = null

    async connect(baseUrl: string, login: string, password: string): Promise<BackendSession> {

        try {
            const authRes = await fetch(`${baseUrl}/api/v1/auth`, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: encodeFormData({ login, password, type: "e-mail" })
            })

            if (!authRes.ok) {
                this.session = { token: "", u_hash: "", status: "auth-failed" }
                return this.session
            }

            const authData = await authRes.json() as { auth_hash?: string }

            if (!authData.auth_hash) {
                this.session = { token: "", u_hash: "", status: "auth-failed" }
                return this.session
            }

            const tokenRes = await fetch(`${baseUrl}/api/v1/token`, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: encodeFormData({ auth_hash: authData.auth_hash })
            })

            if (!tokenRes.ok) {
                this.session = { token: "", u_hash: "", status: "auth-failed" }
                return this.session
            }

            const tokenData = await tokenRes.json() as { data: { token: string; u_hash: string } }

            this.session = {
                token: tokenData.data.token,
                u_hash: tokenData.data.u_hash,
                status: "connected"
            }
            return this.session

        } catch {
            this.session = { token: "", u_hash: "", status: "auth-failed" }
            return this.session
        }

    }

    async sendReport(baseUrl: string, report: unknown, eId: string): Promise<boolean> {

        if (!this.session || this.session.status !== "connected") {
            return false
        }

        const json = JSON.stringify(report)
        const file = btoa(unescape(encodeURIComponent(json)))

        try {
            const res = await fetch(`${baseUrl}/api/v1/mail`, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: encodeFormData({
                    token: this.session.token,
                    u_hash: this.session.u_hash,
                    subject: "Validation Report",
                    body: "See attached JSON report.",
                    file,
                    e_id: eId
                })
            })
            return res.ok
        } catch {
            this.session = { ...this.session, status: "mail-unavailable" }
            return false
        }

    }

}