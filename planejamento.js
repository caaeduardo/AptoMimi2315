// Planejamento JavaScript - Funcionalidades específicas

// Dados iniciais dos cômodos
const initialRoomData = {
    sala: [
        { id: 1, text: 'Banco baú ao lado da TV + Mesa redondo + 2 cadeiras', completed: false },
        { id: 2, text: 'Espelho até o teto / Jardim Invertido', completed: false },
        { id: 3, text: 'Prateleira suspensa, com metalon dourados', completed: false },
        { id: 4, text: 'Vaso de folha seca', completed: false },
        { id: 5, text: 'Sofá cama sem encosto / Encosto fino', completed: false },
        { id: 6, text: 'Prateleira suspensa, com metalon dourados (segunda)', completed: false }
    ],
    quarto: [
        { id: 1, text: 'Cama baú', completed: false },
        { id: 2, text: 'Cabeceira adesiva estofada', completed: false },
        { id: 3, text: 'LED na cabeceira', completed: false },
        { id: 4, text: 'Cortina blackout', completed: false }
    ],
    cozinha: [
        // Revestimento
        { id: 1, text: 'Bianco Covelano da Portobello', completed: false, category: 'Revestimento' },
        { id: 2, text: 'Granito branco pitaya (Barato)', completed: false, category: 'Revestimento' },
        { id: 3, text: 'Bancada de porcelanato', completed: false, category: 'Revestimento' },
        { id: 4, text: 'Tanque com Tampo de pedra', completed: false, category: 'Revestimento' },
        { id: 5, text: 'Tanque de alumínio/ tanque da construtora', completed: false, category: 'Revestimento' },
        { id: 6, text: 'Meia parede de Drywall', completed: false, category: 'Revestimento' },
        
        // Planejados
        { id: 7, text: 'Nicho em cima da geladeira', completed: false, category: 'Planejados' },
        { id: 8, text: 'Nicho ao lado do armário superior do fogão (3 nichos estreitos)', completed: false, category: 'Planejados' },
        { id: 9, text: 'Prateleira ao lado do armário superior do fogão', completed: false, category: 'Planejados' },
        { id: 10, text: 'Prateleira incompleta ao lado do micro-ondas', completed: false, category: 'Planejados' },
        { id: 11, text: 'Tirar o Ripado', completed: false, category: 'Planejados' },
        { id: 12, text: 'Nicho embaixo do armário de produtos de limpeza', completed: false, category: 'Planejados' },
        { id: 13, text: 'Barzinho de taça apertado', completed: false, category: 'Planejados' },
        { id: 14, text: 'Despensa em cima da máquina', completed: false, category: 'Planejados' },
        
        // Eletros
        { id: 15, text: 'Depurador slim', completed: false, category: 'Eletros' },
        { id: 16, text: 'Cooktop Electrolux', completed: false, category: 'Eletros' },
        { id: 17, text: 'Forno Electrolux 50 litros', completed: false, category: 'Eletros' },
        
        // Mobília/Utensílios
        { id: 18, text: 'Divisória de talher', completed: false, category: 'Mobília/Utensílios' }
    ],
    varanda: [
        { id: 1, text: 'Plantas decorativas', completed: false },
        { id: 2, text: 'Mesa pequena para varanda', completed: false },
        { id: 3, text: 'Cadeiras para área externa', completed: false }
    ]
};

// Variáveis globais
let roomData = {};
let events = [];
let nextItemId = 1000;

// Funcionalidades de Sincronização e Indicadores Visuais
function showSyncStatus(status, message) {
    const syncStatus = document.getElementById('syncStatus');
    if (syncStatus) {
        syncStatus.textContent = message;
        syncStatus.className = `sync-status show ${status}`;
        
        setTimeout(() => {
            syncStatus.classList.remove('show');
        }, 3000);
    }
}

function updateAllRoomCounters() {
    Object.keys(roomData).forEach(room => {
        updateRoomCounter(room);
    });
}

