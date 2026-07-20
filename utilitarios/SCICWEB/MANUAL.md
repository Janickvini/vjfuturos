# 📖 Manual de Referência e Manutenção - IC Web

Este é um guia rápido para ajudar você a lembrar da estrutura do projeto, links importantes e onde alterar as configurações principais caso fique muito tempo longe do código.

---

## 🚀 1. Como Atualizar o Site Público

O site está configurado no **GitHub Pages**. Toda vez que você fizer alterações locais:
1. Acesse o seu repositório no GitHub.
2. Clique em **Add file > Upload files**.
3. Arraste e solte estes 3 arquivos da pasta:
   * `index.html` (Estrutura do site e telas de login/bloqueio)
   * `script.js` (Toda a lógica matemática da simulação e regras de login)
   * `style.css` (Cores, modo claro/escuro e visual do site)
4. Clique em **Commit changes** no fim da página. Em 1 minuto o site estará atualizado no link.

---

## 🔑 2. Credenciais e Banco de Dados (Supabase)

O site está integrado ao banco de dados do **Supabase** para controle de logins e acessos.
* **URL do Projeto:** `https://nbogqyaicjpwkdyyejko.supabase.co`
* **Local das Tabelas:** No menu do Supabase, clique em **Table Editor > profiles**.
* **Como alterar as chaves da API no Código:**
  Abra o arquivo `script.js`. As chaves ficam logo no topo (linhas 2 e 3):
  * `const supabaseUrl = 'SUA_URL_AQUI';`
  * `const supabaseKey = 'SUA_CHAVE_ANON_AQUI';`
* **Como tornar um novo usuário Administrador:** 
  Na tabela `profiles`, procure o e-mail do usuário e marque a coluna `is_admin` como `true`.
* **Como zerar/modificar expiração de alguém:** 
  Altere a coluna `expires_at` (vazia = vitalício; data passada = bloqueia o acesso imediatamente).

---

## 📂 3. Onde Ajustar as Coisas no Código

Se você precisar corrigir ou alterar comportamentos específicos:

### 🎨 Design e Cores (style.css)
* **Modo Claro / Modo Escuro:** As cores gerais do site são controladas por variáveis CSS nas primeiras 30 linhas (ex: `--bg-main`, `--text-primary`). As cores do modo claro são sobrescritas sob a classe `body.light-theme` no final do arquivo.

### 📐 Estrutura Física (index.html)
* **Telas de Login e Acesso Pendente/Expirado:** Localizadas na overlay de identificação no topo do arquivo (linhas 20 a 70).
* **Seções do Painel:** Cada aba (Configuração, Matriz Ocorrência, Matriz Não Ocorrência, Resultados, Administrador) possui um bloco `<section id="section-...">`.

### 🧠 Lógica e Matemática (script.js)
* **Fórmula do Impacto Cruzado:** Fica dentro da função `runSimulation()`. Ela lê a ordem dos passos, calcula as probabilidades dinâmicas com base nos fatores de impacto e roda o laço de Monte Carlo.
* **Validação de Logins e Sessão:** Fica no final do arquivo nas funções `fetchProfileAndSetupUI()` e `checkSession()`.

---

## 📈 4. Onde Encontrar Suporte no Supabase
Caso queira alterar as regras de cadastro ou ver os e-mails registrados:
* Acesse a aba **Authentication > Users** no painel do Supabase. Todos os usuários criados no site aparecem listados lá.
