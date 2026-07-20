// Estado Global da Aplicação (Versão de Teste Limitada)
let nEventos = 5;
let nSimulacoes = 1000;
let events = [];
let matrixOcorrencia = [];
let matrixNaoOcorrencia = [];

// Resultados da última simulação
let simResults = {
    raw: [],      // { index: number, outcomes: Array }
    ranking: [],  // { binaryString: string, count: number, percentage: number }
    eventSimProbs: [] // Array de probabilidades simuladas finais
};

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
    loadDefaultBlankState();
    
    // Inicializar tema a partir do localStorage
    const savedTheme = localStorage.getItem("theme") || "dark";
    if (savedTheme === "light") {
        document.body.classList.add("light-theme");
        updateThemeToggleUI("light");
    } else {
        updateThemeToggleUI("dark");
    }
}

// Carrega o estado padrão em branco (vazio)
function loadDefaultBlankState() {
    nEventos = 5;
    nSimulacoes = 1000;
    
    document.getElementById("nEventos").value = nEventos;
    document.getElementById("nSimulacoes").value = nSimulacoes;

    events = [];
    for (let i = 0; i < nEventos; i++) {
        events.push({
            id: i + 1,
            name: "", // Vazio para o usuário digitar
            probInicial: 0.5,
            forceState: 0
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

    // Mudança no número de eventos (Limitado a 5 na versão de teste)
    const inputNEventos = document.getElementById("nEventos");
    inputNEventos.addEventListener("change", () => {
        let val = parseInt(inputNEventos.value);
        if (isNaN(val) || val < 2) val = 2;
        if (val > 5) {
            alert("A Versão de Teste é limitada a no máximo 5 eventos. Assine a Versão PRO para simular até 15 eventos!");
            val = 5;
        }
        inputNEventos.value = val;
        updateEventCount(val);
    });

    // Mudança no número de simulações (Limitado a 1.000 na versão de teste)
    const inputNSimulacoes = document.getElementById("nSimulacoes");
    inputNSimulacoes.addEventListener("change", () => {
        let val = parseInt(inputNSimulacoes.value);
        if (isNaN(val) || val < 1) val = 1;
        if (val > 1000) {
            alert("A Versão de Teste é limitada a no máximo 1.000 simulações. Assine a Versão PRO para rodar até 1.000.000 de simulações!");
            val = 1000;
        }
        inputNSimulacoes.value = val;
        nSimulacoes = val;
    });

    // Botão de rodar simulação
    document.getElementById("btn-run-simulation").addEventListener("click", runSimulation);

    // Botões de exportação/importação de JSON de parâmetros
    document.getElementById("btn-export-config").addEventListener("click", exportConfigJSON);
    document.getElementById("btn-import-config").addEventListener("click", () => {
        document.getElementById("file-import-input").click();
    });
    document.getElementById("file-import-input").addEventListener("change", importConfigJSON);

    // Alternar tema (Modo Claro / Modo Escuro)
    const btnToggleTheme = document.getElementById("btn-toggle-theme");
    if (btnToggleTheme) {
        btnToggleTheme.addEventListener("click", toggleTheme);
    }
}

// Redimensiona o cenário adicionando/removendo eventos dinamicamente
function updateEventCount(newCount) {
    const oldCount = nEventos;
    nEventos = newCount;

    // Ajustar array de eventos
    if (newCount > oldCount) {
        for (let i = oldCount; i < newCount; i++) {
            events.push({
                id: i + 1,
                name: "",
                probInicial: 0.5,
                forceState: 0
            });
        }
    } else if (newCount < oldCount) {
        events = events.slice(0, newCount);
    }

    // Ajustar matrizes (Ocorrência e Não Ocorrência)
    [matrixOcorrencia, matrixNaoOcorrencia].forEach(matrix => {
        // Redimensionar linhas
        if (newCount > oldCount) {
            for (let r = 0; r < newCount; r++) {
                if (r < oldCount) {
                    // Adiciona colunas às linhas existentes
                    for (let c = oldCount; c < newCount; c++) {
                        matrix[r].push(1.0);
                    }
                } else {
                    // Adiciona novas linhas completas
                    matrix.push(new Array(newCount).fill(1.0));
                }
            }
        } else if (newCount < oldCount) {
            // Remove linhas excedentes
            matrix.splice(newCount);
            // Remove colunas excedentes de cada linha
            for (let r = 0; r < newCount; r++) {
                matrix[r] = matrix[r].slice(0, newCount);
            }
        }
    });

    renderEventsTable();
    renderMatrix("ocorrencia");
    renderMatrix("nao-ocorrencia");
}

// Renderiza a lista de eventos com inputs de nome e prob inicial
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
        inputName.placeholder = `Descreva o evento ${evt.id}...`;
        inputName.className = "table-input";
        inputName.addEventListener("change", (e) => {
            evt.name = e.target.value.trim();
            updateMatrixHeaders();
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

        tbody.appendChild(tr);
    });
}

// Renderiza a matriz (Ocorrência ou Não Ocorrência)
function renderMatrix(type) {
    const table = (type === "ocorrencia") ? document.getElementById("matrix-ocorrencia") : document.getElementById("matrix-nao-ocorrencia");
    const matrix = (type === "ocorrencia") ? matrixOcorrencia : matrixNaoOcorrencia;
    
    table.innerHTML = "";

    // 1. Linha de cabeçalho das colunas (th)
    const headerRow = document.createElement("tr");
    
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
                    e.target.value = val.toFixed(4);
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
        const colO = document.getElementById(`header-ocorrencia-col-${i}`);
        const colNO = document.getElementById(`header-nao-ocorrencia-col-${i}`);
        if (colO) colO.innerHTML = `<span class="event-badge mb-1">E${i+1}</span><div style="font-size: 0.75rem; font-weight:normal; max-width: 90px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${events[i].name || 'Evento ' + (i+1)}</div>`;
        if (colNO) colNO.innerHTML = `<span class="event-badge mb-1">E${i+1}</span><div style="font-size: 0.75rem; font-weight:normal; max-width: 90px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${events[i].name || 'Evento ' + (i+1)}</div>`;

        const rowO = document.getElementById(`header-ocorrencia-row-${i}`);
        const rowNO = document.getElementById(`header-nao-ocorrencia-row-${i}`);
        if (rowO) rowO.innerHTML = `<span class="event-badge">E${i+1}</span> <span style="font-size: 0.8rem; font-weight:normal;">${events[i].name || 'Evento ' + (i+1)}</span>`;
        if (rowNO) rowNO.innerHTML = `<span class="event-badge">E${i+1}</span> <span style="font-size: 0.8rem; font-weight:normal;">${events[i].name || 'Evento ' + (i+1)}</span>`;
    }
}

// Função para gerar a sequência de avaliação aleatória (sem passos fixos na versão de teste)
function getEvaluationSequence() {
    const sequence = [];
    for (let i = 0; i < nEventos; i++) {
        sequence.push(i);
    }
    // Algoritmo Fisher-Yates
    for (let i = sequence.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = sequence[i];
        sequence[i] = sequence[j];
        sequence[j] = temp;
    }
    return sequence;
}

// EXECUTA A SIMULAÇÃO MONTE CARLO (MÉTODO ASYNC POR LOTES)
function runSimulation() {
    if (events.length === 0) {
        alert("Cadastre eventos antes de iniciar a simulação.");
        return;
    }

    // Exibir loading overlay
    const overlay = document.getElementById("loading-overlay");
    const progressBar = document.getElementById("loading-progress-bar");
    const progressText = document.getElementById("loading-progress-text");
    overlay.style.display = "flex";

    const startTime = performance.now();
    let processTime = 0;
    
    simResults.raw = [];
    simResults.ranking = [];
    simResults.eventSimProbs = new Array(nEventos).fill(0);
    
    let simCount = 0;
    const batchSize = 500; // Menor na versão gratuita por segurança

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
            
            // Atualizar os Cards Estatísticos do Dashboard
            document.getElementById("stat-simulations").textContent = nSimulacoes.toLocaleString();
            document.getElementById("stat-time").textContent = `${processTime} ms`;
            
            const topScen = simResults.ranking[0];
            if (topScen) {
                document.getElementById("stat-top-scenario").innerHTML = `Cenário: <b>${topScen.binaryString}</b> <br>Frequência: <b>${topScen.percentage.toFixed(2)}%</b>`;
            } else {
                document.getElementById("stat-top-scenario").textContent = "Nenhum";
            }

            renderRankingTable();
            renderCharts();

            // Mover visualização para a aba de resultados
            document.getElementById("nav-item-results").click();
        }
    }

    // Loop interno de simulação por lotes assíncronos
    function simulateBatch() {
        const limit = Math.min(nSimulacoes, simCount + batchSize);

        for (let sim = simCount; sim < limit; sim++) {
            const currentProbs = events.map(e => e.probInicial);
            const seq = getEvaluationSequence();
            const outcomes = new Array(nEventos).fill(null);

            for (let step = 0; step < nEventos; step++) {
                const currentEvent = seq[step];
                const evtConfig = events[currentEvent];
                
                let occurs;
                if (evtConfig.forceState === 1) {
                    occurs = true;
                } else if (evtConfig.forceState === 2) {
                    occurs = false;
                } else {
                    occurs = Math.random() <= currentProbs[currentEvent];
                }

                outcomes[currentEvent] = occurs ? 1 : 0;

                // Atualizar probabilidade de todos os OUTROS eventos usando a fórmula clássica do VBA
                for (let i = 0; i < nEventos; i++) {
                    if (i !== currentEvent) {
                        const p = currentProbs[i];
                        const factor = occurs ? matrixOcorrencia[currentEvent][i] : matrixNaoOcorrencia[currentEvent][i];
                        
                        const den = (1 - p) + (p * factor);
                        if (den === 0) {
                            currentProbs[i] = 0;
                        } else {
                            currentProbs[i] = (p * factor) / den;
                        }
                        
                        currentProbs[i] = Math.max(0, Math.min(1, currentProbs[i]));
                    }
                }
            }

            simResults.raw.push({
                index: sim + 1,
                outcomes: outcomes,
                order: seq.map(idx => `E${idx + 1}`)
            });

            // Somar ocorrências gerais para cálculo de frequências simuladas finais
            for (let i = 0; i < nEventos; i++) {
                if (outcomes[i] === 1) {
                    simResults.eventSimProbs[i]++;
                }
            }
        }

        simCount = limit;
        
        if (simCount < nSimulacoes) {
            requestAnimationFrame(simulateBatch);
        } else {
            const endTime = performance.now();
            processTime = Math.round(endTime - startTime);
            
            for (let i = 0; i < nEventos; i++) {
                simResults.eventSimProbs[i] = simResults.eventSimProbs[i] / nSimulacoes;
            }

            processScenarioRanking();
            calculationsComplete = true;
            checkIfDone();
        }
    }

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

    // Ordenar pelo cenário mais provável para o menos provável
    ranking.sort((a, b) => b.count - a.count);
    simResults.ranking = ranking;
}

