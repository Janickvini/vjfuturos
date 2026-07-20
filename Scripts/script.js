/* ==========================================================================
   Dr. Vinícius Janick - Website Compacto (Logica Dashboard-Portal)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- 0. Render Dynamic Content from data.js ---

    // Render Publications List
    const pubListContainer = document.getElementById('pub-list-container');
    if (pubListContainer && typeof publicationsData !== 'undefined') {
        pubListContainer.innerHTML = ''; // Clear container

        publicationsData.forEach(pub => {
            const row = document.createElement('div');
            row.className = 'pub-row glass';
            row.setAttribute('data-type', pub.tipo);

            // CSS badge class mapping
            let badgeClass = 'book';
            if (pub.tipo === 'artigo') badgeClass = 'article';
            else if (pub.tipo === 'capitulo') badgeClass = 'chapter';
            else if (pub.tipo === 'relatorio') badgeClass = 'report';
            else if (pub.tipo === 'tese') badgeClass = 'thesis';

            // Format tipo friendly label
            let typeLabel = pub.tipo.charAt(0).toUpperCase() + pub.tipo.slice(1);
            if (pub.tipo === 'capitulo') typeLabel = 'Capítulo';
            if (pub.tipo === 'relatorio') typeLabel = 'Relatório';
            if (pub.tipo === 'tese') typeLabel = 'Tese';

            // Action HTML (Anchor link or simple text status)
            let actionHtml = `<span class="row-status-text">${pub.status}</span>`;
            if (pub.link) {
                actionHtml = `<a href="${pub.link}" target="_blank" class="row-link">${pub.status}</a>`;
            } else if (pub.status === 'Restrito') {
                actionHtml = `<span class="row-status-text text-lock">Restrito</span>`;
            }

            row.innerHTML = `
                <div class="pub-row-meta">
                    <span class="pub-row-year">${pub.ano}</span>
                    <span class="pub-row-badge ${badgeClass}">${typeLabel}</span>
                </div>
                <div class="pub-row-content">
                    <h4 class="pub-row-title">${pub.titulo}</h4>
                    <p class="pub-row-details">${pub.autores} | ${pub.fonte}</p>
                </div>
                <div class="pub-row-action">
                    ${actionHtml}
                </div>
            `;
            pubListContainer.appendChild(row);
        });
    }

    // Render Blog Articles Grid from Medium RSS feed (Fallback to data.js if offline)
    const blogPostsContainer = document.getElementById('blog-posts-container');
    if (blogPostsContainer) {
        fetchMediumArticles();
    }

    // --- 1. Navigation Routing (Main Tabs) ---
    const tabButtons = document.querySelectorAll('.nav-tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    const mainContent = document.querySelector('.main-content');
    const sidebar = document.getElementById('sidebar-nav');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');

    // Main Tabs Router
    function activateMainTab(targetId) {
        const targetPanel = document.getElementById(`panel-${targetId}`);
        const targetBtn = document.querySelector(`.nav-tab-btn[data-target="${targetId}"]`);

        if (targetPanel && targetBtn) {
            // Remove active class
            tabButtons.forEach(b => b.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));

            // Set active
            targetBtn.classList.add('active');
            targetPanel.classList.add('active');

            // Reset views: not needed for Medium links as they open in a new tab

            // Reset scroll of content
            if (mainContent) mainContent.scrollTop = 0;

            // On mobile close navigation
            if (sidebar && sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
                if (mobileMenuToggle) mobileMenuToggle.classList.remove('open');
            }
        }
    }

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            activateMainTab(targetId);
        });
    });

    // Quick-Links from Bento Box/Home to Other Tabs
    const bentoTriggers = document.querySelectorAll('.trigger-tab-btn');
    bentoTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const targetTab = trigger.getAttribute('data-target');
            activateMainTab(targetTab);
        });
    });


    // --- 2. Mobile Menu Toggle ---
    if (mobileMenuToggle && sidebar) {
        mobileMenuToggle.addEventListener('click', () => {
            const isOpen = sidebar.classList.toggle('open');
            mobileMenuToggle.classList.toggle('open');
        });
    }


    // --- 3. Dark / Light Theme Toggle ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const sidebarLogo = document.getElementById('sidebar-logo');

    const savedTheme = localStorage.getItem('theme') || 'dark-theme';
    document.body.className = savedTheme;
    updateLogoSource(savedTheme === 'light-theme');

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            if (document.body.classList.contains('light-theme')) {
                document.body.classList.remove('light-theme');
                document.body.classList.add('dark-theme');
            } else {
                document.body.classList.remove('dark-theme');
                document.body.classList.add('light-theme');
            }
            
            const currentTheme = document.body.classList.contains('light-theme') ? 'light-theme' : 'dark-theme';
            localStorage.setItem('theme', currentTheme);
            updateLogoSource(currentTheme === 'light-theme');
        });
    }

    function updateLogoSource(isLight) {
        if (!sidebarLogo) return;
        if (isLight) {
            sidebarLogo.src = 'assets/logo2.png';
        } else {
            sidebarLogo.src = 'assets/logo.png';
        }
    }


    // --- 4. Interactive Delphi Scenario Simulator ---
    const sliderInvest = document.getElementById('var-invest');
    const sliderGeopolitics = document.getElementById('var-geopolitics');
    const sliderCoop = document.getElementById('var-coop');

    const valInvest = document.getElementById('val-invest');
    const valGeopolitics = document.getElementById('val-geopolitics');
    const valCoop = document.getElementById('val-coop');

    const pctA = document.getElementById('pct-cenario-a');
    const pctB = document.getElementById('pct-cenario-b');
    const pctC = document.getElementById('pct-cenario-c');

    const fillA = document.getElementById('fill-cenario-a');
    const fillB = document.getElementById('fill-cenario-b');
    const fillC = document.getElementById('fill-cenario-c');

    const feedbackBox = document.getElementById('scenario-feedback-box');

    function updateSimulation() {
        if (!sliderInvest) return;

        const invest = parseInt(sliderInvest.value);
        const geo = parseInt(sliderGeopolitics.value);
        const coop = parseInt(sliderCoop.value);

        // Update value indicators
        valInvest.textContent = `${invest}%`;
        valGeopolitics.textContent = `${geo}%`;
        valCoop.textContent = `${coop}%`;

        // Modelo matemático de probabilidade de cenários baseado nas variáveis
        let scoreA = (invest * 0.45) + (coop * 0.4) + (geo * 0.15);
        let scoreB = ((100 - geo) * 0.55) + ((100 - coop) * 0.35) + (invest * 0.1);
        let scoreC = ((100 - invest) * 0.5) + (geo * 0.4) + ((100 - coop) * 0.1);

        // Clamp para evitar valores negativos
        scoreA = Math.max(0, scoreA);
        scoreB = Math.max(0, scoreB);
        scoreC = Math.max(0, scoreC);

        const total = scoreA + scoreB + scoreC;
        let pctValA = 0;
        let pctValB = 0;
        let pctValC = 0;

        if (total > 0) {
            pctValA = Math.round((scoreA / total) * 100);
            pctValB = Math.round((scoreB / total) * 100);
            pctValC = 100 - (pctValA + pctValB); // Ensure sum is exactly 100
        } else {
            pctValA = 33;
            pctValB = 33;
            pctValC = 34;
        }

        // Update DOM
        pctA.textContent = `${pctValA}%`;
        pctB.textContent = `${pctValB}%`;
        pctC.textContent = `${pctValC}%`;

        fillA.style.width = `${pctValA}%`;
        fillB.style.width = `${pctValB}%`;
        fillC.style.width = `${pctValC}%`;

        // Dynamic Feedback Text
        if (pctValA > pctValB && pctValA > pctValC) {
            feedbackBox.innerHTML = `
                <strong>Cenário de Integração predominante</strong>. 
                O alto investimento em C&T e a forte cooperação internacional geram um ambiente favorável ao desenvolvimento, 
                permitindo parcerias em tecnologia militar e fortalecimento da soberania científica.
            `;
        } else if (pctValB > pctValA && pctValB > pctValC) {
            feedbackBox.innerHTML = `
                <strong>Cenário de Fragmentação predominante</strong>. 
                Instabilidade global acentuada e baixa cooperação desenham um futuro de tensões no Atlântico Sul, 
                exigindo estratégias robustas de dissuasão e rápida modernização da defesa nacional.
            `;
        } else {
            feedbackBox.innerHTML = `
                <strong>Cenário de Estagnação predominante</strong>. 
                A falta de investimentos em pesquisa básica atrasa projetos estratégicos nacionais. 
                Embora o ambiente geopolítico esteja pacífico, a dependência tecnológica externa aumenta.
            `;
        }
    }

    if (sliderInvest) {
        [sliderInvest, sliderGeopolitics, sliderCoop].forEach(slider => {
            slider.addEventListener('input', updateSimulation);
        });
        updateSimulation();
    }





    // --- 7. Dynamic Medium RSS Feed Fetcher (One Card per Row with Image) ---
    function fetchMediumArticles() {
        if (!blogPostsContainer) return;

        // Show loading skeleton
        blogPostsContainer.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 48px 24px; color: var(--text-muted);">
                <p>Carregando análises recentes...</p>
            </div>
        `;

        const username = 'janickvini';
        const feedUrl = `https://medium.com/feed/@${username}`;

        // Método 1: Feednami (retorna JSON em tempo real)
        const feednamiUrl = `https://api.feednami.com/api/v1/feeds/load?url=${encodeURIComponent(feedUrl)}`;

        // Método 2 (Fallback): rss2json (versão em cache de 1 hora, livre de limites de requisições)
        const rss2jsonUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`;

        function processAndRenderPosts(posts) {
            // Atualizar o card de destaques na página inicial se os elementos estiverem presentes
            if (posts.length > 0) {
                const firstPost = posts[0];
                const homeTitleEl = document.getElementById('latest-medium-title');
                const homeDescEl = document.getElementById('latest-medium-desc');
                
                if (homeTitleEl && homeDescEl) {
                    homeTitleEl.textContent = firstPost.title;
                    
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = firstPost.content || firstPost.description || '';
                    let cleanText = tempDiv.textContent || tempDiv.innerText || '';
                    cleanText = cleanText.trim().replace(/\s+/g, ' ');
                    if (cleanText.length > 140) {
                        cleanText = cleanText.substring(0, 135) + '...';
                    }
                    homeDescEl.textContent = cleanText;
                }
            }

            blogPostsContainer.innerHTML = '';

            // Compilar tags exclusivas
            const allTagsSet = new Set();
            posts.forEach(post => {
                const categories = post.categories || post.tags || [];
                categories.forEach(cat => {
                    const cleanCat = typeof cat === 'string' ? cat.trim() : (cat.term || '');
                    if (cleanCat) {
                        allTagsSet.add(cleanCat.charAt(0).toUpperCase() + cleanCat.slice(1).toLowerCase());
                    }
                });
            });

            const uniqueTags = Array.from(allTagsSet).sort();

            // Renderizar filtros de pílulas de tags
            const tagsFiltersContainer = document.getElementById('blog-tags-filters');
            if (tagsFiltersContainer) {
                tagsFiltersContainer.innerHTML = '';

                // Botão "Todos"
                const allPill = document.createElement('button');
                allPill.className = 'blog-tag-pill active';
                allPill.textContent = 'Todos';
                allPill.setAttribute('data-tag', 'all');
                tagsFiltersContainer.appendChild(allPill);

                uniqueTags.forEach(tag => {
                    const pill = document.createElement('button');
                    pill.className = 'blog-tag-pill';
                    pill.textContent = tag;
                    pill.setAttribute('data-tag', tag.toLowerCase());
                    tagsFiltersContainer.appendChild(pill);
                });

                // Eventos de clique nas pílulas
                const pills = tagsFiltersContainer.querySelectorAll('.blog-tag-pill');
                pills.forEach(pill => {
                    pill.addEventListener('click', () => {
                        pills.forEach(p => p.classList.remove('active'));
                        pill.classList.add('active');

                        const selectedTag = pill.getAttribute('data-tag');
                        const cards = blogPostsContainer.querySelectorAll('.blog-row-card');

                        cards.forEach(card => {
                            if (selectedTag === 'all') {
                                card.style.display = 'flex';
                            } else {
                                const cardTags = card.getAttribute('data-tags').split(',');
                                if (cardTags.includes(selectedTag)) {
                                    card.style.display = 'flex';
                                } else {
                                    card.style.display = 'none';
                                }
                            }
                        });
                    });
                });
            }

            // Renderizar cada card de post
            posts.forEach(post => {
                const contentHtml = post.content || post.description || '';
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = contentHtml;

                // Extrai a primeira imagem
                const imgTag = tempDiv.querySelector('img');
                let imgSrc = imgTag ? imgTag.src : '';
                if (!imgSrc && post.thumbnail) {
                    imgSrc = post.thumbnail;
                }

                // Limpa o resumo do texto
                let excerpt = tempDiv.textContent || tempDiv.innerText || '';
                excerpt = excerpt.trim().replace(/\s+/g, ' ');
                if (excerpt.length > 180) {
                    excerpt = excerpt.substring(0, 175) + '...';
                }

                // Formata a data de publicação
                let pubDateFormatted = 'Recente';
                const dateStr = post.pubDate || post.date || '';
                if (dateStr) {
                    const dateObj = new Date(dateStr);
                    if (!isNaN(dateObj.getTime())) {
                        const day = dateObj.getDate();
                        const months = [
                            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
                        ];
                        const month = months[dateObj.getMonth()];
                        const year = dateObj.getFullYear();
                        pubDateFormatted = `${day} de ${month}, ${year}`;
                    }
                }

                // Estima tempo de leitura
                const wordCount = contentHtml.split(/\s+/).length;
                const readingTime = Math.max(1, Math.round(wordCount / 200));

                // Constrói HTML das etiquetas do card
                let tagBadgesHtml = '';
                const cardTagsArray = [];
                const categories = post.categories || post.tags || [];
                if (categories && categories.length > 0) {
                    tagBadgesHtml = '<div class="blog-card-tags">';
                    categories.forEach(cat => {
                        const cleanCat = typeof cat === 'string' ? cat.trim() : (cat.term || '');
                        if (cleanCat) {
                            const formattedTag = cleanCat.charAt(0).toUpperCase() + cleanCat.slice(1).toLowerCase();
                            tagBadgesHtml += `<span class="blog-tag-badge">${formattedTag}</span>`;
                            cardTagsArray.push(cleanCat.toLowerCase());
                        }
                    });
                    tagBadgesHtml += '</div>';
                }

                const rowCard = document.createElement('article');
                rowCard.className = 'blog-row-card glass';
                rowCard.setAttribute('data-tags', cardTagsArray.join(','));

                let imgHtml = '';
                if (imgSrc) {
                    imgHtml = `
                        <div class="blog-row-card-img-holder">
                            <img src="${imgSrc}" alt="${post.title}" class="blog-row-card-img">
                        </div>
                    `;
                }

                const linkUrl = post.link || post.guid || '';

                rowCard.innerHTML = `
                    ${imgHtml}
                    <div class="blog-row-card-content">
                        <div class="blog-card-meta">
                            <span class="blog-date">${pubDateFormatted}</span>
                            <span class="blog-read-time">${readingTime} min de leitura</span>
                        </div>
                        <h3 class="blog-card-title">${post.title}</h3>
                        <p class="blog-card-excerpt">${excerpt}</p>
                        <div style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 12px; margin-top: auto;">
                            ${tagBadgesHtml}
                            <a href="${linkUrl}" target="_blank" class="btn btn-primary btn-sm read-article-btn" style="margin-left: auto;">Ler no Medium</a>
                        </div>
                    </div>
                `;
                blogPostsContainer.appendChild(rowCard);
            });
        }

        // 1. Tenta buscar em tempo real via Feednami
        fetch(feednamiUrl)
            .then(res => {
                if (!res.ok) throw new Error("Feednami indisponível");
                return res.json();
            })
            .then(data => {
                if (data && data.error === null && data.feed && data.feed.entries && data.feed.entries.length > 0) {
                    processAndRenderPosts(data.feed.entries);
                    console.log("Artigos do blog carregados em tempo real via Feednami.");
                } else {
                    throw new Error("Erro nos dados do Feednami");
                }
            })
            .catch(err => {
                console.warn("Feednami falhou, recorrendo ao rss2json (versão em cache)...", err);

                // 2. Fallback: Busca via rss2json sem parâmetro de timestamp dinâmico (cache de 1h livre de rate limits)
                fetch(rss2jsonUrl)
                    .then(res => {
                        if (!res.ok) throw new Error("rss2json indisponível");
                        return res.json();
                    })
                    .then(data => {
                        if (data && data.status === 'ok' && data.items && data.items.length > 0) {
                            processAndRenderPosts(data.items);
                            console.log("Artigos do blog carregados via rss2json (versão em cache de 1 hora).");
                        } else {
                            throw new Error("Erro nos dados do rss2json");
                        }
                    })
                    .catch(fallbackErr => {
                        console.error("Todos os serviços de feed falharam:", fallbackErr);
                        showFeedError();
                    });
            });
    }

    function showFeedError() {
        if (!blogPostsContainer) return;

        const tagsFiltersContainer = document.getElementById('blog-tags-filters');
        if (tagsFiltersContainer) tagsFiltersContainer.innerHTML = '';

        blogPostsContainer.innerHTML = `
            <div class="blog-error-state glass" style="grid-column: 1 / -1; padding: 32px; text-align: center; border-left: 4px solid var(--error);">
                <h4 style="color: var(--error); margin-bottom: 8px; font-weight: 600;">Não foi possível carregar as análises</h4>
                <p style="font-size: 0.9rem; color: var(--text-muted);">Houve uma falha ao conectar com o Medium. Verifique sua conexão com a internet ou tente novamente mais tarde.</p>
            </div>
        `;
    }

    // --- 8. Lightbox Popup Modal para Fotos do Mosaico ---
    const mosaicImages = document.querySelectorAll('.mosaic-grid img');
    const lightbox = document.getElementById('mosaic-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');

    if (lightbox && lightboxImg) {
        mosaicImages.forEach(img => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', () => {
                lightboxImg.src = img.src;
                lightbox.classList.add('open');
            });
        });

        const closeLightbox = () => {
            lightbox.classList.remove('open');
            lightboxImg.src = '';
        };

        if (lightboxClose) {
            lightboxClose.addEventListener('click', closeLightbox);
        }
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
        
        // Fechar com a tecla ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('open')) {
                closeLightbox();
            }
        });
    }

});
