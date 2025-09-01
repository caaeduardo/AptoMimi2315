// Formulário Avançado - JavaScript

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initializeAdvancedForm();
    loadDraftData();
});

function initializeAdvancedForm() {
    const form = document.getElementById('advancedPlanningForm');
    if (form) {
        form.addEventListener('submit', handleAdvancedFormSubmit);
    }
    
    // Auto-save draft every 30 seconds
    setInterval(autoSaveDraft, 30000);
}

// Manipulação do formulário
function handleAdvancedFormSubmit(event) {
    event.preventDefault();
    
    const formData = collectFormData();
    
    if (validateFormData(formData)) {
        saveAdvancedItem(formData);
        showSuccessMessage('Item salvo com sucesso!');
        clearAdvancedForm();
    } else {
        showErrorMessage('Por favor, preencha todos os campos obrigatórios.');
    }
}

function collectFormData() {
    const form = document.getElementById('advancedPlanningForm');
    const formData = new FormData(form);
    
    const data = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        // Informações básicas
        name: formData.get('itemName'),
        room: formData.get('itemRoom'),
        category: formData.get('itemCategory'),
        priority: formData.get('itemPriority'),
        
        // Informações financeiras
        price: parseFloat(formData.get('itemPrice')) || 0,
        maxPrice: parseFloat(formData.get('itemMaxPrice')) || 0,
        store: formData.get('itemStore'),
        payment: formData.get('itemPayment'),
        
        // Especificações
        brand: formData.get('itemBrand'),
        model: formData.get('itemModel'),
        color: formData.get('itemColor'),
        size: formData.get('itemSize'),
        specs: formData.get('itemSpecs'),
        
        // Planejamento
        deadline: formData.get('itemDeadline'),
        delivery: formData.get('itemDelivery'),
        status: formData.get('itemStatus'),
        quantity: parseInt(formData.get('itemQuantity')) || 1,
        
        // Observações
        notes: formData.get('itemNotes'),
        links: formData.get('itemLinks')
    };
    
    return data;
}

function validateFormData(data) {
    // Campos obrigatórios
    const requiredFields = ['name', 'room', 'category', 'priority'];
    
    for (let field of requiredFields) {
        if (!data[field] || data[field].trim() === '') {
            return false;
        }
    }
    
    return true;
}

function saveAdvancedItem(data) {
    try {
        // Salvar no localStorage usando CamillyStorage
        if (window.CamillyNavigation && window.CamillyNavigation.storage) {
            const storage = window.CamillyNavigation.storage;
            
            // Salvar item individual
            storage.save(`advanced-item-${data.id}`, data);
            
            // Atualizar lista de itens avançados
            const existingItems = storage.load('advanced-items-list');
            const itemsList = existingItems ? existingItems.data : [];
            
            itemsList.push({
                id: data.id,
                name: data.name,
                room: data.room,
                category: data.category,
                priority: data.priority,
                timestamp: data.timestamp
            });
            
            storage.save('advanced-items-list', itemsList);
            
            // Também salvar no formato compatível com planejamento.js
            saveToRoomData(data);
            
        } else {
            // Fallback para localStorage padrão
            localStorage.setItem(`camilly-advanced-item-${data.id}`, JSON.stringify(data));
        }
        
        // Limpar rascunho após salvar
        clearDraft();
        
    } catch (error) {
        console.error('Erro ao salvar item:', error);
        showErrorMessage('Erro ao salvar item. Tente novamente.');
    }
}

function saveToRoomData(data) {
    try {
        const storage = window.CamillyNavigation.storage;
        const roomDataKey = `room-${data.room}`;
        const existingRoomData = storage.load(roomDataKey);
        
        let roomData = existingRoomData ? existingRoomData.data : {
            items: [],
            categories: {}
        };
        
        // Converter dados avançados para formato simples
        const simpleItem = {
            id: data.id,
            name: data.name,
            category: data.category,
            priority: data.priority,
            price: data.price,
            store: data.store,
            notes: data.notes,
            completed: data.status === 'entregue',
            timestamp: data.timestamp
        };
        
        roomData.items.push(simpleItem);
        
        // Atualizar contadores de categoria
        if (!roomData.categories[data.category]) {
            roomData.categories[data.category] = 0;
        }
        roomData.categories[data.category]++;
        
        storage.save(roomDataKey, roomData);
        
    } catch (error) {
        console.error('Erro ao salvar no formato de cômodo:', error);
    }
}

