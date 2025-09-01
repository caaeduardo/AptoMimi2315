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
        this.setupPhotoCarousel();
    }

    setupImageGallery() {
        const imageCards = document.querySelectorAll('.image-card');
        imageCards.forEach(card => {
            card.addEventListener('click', () => {
                this.openImageModal(card);
            });
        });
    }

    setupPhotoCarousel() {
        // Initialize photo carousel variables
        this.currentPhotoIndex = 0;
        this.photos = [
            {
                id: 1,
                title: '🏢 Fachada do Prédio',
                description: 'Vista externa do edifício',
                category: 'exterior',
                src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f8f5f1'/%3E%3Cpath d='M50 250 L350 250 L350 100 L200 50 L50 100 Z' fill='%23e6ddd4' stroke='%238b7355' stroke-width='2'/%3E%3Crect x='80' y='180' width='60' height='70' fill='%235d4e37'/%3E%3Crect x='260' y='180' width='60' height='70' fill='%235d4e37'/%3E%3Crect x='170' y='200' width='60' height='50' fill='%23a0916d'/%3E%3C/svg%3E",
                alt: 'Fachada do Prédio'
            },
            {
                id: 2,
                title: '🏊 Área da Piscina',
                description: 'Área de lazer com piscina',
                category: 'lazer',
                src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f0f8ff'/%3E%3Crect x='50' y='200' width='300' height='80' fill='%2387ceeb'/%3E%3Cellipse cx='200' cy='240' rx='120' ry='30' fill='%234682b4'/%3E%3Crect x='80' y='50' width='240' height='120' fill='%23f5f5dc' stroke='%23d2b48c' stroke-width='2'/%3E%3C/svg%3E",
                alt: 'Área da Piscina'
            },
            {
                id: 3,
                title: '🎉 Salão de Festas',
                description: 'Espaço para eventos e comemorações',
                category: 'lazer',
                src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f8f5f1'/%3E%3Crect x='50' y='80' width='300' height='180' fill='%23fff'/%3E%3Crect x='70' y='100' width='80' height='60' fill='%23e6ddd4'/%3E%3Crect x='250' y='100' width='80' height='60' fill='%23e6ddd4'/%3E%3Crect x='160' y='180' width='80' height='60' fill='%23a0916d'/%3E%3Ccircle cx='200' cy='50' r='20' fill='%23ffd700'/%3E%3C/svg%3E",
                alt: 'Salão de Festas'
            },
            {
                id: 4,
                title: '🛋️ Sala de Estar',
                description: 'Ambiente interno do apartamento',
                category: 'interior',
                src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f5f5f5'/%3E%3Crect x='50' y='50' width='300' height='200' fill='%23fff'/%3E%3Crect x='70' y='70' width='100' height='80' fill='%23e8e8e8'/%3E%3Crect x='230' y='70' width='100' height='80' fill='%23d4d4d4'/%3E%3Crect x='70' y='170' width='260' height='60' fill='%23c8c8c8'/%3E%3Ctext x='200' y='280' text-anchor='middle' fill='%235d4e37' font-family='Arial' font-size='14'%3ESala de Estar%3C/text%3E%3C/svg%3E",
                alt: 'Sala de Estar'
            },
            {
                id: 5,
                title: '👩‍🍳 Cozinha',
                description: 'Área gourmet do apartamento',
                category: 'interior',
                src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f9f9f9'/%3E%3Crect x='50' y='50' width='300' height='200' fill='%23fff'/%3E%3Crect x='70' y='70' width='80' height='120' fill='%23e0e0e0'/%3E%3Crect x='170' y='70' width='160' height='60' fill='%23d0d0d0'/%3E%3Crect x='170' y='150' width='160' height='40' fill='%23c0c0c0'/%3E%3Ccircle cx='200' cy='110' r='15' fill='%23333'/%3E%3Ccircle cx='250' cy='110' r='15' fill='%23333'/%3E%3Ctext x='200' y='280' text-anchor='middle' fill='%235d4e37' font-family='Arial' font-size='14'%3ECozinha%3C/text%3E%3C/svg%3E",
                alt: 'Cozinha'
            }
        ];
        
        this.filteredPhotos = [...this.photos];
        this.nextPhotoId = 6;
        
        // Load saved photos
        this.loadPhotos();
        
        // Setup carousel
        this.updateCarousel();
        this.updatePhotoCount();
        this.setupCarouselEventListeners();
    }

    setupCarouselEventListeners() {
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.previousPhoto();
            } else if (e.key === 'ArrowRight') {
                this.nextPhoto();
            } else if (e.key === 'Escape') {
                this.closeAddPhotoModal();
            }
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

    // Photo Carousel Methods
    nextPhoto() {
        if (this.filteredPhotos.length === 0) return;
        
        this.currentPhotoIndex = (this.currentPhotoIndex + 1) % this.filteredPhotos.length;
        this.updateCarousel();
    }

    previousPhoto() {
        if (this.filteredPhotos.length === 0) return;
        
        this.currentPhotoIndex = this.currentPhotoIndex === 0 ? this.filteredPhotos.length - 1 : this.currentPhotoIndex - 1;
        this.updateCarousel();
    }

    goToPhoto(index) {
        if (index >= 0 && index < this.filteredPhotos.length) {
            this.currentPhotoIndex = index;
            this.updateCarousel();
        }
    }

    updateCarousel() {
        const track = document.getElementById('carouselTrack');
        const indicators = document.querySelectorAll('.indicator');
        
        if (!track) return;
        
        // Update track position
        const translateX = -this.currentPhotoIndex * 100;
        track.style.transform = `translateX(${translateX}%)`;
        
        // Update indicators
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentPhotoIndex);
        });
        
        // Update photo cards active state
        const photoCards = track.querySelectorAll('.photo-card');
        photoCards.forEach((card, index) => {
            card.classList.toggle('active', index === this.currentPhotoIndex);
        });
    }

    filterPhotos(category) {
        const filterButtons = document.querySelectorAll('.filter-btn');
        
        // Update active filter button
        filterButtons.forEach(btn => {
            btn.classList.toggle('active', btn.textContent.toLowerCase().includes(category) || 
                                          (category === 'all' && btn.textContent === 'Todas'));
        });
        
        // Filter photos
        if (category === 'all') {
            this.filteredPhotos = [...this.photos];
        } else {
            this.filteredPhotos = this.photos.filter(photo => photo.category === category);
        }
        
        // Reset current index if needed
        if (this.currentPhotoIndex >= this.filteredPhotos.length) {
            this.currentPhotoIndex = 0;
        }
        
        // Rebuild carousel
        this.rebuildCarousel();
        this.updateCarousel();
    }

    rebuildCarousel() {
        const track = document.getElementById('carouselTrack');
        const indicatorsContainer = document.querySelector('.carousel-indicators');
        
        if (!track || !indicatorsContainer) return;
        
        // Clear existing content
        track.innerHTML = '';
        indicatorsContainer.innerHTML = '';
        
        // Add filtered photos
        this.filteredPhotos.forEach((photo, index) => {
            // Create photo card
            const photoCard = this.createPhotoCard(photo, index);
            track.appendChild(photoCard);
            
            // Create indicator
            const indicator = document.createElement('button');
            indicator.className = 'indicator';
            indicator.onclick = () => this.goToPhoto(index);
            indicatorsContainer.appendChild(indicator);
        });
    }

    createPhotoCard(photo, index) {
        const photoCard = document.createElement('div');
        photoCard.className = 'photo-card';
        photoCard.dataset.category = photo.category;
        
        photoCard.innerHTML = `
            <img src="${photo.src}" alt="${photo.alt}">
            <div class="photo-overlay">
                <div class="photo-info">
                    <h4>${photo.title}</h4>
                    <p>${photo.description}</p>
                    <span class="photo-category">${this.getCategoryDisplayName(photo.category)}</span>
                </div>
                <div class="photo-actions">
                    <button class="photo-action-btn" onclick="mySpaceManager.viewFullPhoto(${index})" title="Ver em tela cheia">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
                        </svg>
                    </button>
                    <button class="photo-action-btn delete" onclick="mySpaceManager.deletePhoto(${index})" title="Excluir foto">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3,6 5,6 21,6"></polyline>
                            <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"></path>
                        </svg>
                    </button>
                </div>
            </div>
        `;
        
        return photoCard;
    }

    getCategoryDisplayName(category) {
        const categories = {
            'exterior': 'Exterior',
            'interior': 'Interior',
            'lazer': 'Lazer'
        };
        return categories[category] || 'Outros';
    }

    viewFullPhoto(index) {
        const photo = this.filteredPhotos[index];
        if (!photo) return;
        
        // Create fullscreen modal
        const modal = document.createElement('div');
        modal.className = 'photo-modal active';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 90vw; max-height: 90vh; padding: 0; background: transparent;">
                <img src="${photo.src}" alt="${photo.alt}" style="width: 100%; height: auto; max-height: 90vh; object-fit: contain; border-radius: 8px;">
                <button class="close-modal" onclick="this.parentElement.parentElement.remove()" style="position: absolute; top: 1rem; right: 1rem; background: rgba(0,0,0,0.5); color: white; border: none; width: 40px; height: 40px; border-radius: 50%; cursor: pointer;">
                    ✕
                </button>
            </div>
        `;
        
        // Close on click outside
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        document.body.appendChild(modal);
    }

    deletePhoto(index) {
        const photo = this.filteredPhotos[index];
        if (!photo) return;
        
        if (confirm(`Tem certeza que deseja excluir a foto "${photo.title}"?`)) {
            // Remove from main photos array
            const photoIndex = this.photos.findIndex(p => p.id === photo.id);
            if (photoIndex !== -1) {
                this.photos.splice(photoIndex, 1);
            }
            
            // Remove from filtered photos
            this.filteredPhotos.splice(index, 1);
            
            // Adjust current index
            if (this.currentPhotoIndex >= this.filteredPhotos.length && this.filteredPhotos.length > 0) {
                this.currentPhotoIndex = this.filteredPhotos.length - 1;
            } else if (this.filteredPhotos.length === 0) {
                this.currentPhotoIndex = 0;
            }
            
            // Rebuild and update
            this.rebuildCarousel();
            this.updateCarousel();
            this.updatePhotoCount();
            
            this.showCarouselNotification('Foto excluída com sucesso!', 'success');
        }
    }

    openAddPhotoModal() {
        // Create modal if it doesn't exist
        let modal = document.getElementById('addPhotoModal');
        if (!modal) {
            modal = this.createAddPhotoModal();
            document.body.appendChild(modal);
        }
        
        modal.classList.add('active');
        
        // Reset form
        const form = modal.querySelector('.photo-form');
        if (form) {
            form.reset();
        }
    }

    closeAddPhotoModal() {
        const modal = document.getElementById('addPhotoModal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    createAddPhotoModal() {
        const modal = document.createElement('div');
        modal.id = 'addPhotoModal';
        modal.className = 'photo-modal';
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>📸 Adicionar Nova Foto</h3>
                    <button class="close-modal" onclick="mySpaceManager.closeAddPhotoModal()">✕</button>
                </div>
                
                <form class="photo-form" onsubmit="mySpaceManager.addPhoto(event)">
                    <div class="form-group">
                        <label for="photoTitle">Título da Foto</label>
                        <input type="text" id="photoTitle" name="photoTitle" required placeholder="Ex: Sala de Estar">
                    </div>
                    
                    <div class="form-group">
                        <label for="photoDescription">Descrição</label>
                        <textarea id="photoDescription" name="photoDescription" rows="3" placeholder="Descreva a foto..."></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="photoCategory">Categoria</label>
                        <select id="photoCategory" name="photoCategory" required>
                            <option value="">Selecione uma categoria</option>
                            <option value="exterior">Exterior</option>
                            <option value="interior">Interior</option>
                            <option value="lazer">Lazer</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="photoFile">Arquivo da Foto</label>
                        <div class="file-input-wrapper">
                            <input type="file" id="photoFile" name="photoFile" accept="image/*" required>
                            <div class="file-input-text">
                                📁 Clique para selecionar uma foto<br>
                                <small>Formatos aceitos: JPG, PNG, GIF</small>
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal-actions">
                        <button type="button" class="btn-cancel" onclick="mySpaceManager.closeAddPhotoModal()">Cancelar</button>
                        <button type="submit" class="btn-save">Adicionar Foto</button>
                    </div>
                </form>
            </div>
        `;
        
        // Modal close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeAddPhotoModal();
            }
        });
        
        return modal;
    }

    addPhoto(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const file = formData.get('photoFile');
        
        if (!file) {
            this.showCarouselNotification('Por favor, selecione uma foto.', 'error');
            return;
        }
        
        // Create file reader to convert image to data URL
        const reader = new FileReader();
        reader.onload = (e) => {
            const newPhoto = {
                id: this.nextPhotoId++,
                title: formData.get('photoTitle'),
                description: formData.get('photoDescription') || 'Sem descrição',
                category: formData.get('photoCategory'),
                src: e.target.result,
                alt: formData.get('photoTitle')
            };
            
            // Add to photos array
            this.photos.push(newPhoto);
            
            // Update filtered photos if needed
            const currentFilter = document.querySelector('.filter-btn.active')?.textContent.toLowerCase();
            if (currentFilter === 'todas' || currentFilter?.includes(newPhoto.category)) {
                this.filteredPhotos.push(newPhoto);
            }
            
            // Rebuild carousel
            this.rebuildCarousel();
            this.updateCarousel();
            this.updatePhotoCount();
            
            // Close modal
            this.closeAddPhotoModal();
            
            // Show success message
            this.showCarouselNotification('Foto adicionada com sucesso!', 'success');
            
            // Go to the new photo
            if (this.filteredPhotos.includes(newPhoto)) {
                this.goToPhoto(this.filteredPhotos.length - 1);
            }
            
            // Save photos
            this.savePhotos();
        };
        
        reader.readAsDataURL(file);
    }

    updatePhotoCount() {
        const photoCountElement = document.getElementById('photoCount');
        if (photoCountElement) {
            photoCountElement.textContent = this.photos.length;
        }
    }

    showCarouselNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `carousel-notification ${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '600',
            zIndex: '9999',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease'
        });
        
        // Set background color based on type
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8'
        };
        notification.style.background = colors[type] || colors.info;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    savePhotos() {
        localStorage.setItem('apartamento-photos', JSON.stringify(this.photos));
    }

    loadPhotos() {
        const savedPhotos = localStorage.getItem('apartamento-photos');
        if (savedPhotos) {
            this.photos = JSON.parse(savedPhotos);
            this.filteredPhotos = [...this.photos];
            // Update nextPhotoId
            this.nextPhotoId = Math.max(...this.photos.map(p => p.id)) + 1;
        }
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

// Global functions for photo carousel
function nextPhoto() {
    if (mySpaceManager) {
        mySpaceManager.nextPhoto();
    }
}

function previousPhoto() {
    if (mySpaceManager) {
        mySpaceManager.previousPhoto();
    }
}

function goToPhoto(index) {
    if (mySpaceManager) {
        mySpaceManager.goToPhoto(index);
    }
}

function filterPhotos(category) {
    if (mySpaceManager) {
        mySpaceManager.filterPhotos(category);
    }
}

function openAddPhotoModal() {
    if (mySpaceManager) {
        mySpaceManager.openAddPhotoModal();
    }
}

function closeAddPhotoModal() {
    if (mySpaceManager) {
        mySpaceManager.closeAddPhotoModal();
    }
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