// Renderiza a tabela de ranking de cenários
function renderRankingTable() {
    const tbody = document.getElementById("tbody-scenarios-ranking");
    tbody.innerHTML = "";

    // Renderizar apenas os 5 primeiros cenários mais prováveis na versão de teste
    const limit = Math.min(simResults.ranking.length, 5);
    for (let idx = 0; idx < limit; idx++) {
        const scen = simResults.ranking[idx];
        const tr = document.createElement("tr");

        // Coluna Posição
        const tdPos = document.createElement("td");
        tdPos.innerHTML = `<strong>${idx + 1}º</strong>`;
        tr.appendChild(tdPos);

        // Coluna Cenário (Binário) + Representação por Leds de Status
        const tdBin = document.createElement("td");
        
        let ledsHtml = '<div style="display: flex; gap: 0.35rem; align-items: center; margin-left: 0.75rem; display: inline-flex;">';
        for (let i = 0; i < nEventos; i++) {
            const state = parseInt(scen.binaryString[i]);
            const classLed = state === 1 ? 'occurred' : 'not-occurred';
            ledsHtml += `<span class="binary-dot ${classLed}" style="width: 10px; height: 10px; min-width: 10px; min-height: 10px;" title="E${i+1}: ${state === 1 ? 'Ocorreu' : 'Não Ocorreu'}"></span>`;
        }
        ledsHtml += '</div>';

        tdBin.innerHTML = `
            <div style="display: flex; align-items: center;">
                <code style="font-size: 1rem; color: var(--accent-primary); letter-spacing: 2px;">${scen.binaryString}</code>
                ${ledsHtml}
            </div>
        `;
        tr.appendChild(tdBin);

        // Coluna Frequência Absoluta
        const tdAbs = document.createElement("td");
        tdAbs.textContent = scen.count.toLocaleString();
        tr.appendChild(tdAbs);

        // Coluna Frequência Relativa (%)
        const tdRel = document.createElement("td");
        tdRel.innerHTML = `<strong>${scen.percentage.toFixed(3)}%</strong>`;
        tr.appendChild(tdRel);

        tbody.appendChild(tr);
    }

    // Se houver mais cenários, exibir mensagem de Upgrade PRO
    if (simResults.ranking.length > 5) {
        const trUp = document.createElement("tr");
        trUp.style.background = "rgba(92, 103, 222, 0.05)";
        trUp.innerHTML = `
            <td colspan="4" style="text-align: center; padding: 1.5rem; color: var(--text-secondary);">
                <i class="fa-solid fa-lock" style="margin-right: 0.5rem; color: var(--warning);"></i> 
                Mais ${simResults.ranking.length - 5} cenários calculados estão ocultos na versão de teste. 
                <strong style="color: var(--accent-primary); cursor: pointer;">Assine a versão PRO para desbloquear a visualização completa!</strong>
            </td>
        `;
        tbody.appendChild(trUp);
    }
}

