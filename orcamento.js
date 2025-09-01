// Orçamento JavaScript
class BudgetManager {
    constructor() {
        this.products = [];
        this.currentTab = 'moveis';
        this.init();
    }

    async init() {
        await this.loadProducts();
        this.setupEventListeners();
        this.updateBudgetSummary();
        this.renderProducts();
        this.setupSharedDataIndicators();
    }

    async loadProducts() {
        try {
            this.products = await window.apartmentAPI.getAllOrcamentos() || [];
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
            this.products = JSON.parse(localStorage.getItem('budgetProducts')) || [];
        }
    }

    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Add product button
        document.getElementById('addProductBtn').addEventListener('click', () => {
            this.openAddProductModal();
        });

        // Modal close
        document.querySelectorAll('.close').forEach(close => {
            close.addEventListener('click', (e) => {
                this.closeModal(e.target.closest('.modal'));
            });
        });

        // Modal outside click
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target);
            }
        });

        // Add product form
        document.getElementById('addProductForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addProduct();
        });

        // Add store button
        document.getElementById('addStoreBtn').addEventListener('click', () => {
            this.addStoreInput();
        });
    }

    switchTab(tabName) {
        // Update active tab button
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update active tab panel
        document.querySelectorAll('.tab-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        document.getElementById(`${tabName}Tab`).classList.add('active');

        this.currentTab = tabName;
        this.renderProducts();
    }

    openAddProductModal() {
        // Set category based on current tab
        const categorySelect = document.getElementById('productCategory');
        categorySelect.value = this.currentTab;
        
        // Clear form
        document.getElementById('addProductForm').reset();
        
        // Reset stores section
        const storesContainer = document.getElementById('storesContainer');
        storesContainer.innerHTML = this.getStoreInputHTML();
        
        document.getElementById('addProductModal').style.display = 'block';
    }

    closeModal(modal) {
        modal.style.display = 'none';
    }

    addStoreInput() {
        const container = document.getElementById('storesContainer');
        const storeDiv = document.createElement('div');
        storeDiv.className = 'store-input';
        storeDiv.innerHTML = this.getStoreInputHTML();
        container.appendChild(storeDiv);
    }

    getStoreInputHTML() {
        return `
            <div class="store-input">
                <input type="text" placeholder="Nome da loja" class="store-name-input" required>
                <input type="number" placeholder="Preço" class="store-price-input" step="0.01" required>
                <input type="url" placeholder="Link da loja (opcional)" class="store-link-input">
                <button type="button" class="btn btn-danger btn-small" onclick="this.parentElement.remove()">×</button>
            </div>
        `;
    }

    async addProduct() {
        const form = document.getElementById('addProductForm');
        const formData = new FormData(form);
        
        // Collect store data
        const stores = [];
        const storeInputs = document.querySelectorAll('.store-input');
        
        storeInputs.forEach(storeDiv => {
            const name = storeDiv.querySelector('.store-name-input').value.trim();
            const price = parseFloat(storeDiv.querySelector('.store-price-input').value);
            const link = storeDiv.querySelector('.store-link-input').value.trim();
            
            if (name && !isNaN(price)) {
                stores.push({ name, price, link });
            }
        });

        if (stores.length === 0) {
            alert('Adicione pelo menos uma loja com preço!');
            return;
        }

        const product = {
            id: Date.now().toString(),
            name: formData.get('productName'),
            description: formData.get('productDescription'),
            category: formData.get('productCategory'),
            stores: stores,
            createdAt: new Date().toISOString()
        };

        this.products.push(product);
        await this.saveProducts();
        this.updateBudgetSummary();
        this.renderProducts();
        this.closeModal(document.getElementById('addProductModal'));
        
        // Show success message
        this.showNotification('Produto adicionado com sucesso!', 'success');
    }

    async deleteProduct(productId) {
        if (confirm('Tem certeza que deseja excluir este produto?')) {
            this.products = this.products.filter(p => p.id !== productId);
            await this.saveProducts();
            this.updateBudgetSummary();
            this.renderProducts();
            this.showNotification('Produto excluído com sucesso!', 'success');
        }
    }

    viewProductDetails(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const modal = document.getElementById('productDetailsModal');
        const content = modal.querySelector('.modal-body');
        
        const bestPrice = Math.min(...product.stores.map(s => s.price));
        
        content.innerHTML = `
            <h3>${product.name}</h3>
            <p><strong>Categoria:</strong> ${this.getCategoryName(product.category)}</p>
            <p><strong>Descrição:</strong> ${product.description}</p>
            
            <h4>Comparação de Preços:</h4>
            <div class="price-comparison">
                ${product.stores.map(store => `
                    <div class="store-price">
                        <div>
                            <span class="store-name">${store.name}</span>
                            ${store.link ? `<a href="${store.link}" target="_blank" class="store-link">Ver loja</a>` : ''}
                        </div>
                        <span class="price ${store.price === bestPrice ? 'best-price' : ''}">
                            R$ ${store.price.toFixed(2)}
                            ${store.price === bestPrice ? ' (Melhor preço!)' : ''}
                        </span>
                    </div>
                `).join('')}
            </div>
            
            <div style="margin-top: 1.5rem;">
                <p><strong>Melhor preço:</strong> <span style="color: #28a745; font-weight: bold;">R$ ${bestPrice.toFixed(2)}</span></p>
                <p><strong>Maior preço:</strong> R$ ${Math.max(...product.stores.map(s => s.price)).toFixed(2)}</p>
                <p><strong>Economia potencial:</strong> <span style="color: #fd7e14; font-weight: bold;">R$ ${(Math.max(...product.stores.map(s => s.price)) - bestPrice).toFixed(2)}</span></p>
            </div>
        `;
        
        modal.style.display = 'block';
    }

    getCategoryName(category) {
        const categories = {
            'moveis': 'Móveis',
            'eletrodomesticos': 'Eletrodomésticos',
            'decoracao': 'Decoração',
            'cozinha': 'Cozinha',
            'banheiro': 'Banheiro',
            'quarto': 'Quarto'
        };
        return categories[category] || category;
    }

    renderProducts() {
        const categories = ['moveis', 'eletrodomesticos', 'decoracao', 'cozinha', 'banheiro', 'quarto'];
        
        categories.forEach(category => {
            const container = document.getElementById(`${category}Products`);
            const categoryProducts = this.products.filter(p => p.category === category);
            
            if (categoryProducts.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">📦</div>
                        <h3>Nenhum produto adicionado</h3>
                        <p>Adicione produtos para começar a comparar preços</p>
                        <button class="btn btn-primary" onclick="budgetManager.openAddProductModal()">Adicionar Produto</button>
                    </div>
                `;
                return;
            }
            
            container.innerHTML = `
                <div class="products-grid">
                    ${categoryProducts.map(product => this.renderProductCard(product)).join('')}
                </div>
            `;
        });
    }

    renderProductCard(product) {
        const bestPrice = Math.min(...product.stores.map(s => s.price));
        const worstPrice = Math.max(...product.stores.map(s => s.price));
        const savings = worstPrice - bestPrice;
        
        return `
            <div class="product-card">
                <div class="product-header">
                    <h3 class="product-name">${product.name}</h3>
                </div>
                
                <p class="product-description">${product.description}</p>
                
                <div class="price-comparison">
                    <h4>Preços encontrados (${product.stores.length} lojas)</h4>
                    ${product.stores.slice(0, 3).map(store => `
                        <div class="store-price">
                            <div>
                                <span class="store-name">${store.name}</span>
                                ${store.link ? `<a href="${store.link}" target="_blank" class="store-link">Ver</a>` : ''}
                            </div>
                            <span class="price ${store.price === bestPrice ? 'best-price' : ''}">
                                R$ ${store.price.toFixed(2)}
                            </span>
                        </div>
                    `).join('')}
                    ${product.stores.length > 3 ? `<p style="text-align: center; color: #8b7355; font-size: 0.9rem; margin-top: 0.5rem;">+${product.stores.length - 3} lojas</p>` : ''}
                </div>
                
                ${savings > 0 ? `
                    <div style="background: rgba(253, 126, 20, 0.1); padding: 0.8rem; border-radius: 8px; margin-top: 1rem; text-align: center;">
                        <strong style="color: #fd7e14;">Economia de até R$ ${savings.toFixed(2)}</strong>
                    </div>
                ` : ''}
                
                <div class="product-actions">
                    <button class="btn btn-primary btn-small" onclick="budgetManager.viewProductDetails('${product.id}')">
                        Ver Detalhes
                    </button>
                    <button class="btn btn-danger btn-small" onclick="budgetManager.deleteProduct('${product.id}')">
                        Excluir
                    </button>
                </div>
            </div>
        `;
    }

    updateBudgetSummary() {
        const totalItems = this.products.length;
        const totalBudget = this.products.reduce((sum, product) => {
            const bestPrice = Math.min(...product.stores.map(s => s.price));
            return sum + bestPrice;
        }, 0);
        
        const totalSavings = this.products.reduce((sum, product) => {
            const prices = product.stores.map(s => s.price);
            const bestPrice = Math.min(...prices);
            const worstPrice = Math.max(...prices);
            return sum + (worstPrice - bestPrice);
        }, 0);
        
        document.getElementById('totalBudget').textContent = `R$ ${totalBudget.toFixed(2)}`;
        document.getElementById('totalItems').textContent = totalItems;
        document.getElementById('totalSavings').textContent = `R$ ${totalSavings.toFixed(2)}`;
    }

    async saveProducts() {
        try {
            await window.apartmentAPI.saveOrcamento('budgetProducts', this.products);
        } catch (error) {
            console.error('Erro ao salvar produtos:', error);
            localStorage.setItem('budgetProducts', JSON.stringify(this.products));
        }
        this.handleDataImportExport('export', 'budgetProducts');
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007bff'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    setupSharedDataIndicators() {
        // Initialize status indicators
        this.updateSharedDataIndicator();
        this.updateSyncStatus('synced');
        this.updateConnectionStatus('connected');
        
        // Check for shared data from other pages
        if (window.CamillyNavigation) {
            const sharedBudget = window.CamillyNavigation.getSharedData('budget');
            if (sharedBudget && sharedBudget.data) {
                this.showNotification('Dados compartilhados carregados!', 'info');
            }
        }
    }
    
    updateSharedDataIndicator(message = 'Dados Compartilhados') {
        const indicator = document.getElementById('sharedDataIndicator');
        if (indicator) {
            const textElement = indicator.querySelector('.status-text');
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
            const textElement = connectionElement.querySelector('.status-text');
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

    handleDataImportExport(action, dataType) {
        // Handle data import/export with visual feedback
        if (typeof handleDataImportExport === 'function') {
            handleDataImportExport(action, dataType);
        }
    }

    // Export data for sharing
    exportBudgetData() {
        const data = {
            products: this.products,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `orcamento-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showNotification('Orçamento exportado com sucesso!', 'success');
    }

    // Import data
    importBudgetData(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (data.products && Array.isArray(data.products)) {
                    this.products = data.products;
                    await this.saveProducts();
                    this.updateBudgetSummary();
                    this.renderProducts();
                    this.showNotification('Orçamento importado com sucesso!', 'success');
                } else {
                    throw new Error('Formato de arquivo inválido');
                }
            } catch (error) {
                this.showNotification('Erro ao importar arquivo: ' + error.message, 'error');
            }
        };
        reader.readAsText(file);
    }
}

// Initialize budget manager when page loads
let budgetManager;

document.addEventListener('DOMContentLoaded', async () => {
    budgetManager = new BudgetManager();
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
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
});

// Navigation functions
function navigateToPage(page) {
    if (window.CamillyNavigation) {
        window.CamillyNavigation.saveNavigationState('Orçamento');
        window.CamillyNavigation.shareDataBetweenPages('budget', budgetManager.products);
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