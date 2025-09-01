// Configurações do Sistema - Camilly Apartamento
// Gerenciamento de configurações pessoais e do sistema

class CamillySettings {
    constructor() {
        this.storageKey = 'camilly_settings';
        this.defaultSettings = {
            // Perfil Pessoal
            userName: 'Camilly',
            userEmail: '',
            userPhone: '',
            
            // Apartamento
            apartmentAddress: 'Rua Manuel Alves de Siqueira, 51 - Cupecê - São Paulo/SP',
            apartmentSize: '',
            apartmentRooms: '',
            moveInDate: '',
            apartmentType: '',
            
            // Orçamento
            totalBudget: '',
            monthlyBudget: '',
            priorityCategories: [],
            
            // Notificações
            budgetAlerts: true,
            deadlineReminders: true,
            eventNotifications: true,
            
            // Sistema
            lastBackupDate: null,
            createdAt: new Date().toISOString()
        };
        
        this.init();
    }
    
    init() {
        this.loadSettings();
        this.bindEvents();
        this.updateStorageInfo();
    }
    
    loadSettings() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            const settings = saved ? JSON.parse(saved) : this.defaultSettings;
            
            // Mesclar com configurações padrão para garantir que todas as propriedades existam
            this.settings = { ...this.defaultSettings, ...settings };
            