function simulateDataSync() {
    showSyncStatus('syncing', '🔄 Sincronizando dados...');
    
    // Simular tempo de sincronização
    setTimeout(() => {
        showSyncStatus('success', '✅ Dados sincronizados!');
        
        // Atualizar indicador de dados compartilhados
        if (typeof showSharedDataIndicator === 'function') {
            showSharedDataIndicator('📊 Sincronização completa');
        }
    }, 1500);
}

function handleDataImportExport(action) {
    showSyncStatus('syncing', `🔄 ${action}...`);
    
    setTimeout(() => {
        showSyncStatus('success', `✅ ${action} concluída!`);
        updateAllRoomCounters();
    }, 1000);
}

// Inicialização
document.addEventListener('DOMContentLoaded', async function() {
    await loadData();
    renderAllRooms();
    setupEventListeners();
    loadEvents();
    renderEvents();
    setupSharedDataIndicators();
    
    // Integração com navegação global
    if (window.CamillyNavigation) {
        window.CamillyNavigation.setActiveNavigation();
        window.CamillyNavigation.saveNavigationState('Planejamento');
    }
    
    // Verifica se há dados compartilhados de outras páginas
    checkSharedData();
    
    // Atualizar todos os contadores
    updateAllRoomCounters();
    
    // Simular sincronização inicial
    setTimeout(() => {
        simulateDataSync();
    }, 1000);
    
    console.log('📋 Planejamento carregado com sucesso!');
});

// Carrega dados do banco de dados ou usa dados iniciais
async function loadData() {
    try {
        // Tentar carregar dados do banco online
        const result = await window.apartmentAPI.getPlanejamento('room-data');
        if (result.success && result.data) {
            roomData = result.data.roomData || { ...initialRoomData };
        } else {
            roomData = { ...initialRoomData };
            await saveData();
        }
        
        // Carrega eventos
        const eventsResult = await window.apartmentAPI.getAllEventos();
        if (eventsResult.success && eventsResult.data) {
            events = eventsResult.data;
        }
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        // Fallback para localStorage
        const savedData = localStorage.getItem('camilly-room-data');
        if (savedData) {
            roomData = JSON.parse(savedData);
        } else {
            roomData = { ...initialRoomData };
        }
        
        const savedEvents = localStorage.getItem('camilly-events');
        if (savedEvents) {
            events = JSON.parse(savedEvents);
        }
    }
}

// Salva dados no banco de dados
async function saveData() {
    try {
        const data = {
            roomData: roomData,
            lastUpdated: new Date().toISOString()
        };
        
        const result = await window.apartmentAPI.savePlanejamento({
            id: 'room-data',
            ...data
        });
        
        if (result.success) {
            console.log('✅ Dados do planejamento salvos:', result.online ? 'online' : 'localmente');
        }
    } catch (error) {
        console.error('❌ Erro ao salvar dados:', error);
        // Fallback para localStorage
        localStorage.setItem('camilly-room-data', JSON.stringify(roomData));
    }
}

// Salva eventos no banco de dados
async function saveEvents() {
    try {
        // Salvar cada evento individualmente
        for (const event of events) {
            await window.apartmentAPI.saveEvento(event);
        }
        console.log('✅ Eventos salvos no banco de dados');
    } catch (error) {
        console.error('❌ Erro ao salvar eventos:', error);
        // Fallback para localStorage
        localStorage.setItem('camilly-events', JSON.stringify(events));
    }
}

// Renderiza todos os cômodos
function renderAllRooms() {
    Object.keys(roomData).forEach(room => {
        renderRoom(room);
        updateRoomStats(room);
    });
}

// Renderiza um cômodo específico
function renderRoom(roomName) {
    const container = document.getElementById(`${roomName}-items`);
    if (!container) return;
    
    container.innerHTML = '';
    
    roomData[roomName].forEach(item => {
        const itemElement = createItemElement(item, roomName);
        container.appendChild(itemElement);
    });
    
    updateRoomCounter(roomName);
}

