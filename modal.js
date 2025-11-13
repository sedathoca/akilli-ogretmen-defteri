// utils/modal.js
class ModalManager {
    constructor() {
        this.modalContainer = null;
        this.init();
    }

    init() {
        // Modal container oluştur
        this.modalContainer = document.createElement('div');
        this.modalContainer.id = 'modal-container';
        this.modalContainer.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden';
        this.modalContainer.innerHTML = `
            <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-90vh overflow-hidden">
                <div class="flex justify-between items-center p-4 border-b">
                    <h3 class="text-lg font-semibold" id="modal-title">Başlık</h3>
                    <button onclick="modalManager.hideModal()" class="text-gray-500 hover:text-gray-700 text-xl">&times;</button>
                </div>
                <div class="p-4 overflow-y-auto max-h-96" id="modal-content">
                    İçerik
                </div>
                <div class="flex justify-end gap-2 p-4 border-t bg-gray-50">
                    <button onclick="modalManager.hideModal()" class="px-4 py-2 text-gray-600 hover:text-gray-800">Kapat</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.modalContainer);
    }

    showModal(title, content) {
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-content').innerHTML = content;
        this.modalContainer.classList.remove('hidden');
    }

    hideModal() {
        this.modalContainer.classList.add('hidden');
    }
}

// Global instance
window.modalManager = new ModalManager();