// Renderiza a tabela de Logs Brutos
function renderRawLogsTable() {
    const tbody = document.getElementById("tbody-raw-logs");
    tbody.innerHTML = "";

    const totalLogs = simResults.raw.length;
    const maxPage = Math.ceil(totalLogs / LOGS_PER_PAGE);
    if (currentLogPage > maxPage) currentLogPage = maxPage || 1;

    const startIdx = (currentLogPage - 1) * LOGS_PER_PAGE;
    const endIdx = Math.min(startIdx + LOGS_PER_PAGE, totalLogs);

    // Atualizar info de paginação
    document.getElementById("log-pagination-info").textContent = `Mostrando ${totalLogs === 0 ? 0 : startIdx + 1}-${endIdx} de ${totalLogs}`;

    for (let i = startIdx; i < endIdx; i++) {
        const log = simResults.raw[i];
        const tr = document.createElement("tr");

        // ID Simulação
        const tdId = document.createElement("td");
        tdId.textContent = log.index;
        tr.appendChild(tdId);

        // Cenário Resultante (Binário)
        const binStr = log.outcomes.join("");
        const tdBin = document.createElement("td");
        tdBin.innerHTML = `<code style="letter-spacing: 1px; color: var(--text-secondary);">${binStr}</code>`;
        tr.appendChild(tdBin);

        // Representação Visual (Leds de status)
        const tdLeds = document.createElement("td");
        let ledsHtml = '<div style="display: flex; gap: 0.35rem; align-items: center;">';
        log.outcomes.forEach((state, eIdx) => {
            const classLed = state === 1 ? 'occurred' : 'not-occurred';
            ledsHtml += `<span class="binary-dot ${classLed}" title="E${eIdx+1}: ${state === 1 ? 'Ocorreu' : 'Não Ocorreu'}"></span>`;
        });
        ledsHtml += '</div>';
        tdLeds.innerHTML = ledsHtml;
        tr.appendChild(tdLeds);

        // Ordem Sorteada de Avaliação
        const tdOrder = document.createElement("td");
        tdOrder.innerHTML = `<span style="font-size:0.85rem; color: var(--text-muted);">${log.order.join(" → ")}</span>`;
        tr.appendChild(tdOrder);

        tbody.appendChild(tr);
    }
}