// Cria elemento de item
function createItemElement(item, roomName) {
    const div = document.createElement('div');
    div.className = `item ${item.completed ? 'completed' : ''}`;
    div.innerHTML = `
        <div class="item-content">
            <div class="item-checkbox ${item.completed ? 'checked' : ''}" 
                 onclick="toggleItem('${roomName}', ${item.id})"></div>
            <span class="item-text">${item.text}</span>
            ${item.category ? `<span class="item-category">(${item.category})</span>` : ''}
        </div>
        <div class="item-actions">
            <button class="item-btn edit" onclick="editItem('${roomName}', ${item.id})" title="Editar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
            </button>
            <button class="item-btn delete" onclick="deleteItem('${roomName}', ${item.id})" title="Excluir">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3,6 5,6 21,6"></polyline>
                    <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
            </button>
        </div>
    `;
    return div;
}

// Alterna status do item
async function toggleItem(roomName, itemId) {
    const item = roomData[roomName].find(item => item.id === itemId);
    if (item) {
        item.completed = !item.completed;
        await saveData();
        renderRoom(roomName);
        updateRoomStats(roomName);
        
        // Feedback visual
        showNotification(item.completed ? 'Item marcado como comprado!' : 'Item desmarcado');
    }
}

// Adiciona novo item
async function addNewItem(roomName) {
    const text = prompt('Digite o nome do novo item:');
    if (text && text.trim()) {
        const newItem = {
            id: nextItemId++,
            text: text.trim(),
            completed: false
        };
        
        roomData[roomName].push(newItem);
        await saveData();
        renderRoom(roomName);
        updateRoomStats(roomName);
        
        showNotification('Novo item adicionado!');
    }
}

// Edita item
async function editItem(roomName, itemId) {
    const item = roomData[roomName].find(item => item.id === itemId);
    if (item) {
        const newText = prompt('Editar item:', item.text);
        if (newText && newText.trim()) {
            item.text = newText.trim();
            await saveData();
            renderRoom(roomName);
            showNotification('Item editado!');
        }
    }
}

// Deleta item
async function deleteItem(roomName, itemId) {
    if (confirm('Tem certeza que deseja excluir este item?')) {
        roomData[roomName] = roomData[roomName].filter(item => item.id !== itemId);
        await saveData();
        renderRoom(roomName);
        updateRoomStats(roomName);
        showNotification('Item excluído!');
    }
}

// Atualiza estatísticas do cômodo
function updateRoomStats(roomName) {
    const items = roomData[roomName];
    const completed = items.filter(item => item.completed).length;
    const pending = items.length - completed;
    
    const pendingElement = document.getElementById(`${roomName}-pending`);
    const completedElement = document.getElementById(`${roomName}-completed`);
    
    if (pendingElement) pendingElement.textContent = pending;
    if (completedElement) completedElement.textContent = completed;
}

// Atualiza contador de itens do cômodo
function updateRoomCounter(roomName) {
    const items = roomData[roomName];
    const total = items.length;
    const completed = items.filter(item => item.completed).length;
    
    // Atualiza contador no cabeçalho do cômodo
    const counterElement = document.querySelector(`#${roomName} .room-counter`);
    if (counterElement) {
        counterElement.textContent = `${completed}/${total}`;
        
        // Adiciona classe de status baseado no progresso
        counterElement.className = 'room-counter';
        if (completed === total && total > 0) {
            counterElement.classList.add('completed');
        } else if (completed > 0) {
            counterElement.classList.add('in-progress');
        }
    }
    
    // Atualiza indicador visual de progresso
    const progressElement = document.querySelector(`#${roomName} .room-progress`);
    if (progressElement) {
        const percentage = total > 0 ? (completed / total) * 100 : 0;
        progressElement.style.width = `${percentage}%`;
        
        // Adiciona classes de cor baseado no progresso
        progressElement.className = 'room-progress';
        if (percentage === 100) {
            progressElement.classList.add('complete');
        } else if (percentage > 50) {
            progressElement.classList.add('good');
        } else if (percentage > 0) {
            progressElement.classList.add('started');
        }
    }
}

