// Configuração do Cliente Supabase
const supabaseUrl = 'https://nbogqyaicjpwkdyyejko.supabase.co';
const supabaseKey = 'sb_publishable_Q3g-QjKJW8WcgC9bgly2Bg_-hEI1deg';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

let currentUser = null;
let currentUserProfile = null;

// Estado Global da Aplicação
let nEventos = 5;
let nSimulacoes = 10000;
let events = [];
let matrixOcorrencia = [];
let matrixNaoOcorrencia = [];

// Resultados da última simulação
let simResults = {
    raw: [],      // { index: number, outcomes: Array, order: Array }
    ranking: [],  // { binaryString: string, count: number, percentage: number }
    eventSimProbs: [] // Array de probabilidades simuladas finais
};

// Dados da simulação de eixos ortogonais
let orthoRoundsData = [];

// Paginação dos logs brutos
let currentLogPage = 1;
const LOGS_PER_PAGE = 100;

// Gráficos (Chart.js)
let chartProbabilities = null;
let chartScenarios = null;

// Inicialização ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
    initApp();
    setupEventListeners();
});

// Inicializa a aplicação com valores padrão
function initApp() {
    // Carrega o cenário inicial vazio
    loadDefaultBlankState();
    
    // Inicializar tema a partir do localStorage
    const savedTheme = localStorage.getItem("theme") || "dark";
    if (savedTheme === "light") {
        document.body.classList.add("light-theme");
        updateThemeToggleUI("light");
    } else {
        updateThemeToggleUI("dark");
    }

    // Inicializar verificação de sessão de usuário
    checkSession();
}

// Carrega o estado padrão em branco (vazio)
function loadDefaultBlankState() {
    nEventos = 5;
    nSimulacoes = 10000;
    
    document.getElementById("nEventos").value = nEventos;
    document.getElementById("nSimulacoes").value = nSimulacoes;

    events = [];
    for (let i = 0; i < nEventos; i++) {
        events.push({
            id: i + 1,
            name: "", // Vazio para o usuário digitar
            probInicial: 0.5,
            forceState: 0,
            order: 0
        });
    }

    matrixOcorrencia = [];
    matrixNaoOcorrencia = [];
    for (let r = 0; r < nEventos; r++) {
        let rowO = [];
        let rowNO = [];
        for (let c = 0; c < nEventos; c++) {
            rowO.push(1.0);
            rowNO.push(1.0);
        }
        matrixOcorrencia.push(rowO);
        matrixNaoOcorrencia.push(rowNO);
    }

    renderEventsTable();
    renderMatrix("ocorrencia");
    renderMatrix("nao-ocorrencia");
}

// Alterna entre os temas Claro e Escuro
function toggleTheme() {
    const isCurrentlyLight = document.body.classList.contains("light-theme");
    if (isCurrentlyLight) {
        document.body.classList.remove("light-theme");
        localStorage.setItem("theme", "dark");
        updateThemeToggleUI("dark");
    } else {
        document.body.classList.add("light-theme");
        localStorage.setItem("theme", "light");
        updateThemeToggleUI("light");
    }
    
    // Atualizar cores dos gráficos ativos
    updateChartThemeColors();
}

// Atualiza o ícone e título do botão de alternância de tema
function updateThemeToggleUI(theme) {
    const btn = document.getElementById("btn-toggle-theme");
    if (!btn) return;
    const icon = btn.querySelector("i");
    const textSpan = document.getElementById("theme-btn-text");
    
    if (theme === "light") {
        if (icon) icon.className = "fa-solid fa-moon";
        if (textSpan) textSpan.textContent = "Modo Escuro";
        btn.setAttribute("title", "Mudar para Modo Escuro");
    } else {
        if (icon) icon.className = "fa-solid fa-sun";
        if (textSpan) textSpan.textContent = "Modo Claro";
        btn.setAttribute("title", "Mudar para Modo Claro");
    }
}

// Atualiza as cores do Chart.js dinamicamente para manter o contraste legível
function updateChartThemeColors() {
    if (!chartProbabilities || !chartScenarios) return;

    const isLight = document.body.classList.contains("light-theme");
    const textColor = isLight ? "#0F172A" : "#F3F4F6";
    const secTextColor = isLight ? "#475569" : "#9CA3AF";
    const gridColor = isLight ? "rgba(15, 23, 42, 0.08)" : "rgba(255, 255, 255, 0.05)";
    const initialBarColor = isLight ? "rgba(15, 23, 42, 0.15)" : "rgba(255, 255, 255, 0.15)";
    const initialBarBorder = isLight ? "rgba(15, 23, 42, 0.3)" : "rgba(255, 255, 255, 0.4)";

    // Atualizar cores do gráfico de probabilidades
    chartProbabilities.data.datasets[0].backgroundColor = initialBarColor;
    chartProbabilities.data.datasets[0].borderColor = initialBarBorder;
    chartProbabilities.options.plugins.legend.labels.color = textColor;
    chartProbabilities.options.scales.y.ticks.color = secTextColor;
    chartProbabilities.options.scales.y.grid.color = gridColor;
    chartProbabilities.options.scales.x.ticks.color = secTextColor;
    chartProbabilities.update();

    // Atualizar cores do gráfico de cenários
    chartScenarios.options.scales.x.ticks.color = secTextColor;
    chartScenarios.options.scales.x.grid.color = gridColor;
    chartScenarios.options.scales.y.ticks.color = textColor;
    chartScenarios.update();
}

