// Navegação suave e interatividade
document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const navLinks = document.querySelectorAll('.nav-link');
    const cards = document.querySelectorAll('.card');
    
    // Navegação ativa
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Se for um link interno (com #), previne o comportamento padrão
            if (href.startsWith('#')) {
                e.preventDefault();
                
                // Remove classe active de todos os links
                navLinks.forEach(l => l.classList.remove('active'));
                
                // Adiciona classe active ao link clicado
                this.classList.add('active');
                
                const target = href.substring(1);
                console.log(`Navegando para: ${target}`);
                
                // Feedback visual
                showNotification(`Navegando para ${this.textContent}`);
            } else {
                // Para links externos (.html), permite navegação normal
                // Salva estado atual antes de navegar
                saveNavigationState(this.textContent);
            }
    });
    
    // Animação dos cards ao carregar
    function animateCards() {
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 150);
        });
    }
    
    // Executa animação dos cards
    animateCards();
    
    // Links dos cards
    const cardLinks = document.querySelectorAll('.card-link');
    cardLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const cardTitle = this.closest('.card').querySelector('h3').textContent;
            showNotification(`Acessando ${cardTitle}...`);
            
            // Aqui você pode adicionar lógica para navegar para diferentes páginas
            console.log(`Acessando: ${cardTitle}`);
        });
    });
    
    // Sistema de notificações
    function showNotification(message) {
        // Remove notificação existente se houver
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Cria nova notificação
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        // Estilos da notificação
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #d4c4a8, #b8a082);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(93, 78, 55, 0.2);
            z-index: 1000;
            font-weight: 500;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Anima entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove após 3 segundos
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }
    
    // Efeito parallax suave no hero
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        });
    }
    
    // Contador de visitas (simulado)
    function updateVisitCounter() {
        let visits = localStorage.getItem('apartamento-visits') || 0;
        visits = parseInt(visits) + 1;
        localStorage.setItem('apartamento-visits', visits);
        
        // Adiciona informação de visitas no footer (se existir)
        const footer = document.querySelector('footer');
        if (footer) {
            const visitInfo = document.createElement('p');
            visitInfo.textContent = `Visitas: ${visits}`;
            visitInfo.style.cssText = 'text-align: center; color: #a0916d; font-size: 0.8rem; margin-top: 1rem;';
            footer.appendChild(visitInfo);
        }
    }
    
    // Executa contador de visitas
    updateVisitCounter();
    
    // Mensagem de boas-vindas personalizada
    function showWelcomeMessage() {
        const hour = new Date().getHours();
        let greeting;
        
        if (hour < 12) {
            greeting = 'Bom dia';
        } else if (hour < 18) {
            greeting = 'Boa tarde';
        } else {
            greeting = 'Boa noite';
        }
        
        setTimeout(() => {
            showNotification(`${greeting}, Camilly! Bem-vinda ao seu espaço de gestão.`);
        }, 1000);
    }
    
    // Mostra mensagem de boas-vindas
    showWelcomeMessage();
    
    // Adiciona efeito de hover nos cards com som (opcional)
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Função para salvar preferências do usuário
    function saveUserPreferences() {
        const preferences = {
            lastVisit: new Date().toISOString(),
            favoriteSection: 'home'
        };
        localStorage.setItem('camilly-preferences', JSON.stringify(preferences));
    }
    
    // Salva preferências ao sair da página
    window.addEventListener('beforeunload', saveUserPreferences);
    
    console.log('🏠 Apartamento Camilly - Sistema carregado com sucesso!');
});

// Sistema de Navegação Global
function saveNavigationState(pageName) {
    const navigationState = {
        currentPage: pageName,
        timestamp: new Date().toISOString(),
        previousPage: localStorage.getItem('camilly-current-page') || 'Home'
    };
    localStorage.setItem('camilly-current-page', pageName);
    localStorage.setItem('camilly-navigation-state', JSON.stringify(navigationState));
}

function loadNavigationState() {
    const savedState = localStorage.getItem('camilly-navigation-state');
    if (savedState) {
        return JSON.parse(savedState);
    }
    return null;
}

function setActiveNavigation() {
    const currentPage = getCurrentPageName();
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkText = link.textContent.trim();
        const href = link.getAttribute('href');
        
        // Verifica se é a página atual
        if ((currentPage === 'Home' && (href === 'index.html' || href === '#home')) ||
            (currentPage === 'Planejamento' && href === 'planejamento.html') ||
            (linkText === currentPage)) {
            link.classList.add('active');
        }
    });
    
    // Update page transition effect
    updatePageTransition();
}