// Event Listeners
function setupEventListeners() {
    // Calculadora
    document.getElementById('calculatorBtn').addEventListener('click', () => {
        document.getElementById('calculatorModal').style.display = 'block';
    });
    
    // Eventos
    document.getElementById('eventsBtn').addEventListener('click', () => {
        document.getElementById('eventsModal').style.display = 'block';
    });
    
    // Botões de importação/exportação
    const importBtn = document.getElementById('importFromBudget');
    if (importBtn) {
        importBtn.addEventListener('click', importFromBudget);
    }
    
    const exportBtn = document.getElementById('exportToOtherPages');
    if (exportBtn) {
        exportBtn.addEventListener('click', shareItemsToOtherPages);
    }
    
    const exportRoomBtn = document.getElementById('exportRoomData');
    if (exportRoomBtn) {
        exportRoomBtn.addEventListener('click', exportRoomData);
    }
    
    // Fechar modais clicando fora
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
}

// Funções da Calculadora
function appendToDisplay(value) {
    const display = document.getElementById('calculatorDisplay');
    display.value += value;
}

function clearCalculator() {
    document.getElementById('calculatorDisplay').value = '';
}

function deleteLast() {
    const display = document.getElementById('calculatorDisplay');
    display.value = display.value.slice(0, -1);
}

function calculate() {
    const display = document.getElementById('calculatorDisplay');
    try {
        // Substitui × por * para cálculo
        const expression = display.value.replace(/×/g, '*');
        const result = eval(expression);
        display.value = result;
    } catch (error) {
        display.value = 'Erro';
        setTimeout(() => {
            display.value = '';
        }, 1500);
    }
}

// Funções de Eventos
function addEvent() {
    const title = document.getElementById('eventTitle').value.trim();
    const date = document.getElementById('eventDate').value;
    const time = document.getElementById('eventTime').value;
    const priority = document.getElementById('eventPriority').value;
    
    if (!title || !date) {
        alert('Por favor, preencha o título e a data do evento.');
        return;
    }
    
    const newEvent = {
        id: Date.now(),
        title,
        date,
        time,
        priority,
        created: new Date().toISOString()
    };
    
    events.push(newEvent);
    saveEvents();
    renderEvents();
    
    // Limpa formulário
    document.getElementById('eventTitle').value = '';
    document.getElementById('eventDate').value = '';
    document.getElementById('eventTime').value = '';
    document.getElementById('eventPriority').value = 'low';
    
    showNotification('Evento adicionado!');
}

function deleteEvent(eventId) {
    if (confirm('Tem certeza que deseja excluir este evento?')) {
        events = events.filter(event => event.id !== eventId);
        saveEvents();
        renderEvents();
        showNotification('Evento excluído!');
    }
}

function loadEvents() {
    // Eventos de exemplo se não houver dados salvos
    if (events.length === 0) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        events = [
            {
                id: 1,
                title: 'Visita à loja de móveis',
                date: tomorrow.toISOString().split('T')[0],
                time: '14:00',
                priority: 'high',
                created: new Date().toISOString()
            },
            {
                id: 2,
                title: 'Medição da cozinha',
                date: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                time: '10:00',
                priority: 'medium',
                created: new Date().toISOString()
            }
        ];
        saveEvents();
    }
}

function renderEvents() {
    const container = document.getElementById('eventsList');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Ordena eventos por data
    const sortedEvents = events.sort((a, b) => new Date(a.date + ' ' + (a.time || '00:00')) - new Date(b.date + ' ' + (b.time || '00:00')));
    
    sortedEvents.forEach(event => {
        const eventElement = createEventElement(event);
        container.appendChild(eventElement);
    });
    
    if (events.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #a0916d; padding: 2rem;">Nenhum evento agendado</p>';
    }
}

