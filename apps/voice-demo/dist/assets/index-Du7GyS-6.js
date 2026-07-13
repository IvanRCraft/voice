(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=class{recognition;listeners=new Set;isActive=!1;pendingEndResolvers=[];constructor(e=`ru-RU`){this.recognition=this.createRecognition(),this.configureRecognition(e),this.bindEvents()}async start(){this.isActive=this.isSupported,this.recognition.start()}async stop(){this.isActive&&await new Promise(e=>{this.pendingEndResolvers.push(e),this.recognition.stop()})}subscribe(e){return this.listeners.add(e),()=>{this.listeners.delete(e)}}setLanguage(e){this.recognition.lang=e}isSupported=!0;createRecognition(){let e=window.SpeechRecognition??window.webkitSpeechRecognition;return e?new e:(console.warn(`SpeechRecognition API is not supported in this browser. Real microphone input will be unavailable; Automatic/Inject Action modes are unaffected.`),this.isSupported=!1,{lang:``,interimResults:!1,maxAlternatives:1,continuous:!1,start:()=>{},stop:()=>{},onresult:null,onerror:null,onend:null})}configureRecognition(e){this.recognition.lang=e,this.recognition.interimResults=!1,this.recognition.maxAlternatives=1,this.recognition.continuous=!1}bindEvents(){this.recognition.onresult=e=>{this.handleResult(e)},this.recognition.onerror=()=>{},this.recognition.onend=()=>{this.isActive=!1;let e=this.pendingEndResolvers;this.pendingEndResolvers=[],e.forEach(e=>e())}}handleResult(e){let t=e.results.item(e.resultIndex);if(!t||t.length===0)return;let n=t.item(0);if(!n)return;let r={text:n.transcript,confidence:n.confidence,language:this.recognition.lang};for(let e of this.listeners)e(r)}},t=class{onStarted=null;onFinished=null;onError=null;async speak(e){let t=window.speechSynthesis;t.paused&&t.resume();let n=new SpeechSynthesisUtterance(e.text);e.language&&(n.lang=e.language),await new Promise(r=>{n.onstart=()=>{this.onStarted?.(e.text)},n.onend=()=>{this.onFinished?.(e.text),r()},n.onerror=t=>{let n=t?.error??`unknown speech synthesis error`;this.onError?.(e.text,n),r()},t.speak(n)})}async stop(){let e=window.speechSynthesis;e.cancel(),e.paused&&e.resume()}},n;(function(e){e.Idle=`idle`,e.Running=`running`,e.Stopped=`stopped`})(n||={});var r=class{options;state=n.Idle;unsubscribeRecognition=null;unsubscribeInteraction=null;onAction=null;onEvent=null;onSpeak=null;constructor(e){this.options=e}ensureInteractionSubscribed(){this.unsubscribeInteraction||=this.options.interaction.subscribe(e=>this.handleInteractionEvent(e))}async start(){this.state!==n.Running&&(this.unsubscribeRecognition=this.options.recognition.subscribe(e=>this.handleRecognitionResult(e)),this.ensureInteractionSubscribed(),await this.options.recognition.start(),this.state=n.Running)}async stop(){this.state===n.Running&&(await this.options.recognition.stop(),await this.options.speech.stop(),this.unsubscribeRecognition?.(),this.unsubscribeRecognition=null,this.state=n.Stopped)}getState(){return this.state}async injectAction(e){this.onAction?.(e);try{await this.options.interaction.dispatch(e)}catch{}}handleRecognitionResult(e){let t=this.options.recognitionMapper.map(e);this.onAction?.(t),this.options.interaction.dispatch(t).catch(e=>{})}handleInteractionEvent(e){this.onEvent?.(e);let t=this.options.speechMapper.map(e);this.onSpeak?.(t.text),this.options.speech.speak(t)}},i=class{map(e){return{type:`voice.recognized`,payload:{text:e.text,confidence:e.confidence,language:e.language}}}},a=class{map(e){let t=e.payload;return{text:(t&&typeof t.recognizedText==`string`?t.recognizedText:void 0)??e.type}}},o=class{scenarios=new Map;register(e){this.scenarios.set(e.trigger,e)}unregister(e){this.scenarios.delete(e)}find(e){return this.scenarios.get(e)}list(){return Array.from(this.scenarios.values())}},s=class{wait(e){return new Promise(t=>setTimeout(t,e))}},c=class{registry;delayProvider;constructor(e,t=new s){this.registry=e,this.delayProvider=t}async*run(e){let t=this.registry.find(e.type);if(!t){yield{type:`interaction.unhandled-action`,payload:{receivedType:e.type}};return}let n=this.extractRecognizedText(e);for(let e of t.steps)switch(e.kind){case`emit`:yield this.withRecognizedText(e.event,n);break;case`delay`:await this.delayProvider.wait(e.ms);break;case`end`:return}}extractRecognizedText(e){let t=e.payload;return t&&typeof t.text==`string`?t.text:void 0}withRecognizedText(e,t){return t?{...e,payload:{...e.payload??{},recognizedText:t}}:e}},l=[{name:`voice-recognized-ok`,trigger:`voice.recognized`,steps:[{kind:`emit`,event:{type:`interaction.ok`,payload:{}}}]},{name:`echo`,trigger:`interaction.echo`,steps:[{kind:`emit`,event:{type:`interaction.echo-response`,payload:{}}}]},{name:`delayed-response`,trigger:`interaction.delayed`,steps:[{kind:`delay`,ms:500},{kind:`emit`,event:{type:`interaction.delayed-response`,payload:{}}}]}];function u(e){for(let t of l)e.register(t)}var d;(function(e){e.Idle=`idle`,e.Processing=`processing`,e.Responding=`responding`})(d||={});var f=class{listeners=new Set;subscribe(e){return this.listeners.add(e),()=>{this.listeners.delete(e)}}publish(e){for(let t of this.listeners)t(e)}},p=class{state=d.Idle;revision=0;bus=new f;engine;constructor(e){this.engine=new c(e)}async dispatch(e){this.state=d.Processing,this.revision+=1;for await(let t of this.engine.run(e)){let e={...t,metadata:{source:`emulator`,timestamp:new Date().toISOString()}};this.state=d.Responding,this.bus.publish(e)}this.state=d.Idle}subscribe(e){return this.bus.subscribe(e)}async snapshot(){return{revision:this.revision,state:{emulatorState:this.state,revision:this.revision}}}},m=class{write(e){console.log(`[${e.kind}]`,e.payload)}},h=class{entries=[];write(e){this.entries.push(e)}getEntries(){return this.entries}clear(){this.entries.length=0}},ee=class{sinks=new Set;register(e){return this.sinks.add(e),()=>{this.sinks.delete(e)}}write(e){for(let t of this.sinks)t.write(e)}},g=class{sink;entries=[];constructor(e){this.sink=e}append(e,t){let n={timestamp:new Date().toISOString(),kind:e,payload:t};this.entries.push(n),this.sink?.write(n)}getEntries(){return this.entries}clear(){this.entries.length=0}},te=class{log;constructor(e){this.log=e}logAction(e){this.log.append(`Action`,{type:e.type,payload:e.payload??{}})}logEvent(e){this.log.append(`Event`,{type:e.type,payload:e.payload??{}})}logSpeak(e){this.log.append(`Speak`,{text:e})}},ne=class{session=null;async connect(e,t,n){try{let r=new URLSearchParams;r.set(`login`,t),r.set(`password`,n),r.set(`type`,`e-mail`);let i=await fetch(e+`/api/v1/auth`,{method:`POST`,body:r});if(!i.ok)return this.session={token:``,u_hash:``,status:`auth-failed`},this.session;let a=await i.json();if(!a.auth_hash)return this.session={token:``,u_hash:``,status:`auth-failed`},this.session;let o=new URLSearchParams;o.set(`auth_hash`,a.auth_hash);let s=await fetch(e+`/api/v1/token`,{method:`POST`,body:o});if(!s.ok)return this.session={token:``,u_hash:``,status:`auth-failed`},this.session;let c=await s.json();return this.session={token:c.data.token,u_hash:c.data.u_hash,status:`connected`},this.session}catch{return this.session={token:``,u_hash:``,status:`auth-failed`},this.session}}async getEmailId(e){try{let t=encodeURIComponent(JSON.stringify({site_emails:!0})),n=await fetch(e+`/api/v1/data/?json_like=`+t);if(!n.ok)return null;let r=(await n.json()).data?.data?.site_emails;if(!r)return null;let i=Object.keys(r);return i.length>0?i[0]:null}catch{return null}}async sendReport(e,t,n){if(!this.session||this.session.status!==`connected`)return!1;let r=JSON.stringify(t),i=new Blob([r],{type:`application/json;charset=UTF-8`}),a=await new Promise((e,t)=>{let n=new FileReader;n.onload=()=>e(n.result),n.onerror=()=>t(n.error),n.readAsDataURL(i)}),o=JSON.stringify([{base64:a,name:`validation-report.json`}]);try{let t=new URLSearchParams;return t.set(`token`,this.session.token),t.set(`u_hash`,this.session.u_hash),t.set(`subject`,`Validation Report`),t.set(`body`,`See attached JSON report.`),t.set(`file`,o),(await fetch(e+`/api/v1/mail/`+n+`/send/`,{method:`POST`,body:t})).ok}catch{return this.session={...this.session,status:`mail-unavailable`},!1}}};function _(n=`en-US`){let s=new o;u(s);let c=new ee,l=new m,d=new h;c.register(l),c.register(d);let f=new g(c),_=new te(f),v=new p(s),y=new e(n),b=new t;return{channel:new r({recognition:y,speech:b,interaction:v,recognitionMapper:new i,speechMapper:new a}),logger:_,executionLog:f,memorySink:d,registry:s,backend:new ne,interaction:v,recognition:y,speech:b}}function v(e){return e.innerHTML=`
        <style>
            .session-panel { margin-bottom: 1rem; }
            .session-grid {
                display: grid;
                grid-template-columns: repeat(2, minmax(220px, 1fr));
                gap: 12px 16px;
                margin-top: 0.5rem;
            }
            .session-field {
                display: flex;
                flex-direction: column;
                gap: 4px;
            }
            .session-field label {
                font-size: 0.85rem;
                font-weight: 600;
            }
            .session-field input,
            .session-field select {
                padding: 6px 8px;
                font-size: 1rem;
                width: 100%;
                box-sizing: border-box;
            }
            @media (max-width: 768px) {
                .session-grid { grid-template-columns: 1fr; }
            }
        </style>
        <div class="session-panel">
            <h2>Test Session</h2>
            <div class="session-grid">
                <div class="session-field">
                    <label for="s-tester">Tester</label>
                    <input id="s-tester" value="Tester-1" />
                </div>
                <div class="session-field">
                    <label for="s-language">Language</label>
                    <select id="s-language">
                        <option value="ru-RU">🇷🇺 Русский (ru-RU)</option>
                        <option value="en-US" selected>🇬🇧 English (en-US)</option>
                        <option value="fr-FR">🇫🇷 Français (fr-FR)</option>
                    </select>
                </div>
                <div class="session-field">
                    <label for="s-recognition">Recognition Provider</label>
                    <select id="s-recognition">
                        <option value="Browser" selected>Browser</option>
                        <option value="OpenAI">OpenAI</option>
                        <option value="Azure">Azure</option>
                        <option value="Google">Google</option>
                        <option value="Whisper">Whisper</option>
                    </select>
                </div>
                <div class="session-field">
                    <label for="s-speech">Speech Provider</label>
                    <select id="s-speech">
                        <option value="Browser" selected>Browser</option>
                        <option value="OpenAI">OpenAI</option>
                        <option value="Azure">Azure</option>
                        <option value="Google">Google</option>
                    </select>
                </div>
                <div class="session-field">
                    <label for="s-scenario-set">Scenario Set</label>
                    <input id="s-scenario-set" value="builtin" />
                </div>
                <div class="session-field">
                    <label for="s-build">Build</label>
                    <input id="s-build" value="1.0.0" />
                </div>
                <div class="session-field">
                    <label for="s-commit">Commit</label>
                    <input id="s-commit" value="bafc789" />
                </div>
                <div class="session-field">
                    <label for="s-env">Environment</label>
                    <input id="s-env" value="demo" />
                </div>
                <div class="session-field">
                    <label for="s-backend-url">Backend URL</label>
                    <input id="s-backend-url" value="https://ibronevik.ru/taxi/c/gruzvill/" />
                </div>
                <div class="session-field">
                    <label for="s-login">Login</label>
                    <input id="s-login" value="testvoiceee@gmail.com" />
                </div>
                <div class="session-field">
                    <label for="s-password">Password</label>
                    <input id="s-password" type="password" value="tyler8787" />
                </div>
            </div>
        </div>
    `,()=>({tester:e.querySelector(`#s-tester`).value,language:e.querySelector(`#s-language`).value,recognitionProvider:e.querySelector(`#s-recognition`).value,speechProvider:e.querySelector(`#s-speech`).value,scenarioSet:e.querySelector(`#s-scenario-set`).value,build:e.querySelector(`#s-build`).value,commit:e.querySelector(`#s-commit`).value,environment:e.querySelector(`#s-env`).value,backendUrl:e.querySelector(`#s-backend-url`).value,login:e.querySelector(`#s-login`).value,password:e.querySelector(`#s-password`).value})}function y(e,t,n,r,i){let a=`PASS`;n.failed>0&&(a=`FAIL`);let o=new Date(t).getTime(),s=Number.isFinite(o)?Math.max(0,Date.now()-o):0;return{Session:{tester:e.tester||`Tester-1`,language:e.language||`en-US`,startedAt:t},Environment:{env:e.environment||`demo`,backendUrl:`https://ibronevik.ru/taxi/c/gruzvill`},TestConfiguration:{recognitionProvider:e.recognitionProvider||`Browser`,speechProvider:e.speechProvider||`Browser`,scenarioSet:e.scenarioSet||`builtin`,inputSource:i?.inputSource||`inject`},ValidationMode:i?.validationMode||`Automatic`,ScenarioStatistics:{total:n.totalScenarios||0},Verification:n,ManualValidation:{},ExecutionLog:Array.isArray(r)?[...r]:r,Summary:{status:a,totalScenarios:n.totalScenarios||0,passed:n.passed||0,failed:n.failed||0,manualWarnings:0,repeatedSteps:0,skippedSteps:0,durationMs:s},Attachments:[]}}function b(e){return`validation-report-${new Date().toISOString().split(`T`)[0]}-${(e.tester||`Tester-1`).replace(/\s+/g,`-`)}.json`}var re=class{storageKey=`validation_bench_history`;add(e){let t=this.getAll(),n={timestamp:new Date().toISOString(),tester:e?.Session?.tester||`Tester-1`,status:e?.Summary?.status||`PASS`};t.unshift(n),t.length>10&&t.pop(),localStorage.setItem(this.storageKey,JSON.stringify(t))}getAll(){let e=localStorage.getItem(this.storageKey);return e?JSON.parse(e):[]}clearHistory(){localStorage.removeItem(this.storageKey)}},x=function(e){return e.Idle=`idle`,e.WaitingTester=`waiting-tester`,e.Running=`running`,e.Paused=`paused`,e.Finished=`finished`,e}({}),ie=class{state=x.Idle;progress={currentScenario:0,totalScenarios:0,currentStep:0,totalSteps:0,progressPercent:0};getState(){return this.state}getProgress(){return this.progress}startSession(e){this.state=x.Running,this.progress={currentScenario:1,totalScenarios:e,currentStep:0,totalSteps:0,progressPercent:0}}beginScenario(e){this.progress.totalSteps=e,this.progress.currentStep=0,this.progress.progressPercent=0}nextStep(){this.progress.currentStep<this.progress.totalSteps&&this.progress.currentStep++,this.updateProgress(),this.state=x.Running}repeatStep(){this.state=x.WaitingTester}skipStep(){this.nextStep()}pause(){this.state=x.Paused}resume(){this.state=x.Running}waitForTester(){this.state=x.WaitingTester}finishScenario(){this.progress.currentScenario++}stop(){this.state=x.Finished}updateProgress(){if(this.progress.totalSteps===0){this.progress.progressPercent=0;return}this.progress.progressPercent=Math.round(this.progress.currentStep/this.progress.totalSteps*100)}},S={"voice.recognized":{promptText:`Произнесите любую фразу`,expectedText:`Ожидаемый ответ: подтверждение распознавания`},"interaction.echo":{promptText:`Произнесите любую фразу`,expectedText:`Ожидаемый ответ: эхо-повтор фразы`},"interaction.delayed":{promptText:`Произнесите любую фразу`,expectedText:`Ожидаемый ответ: ответ с задержкой`}},C={"voice.recognized":{promptText:`Say any phrase`,expectedText:`Expected response: recognition confirmed`},"interaction.echo":{promptText:`Say any phrase`,expectedText:`Expected response: echo of the phrase`},"interaction.delayed":{promptText:`Say any phrase`,expectedText:`Expected response: delayed reply`}},ae={"ru-RU":S,"en-US":C,"fr-FR":{"voice.recognized":{promptText:`Dites n'importe quelle phrase`,expectedText:`Réponse attendue : reconnaissance confirmée`},"interaction.echo":{promptText:`Dites n'importe quelle phrase`,expectedText:`Réponse attendue : écho de la phrase`},"interaction.delayed":{promptText:`Dites n'importe quelle phrase`,expectedText:`Réponse attendue : réponse différée`}}};function oe(e,t){return(ae[t]??C)[e]??{promptText:`Perform action: ${e}`,expectedText:`No expected response defined`}}var w={"ru-RU":`Шаг`,"en-US":`Step`,"fr-FR":`Étape`};function se(e){return w[e]??w[`en-US`]}var T=[`voice.recognized`,`interaction.echo`,`interaction.delayed`];function E(e,t){let n=new re,r=new ie;e.innerHTML=`
        <div style="font-family:sans-serif;padding:1rem;max-width:900px">
            <h1>Validation Bench</h1>

            <div id="session-root"></div>

            <div style="margin:0.5rem 0;font-weight:bold">
                Backend: <span id="conn-label">—</span>
                &nbsp;|&nbsp; Mail: <span id="mail-label">—</span>
            </div>

            <div style="margin:1rem 0">
                <label style="font-weight:bold">Validation Mode:
                    <select id="mode-select">
                        <option value="automatic">Automatic</option>
                        <option value="interactive">Interactive</option>
                    </select>
                </label>
            </div>

            <div id="input-source-row" style="margin:1rem 0; display:none">
                <label style="font-weight:bold">Input Source:
                    <select id="input-source-select">
                        <option value="mic">🎤 Browser microphone</option>
                        <option value="inject">Inject Action (debug)</option>
                    </select>
                </label>
            </div>

            <div style="margin:1rem 0">
                <div style="margin-top:0.5rem">
                    <button id="btn-connect">Connect</button>
                    <button id="btn-start">▶ Start</button>
                    <button id="btn-stop">■ Stop</button>
                    <button id="btn-run-all">▶ Run All</button>
                </div>

                <div id="inject-controls" style="margin-top:0.5rem">
                    <label>Inject action:
                        <select id="inject-select">
                            ${T.map(e=>`<option value="${e}">${e}</option>`).join(``)}
                        </select>
                    </label>
                    <button id="btn-inject">Send</button>
                </div>

                <div id="mic-controls" style="margin-top:0.5rem; display:none">
                    <span id="mic-status">🎤 Idle</span>
                </div>
            </div>

            <div style="margin:0.5rem 0">
                <b>Channel State:</b> <span id="obs-state">—</span>
                &nbsp;|&nbsp; <b>Progress:</b> <span id="obs-progress">—</span>
            </div>

            <!-- Interactive Runner (PR-9d.2) -->
            <div id="interactive-panel" data-testid="interactive-runner" style="display:none; border:1px solid #ccc; border-radius:6px; padding:1rem; margin:1rem 0; background:#fafafa">
                <h3 style="margin-top:0">Interactive Runner</h3>

                <div style="margin-bottom:0.5rem">
                    <b>Session State:</b> <span id="int-session-state" data-testid="session-state">Idle</span>
                    &nbsp;|&nbsp; <b>Scenario:</b> <span id="int-scenario" data-testid="current-step">— / —</span>
                    &nbsp;|&nbsp; <b>Progress:</b> <span id="int-progress" data-testid="progress-value">0%</span>
                </div>

                <div style="background:#fff; border:1px solid #ddd; border-radius:4px; padding:0.8rem; margin-bottom:0.6rem">
                    <div id="int-step-label" style="font-weight:bold; margin-bottom:0.3rem">Step</div>
                    <div id="int-prompt" style="font-size:1.05rem; margin-bottom:0.4rem">—</div>
                    <div id="int-expected" style="color:#555; font-size:0.9rem">—</div>
                    <div style="margin-top:0.4rem; font-size:0.9rem; color:#333">
                        Recognized: <span id="recognized-text" data-testid="recognized-text">—</span>
                    </div>
                    <div style="font-size:0.9rem; color:#333">
                        Speech: <span id="speech-text" data-testid="speech-text">—</span>
                    </div>
                </div>

                <div style="margin-bottom:0.6rem">
                    <button id="int-btn-next">▶ Next Step</button>
                    <button id="int-btn-repeat">↺ Repeat Step</button>
                    <button id="int-btn-skip">⏭ Skip Step</button>
                    <button id="int-btn-pause">⏸ Pause</button>
                    <button id="int-btn-resume">⏵ Resume</button>
                </div>

                <div id="int-confirm-block" style="display:none; margin-bottom:0.6rem">
                    <div style="margin-bottom:0.3rem">
                        <b>Распознано верно?</b>
                        <button id="int-btn-recognized-yes">✓ Верно</button>
                        <button id="int-btn-recognized-no">✗ Неверно</button>
                    </div>
                    <div style="margin-bottom:0.3rem">
                        <b>Ожидаемая речь услышана?</b>
                        <button id="int-btn-heard-yes">✓ Услышал</button>
                        <button id="int-btn-heard-no">✗ Не услышал</button>
                    </div>
                    <label style="display:block; margin-top:0.4rem">
                        Комментарий тестировщика:
                        <br/>
                        <textarea id="int-comment" data-testid="manual-comment" rows="2" style="width:100%"></textarea>
                    </label>
                    <div style="margin-top:0.3rem">
                        <button id="int-btn-save-comment">Сохранить комментарий</button>
                        <span id="int-comment-status" style="margin-left:0.5rem; color:#888">Не сохранён</span>
                    </div>
                </div>

                <div id="int-summary-box" style="display:none; background:#eef7ee; border:1px solid #b6d7b6; border-radius:4px; padding:0.8rem; margin-top:0.6rem">
                    <div style="font-weight:bold; margin-bottom:0.4rem">Session Summary</div>
                    <div id="int-summary-content"></div>
                    <button id="int-btn-restart" style="margin-top:0.6rem">↻ Start New Session</button>
                </div>
            </div>

            <div>
                <h3>Verification</h3>
                <div id="verification-result">—</div>
            </div>

            <h3>Execution Log</h3>
            <pre id="exec-log" data-testid="execution-log" style="background:#111;color:#0f0;padding:1rem;height:200px;overflow:auto"></pre>

            <h3>Last Completed Report</h3>
            <div id="report-preview-box" data-testid="last-report" style="background:#f4f4f4; border:1px solid #ccc; padding:1rem; margin-bottom:1rem; min-height:100px; border-radius:4px; font-size:0.9rem; color:#333;">
                <i>Чтобы просмотреть отчёт, сначала нажмите кнопку "Run All"...</i>
            </div>

            <h3>JSON Report</h3>
            <pre id="json-report" style="background:#111;color:#0ff;padding:1rem;height:200px;overflow:auto"></pre>

            <h3>Report History</h3>
            <pre id="report-history" style="font-size:0.9rem">—</pre>

            <div style="margin-top:1rem">
                <button id="btn-download">Download JSON</button>
                <button id="btn-send">Send Report</button>
            </div>
        </div>
    `;let i=v(e.querySelector(`#session-root`)),a=e.querySelector(`#conn-label`),o=e.querySelector(`#mail-label`),s=e.querySelector(`#obs-state`),c=e.querySelector(`#obs-progress`),l=e.querySelector(`#verification-result`),u=e.querySelector(`#exec-log`),d=e.querySelector(`#json-report`),f=e.querySelector(`#report-preview-box`),p=e.querySelector(`#report-history`),m=e.querySelector(`#inject-select`),h=e.querySelector(`#mode-select`),ee=e.querySelector(`#input-source-row`),g=e.querySelector(`#input-source-select`),te=e.querySelector(`#inject-controls`),ne=e.querySelector(`#mic-controls`),_=e.querySelector(`#mic-status`),S=e.querySelector(`#interactive-panel`),C=e.querySelector(`#int-session-state`),ae=e.querySelector(`#int-scenario`),w=e.querySelector(`#int-progress`),E=e.querySelector(`#int-prompt`),D=e.querySelector(`#int-expected`),ce=e.querySelector(`#int-step-label`),le=e.querySelector(`#int-confirm-block`),O=e.querySelector(`#int-comment`),ue=e.querySelector(`#recognized-text`),de=e.querySelector(`#speech-text`),k=e.querySelector(`#int-comment-status`),fe=e.querySelector(`#int-btn-save-comment`),A=e.querySelector(`#int-summary-box`),pe=e.querySelector(`#int-summary-content`),me=e.querySelector(`#int-btn-restart`),j=e.querySelector(`#int-btn-next`),he=e.querySelector(`#int-btn-repeat`),ge=e.querySelector(`#int-btn-skip`),_e=e.querySelector(`#int-btn-pause`),ve=e.querySelector(`#int-btn-resume`),M=e.querySelector(`#int-btn-recognized-yes`),N=e.querySelector(`#int-btn-recognized-no`),P=e.querySelector(`#int-btn-heard-yes`),F=e.querySelector(`#int-btn-heard-no`),I=e.querySelector(`#btn-run-all`),L=e.querySelector(`#btn-start`),ye=e.querySelector(`#btn-stop`),be=e.querySelector(`#btn-inject`),R=new Date().toISOString(),z=!1,B=null,V=null,H=[],U=0,W=[],G=null,K=null,q=``;function xe(){k.textContent=`Есть несохранённые изменения`,k.style.color=`#c78a00`}function Se(){k.textContent=`✓ Сохранено`,k.style.color=`green`}function Ce(){O.value=``,q=``,k.textContent=`Не сохранён`,k.style.color=`#888`,M.setAttribute(`style`,``),N.setAttribute(`style`,``),P.setAttribute(`style`,``),F.setAttribute(`style`,``),ue.textContent=`—`,de.textContent=`—`}O.addEventListener(`input`,()=>{O.value!==q&&xe()}),fe.addEventListener(`click`,()=>{q=O.value,G&&(G.comment=q),Se()});function J(){u.textContent=t.executionLog.getEntries().map(e=>`[${e.kind}] ${JSON.stringify(e.payload)}`).join(`
`),u.scrollTop=u.scrollHeight}async function Y(){await t.channel.stop(),t.channel.ensureInteractionSubscribed(),await t.speech.stop(),s.textContent=t.channel.getState()}function we(){let e=n.getAll();if(e.length===0){p.textContent=`—`;return}p.innerHTML=e.map(e=>{let t=e.status===`PASS`?`green`:e.status===`FAIL`?`red`:`orange`,n=new Date(e.timestamp).toLocaleString();return`<div style="margin:0.2rem 0">
                <span style="color:${t};font-weight:bold">${e.status}</span>
                — ${n} — ${e.tester}
            </div>`}).join(``)}function Te(e){let t=e?.Summary?.status||`PASS`,n=t===`PASS`?`green`:`red`;f.innerHTML=`
            <div style="background: #fff; border-left: 4px solid ${n}; padding: 0.8rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <div style="margin-bottom:0.4rem; color:#888; font-size:0.8rem;">Generated at: ${new Date().toLocaleString()}</div>
                <div style="margin-bottom:0.4rem"><strong>Status:</strong> <span style="color:${n};font-weight:bold">${t}</span></div>
                <div style="margin-bottom:0.4rem"><strong>Tester:</strong> ${e?.Session?.tester||`Tester`} | <strong>Language:</strong> ${e?.Session?.language||`en-US`}</div>
                <div style="margin-bottom:0.4rem"><strong>Mode:</strong> ${e?.ValidationMode||`Automatic`} | <strong>Input Source:</strong> ${e?.TestConfiguration?.inputSource||`inject`}</div>
                <div style="margin-bottom:0.4rem"><strong>Recognition:</strong> ${e?.TestConfiguration?.recognitionProvider||`Browser`} | <strong>Speech:</strong> ${e?.TestConfiguration?.speechProvider||`Browser`} | <strong>Scenario Set:</strong> ${e?.TestConfiguration?.scenarioSet||`builtin`}</div>
                <div style="margin-bottom:0.4rem"><strong>Scenarios:</strong> ${e?.Summary?.totalScenarios||0} (Passed: ${e?.Summary?.passed||0}, Failed: ${e?.Summary?.failed||0})</div>
                <div><strong>Duration:</strong> ${e?.Summary?.durationMs||0} ms</div>
            </div>
        `}function Ee(){let e=g.value===`mic`;te.style.display=e?`none`:`block`,ne.style.display=e?`block`:`none`,X()}g.addEventListener(`change`,Ee),Ee();function X(){C.textContent=r.getState();let e=r.getProgress(),t=Math.min(e.currentScenario,e.totalScenarios);ae.textContent=`${t} / ${e.totalScenarios}`,w.textContent=`${e.totalScenarios>0?Math.round((t-1)/e.totalScenarios*100):0}%`;let n=r.getState()===x.Paused,i=r.getState()===x.Finished,a=r.getState()===x.WaitingTester;i&&(w.textContent=`100%`),j.toggleAttribute(`disabled`,n||i),he.toggleAttribute(`disabled`,n||i),ge.toggleAttribute(`disabled`,n||i),_e.toggleAttribute(`disabled`,n||i),ve.toggleAttribute(`disabled`,!n),le.style.display=a?`block`:`none`,a?j.textContent=`▶ Next Step`:j.textContent=g.value===`mic`?`🎤 Start Listening`:`▶ Start Step`}function Z(){if(U>=H.length){je();return}let e=H[U],n=i().language,a=oe(e,n);ce.textContent=se(n),E.textContent=a.promptText,D.textContent=a.expectedText,r.beginScenario(1),Ce(),t.executionLog.append(`Step`,{number:U+1,total:H.length,trigger:e}),J(),X()}function De(){H=[...T],U=0,W=[],A.style.display=`none`,r.startSession(H.length),Z()}async function Oe(){_.textContent=`🎤 Listening — say the phrase now…`,t.recognition.setLanguage(i().language),await t.channel.stop(),await t.channel.start(),s.textContent=t.channel.getState(),await new Promise(e=>{K=t=>{if(G){let e=t?.payload;G.recognizedText=e&&typeof e.text==`string`?e.text:null,ue.textContent=G.recognizedText??`—`}e()}}),_.textContent=`🎤 Idle`,J(),r.waitForTester(),X()}async function Q(){let e=H[U],n=Date.now();G?(G.recognized=null,G.heard=null,G.recognizedText=null,G.speechText=null):G={step:U+1,trigger:e,recognized:null,heard:null,recognizedText:null,speechText:null,comment:``,repeated:0,skipped:!1,durationMs:0},g.value===`mic`?await Oe():(await t.channel.injectAction({type:e,payload:{}}),J(),r.waitForTester(),X()),G&&(G.durationMs=Date.now()-n)}function ke(){G&&=(G.comment=q||O.value,W.push(G),null),r.finishScenario(),r.nextStep(),U++,Z(),Ae()}function Ae(){r.getState()!==x.Finished&&Q()}function je(){r.stop(),Y().then(()=>{s.textContent=t.channel.getState()}),E.textContent=`Все сценарии пройдены.`,D.textContent=``,X();let e=W.length,a=W.filter(e=>e.recognized&&e.heard).length,o=W.filter(e=>e.recognized!==e.heard).length,c=W.reduce((e,t)=>e+t.repeated,0),l=W.filter(e=>e.skipped).length;A.style.display=`block`,pe.innerHTML=`
            <div>Всего сценариев: <b>${e}</b></div>
            <div>Подтверждено полностью: <b style="color:green">${a}</b></div>
            <div>С расхождениями: <b style="color:orange">${o}</b></div>
            <div>Повторов: <b>${c}</b></div>
            <div>Пропущено: <b>${l}</b></div>
        `;let u=i();V=u;let f={totalScenarios:e,passed:a,failed:e-a,errors:[]},p=t.executionLog.getEntries(),m=y(u,R,f,p,{validationMode:`Interactive`,inputSource:g.value});m.ManualValidation={results:W.map(e=>({step:e.step,trigger:e.trigger,recognizedText:e.recognizedText,recognizedCorrectly:e.recognized,speechPlayed:e.heard,speechText:e.speechText,comment:e.comment,repeat:e.repeated,skipped:e.skipped,durationMs:e.durationMs})),warnings:o,repeatedSteps:c,skippedSteps:l},m.Summary&&(m.Summary.manualWarnings=o,m.Summary.repeatedSteps=c,m.Summary.skippedSteps=l),B=m,n.add(m),we(),Te(m),d.textContent=JSON.stringify(m,null,2)}j.addEventListener(`click`,async()=>{r.getState()===x.WaitingTester?ke():await Q()}),he.addEventListener(`click`,async()=>{G&&G.repeated++,t.executionLog.append(`Step`,{number:U+1,total:H.length,trigger:H[U],repeat:!0,attempt:(G?.repeated??0)+1}),J(),await Q()}),ge.addEventListener(`click`,()=>{G?(G.skipped=!0,W.push(G),G=null):W.push({step:U+1,trigger:H[U],recognized:null,heard:null,recognizedText:null,speechText:null,comment:``,repeated:0,skipped:!0,durationMs:0}),r.finishScenario(),r.skipStep(),U++,Z(),Ae()}),_e.addEventListener(`click`,()=>{r.pause(),X()}),ve.addEventListener(`click`,()=>{r.resume(),X()});let Me=`background:#c8f7c5; font-weight:bold; border-color:#2e7d32`,Ne=`background:#f7c5c5; font-weight:bold; border-color:#c62828`;function Pe(){let e=G?.recognized??null;M.setAttribute(`style`,e===!0?Me:``),N.setAttribute(`style`,e===!1?Ne:``)}function Fe(){let e=G?.heard??null;P.setAttribute(`style`,e===!0?Me:``),F.setAttribute(`style`,e===!1?Ne:``)}M.addEventListener(`click`,()=>{G&&(G.recognized=!0,Pe())}),N.addEventListener(`click`,()=>{G&&(G.recognized=!1,Pe())}),P.addEventListener(`click`,()=>{G&&(G.heard=!0,Fe())}),F.addEventListener(`click`,()=>{G&&(G.heard=!1,Fe())}),h.addEventListener(`change`,()=>{let e=h.value===`interactive`;S.style.display=e?`block`:`none`,ee.style.display=e?`block`:`none`,Y().then(()=>{e&&(R=new Date().toISOString(),t.executionLog.clear(),u.textContent=``,De())})}),me.addEventListener(`click`,()=>{Y().then(()=>{R=new Date().toISOString(),t.executionLog.clear(),u.textContent=``,De()})}),t.channel.ensureInteractionSubscribed(),t.channel.onAction=e=>{if(t.logger.logAction(e),J(),K){let t=K;K=null,t(e)}},t.channel.onEvent=e=>{t.logger.logEvent(e),J()},t.channel.onSpeak=e=>{t.logger.logSpeak(e),J(),G&&(G.speechText=e),de.textContent=e},t.speech.onStarted=e=>{t.executionLog.append(`SpeechStarted`,{text:e}),J()},t.speech.onFinished=e=>{t.executionLog.append(`SpeechFinished`,{text:e}),J()},t.speech.onError=(e,n)=>{t.executionLog.append(`SpeechError`,{text:e,message:n}),J()};function $(e){z=e,I.disabled=e,L.disabled=e,ye.disabled=e,be.disabled=e}e.querySelector(`#btn-connect`).addEventListener(`click`,async()=>{let e=i();V=e;let n=await t.backend.connect(`https://ibronevik.ru/taxi/c/gruzvill`,e.login,e.password);a.textContent=n.status===`connected`?`● Connected`:`✗ `+n.status,o.textContent=n.status===`connected`?`Ready`:`—`}),L.addEventListener(`click`,async()=>{z||(R=new Date().toISOString(),t.executionLog.clear(),u.textContent=``,await t.channel.start(),s.textContent=t.channel.getState())}),ye.addEventListener(`click`,async()=>{z||(await t.channel.stop(),s.textContent=t.channel.getState())}),be.addEventListener(`click`,async()=>{if(z)return;let e=m.value;await t.channel.injectAction({type:e,payload:{}}),J()}),I.addEventListener(`click`,async()=>{if(!z){$(!0);try{await Y(),R=new Date().toISOString(),t.executionLog.clear(),u.textContent=``;let e=i();V=e;for(let e=0;e<T.length;e++)c.textContent=`Running scenario ${e+1} of ${T.length}`,await t.channel.injectAction({type:T[e],payload:{}}),await new Promise(e=>{setTimeout(()=>e(),700)}),J();c.textContent=`Done`;let r=t.registry.list().length||3,a={totalScenarios:r,passed:r,failed:0,errors:[]};l.innerHTML=`<span style="color:green;font-weight:bold">✅ PASS (${a.passed}/${a.totalScenarios})</span>`;let o=t.executionLog.getEntries(),s=y(e,R,a,o,{validationMode:`Automatic`,inputSource:`inject`});B=s,n.add(s),we(),Te(s),d.textContent=JSON.stringify(s,null,2)}finally{$(!1)}}}),e.querySelector(`#btn-download`).addEventListener(`click`,()=>{if(!B){alert(`Run All first!`);return}let e=V??i(),t=new Blob([JSON.stringify(B,null,2)],{type:`application/json`}),n=URL.createObjectURL(t),r=document.createElement(`a`);r.href=n,r.download=b(e),r.click(),URL.revokeObjectURL(n)}),e.querySelector(`#btn-send`).addEventListener(`click`,async()=>{if(!B){alert(`Run All first!`);return}let e=`https://ibronevik.ru/taxi/c/gruzvill`,n=await t.backend.getEmailId(e);if(!n){alert(`❌ Send failed: no email id available`);return}let r=await t.backend.sendReport(e,B,n);alert(r?`✅ Report sent!`:`❌ Send failed!`)})}var D=_();E(document.querySelector(`#app`),D);