// Configura os escutadores de eventos globais
function setupEventListeners() {
    // Menu de navegação (Abas)
    const navItems = document.querySelectorAll(".nav-item");
    navItems.forEach(item => {
        item.addEventListener("click", () => {
            const targetId = item.getAttribute("data-target");
            
            // Alternar classe ativa no menu
            navItems.forEach(i => i.classList.remove("active"));
            item.classList.add("active");
            
            // Alternar seções visíveis
            const sections = document.querySelectorAll(".content-section");
            sections.forEach(sec => sec.classList.remove("active"));
            document.getElementById(targetId).classList.add("active");
        });
    });

    // Mudança no número de eventos
    const inputNEventos = document.getElementById("nEventos");
    inputNEventos.addEventListener("change", () => {
        let val = parseInt(inputNEventos.value);
        if (isNaN(val) || val < 2) val = 2;
        if (val > 15) val = 15;
        inputNEventos.value = val;
        
        updateEventCount(val);
    });

    // Mudança no número de simulações
    const inputNSimulacoes = document.getElementById("nSimulacoes");
    inputNSimulacoes.addEventListener("change", () => {
        let val = parseInt(inputNSimulacoes.value);
        if (isNaN(val) || val < 1) val = 1;
        inputNSimulacoes.value = val;
        nSimulacoes = val;
    });

    // Botão de rodar simulação
    document.getElementById("btn-run-simulation").addEventListener("click", runSimulation);

    // Botões de resetar matrizes
    const clearMatrixBtns = document.querySelectorAll(".btn-clear-matrix");
    clearMatrixBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const type = btn.getAttribute("data-matrix");
            resetMatrix(type);
        });
    });



    // Botões de exportação/importação de JSON de parâmetros
    document.getElementById("btn-export-config").addEventListener("click", exportConfigJSON);
    document.getElementById("btn-import-config").addEventListener("click", () => {
        document.getElementById("file-import-input").click();
    });
    document.getElementById("file-import-input").addEventListener("change", importConfigJSON);

    // Botões de exportação/importação do Excel
    const btnImportExcel = document.getElementById("btn-import-excel");
    const fileImportExcelInput = document.getElementById("file-import-excel-input");
    if (btnImportExcel && fileImportExcelInput) {
        btnImportExcel.addEventListener("click", () => {
            fileImportExcelInput.click();
        });
        fileImportExcelInput.addEventListener("change", importConfigExcel);
    }

    // Botão de download do modelo Excel
    const btnDownloadTemplate = document.getElementById("btn-download-template");
    if (btnDownloadTemplate) {
        btnDownloadTemplate.addEventListener("click", downloadExcelTemplate);
    }

    // Botões de exportação de resultados (CSV)
    document.getElementById("btn-export-csv-ranking").addEventListener("click", exportCsvRanking);
    document.getElementById("btn-export-csv-raw").addEventListener("click", exportCsvRawLogs);

    // Paginação de Logs Brutos
    document.getElementById("btn-prev-log-page").addEventListener("click", () => {
        if (currentLogPage > 1) {
            currentLogPage--;
            renderRawLogsTable();
        }
    });
    document.getElementById("btn-next-log-page").addEventListener("click", () => {
        const maxPage = Math.ceil(simResults.raw.length / LOGS_PER_PAGE);
        if (currentLogPage < maxPage) {
            currentLogPage++;
            renderRawLogsTable();
        }
    });

    // Controle de Abas de Tabelas de Resultados
    const resultTabBtns = document.querySelectorAll(".results-tab-btn");
    resultTabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            resultTabBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            
            const targetTab = btn.getAttribute("data-tab");
            document.querySelectorAll(".results-tab-content").forEach(tc => tc.style.display = "none");
            document.getElementById(targetTab).style.display = "block";
        });
    });

    // Alternar tema (Modo Claro / Modo Escuro)
    const btnToggleTheme = document.getElementById("btn-toggle-theme");
    if (btnToggleTheme) {
        btnToggleTheme.addEventListener("click", toggleTheme);
    }

    // Toggle de Eixos Ortogonais
    const checkOrtho = document.getElementById("check-orthogonal-mode");
    const panelOrtho = document.getElementById("orthogonal-selectors-panel");
    const selectOrthoA = document.getElementById("select-ortho-a");
    const selectOrthoB = document.getElementById("select-ortho-b");

    if (checkOrtho && panelOrtho) {
        checkOrtho.addEventListener("change", () => {
            if (checkOrtho.checked) {
                panelOrtho.style.display = "flex";
                populateOrthogonalSelectors();
            } else {
                panelOrtho.style.display = "none";
            }
        });
    }

    if (selectOrthoA && selectOrthoB) {
        selectOrthoA.addEventListener("change", () => {
            if (selectOrthoA.value === selectOrthoB.value) {
                let nextVal = (parseInt(selectOrthoA.value) + 1) % events.length;
                selectOrthoB.value = nextVal;
            }
        });
        selectOrthoB.addEventListener("change", () => {
            if (selectOrthoA.value === selectOrthoB.value) {
                let nextVal = (parseInt(selectOrthoB.value) + 1) % events.length;
                selectOrthoA.value = nextVal;
            }
        });
    }

    // --- EVENTOS DE AUTENTICAÇÃO ---

    // Alternar entre login e cadastro
    const linkGoToRegister = document.getElementById("link-go-to-register");
    if (linkGoToRegister) {
        linkGoToRegister.addEventListener("click", (e) => {
            e.preventDefault();
            showAuthForm("register");
        });
    }

    const linkGoToLogin = document.getElementById("link-go-to-login");
    if (linkGoToLogin) {
        linkGoToLogin.addEventListener("click", (e) => {
            e.preventDefault();
            showAuthForm("login");
        });
    }

    const linkGoToForgot = document.getElementById("link-go-to-forgot");
    if (linkGoToForgot) {
        linkGoToForgot.addEventListener("click", (e) => {
            e.preventDefault();
            showAuthForm("forgot");
        });
    }

    const linkForgotToLogin = document.getElementById("link-forgot-to-login");
    if (linkForgotToLogin) {
        linkForgotToLogin.addEventListener("click", (e) => {
            e.preventDefault();
            showAuthForm("login");
        });
    }

    // Submit de Esqueci a Senha
    const formForgot = document.getElementById("form-forgot");
    if (formForgot) {
        formForgot.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = document.getElementById("forgot-email").value;
            const btnSubmit = formForgot.querySelector("button[type='submit']");
            btnSubmit.disabled = true;
            btnSubmit.textContent = "Enviando link...";

            const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
                redirectTo: window.location.href
            });

            btnSubmit.disabled = false;
            btnSubmit.textContent = "Enviar Link de Recuperação";

            if (error) {
                alert(`Erro ao solicitar recuperação: ${error.message}`);
            } else {
                alert("E-mail de recuperação enviado com sucesso! Verifique a sua caixa de entrada.");
                showAuthForm("login");
            }
        });
    }

    // Submit de Atualização de Senha (via link do e-mail)
    const formUpdatePassword = document.getElementById("form-update-password");
    if (formUpdatePassword) {
        formUpdatePassword.addEventListener("submit", async (e) => {
            e.preventDefault();
            const newPassword = document.getElementById("update-password-input").value;
            const btnSubmit = formUpdatePassword.querySelector("button[type='submit']");
            btnSubmit.disabled = true;
            btnSubmit.textContent = "Salvando nova senha...";

            const { error } = await supabaseClient.auth.updateUser({ password: newPassword });

            btnSubmit.disabled = false;
            btnSubmit.textContent = "Salvar Nova Senha";

            if (error) {
                alert(`Erro ao redefinir senha: ${error.message}`);
            } else {
                if (window.history && window.history.replaceState) {
                    window.history.replaceState("", document.title, window.location.pathname + window.location.search);
                }
                alert("Senha alterada com sucesso! Você já pode fazer login com a sua nova senha.");
                showAuthForm("login");
            }
        });
    }

    // Submit de Login
    const formLogin = document.getElementById("form-login");
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
                alert(`Erro de login: ${error.message}`);
            } else {
                currentUser = data.user;
                await fetchProfileAndSetupUI(data.user);
            }
        });
    }

    // Submit de Cadastro
    const formRegister = document.getElementById("form-register");
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
                alert(`Erro ao cadastrar: ${error.message}`);
            } else {
                alert("Solicitação de cadastro realizada! O administrador precisa aprovar o seu acesso antes de você poder entrar.");
                showAuthForm("login");
            }
        });
    }

    // Logout nas telas
    const btnAuthLogout = document.getElementById("btn-auth-logout");
    if (btnAuthLogout) {
        btnAuthLogout.addEventListener("click", async () => {
            await supabaseClient.auth.signOut();
            currentUser = null;
            currentUserProfile = null;
            showAuthForm("login");
        });
    }

    const navLogout = document.getElementById("nav-item-logout");
    if (navLogout) {
        navLogout.addEventListener("click", async () => {
            if (confirm("Deseja sair da sua conta?")) {
                await supabaseClient.auth.signOut();
                currentUser = null;
                currentUserProfile = null;
                showAuthForm("login");
            }
        });
    }
}

// Atualiza a quantidade de eventos, mantendo dados anteriores se possível
function updateEventCount(newCount) {
    const oldCount = nEventos;
    nEventos = newCount;
    
    // 1. Ajustar array de eventos
    if (newCount > oldCount) {
        // Adicionar novos eventos
        for (let i = oldCount; i < newCount; i++) {
            events.push({
                id: i + 1,
                name: `Evento ${i + 1}`,
                probInicial: 0.5,
                forceState: 0, // Normal
                order: 0 // Aleatório
            });
        }
    } else if (newCount < oldCount) {
        // Remover eventos excedentes
        events = events.slice(0, newCount);
    }

    // 2. Ajustar Matriz Ocorrência
    let newMatO = [];
    for (let r = 0; r < newCount; r++) {
        let row = [];
        for (let c = 0; c < newCount; c++) {
            if (r === c) {
                row.push(1.0); // Diagonal
            } else if (r < oldCount && c < oldCount) {
                row.push(matrixOcorrencia[r][c]); // Preservar antigo
            } else {
                row.push(1.0); // Padrão
            }
        }
        newMatO.push(row);
    }
    matrixOcorrencia = newMatO;

    // 3. Ajustar Matriz Não Ocorrência
    let newMatNO = [];
    for (let r = 0; r < newCount; r++) {
        let row = [];
        for (let c = 0; c < newCount; c++) {
            if (r === c) {
                row.push(1.0); // Diagonal
            } else if (r < oldCount && c < oldCount) {
                row.push(matrixNaoOcorrencia[r][c]); // Preservar antigo
            } else {
                row.push(1.0); // Padrão
            }
        }
        newMatNO.push(row);
    }
    matrixNaoOcorrencia = newMatNO;

    // Renderizar UIs
    renderEventsTable();
    renderMatrix("ocorrencia");
    renderMatrix("nao-ocorrencia");
}

// Reseta uma matriz de impactos para 1.0
function resetMatrix(type) {
    const matrix = (type === "ocorrencia") ? matrixOcorrencia : matrixNaoOcorrencia;
    for (let r = 0; r < nEventos; r++) {
        for (let c = 0; c < nEventos; c++) {
            matrix[r][c] = 1.0;
        }
    }
    renderMatrix(type);
}

// Renderiza a tabela de eventos (Cadastro)
function renderEventsTable() {
    const tbody = document.getElementById("tbody-events");
    tbody.innerHTML = "";

    events.forEach((evt, idx) => {
        const tr = document.createElement("tr");

        // Coluna ID
        const tdId = document.createElement("td");
        tdId.innerHTML = `<span class="event-badge">E${evt.id}</span>`;
        tr.appendChild(tdId);

        // Coluna Nome do Evento
        const tdName = document.createElement("td");
        const inputName = document.createElement("input");
        inputName.type = "text";
        inputName.value = evt.name;
        inputName.className = "table-input";
        inputName.addEventListener("input", (e) => {
            evt.name = e.target.value;
            // Atualizar os cabeçalhos das matrizes em tempo real!
            updateMatrixHeaders();
            // Atualizar os seletores ortogonais!
            populateOrthogonalSelectors();
        });
        tdName.appendChild(inputName);
        tr.appendChild(tdName);

        // Coluna Probabilidade Inicial
        const tdProb = document.createElement("td");
        const inputProb = document.createElement("input");
        inputProb.type = "number";
        inputProb.value = evt.probInicial;
        inputProb.className = "table-input";
        inputProb.min = 0;
        inputProb.max = 1;
        inputProb.step = 0.05;
        inputProb.addEventListener("change", (e) => {
            let val = parseFloat(e.target.value);
            if (isNaN(val) || val < 0) val = 0;
            if (val > 1) val = 1;
            e.target.value = val;
            evt.probInicial = val;
        });
        tdProb.appendChild(inputProb);
        tr.appendChild(tdProb);

        // Coluna Forçar Estado (FO / FNO)
        const tdForce = document.createElement("td");
        const selectForce = document.createElement("select");
        selectForce.className = "custom-select";
        selectForce.innerHTML = `
            <option value="0" ${evt.forceState === 0 ? 'selected' : ''}>Normal</option>
            <option value="1" ${evt.forceState === 1 ? 'selected' : ''}>Forçar Ocorrência (FO)</option>
            <option value="2" ${evt.forceState === 2 ? 'selected' : ''}>Forçar Não Ocorrência (FNO)</option>
        `;
        selectForce.addEventListener("change", (e) => {
            evt.forceState = parseInt(e.target.value);
        });
        tdForce.appendChild(selectForce);
        tr.appendChild(tdForce);

        // Coluna Ordem de Avaliação (Fixar ordem)
        const tdOrder = document.createElement("td");
        const selectOrder = document.createElement("select");
        selectOrder.className = "custom-select";
        
        let orderOptions = `<option value="0" ${evt.order === 0 ? 'selected' : ''}>Aleatório</option>`;
        // Permite fixar o evento em qualquer etapa do cenário
        for (let step = 1; step <= nEventos; step++) {
            orderOptions += `<option value="${step}" ${evt.order === step ? 'selected' : ''}>Passo ${step}</option>`;
        }
        selectOrder.innerHTML = orderOptions;
        
        selectOrder.addEventListener("change", (e) => {
            evt.order = parseInt(e.target.value);
        });
        tdOrder.appendChild(selectOrder);
        tr.appendChild(tdOrder);

        tbody.appendChild(tr);
    });
    populateOrthogonalSelectors();
}