// Renderiza ou Atualiza os gráficos analíticos (Chart.js)
function renderCharts() {
    const isLight = document.body.classList.contains("light-theme");
    const textColor = isLight ? "#0F172A" : "#F3F4F6";
    const secTextColor = isLight ? "#475569" : "#9CA3AF";
    const gridColor = isLight ? "rgba(15, 23, 42, 0.08)" : "rgba(255, 255, 255, 0.05)";
    
    // Gráfico 1: Probabilidades Finais Acumuladas
    const ctxProb = document.getElementById("chart-probabilities").getContext("2d");
    const labelsProb = events.map(e => `E${e.id} (${e.name || 'Evento ' + e.id})`);
    
    // Preparar dados do dataset
    const initialProbs = events.map(e => e.probInicial);
    const finalProbs = simResults.eventSimProbs;

    if (chartProbabilities) {
        chartProbabilities.destroy();
    }

    chartProbabilities = new Chart(ctxProb, {
        type: 'bar',
        data: {
            labels: labelsProb,
            datasets: [
                {
                    label: 'Probabilidade Inicial (Declarada)',
                    data: initialProbs,
                    backgroundColor: isLight ? 'rgba(15, 23, 42, 0.15)' : 'rgba(255, 255, 255, 0.15)',
                    borderColor: isLight ? 'rgba(15, 23, 42, 0.3)' : 'rgba(255, 255, 255, 0.4)',
                    borderWidth: 1,
                    barPercentage: 0.6
                },
                {
                    label: 'Probabilidade Acumulada (Simulada)',
                    data: finalProbs,
                    backgroundColor: '#5C67DE',
                    borderColor: '#5C67DE',
                    borderWidth: 1,
                    barPercentage: 0.6
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: { color: textColor, font: { family: 'Inter' } }
                }
            },
            scales: {
                y: {
                    min: 0,
                    max: 1.0,
                    grid: { color: gridColor },
                    ticks: { color: secTextColor, format: { style: 'percent' } }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: secTextColor }
                }
            }
        }
    });

    // Gráfico 2: Distribuição dos Cenários mais Prováveis (Top 5 na versão gratuita)
    const ctxScen = document.getElementById("chart-scenarios").getContext("2d");
    const topScenarios = simResults.ranking.slice(0, 5);
    const labelsScen = topScenarios.map(s => s.binaryString);
    const dataScen = topScenarios.map(s => s.percentage);

    if (chartScenarios) {
        chartScenarios.destroy();
    }

    chartScenarios = new Chart(ctxScen, {
        type: 'bar',
        data: {
            labels: labelsScen,
            datasets: [{
                label: 'Frequência Relativa (%)',
                data: dataScen,
                backgroundColor: 'rgba(92, 103, 222, 0.75)',
                borderColor: '#5C67DE',
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: {
                    min: 0,
                    grid: { color: gridColor },
                    ticks: { color: secTextColor }
                },
                y: {
                    grid: { display: false },
                    ticks: { color: textColor, font: { weight: 'bold', size: 12 } }
                }
            }
        }
    });
}

