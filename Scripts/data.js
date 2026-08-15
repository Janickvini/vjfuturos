/* ==========================================================================
   PORTAL PROFISSIONAL - DR. VINÍCIUS JANICK
   Arquivo de Conteúdos Dinâmicos (Bases de Dados do Site)
   
   COMO ATUALIZAR ESTE ARQUIVO:
   - Para adicionar um novo item (Publicação ou Artigo de Blog), copie um bloco existente,
     cole logo abaixo (dentro dos colchetes [ ]) e edite os textos mantendo as aspas.
   ========================================================================== */

// --- 1. BASE DE DADOS DE PUBLICAÇÕES EM DESTAQUE (Livros, Teses, Capítulos, Artigos e Relatórios) ---
const publicationsData = [
    {
        ano: "2026",
        tipo: "artigo",
        titulo: "Externalities and Misaligned Incentives in Sustainable Solid Waste Management: An Economic Theory Perspective for Policy Design in Brazil",
        autores: "Espinoza, D. F., Rebehy, P. C. P. W., Salgado Junior, A. P., Barossi Filho, M., Janick, V. R. F., & Novi, J. C.",
        fonte: "Sustainability, 18(16), 8296.",
        link: "https://doi.org/10.3390/su18168296",
        status: "DOI"
    },
    {
        ano: "2026",
        tipo: "livro",
        titulo: "Manual para Classificação e Redação de Sementes de Futuro",
        autores: "Janick, V. R. F.",
        fonte: "Ribeirão Preto: Edição do Autor.",
        link: "https://doi.org/10.5281/zenodo.18078802",
        status: "Zenodo"
    },
    {
        ano: "2025",
        tipo: "tese",
        titulo: "Proposta de método misto para identificação de sementes de futuro em cenários para planejamento em defesa: experiências do Brasil e dos EUA",
        autores: "Janick, V. R. F.",
        fonte: "Tese de Doutorado. Faculdade de Economia, Administração e Contabilidade de Ribeirão Preto, Universidade de São Paulo (FEA-RP/USP).",
        link: "https://doi.org/10.11606/T.96.2025.tde-22012026-180139",
        status: "Link"
    },
    {
        ano: "2023",
        tipo: "relatorio",
        titulo: "Cenários para Revisão do Planejamento Estratégico da AMAZUL 2024",
        autores: "Lauro, A., Correa, C. R., Janick, V. R. F., Scoton, S., Silva, J. G. L. E., Santos, J. L., & Souza, N. V.",
        fonte: "Amazônia Azul Tecnologias de Defesa S.A. (Relatório Técnico Conclusivo).",
        link: "https://www.researchgate.net/publication/408095345_Relatorio_Tecnico_Conclusivo_-_Cenarios_Prospectivos_-_AMAZUL_2043",
        status: "Link"
    },
    {
        ano: "2022",
        tipo: "relatorio",
        titulo: "Cenários Prospectivos para a Marinha do Brasil - 2045",
        autores: "Lauro, A., Correa, C. R., Janick, V. R. F., Silva, J. G. L. E., & Souza, N. V.",
        fonte: "Estado-Maior da Armada, Marinha do Brasil (Relatório Técnico Conclusivo).",
        link: "",
        status: "Restrito"
    },
    {
        ano: "2021",
        tipo: "livro",
        titulo: "Explorando Futuros Possíveis: Fundamentos e práticas sobre ferramentas prospectivas",
        autores: "Janick, V. R. F., Santos, J. L., & Martins, C. C. B. (Orgs.)",
        fonte: "Rio de Janeiro: Alpheratz.",
        link: "http://doi.org/10.5281/zenodo.15109770",
        status: "Zenodo"
    },
    {
        ano: "2021",
        tipo: "capitulo",
        titulo: "Estudos Prospectivos e defesa no Brasil: práticas recentes e possíveis avanços",
        autores: "Correa, C. R., & Janick, V. R. F.",
        fonte: "In: Santos, T. (Ed.), Economia do Mar e Poder Marítimo. Rio de Janeiro: Alpheratz, pp. 47–64.",
        link: "",
        status: "Impresso"
    },
    {
        ano: "2021",
        tipo: "capitulo",
        titulo: "Por que estudar o futuro?",
        autores: "Janick, V. R. F.",
        fonte: "In: Janick, V. R. F. et al. (Eds.), Explorando Futuros Possíveis. Rio de Janeiro: Alpheratz, pp. 23–34.",
        link: "",
        status: "Impresso"
    },
    {
        ano: "2021",
        tipo: "capitulo",
        titulo: "Impacto Cruzado (Método Prospectivo)",
        autores: "Janick, V. R. F.",
        fonte: "In: Janick, V. R. F. et al. (Eds.), Explorando Futuros Possíveis. Rio de Janeiro: Alpheratz, pp. 65–70.",
        link: "",
        status: "Impresso"
    },
    {
        ano: "2021",
        tipo: "capitulo",
        titulo: "Cenários Shell: mais que água mole em pedra dura",
        autores: "Leite, L. M. K., & Janick, V. R. F.",
        fonte: "In: Janick, V. R. F. et al. (Eds.), Explorando Futuros Possíveis. Rio de Janeiro: Alpheratz, pp. 95–102.",
        link: "",
        status: "Impresso"
    },
    {
        ano: "2020",
        tipo: "artigo",
        titulo: "A não proliferação de armas nucleares e o submarino de propulsão nuclear: Uma proposta de simulação",
        autores: "Flor, C. R. A., Gitahy, P. F. S. C. R., Araujo, C. A., Guimarães, V. V. S., & Janick, V. R. F.",
        fonte: "Revista da Escola de Guerra Naval (Ed. Português), 26(3), 739–774.",
        link: "http://doi.org/10.21544/1809-3191.v26n3.p739-774",
        status: "DOI"
    }
];