// Renderiza a matriz (Ocorrência ou Não Ocorrência)
function renderMatrix(type) {
    const table = (type === "ocorrencia") ? document.getElementById("table-matrix-o") : document.getElementById("table-matrix-no");
    const matrix = (type === "ocorrencia") ? matrixOcorrencia : matrixNaoOcorrencia;
    
    table.innerHTML = "";

    // 1. Linha de cabeçalho das colunas (th)
    const headerRow = document.createElement("tr");
    
    // Célula vazia no canto superior esquerdo
    const cornerTh = document.createElement("th");
    cornerTh.textContent = "Origem \\ Alvo";
    cornerTh.style.fontSize = "0.75rem";
    cornerTh.style.color = "var(--text-muted)";
    headerRow.appendChild(cornerTh);

    for (let c = 0; c < nEventos; c++) {
        const th = document.createElement("th");
        th.className = "col-header";
        th.id = `header-${type}-col-${c}`;
        th.innerHTML = `<span class="event-badge mb-1">E${c+1}</span><div style="font-size: 0.75rem; font-weight:normal; max-width: 90px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${events[c].name || 'Evento ' + (c+1)}</div>`;
        headerRow.appendChild(th);
    }
    table.appendChild(headerRow);

    // 2. Linhas de dados
    for (let r = 0; r < nEventos; r++) {
        const tr = document.createElement("tr");

        // Cabeçalho da linha (th)
        const rowTh = document.createElement("th");
        rowTh.className = "row-header";
        rowTh.id = `header-${type}-row-${r}`;
        rowTh.innerHTML = `<span class="event-badge">E${r+1}</span> <span style="font-size: 0.8rem; font-weight:normal;">${events[r].name || 'Evento ' + (r+1)}</span>`;
        tr.appendChild(rowTh);

        // Inputs das células da matriz
        for (let c = 0; c < nEventos; c++) {
            const td = document.createElement("td");
            const input = document.createElement("input");
            input.type = "number";
            input.step = "0.1";
            input.min = "0";
            input.value = matrix[r][c];
            
            if (r === c) {
                input.className = "matrix-cell-input diagonal";
                input.disabled = true;
            } else {
                input.className = "matrix-cell-input";
                input.placeholder = `E${r+1}→E${c+1}`;
                input.addEventListener("change", (e) => {
                    let val = parseFloat(e.target.value);
                    if (isNaN(val) || val < 0) val = 0.0;
                    e.target.value = val.toFixed(4); // Formata
                    matrix[r][c] = val;
                });
            }
            td.appendChild(input);
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
}

// Atualiza apenas os nomes nas células das matrizes sem recriar toda a tabela
function updateMatrixHeaders() {
    for (let i = 0; i < nEventos; i++) {
        // Cabeçalhos de coluna
        const colO = document.getElementById(`header-ocorrencia-col-${i}`);
        const colNO = document.getElementById(`header-nao-ocorrencia-col-${i}`);
        if (colO) colO.innerHTML = `<span class="event-badge mb-1">E${i+1}</span><div style="font-size: 0.75rem; font-weight:normal; max-width: 90px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${events[i].name || 'Evento ' + (i+1)}</div>`;
        if (colNO) colNO.innerHTML = `<span class="event-badge mb-1">E${i+1}</span><div style="font-size: 0.75rem; font-weight:normal; max-width: 90px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${events[i].name || 'Evento ' + (i+1)}</div>`;

        // Cabeçalhos de linha
        const rowO = document.getElementById(`header-ocorrencia-row-${i}`);
        const rowNO = document.getElementById(`header-nao-ocorrencia-row-${i}`);
        if (rowO) rowO.innerHTML = `<span class="event-badge">E${i+1}</span> <span style="font-size: 0.8rem; font-weight:normal;">${events[i].name || 'Evento ' + (i+1)}</span>`;
        if (rowNO) rowNO.innerHTML = `<span class="event-badge">E${i+1}</span> <span style="font-size: 0.8rem; font-weight:normal;">${events[i].name || 'Evento ' + (i+1)}</span>`;
    }
}

// Função para gerar a sequência de avaliação que respeita os overrides e impede loops
function getEvaluationSequence() {
    const sequence = new Array(nEventos).fill(null);
    const placedEvents = new Set();

    // 1. Colocar eventos fixos nos seus passos especificados
    events.forEach((evt, idx) => {
        if (evt.order > 0) {
            const stepIdx = evt.order - 1; // 0-indexed
            if (stepIdx < nEventos && sequence[stepIdx] === null) {
                sequence[stepIdx] = idx;
                placedEvents.add(idx);
            }
        }
    });

    // 2. Reunir os eventos que ainda não foram agendados
    const remainingEvents = [];
    for (let i = 0; i < nEventos; i++) {
        if (!placedEvents.has(i)) {
            remainingEvents.push(i);
        }
    }

    // 3. Embaralhar os eventos restantes usando o algoritmo Fisher-Yates
    for (let i = remainingEvents.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = remainingEvents[i];
        remainingEvents[i] = remainingEvents[j];
        remainingEvents[j] = temp;
    }

    // 4. Preencher os espaços vazios da sequência com os eventos restantes
    let remIdx = 0;
    for (let s = 0; s < nEventos; s++) {
        if (sequence[s] === null) {
            sequence[s] = remainingEvents[remIdx++];
        }
    }

    return sequence;
}

// EXECUTA A SIMULAÇÃO MONTE CARLO (MÉTODO ASYNC POR LOTES E SUPORTE A EIXOS ORTOGONAIS)
function runSimulation() {
    // Validação inicial
    if (events.length === 0) {
        alert("Cadastre eventos antes de iniciar a simulação.");
        return;
    }

    const checkOrtho = document.getElementById("check-orthogonal-mode");
    const isOrtho = checkOrtho ? checkOrtho.checked : false;

    let orthoVarA = 0;
    let orthoVarB = 0;
    let orthoRoundIndex = 0; // 0, 1, 2, 3
    let originalForceStates = [];

    if (isOrtho) {
        orthoVarA = parseInt(document.getElementById("select-ortho-a").value);
        orthoVarB = parseInt(document.getElementById("select-ortho-b").value);
        
        orthoRoundsData = [
            { label: "Rodada 1 (A Ocorre • B Ocorre)", stateA: 1, stateB: 1, raw: [], ranking: [] },
            { label: "Rodada 2 (A Ocorre • B Não Ocorre)", stateA: 1, stateB: 2, raw: [], ranking: [] },
            { label: "Rodada 3 (A Não Ocorre • B Ocorre)", stateA: 2, stateB: 1, raw: [], ranking: [] },
            { label: "Rodada 4 (A Não Ocorre • B Não Ocorre)", stateA: 2, stateB: 2, raw: [], ranking: [] }
        ];

        // Backup original forceStates
        originalForceStates = events.map(e => e.forceState);
    }

    // Exibir loading overlay
    const overlay = document.getElementById("loading-overlay");
    const progressBar = document.getElementById("loading-progress-bar");
    const progressText = document.getElementById("loading-progress-text");
    overlay.style.display = "flex";

    const startTime = performance.now();
    let processTime = 0;
    
    // Limpar resultados anteriores
    simResults.raw = [];
    simResults.ranking = [];
    simResults.eventSimProbs = new Array(nEventos).fill(0);
    
    let simCount = 0;
    const batchSize = 5000; // Tamanho do lote para não travar a UI

    let calculationsComplete = false;
    let animationPercent = 0;

    // Inicia a animação suave da barra de progresso (2.2 segundos de delay artificial)
    const animationDuration = 2200; 
    const animStartTime = performance.now();
    
    function animateProgress() {
        const now = performance.now();
        const elapsed = now - animStartTime;
        const progress = Math.min(elapsed / animationDuration, 1);
        animationPercent = Math.round(progress * 100);
        
        progressBar.style.width = `${animationPercent}%`;
        
        // Mensagens dinâmicas de carregamento
        let msg = "";
        if (isOrtho) {
            if (animationPercent < 25) {
                msg = `Análise Ortogonal - Rodada 1/4: Estruturando eixos (${animationPercent}%)`;
            } else if (animationPercent < 50) {
                msg = `Análise Ortogonal - Rodada 2/4: Simulando condicionais de A (${animationPercent}%)`;
            } else if (animationPercent < 75) {
                msg = `Análise Ortogonal - Rodada 3/4: Simulando condicionais de B (${animationPercent}%)`;
            } else {
                msg = `Análise Ortogonal - Rodada 4/4: Consolidando eixos cruzados (${animationPercent}%)`;
            }
        } else {
            if (animationPercent < 20) {
                msg = `Inicializando modelo e variáveis... ${animationPercent}%`;
            } else if (animationPercent < 45) {
                msg = `Ajustando coeficientes de impactos cruzados... ${animationPercent}%`;
            } else if (animationPercent < 75) {
                msg = `Executando ${nSimulacoes.toLocaleString()} cenários probabilísticos (Monte Carlo)... ${animationPercent}%`;
            } else if (animationPercent < 90) {
                msg = `Compilando ranking de ocorrências... ${animationPercent}%`;
            } else {
                msg = `Concluindo simulação... ${animationPercent}%`;
            }
        }
        progressText.textContent = msg;
        
        if (progress < 1) {
            requestAnimationFrame(animateProgress);
        } else {
            checkIfDone();
        }
    }
    
    requestAnimationFrame(animateProgress);

    function checkIfDone() {
        if (calculationsComplete && animationPercent >= 100) {
            overlay.style.display = "none";
            
            if (isOrtho) {
                // Renderizar as 4 tabelas de eixos ortogonais
                renderOrthogonalTables();

                // Mover visualização para a aba de resultados
                document.getElementById("nav-item-results").click();
            } else {
                // Atualizar os Cards Estatísticos do Dashboard
                document.getElementById("stat-simulations").textContent = nSimulacoes.toLocaleString();
                document.getElementById("stat-time").textContent = `${processTime} ms`;
                
                const topScen = simResults.ranking[0];
                if (topScen) {
                    document.getElementById("stat-top-scenario").innerHTML = `Cenário: <b>${topScen.binaryString}</b> <br>Frequência: <b>${topScen.percentage.toFixed(2)}%</b>`;
                } else {
                    document.getElementById("stat-top-scenario").textContent = "Nenhum";
                }

                // Alternar visualização para resultados padrão
                toggleResultsView(false);

                // Renderizar tabelas e gráficos
                currentLogPage = 1;
                renderRankingTable();
                renderRawLogsTable();
                renderCharts();

                // Mover visualização para a aba de resultados
                document.getElementById("nav-item-results").click();
            }
        }
    }

    // Loop interno de simulação por lotes assíncronos
    function simulateBatch() {
        const limit = Math.min(nSimulacoes, simCount + batchSize);
        
        // Se estiver em modo ortogonal, forçar os estados da rodada atual
        if (isOrtho) {
            const roundConf = orthoRoundsData[orthoRoundIndex];
            events[orthoVarA].forceState = roundConf.stateA;
            events[orthoVarB].forceState = roundConf.stateB;
        }

        for (let sim = simCount; sim < limit; sim++) {
            // Cópia local das probabilidades para esta rodada (a matriz dinâmica do VBA)
            const currentProbs = events.map(e => e.probInicial);
            
            // Ordem sorteada de avaliação para esta simulação específica
            const seq = getEvaluationSequence();
            
            // Vetor de resultados do cenário (1: Ocorreu, 0: Não Ocorreu)
            const outcomes = new Array(nEventos).fill(null);

            // Avaliar sequencialmente cada evento na ordem sorteada
            for (let step = 0; step < nEventos; step++) {
                const currentEvent = seq[step];
                const evtConfig = events[currentEvent];
                
                // Determina se o evento ocorre
                let occurs;
                if (evtConfig.forceState === 1) {
                    occurs = true; // FO
                } else if (evtConfig.forceState === 2) {
                    occurs = false; // FNO
                } else {
                    occurs = Math.random() <= currentProbs[currentEvent];
                }

                // Salva o resultado
                outcomes[currentEvent] = occurs ? 1 : 0;

                // Atualizar probabilidade de todos os OUTROS eventos usando a fórmula clássica do VBA
                for (let i = 0; i < nEventos; i++) {
                    if (i !== currentEvent) {
                        const p = currentProbs[i];
                        // Busca o fator multiplicador na matriz de Ocorrência ou Não Ocorrência
                        const factor = occurs ? matrixOcorrencia[currentEvent][i] : matrixNaoOcorrencia[currentEvent][i];
                        
                        const den = (1 - p) + (p * factor);
                        if (den === 0) {
                            currentProbs[i] = 0;
                        } else {
                            currentProbs[i] = (p * factor) / den;
                        }
                        
                        // Garante que o valor da probabilidade permaneça entre 0 e 1 (clamp)
                        currentProbs[i] = Math.max(0, Math.min(1, currentProbs[i]));
                    }
                }
            }

            if (isOrtho) {
                orthoRoundsData[orthoRoundIndex].raw.push({
                    index: sim + 1,
                    outcomes: outcomes,
                    order: seq.map(idx => `E${idx + 1}`)
                });
            } else {
                // Somar ocorrências gerais para cálculo de frequências simuladas finais
                for (let i = 0; i < nEventos; i++) {
                    if (outcomes[i] === 1) {
                        simResults.eventSimProbs[i]++;
                    }
                }

                // Guardar o log bruto da rodada
                simResults.raw.push({
                    index: sim + 1,
                    outcomes: outcomes,
                    order: seq.map(idx => `E${idx + 1}`) // Nome simplificado dos passos
                });
            }
        }

        simCount = limit;
        
        if (simCount < nSimulacoes) {
            // Continua no próximo frame
            requestAnimationFrame(simulateBatch);
        } else {
            if (isOrtho) {
                // Processar e ranquear a rodada atual
                processOrthoRoundRanking(orthoRoundIndex);

                if (orthoRoundIndex < 3) {
                    // Avança para a próxima rodada
                    orthoRoundIndex++;
                    simCount = 0;
                    requestAnimationFrame(simulateBatch);
                } else {
                    // Todas as 4 finalizadas! Restaurar estados originais
                    events.forEach((e, idx) => e.forceState = originalForceStates[idx]);

                    calculationsComplete = true;
                    checkIfDone();
                }
            } else {
                // Finalizou as simulações! Compilar estatísticas adicionais
                const endTime = performance.now();
                processTime = Math.round(endTime - startTime);
                
                // Finaliza as probabilidades finais dividindo pelo total de simulações
                for (let i = 0; i < nEventos; i++) {
                    simResults.eventSimProbs[i] = simResults.eventSimProbs[i] / nSimulacoes;
                }

                // Processar e ranquear as combinações de cenários
                processScenarioRanking();

                calculationsComplete = true;
                checkIfDone();
            }
        }
    }

    // Inicia a execução em lote
    requestAnimationFrame(simulateBatch);
}

// Processa o ranking de cenários combinados (agrupamentos de strings binárias)
function processScenarioRanking() {
    const scenarioMap = new Map();

    simResults.raw.forEach(sim => {
        const binStr = sim.outcomes.join("");
        const currentCount = scenarioMap.get(binStr) || 0;
        scenarioMap.set(binStr, currentCount + 1);
    });

    const ranking = [];
    scenarioMap.forEach((count, binStr) => {
        ranking.push({
            binaryString: binStr,
            count: count,
            percentage: (count / nSimulacoes) * 100
        });
    });

    // Ordena do mais frequente para o menos frequente
    ranking.sort((a, b) => b.count - a.count);
    simResults.ranking = ranking;
}

// Renderiza a Tabela de Ranking de Cenários
function renderRankingTable() {
    const tbody = document.getElementById("tbody-ranking");
    tbody.innerHTML = "";

    simResults.ranking.forEach((scen, idx) => {
        const tr = document.createElement("tr");

        // Posição
        const tdPos = document.createElement("td");
        tdPos.innerHTML = `<strong>#${idx + 1}</strong>`;
        tr.appendChild(tdPos);

        // String Binária
        const tdBin = document.createElement("td");
        tdBin.style.fontFamily = "monospace";
        tdBin.style.fontSize = "1.1rem";
        tdBin.style.letterSpacing = "2px";
        tdBin.textContent = scen.binaryString;
        tr.appendChild(tdBin);

        // Representação Visual (Bolinhas verdes/cinzas)
        const tdVisual = document.createElement("td");
        const visualContainer = document.createElement("div");
        visualContainer.className = "binary-grid-visualizer";
        
        for (let i = 0; i < nEventos; i++) {
            const char = scen.binaryString[i];
            const dot = document.createElement("span");
            dot.className = `binary-dot ${char === '1' ? 'occurred' : 'not-occurred'}`;
            dot.title = `E${i+1}: ${events[i].name} - ${char === '1' ? 'Ocorreu' : 'Não Ocorreu'}`;
            dot.textContent = char;
            visualContainer.appendChild(dot);
        }
        tdVisual.appendChild(visualContainer);
        tr.appendChild(tdVisual);

        // Ocorrências
        const tdCount = document.createElement("td");
        tdCount.style.textAlign = "right";
        tdCount.textContent = scen.count.toLocaleString();
        tr.appendChild(tdCount);

        // Frequência %
        const tdPct = document.createElement("td");
        tdPct.style.textAlign = "right";
        tdPct.style.fontWeight = "bold";
        tdPct.textContent = `${scen.percentage.toFixed(3)}%`;
        tr.appendChild(tdPct);

        tbody.appendChild(tr);
    });
}

// Renderiza a Tabela de Log Bruto de Simulações (com paginação)
function renderRawLogsTable() {
    const tbody = document.getElementById("tbody-raw-logs");
    tbody.innerHTML = "";

    const startIndex = (currentLogPage - 1) * LOGS_PER_PAGE;
    const endIndex = Math.min(simResults.raw.length, startIndex + LOGS_PER_PAGE);

    // Atualizar texto de paginação
    const maxPage = Math.max(1, Math.ceil(simResults.raw.length / LOGS_PER_PAGE));
    document.getElementById("log-pagination-info").textContent = `Mostrando ${simResults.raw.length === 0 ? 0 : startIndex + 1}-${endIndex} de ${simResults.raw.length.toLocaleString()} (Página ${currentLogPage} de ${maxPage})`;

    // Desabilitar botões se necessário
    document.getElementById("btn-prev-log-page").disabled = (currentLogPage === 1);
    document.getElementById("btn-next-log-page").disabled = (currentLogPage === maxPage);

    const pageData = simResults.raw.slice(startIndex, endIndex);

    pageData.forEach(sim => {
        const tr = document.createElement("tr");

        // Nº Simulação
        const tdNum = document.createElement("td");
        tdNum.textContent = `Simulação ${sim.index}`;
        tr.appendChild(tdNum);

        // Cenário (Binário)
        const tdBin = document.createElement("td");
        tdBin.style.fontFamily = "monospace";
        tdBin.style.letterSpacing = "2px";
        tdBin.textContent = sim.outcomes.join("");
        tr.appendChild(tdBin);

        // Representação Visual
        const tdVisual = document.createElement("td");
        const visualContainer = document.createElement("div");
        visualContainer.className = "binary-grid-visualizer";
        for (let i = 0; i < nEventos; i++) {
            const val = sim.outcomes[i];
            const dot = document.createElement("span");
            dot.className = `binary-dot ${val === 1 ? 'occurred' : 'not-occurred'}`;
            dot.textContent = val;
            visualContainer.appendChild(dot);
        }
        tdVisual.appendChild(visualContainer);
        tr.appendChild(tdVisual);

        // Ordem Sorteada
        const tdOrder = document.createElement("td");
        tdOrder.style.fontSize = "0.8rem";
        tdOrder.style.color = "var(--text-secondary)";
        tdOrder.textContent = sim.order.join(" ➔ ");
        tr.appendChild(tdOrder);

        tbody.appendChild(tr);
    });
}

// Inicializa e Atualiza os Gráficos Estatísticos usando Chart.js
function renderCharts() {
    // 1. Gráfico de Comparação de Probabilidades: Inicial vs. Simulado
    const ctxProb = document.getElementById("chart-probabilities").getContext("2d");
    
    // Destruir gráfico existente se houver
    if (chartProbabilities) {
        chartProbabilities.destroy();
    }

    const labels = events.map(e => `E${e.id} (${e.name.substring(0, 15)}${e.name.length > 15 ? '...' : ''})`);
    const initialData = events.map(e => e.probInicial);
    const simulatedData = simResults.eventSimProbs;

    chartProbabilities = new Chart(ctxProb, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Probabilidade Inicial',
                    data: initialData,
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    borderColor: 'rgba(255, 255, 255, 0.4)',
                    borderWidth: 1,
                    borderRadius: 4
                },
                {
                    label: 'Probabilidade Simulada (Final)',
                    data: simulatedData,
                    backgroundColor: 'rgba(99, 102, 241, 0.75)',
                    borderColor: 'rgba(99, 102, 241, 1)',
                    borderWidth: 1,
                    borderRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: '#F3F4F6', font: { family: 'Outfit' } }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return ` ${context.dataset.label}: ${(context.raw * 100).toFixed(2)}%`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    min: 0,
                    max: 1,
                    ticks: {
                        color: '#9CA3AF',
                        callback: function(value) { return (value * 100) + '%'; }
                    },
                    grid: { color: 'rgba(255, 255, 255, 0.05)' }
                },
                x: {
                    ticks: { color: '#9CA3AF', font: { family: 'Inter', size: 10 } },
                    grid: { display: false }
                }
            }
        }
    });

    // 2. Gráfico de Top 10 Cenários Mais Frequentes
    const ctxScen = document.getElementById("chart-scenarios").getContext("2d");

    if (chartScenarios) {
        chartScenarios.destroy();
    }

    const topScenarios = simResults.ranking.slice(0, 10);
    const scenLabels = topScenarios.map(s => s.binaryString);
    const scenData = topScenarios.map(s => s.percentage);

    chartScenarios = new Chart(ctxScen, {
        type: 'bar',
        data: {
            labels: scenLabels,
            datasets: [{
                label: 'Frequência do Cenário',
                data: scenData,
                backgroundColor: 'rgba(6, 182, 212, 0.7)',
                borderColor: 'rgba(6, 182, 212, 1)',
                borderWidth: 1,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y', // Barra horizontal!
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return ` Frequência: ${context.raw.toFixed(3)}%`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#9CA3AF',
                        callback: function(value) { return value.toFixed(1) + '%'; }
                    },
                    grid: { color: 'rgba(255, 255, 255, 0.05)' }
                },
                y: {
                    ticks: {
                        color: '#F3F4F6',
                        font: { family: 'monospace', size: 12, weight: 'bold' }
                    },
                    grid: { display: false }
                }
            }
        }
    });

    // Forçar atualização das cores dos gráficos de acordo com o tema ativo
    updateChartThemeColors();
}

