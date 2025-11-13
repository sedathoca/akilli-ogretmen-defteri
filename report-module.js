// Rapor modülü - GÜNCELLENMİŞ
class ReportModule {
    constructor() {
        this.buttonText = '📈 Raporlar';
    }

    render() {
        return `
            <div class="report-module">
                <div class="mb-6 flex justify-between items-center">
                    <h2 class="text-2xl font-bold text-gray-800">Rapor Sistemi</h2>
                    <button onclick="moduleManager.showWelcomeScreen()" class="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200">← Ana Sayfaya Dön</button>
                </div>
                
                <div class="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                    <div class="text-4xl mb-4">📈</div>
                    <h3 class="text-xl font-semibold text-green-800 mb-2">Rapor Sistemi</h3>
                    <p class="text-green-600 mb-4">Detaylı raporlar ve istatistikler</p>
                    <p class="text-green-500 text-sm">🚧 Bu modül yakında eklenecek</p>
                </div>
            </div>
        `;
    }

    onShow() {
        console.log('Rapor modülü açıldı');
    }
}

window.reportModule = new ReportModule();
// ... (tüm mevcut kod aynı kalacak) ...

// SON SATIRI DEĞİŞTİR:
window.safeRegisterModule('report', window.reportModule);