function createEventElement(event) {
    const div = document.createElement('div');
    const eventDate = new Date(event.date + ' ' + (event.time || '00:00'));
    const today = new Date();
    const isToday = eventDate.toDateString() === today.toDateString();
    const isOverdue = eventDate < today && !isToday;
    
    let statusClass = event.priority;
    if (isOverdue) statusClass += ' overdue';
    if (isToday) statusClass += ' today';
    
    div.className = `event-item ${statusClass}`;
    div.innerHTML = `
        <div class="event-info">
            <h4>${event.title}</h4>
            <p>${formatEventDate(event.date)} ${event.time ? 'às ' + event.time : ''}</p>
            <small>Prioridade: ${getPriorityText(event.priority)}</small>
        </div>
        <div class="event-actions">
            <button onclick="deleteEvent(${event.id})" title="Excluir">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3,6 5,6 21,6"></polyline>
                    <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"></path>
                </svg>
            </button>
        </div>
    `;
    return div;
}

function formatEventDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

function getPriorityText(priority) {
    const priorities = {
        low: 'Baixa',
        medium: 'Média',
        high: 'Alta'
    };
    return priorities[priority] || priority;
}

// Fecha modal
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Sistema de notificações (reutiliza do script.js)
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

// Funções de comunicação entre páginas
function checkSharedData() {
    // Verifica se há itens compartilhados de outras páginas
    if (window.CamillyNavigation) {
        const sharedItems = window.CamillyNavigation.getSharedData('new-items');
        if (sharedItems && sharedItems.data) {
            sharedItems.data.forEach(item => {
                if (item.room && roomData[item.room]) {
                    const newItem = {
                        id: nextItemId++,
                        text: item.text,
                        completed: false,
                        category: item.category || ''
                    };
                    roomData[item.room].push(newItem);
                }
            });
            
            // Limpa dados compartilhados após processar
            localStorage.removeItem('camilly-shared-new-items');
            
            // Atualiza interface
            saveData();
            renderAllRooms();
            
            showNotification(`${sharedItems.data.length} item(s) adicionado(s) de ${sharedItems.source}!`);
        }
    }
}

function shareItemsToOtherPages(items) {
    handleDataImportExport('Exportando dados');
    
    setTimeout(() => {
        if (window.CamillyNavigation) {
            window.CamillyNavigation.shareDataBetweenPages('planning-items', {
                rooms: roomData,
                totalItems: Object.values(roomData).flat().length,
                completedItems: Object.values(roomData).flat().filter(item => item.completed).length,
                lastUpdate: new Date().toISOString()
            });
        }
        
        showSyncStatus('success', '✅ Dados exportados com sucesso!');
        if (typeof showSharedDataIndicator === 'function') {
            showSharedDataIndicator('📤 Dados compartilhados com outras páginas');
        }
    }, 1000);
}

function exportRoomData(roomName) {
    if (!roomData[roomName]) {
        showSyncStatus('error', '❌ Cômodo não encontrado!');
        return;
    }
    
    handleDataImportExport(`Exportando dados do cômodo ${roomName}`);
    
    setTimeout(() => {
        const exportData = {
            room: roomName,
            items: roomData[roomName],
            stats: {
                total: roomData[roomName].length,
                completed: roomData[roomName].filter(item => item.completed).length,
                pending: roomData[roomName].filter(item => !item.completed).length
            },
            exportDate: new Date().toISOString()
        };
        
        // Compartilha dados para outras páginas
        if (window.CamillyNavigation) {
            window.CamillyNavigation.shareDataBetweenPages(`room-${roomName}`, exportData);
        }
        
        showSyncStatus('success', `✅ Dados do ${roomName} exportados!`);
        if (typeof showSharedDataIndicator === 'function') {
            showSharedDataIndicator(`📤 Dados do ${roomName} compartilhados`);
        }
    }, 1000);
    
    return exportData;
}