function getCurrentPageName() {
    const path = window.location.pathname;
    const filename = path.split('/').pop();
    
    switch(filename) {
        case 'index.html':
        case '':
            return 'Home';
        case 'planejamento.html':
            return 'Planejamento';
        case 'orcamentos.html':
            return 'Orçamentos';
        case 'meu-espaco.html':
            return 'Meu Espaço';
        case 'notes.html':
            return 'Notes';
        case 'configuracao.html':
            return 'Configuração';
        default:
            return 'Home';
    }
}

// Comunicação entre páginas
function shareDataBetweenPages(key, data) {
    localStorage.setItem(`camilly-shared-${key}`, JSON.stringify({
        data: data,
        timestamp: new Date().toISOString(),
        source: getCurrentPageName()
    }));
    
    // Show shared data indicator
    showSharedDataIndicator('Dados compartilhados com sucesso!');
}

function getSharedData(key) {
    const stored = localStorage.getItem(`camilly-shared-${key}`);
    if (stored) {
        return JSON.parse(stored);
    }
    return null;
}

// Breadcrumb navigation
function updateBreadcrumb() {
    const breadcrumbContainer = document.querySelector('.breadcrumb');
    if (!breadcrumbContainer) return;
    
    const currentPage = getCurrentPageName();
    const navigationState = loadNavigationState();
    
    let breadcrumbHTML = '<a href="index.html">Home</a>';
    
    if (currentPage !== 'Home') {
        breadcrumbHTML += ` <span class="separator">></span> <span class="current">${currentPage}</span>`;
    }
    
    breadcrumbContainer.innerHTML = breadcrumbHTML;
}

// Visual Indicators Functions
function showSharedDataIndicator(message = '📊 Dados sincronizados') {
    const indicator = document.getElementById('sharedDataIndicator');
    if (indicator) {
        indicator.textContent = message;
        indicator.classList.add('show');
        
        setTimeout(() => {
            indicator.classList.remove('show');
        }, 3000);
    }
}

function updateConnectionStatus(status = 'connected') {
    const connectionStatus = document.getElementById('connectionStatus');
    if (connectionStatus) {
        const statusText = connectionStatus.querySelector('span');
        const statusDot = connectionStatus.querySelector('.status-dot');
        
        switch(status) {
            case 'connected':
                statusText.textContent = 'Conectado';
                statusDot.style.backgroundColor = '#28a745';
                break;
            case 'syncing':
                statusText.textContent = 'Sincronizando...';
                statusDot.style.backgroundColor = '#ffc107';
                break;
            case 'error':
                statusText.textContent = 'Erro de conexão';
                statusDot.style.backgroundColor = '#dc3545';
                break;
        }
    }
}

function updatePageTransition() {
    const main = document.querySelector('main');
    if (main) {
        main.classList.add('page-transition');
        
        setTimeout(() => {
            main.classList.add('loaded');
        }, 100);
    }
}

function checkForSharedData() {
    const sharedData = localStorage.getItem('sharedPageData');
    if (sharedData) {
        try {
            const data = JSON.parse(sharedData);
            const currentPage = getCurrentPageName();
            
            // Check if data is for this page or for all pages
            if (data.target === 'all' || data.target === currentPage) {
                // Show indicator that data was received
                if (data.source !== currentPage) {
                    showSharedDataIndicator(`📥 Dados recebidos de ${data.source}`);
                }
            }
        } catch (error) {
            console.error('Error parsing shared data:', error);
        }
    }
}

// Inicialização global
function initializeGlobalNavigation() {
    // Define navegação ativa baseada na página atual
    setActiveNavigation();
    
    // Atualiza breadcrumb se existir
    updateBreadcrumb();
    
    // Salva estado da página atual
    saveNavigationState(getCurrentPageName());
    
    // Check for shared data from other pages
    checkForSharedData();
    
    // Update connection status
    updateConnectionStatus('connected');
    
    // Adiciona listener para mudanças de página
    window.addEventListener('beforeunload', function() {
        saveNavigationState(getCurrentPageName());
    });
}

// Executa inicialização quando a página carrega
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeGlobalNavigation);
} else {
    initializeGlobalNavigation();
}

// Exporta funções para uso global
window.CamillyNavigation = {
    saveNavigationState,
    loadNavigationState,
    setActiveNavigation,
    getCurrentPageName,
    shareDataBetweenPages,
    getSharedData,
    updateBreadcrumb,
    updateConnectionStatus,
    updatePageTransition,
    showSharedDataIndicator,
    checkForSharedData
};