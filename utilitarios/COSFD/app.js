// Configuração do Cliente Supabase
const supabaseUrl = 'https://nbogqyaicjpwkdyyejko.supabase.co';
const supabaseKey = 'sb_publishable_Q3g-QjKJW8WcgC9bgly2Bg_-hEI1deg';
let supabaseClient = null;
if (typeof supabase !== 'undefined') {
    supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);
}

let currentUser = null;
let currentUserProfile = null;

// Auth Forms DOM Elements
const authOverlay = document.getElementById('auth-overlay');
const formLogin = document.getElementById('form-login');
const formRegister = document.getElementById('form-register');
const formForgot = document.getElementById('form-forgot');
const formUpdatePassword = document.getElementById('form-update-password');
const authPending = document.getElementById('auth-pending');
const pendingEmail = document.getElementById('pending-user-email');
const btnLogout = document.getElementById('btn-logout');
const btnAuthLogout = document.getElementById('btn-auth-logout');

const linkGoToRegister = document.getElementById('link-go-to-register');
const linkGoToLogin = document.getElementById('link-go-to-login');
const linkGoToForgot = document.getElementById('link-go-to-forgot');
const linkForgotToLogin = document.getElementById('link-forgot-to-login');

async function checkSession() {
    if (!supabaseClient) return;

    const isRecovery = window.location.hash.includes("type=recovery");

    supabaseClient.auth.onAuthStateChange(async (event, session) => {
        if (event === "PASSWORD_RECOVERY" || isRecovery) {
            showAuthForm("update-password");
        } else if (session) {
            currentUser = session.user;
            await fetchProfileAndSetupUI(session.user);
        } else {
            currentUser = null;
            currentUserProfile = null;
            showAuthForm("login");
        }
    });

    const { data: { session }, error } = await supabaseClient.auth.getSession();
    if (isRecovery) {
        showAuthForm("update-password");
    } else if (session) {
        currentUser = session.user;
        await fetchProfileAndSetupUI(session.user);
    } else {
        showAuthForm("login");
    }
}

async function fetchProfileAndSetupUI(user) {
    if (!supabaseClient) return;
    if (window.location.hash.includes("type=recovery")) {
        showAuthForm("update-password");
        return;
    }
    const { data, error } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
    
    if (error || !data) {
        await supabaseClient.auth.signOut();
        showAuthForm("login");
        return;
    }
    
    currentUserProfile = data;
    const now = new Date();
    const isExpired = data.expires_at_sfd ? new Date(data.expires_at_sfd) < now : false;
    
    // Verificação de permissão específica para o Copiloto SFD
    const isApprovedSFD = (data.is_aproved_sfd === true);
    
    if (!isApprovedSFD || isExpired) {
        const customMsg = isExpired ? "Sua licença de acesso ao Copiloto SFD expirou." : "Seu cadastro foi realizado, mas precisa ser aprovado pelo administrador para acessar o <b>Copiloto SFD</b>.";
        showAuthForm("pending", user.email, customMsg, isExpired);
    } else {
        hideAuthOverlay();
    }
}

function showAuthForm(view, email = "", customMsg = "", isExpired = false) {
    if (authOverlay) authOverlay.style.display = "flex";
    
    if (formLogin) formLogin.style.display = (view === "login") ? "flex" : "none";
    if (formRegister) formRegister.style.display = (view === "register") ? "flex" : "none";
    if (formForgot) formForgot.style.display = (view === "forgot") ? "flex" : "none";
    if (formUpdatePassword) formUpdatePassword.style.display = (view === "update-password") ? "flex" : "none";
    if (authPending) authPending.style.display = (view === "pending") ? "flex" : "none";
    
    if (view === "pending") {
        if (pendingEmail) pendingEmail.textContent = email;
        const pendingMsgEl = authPending.querySelector("p");
        if (pendingMsgEl && customMsg) pendingMsgEl.innerHTML = customMsg;
        
        const icon = authPending.querySelector("i");
        const h3 = authPending.querySelector("h3");
        
        if (isExpired) {
            if (icon) {
                icon.className = "fa-solid fa-hourglass-end";
                icon.style.color = "var(--danger)";
            }
            if (h3) h3.textContent = "Acesso Expirado";
        } else {
            if (icon) {
                icon.className = "fa-solid fa-clock-rotate-left";
                icon.style.color = "var(--accent)";
            }
            if (h3) h3.textContent = "Acesso Pendente";
        }
    }
}

