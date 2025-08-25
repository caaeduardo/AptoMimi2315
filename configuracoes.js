// Configurações JavaScript
class SettingsManager {
    constructor() {
        this.settings = JSON.parse(localStorage.getItem('apartmentSettings')) || this.getDefaultSettings();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupSharedDataIndicators();
        this.loadSettings();
    }

    getDefaultSettings() {
        return {
            theme: 'light',
            language: 'pt-BR',
            notifications: {
                budget: true,
                notes: true,
                sync: true
            },
            privacy: {
                shareData: false,
                analytics: false
            },
            sync: {
                autoSync: true,
                syncInterval: 300000 // 5 minutes
            },
            display: {
                currency: 'BRL',
                dateFormat: 'DD/MM/YYYY',
                timeFormat: '24h'
            },
            backup: {
                autoBackup: false,
                backupInterval: 86400000 // 24 hours
            }
        };
    }

    setupEventListeners() {
        // Future implementation for settings controls
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('toggle-switch')) {
                this.handleToggle(e.target);
            }
        });

        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('setting-select')) {
                this.handleSelectChange(e.target);
            }
        });

        // Settings buttons (for future implementation)
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('settings-button')) {
                this.handleButtonClick(e.target);
            }
        });
    }

    handleToggle(toggle) {
        const settingKey = toggle.dataset.setting;
        const settingPath = toggle.dataset.path;
        
        toggle.classList.toggle('active');
        const isActive = toggle.classList.contains('active');
        
        this.updateSetting(settingPath, isActive);
        this.showNotification(`Configuração ${isActive ? 'ativada' : 'desativada'}`, 'success');
    }

    handleSelectChange(select) {
        const settingPath = select.dataset.path;
        const value = select.value;
        
        this.updateSetting(settingPath, value);
        this.showNotification('Configuração atualizada', 'success');
    }

    handleButtonClick(button) {
        const action = button.dataset.action;
        
        switch (action) {
            case 'export-data':
                this.exportAllData();
                break;
            case 'import-data':
                this.triggerImportData();
                break;
            case 'clear-data':
                this.clearAllData();
                break;
            case 'reset-settings':
                this.resetSettings();
                break;
            default:
                console.log('Unknown action:', action);
        }
    }

    updateSetting(path, value) {
        const keys = path.split('.');
        let current = this.settings;
        
        for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) {
                current[keys[i]] = {};
            }
            current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = value;
        this.saveSettings();
    }

    loadSettings() {
        // Apply theme
        this.applyTheme(this.settings.theme);
        
        // Apply language
        this.applyLanguage(this.settings.language);
        
        // Update UI elements based on settings
        this.updateSettingsUI();
    }

    updateSettingsUI() {
        // Update toggle switches
        document.querySelectorAll('.toggle-switch').forEach(toggle => {
            const path = toggle.dataset.path;
            if (path) {
                const value = this.getSettingValue(path);
                toggle.classList.toggle('active', value);
            }
        });
        
        // Update select dropdowns
        document.querySelectorAll('.setting-select').forEach(select => {
            const path = select.dataset.path;
            if (path) {
                const value = this.getSettingValue(path);
                select.value = value;
            }
        });
    }

    getSettingValue(path) {
        const keys = path.split('.');
        let current = this.settings;
        
        for (const key of keys) {
            if (current[key] === undefined) {
                return null;
            }
            current = current[key];
        }
        
        return current;
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        
        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    }

    applyLanguage(language) {
        document.documentElement.setAttribute('lang', language);
        // Future implementation for language switching
    }

    saveSettings() {
        localStorage.setItem('apartmentSettings', JSON.stringify(this.settings));
        this.handleDataImportExport('export', 'apartmentSettings');
    }

    // Data management functions
    exportAllData() {
        const allData = {
            settings: this.settings,
            budget: JSON.parse(localStorage.getItem('apartmentBudget') || '[]'),
            notes: JSON.parse(localStorage.getItem('apartmentNotes') || '[]'),
            apartment: JSON.parse(localStorage.getItem('apartmentData') || '{}'),
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
        
        const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `apartamento-camilly-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showNotification('Backup completo exportado com sucesso!', 'success');
    }

    triggerImportData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => this.importAllData(e);
        input.click();
    }

    importAllData(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (confirm('Isso substituirá todos os dados existentes. Deseja continuar?')) {
                    // Import settings
                    if (data.settings) {
                        this.settings = data.settings;
                        this.saveSettings();
                    }
                    
                    // Import other data
                    if (data.budget) {
                        localStorage.setItem('apartmentBudget', JSON.stringify(data.budget));
                    }
                    
                    if (data.notes) {
                        localStorage.setItem('apartmentNotes', JSON.stringify(data.notes));
                    }
                    
                    if (data.apartment) {
                        localStorage.setItem('apartmentData', JSON.stringify(data.apartment));
                    }
                    
                    this.loadSettings();
                    this.showNotification('Dados importados com sucesso!', 'success');
                    
                    // Reload page to apply all changes
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                }
            } catch (error) {
                this.showNotification('Erro ao importar arquivo: ' + error.message, 'error');
            }
        };
        reader.readAsText(file);
    }

    clearAllData() {
        if (confirm('Isso apagará TODOS os dados do aplicativo. Esta ação não pode ser desfeita. Deseja continuar?')) {
            if (confirm('Tem certeza absoluta? Todos os orçamentos, anotações e configurações serão perdidos.')) {
                // Clear all localStorage
                localStorage.removeItem('apartmentSettings');
                localStorage.removeItem('apartmentBudget');
                localStorage.removeItem('apartmentNotes');
                localStorage.removeItem('apartmentData');
                
                this.showNotification('Todos os dados foram apagados', 'success');
                
                // Reload page
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            }
        }
    }

    resetSettings() {
        if (confirm('Isso restaurará todas as configurações para os valores padrão. Deseja continuar?')) {
            this.settings = this.getDefaultSettings();
            this.saveSettings();
            this.loadSettings();
            this.showNotification('Configurações restauradas para o padrão', 'success');
        }
    }

    // Notification system
    showNotification(message, type = 'info') {
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
            max-width: 300px;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }

    setupSharedDataIndicators() {
        this.updateSharedDataIndicator();
        this.updateSyncStatus();
        this.updateConnectionStatus();
        
        // Check for shared data from other pages using global navigation
        if (window.CamillyNavigation) {
            window.CamillyNavigation.checkForSharedData();
        }
        
        if (typeof showSharedDataIndicator === 'function') {
            showSharedDataIndicator();
        }
        
        if (typeof showSyncStatus === 'function') {
            showSyncStatus('synced');
        }
        
        if (typeof showConnectionStatus === 'function') {
            showConnectionStatus('connected');
        }
    }
    
    updateSharedDataIndicator() {
        const sharedDataIndicator = document.getElementById('sharedDataIndicator');
        if (!sharedDataIndicator) return;
        
        // Check for shared data from other pages
        const sharedBudgetData = localStorage.getItem('sharedBudgetData');
        const sharedApartmentData = localStorage.getItem('sharedApartmentData');
        const sharedNotesData = localStorage.getItem('sharedNotesData');
        
        if (sharedBudgetData || sharedApartmentData || sharedNotesData) {
            sharedDataIndicator.classList.add('active');
            sharedDataIndicator.title = 'Dados disponíveis de outras páginas';
        } else {
            sharedDataIndicator.classList.remove('active');
            sharedDataIndicator.title = 'Nenhum dado compartilhado';
        }
    }
    
    updateSyncStatus() {
        const syncStatus = document.getElementById('syncStatus');
        if (!syncStatus) return;
        
        syncStatus.classList.add('active');
        syncStatus.title = 'Configurações sincronizadas';
    }
    
    updateConnectionStatus() {
        const connectionStatus = document.getElementById('connectionStatus');
        if (!connectionStatus) return;
        
        // Simulate connection check
        const isOnline = navigator.onLine;
        if (isOnline) {
            connectionStatus.classList.add('active');
            connectionStatus.title = 'Conectado à internet';
        } else {
            connectionStatus.classList.remove('active');
            connectionStatus.title = 'Sem conexão com a internet';
        }
    }

    handleDataImportExport(action, dataType) {
        if (typeof handleDataImportExport === 'function') {
            handleDataImportExport(action, dataType);
        }
    }

    // Get app statistics
    getAppStats() {
        const budget = JSON.parse(localStorage.getItem('apartmentBudget') || '[]');
        const notes = JSON.parse(localStorage.getItem('apartmentNotes') || '[]');
        
        return {
            totalProducts: budget.length,
            totalNotes: notes.length,
            dataSize: this.calculateDataSize(),
            lastSync: localStorage.getItem('lastSyncDate') || 'Nunca',
            appVersion: '1.0.0'
        };
    }

    calculateDataSize() {
        let totalSize = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key) && key.startsWith('apartment')) {
                totalSize += localStorage[key].length;
            }
        }
        return this.formatBytes(totalSize);
    }

    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Auto-sync functionality
    startAutoSync() {
        if (this.settings.sync.autoSync) {
            setInterval(() => {
                this.performSync();
            }, this.settings.sync.syncInterval);
        }
    }

    performSync() {
        // Future implementation for cloud sync
        console.log('Performing sync...');
        localStorage.setItem('lastSyncDate', new Date().toISOString());
        
        if (typeof showSyncStatus === 'function') {
            showSyncStatus('syncing');
            setTimeout(() => {
                showSyncStatus('synced');
            }, 2000);
        }
    }
}

// Navigation functions
function navigateToPage(page) {
    if (window.CamillyNavigation) {
        window.CamillyNavigation.saveNavigationState();
        // Share configuration data with other pages
        const configData = {
            theme: getCurrentTheme(),
            notifications: getNotificationSettings(),
            lastUpdate: new Date().toISOString(),
            source: 'configuracoes'
        };
        window.CamillyNavigation.shareDataBetweenPages('configData', configData);
    }
    if (typeof handlePageNavigation === 'function') {
        handlePageNavigation(page);
    } else {
        window.location.href = page;
    }
}

function getCurrentTheme() {
    return document.body.classList.contains('dark-theme') ? 'dark' : 'light';
}

function getNotificationSettings() {
    const notificationCheckbox = document.getElementById('notifications');
    return notificationCheckbox ? notificationCheckbox.checked : true;
}

function goBack() {
    if (typeof handlePageNavigation === 'function') {
        handlePageNavigation('index.html');
    } else {
        window.history.back();
    }
}

// Initialize settings manager
let settingsManager;

document.addEventListener('DOMContentLoaded', () => {
    settingsManager = new SettingsManager();
    
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
    
    // Start auto-sync if enabled
    settingsManager.startAutoSync();
});