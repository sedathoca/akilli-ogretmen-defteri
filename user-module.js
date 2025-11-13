// Kullanıcı bilgileri modülü - TAM FONKSİYONEL
class UserModule {
    constructor() {
        this.buttonText = '👤 Kullanıcı Bilgileri';
    }

    render() {
        const db = window.storageManager.getData();
        const user = db.user || {};
        
        return `
            <div class="user-module">
                <div class="mb-6 flex justify-between items-center">
                    <h2 class="text-2xl font-bold text-gray-800">👤 Kullanıcı Bilgileri</h2>
                    <button onclick="moduleManager.showWelcomeScreen()" class="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200">← Ana Sayfaya Dön</button>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <!-- KULLANICI BİLGİ FORMU -->
                    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div class="p-6 border-b">
                            <h3 class="text-xl font-semibold text-gray-800">Kişisel Bilgiler</h3>
                            <p class="text-gray-600 text-sm mt-1">Öğretmen ve okul bilgilerinizi girin</p>
                        </div>
                        <div class="p-6">
                            <form id="user-info-form" class="space-y-4">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Ad Soyad *</label>
                                        <input type="text" id="user-fullname" value="${user.fullname || ''}" 
                                               class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                               placeholder="Adınız ve soyadınız">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Branş *</label>
                                        <select id="user-branch" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                            <option value="">Branş seçin</option>
                                            <option value="Matematik" ${user.branch === 'Matematik' ? 'selected' : ''}>Matematik</option>
                                            <option value="Türkçe" ${user.branch === 'Türkçe' ? 'selected' : ''}>Türkçe</option>
                                            <option value="Fen Bilimleri" ${user.branch === 'Fen Bilimleri' ? 'selected' : ''}>Fen Bilimleri</option>
                                            <option value="Sosyal Bilgiler" ${user.branch === 'Sosyal Bilgiler' ? 'selected' : ''}>Sosyal Bilgiler</option>
                                            <option value="İngilizce" ${user.branch === 'İngilizce' ? 'selected' : ''}>İngilizce</option>
                                            <option value="Din Kültürü" ${user.branch === 'Din Kültürü' ? 'selected' : ''}>Din Kültürü</option>
                                            <option value="Beden Eğitimi" ${user.branch === 'Beden Eğitimi' ? 'selected' : ''}>Beden Eğitimi</option>
                                            <option value="Görsel Sanatlar" ${user.branch === 'Görsel Sanatlar' ? 'selected' : ''}>Görsel Sanatlar</option>
                                            <option value="Müzik" ${user.branch === 'Müzik' ? 'selected' : ''}>Müzik</option>
                                            <option value="Teknoloji Tasarım" ${user.branch === 'Teknoloji Tasarım' ? 'selected' : ''}>Teknoloji Tasarım</option>
                                            <option value="Rehberlik" ${user.branch === 'Rehberlik' ? 'selected' : ''}>Rehberlik</option>
                                            <option value="Diğer" ${user.branch === 'Diğer' ? 'selected' : ''}>Diğer</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Okul Adı *</label>
                                        <input type="text" id="user-school" value="${user.school || ''}" 
                                               class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                               placeholder="Okulunuzun adı">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Müdür Adı</label>
                                        <input type="text" id="user-principal" value="${user.principal || ''}" 
                                               class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                               placeholder="Okul müdürünün adı">
                                    </div>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
                                    <input type="email" id="user-email" value="${user.email || ''}" 
                                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                           placeholder="E-posta adresiniz">
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                                    <input type="tel" id="user-phone" value="${user.phone || ''}" 
                                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                           placeholder="Telefon numaranız">
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Kişisel Notlar</label>
                                    <textarea id="user-notes" rows="3" 
                                              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                              placeholder="Kişisel notlarınız...">${user.notes || ''}</textarea>
                                </div>

                                <div class="flex justify-end space-x-3 pt-4">
                                    <button type="button" onclick="userModule.cancelEdit()" class="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded-lg transition duration-200">
                                        İptal
                                    </button>
                                    <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200">
                                        💾 Bilgileri Kaydet
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <!-- KULLANICI İSTATİSTİKLERİ -->
                    <div class="space-y-6">
                        <!-- PROFILE CARD -->
                        <div class="bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-lg shadow-lg p-6">
                            <div class="flex items-center space-x-4">
                                <div class="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-2xl">
                                    👤
                                </div>
                                <div class="flex-1">
                                    <h3 class="text-xl font-bold" id="profile-name">${user.fullname || 'Ad Soyad'}</h3>
                                    <p class="text-blue-100" id="profile-branch">${user.branch || 'Branş'}</p>
                                    <p class="text-blue-100 text-sm" id="profile-school">${user.school || 'Okul'}</p>
                                </div>
                            </div>
                        </div>

                        <!-- İSTATİSTİKLER -->
                        <div class="bg-white rounded-lg shadow-sm p-6">
                            <h4 class="text-lg font-semibold text-gray-800 mb-4">📊 Sistem İstatistikleri</h4>
                            <div class="space-y-3">
                                <div class="flex justify-between items-center">
                                    <span class="text-gray-600">Toplam Sınıf</span>
                                    <span class="font-semibold text-blue-600">${db.classes.length}</span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span class="text-gray-600">Toplam Öğrenci</span>
                                    <span class="font-semibold text-green-600">${db.classes.reduce((total, cls) => total + (cls.students ? cls.students.length : 0), 0)}</span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span class="text-gray-600">Yoklama Kaydı</span>
                                    <span class="font-semibold text-purple-600">${db.classes.reduce((total, cls) => total + (cls.attendance ? Object.keys(cls.attendance).length : 0), 0)} gün</span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span class="text-gray-600">Ödev Sayısı</span>
                                    <span class="font-semibold text-orange-600">${db.homework ? db.homework.length : 0}</span>
                                </div>
                            </div>
                        </div>

                        <!-- HIZLI AYARLAR -->
                        <div class="bg-white rounded-lg shadow-sm p-6">
                            <h4 class="text-lg font-semibold text-gray-800 mb-4">⚡ Hızlı Ayarlar</h4>
                            <div class="space-y-3">
                                <button onclick="userModule.exportAllData()" class="w-full flex items-center justify-between p-3 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition duration-200">
                                    <span class="text-green-800 font-medium">📤 Tüm Verileri Dışa Aktar</span>
                                    <span class="text-green-600">→</span>
                                </button>
                                <button onclick="userModule.createBackup()" class="w-full flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition duration-200">
                                    <span class="text-blue-800 font-medium">💾 Yedek Oluştur</span>
                                    <span class="text-blue-600">→</span>
                                </button>
                                <button onclick="userModule.resetAllData()" class="w-full flex items-center justify-between p-3 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 transition duration-200">
                                    <span class="text-red-800 font-medium">🔄 Tüm Verileri Sıfırla</span>
                                    <span class="text-red-600">→</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    onShow() {
        console.log('Kullanıcı modülü açıldı');
        this.initializeForm();
    }

    initializeForm() {
        const form = document.getElementById('user-info-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveUserInfo();
            });
        }
    }

    saveUserInfo() {
        const fullname = document.getElementById('user-fullname').value.trim();
        const branch = document.getElementById('user-branch').value;
        const school = document.getElementById('user-school').value.trim();
        const principal = document.getElementById('user-principal').value.trim();
        const email = document.getElementById('user-email').value.trim();
        const phone = document.getElementById('user-phone').value.trim();
        const notes = document.getElementById('user-notes').value.trim();

        // Zorunlu alan kontrolü
        if (!fullname || !branch || !school) {
            window.notificationManager.show('Lütfen zorunlu alanları doldurun!', 'error');
            return;
        }

        const db = window.storageManager.getData();
        db.user = {
            fullname,
            branch,
            school,
            principal,
            email,
            phone,
            notes,
            lastUpdated: new Date().toISOString()
        };

        if (window.storageManager.saveData(db)) {
            window.notificationManager.show('✅ Kullanıcı bilgileri başarıyla kaydedildi!', 'success');
            // Profil bilgilerini güncelle
            this.updateProfileDisplay();
        } else {
            window.notificationManager.show('❌ Kayıt sırasında hata oluştu!', 'error');
        }
    }

    updateProfileDisplay() {
        const db = window.storageManager.getData();
        const user = db.user || {};
        
        const profileName = document.getElementById('profile-name');
        const profileBranch = document.getElementById('profile-branch');
        const profileSchool = document.getElementById('profile-school');
        
        if (profileName) profileName.textContent = user.fullname || 'Ad Soyad';
        if (profileBranch) profileBranch.textContent = user.branch || 'Branş';
        if (profileSchool) profileSchool.textContent = user.school || 'Okul';
    }

    cancelEdit() {
        if (confirm('Yaptığınız değişiklikler kaydedilmeden kapatılacak. Emin misiniz?')) {
            moduleManager.showWelcomeScreen();
        }
    }

    exportAllData() {
        window.app.exportData();
    }

    createBackup() {
        window.app.createBackup();
    }

    resetAllData() {
        if (confirm('⚠️ TÜM VERİLER SİLİNECEK!\n\nBu işlem geri alınamaz. Tüm sınıflar, öğrenciler, notlar ve yoklama kayıtları silinecek. Emin misiniz?')) {
            if (confirm('SON UYARI: Tüm verileriniz kalıcı olarak silinecek. Devam etmek istiyor musunuz?')) {
                localStorage.removeItem('dijital_defter_data');
                localStorage.removeItem('defter_backup');
                window.notificationManager.show('🗑️ Tüm veriler temizlendi! Sayfa yenileniyor...', 'success');
                setTimeout(() => {
                    location.reload();
                }, 2000);
            }
        }
    }

    // Kullanıcı bilgilerini ana sayfada göster
    getUserSummary() {
        const db = window.storageManager.getData();
        const user = db.user || {};
        
        if (!user.fullname) {
            return '<span class="text-yellow-600">Kullanıcı bilgilerinizi tamamlayın</span>';
        }
        
        return `${user.fullname} - ${user.branch || ''} - ${user.school || ''}`;
    }
}

window.userModule = new UserModule();
// ... (tüm mevcut kod aynı kalacak) ...

// SON SATIRI DEĞİŞTİR:
window.safeRegisterModule('user', window.userModule);