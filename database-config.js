// Configuração do Firebase para banco de dados online
// Para usar este sistema, você precisa:
// 1. Criar uma conta no Firebase (https://firebase.google.com/)
// 2. Criar um novo projeto
// 3. Ativar o Firestore Database
// 4. Substituir as configurações abaixo pelas suas

// Configuração do Firebase (substitua pelos seus dados)
const firebaseConfig = {
    apiKey: "SUA_API_KEY_AQUI",
    authDomain: "seu-projeto.firebaseapp.com",
    projectId: "seu-projeto-id",
    storageBucket: "seu-projeto.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456"
};

// Classe para gerenciar o banco de dados online
class DatabaseManager {
    constructor() {
        this.db = null;
        this.isOnline = false;
        this.initializeFirebase();
    }

    // Inicializar Firebase
    async initializeFirebase() {
        try {
            // Importar Firebase (versão 9+)
            const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
            const { getFirestore, connectFirestoreEmulator } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
            
            // Inicializar Firebase
            const app = initializeApp(firebaseConfig);
            this.db = getFirestore(app);
            this.isOnline = true;
            
            console.log('✅ Banco de dados online conectado com sucesso!');
            this.showConnectionStatus(true);
        } catch (error) {
            console.error('❌ Erro ao conectar com o banco de dados:', error);
            this.isOnline = false;
            this.showConnectionStatus(false);
            // Fallback para localStorage se não conseguir conectar
            this.fallbackToLocalStorage();
        }
    }

    // Mostrar status da conexão
    showConnectionStatus(connected) {
        const statusElement = document.getElementById('db-status');
        if (statusElement) {
            statusElement.innerHTML = connected 
                ? '🟢 Online - Dados salvos na nuvem'
                : '🔴 Offline - Dados salvos localmente';
            statusElement.className = connected ? 'status-online' : 'status-offline';
        }
    }

    // Fallback para localStorage quando offline
    fallbackToLocalStorage() {
        console.log('📱 Usando armazenamento local como backup');
    }

    // Salvar dados no banco online
    async saveData(collection, documentId, data) {
        if (!this.isOnline) {
            return this.saveToLocalStorage(collection, documentId, data);
        }

        try {
            const { doc, setDoc, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
            
            const docRef = doc(this.db, collection, documentId);
            const dataWithTimestamp = {
                ...data,
                lastUpdated: serverTimestamp(),
                updatedBy: 'apartamento-camilly'
            };
            
            await setDoc(docRef, dataWithTimestamp, { merge: true });
            console.log(`✅ Dados salvos online: ${collection}/${documentId}`);
            return { success: true, online: true };
        } catch (error) {
            console.error('❌ Erro ao salvar online:', error);
            // Fallback para localStorage
            return this.saveToLocalStorage(collection, documentId, data);
        }
    }

    // Recuperar dados do banco online
    async getData(collection, documentId) {
        if (!this.isOnline) {
            return this.getFromLocalStorage(collection, documentId);
        }

        try {
            const { doc, getDoc } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
            
            const docRef = doc(this.db, collection, documentId);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                console.log(`✅ Dados recuperados online: ${collection}/${documentId}`);
                return { data: docSnap.data(), success: true, online: true };
            } else {
                console.log(`ℹ️ Documento não encontrado: ${collection}/${documentId}`);
                return { data: null, success: false, online: true };
            }
        } catch (error) {
            console.error('❌ Erro ao recuperar dados online:', error);
            // Fallback para localStorage
            return this.getFromLocalStorage(collection, documentId);
        }
    }

    // Salvar no localStorage como backup
    saveToLocalStorage(collection, documentId, data) {
        try {
            const key = `${collection}_${documentId}`;
            const dataWithTimestamp = {
                ...data,
                lastUpdated: new Date().toISOString(),
                updatedBy: 'apartamento-camilly'
            };
            localStorage.setItem(key, JSON.stringify(dataWithTimestamp));
            console.log(`💾 Dados salvos localmente: ${key}`);
            return { success: true, online: false };
        } catch (error) {
            console.error('❌ Erro ao salvar localmente:', error);
            return { success: false, online: false };
        }
    }

    // Recuperar do localStorage
    getFromLocalStorage(collection, documentId) {
        try {
            const key = `${collection}_${documentId}`;
            const data = localStorage.getItem(key);
            if (data) {
                console.log(`💾 Dados recuperados localmente: ${key}`);
                return { data: JSON.parse(data), success: true, online: false };
            } else {
                return { data: null, success: false, online: false };
            }
        } catch (error) {
            console.error('❌ Erro ao recuperar dados localmente:', error);
            return { data: null, success: false, online: false };
        }
    }

    // Sincronizar dados locais com o banco online
    async syncLocalToOnline() {
        if (!this.isOnline) {
            console.log('❌ Não é possível sincronizar - sem conexão online');
            return;
        }

        console.log('🔄 Iniciando sincronização...');
        const collections = ['orcamentos', 'planejamentos', 'fotos', 'eventos', 'configuracoes'];
        
        for (const collection of collections) {
            // Buscar dados locais desta coleção
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(`${collection}_`)) {
                    const documentId = key.replace(`${collection}_`, '');
                    const localData = JSON.parse(localStorage.getItem(key));
                    
                    // Enviar para o banco online
                    await this.saveData(collection, documentId, localData);
                }
            }
        }
        console.log('✅ Sincronização concluída!');
    }

    // Verificar status da conexão
    getConnectionStatus() {
        return {
            online: this.isOnline,
            timestamp: new Date().toISOString()
        };
    }
}

// Instância global do gerenciador de banco de dados
const dbManager = new DatabaseManager();

// Exportar para uso em outras páginas
window.dbManager = dbManager;

// Adicionar indicador de status na página
document.addEventListener('DOMContentLoaded', function() {
    // Criar elemento de status se não existir
    if (!document.getElementById('db-status')) {
        const statusDiv = document.createElement('div');
        statusDiv.id = 'db-status';
        statusDiv.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            padding: 8px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
            z-index: 1000;
            transition: all 0.3s ease;
        `;
        document.body.appendChild(statusDiv);
    }
});

// CSS para os indicadores de status
const statusStyles = document.createElement('style');
statusStyles.textContent = `
    .status-online {
        background-color: #d4edda;
        color: #155724;
        border: 1px solid #c3e6cb;
    }
    
    .status-offline {
        background-color: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
    }
`;
document.head.appendChild(statusStyles);