// API para gerenciar dados do apartamento
// Este arquivo fornece funções específicas para cada tipo de dados

class ApartmentAPI {
    constructor() {
        this.dbManager = window.dbManager;
        this.apartmentId = 'camilly-apartment'; // ID único do apartamento
    }

    // ==================== ORÇAMENTOS ====================
    
    // Salvar orçamento
    async saveOrcamento(orcamentoData) {
        const orcamentoId = orcamentoData.id || `orcamento_${Date.now()}`;
        const data = {
            ...orcamentoData,
            id: orcamentoId,
            apartmentId: this.apartmentId,
            type: 'orcamento'
        };
        
        return await this.dbManager.saveData('orcamentos', orcamentoId, data);
    }

    // Recuperar orçamento
    async getOrcamento(orcamentoId) {
        return await this.dbManager.getData('orcamentos', orcamentoId);
    }

    // Recuperar todos os orçamentos
    async getAllOrcamentos() {
        try {
            // Se estiver online, buscar do Firestore
            if (this.dbManager.isOnline) {
                const { collection, query, where, getDocs } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
                const q = query(
                    collection(this.dbManager.db, 'orcamentos'),
                    where('apartmentId', '==', this.apartmentId)
                );
                const querySnapshot = await getDocs(q);
                const orcamentos = [];
                querySnapshot.forEach((doc) => {
                    orcamentos.push({ id: doc.id, ...doc.data() });
                });
                return { data: orcamentos, success: true, online: true };
            } else {
                // Buscar do localStorage
                const orcamentos = [];
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key && key.startsWith('orcamentos_')) {
                        const data = JSON.parse(localStorage.getItem(key));
                        if (data.apartmentId === this.apartmentId) {
                            orcamentos.push(data);
                        }
                    }
                }
                return { data: orcamentos, success: true, online: false };
            }
        } catch (error) {
            console.error('Erro ao buscar orçamentos:', error);
            return { data: [], success: false };
        }
    }

    // ==================== PLANEJAMENTOS ====================
    
    // Salvar planejamento
    async savePlanejamento(planejamentoData) {
        const planejamentoId = planejamentoData.id || `planejamento_${Date.now()}`;
        const data = {
            ...planejamentoData,
            id: planejamentoId,
            apartmentId: this.apartmentId,
            type: 'planejamento'
        };
        
        return await this.dbManager.saveData('planejamentos', planejamentoId, data);
    }

    // Recuperar planejamento
    async getPlanejamento(planejamentoId) {
        return await this.dbManager.getData('planejamentos', planejamentoId);
    }

    // Recuperar todos os planejamentos
    async getAllPlanejamentos() {
        try {
            if (this.dbManager.isOnline) {
                const { collection, query, where, getDocs } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
                const q = query(
                    collection(this.dbManager.db, 'planejamentos'),
                    where('apartmentId', '==', this.apartmentId)
                );
                const querySnapshot = await getDocs(q);
                const planejamentos = [];
                querySnapshot.forEach((doc) => {
                    planejamentos.push({ id: doc.id, ...doc.data() });
                });
                return { data: planejamentos, success: true, online: true };
            } else {
                const planejamentos = [];
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key && key.startsWith('planejamentos_')) {
                        const data = JSON.parse(localStorage.getItem(key));
                        if (data.apartmentId === this.apartmentId) {
                            planejamentos.push(data);
                        }
                    }
                }
                return { data: planejamentos, success: true, online: false };
            }
        } catch (error) {
            console.error('Erro ao buscar planejamentos:', error);
            return { data: [], success: false };
        }
    }

    // ==================== FOTOS ====================
    
    // Salvar foto
    async saveFoto(fotoData) {
        const fotoId = fotoData.id || `foto_${Date.now()}`;
        const data = {
            ...fotoData,
            id: fotoId,
            apartmentId: this.apartmentId,
            type: 'foto'
        };
        
        return await this.dbManager.saveData('fotos', fotoId, data);
    }

    // Recuperar foto
    async getFoto(fotoId) {
        return await this.dbManager.getData('fotos', fotoId);
    }

    // Recuperar todas as fotos
    async getAllFotos() {
        try {
            if (this.dbManager.isOnline) {
                const { collection, query, where, getDocs } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
                const q = query(
                    collection(this.dbManager.db, 'fotos'),
                    where('apartmentId', '==', this.apartmentId)
                );
                const querySnapshot = await getDocs(q);
                const fotos = [];
                querySnapshot.forEach((doc) => {
                    fotos.push({ id: doc.id, ...doc.data() });
                });
                return { data: fotos, success: true, online: true };
            } else {
                const fotos = [];
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key && key.startsWith('fotos_')) {
                        const data = JSON.parse(localStorage.getItem(key));
                        if (data.apartmentId === this.apartmentId) {
                            fotos.push(data);
                        }
                    }
                }
                return { data: fotos, success: true, online: false };
            }
        } catch (error) {
            console.error('Erro ao buscar fotos:', error);
            return { data: [], success: false };
        }
    }

    // Deletar foto
    async deleteFoto(fotoId) {
        try {
            if (this.dbManager.isOnline) {
                const { doc, deleteDoc } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
                await deleteDoc(doc(this.dbManager.db, 'fotos', fotoId));
                console.log(`✅ Foto deletada online: ${fotoId}`);
            }
            
            // Também remover do localStorage
            localStorage.removeItem(`fotos_${fotoId}`);
            console.log(`💾 Foto removida localmente: ${fotoId}`);
            
            return { success: true };
        } catch (error) {
            console.error('Erro ao deletar foto:', error);
            return { success: false, error: error.message };
        }
    }

    // ==================== EVENTOS ====================
    
    // Salvar evento
    async saveEvento(eventoData) {
        const eventoId = eventoData.id || `evento_${Date.now()}`;
        const data = {
            ...eventoData,
            id: eventoId,
            apartmentId: this.apartmentId,
            type: 'evento'
        };
        
        return await this.dbManager.saveData('eventos', eventoId, data);
    }

    // Recuperar evento
    async getEvento(eventoId) {
        return await this.dbManager.getData('eventos', eventoId);
    }

    // Recuperar todos os eventos
    async getAllEventos() {
        try {
            if (this.dbManager.isOnline) {
                const { collection, query, where, getDocs, orderBy } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
                const q = query(
                    collection(this.dbManager.db, 'eventos'),
                    where('apartmentId', '==', this.apartmentId),
                    orderBy('date', 'asc')
                );
                const querySnapshot = await getDocs(q);
                const eventos = [];
                querySnapshot.forEach((doc) => {
                    eventos.push({ id: doc.id, ...doc.data() });
                });
                return { data: eventos, success: true, online: true };
            } else {
                const eventos = [];
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key && key.startsWith('eventos_')) {
                        const data = JSON.parse(localStorage.getItem(key));
                        if (data.apartmentId === this.apartmentId) {
                            eventos.push(data);
                        }
                    }
                }
                // Ordenar por data
                eventos.sort((a, b) => new Date(a.date) - new Date(b.date));
                return { data: eventos, success: true, online: false };
            }
        } catch (error) {
            console.error('Erro ao buscar eventos:', error);
            return { data: [], success: false };
        }
    }

    // ==================== CONFIGURAÇÕES ====================
    
    // Salvar configurações
    async saveConfiguracoes(configData) {
        const data = {
            ...configData,
            apartmentId: this.apartmentId,
            type: 'configuracao'
        };
        
        return await this.dbManager.saveData('configuracoes', this.apartmentId, data);
    }

    // Recuperar configurações
    async getConfiguracoes() {
        return await this.dbManager.getData('configuracoes', this.apartmentId);
    }

    // ==================== UTILITÁRIOS ====================
    
    // Sincronizar todos os dados
    async syncAllData() {
        return await this.dbManager.syncLocalToOnline();
    }

    // Verificar status da conexão
    getConnectionStatus() {
        return this.dbManager.getConnectionStatus();
    }

    // Exportar todos os dados (backup)
    async exportAllData() {
        try {
            const allData = {
                apartmentId: this.apartmentId,
                exportDate: new Date().toISOString(),
                orcamentos: (await this.getAllOrcamentos()).data || [],
                planejamentos: (await this.getAllPlanejamentos()).data || [],
                fotos: (await this.getAllFotos()).data || [],
                eventos: (await this.getAllEventos()).data || [],
                configuracoes: (await this.getConfiguracoes()).data || {}
            };
            
            return {
                success: true,
                data: allData,
                json: JSON.stringify(allData, null, 2)
            };
        } catch (error) {
            console.error('Erro ao exportar dados:', error);
            return { success: false, error: error.message };
        }
    }

    // Importar dados (restaurar backup)
    async importData(jsonData) {
        try {
            const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
            
            // Importar cada tipo de dados
            if (data.orcamentos) {
                for (const orcamento of data.orcamentos) {
                    await this.saveOrcamento(orcamento);
                }
            }
            
            if (data.planejamentos) {
                for (const planejamento of data.planejamentos) {
                    await this.savePlanejamento(planejamento);
                }
            }
            
            if (data.fotos) {
                for (const foto of data.fotos) {
                    await this.saveFoto(foto);
                }
            }
            
            if (data.eventos) {
                for (const evento of data.eventos) {
                    await this.saveEvento(evento);
                }
            }
            
            if (data.configuracoes) {
                await this.saveConfiguracoes(data.configuracoes);
            }
            
            return { success: true, message: 'Dados importados com sucesso!' };
        } catch (error) {
            console.error('Erro ao importar dados:', error);
            return { success: false, error: error.message };
        }
    }
}