// Funcionalidades de rascunho
function saveAsDraft() {
    const formData = collectFormData();
    
    try {
        if (window.CamillyNavigation && window.CamillyNavigation.storage) {
            window.CamillyNavigation.storage.save('advanced-form-draft', formData);
        } else {
            localStorage.setItem('camilly-advanced-form-draft', JSON.stringify(formData));
        }
        
        showSuccessMessage('Rascunho salvo com sucesso!');
    } catch (error) {
        console.error('Erro ao salvar rascunho:', error);
        showErrorMessage('Erro ao salvar rascunho.');
    }
}

function loadDraftData() {
    try {
        let draftData = null;
        
        if (window.CamillyNavigation && window.CamillyNavigation.storage) {
            const draft = window.CamillyNavigation.storage.load('advanced-form-draft');
            draftData = draft ? draft.data : null;
        } else {
            const draft = localStorage.getItem('camilly-advanced-form-draft');
            draftData = draft ? JSON.parse(draft) : null;
        }
        
        if (draftData) {
            populateForm(draftData);
            showInfoMessage('Rascunho carregado automaticamente.');
        }
    } catch (error) {
        console.error('Erro ao carregar rascunho:', error);
    }
}

function populateForm(data) {
    const form = document.getElementById('advancedPlanningForm');
    if (!form) return;
    
    // Preencher todos os campos
    Object.keys(data).forEach(key => {
        const field = form.querySelector(`[name="${key}"]`);
        if (field && data[key]) {
            field.value = data[key];
        }
    });
}

function autoSaveDraft() {
    const form = document.getElementById('advancedPlanningForm');
    if (!form) return;
    
    // Verificar se há dados no formulário
    const formData = collectFormData();
    const hasData = Object.values(formData).some(value => 
        value && value.toString().trim() !== '' && value !== 0
    );
    
    if (hasData) {
        saveAsDraft();
    }
}

function clearDraft() {
    try {
        if (window.CamillyNavigation && window.CamillyNavigation.storage) {
            window.CamillyNavigation.storage.remove('advanced-form-draft');
        } else {
            localStorage.removeItem('camilly-advanced-form-draft');
        }
    } catch (error) {
        console.error('Erro ao limpar rascunho:', error);
    }
}

// Limpeza do formulário
function clearAdvancedForm() {
    const form = document.getElementById('advancedPlanningForm');
    if (form) {
        form.reset();
        
        // Restaurar valores padrão
        document.getElementById('advItemPriority').value = 'media';
        document.getElementById('advItemStatus').value = 'planejado';
        document.getElementById('advItemQuantity').value = '1';
    }
    
    clearDraft();
    showInfoMessage('Formulário limpo.');
}

// Mensagens de feedback
function showSuccessMessage(message) {
    showMessage(message, 'success');
}

function showErrorMessage(message) {
    showMessage(message, 'error');
}

function showInfoMessage(message) {
    showMessage(message, 'info');
}

function showMessage(message, type) {
    // Criar elemento de mensagem
    const messageEl = document.createElement('div');
    messageEl.className = `message-toast ${type}`;
    messageEl.textContent = message;
    
    // Estilos inline para garantir visibilidade
    messageEl.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    // Cores baseadas no tipo
    switch (type) {
        case 'success':
            messageEl.style.backgroundColor = '#10b981';
            break;
        case 'error':
            messageEl.style.backgroundColor = '#ef4444';
            break;
        case 'info':
            messageEl.style.backgroundColor = '#3b82f6';
            break;
        default:
            messageEl.style.backgroundColor = '#6b7280';
    }
    
    document.body.appendChild(messageEl);
    
    // Remover após 4 segundos
    setTimeout(() => {
        if (messageEl.parentNode) {
            messageEl.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                messageEl.remove();
            }, 300);
        }
    }, 4000);
}

// Função para abrir o formulário avançado (chamada do planejamento.html)
function openAdvancedForm() {
    window.location.href = 'formulario.html';
}

// Tornar funções globalmente disponíveis
window.openAdvancedForm = openAdvancedForm;
window.clearAdvancedForm = clearAdvancedForm;
window.saveAsDraft = saveAsDraft;

// Adicionar estilos CSS para animações
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
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