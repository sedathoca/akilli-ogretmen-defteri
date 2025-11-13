// modules/rehberlik-module.js - GÜNCELLENMİŞ
// Çift tanımlama önleme
if (typeof window.RehberlikModule === 'undefined') {

class RehberlikModule {
    constructor() {
        this.buttonText = '🎯 Rehberlik';
        this.currentSubModule = 'dashboard';
        this.selectedStudent = null;
    }

    render() {
        return `
            <div class="rehberlik-module bg-white rounded-lg shadow-sm">
                <!-- ÜST NAVİGASYON -->
                <div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-lg">
                    <div class="flex justify-between items-center mb-4">
                        <div>
                            <h2 class="text-3xl font-bold">🎯 Rehberlik ve Psikolojik Danışmanlık</h2>
                            <p class="text-blue-100">Profesyonel Öğrenci Takip Sistemi</p>
                        </div>
                        <button onclick="moduleManager.showWelcomeScreen()" 
                                class="bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-medium py-2 px-4 rounded-lg transition duration-200">
                            ← Ana Sayfa
                        </button>
                    </div>
                    
                    <!-- ALT MENÜ -->
                    <div class="flex flex-wrap gap-2">
                        <button onclick="rehberlikModule.switchSubModule('dashboard')" 
                                class="px-4 py-2 rounded-lg transition duration-200 ${this.currentSubModule === 'dashboard' ? 'bg-white text-blue-600' : 'bg-blue-500 text-white hover:bg-blue-400'}">
                            📊 Dashboard
                        </button>
                        <button onclick="rehberlikModule.switchSubModule('ogrenci-takip')" 
                                class="px-4 py-2 rounded-lg transition duration-200 ${this.currentSubModule === 'ogrenci-takip' ? 'bg-white text-blue-600' : 'bg-blue-500 text-white hover:bg-blue-400'}">
                            👥 Öğrenci Takip
                        </button>
                        <button onclick="rehberlikModule.switchSubModule('gorusmeler')" 
                                class="px-4 py-2 rounded-lg transition duration-200 ${this.currentSubModule === 'gorusmeler' ? 'bg-white text-blue-600' : 'bg-blue-500 text-white hover:bg-blue-400'}">
                            💬 Görüşmeler
                        </button>
                        <button onclick="rehberlikModule.switchSubModule('gozlemler')" 
                                class="px-4 py-2 rounded-lg transition duration-200 ${this.currentSubModule === 'gozlemler' ? 'bg-white text-blue-600' : 'bg-blue-500 text-white hover:bg-blue-400'}">
                            👁️ Gözlemler
                        </button>
                        <button onclick="rehberlikModule.switchSubModule('testler')" 
                                class="px-4 py-2 rounded-lg transition duration-200 ${this.currentSubModule === 'testler' ? 'bg-white text-blue-600' : 'bg-blue-500 text-white hover:bg-blue-400'}">
                            📝 Testler
                        </button>
                        <button onclick="rehberlikModule.switchSubModule('raporlar')" 
                                class="px-4 py-2 rounded-lg transition duration-200 ${this.currentSubModule === 'raporlar' ? 'bg-white text-blue-600' : 'bg-blue-500 text-white hover:bg-blue-400'}">
                            📈 Raporlar
                        </button>
                    </div>
                </div>

                <!-- İÇERİK ALANI -->
                <div class="p-6">
                    ${this.renderSubModule()}
                </div>
            </div>
        `;
    }

    renderSubModule() {
        switch(this.currentSubModule) {
            case 'dashboard':
                return this.renderDashboard();
            case 'ogrenci-takip':
                return this.renderOgrenciTakip();
            case 'gorusmeler':
                return this.renderGorusmeler();
            case 'gozlemler':
                return this.renderGozlemler();
            case 'testler':
                return this.renderTestler();
            case 'raporlar':
                return this.renderRaporlar();
            default:
                return this.renderDashboard();
        }
    }

    // 📊 DASHBOARD - BASİT VERSİYON
    renderDashboard() {
        return `
            <div class="rehberlik-dashboard">
                <div class="text-center py-12">
                    <div class="text-6xl mb-4">🎯</div>
                    <h3 class="text-2xl font-bold text-gray-800 mb-4">Rehberlik Modülüne Hoş Geldiniz</h3>
                    <p class="text-gray-600 mb-6">Profesyonel öğrenci takip sistemi hazırlanıyor...</p>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                        <button onclick="rehberlikModule.switchSubModule('ogrenci-takip')" 
                                class="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg transition duration-200">
                            👥 Öğrenci Takip
                        </button>
                        <button onclick="rehberlikModule.switchSubModule('gorusmeler')" 
                                class="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg transition duration-200">
                            💬 Görüşmeler
                        </button>
                        <button onclick="rehberlikModule.switchSubModule('raporlar')" 
                                class="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg transition duration-200">
                            📈 Raporlar
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // 👥 ÖĞRENCİ TAKİP - BASİT VERSİYON
    renderOgrenciTakip() {
        const db = window.storageManager.getData();
        const students = db.rehberlikOgrenciler || [];
        
        return `
            <div class="ogrenci-takip">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-2xl font-bold text-gray-800">👥 Öğrenci Takip Sistemi</h3>
                    <button onclick="rehberlikModule.showStudentForm()" 
                            class="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200">
                        ➕ Yeni Öğrenci
                    </button>
                </div>

                ${students.length > 0 ? 
                    this.renderStudentList(students) :
                    this.renderEmptyStudentState()
                }
            </div>
        `;
    }

    renderStudentList(students) {
        return `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                ${students.map(student => `
                    <div class="bg-white border border-gray-200 rounded-lg p-4">
                        <h4 class="font-bold text-lg">${student.adi || student.name}</h4>
                        <p class="text-gray-600">${student.sinif || student.className}</p>
                        <p class="text-sm text-gray-500 mt-2">${student.not || student.note || 'Açıklama yok'}</p>
                        <div class="flex gap-2 mt-3">
                            <button onclick="rehberlikModule.showStudentDetail('${student.id}')" 
                                    class="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded">
                                Detay
                            </button>
                            <button onclick="rehberlikModule.addMeetingForStudent('${student.id}')" 
                                    class="bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-1 rounded">
                                Görüşme
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderEmptyStudentState() {
        return `
            <div class="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <div class="text-5xl mb-4">👥</div>
                <h3 class="text-xl font-semibold text-gray-700 mb-2">Henüz öğrenci kaydı yok</h3>
                <p class="text-gray-500 mb-4">Rehberlik takibine başlamak için ilk öğrenciyi ekleyin</p>
                <button onclick="rehberlikModule.showStudentForm()" 
                        class="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200">
                    ➕ İlk Öğrenciyi Ekle
                </button>
            </div>
        `;
    }

    // 💬 GÖRÜŞMELER - BASİT VERSİYON
    renderGorusmeler() {
        const db = window.storageManager.getData();
        const meetings = db.rehberlikGorusmeleri || [];
        
        return `
            <div class="gorusmeler-module">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-2xl font-bold text-gray-800">💬 Rehberlik Görüşmeleri</h3>
                    <button onclick="rehberlikModule.showMeetingForm()" 
                            class="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200">
                        ➕ Yeni Görüşme
                    </button>
                </div>

                ${meetings.length > 0 ? 
                    this.renderMeetingList(meetings) :
                    this.renderEmptyMeetingsState()
                }
            </div>
        `;
    }

    renderMeetingList(meetings) {
        return `
            <div class="space-y-4">
                ${meetings.slice().reverse().map(meeting => `
                    <div class="bg-white border border-gray-200 rounded-lg p-4">
                        <h4 class="font-semibold text-lg">${meeting.baslik || meeting.title}</h4>
                        <p class="text-gray-600">${meeting.ozet || meeting.summary}</p>
                        <p class="text-sm text-gray-500 mt-2">
                            ${new Date(meeting.tarih || meeting.date).toLocaleDateString('tr-TR')}
                        </p>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderEmptyMeetingsState() {
        return `
            <div class="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <div class="text-5xl mb-4">💬</div>
                <h3 class="text-xl font-semibold text-gray-700 mb-2">Henüz görüşme kaydı yok</h3>
                <p class="text-gray-500 mb-4">Öğrenci görüşmelerinizi kaydetmeye başlayın</p>
                <button onclick="rehberlikModule.showMeetingForm()" 
                        class="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200">
                    ➕ İlk Görüşmeyi Ekle
                </button>
            </div>
        `;
    }

    // 📈 RAPORLAR - BASİT VERSİYON
    renderRaporlar() {
        return `
            <div class="raporlar-module">
                <h3 class="text-2xl font-bold text-gray-800 mb-6">📈 Rehberlik Raporları</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="bg-white border border-gray-200 rounded-lg p-6 text-center">
                        <div class="text-4xl mb-4">📊</div>
                        <h4 class="font-semibold text-gray-800 mb-2">Aylık Faaliyet Raporu</h4>
                        <p class="text-gray-600 text-sm mb-4">Aylık görüşme ve gözlem istatistikleri</p>
                        <button onclick="rehberlikModule.generateMonthlyReport()" 
                                class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg">
                            Rapor Oluştur
                        </button>
                    </div>
                    
                    <div class="bg-white border border-gray-200 rounded-lg p-6 text-center">
                        <div class="text-4xl mb-4">👤</div>
                        <h4 class="font-semibold text-gray-800 mb-2">Öğrenci Detay Raporu</h4>
                        <p class="text-gray-600 text-sm mb-4">Tekil öğrenci tüm süreç raporu</p>
                        <button onclick="rehberlikModule.generateStudentReport()" 
                                class="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg">
                            Rapor Oluştur
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // TEMEL FONKSİYONLAR
    switchSubModule(subModule) {
        this.currentSubModule = subModule;
        this.updateView();
    }

    updateView() {
        const content = document.getElementById('module-content');
        if (content) {
            content.innerHTML = this.render();
        }
    }

    showStudentForm() {
        const formHTML = `
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Öğrenci Adı Soyadı</label>
                    <input type="text" id="studentName" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Sınıf</label>
                    <input type="text" id="studentClass" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Not</label>
                    <textarea id="studentNote" class="w-full px-3 py-2 border border-gray-300 rounded-lg" rows="3"></textarea>
                </div>
                <div class="flex justify-end gap-3">
                    <button onclick="window.modalManager.hideModal()" 
                            class="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg">
                        İptal
                    </button>
                    <button onclick="rehberlikModule.saveQuickStudent()" 
                            class="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg">
                        Kaydet
                    </button>
                </div>
            </div>
        `;

        if (window.modalManager) {
            window.modalManager.showModal('Yeni Öğrenci', formHTML);
        } else {
            // Fallback
            const name = prompt('Öğrenci adı:');
            const className = prompt('Sınıf:');
            if (name && className) {
                this.saveQuickStudentData(name, className);
            }
        }
    }

    saveQuickStudent() {
        const name = document.getElementById('studentName')?.value;
        const className = document.getElementById('studentClass')?.value;
        const note = document.getElementById('studentNote')?.value;

        if (name && className) {
            this.saveQuickStudentData(name, className, note);
            if (window.modalManager) {
                window.modalManager.hideModal();
            }
        }
    }

    saveQuickStudentData(name, className, note = '') {
        const db = window.storageManager.getData();
        if (!db.rehberlikOgrenciler) {
            db.rehberlikOgrenciler = [];
        }

        db.rehberlikOgrenciler.push({
            id: 'reh_ogrenci_' + Date.now(),
            adi: name,
            sinif: className,
            not: note,
            createdAt: new Date().toISOString(),
            status: 'active'
        });

        window.storageManager.saveData(db);
        window.notificationManager.show('✅ Öğrenci kaydedildi!', 'success');
        this.updateView();
    }

    showMeetingForm() {
        const db = window.storageManager.getData();
        const students = db.rehberlikOgrenciler || [];

        const formHTML = `
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Görüşme Başlığı</label>
                    <input type="text" id="meetingTitle" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Öğrenci</label>
                    <select id="meetingStudent" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                        <option value="">Öğrenci seçin</option>
                        ${students.map(student => `
                            <option value="${student.id}">${student.adi || student.name} - ${student.sinif || student.className}</option>
                        `).join('')}
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Özet</label>
                    <textarea id="meetingSummary" class="w-full px-3 py-2 border border-gray-300 rounded-lg" rows="3"></textarea>
                </div>
                <div class="flex justify-end gap-3">
                    <button onclick="window.modalManager.hideModal()" 
                            class="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg">
                        İptal
                    </button>
                    <button onclick="rehberlikModule.saveQuickMeeting()" 
                            class="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg">
                        Kaydet
                    </button>
                </div>
            </div>
        `;

        if (window.modalManager) {
            window.modalManager.showModal('Yeni Görüşme', formHTML);
        }
    }

    saveQuickMeeting() {
        const title = document.getElementById('meetingTitle')?.value;
        const studentId = document.getElementById('meetingStudent')?.value;
        const summary = document.getElementById('meetingSummary')?.value;

        if (title && studentId && summary) {
            const db = window.storageManager.getData();
            if (!db.rehberlikGorusmeleri) {
                db.rehberlikGorusmeleri = [];
            }

            db.rehberlikGorusmeleri.push({
                id: 'reh_gorusme_' + Date.now(),
                baslik: title,
                ogrenciId: studentId,
                ozet: summary,
                tarih: new Date().toISOString(),
                createdAt: new Date().toISOString()
            });

            window.storageManager.saveData(db);
            window.notificationManager.show('✅ Görüşme kaydedildi!', 'success');
            
            if (window.modalManager) {
                window.modalManager.hideModal();
            }
            this.updateView();
        }
    }

    generateMonthlyReport() {
        const db = window.storageManager.getData();
        const studentCount = db.rehberlikOgrenciler?.length || 0;
        const meetingCount = db.rehberlikGorusmeleri?.length || 0;

        const report = `
            AYLIK REHBERLİK RAPORU
            ======================
            Tarih: ${new Date().toLocaleDateString('tr-TR')}
            
            İSTATİSTİKLER:
            - Toplam Öğrenci: ${studentCount}
            - Toplam Görüşme: ${meetingCount}
            - Aktif Öğrenci: ${db.rehberlikOgrenciler?.filter(s => s.status === 'active').length || 0}
        `;

        alert(report);
    }

    generateStudentReport() {
        window.notificationManager.show('👤 Öğrenci raporu özelliği yakında eklenecek!', 'info');
    }

    showStudentDetail(studentId) {
        window.notificationManager.show('📊 Öğrenci detayı yakında eklenecek!', 'info');
    }

    addMeetingForStudent(studentId) {
        window.notificationManager.show('💬 Bu öğrenci için görüşme ekleme yakında eklenecek!', 'info');
    }

    // Diğer alt modüller için placeholder
    renderGozlemler() {
        return `
            <div class="text-center py-12">
                <div class="text-5xl mb-4">👁️</div>
                <h3 class="text-2xl font-bold text-gray-800 mb-4">Gözlem Modülü</h3>
                <p class="text-gray-600">Bu özellik yakında eklenecek</p>
            </div>
        `;
    }

    renderTestler() {
        return `
            <div class="text-center py-12">
                <div class="text-5xl mb-4">📝</div>
                <h3 class="text-2xl font-bold text-gray-800 mb-4">Test Modülü</h3>
                <p class="text-gray-600">Bu özellik yakında eklenecek</p>
            </div>
        `;
    }

    onShow() {
        console.log('🎯 Rehberlik modülü açıldı');
        this.updateView();
    }
}

// Global instance
window.rehberlikModule = new RehberlikModule();

} // if (typeof window.RehberlikModule === 'undefined') kapanışı

// Modül kaydı
function registerRehberlikModule() {
    if (window.moduleManager) {
        window.moduleManager.registerModule('rehberlik', window.rehberlikModule);
        console.log('✅ Rehberlik Modülü kaydedildi - Basit Çalışan Versiyon');
    } else {
        setTimeout(registerRehberlikModule, 100);
    }
}

// DOM yüklendiğinde kaydet
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', registerRehberlikModule);
} else {
    registerRehberlikModule();
}