            this.populateForm();
        } catch (error) {
            console.error('Erro ao carregar configurações:', error);
            this.settings = { ...this.defaultSettings };
        }
    }
    
    populateForm() {
        // Perfil Pessoal
        this.setFieldValue('userName', this.settings.userName);
        this.setFieldValue('userEmail', this.settings.userEmail);
        this.setFieldValue('userPhone', this.settings.userPhone);
        
        // Apartamento
        this.setFieldValue('apartmentAddress', this.settings.apartmentAddress);
        this.setFieldValue('apartmentSize', this.settings.apartmentSize);
        this.setFieldValue('apartmentRooms', this.settings.apartmentRooms);
        this.setFieldValue('moveInDate', this.settings.moveInDate);
        this.setFieldValue('apartmentType', this.settings.apartmentType);
        
        // Orçamento
        this.setFieldValue('totalBudget', this.settings.totalBudget);
        this.setFieldValue('monthlyBudget', this.settings.monthlyBudget);
        
        // Categorias prioritárias
        const checkboxes = document.querySelectorAll('input[name="priorityCategories"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = this.settings.priorityCategories.includes(checkbox.value);
        });
        
        // Notificações
        this.setFieldValue('budgetAlerts', this.settings.budgetAlerts, 'checkbox');
        this.setFieldValue('deadlineReminders', this.settings.deadlineReminders, 'checkbox');
        this.setFieldValue('eventNotifications', this.settings.eventNotifications, 'checkbox');
    }
    
    setFieldValue(fieldId, value, type = 'text') {
        const field = document.getElementById(fieldId);
        if (field) {
            if (type === 'checkbox') {
                field.checked = value;
            } else {
                field.value = value || '';
            }
        }
    }
    
    bindEvents() {
        // Auto-save em mudanças importantes
        const autoSaveFields = [
            'userName', 'userEmail', 'userPhone',
            'apartmentAddress', 'apartmentSize', 'apartmentRooms',
            'moveInDate', 'apartmentType',
            'totalBudget', 'monthlyBudget'
        ];
        
        autoSaveFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('blur', () => this.autoSave());
            }
        });
        
        // Checkboxes de categorias prioritárias
        const categoryCheckboxes = document.querySelectorAll('input[name="priorityCategories"]');
        categoryCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => this.autoSave());
        });
        
        // Toggle switches de notificações
        const toggles = ['budgetAlerts', 'deadlineReminders', 'eventNotifications'];
        toggles.forEach(toggleId => {
            const toggle = document.getElementById(toggleId);
            if (toggle) {
                toggle.addEventListener('change', () => this.autoSave());
            }
        });
    }
    
    collectFormData() {
        const formData = { ...this.settings };
        
        // Perfil Pessoal
        formData.userName = this.getFieldValue('userName');
        formData.userEmail = this.getFieldValue('userEmail');
        formData.userPhone = this.getFieldValue('userPhone');
        
        // Apartamento
        formData.apartmentAddress = this.getFieldValue('apartmentAddress');
        formData.apartmentSize = this.getFieldValue('apartmentSize');
        formData.apartmentRooms = this.getFieldValue('apartmentRooms');
        formData.moveInDate = this.getFieldValue('moveInDate');
        formData.apartmentType = this.getFieldValue('apartmentType');
        
        // Orçamento
        formData.totalBudget = this.getFieldValue('totalBudget');
        formData.monthlyBudget = this.getFieldValue('monthlyBudget');
        
        // Categorias prioritárias
        const selectedCategories = [];
        const checkboxes = document.querySelectorAll('input[name="priorityCategories"]:checked');
        checkboxes.forEach(checkbox => {
            selectedCategories.push(checkbox.value);
        });
        formData.priorityCategories = selectedCategories;
        
        // Notificações
        formData.budgetAlerts = this.getFieldValue('budgetAlerts', 'checkbox');
        formData.deadlineReminders = this.getFieldValue('deadlineReminders', 'checkbox');
        formData.eventNotifications = this.getFieldValue('eventNotifications', 'checkbox');
        
        formData.updatedAt = new Date().toISOString();
        
        return formData;
    }
    
    getFieldValue(fieldId, type = 'text') {
        const field = document.getElementById(fieldId);
        if (field) {
            return type === 'checkbox' ? field.checked : field.value;
        }
        return type === 'checkbox' ? false : '';
    }
    
    autoSave() {
        try {
            this.settings = this.collectFormData();
            localStorage.setItem(this.storageKey, JSON.stringify(this.settings));
            this.updateStorageInfo();
        } catch (error) {
            console.error('Erro no auto-save:', error);
        }
    }
    
    saveSettings() {
        try {
            this.settings = this.collectFormData();
            localStorage.setItem(this.storageKey, JSON.stringify(this.settings));
            this.updateStorageInfo();
            
            this.showMessage('✅ Configurações salvas com sucesso!', 'success');
            
            // Atualizar dados compartilhados se existir o sistema
            if (window.CamillyNavigation && window.CamillyNavigation.storage) {
                window.CamillyNavigation.storage.setItem('user_settings', this.settings);
            }
        } catch (error) {
            console.error('Erro ao salvar configurações:', error);
            this.showMessage('❌ Erro ao salvar configurações. Tente novamente.', 'error');
        }
    }
    
    resetSettings() {
        if (confirm('Tem certeza que deseja restaurar todas as configurações para os valores padrão? Esta ação não pode ser desfeita.')) {
            try {
                this.settings = { ...this.defaultSettings };
                localStorage.setItem(this.storageKey, JSON.stringify(this.settings));
                this.populateForm();
                this.updateStorageInfo();
                
                this.showMessage('🔄 Configurações restauradas para os valores padrão!', 'success');
            } catch (error) {
                console.error('Erro ao restaurar configurações:', error);
                this.showMessage('❌ Erro ao restaurar configurações.', 'error');
            }
        }
    }
    
    exportAllData() {
        try {
            const allData = {
                settings: this.settings,
                planningData: JSON.parse(localStorage.getItem('camilly_planning_data') || '{}'),
                events: JSON.parse(localStorage.getItem('camilly_events') || '[]'),
                roomData: {},
                exportDate: new Date().toISOString(),
                version: '1.0'
            };
            
            // Coletar dados dos cômodos
            const rooms = ['quarto', 'cozinha', 'sala', 'banheiro'];
            rooms.forEach(room => {
                const roomKey = `camilly_${room}_data`;
                allData.roomData[room] = JSON.parse(localStorage.getItem(roomKey) || '[]');
            });
            
            const dataStr = JSON.stringify(allData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = `camilly-apartamento-backup-${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            
            // Atualizar data do último backup
            this.settings.lastBackupDate = new Date().toISOString();
            this.saveSettings();
            
            this.showMessage('📤 Backup exportado com sucesso!', 'success');
        } catch (error) {
            console.error('Erro ao exportar dados:', error);
            this.showMessage('❌ Erro ao exportar dados.', 'error');
        }
    }
    
    importAllData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const importedData = JSON.parse(e.target.result);
                        
                        if (confirm('Tem certeza que deseja importar estes dados? Todos os dados atuais serão substituídos.')) {
                            // Importar configurações
                            if (importedData.settings) {
                                localStorage.setItem(this.storageKey, JSON.stringify(importedData.settings));
                            }
                            
                            // Importar dados de planejamento
                            if (importedData.planningData) {
                                localStorage.setItem('camilly_planning_data', JSON.stringify(importedData.planningData));
                            }
                            
                            // Importar eventos
                            if (importedData.events) {
                                localStorage.setItem('camilly_events', JSON.stringify(importedData.events));
                            }
                            
                            // Importar dados dos cômodos
                            if (importedData.roomData) {
                                Object.keys(importedData.roomData).forEach(room => {
                                    const roomKey = `camilly_${room}_data`;
                                    localStorage.setItem(roomKey, JSON.stringify(importedData.roomData[room]));
                                });
                            }
                            
                            this.loadSettings();
                            this.showMessage('📥 Dados importados com sucesso! Recarregue a página para ver todas as mudanças.', 'success');
                        }
                    } catch (error) {
                        console.error('Erro ao importar dados:', error);
                        this.showMessage('❌ Erro ao importar dados. Verifique se o arquivo está correto.', 'error');
                    }
                };
                reader.readAsText(file);
            }
        };
        
        input.click();
    }
    
    clearAllData() {
        if (confirm('⚠️ ATENÇÃO: Esta ação irá apagar TODOS os seus dados permanentemente. Tem certeza que deseja continuar?')) {
            if (confirm('Esta é sua última chance! Todos os dados serão perdidos. Confirma a exclusão?')) {
                try {
                    // Limpar todas as chaves relacionadas ao sistema
                    const keysToRemove = [
                        this.storageKey,
                        'camilly_planning_data',
                        'camilly_events',
                        'camilly_quarto_data',
                        'camilly_cozinha_data',
                        'camilly_sala_data',
                        'camilly_banheiro_data',
                        'camilly_welcome_seen'
                    ];
                    
                    keysToRemove.forEach(key => {
                        localStorage.removeItem(key);
                    });
                    
                    // Restaurar configurações padrão
                    this.settings = { ...this.defaultSettings };
                    this.populateForm();
                    this.updateStorageInfo();
                    
                    this.showMessage('🗑️ Todos os dados foram removidos com sucesso!', 'success');
                } catch (error) {
                    console.error('Erro ao limpar dados:', error);
                    this.showMessage('❌ Erro ao limpar dados.', 'error');
                }
            }
        }
    }
    
    updateStorageInfo() {
        try {
            // Calcular uso do localStorage
            let totalSize = 0;
            let itemCount = 0;
            
            for (let key in localStorage) {
                if (localStorage.hasOwnProperty(key) && key.startsWith('camilly_')) {
                    totalSize += localStorage[key].length;
                    itemCount++;
                }
            }
            
            // Atualizar elementos da interface
            const lastBackupElement = document.getElementById('lastBackupDate');
            const savedItemsElement = document.getElementById('savedItemsCount');
            const storageUsedElement = document.getElementById('storageUsed');
            
            if (lastBackupElement) {
                const lastBackup = this.settings.lastBackupDate;
                lastBackupElement.textContent = lastBackup 
                    ? new Date(lastBackup).toLocaleString('pt-BR')
                    : 'Nunca';
            }
            
            if (savedItemsElement) {
                savedItemsElement.textContent = itemCount;
            }
            
            if (storageUsedElement) {
                const sizeInKB = (totalSize / 1024).toFixed(2);
                storageUsedElement.textContent = `${sizeInKB} KB`;
            }
        } catch (error) {
            console.error('Erro ao atualizar informações de armazenamento:', error);
        }
    }
    
    showMessage(message, type = 'info') {
        // Remover mensagem anterior se existir
        const existingMessage = document.querySelector('.settings-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Criar nova mensagem
        const messageDiv = document.createElement('div');
        messageDiv.className = `settings-message settings-message-${type}`;
        messageDiv.textContent = message;
        
        // Adicionar estilos inline
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            animation: slideIn 0.3s ease;
            max-width: 400px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        `;
        
        // Cores baseadas no tipo
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            info: '#17a2b8',
            warning: '#ffc107'
        };
        
        messageDiv.style.backgroundColor = colors[type] || colors.info;
        
        document.body.appendChild(messageDiv);
        
        // Remover após 5 segundos
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => messageDiv.remove(), 300);
            }
        }, 5000);
    }
}

// Funções globais para os botões
function saveSettings() {
    if (window.camillySettings) {
        window.camillySettings.saveSettings();
    }
}

function resetSettings() {
    if (window.camillySettings) {
        window.camillySettings.resetSettings();
    }
}

function exportAllData() {
    if (window.camillySettings) {
        window.camillySettings.exportAllData();
    }
}

function importAllData() {
    if (window.camillySettings) {
        window.camillySettings.importAllData();
    }
}

function clearAllData() {
    if (window.camillySettings) {
        window.camillySettings.clearAllData();
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    window.camillySettings = new CamillySettings();
    
    // Adicionar animações CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});