function importFromBudget() {
    handleDataImportExport('Importando dados do orçamento');
    
    setTimeout(() => {
        // Função para importar itens da página de orçamentos
        if (window.CamillyNavigation) {
            const budgetData = window.CamillyNavigation.getSharedData('budget-items');
            if (budgetData && budgetData.data) {
                let importedCount = 0;
                
                // Processa itens do orçamento
                budgetData.data.forEach(budgetItem => {
                    if (budgetItem.room && roomData[budgetItem.room]) {
                        // Verifica se o item já existe
                        const exists = roomData[budgetItem.room].some(item => 
                            item.text.toLowerCase() === budgetItem.name.toLowerCase()
                        );
                        
                        if (!exists) {
                            const newItem = {
                                id: nextItemId++,
                                text: budgetItem.name,
                                completed: budgetItem.purchased || false,
                                category: budgetItem.category || '',
                                price: budgetItem.price || null
                            };
                            roomData[budgetItem.room].push(newItem);
                            importedCount++;
                        }
                    }
                });
                
                if (importedCount > 0) {
                    saveData();
                    renderAllRooms();
                    updateAllRoomCounters();
                    showSyncStatus('success', `✅ ${importedCount} itens importados!`);
                    if (typeof showSharedDataIndicator === 'function') {
                        showSharedDataIndicator(`📥 ${importedCount} itens importados do orçamento`);
                    }
                } else {
                    showSyncStatus('error', '❌ Nenhum item novo encontrado para importar');
                }
            } else {
                showSyncStatus('error', '❌ Nenhum item encontrado no orçamento para importar');
            }
        } else {
            showSyncStatus('error', '❌ Sistema de navegação não disponível');
        }
    }, 1000);
}

// Atualiza dados compartilhados sempre que houver mudanças
function updateSharedData() {
    shareItemsToOtherPages();
}

// Sobrescreve funções existentes para incluir sincronização
const originalToggleItem = toggleItem;
window.toggleItem = function(roomName, itemId) {
    originalToggleItem(roomName, itemId);
    updateSharedData();
};

const originalAddNewItem = addNewItem;
window.addNewItem = function(roomName) {
    originalAddNewItem(roomName);
    updateSharedData();
};

const originalDeleteItem = deleteItem;
window.deleteItem = function(roomName, itemId) {
    originalDeleteItem(roomName, itemId);
    updateSharedData();
};

// Adiciona botões de exportação/importação
function addImportExportButtons() {
    const toolsGrid = document.querySelector('.tools-grid');
    if (toolsGrid) {
        const importBtn = document.createElement('button');
        importBtn.className = 'tool-btn';
        importBtn.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7,10 12,15 17,10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Importar do Orçamento
        `;
        importBtn.onclick = importFromBudget;
        
        const exportBtn = document.createElement('button');
        exportBtn.className = 'tool-btn';
        exportBtn.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17,8 12,3 7,8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            Exportar Dados
        `;
        exportBtn.onclick = () => {
            Object.keys(roomData).forEach(room => exportRoomData(room));
            showNotification('Todos os dados exportados!');
        };
        
        toolsGrid.appendChild(importBtn);
        toolsGrid.appendChild(exportBtn);
    }
}

// Adiciona botões após carregamento
setTimeout(addImportExportButtons, 1000);

// Navigation functions
function navigateToPage(page) {
    if (window.CamillyNavigation) {
        window.CamillyNavigation.saveNavigationState();
        // Share planning data with other pages
        const planningData = {
            rooms: roomData,
            totalItems: getTotalItems(),
            completedItems: getCompletedItems(),
            lastUpdate: new Date().toISOString(),
            source: 'planejamento'
        };
        window.CamillyNavigation.shareDataBetweenPages('planningData', planningData);
    }
    window.location.href = page;
}