function hideAuthOverlay() {
    if (authOverlay) authOverlay.style.display = "none";
}

// Bind Auth UI Event Listeners
if (linkGoToRegister) {
    linkGoToRegister.addEventListener("click", (e) => {
        e.preventDefault();
        showAuthForm("register");
    });
}

if (linkGoToLogin) {
    linkGoToLogin.addEventListener("click", (e) => {
        e.preventDefault();
        showAuthForm("login");
    });
}

if (linkGoToForgot) {
    linkGoToForgot.addEventListener("click", (e) => {
        e.preventDefault();
        showAuthForm("forgot");
    });
}

if (linkForgotToLogin) {
    linkForgotToLogin.addEventListener("click", (e) => {
        e.preventDefault();
        showAuthForm("login");
    });
}

if (formLogin) {
    formLogin.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;
        
        const btnSubmit = formLogin.querySelector("button[type='submit']");
        btnSubmit.disabled = true;
        btnSubmit.textContent = "Entrando...";

        const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
        
        btnSubmit.disabled = false;
        btnSubmit.textContent = "Entrar";

        if (error) {
            alert("Erro de login: " + error.message);
        } else {
            currentUser = data.user;
            await fetchProfileAndSetupUI(data.user);
        }
    });
}

if (formRegister) {
    formRegister.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("register-email").value;
        const password = document.getElementById("register-password").value;
        
        const btnSubmit = formRegister.querySelector("button[type='submit']");
        btnSubmit.disabled = true;
        btnSubmit.textContent = "Enviando solicitação...";

        const { data, error } = await supabaseClient.auth.signUp({ email, password });
        
        btnSubmit.disabled = false;
        btnSubmit.textContent = "Solicitar Cadastro";

        if (error) {
            alert("Erro ao cadastrar: " + error.message);
        } else {
            alert("Solicitação de cadastro realizada! O administrador precisa aprovar o seu acesso ao Copiloto SFD antes de você poder entrar.");
            showAuthForm("login");
        }
    });
}

if (formForgot) {
    formForgot.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("forgot-email").value;
        const btnSubmit = formForgot.querySelector("button[type='submit']");
        btnSubmit.disabled = true;
        btnSubmit.textContent = "Enviando link...";

        const { data, error } = await supabaseClient.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.href
        });

        btnSubmit.disabled = false;
        btnSubmit.textContent = "Enviar Link de Recuperação";

        if (error) {
            alert("Erro ao solicitar redefinição: " + error.message);
        } else {
            alert("As instruções de redefinição de senha foram enviadas para o seu e-mail com sucesso! Verifique sua caixa de entrada e spam.");
            showAuthForm("login");
        }
    });
}

if (formUpdatePassword) {
    formUpdatePassword.addEventListener("submit", async (e) => {
        e.preventDefault();
        const newPassword = document.getElementById("update-password-input").value;
        const btnSubmit = formUpdatePassword.querySelector("button[type='submit']");
        btnSubmit.disabled = true;
        btnSubmit.textContent = "Atualizando senha...";

        const { error } = await supabaseClient.auth.updateUser({ password: newPassword });

        btnSubmit.disabled = false;
        btnSubmit.textContent = "Salvar Nova Senha";

        if (error) {
            alert("Erro ao redefinir senha: " + error.message);
        } else {
            alert("Senha redefinida com sucesso! Você já pode entrar com sua nova senha.");
            window.location.hash = "";
            showAuthForm("login");
        }
    });
}

if (btnAuthLogout) {
    btnAuthLogout.addEventListener("click", async () => {
        await supabaseClient.auth.signOut();
        currentUser = null;
        currentUserProfile = null;
        showAuthForm("login");
    });
}

if (btnLogout) {
    btnLogout.addEventListener("click", async () => {
        if (confirm("Deseja sair da sua conta?")) {
            await supabaseClient.auth.signOut();
            currentUser = null;
            currentUserProfile = null;
            showAuthForm("login");
        }
    });
}

// Start Auth Session Check
checkSession();

// DOM Elements
const tituloInput = document.getElementById('titulo-input');
const descricaoInput = document.getElementById('descricao-input');
const impactosInput = document.getElementById('impactos-input');
const classificacaoSelect = document.getElementById('classificacao-select');
const btnClearFields = document.getElementById('btn-clear-fields');
const liteModeToggle = document.getElementById('lite-mode-toggle');

