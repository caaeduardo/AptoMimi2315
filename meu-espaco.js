// Meu Espaço JavaScript
class MySpaceManager {
    constructor() {
        this.apartmentAddress = 'Rua Manuel Alves de Siqueira, 51, Cupecê, São Paulo, SP';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupSharedDataIndicators();
        this.animateCards();
    }

    setupEventListeners() {
        // Setup any interactive elements
        this.setupImageGallery();
        this.setupAmenityCards();
    }

    setupImageGallery() {
        const imageCards = document.querySelectorAll('.image-card');
        imageCards.forEach(card => {
            card.addEventListener('click', () => {
                this.openImageModal(card);
            });
        });
    }

    setupAmenityCards() {
        const amenityCards = document.querySelectorAll('.amenity-card');
        amenityCards.forEach(card => {
            card.addEventListener('click', () => {
                this.showAmenityDetails(card);
            });
        });
    }

    openImageModal(imageCard) {
        const img = imageCard.querySelector('img');
        const title = imageCard.querySelector('p').textContent;
        
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'image-modal';
        modal.innerHTML = `
            <div class="image-modal-content">
                <div class="image-modal-header">
                    <h3>${title}</h3>
                    <span class="close-modal">&times;</span>
                </div>
                <div class="image-modal-body">
                    <img src="${img.src}" alt="${title}">
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal events
        modal.querySelector('.close-modal').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
        
        // Add modal styles
        this.addImageModalStyles();
    }

    addImageModalStyles() {
        if (document.getElementById('imageModalStyles')) return;
        
        const style = document.createElement('style');
        style.id = 'imageModalStyles';
        style.textContent = `
            .image-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                backdrop-filter: blur(5px);
            }
            
            .image-modal-content {
                background: white;
                border-radius: 12px;
                max-width: 90vw;
                max-height: 90vh;
                overflow: hidden;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            }
            
