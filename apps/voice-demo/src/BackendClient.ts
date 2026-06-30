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
 *
 * Uses URLSearchParams as fetch body instead of an explicit
 * Content-Type header. The browser sets
 * "application/x-www-form-urlencoded;charset=UTF-8" automatically,
 * which some backends (and CORS preflight configs) accept more
 * reliably than a manually-set header.
 */

export type ConnectionStatus = "connected" | "auth-failed" | "mail-unavailable"

export interface BackendSession {
    token: string
    u_hash: string
    status: ConnectionStatus
}

export class BackendClient {

    private session: BackendSession | null = null

    async connect(baseUrl: string, login: string, password: string): Promise<BackendSession> {

        try {
            const authParams = new URLSearchParams()
            authParams.set("login", login)
            authParams.set("password", password)
            authParams.set("type", "e-mail")

            const authRes = await fetch(`${baseUrl}/api/v1/auth`, {
                method: "POST",
                body: authParams
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

            const tokenParams = new URLSearchParams()
            tokenParams.set("auth_hash", authData.auth_hash)

            const tokenRes = await fetch(`${baseUrl}/api/v1/token`, {
                method: "POST",
                body: tokenParams
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

    async sendReport(baseUrl: string, report: unknown, recipientEmail: string): Promise<boolean> {

        if (!this.session || this.session.status !== "connected") {
            return false
        }

        const json = JSON.stringify(report)
        const file = btoa(unescape(encodeURIComponent(json)))

        try {
            const params = new URLSearchParams()
            params.set("token", this.session.token)
            params.set("u_hash", this.session.u_hash)
            params.set("subject", "Validation Report")
            params.set("body", "See attached JSON report.")
            params.set("file", file)
            params.set("e_id", recipientEmail) 

            const res = await fetch(`${baseUrl}/api/v1/mail`, {
                method: "POST",
                body: params
            })
            return res.ok
        } catch {
            this.session = { ...this.session, status: "mail-unavailable" }
            return false
        }

    }

}