// Instância global da API
const apartmentAPI = new ApartmentAPI();

// Exportar para uso em outras páginas
window.apartmentAPI = apartmentAPI;

// Função de conveniência para mostrar notificações
function showDatabaseNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 60px;
        right: 10px;
        padding: 12px 16px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        z-index: 1001;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideInRight 0.3s ease;
    `;
    
    // Definir cores baseadas no tipo
    switch (type) {
        case 'success':
            notification.style.backgroundColor = '#d4edda';
            notification.style.color = '#155724';
            notification.style.border = '1px solid #c3e6cb';
            break;
        case 'error':
            notification.style.backgroundColor = '#f8d7da';
            notification.style.color = '#721c24';
            notification.style.border = '1px solid #f5c6cb';
            break;
        case 'warning':
            notification.style.backgroundColor = '#fff3cd';
            notification.style.color = '#856404';
            notification.style.border = '1px solid #ffeaa7';
            break;
        default:
            notification.style.backgroundColor = '#d1ecf1';
            notification.style.color = '#0c5460';
            notification.style.border = '1px solid #bee5eb';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Remover após 4 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Adicionar animações CSS
const animationStyles = document.createElement('style');
animationStyles.textContent = `
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
document.head.appendChild(animationStyles);

// Exportar função de notificação
window.showDatabaseNotification = showDatabaseNotification;