// Reseta a matriz para fatores neutros (1.0)
function resetMatrix(type) {
    const matrix = (type === "ocorrencia") ? matrixOcorrencia : matrixNaoOcorrencia;
    for (let r = 0; r < nEventos; r++) {
        for (let c = 0; c < nEventos; c++) {
            matrix[r][c] = 1.0;
        }
    }
    renderMatrix(type);
}

// Exporta as configurações de parâmetros atuais (JSON)
function exportConfigJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
        nEventos,
        nSimulacoes,
        events,
        matrixOcorrencia,
        matrixNaoOcorrencia
    }, null, 4));
    
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `config_scicweb_teste_${nEventos}eventos.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
}

// Importa as configurações do arquivo JSON
function importConfigJSON(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if (!data.nEventos || !data.events || !data.matrixOcorrencia || !data.matrixNaoOcorrencia) {
                throw new Error("Formato inválido do arquivo JSON.");
            }

            // Travas rígidas de importação na versão de teste
            let importedEventCount = parseInt(data.nEventos);
            if (importedEventCount > 5) {
                alert("A Versão de Teste suporta no máximo 5 eventos. O cenário importado foi limitado aos primeiros 5 eventos.");
                importedEventCount = 5;
            }
            nEventos = importedEventCount;
            document.getElementById("nEventos").value = nEventos;

            let importedSimCount = parseInt(data.nSimulacoes) || 1000;
            if (importedSimCount > 1000) {
                importedSimCount = 1000;
            }
            nSimulacoes = importedSimCount;
            document.getElementById("nSimulacoes").value = nSimulacoes;

            // Fazer o clamp nos arrays importados
            events = data.events.slice(0, nEventos);
            matrixOcorrencia = data.matrixOcorrencia.slice(0, nEventos).map(row => row.slice(0, nEventos));
            matrixNaoOcorrencia = data.matrixNaoOcorrencia.slice(0, nEventos).map(row => row.slice(0, nEventos));

            renderEventsTable();
            renderMatrix("ocorrencia");
            renderMatrix("nao-ocorrencia");

            alert("Configurações importadas com sucesso!");
        } catch (err) {
            alert(`Falha ao ler o arquivo JSON:\n${err.message}`);
        }
    };
    reader.readAsText(file);
    event.target.value = "";
}