// Carrega os dados de exemplo pré-definidos (Demonstração)
function loadDemoData(notify = true) {
    nEventos = 5;
    nSimulacoes = 10000;
    
    document.getElementById("nEventos").value = nEventos;
    document.getElementById("nSimulacoes").value = nSimulacoes;

    // 5 eventos do exemplo de risco político e tecnológico
    events = [
        { id: 1, name: "Transição Energética Acelerada", probInicial: 0.60, forceState: 0, order: 0 },
        { id: 2, name: "Taxação Global sobre Carbono", probInicial: 0.50, forceState: 0, order: 0 },
        { id: 3, name: "Escassez de Metais Raros (Lítio)", probInicial: 0.40, forceState: 0, order: 0 },
        { id: 4, name: "Subvenção Estatal para Renováveis", probInicial: 0.70, forceState: 0, order: 0 },
        { id: 5, name: "Crise na Cadeia de Baterias", probInicial: 0.35, forceState: 0, order: 0 }
    ];

    // Matriz de Ocorrência (se linha ocorre, afeta coluna)
    matrixOcorrencia = [
        [1.0, 1.6, 1.2, 1.5, 1.3],  // E1 ocorre afeta [E1, E2, E3, E4, E5]
        [1.3, 1.0, 0.9, 1.2, 1.1],  // E2 ocorre afeta ...
        [0.8, 1.0, 1.0, 0.7, 1.8],  // E3 ocorre afeta ...
        [1.7, 1.4, 1.1, 1.0, 1.2],  // E4 ocorre afeta ...
        [0.6, 0.9, 1.3, 0.8, 1.0]   // E5 ocorre afeta ...
    ];

    // Matriz de Não Ocorrência (se linha não ocorre, afeta coluna)
    matrixNaoOcorrencia = [
        [1.0, 0.5, 0.8, 0.4, 0.7],  // E1 não ocorre afeta ...
        [0.7, 1.0, 1.1, 0.8, 0.9],  // E2 não ocorre afeta ...
        [1.2, 1.0, 1.0, 1.3, 0.5],  // E3 não ocorre afeta ...
        [0.3, 0.6, 0.9, 1.0, 0.8],  // E4 não ocorre afeta ...
        [1.3, 1.1, 0.8, 1.2, 1.0]   // E5 não ocorre afeta ...
    ];

    renderEventsTable();
    renderMatrix("ocorrencia");
    renderMatrix("nao-ocorrencia");

    if (notify) {
        alert("Exemplo clássico carregado com sucesso!\nAbra as seções de Matrizes para inspecionar os impactos ou clique em 'Rodar Simulação' para analisar os resultados.");
    }
}

