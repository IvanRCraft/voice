/**
 * Validation Bench
 *
 * Test Session configuration panel.
 */
export interface SessionMeta {
    tester: string
    language: string
    recognitionProvider: string
    speechProvider: string
    scenarioSet: string
    build: string
    commit: string
    environment: string
    backendUrl: string
    login: string
    password: string
}

interface TextFieldDef {
    id: string
    label: string
    value: string
    type?: string
}

interface SelectFieldDef {
    id: string
    label: string
    options: ReadonlyArray<{ value: string, text: string }>
    defaultValue: string
}

const LANGUAGE_OPTIONS = [
    { value: "ru-RU", text: "🇷🇺 Русский (ru-RU)" },
    { value: "en-US", text: "🇬🇧 English (en-US)" },
    { value: "fr-FR", text: "🇫🇷 Français (fr-FR)" },
]

const PROVIDER_OPTIONS = [
    { value: "Browser", text: "Browser" },
]

const TEXT_FIELDS: TextFieldDef[] = [
    { id: "s-tester", label: "Tester", value: "Tester-1" },
    { id: "s-scenario-set", label: "Scenario Set", value: "builtin" },
    { id: "s-build", label: "Build", value: "1.0.0" },
    { id: "s-commit", label: "Commit", value: "bafc789" },
    { id: "s-env", label: "Environment", value: "demo" },
    { id: "s-backend-url", label: "Backend URL", value: "https://voice-assistant-two-olive.vercel.app" },
    { id: "s-login", label: "Login", value: "testvoiceee@gmail.com" },
    { id: "s-password", label: "Password", value: "tyler8787", type: "password" },
]

const SELECT_FIELDS: SelectFieldDef[] = [
    { id: "s-language", label: "Language", options: LANGUAGE_OPTIONS, defaultValue: "ru-RU" },
    { id: "s-recognition", label: "Recognition Provider", options: PROVIDER_OPTIONS, defaultValue: "Browser" },
    { id: "s-speech", label: "Speech Provider", options: PROVIDER_OPTIONS, defaultValue: "Browser" },
]

export function renderSessionPanel(root: HTMLElement, onLanguageChange?: (language: string) => void): () => SessionMeta {
    root.innerHTML = `
        <style>
            .session-panel .session-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                gap: 0.75rem 1.25rem;
                margin-bottom: 0.5rem;
            }
            .session-panel .field {
                display: flex;
                flex-direction: column;
                min-width: 0;
            }
            .session-panel .field label {
                font-weight: bold;
                font-size: 0.85rem;
                margin-bottom: 0.25rem;
                color: #333;
            }
            .session-panel .field input,
            .session-panel .field select {
                padding: 0.45rem 0.5rem;
                border: 1px solid #ccc;
                border-radius: 4px;
                font-size: 0.95rem;
                width: 100%;
                box-sizing: border-box;
                background: #fff;
            }
        </style>
        <div class="session-panel">
            <h2>Test Session</h2>
            <div class="session-grid">
                <div class="field">
                    <label for="${SELECT_FIELDS[0].id}">${SELECT_FIELDS[0].label}</label>
                    <select id="${SELECT_FIELDS[0].id}">
                        ${SELECT_FIELDS[0].options.map(o => `<option value="${o.value}" ${o.value === SELECT_FIELDS[0].defaultValue ? "selected" : ""}>${o.text}</option>`).join("")}
                    </select>
                </div>
                ${TEXT_FIELDS.slice(0, 0).map(() => "").join("")}
                <div class="field">
                    <label for="${SELECT_FIELDS[1].id}">${SELECT_FIELDS[1].label}</label>
                    <select id="${SELECT_FIELDS[1].id}">
                        ${SELECT_FIELDS[1].options.map(o => `<option value="${o.value}" ${o.value === SELECT_FIELDS[1].defaultValue ? "selected" : ""}>${o.text}</option>`).join("")}
                    </select>
                </div>
                <div class="field">
                    <label for="${SELECT_FIELDS[2].id}">${SELECT_FIELDS[2].label}</label>
                    <select id="${SELECT_FIELDS[2].id}">
                        ${SELECT_FIELDS[2].options.map(o => `<option value="${o.value}" ${o.value === SELECT_FIELDS[2].defaultValue ? "selected" : ""}>${o.text}</option>`).join("")}
                    </select>
                </div>
                <div class="field">
                    <label for="s-tester">Tester</label>
                    <input id="s-tester" value="Tester-1" />
                </div>
                <div class="field">
                    <label for="s-scenario-set">Scenario Set</label>
                    <input id="s-scenario-set" value="builtin" />
                </div>
                <div class="field">
                    <label for="s-build">Build</label>
                    <input id="s-build" value="1.0.0" />
                </div>
                <div class="field">
                    <label for="s-commit">Commit</label>
                    <input id="s-commit" value="bafc789" />
                </div>
                <div class="field">
                    <label for="s-env">Environment</label>
                    <input id="s-env" value="demo" />
                </div>
                <div class="field">
                    <label for="s-backend-url">Backend URL</label>
                    <input id="s-backend-url" value="https://voice-assistant-two-olive.vercel.app" />
                </div>
                <div class="field">
                    <label for="s-login">Login</label>
                    <input id="s-login" value="testvoiceee@gmail.com" />
                </div>
                <div class="field">
                    <label for="s-password">Password</label>
                    <input id="s-password" type="password" value="tyler8787" />
                </div>
            </div>
        </div>
    `

    const languageSelect = root.querySelector<HTMLSelectElement>("#s-language")!
    if (onLanguageChange) {
        languageSelect.addEventListener("change", () => onLanguageChange(languageSelect.value))
    }

    return (): SessionMeta => ({
        tester: (root.querySelector<HTMLInputElement>("#s-tester")!).value,
        language: (root.querySelector<HTMLSelectElement>("#s-language")!).value,
        recognitionProvider: (root.querySelector<HTMLSelectElement>("#s-recognition")!).value,
        speechProvider: (root.querySelector<HTMLSelectElement>("#s-speech")!).value,
        scenarioSet: (root.querySelector<HTMLInputElement>("#s-scenario-set")!).value,
        build: (root.querySelector<HTMLInputElement>("#s-build")!).value,
        commit: (root.querySelector<HTMLInputElement>("#s-commit")!).value,
        environment: (root.querySelector<HTMLInputElement>("#s-env")!).value,
        backendUrl: (root.querySelector<HTMLInputElement>("#s-backend-url")!).value,
        login: (root.querySelector<HTMLInputElement>("#s-login")!).value,
        password: (root.querySelector<HTMLInputElement>("#s-password")!).value,
    })
}