const tituloWordCount = document.getElementById('titulo-word-count');
const descricaoWordCount = document.getElementById('descricao-word-count');
const impactosWordCount = document.getElementById('impactos-word-count');

const btnApiToggle = document.getElementById('btn-api-toggle');
const btnAvaliarIa = document.getElementById('btn-avaliar-ia');
const apiPanel = document.getElementById('api-panel');
const apiKeyInput = document.getElementById('api-key-input');
const btnSaveKey = document.getElementById('btn-save-key');
const modelSelect = document.getElementById('model-select');

const btnConfigureShortcut = document.querySelector('.btn-configure-shortcut');
const btnRetryEval = document.getElementById('btn-retry-eval');

// IA States UI
const iaStateNoKey = document.getElementById('ia-state-no-key');
const iaStatePrompt = document.getElementById('ia-state-prompt');
const iaStateLoading = document.getElementById('ia-state-loading');
const iaStateResults = document.getElementById('ia-state-results');
const iaStateError = document.getElementById('ia-state-error');
const iaOutputContainer = document.getElementById('ia-output-container');
const apiErrorMessage = document.getElementById('api-error-message');

// Core System Instruction to enforce constraints on the clone behavior
const CLONE_SYSTEM_INSTRUCTION = `Você é o clone exato da conversa do AI Studio sobre Sementes de Futuro (SF). Seu papel é avaliar o novo rascunho de semente de futuro com base nos mesmos critérios, rigor, tom e estrutura de seções demonstrados ao longo do histórico da conversa.

DIRETRIZ DE TOM E EMPATIA (ESSENCIAL):
Embora você deva manter o mesmo rigor metodológico e exatidão taxonômica da conversa original, o seu tom de feedback deve ser estritamente profissional, respeitoso, construtivo e pedagógico.
- NUNCA use termos depreciativos, ofensivos ou sarcásticos (por exemplo, jamais compare o texto do autor a uma "redação escolar", "redação de colégio" ou expressões de teor amador).
- Trate o redator como um profissional em desenvolvimento: aponte os erros e incoerências com clareza conceitual e polidez, indicando de forma neutra o que precisa ser ajustado e por quê.

DIRETRIZ DE PRECISÃO E JUSTIÇA (ESSENCIAL):
- Seja justo, equilibrado e realista. Se a Semente de Futuro rascunhada estiver correta, coerente e perfeitamente alinhada com as diretrizes do manual, aprove-a explicitamente.
- NÃO invente erros ou force críticas negativas onde não existem desvios conceituais apenas para preencher o relatório. Se uma seção (TI, PD ou ID) estiver excelente, elogie o acerto e valide-a como conforme.
- Forneça críticas apenas para desvios reais (como uso de termos de recomendação in ID ou desalinhamento da categoria com o título). Se o texto for bom, dê apenas sugestões opcionais de polimento.
- NUNCA cite nominalmente o autor do manual ou o manual em si (ex: evite expressamente termos como "segundo Janick (2026)", "conforme Janick (2026)", "segundo o manual", etc.). Faça a análise conceitual de forma direta e natural, sem fazer citações acadêmicas ou referências bibliográficas redundantes.

DIRETRIZ DE ORIENTAÇÃO PRÁTICA E DIRETIVA (ESSENCIAL):
- Quando identificar erros graves ou rascunhos insatisfatórios, evite pareceres puramente acadêmicos, abstratos ou teóricos demais.
- Forneça orientações altamente práticas e caminhos de resolução claros, mostrando com precisão o que o autor deve fazer para ajustar o texto (ex: indique qual trecho específico gera a incoerência e dê a receita de como substituí-lo conceitualmente).
- Explique o "como fazer" de forma didática e estrutural, mas NUNCA dê a frase pronta ou reescreva qualquer trecho no lugar do redator.

REGRA CRÍTICA DE SEGURANÇA (LEI ABSOLUTA):
Você JAMAIS deve reescrever o texto, sugerir frases corrigidas ou parágrafos prontos para o autor. Se no histórico de conversa você reescreveu textos em algum momento, desconsidere esse comportamento a partir de agora. Você deve apenas apontar erros e desvios conceituais, sugerir a direção de correção e justificar teoricamente. O texto final deve ser inteiramente redigido pelo próprio autor.

FORMATO E ESTILO OBRIGATÓRIOS DA RESPOSTA:
Sua resposta deve seguir exatamente a estrutura, tom editorial, objetividade e o estilo de notas (ex: OK, NÃO OK, 0/1, 0.5/1) demonstrados no exemplo de referência abaixo. Adapte os argumentos ao rascunho enviado pelo usuário, mas reproduza fielmente este modelo:

---

# Avaliação da Matéria

### **Título (TI):**
*   **[Avaliação, ex: NÃO OK (0/1) ou OK (1/1)]**: [Justificativa objetiva da avaliação e exemplo de direção correta, ex: "O título é vago e metafórico. Um título de Tendência de Peso deve ser uma afirmação direta sobre o fenômeno (ex: 'Escalada de Gastos Militares...')"]

### **Parágrafo Descritivo (PD):**
*   **[Avaliação, ex: OK, MAS DESVIADO (0.5/1) ou OK (1/1)]**: [Análise direta dos dados factuais e do foco temático, apontando se o texto derivou para discussões alheias à Defesa/Estratégia]

### **Impactos Futuros em Defesa (ID):**
*   **[Avaliação, ex: NÃO OK (0/1) - REPETIÇÃO DO ERRO ou OK (1/1)]**: [Análise objetiva listando os desvios práticos detectados no manual. Exemplo:]
    *   **Altamente Prescritivo**: [Aponte termos recomendatórios ou de conselho e explique por que violam as regras]
    *   **Ausência de Projeção de Consequências**: [Explique o que faltou projetar sobre o Brasil/Defesa]
    *   **Linguagem Editorial**: [Aponte se o tom está emotivo ou de manifesto]

### **Semente de Futuro (SF) - Classificação:**
*   **[Avaliação, ex: CORRETO ou INCORRETO]**: [Valide a categoria e comente se o texto capturou o conceito central (ex: inércia para TP, novidade para FPF, etc.)]

---

# Nota para os Autores:
"[Parágrafo explicativo e acolhedor fundamentando a decisão metodológica.]

Para ser aprovada, a matéria deve:
*   [Ponto 1 de ação clara para correção]
*   [Ponto 2 de ação clara para correção]"`;

