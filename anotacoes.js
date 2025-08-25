// Anotações JavaScript
class NotesManager {
    constructor() {
        this.notes = JSON.parse(localStorage.getItem('apartmentNotes')) || [];
        this.currentCategory = 'all';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderNotes();
        this.setupSharedDataIndicators();
    }

    setupEventListeners() {
        // Add note button
        document.getElementById('addNoteBtn').addEventListener('click', () => {
            this.openAddNoteModal();
        });

        // Category buttons
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchCategory(e.target.dataset.category);
            });
        });

        // Modal close buttons
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

        // Add note form
        document.getElementById('addNoteForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addNote();
        });

        // Edit note form
        document.getElementById('editNoteForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateNote();
        });

        // Edit from view button
        document.getElementById('editFromViewBtn').addEventListener('click', () => {
            const noteId = document.getElementById('editFromViewBtn').dataset.noteId;
            this.closeModal(document.getElementById('viewNoteModal'));
            this.openEditNoteModal(noteId);
        });
    }

    switchCategory(category) {
        // Update active category button
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`).classList.add('active');

        this.currentCategory = category;
        this.renderNotes();
    }

    openAddNoteModal() {
        // Clear form
        document.getElementById('addNoteForm').reset();
        document.getElementById('addNoteModal').style.display = 'block';
    }

    openEditNoteModal(noteId) {
        const note = this.notes.find(n => n.id === noteId);
        if (!note) return;

        // Populate form
        document.getElementById('editNoteId').value = note.id;
        document.getElementById('editNoteTitle').value = note.title;
        document.getElementById('editNoteCategory').value = note.category;
        document.getElementById('editNoteContent').value = note.content;
        document.getElementById('editNotePriority').value = note.priority;
        document.getElementById('editNoteTags').value = note.tags.join(', ');

        document.getElementById('editNoteModal').style.display = 'block';
    }

    openViewNoteModal(noteId) {
        const note = this.notes.find(n => n.id === noteId);
        if (!note) return;

        const modal = document.getElementById('viewNoteModal');
        const titleElement = document.getElementById('viewNoteTitle');
        const bodyElement = document.getElementById('viewNoteBody');
        const editBtn = document.getElementById('editFromViewBtn');

        titleElement.textContent = `📖 ${note.title}`;
        editBtn.dataset.noteId = note.id;

        bodyElement.innerHTML = `
            <div class="note-info">
                <p><strong>Categoria:</strong> ${this.getCategoryName(note.category)}</p>
                <p><strong>Prioridade:</strong> <span class="note-priority ${note.priority}">${note.priority.toUpperCase()}</span></p>
                <p><strong>Criado em:</strong> ${this.formatDate(note.createdAt)}</p>
                ${note.updatedAt ? `<p><strong>Atualizado em:</strong> ${this.formatDate(note.updatedAt)}</p>` : ''}
                ${note.tags.length > 0 ? `
                    <p><strong>Tags:</strong> 
                        ${note.tags.map(tag => `<span class="note-tag">${tag}</span>`).join(' ')}
                    </p>
                ` : ''}
            </div>
            <div class="note-content-full">${note.content}</div>
        `;

        modal.style.display = 'block';
    }

    closeModal(modal) {
        modal.style.display = 'none';
    }

    addNote() {
        const form = document.getElementById('addNoteForm');
        const formData = new FormData(form);
        
        const tags = formData.get('noteTags')
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0);

        const note = {
            id: Date.now().toString(),
            title: formData.get('noteTitle'),
            content: formData.get('noteContent'),
            category: formData.get('noteCategory'),
            priority: formData.get('notePriority'),
            tags: tags,
            createdAt: new Date().toISOString(),
            updatedAt: null
        };

        this.notes.unshift(note); // Add to beginning
        this.saveNotes();
        this.renderNotes();
        this.closeModal(document.getElementById('addNoteModal'));
        
        this.showNotification('Anotação criada com sucesso!', 'success');
    }

    updateNote() {
        const noteId = document.getElementById('editNoteId').value;
        const form = document.getElementById('editNoteForm');
        const formData = new FormData(form);
        
        const tags = formData.get('noteTags')
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0);

        const noteIndex = this.notes.findIndex(n => n.id === noteId);
        if (noteIndex === -1) return;

        this.notes[noteIndex] = {
            ...this.notes[noteIndex],
            title: formData.get('noteTitle'),
            content: formData.get('noteContent'),
            category: formData.get('noteCategory'),
            priority: formData.get('notePriority'),
            tags: tags,
            updatedAt: new Date().toISOString()
        };

        this.saveNotes();
        this.renderNotes();
        this.closeModal(document.getElementById('editNoteModal'));
        
        this.showNotification('Anotação atualizada com sucesso!', 'success');
    }

    deleteNote(noteId) {
        if (confirm('Tem certeza que deseja excluir esta anotação?')) {
            this.notes = this.notes.filter(n => n.id !== noteId);
            this.saveNotes();
            this.renderNotes();
            this.showNotification('Anotação excluída com sucesso!', 'success');
        }
    }

    getCategoryName(category) {
        const categories = {
            'planejamento': 'Planejamento',
            'compras': 'Compras',
            'decoracao': 'Decoração',
            'mudanca': 'Mudança',
            'outros': 'Outros'
        };
        return categories[category] || category;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    renderNotes() {
        const container = document.getElementById('notesGrid');
        const emptyState = document.getElementById('emptyNotes');
        
        let filteredNotes = this.notes;
        if (this.currentCategory !== 'all') {
            filteredNotes = this.notes.filter(note => note.category === this.currentCategory);
        }

        if (filteredNotes.length === 0) {
            container.style.display = 'none';
            emptyState.style.display = 'block';
            return;
        }

        container.style.display = 'grid';
        emptyState.style.display = 'none';

        container.innerHTML = filteredNotes.map(note => this.renderNoteCard(note)).join('');
    }

    renderNoteCard(note) {
        const truncatedContent = note.content.length > 150 
            ? note.content.substring(0, 150) + '...' 
            : note.content;

        return `
            <div class="note-card" onclick="notesManager.openViewNoteModal('${note.id}')">
                <div class="note-header">
                    <h3 class="note-title">${note.title}</h3>
                    <span class="note-priority ${note.priority}">${note.priority}</span>
                </div>
                
                <div class="note-category">${this.getCategoryName(note.category)}</div>
                
                <div class="note-content">${truncatedContent}</div>
                
                ${note.tags.length > 0 ? `
                    <div class="note-tags">
                        ${note.tags.slice(0, 3).map(tag => `<span class="note-tag">${tag}</span>`).join('')}
                        ${note.tags.length > 3 ? `<span class="note-tag">+${note.tags.length - 3}</span>` : ''}
                    </div>
                ` : ''}
                
                <div class="note-footer">
                    <span class="note-date">${this.formatDate(note.createdAt)}</span>
                    <div class="note-actions">
                        <button class="btn-icon edit" onclick="event.stopPropagation(); notesManager.openEditNoteModal('${note.id}')" title="Editar">
                            ✏️
                        </button>
                        <button class="btn-icon delete" onclick="event.stopPropagation(); notesManager.deleteNote('${note.id}')" title="Excluir">
                            🗑️
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    saveNotes() {
        localStorage.setItem('apartmentNotes', JSON.stringify(this.notes));
        this.handleDataImportExport('export', 'apartmentNotes');
    }

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
        }, 3000);
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
        
        if (sharedBudgetData || sharedApartmentData) {
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
        syncStatus.title = 'Anotações sincronizadas';
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

    // Export notes
    exportNotes() {
        const data = {
            notes: this.notes,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `anotacoes-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showNotification('Anotações exportadas com sucesso!', 'success');
    }

    // Import notes
    importNotes(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (data.notes && Array.isArray(data.notes)) {
                    this.notes = data.notes;
                    this.saveNotes();
                    this.renderNotes();
                    this.showNotification('Anotações importadas com sucesso!', 'success');
                } else {
                    throw new Error('Formato de arquivo inválido');
                }
            } catch (error) {
                this.showNotification('Erro ao importar arquivo: ' + error.message, 'error');
            }
        };
        reader.readAsText(file);
    }

    // Search notes
    searchNotes(query) {
        const searchTerm = query.toLowerCase();
        const filteredNotes = this.notes.filter(note => 
            note.title.toLowerCase().includes(searchTerm) ||
            note.content.toLowerCase().includes(searchTerm) ||
            note.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
        
        const container = document.getElementById('notesGrid');
        const emptyState = document.getElementById('emptyNotes');
        
        if (filteredNotes.length === 0) {
            container.style.display = 'none';
            emptyState.style.display = 'block';
            emptyState.innerHTML = `
                <div class="empty-icon">🔍</div>
                <h3>Nenhuma anotação encontrada</h3>
                <p>Tente usar outros termos de busca</p>
                <button class="btn btn-secondary" onclick="notesManager.clearSearch()">Limpar Busca</button>
            `;
            return;
        }
        
        container.style.display = 'grid';
        emptyState.style.display = 'none';
        container.innerHTML = filteredNotes.map(note => this.renderNoteCard(note)).join('');
    }

    clearSearch() {
        this.renderNotes();
    }

    // Get notes statistics
    getNotesStats() {
        const stats = {
            total: this.notes.length,
            byCategory: {},
            byPriority: {
                alta: 0,
                media: 0,
                baixa: 0
            }
        };

        this.notes.forEach(note => {
            // Count by category
            stats.byCategory[note.category] = (stats.byCategory[note.category] || 0) + 1;
            
            // Count by priority
            stats.byPriority[note.priority]++;
        });

        return stats;
    }
}

// Navigation functions
function navigateToPage(page) {
    if (window.CamillyNavigation) {
        window.CamillyNavigation.saveNavigationState();
        // Share notes data with other pages
        const notesData = {
            notes: notesManager.notes,
            totalNotes: notesManager.notes.length,
            lastUpdate: new Date().toISOString(),
            source: 'anotacoes'
        };
        window.CamillyNavigation.shareDataBetweenPages('notesData', notesData);
    }
    if (typeof handlePageNavigation === 'function') {
        handlePageNavigation(page);
    } else {
        window.location.href = page;
    }
}

function goBack() {
    if (typeof handlePageNavigation === 'function') {
        handlePageNavigation('index.html');
    } else {
        window.history.back();
    }
}

// Initialize notes manager
let notesManager;

document.addEventListener('DOMContentLoaded', () => {
    notesManager = new NotesManager();
    
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