// Setup shared data indicators
function setupSharedDataIndicators() {
    updateSharedDataIndicator();
    updateSyncStatus();
    updateConnectionStatus();
    
    // Check for shared data from other pages using global navigation
    if (window.CamillyNavigation) {
        window.CamillyNavigation.checkForSharedData();
    }
}

function updateSharedDataIndicator() {
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

function updateSyncStatus() {
    const syncStatus = document.getElementById('syncStatus');
    if (!syncStatus) return;
    
    syncStatus.classList.add('active');
    syncStatus.title = 'Planejamento sincronizado';
}

function updateConnectionStatus() {
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

function getTotalItems() {
    return Object.values(roomData).reduce((total, items) => total + items.length, 0);
}

function getCompletedItems() {
    return Object.values(roomData).reduce((total, items) => {
        return total + items.filter(item => item.completed).length;
    }, 0);
}

// Funcionalidades dos Botões de Categoria
function filterRoomItems(room, category) {
    const buttons = document.querySelectorAll(`#${room}-container .category-btn`);
    buttons.forEach(btn => btn.classList.remove('active'));
    
    const activeButton = document.querySelector(`#${room}-container .category-btn[onclick*="'${category}'"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
    
    const itemsList = document.getElementById(`${room}-items`);
    const items = itemsList.querySelectorAll('.item');
    
    items.forEach(item => {
        const itemCategory = item.dataset.category || 'all';
        if (category === 'all' || itemCategory === category) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// Funcionalidades do Calendário
let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

function openEventModal() {
    document.getElementById('eventoModal').style.display = 'flex';
    generateCalendar();
    loadEvents();
}

function closeEventModal() {
    document.getElementById('eventoModal').style.display = 'none';
}

function openAddEventForm() {
    document.getElementById('addEventModal').style.display = 'flex';
    // Definir data atual como padrão
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('eventDate').value = today;
}

function closeAddEventModal() {
    document.getElementById('addEventModal').style.display = 'none';
    clearEventForm();
}

function clearEventForm() {
    document.getElementById('addEventForm').reset();
}

function previousMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    generateCalendar();
    loadEvents();
}

function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    generateCalendar();
    loadEvents();
}

function generateCalendar() {
    const monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    
    const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    
    document.getElementById('currentMonth').textContent = `${monthNames[currentMonth]} ${currentYear}`;
    
    const calendarGrid = document.getElementById('calendarGrid');
    calendarGrid.innerHTML = '';
    
    // Adicionar cabeçalhos dos dias
    dayNames.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-day-header';
        dayHeader.textContent = day;
        calendarGrid.appendChild(dayHeader);
    });
    
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
    
    // Dias do mês anterior
    for (let i = firstDay - 1; i >= 0; i--) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day other-month';
        dayElement.textContent = daysInPrevMonth - i;
        calendarGrid.appendChild(dayElement);
    }
    
    // Dias do mês atual
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = day;
        
        // Marcar dia atual
        if (currentYear === today.getFullYear() && 
            currentMonth === today.getMonth() && 
            day === today.getDate()) {
            dayElement.classList.add('today');
        }
        
        // Verificar se há eventos neste dia
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayEvents = events.filter(event => event.date === dateStr);
        if (dayEvents.length > 0) {
            dayElement.classList.add('has-event');
        }
        
        calendarGrid.appendChild(dayElement);
    }
    
    // Completar com dias do próximo mês
    const totalCells = calendarGrid.children.length;
    const remainingCells = 42 - totalCells; // 6 semanas * 7 dias
    for (let day = 1; day <= remainingCells; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day other-month';
        dayElement.textContent = day;
        calendarGrid.appendChild(dayElement);
    }
}

function loadEvents() {
    // Carregar eventos do localStorage
    const storedEvents = window.CamillyNavigation?.storage?.get('events') || [];
    events = storedEvents;
    
    const eventsList = document.getElementById('eventsList');
    eventsList.innerHTML = '';
    
    // Filtrar eventos do mês atual
    const monthEvents = events.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear;
    });
    
    if (monthEvents.length === 0) {
        eventsList.innerHTML = '<p style="color: #a0916d; text-align: center;">Nenhum evento neste mês</p>';
        return;
    }
    
    monthEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    monthEvents.forEach(event => {
        const eventElement = document.createElement('div');
        eventElement.className = 'event-item';
        
        const eventDate = new Date(event.date);
        const formattedDate = eventDate.toLocaleDateString('pt-BR');
        const timeStr = event.time ? ` às ${event.time}` : '';
        
        eventElement.innerHTML = `
            <div class="event-info">
                <h5>${event.title}</h5>
                <p>${formattedDate}${timeStr}</p>
                ${event.description ? `<p>${event.description}</p>` : ''}
            </div>
            <div class="event-category ${event.category}">
                ${getCategoryIcon(event.category)} ${getCategoryName(event.category)}
            </div>
        `;
        
        eventsList.appendChild(eventElement);
    });
}

function getCategoryIcon(category) {
    const icons = {
        mudanca: '🏠',
        compras: '🛒',
        visita: '👥',
        servicos: '🔧',
        outros: '📋'
    };
    return icons[category] || '📋';
}

function getCategoryName(category) {
    const names = {
        mudanca: 'Mudança',
        compras: 'Compras',
        visita: 'Visita',
        servicos: 'Serviços',
        outros: 'Outros'
    };
    return names[category] || 'Outros';
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Event listener para o link Evento
    const eventoLink = document.getElementById('eventoLink');
    if (eventoLink) {
        eventoLink.addEventListener('click', function(e) {
            e.preventDefault();
            openEventModal();
        });
    }
    
    // Event listener para o formulário de adicionar evento
    const addEventForm = document.getElementById('addEventForm');
    if (addEventForm) {
        addEventForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const title = document.getElementById('eventTitle').value;
            const date = document.getElementById('eventDate').value;
            const time = document.getElementById('eventTime').value;
            const description = document.getElementById('eventDescription').value;
            const category = document.getElementById('eventCategory').value;
            
            const newEvent = {
                id: Date.now(),
                title,
                date,
                time,
                description,
                category
            };
            
            events.push(newEvent);
            
            // Salvar no localStorage
            if (window.CamillyNavigation?.storage) {
                window.CamillyNavigation.storage.set('events', events);
            }
            
            closeAddEventModal();
            generateCalendar();
            loadEvents();
            
            // Mostrar notificação
            if (typeof showNotification === 'function') {
                showNotification('Evento adicionado com sucesso!', 'success');
            }
        });
    }
    
    // Fechar modais ao clicar fora
    window.addEventListener('click', function(e) {
        const eventoModal = document.getElementById('eventoModal');
        const addEventModal = document.getElementById('addEventModal');
        
        if (e.target === eventoModal) {
            closeEventModal();
        }
        if (e.target === addEventModal) {
            closeAddEventModal();
        }
    });
});

// Função para abrir formulário avançado
function openAdvancedForm() {
    window.location.href = 'formulario.html';
}

// Exporta funções globais para uso no HTML
window.addNewItem = addNewItem;
window.toggleItem = toggleItem;
window.editItem = editItem;
window.deleteItem = deleteItem;
window.appendToDisplay = appendToDisplay;
window.clearCalculator = clearCalculator;
window.deleteLast = deleteLast;
window.calculate = calculate;
window.addEvent = addEvent;
window.deleteEvent = deleteEvent;
window.closeModal = closeModal;
window.exportRoomData = exportRoomData;
window.importFromBudget = importFromBudget;
window.filterRoomItems = filterRoomItems;
window.openEventModal = openEventModal;
window.closeEventModal = closeEventModal;
window.openAddEventForm = openAddEventForm;
window.closeAddEventModal = closeAddEventModal;
window.clearEventForm = clearEventForm;
window.previousMonth = previousMonth;
window.nextMonth = nextMonth;
window.openAdvancedForm = openAdvancedForm;