// Settings persistence
let geminiApiKey = localStorage.getItem('gemini_api_key') || '';
let geminiModel = localStorage.getItem('gemini_model') || 'gemini-2.5-flash';
let geminiLiteMode = localStorage.getItem('gemini_lite_mode') !== 'false'; // Default is true (Lite)

if (geminiApiKey) {
    apiKeyInput.value = geminiApiKey;
    modelSelect.value = geminiModel;
    liteModeToggle.checked = geminiLiteMode;
    updateIaState(true);
} else {
    liteModeToggle.checked = geminiLiteMode;
    updateIaState(false);
}

// Persist choice immediately when toggle changes
liteModeToggle.addEventListener('change', () => {
    localStorage.setItem('gemini_lite_mode', liteModeToggle.checked);
});

// Reconstructed chat history representing the actual conversation context
let originalChatHistory = [];

// Load the raw conversation log and parse it chronologically supporting multiple formats
fetch('LSC - Avaliação SFD')
    .then(res => res.json())
    .then(jsonData => {
        if (jsonData.contents && Array.isArray(jsonData.contents)) {
            // Standard API contents format (copied directly from "Get Code" -> cURL payload)
            originalChatHistory = jsonData.contents;
            console.log(`Sucesso: ${originalChatHistory.length} mensagens carregadas (formato cURL JSON).`);
        } else if (jsonData.chunkedPrompt && jsonData.chunkedPrompt.chunks) {
            // Chunked prompt format (original chat log export)
            const chunks = jsonData.chunkedPrompt.chunks;
            chunks.forEach(chunk => {
                const role = chunk.role;
                if (chunk.isThought) return; // Skip thoughts
                
                let text = chunk.text || (chunk.parts && chunk.parts.map(p => p.text).join('')) || "";
                if (!text.trim() && !chunk.driveDocument) return;
                
                if (chunk.driveDocument) {
                    text = `[Drive Document: ${chunk.driveDocument.id}]`;
                }
                
                originalChatHistory.push({
                    role: role === 'model' ? 'model' : 'user',
                    parts: [{ text: text.trim() }]
                });
            });
            console.log(`Sucesso: ${originalChatHistory.length} mensagens carregadas (formato original Google AI Studio).`);
        } else if (Array.isArray(jsonData)) {
            // Raw list of messages
            originalChatHistory = jsonData;
            console.log(`Sucesso: ${originalChatHistory.length} mensagens carregadas (formato array direto).`);
        } else {
            console.warn('Formato de dados desconhecido no arquivo LSC - Avaliação SFD.');
        }
    })
    .catch(err => {
        console.error('Erro ao carregar o arquivo LSC - Avaliação SFD:', err);
    });

