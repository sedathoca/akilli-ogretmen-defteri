// Bildirim yöneticisi
class NotificationManager {
    show(message, type = 'info') {
        // Bildirim konteynırını oluştur
        let container = document.getElementById('notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            container.className = 'fixed top-4 right-4 z-50 space-y-2';
            document.body.appendChild(container);
        }

        const notification = document.createElement('div');
        const bgColor = type === 'success' ? 'bg-green-500' : 
                       type === 'error' ? 'bg-red-500' : 
                       type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500';
        
        notification.className = `${bgColor} text-white p-4 rounded-lg shadow-lg transform transition-all duration-300 translate-x-full`;
        notification.innerHTML = `
            <div class="flex justify-between items-center">
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-4 hover:text-gray-200">✕</button>
            </div>
        `;
        
        container.appendChild(notification);
        
        // Animasyon için
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);

        // Otomatik kapanma
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.opacity = '0';
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (notification.parentElement) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 5000);
    }

    showError(message) {
        this.show(message, 'error');
    }

    showSuccess(message) {
        this.show(message, 'success');
    }
}

window.notificationManager = new NotificationManager();