// Exporta as configurações atuais como arquivo JSON
function exportConfigJSON() {
    const config = {
        nEventos: nEventos,
        nSimulacoes: nSimulacoes,
        events: events,
        matrixOcorrencia: matrixOcorrencia,
        matrixNaoOcorrencia: matrixNaoOcorrencia
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(config, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `config_impacto_cruzado_${nEventos}_eventos.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
}

// Importa configurações de um arquivo JSON selecionado
function importConfigJSON(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const config = JSON.parse(e.target.result);
            
            // Validações básicas de formato
            if (!config.nEventos || !config.nSimulacoes || !config.events || !config.matrixOcorrencia || !config.matrixNaoOcorrencia) {
                throw new Error("O arquivo selecionado não contém todas as propriedades necessárias do simulador.");
            }

            nEventos = parseInt(config.nEventos);
            nSimulacoes = parseInt(config.nSimulacoes);
            events = config.events;
            matrixOcorrencia = config.matrixOcorrencia;
            matrixNaoOcorrencia = config.matrixNaoOcorrencia;

            // Sincronizar inputs numéricos
            document.getElementById("nEventos").value = nEventos;
            document.getElementById("nSimulacoes").value = nSimulacoes;

            // Re-renderizar telas
            renderEventsTable();
            renderMatrix("ocorrencia");
            renderMatrix("nao-ocorrencia");

            alert("Configurações importadas com sucesso!");
        } catch (err) {
            alert(`Falha ao ler o arquivo JSON:\n${err.message}`);
        }
    };
    reader.readAsText(file);
    
    // Limpar input de arquivo para permitir novo upload do mesmo arquivo se necessário
    event.target.value = "";
}

// Importa configurações de uma planilha Excel selecionada (com suporte ao arquivo .xlsm original)
function importConfigExcel(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Mostrar tela de loading temporária para o processamento do Excel
    const overlay = document.getElementById("loading-overlay");
    const progressText = document.getElementById("loading-progress-text");
    const progressBar = document.getElementById("loading-progress-bar");
    
    if (overlay) {
        overlay.style.display = "flex";
        progressText.textContent = "Lendo arquivo Excel...";
        progressBar.style.width = "40%";
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            
            const sheetName = 'Parâmetros';
            const sheet = workbook.Sheets[sheetName];
            if (!sheet) {
                throw new Error(`A planilha '${sheetName}' não foi encontrada no arquivo Excel.`);
            }

            // Função auxiliar para obter valor de célula
            function getCellValue(cellRef) {
                const cell = sheet[cellRef];
                return cell ? cell.v : null;
            }

            // Função auxiliar por coluna (1-based) e linha (1-based)
            function getValByColRow(colIdx, rowIdx) {
                const colLetter = XLSX.utils.encode_col(colIdx - 1);
                const cell = sheet[colLetter + rowIdx];
                return cell ? cell.v : null;
            }

            // 1. Ler nEventos (C2) e nSimulacoes (C3)
            let rawNEventos = getCellValue('C2');
            let rawNSimulacoes = getCellValue('C3');

            if (!rawNEventos) {
                throw new Error("Não foi possível ler o número de eventos na célula C2 da planilha 'Parâmetros'.");
            }
            let parsedNEventos = parseInt(rawNEventos);
            if (isNaN(parsedNEventos) || parsedNEventos < 2 || parsedNEventos > 15) {
                throw new Error(`Número de eventos inválido na célula C2 (${rawNEventos}). Deve ser um inteiro entre 2 e 15.`);
            }

            let parsedNSimulacoes = parseInt(rawNSimulacoes) || 10000;

            // 2. Extrair Eventos
            let newEvents = [];
            for (let i = 0; i < parsedNEventos; i++) {
                const row = 40 + i; // Começa na linha 40 do excel (equivalente à linha 40 em openpyxl)
                
                // Nome do Evento (Coluna B / coluna 2)
                let name = getValByColRow(2, row);
                name = name ? name.toString().trim() : ""; // Deixa vazio se não tiver, o fallback da UI cuidará disso!
                
                // Probabilidade Inicial (Coluna C / coluna 3)
                let probVal = parseFloat(getValByColRow(3, row));
                if (isNaN(probVal)) {
                    // Tenta ler do backup em D se C estiver vazio
                    probVal = parseFloat(getValByColRow(4, row));
                }
                if (isNaN(probVal) || probVal < 0 || probVal > 1) {
                    probVal = 0.5; // Fallback
                }
                
                // Forçar Estado (Coluna E / coluna 5)
                let forceVal = parseInt(getValByColRow(5, row));
                if (isNaN(forceVal) || ![0, 1, 2].includes(forceVal)) {
                    forceVal = 0; // Normal
                }
                
                // Ordem de Avaliação (Coluna J / coluna 10)
                let orderVal = 0;
                let rawOrder = getValByColRow(10, row); // Coluna J
                if (rawOrder !== null && rawOrder !== undefined) {
                    if (typeof rawOrder === 'string') {
                        orderVal = parseInt(rawOrder.replace(/\D/g, '')) || 0;
                    } else {
                        orderVal = parseInt(rawOrder) || 0;
                    }
                }
                if (isNaN(orderVal) || orderVal < 0 || orderVal > parsedNEventos) {
                    orderVal = 0;
                }

                newEvents.push({
                    id: i + 1,
                    name: name,
                    probInicial: probVal,
                    forceState: forceVal,
                    order: orderVal
                });
            }

            // 3. Extrair Matriz de Ocorrência
            // Começa na linha 8, Coluna C (coluna 3)
            let newMatrixO = [];
            for (let r = 0; r < parsedNEventos; r++) {
                let row = [];
                const excelRow = 8 + r;
                for (let c = 0; c < parsedNEventos; c++) {
                    const excelCol = 3 + c;
                    if (r === c) {
                        row.push(1.0); // Diagonal
                    } else {
                        let impact = parseFloat(getValByColRow(excelCol, excelRow));
                        if (isNaN(impact) || impact < 0) {
                            impact = 1.0; // Neutro
                        }
                        row.push(impact);
                    }
                }
                newMatrixO.push(row);
            }

            // 4. Extrair Matriz de Não Ocorrência
            // Começa na linha 24, Coluna C (coluna 3)
            let newMatrixNO = [];
            for (let r = 0; r < parsedNEventos; r++) {
                let row = [];
                const excelRow = 24 + r;
                for (let c = 0; c < parsedNEventos; c++) {
                    const excelCol = 3 + c;
                    if (r === c) {
                        row.push(1.0); // Diagonal
                    } else {
                        let impact = parseFloat(getValByColRow(excelCol, excelRow));
                        if (isNaN(impact) || impact < 0) {
                            impact = 1.0; // Neutro
                        }
                        row.push(impact);
                    }
                }
                newMatrixNO.push(row);
            }

            // Atualizar estado
            nEventos = parsedNEventos;
            nSimulacoes = parsedNSimulacoes;
            events = newEvents;
            matrixOcorrencia = newMatrixO;
            matrixNaoOcorrencia = newMatrixNO;

            // Sincronizar inputs numéricos da UI
            document.getElementById("nEventos").value = nEventos;
            document.getElementById("nSimulacoes").value = nSimulacoes;

            // Re-renderizar telas
            renderEventsTable();
            renderMatrix("ocorrencia");
            renderMatrix("nao-ocorrencia");

            if (overlay) {
                progressBar.style.width = "100%";
                progressText.textContent = "Finalizado!";
                setTimeout(() => { overlay.style.display = "none"; }, 400);
            }

            setTimeout(() => {
                alert(`Planilha '${file.name}' importada com sucesso!\n- Número de Eventos detectados: ${nEventos}\n- Número de Simulações configuradas: ${nSimulacoes.toLocaleString()}`);
            }, 500);

        } catch (err) {
            if (overlay) overlay.style.display = "none";
            alert(`Falha ao ler o arquivo Excel:\n${err.message}`);
        }
    };
    
    reader.onerror = function() {
        if (overlay) overlay.style.display = "none";
        alert("Erro de leitura do arquivo.");
    };

    reader.readAsArrayBuffer(file);
    
    // Limpar input de arquivo para permitir novo upload do mesmo arquivo se necessário
    event.target.value = "";
}

// Exporta o ranking de cenários para formato CSV
function exportCsvRanking() {
    if (simResults.ranking.length === 0) {
        alert("Rode a simulação antes de exportar os resultados.");
        return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Cabeçalho do CSV
    let headers = ["Posição", "Cenário (Binário)", "Frequência (Absoluta)", "Frequência (%)"];
    events.forEach(e => {
        headers.push(e.name.replace(/,/g, " ")); // Remove vírgulas para evitar quebra de coluna
    });
    csvContent += headers.join(",") + "\n";

    // Linhas de dados
    simResults.ranking.forEach((scen, idx) => {
        let row = [
            idx + 1,
            `"${scen.binaryString}"`,
            scen.count,
            scen.percentage.toFixed(5)
        ];
        // Adiciona 0 ou 1 para cada coluna de evento
        for (let i = 0; i < nEventos; i++) {
            row.push(scen.binaryString[i]);
        }
        csvContent += row.join(",") + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ranking_cenarios_${nSimulacoes}_simulacoes.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
}

// Exporta todos os logs brutos das simulações para formato CSV
function exportCsvRawLogs() {
    if (simResults.raw.length === 0) {
        alert("Rode a simulação antes de exportar os resultados.");
        return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Cabeçalho do CSV
    let headers = ["Simulação #", "Cenário Completo", "Ordem de Avaliação"];
    events.forEach(e => {
        headers.push(e.name.replace(/,/g, " "));
    });
    csvContent += headers.join(",") + "\n";

    // Linhas de dados
    simResults.raw.forEach(sim => {
        let row = [
            sim.index,
            `"${sim.outcomes.join("")}"`,
            `"${sim.order.join(" -> ")}"`
        ];
        // Adiciona se ocorreu (1) ou não (0)
        sim.outcomes.forEach(val => {
            row.push(val);
        });
        csvContent += row.join(",") + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `logs_completos_${nSimulacoes}_simulacoes.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
}

// Gera e baixa uma planilha modelo limpa do Excel (.xlsx) usando o SheetJS
function downloadExcelTemplate() {
    try {
        const defaultNEventos = 12; // Criamos um modelo completo para 12 eventos
        const defaultNSimulacoes = 10000;
        
        // 1. Inicializar uma grade de arrays de tamanho 60x15
        const aoa = [];
        for (let i = 0; i < 60; i++) {
            aoa.push(new Array(15).fill(null));
        }

        // 2. Escrever parâmetros e rótulos
        aoa[1][1] = "Número de Eventos:"; // B2
        aoa[1][2] = defaultNEventos;       // C2
        
        aoa[2][1] = "Número de Simulações:"; // B3
        aoa[2][2] = defaultNSimulacoes;      // C3

        // 3. Matriz de Ocorrência
        aoa[6][1] = "MATRIZ DE IMPACTO DE OCORRÊNCIA (Se linha ocorre, afeta coluna)"; // B7
        for (let c = 0; c < defaultNEventos; c++) {
            aoa[6][2 + c] = `E${c + 1}`; // Cabeçalho de colunas C7, D7, etc.
        }
        for (let r = 0; r < defaultNEventos; r++) {
            aoa[7 + r][1] = `Evento ${r + 1}`; // Coluna B (B8, B9, etc.)
            for (let c = 0; c < defaultNEventos; c++) {
                aoa[7 + r][2 + c] = 1.0; // Fatores neutros
            }
        }

        // 4. Matriz de Não Ocorrência
        aoa[22][1] = "MATRIZ DE IMPACTO DE NÃO OCORRÊNCIA (Se linha NÃO ocorre, afeta coluna)"; // B23
        for (let c = 0; c < defaultNEventos; c++) {
            aoa[22][2 + c] = `E${c + 1}`; // Cabeçalhos C23, D23, etc.
        }
        for (let r = 0; r < defaultNEventos; r++) {
            aoa[23 + r][1] = `Evento ${r + 1}`; // Coluna B (B24, B25, etc.)
            for (let c = 0; c < defaultNEventos; c++) {
                aoa[23 + r][2 + c] = 1.0; // Fatores neutros
            }
        }

        // 5. Tabela de Configurações de Eventos
        aoa[38][1] = "Nome do Evento"; // B39
        aoa[38][2] = "Probabilidade Inicial"; // C39
        aoa[38][3] = "Probabilidade Backup (Cole o mesmo valor de C)"; // D39
        aoa[38][4] = "Forçar Estado (0=Normal, 1=FO, 2=FNO)"; // E39
        aoa[38][9] = "Ordem de Avaliação (0=Aleatório, 1-12=Passo Fixo)"; // J39

        for (let i = 0; i < defaultNEventos; i++) {
            const rowIdx = 39 + i;
            aoa[rowIdx][1] = `Evento ${i + 1}`; // Coluna B
            aoa[rowIdx][2] = 0.5; // Coluna C
            aoa[rowIdx][3] = 0.5; // Coluna D
            aoa[rowIdx][4] = 0;   // Coluna E (Normal)
            aoa[rowIdx][9] = 0;   // Coluna J (Aleatório)
        }

        // 6. Converter o array 2D para planilha do SheetJS
        const ws = XLSX.utils.aoa_to_sheet(aoa);

        // 7. Configurar larguras de coluna básicas para melhorar a visualização no Excel
        const colWidths = [
            { wch: 10 }, // A
            { wch: 30 }, // B
            { wch: 15 }, // C
            { wch: 15 }, // D
            { wch: 15 }, // E
            { wch: 10 }, // F
            { wch: 10 }, // G
            { wch: 10 }, // H
            { wch: 10 }, // I
            { wch: 15 }, // J
        ];
        ws['!cols'] = colWidths;

        // 8. Criar o Livro e Anexar a Planilha
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Parâmetros");

        // 9. Salvar/Baixar o Arquivo
        XLSX.writeFile(wb, "modelo_parametros_impacto_cruzado.xlsx");

    } catch (err) {
        alert(`Erro ao gerar a planilha modelo:\n${err.message}`);
    }
}

// ==========================================================================
/* AUXILIARY FUNCTIONS FOR 2X2 ORTHOGONAL SCENARIO MATRIX & CONDITIONAL PROBS */
// ==========================================================================

// Popula os seletores de eixos ortogonais dinamicamente com base nos eventos ativos
function populateOrthogonalSelectors() {
    const selectX = document.getElementById("select-ortho-a");
    const selectY = document.getElementById("select-ortho-b");
    if (!selectX || !selectY) return;

    const valX = selectX.value;
    const valY = selectY.value;

    selectX.innerHTML = "";
    selectY.innerHTML = "";

    events.forEach((evt, idx) => {
        const name = evt.name ? evt.name : `Evento ${evt.id}`;
        
        const optX = document.createElement("option");
        optX.value = idx;
        optX.textContent = `E${evt.id} - ${name}`;
        selectX.appendChild(optX);

        const optY = document.createElement("option");
        optY.value = idx;
        optY.textContent = `E${evt.id} - ${name}`;
        selectY.appendChild(optY);
    });

    // Restaurar seleções anteriores se ainda forem válidas
    if (valX !== "" && parseInt(valX) < events.length) {
        selectX.value = valX;
    } else {
        selectX.value = "0"; // E1
    }

    if (valY !== "" && parseInt(valY) < events.length) {
        selectY.value = valY;
    } else {
        selectY.value = events.length > 1 ? "1" : "0"; // E2
    }
}

// Processa o ranking de uma única rodada da simulação ortogonal (Top 10)
function processOrthoRoundRanking(roundIdx) {
    const round = orthoRoundsData[roundIdx];
    const scenarioMap = new Map();
    
    round.raw.forEach(sim => {
        const binStr = sim.outcomes.join("");
        scenarioMap.set(binStr, (scenarioMap.get(binStr) || 0) + 1);
    });
    
    const ranking = [];
    scenarioMap.forEach((count, binStr) => {
        ranking.push({
            binaryString: binStr,
            count: count,
            percentage: (count / nSimulacoes) * 100
        });
    });
    
    ranking.sort((a, b) => b.count - a.count);
    // Salva apenas o Top 10 mais provável
    round.ranking = ranking.slice(0, 10);
}

// Renderiza as 4 tabelas de resultados com os eixos ortogonais e leds coloridos
function renderOrthogonalTables() {
    // 1. Mostrar container ortogonal e ocultar o padrão
    toggleResultsView(true);
    
    // 2. Obter nomes das variáveis selecionadas
    const selectA = document.getElementById("select-ortho-a");
    const selectB = document.getElementById("select-ortho-b");
    const idxA = parseInt(selectA.value);
    const idxB = parseInt(selectB.value);
    
    const nameA = events[idxA].name || `Evento ${events[idxA].id}`;
    const nameB = events[idxB].name || `Evento ${events[idxB].id}`;
    
    // 3. Atualizar títulos dos cabeçalhos das tabelas
    document.getElementById("ortho-title-r1").innerHTML = `<i class="fa-solid fa-check-double text-success"></i> Rodada 1: E${events[idxA].id} Ocorre • E${events[idxB].id} Ocorre<br><span style="font-size:0.75rem; color:var(--text-muted); font-weight:normal; font-style:italic;">[${nameA.substring(0, 20)} & ${nameB.substring(0, 20)}]</span>`;
    document.getElementById("ortho-title-r2").innerHTML = `<i class="fa-solid fa-circle-nodes text-secondary"></i> Rodada 2: E${events[idxA].id} Ocorre • E${events[idxB].id} Não Ocorre<br><span style="font-size:0.75rem; color:var(--text-muted); font-weight:normal; font-style:italic;">[${nameA.substring(0, 20)} & Não ${nameB.substring(0, 20)}]</span>`;
    document.getElementById("ortho-title-r3").innerHTML = `<i class="fa-solid fa-circle-nodes text-primary"></i> Rodada 3: E${events[idxA].id} Não Ocorre • E${events[idxB].id} Ocorre<br><span style="font-size:0.75rem; color:var(--text-muted); font-weight:normal; font-style:italic;">[Não ${nameA.substring(0, 20)} & ${nameB.substring(0, 20)}]</span>`;
    document.getElementById("ortho-title-r4").innerHTML = `<i class="fa-solid fa-times-circle text-muted"></i> Rodada 4: E${events[idxA].id} Não Ocorre • E${events[idxB].id} Não Ocorre<br><span style="font-size:0.75rem; color:var(--text-muted); font-weight:normal; font-style:italic;">[Não ${nameA.substring(0, 20)} & Não ${nameB.substring(0, 20)}]</span>`;
    
    // 4. Preencher cada uma das 4 tabelas
    for (let r = 0; r < 4; r++) {
        const tbody = document.getElementById(`tbody-ortho-r${r + 1}`);
        tbody.innerHTML = "";
        
        const ranking = orthoRoundsData[r].ranking;
        
        if (ranking.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:var(--text-muted); padding: 2rem;">Nenhum cenário gerado.</td></tr>`;
            continue;
        }

        ranking.forEach((scen, idx) => {
            const tr = document.createElement("tr");
            
            // Pos
            const tdPos = document.createElement("td");
            tdPos.textContent = idx + 1;
            tdPos.style.fontWeight = "bold";
            tr.appendChild(tdPos);
            
            // Cenário (Monospace String)
            const tdScen = document.createElement("td");
            tdScen.style.fontFamily = "monospace";
            tdScen.style.fontWeight = "600";
            tdScen.style.letterSpacing = "1.5px";
            tdScen.style.fontSize = "0.95rem";
            tdScen.textContent = scen.binaryString;
            tr.appendChild(tdScen);
            
            // Visual (LEDs coloridos)
            const tdVisual = document.createElement("td");
            // Centralizar e dar espaçamento
            tdVisual.style.display = "flex";
            tdVisual.style.gap = "5px";
            tdVisual.style.alignItems = "center";
            tdVisual.style.paddingTop = "0.75rem";
            
            for (let char of scen.binaryString) {
                const led = document.createElement("span");
                led.className = char === "1" ? "binary-dot occurred" : "binary-dot not-occurred";
                led.title = char === "1" ? "Ocorreu" : "Não Ocorreu";
                tdVisual.appendChild(led);
            }
            tr.appendChild(tdVisual);
            
            // Freq (%)
            const tdFreq = document.createElement("td");
            tdFreq.style.textAlign = "right";
            tdFreq.style.fontWeight = "600";
            tdFreq.textContent = `${scen.percentage.toFixed(2)}%`;
            tr.appendChild(tdFreq);
            
            tbody.appendChild(tr);
        });
    }
}

// Alterna entre a visualização de resultados padrão (Dashboards/Gráficos) e ortogonal
function toggleResultsView(isOrthoMode) {
    const standardElements = document.querySelectorAll(".standard-result-element");
    const orthoContainer = document.getElementById("orthogonal-results-container");
    
    if (isOrthoMode) {
        // Esconder padrão, mostrar ortogonal
        standardElements.forEach(el => {
            el.style.setProperty("display", "none", "important");
        });
        if (orthoContainer) {
            orthoContainer.style.setProperty("display", "flex", "important");
        }
    } else {
        // Mostrar padrão, esconder ortogonal
        standardElements.forEach(el => {
            if (el.classList.contains("results-grid") || el.classList.contains("charts-grid")) {
                el.style.setProperty("display", "grid", "important");
            } else {
                el.style.setProperty("display", "block", "important");
            }
        });
        if (orthoContainer) {
            orthoContainer.style.setProperty("display", "none", "important");
        }
    }
}

// --- FUNÇÕES DE AUXÍLIO DE AUTENTICAÇÃO (SUPABASE) ---

// Verifica se há uma sessão ativa ao carregar a página
async function checkSession() {
    if (!supabaseClient) return;

    const isRecovery = window.location.hash.includes("type=recovery");

    // Escuta mudanças no estado de login em tempo real
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

// Busca o perfil do usuário na tabela do banco de dados e ajusta a interface
async function fetchProfileAndSetupUI(user) {
    if (!supabaseClient) return;
    
    // Se o usuário está redefinindo a senha via link de e-mail, forçar tela de redefinição
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
        // Se der erro ao ler perfil, desloga por segurança
        await supabaseClient.auth.signOut();
        showAuthForm("login");
        return;
    }
    
    currentUserProfile = data;
    
    const now = new Date();
    const isExpired = data.expires_at ? new Date(data.expires_at) < now : false;
    
    if (!data.is_approved || isExpired) {
        // Autenticado, mas não aprovado pelo administrador ou expirado
        showAuthForm("pending", user.email, isExpired);
    } else {
        // Autenticado e Aprovado
        hideAuthOverlay();
        
        // Exibe o painel de administrador se for admin
        const navAdmin = document.getElementById("nav-item-admin");
        if (data.is_admin) {
            if (navAdmin) navAdmin.style.display = "block";
            loadAdminUsersList();
        } else {
            if (navAdmin) navAdmin.style.display = "none";
        }
    }
}

// Mostra o formulário de login/cadastro/recuperação ou pendência correto na overlay
function showAuthForm(view, email = "", isExpired = false) {
    const overlay = document.getElementById("auth-overlay");
    const formLogin = document.getElementById("form-login");
    const formRegister = document.getElementById("form-register");
    const formForgot = document.getElementById("form-forgot");
    const formUpdatePassword = document.getElementById("form-update-password");
    const authPending = document.getElementById("auth-pending");
    
    if (overlay) overlay.style.display = "flex";
    
    if (formLogin) formLogin.style.display = (view === "login") ? "flex" : "none";
    if (formRegister) formRegister.style.display = (view === "register") ? "flex" : "none";
    if (formForgot) formForgot.style.display = (view === "forgot") ? "flex" : "none";
    if (formUpdatePassword) formUpdatePassword.style.display = (view === "update-password") ? "flex" : "none";
    if (authPending) authPending.style.display = (view === "pending") ? "flex" : "none";
    
    if (view === "pending") {
        const emailEl = document.getElementById("pending-user-email");
        if (emailEl) emailEl.textContent = email;

        // Customizar mensagem com base no status (Expirado vs Pendente)
        const icon = authPending.querySelector("i");
        const h3 = authPending.querySelector("h3");
        const p = authPending.querySelector("p");
        
        if (isExpired) {
            if (icon) {
                icon.className = "fa-solid fa-hourglass-end";
                icon.style.color = "var(--accent-danger)";
            }
            if (h3) h3.textContent = "Acesso Expirado";
            if (p) p.textContent = "O seu período de acesso temporário expirou. Entre em contato com o administrador para renovar o seu acesso.";
        } else {
            if (icon) {
                icon.className = "fa-solid fa-clock-rotate-left";
                icon.style.color = "var(--accent-secondary)";
            }
            if (h3) h3.textContent = "Acesso Pendente";
            if (p) p.innerHTML = "O seu cadastro foi realizado com sucesso, mas ainda precisa ser <b>aprovado pelo administrador</b> antes de você acessar a plataforma.";
        }
    }
}

// Oculta a overlay de autenticação para liberar acesso ao simulador
function hideAuthOverlay() {
    const overlay = document.getElementById("auth-overlay");
    if (overlay) overlay.style.display = "none";
}

// Carrega a lista de usuários pendentes e aprovados no Painel do Administrador
async function loadAdminUsersList() {
    const tbodyPending = document.getElementById("tbody-pending-users");
    const tbodyApproved = document.getElementById("tbody-approved-users");
    if (!tbodyPending || !tbodyApproved) return;
    
    tbodyPending.innerHTML = "";
    tbodyApproved.innerHTML = "";

    const { data: users, error } = await supabaseClient
        .from('profiles')
        .select('*')
        .order('email', { ascending: true });
    
    if (error) {
        console.error("Erro ao listar usuários:", error);
        return;
    }

    users.forEach(user => {
        if (user.id === currentUser.id) {
            // Renderiza o próprio administrador na tabela sem ações administrativas
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${user.email} (Você)</td>
                <td style="text-align: center;"><span class="badge" style="background: var(--accent-success); color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: bold;">ADMIN</span></td>
                <td style="text-align: center;"><span style="color: var(--text-muted); font-size: 0.9rem;">Vitalício</span></td>
                <td style="text-align: center; color: var(--text-muted); font-size: 0.8rem; font-style: italic;">Inalterável</td>
            `;
            tbodyApproved.appendChild(tr);
            return;
        }

        const tr = document.createElement("tr");
        if (!user.is_approved) {
            // Usuários pendentes de aprovação
            tr.innerHTML = `
                <td>${user.email}</td>
                <td style="text-align: center;">
                    <select class="custom-select duration-select" data-id="${user.id}" style="font-size: 0.8rem; padding: 0.3rem 0.5rem; width: 100%; border-radius: 6px; background: rgba(255,255,255,0.03); color: var(--text-primary); border: 1px solid var(--border-color);">
                        <option value="lifetime">Vitalício</option>
                        <option value="1h">1 hora</option>
                        <option value="1d">1 dia</option>
                        <option value="7d">7 dias</option>
                        <option value="30d">30 dias</option>
                    </select>
                </td>
                <td style="text-align: center;">
                    <button class="btn btn-success btn-small btn-approve-user" data-id="${user.id}" style="background-color: var(--accent-success); border-color: transparent; cursor: pointer; color: white;">
                        <i class="fa-solid fa-check"></i> Aprovar Acesso
                    </button>
                </td>
            `;
            tbodyPending.appendChild(tr);
        } else {
            // Usuários já aprovados
            const badge = user.is_admin ? "ADMIN" : "USUÁRIO";
            const badgeColor = user.is_admin ? "var(--accent-success)" : "rgba(255,255,255,0.08)";
            const badgeTextColor = user.is_admin ? "#ffffff" : "var(--text-primary)";
            const roleBtnText = user.is_admin ? "Remover Admin" : "Tornar Admin";
            
            // Formatar validade do acesso
            let validityText = "";
            if (!user.expires_at) {
                validityText = `<span style="color: var(--text-muted); font-size: 0.9rem;">Vitalício</span>`;
            } else {
                const expiryDate = new Date(user.expires_at);
                const now = new Date();
                const formattedDate = expiryDate.toLocaleString();
                if (expiryDate < now) {
                    validityText = `<span style="color: var(--accent-danger); font-weight: 600; font-size: 0.9rem;"><i class="fa-solid fa-hourglass-end"></i> Expirado (${formattedDate})</span>`;
                } else {
                    validityText = `<span style="font-weight: 500; font-size: 0.9rem;">${formattedDate}</span>`;
                }
            }
            
            tr.innerHTML = `
                <td>${user.email}</td>
                <td style="text-align: center;">
                    <span class="badge" style="background: ${badgeColor}; color: ${badgeTextColor} !important; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: bold;">${badge}</span>
                </td>
                <td style="text-align: center;">
                    ${validityText}
                </td>
                <td style="text-align: center; display: flex; gap: 0.5rem; justify-content: center; align-items: center;">
                    <button class="btn btn-secondary btn-small btn-toggle-admin-user" data-id="${user.id}" data-admin="${user.is_admin}" style="cursor: pointer;">
                        ${roleBtnText}
                    </button>
                    <button class="btn btn-danger btn-small btn-reject-user" data-id="${user.id}" style="background-color: var(--accent-danger); border-color: transparent; color: white; cursor: pointer;">
                        <i class="fa-solid fa-user-slash"></i> Revogar Acesso
                    </button>
                </td>
            `;
            tbodyApproved.appendChild(tr);
        }
    });

    // Associar os eventos das ações administrativas
    document.querySelectorAll(".btn-approve-user").forEach(btn => {
        btn.addEventListener("click", async () => {
            const userId = btn.getAttribute("data-id");
            
            // Ler a duração selecionada
            const selectDuration = document.querySelector(`.duration-select[data-id="${userId}"]`);
            const duration = selectDuration ? selectDuration.value : "lifetime";
            
            let expires_at = null;
            if (duration !== "lifetime") {
                const now = Date.now();
                let durationMs = 0;
                if (duration === "1h") durationMs = 60 * 60 * 1000;
                else if (duration === "1d") durationMs = 24 * 60 * 60 * 1000;
                else if (duration === "7d") durationMs = 7 * 24 * 60 * 60 * 1000;
                else if (duration === "30d") durationMs = 30 * 24 * 60 * 60 * 1000;
                
                expires_at = new Date(now + durationMs).toISOString();
            }
            
            const { error } = await supabaseClient
                .from('profiles')
                .update({ is_approved: true, expires_at: expires_at })
                .eq('id', userId);
                
            if (error) {
                alert("Erro ao aprovar usuário: " + error.message);
            } else {
                loadAdminUsersList();
            }
        });
    });

    document.querySelectorAll(".btn-reject-user").forEach(btn => {
        btn.addEventListener("click", async () => {
            if (confirm("Tem certeza que deseja revogar o acesso deste usuário? Ele será deslogado e bloqueado imediatamente.")) {
                const userId = btn.getAttribute("data-id");
                const { error } = await supabaseClient.from('profiles').update({ is_approved: false }).eq('id', userId);
                if (error) {
                    alert("Erro ao revogar usuário: " + error.message);
                } else {
                    loadAdminUsersList();
                }
            }
        });
    });

    document.querySelectorAll(".btn-toggle-admin-user").forEach(btn => {
        btn.addEventListener("click", async () => {
            const userId = btn.getAttribute("data-id");
            const isAdmin = btn.getAttribute("data-admin") === "true";
            const { error } = await supabaseClient.from('profiles').update({ is_admin: !isAdmin }).eq('id', userId);
            if (error) {
                alert("Erro ao alterar privilégio: " + error.message);
            } else {
                loadAdminUsersList();
            }
        });
    });
}