// API Settings listeners
btnApiToggle.addEventListener('click', () => {
    apiPanel.classList.toggle('hidden');
});

if (btnConfigureShortcut) {
    btnConfigureShortcut.addEventListener('click', () => {
        apiPanel.classList.remove('hidden');
        apiKeyInput.focus();
    });
}

btnSaveKey.addEventListener('click', () => {
    const key = apiKeyInput.value.trim();
    const selectedModel = modelSelect.value;
    const selectedLiteMode = liteModeToggle.checked;
    if (key) {
        localStorage.setItem('gemini_api_key', key);
        localStorage.setItem('gemini_model', selectedModel);
        localStorage.setItem('gemini_lite_mode', selectedLiteMode);
        geminiApiKey = key;
        alert('Configurações salvas localmente!');
        apiPanel.classList.add('hidden');
        updateIaState(true);
    } else {
        localStorage.removeItem('gemini_api_key');
        localStorage.removeItem('gemini_model');
        localStorage.removeItem('gemini_lite_mode');
        geminiApiKey = '';
        alert('Configurações removidas.');
        updateIaState(false);
    }
});

function updateIaState(hasKey) {
    iaStateNoKey.classList.remove('active');
    iaStatePrompt.classList.remove('active');
    iaStateLoading.classList.remove('active');
    iaStateResults.classList.remove('active');
    iaStateError.classList.remove('active');
    
    if (hasKey) {
        iaStatePrompt.classList.add('active');
        btnAvaliarIa.removeAttribute('disabled');
    } else {
        iaStateNoKey.classList.add('active');
        btnAvaliarIa.setAttribute('disabled', 'true');
    }
}

// Calculate word counts
function getWordCount(str) {
    const cleaned = str.trim().replace(/\s+/g, ' ');
    return cleaned === '' ? 0 : cleaned.split(' ').length;
}

// Simple listeners to update word badge elements
tituloInput.addEventListener('input', () => {
    const count = getWordCount(tituloInput.value);
    tituloWordCount.textContent = `${count} ${count === 1 ? 'palavra' : 'palavras'}`;
});

descricaoInput.addEventListener('input', () => {
    const count = getWordCount(descricaoInput.value);
    descricaoWordCount.textContent = `${count} ${count === 1 ? 'palavra' : 'palavras'}`;
});

impactosInput.addEventListener('input', () => {
    const count = getWordCount(impactosInput.value);
    impactosWordCount.textContent = `${count} ${count === 1 ? 'palavra' : 'palavras'}`;
});