            .image-modal-header {
                background: linear-gradient(135deg, #8b7355, #a0916d);
                color: white;
                padding: 1rem 1.5rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .image-modal-header h3 {
                margin: 0;
                font-size: 1.2rem;
            }
            
            .close-modal {
                font-size: 1.5rem;
                cursor: pointer;
                line-height: 1;
            }
            
            .close-modal:hover {
                opacity: 0.7;
            }
            
            .image-modal-body {
                padding: 0;
            }
            
            .image-modal-body img {
                width: 100%;
                height: auto;
                display: block;
            }
        `;
        document.head.appendChild(style);
    }

    showAmenityDetails(amenityCard) {
        const title = amenityCard.querySelector('h3').textContent;
        const description = amenityCard.querySelector('p').textContent;
        const icon = amenityCard.querySelector('.amenity-icon').textContent;
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = 'amenity-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">${icon}</div>
                <div class="notification-text">
                    <h4>${title}</h4>
                    <p>${description}</p>
                </div>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        document.body.removeChild(notification);
                    }
                }, 300);
            }
        }, 3000);
        
        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        });
        
        this.addNotificationStyles();
    }

    addNotificationStyles() {
        if (document.getElementById('notificationStyles')) return;
        
        const style = document.createElement('style');
        style.id = 'notificationStyles';
        style.textContent = `
            .amenity-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 8px 25px rgba(139, 115, 85, 0.2);
                z-index: 9999;
                animation: slideIn 0.3s ease;
                border: 1px solid #e6ddd4;
                max-width: 350px;
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                padding: 1rem;
            }
            
            .notification-icon {
                font-size: 2rem;
                margin-right: 1rem;
                background: linear-gradient(135deg, #8b7355, #a0916d);
                width: 50px;
                height: 50px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
            }
            
            .notification-text {
                flex: 1;
            }
            
            .notification-text h4 {
                margin: 0 0 0.3rem 0;
                color: #5d4e37;
                font-size: 1rem;
                font-weight: 600;
            }
            
            .notification-text p {
                margin: 0;
                color: #8b7355;
                font-size: 0.9rem;
                line-height: 1.3;
            }
            
            .notification-close {
                background: none;
                border: none;
                font-size: 1.2rem;
                color: #8b7355;
                cursor: pointer;
                padding: 0.2rem;
                margin-left: 0.5rem;
                border-radius: 50%;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .notification-close:hover {
                background: rgba(139, 115, 85, 0.1);
            }
            
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    animateCards() {
        // Animate cards on scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe all cards
        const cards = document.querySelectorAll('.poi-card, .amenity-card, .image-card');
        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    }

    setupSharedDataIndicators() {
        // Initialize status indicators
        this.updateSharedDataIndicator();
        this.updateSyncStatus('synced');
        this.updateConnectionStatus('connected');
        
        // Check for shared data from other pages
        if (window.CamillyNavigation) {
            const sharedApartment = window.CamillyNavigation.getSharedData('apartment');
            if (sharedApartment && sharedApartment.data) {
                this.showNotification('Dados do apartamento carregados!', 'info');
            }
        }
    }
    
    updateSharedDataIndicator(message = 'Dados Compartilhados') {
        const indicator = document.getElementById('sharedDataIndicator');
        if (indicator) {
            const textElement = indicator.querySelector('.indicator-text');
            if (textElement) textElement.textContent = message;
            indicator.classList.add('active');
        }
    }
    
    updateSyncStatus(status = 'synced') {
        const syncElement = document.getElementById('syncStatus');
        if (syncElement) {
            const textElement = syncElement.querySelector('.status-text');
            if (textElement) {
                switch(status) {
                    case 'synced':
                        textElement.textContent = 'Sincronizado';
                        break;
                    case 'syncing':
                        textElement.textContent = 'Sincronizando...';
                        break;
                    case 'error':
                        textElement.textContent = 'Erro de Sync';
                        break;
                }
            }
        }
    }
    
    updateConnectionStatus(status = 'connected') {
        const connectionElement = document.getElementById('connectionStatus');
        if (connectionElement) {
            const textElement = connectionElement.querySelector('.connection-text');
            if (textElement) {
                switch(status) {
                    case 'connected':
                        textElement.textContent = 'Conectado';
                        break;
                    case 'connecting':
                        textElement.textContent = 'Conectando...';
                        break;
                    case 'disconnected':
                        textElement.textContent = 'Desconectado';
                        break;
                }
            }
        }
    }
    }

    // Save apartment data to localStorage
    saveApartmentData() {
        const apartmentData = {
            address: this.apartmentAddress,
            neighborhood: 'Cupecê',
            city: 'São Paulo',
            state: 'SP',
            lastUpdated: new Date().toISOString()
        };
        
        localStorage.setItem('apartmentData', JSON.stringify(apartmentData));
        
        if (typeof handleDataImportExport === 'function') {
            handleDataImportExport('export', 'apartmentData');
        }
    }

    // Get travel time to a location
    getTravelTime(destination) {
        const travelTimes = {
            'Av. Cupecê': '3min à pé',
            'Parque Nabuco': '10min à pé',
            'Poupatempo Cidade Ademar': '12min de ônibus',
            'DIA Supermercado': '1min à pé',
            'Hospital Municipal da Vila Santa Catarina': '10min de ônibus',
            'Supermercado Coqueiro': '7min de ônibus',
            'Mercado e Padaria Vem que Tem': '9min à pé',
            'Escola Rei Leão/Nova Ordem': '10min de ônibus',
            'Escola Professora Heloisa Carneiro': '13min de ônibus'
        };
        
        return travelTimes[destination] || 'Tempo não disponível';
    }

    // Show location details
    showLocationDetails(locationName) {
        const travelTime = this.getTravelTime(locationName);
        
        const modal = document.createElement('div');
        modal.className = 'location-modal';
        modal.innerHTML = `
            <div class="location-modal-content">
                <div class="location-modal-header">
                    <h3>📍 ${locationName}</h3>
                    <span class="close-location-modal">&times;</span>
                </div>
                <div class="location-modal-body">
                    <p><strong>Tempo de viagem:</strong> ${travelTime}</p>
                    <p><strong>Do apartamento:</strong> ${this.apartmentAddress}</p>
                    <div class="location-actions">
                        <button class="btn btn-primary" onclick="openDirections('${locationName}')">
                            🗺️ Ver Direções
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal events
        modal.querySelector('.close-location-modal').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }
}

// Global functions
function openGoogleMaps() {
    const address = encodeURIComponent('Rua Manuel Alves de Siqueira, 51, Cupecê, São Paulo, SP');
    const url = `https://www.google.com/maps/search/?api=1&query=${address}`;
    window.open(url, '_blank');
}

function openDirections(destination) {
    const origin = encodeURIComponent('Rua Manuel Alves de Siqueira, 51, Cupecê, São Paulo, SP');
    const dest = encodeURIComponent(destination + ', São Paulo, SP');
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}`;
    window.open(url, '_blank');
}

// Navigation functions
function navigateToPage(page) {
    if (window.CamillyNavigation) {
        window.CamillyNavigation.saveNavigationState('Meu Espaço');
        window.CamillyNavigation.shareDataBetweenPages('apartment', apartmentData);
    }
    window.location.href = page;
}

function goBack() {
    navigateToPage('index.html');
}

// Global navigation handler
function handlePageNavigation(page) {
    navigateToPage(page);
}

// Initialize when page loads
let mySpaceManager;

document.addEventListener('DOMContentLoaded', () => {
    mySpaceManager = new MySpaceManager();
    
    // Save apartment data
    mySpaceManager.saveApartmentData();
    
    // Add click events to POI cards for details
    document.querySelectorAll('.poi-card').forEach(card => {
        card.addEventListener('click', () => {
            const locationName = card.querySelector('h3').textContent;
            mySpaceManager.showLocationDetails(locationName);
        });
    });
});