// Trigger evaluation connecting to Gemini passing the exact conversation history clone
btnAvaliarIa.addEventListener('click', async () => {
    const titleVal = tituloInput.value.trim();
    const descVal = descricaoInput.value.trim();
    const impVal = impactosInput.value.trim();
    const classVal = classificacaoSelect.value;
    const classText = classificacaoSelect.options[classificacaoSelect.selectedIndex] ? classificacaoSelect.options[classificacaoSelect.selectedIndex].text : classVal;
    
    if (!titleVal || !descVal || !impVal || !classVal) {
        alert('Por favor, preencha o Título, Parágrafo Descritivo, Impactos em Defesa e selecione a Classificação.');
        return;
    }
    
    // UI state loading
    iaStatePrompt.classList.remove('active');
    iaStateResults.classList.remove('active');
    iaStateError.classList.remove('active');
    iaStateLoading.classList.add('active');
    
    // Build user prompt representation
    const userPrompt = `### NOVO RASCUNHO A SER AVALIADO COMO UM TODO SISTÊMICO:
- **TÍTULO PROPOSTO**: "${titleVal}"
- **CLASSIFICAÇÃO SUGERIDA**: "${classText}"

- **PARÁGRAFO DESCRITIVO (PD)**:
"${descVal}"

- **IMPACTOS FUTUROS EM DEFESA (ID)**:
"${impVal}"

### SOLICITAÇÃO:
Avalie este rascunho de Semente de Futuro seguindo o tom, rigor e os critérios metodológicos demonstrados no histórico da nossa conversa. Aponte erros e direções de aprimoramento. Lembre-se: sob NENHUMA hipótese reescreva o texto ou forneça parágrafos prontos.`;

    // Restore conversation history (Full or Lite depending on UI toggle)
    let requestContents = [];
    if (originalChatHistory && originalChatHistory.length > 0) {
        if (liteModeToggle.checked) {
            // Send history dynamically limited to ~100,000 tokens (approx. 400,000 characters) to fit within free tier limits
            let totalChars = 0;
            const maxChars = 400000; // ~100,000 tokens safety threshold
            
            for (let i = originalChatHistory.length - 1; i >= 0; i--) {
                const msg = originalChatHistory[i];
                const text = msg.parts?.[0]?.text || "";
                totalChars += text.length;
                if (totalChars > maxChars) {
                    break;
                }
                // Insert at the beginning to maintain chronological order
                requestContents.unshift(msg);
            }
            console.log(`Modo Lite ativado: enviando histórico limitado de ${requestContents.length} mensagens.`);
        } else {
            requestContents = [...originalChatHistory];
            console.log(`Modo Completo (Full) ativado: enviando histórico completo de ${requestContents.length} mensagens.`);
        }
    }
    
    // Append the new request at the end of the full history
    requestContents.push({
        role: 'user',
        parts: [{ text: userPrompt }]
    });

    try {
        const selectedModel = modelSelect.value;
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${geminiApiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: requestContents,
                systemInstruction: {
                    parts: [
                        {
                            text: CLONE_SYSTEM_INSTRUCTION
                        }
                    ]
                },
                generationConfig: {
                    temperature: 1.0,
                    topP: 0.95,
                    maxOutputTokens: 4096
                }
            })
        });
        
        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error?.message || `HTTP ${response.status}`);
        }
        
        const data = await response.json();
        const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (!responseText) {
            throw new Error('A API retornou uma resposta vazia.');
        }
        
        // Render markdown
        iaOutputContainer.innerHTML = marked.parse(responseText);
        
        // Display results
        iaStateLoading.classList.remove('active');
        iaStateResults.classList.add('active');
        
    } catch (error) {
        console.error('Gemini API Error:', error);
        apiErrorMessage.textContent = `Erro ao comunicar com o Gemini: ${error.message}. Verifique as configurações de API Key e tente novamente.`;
        iaStateLoading.classList.remove('active');
        iaStateError.classList.add('active');
    }
});

if (btnClearFields) {
    btnClearFields.addEventListener('click', () => {
        tituloInput.value = '';
        descricaoInput.value = '';
        impactosInput.value = '';
        classificacaoSelect.value = '';
        
        // Reset word counts
        tituloWordCount.textContent = '0 palavras';
        descricaoWordCount.textContent = '0 palavras';
        impactosWordCount.textContent = '0 palavras';
        
        // Return diagnostics panel to initial prompt state
        if (geminiApiKey) {
            updateIaState(true);
        } else {
            updateIaState(false);
        }
    });
}

btnRetryEval.addEventListener('click', () => {
    btnAvaliarIa.click();
});

// Theme Toggle Logic
const btnToggleTheme = document.getElementById("btn-toggle-theme");
if (btnToggleTheme) {
    const savedTheme = localStorage.getItem("theme") || "light";
    if (savedTheme === "dark") {
        document.body.classList.add("dark-theme");
        updateThemeToggleUI("dark");
    } else {
        updateThemeToggleUI("light");
    }
    
    btnToggleTheme.addEventListener("click", () => {
        const isCurrentlyDark = document.body.classList.contains("dark-theme");
        if (isCurrentlyDark) {
            document.body.classList.remove("dark-theme");
            localStorage.setItem("theme", "light");
            updateThemeToggleUI("light");
        } else {
            document.body.classList.add("dark-theme");
            localStorage.setItem("theme", "dark");
            updateThemeToggleUI("dark");
        }
    });
}

function updateThemeToggleUI(theme) {
    const btn = document.getElementById("btn-toggle-theme");
    if (!btn) return;
    const icon = btn.querySelector("i");
    const textSpan = btn.querySelector("#theme-btn-text");
    if (theme === "light") {
        icon.className = "fa-regular fa-moon";
        textSpan.textContent = "Tema Escuro";
    } else {
        icon.className = "fa-regular fa-sun";
        textSpan.textContent = "Tema Claro";
    }
}
