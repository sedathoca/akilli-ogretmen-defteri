// Ana modül yöneticisi - GÜNCELLENMİŞ (DERS PROGRAMI TABLOSU KALDIRILDI, YENİ MODÜLLER EKLENDİ)
class ModuleManager {
    constructor() {
        this.modules = {};
        this.currentModule = null;
        this.isInitialized = false;
    }

    // Modül kaydet - GÜVENLİ VERSİYON
    registerModule(name, module) {
        console.log(`🔧 Modül kaydediliyor: ${name}`);
        
        if (!module || typeof module !== 'object') {
            console.error(`❌ Geçersiz modül: ${name}`, module);
            return false;
        }

        if (typeof module.render !== 'function') {
            console.error(`❌ Modül render fonksiyonu eksik: ${name}`, module);
            return false;
        }

        this.modules[name] = module;
        console.log(`✅ Modül başarıyla kaydedildi: ${name}`);
        return true;
    }

    // Modül göster - GÜVENLİ VERSİYON
    showModule(moduleName) {
        console.log(`🔄 Modül açılıyor: ${moduleName}`);
        
        if (moduleName === 'rehberlik' && !this.modules.rehberlik) {
            console.log('🔄 Rehberlik modülü kontrol ediliyor...');
            if (window.rehberlikModule) {
                console.log('✅ Rehberlik modülü bulundu, manuel kaydediliyor...');
                this.registerModule('rehberlik', window.rehberlikModule);
            } else {
                console.error('❌ Rehberlik modülü bulunamadı!');
                window.notificationManager.show('Rehberlik modülü yüklenemedi!', 'error');
                this.showWelcomeScreen();
                return;
            }
        }
        
        // Yeni modüller için kontrol
        if (moduleName === 'dersprogrami' && !this.modules.dersprogrami) {
            console.log('🔄 Ders Programı modülü kontrol ediliyor...');
            if (window.dersProgramiModule) {
                console.log('✅ Ders Programı modülü bulundu, manuel kaydediliyor...');
                this.registerModule('dersprogrami', window.dersProgramiModule);
            }
        }

        if (moduleName === 'yillikplan' && !this.modules.yillikplan) {
            console.log('🔄 Yıllık Plan modülü kontrol ediliyor...');
            if (window.yillikPlanModule) {
                console.log('✅ Yıllık Plan modülü bulundu, manuel kaydediliyor...');
                this.registerModule('yillikplan', window.yillikPlanModule);
            }
        }
        
        if (!this.modules[moduleName]) {
            console.error(`❌ Modül bulunamadı: ${moduleName}`);
            window.notificationManager.show(`${moduleName} modülü henüz eklenmedi!`, 'error');
            this.showWelcomeScreen();
            return;
        }

        const module = this.modules[moduleName];
        
        if (typeof module.render !== 'function') {
            console.error(`❌ Modül render fonksiyonu yok: ${moduleName}`);
            window.notificationManager.show(`${moduleName} modülü hatalı!`, 'error');
            this.showWelcomeScreen();
            return;
        }

        try {
            if (this.currentModule && this.modules[this.currentModule] && this.modules[this.currentModule].onHide) {
                this.modules[this.currentModule].onHide();
            }

            this.currentModule = moduleName;
            
            const contentContainer = document.getElementById('module-content');
            if (!contentContainer) {
                console.error('❌ İçerik konteynırı bulunamadı');
                return;
            }

            const moduleContent = module.render();
            if (!moduleContent) {
                throw new Error('Modül içeriği boş döndü');
            }

            contentContainer.innerHTML = moduleContent;
            console.log(`✅ Modül içeriği yüklendi: ${moduleName}`);
            
            if (typeof module.onShow === 'function') {
                setTimeout(() => {
                    try {
                        module.onShow();
                        console.log(`✅ Modül onShow çağrıldı: ${moduleName}`);
                    } catch (error) {
                        console.error(`❌ Modül onShow hatası (${moduleName}):`, error);
                    }
                }, 100);
            }
            
        } catch (error) {
            console.error(`❌ Modül gösterim hatası (${moduleName}):`, error);
            window.notificationManager.show(`${moduleName} modülü yüklenirken hata oluştu!`, 'error');
            this.showWelcomeScreen();
        }
    }

    // Ana sayfayı göster - GÜNCELLENMİŞ (DERS PROGRAMI TABLOSU KALDIRILDI)
    showWelcomeScreen() {
        console.log('🏠 Ana sayfa gösteriliyor');
        
        try {
            this.currentModule = null;
            const contentContainer = document.getElementById('module-content');
            
            if (contentContainer) {
                contentContainer.innerHTML = this.getWelcomeScreenHTML();
                this.initWelcomeScreen();
                console.log('✅ Ana sayfa yüklendi');
            } else {
                console.error('❌ İçerik konteynırı bulunamadı');
            }
        } catch (error) {
            console.error('❌ Ana sayfa yükleme hatası:', error);
        }
    }

    // ANA SAYFA TASARIMI - GÜNCELLENMİŞ (DERS PROGRAMI TABLOSU KALDIRILDI, GÜNLÜK PLAN EKLENDİ)
    getWelcomeScreenHTML() {
        const db = window.storageManager.getData();
        const classCount = db.classes.length;
        const studentCount = db.classes.reduce((total, cls) => total + (cls.students ? cls.students.length : 0), 0);
        const homeworkCount = db.homework ? db.homework.length : 0;
        const pendingHomework = db.homework ? db.homework.filter(hw => hw.status === 'pending').length : 0;
        const backupInfo = this.getBackupInfo();
        const lastBackupText = backupInfo.exists ? 
            `Son yedek: ${new Date(backupInfo.timestamp).toLocaleString('tr-TR')}` : 
            'Henüz yedek alınmamış';

        // Günlük plan bilgileri
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        const dayName = this.getTurkishDayName(today.getDay());
        const todayLessons = this.getTodaysLessons(db);
        const specialDayInfo = this.getTodaysSpecialDay(db, today);

        return `
            <div class="mb-6 text-center">
                <h2 class="text-2xl font-bold text-gray-800">Akıllı Öğretmen Defteri</h2>
                <p id="current-date" class="text-gray-600 mt-1">${today.toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                ${specialDayInfo ? `<p class="text-sm text-red-600 mt-1 font-semibold">🎉 ${specialDayInfo}</p>` : ''}
                <p class="text-sm text-green-600 mt-1">${lastBackupText}</p>
            </div>
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <!-- ZİL SAYACI -->
                <div class="bg-gradient-to-br from-purple-600 to-blue-600 text-white p-6 rounded-lg shadow-lg">
                    <h3 class="text-xl font-bold mb-4">⏰ Zil Sayacı</h3>
                    <div class="text-center mb-4">
                        <div id="timer-display" class="timer-display">45:00</div>
                        <div class="text-purple-200">Ders Süresi</div>
                    </div>
                    <div class="flex justify-center space-x-4">
                        <button onclick="app.startTimer(45*60)" class="bg-white text-purple-600 hover:bg-purple-100 font-medium py-2 px-4 rounded-lg transition duration-200">45 Dakika</button>
                        <button onclick="app.startTimer(40*60)" class="bg-white text-purple-600 hover:bg-purple-100 font-medium py-2 px-4 rounded-lg transition duration-200">40 Dakika</button>
                        <button onclick="app.stopTimer()" class="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200">Durdur</button>
                        <button onclick="app.resetTimer()" class="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200">Reset</button>
                    </div>
                </div>

                <!-- GÜNLÜK PLAN ÖZETİ -->
                <div class="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-xl font-bold text-gray-800">📅 Bugünkü Plan</h3>
                        <button onclick="moduleManager.showModule('dersprogrami')" class="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 text-sm">
                            Detaylı Görünüm
                        </button>
                    </div>
                    
                    <div class="space-y-3">
                        ${todayLessons.length > 0 ? `
                            <div class="mb-4">
                                <h4 class="font-semibold text-gray-700 mb-2">📚 Günlük Dersler (${todayLessons.length})</h4>
                                ${todayLessons.slice(0, 3).map(lesson => `
                                    <div class="border-l-4 border-blue-500 bg-blue-50 p-3 rounded-r-lg mb-2">
                                        <div class="font-medium text-blue-800">${lesson.dersAdi}</div>
                                        <div class="text-sm text-blue-600">${lesson.sinifAdi} • ${lesson.baslangic}-${lesson.bitis}</div>
                                    </div>
                                `).join('')}
                                ${todayLessons.length > 3 ? `
                                    <div class="text-center text-sm text-gray-500 mt-2">
                                        +${todayLessons.length - 3} daha...
                                    </div>
                                ` : ''}
                            </div>
                        ` : `
                            <div class="text-center py-4">
                                <div class="text-2xl mb-2">📚</div>
                                <p class="text-gray-500">Bugün planlanmış ders yok</p>
                            </div>
                        `}
                        
                        <!-- HIZLI İŞLEMLER -->
                        <div class="grid grid-cols-2 gap-2 mt-4">
                            <button onclick="moduleManager.showModule('dersprogrami')" class="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-3 rounded-lg transition duration-200 text-sm">
                                📋 Günlük Plan
                            </button>
                            <button onclick="moduleManager.showModule('calendar')" class="bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-3 rounded-lg transition duration-200 text-sm">
                                📅 Takvim
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- MODÜL KARTLARI - GÜNCELLENMİŞ (YENİ KARTLAR EKLENDİ) -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                <!-- KULLANICI BİLGİLERİ -->
                <div onclick="moduleManager.showModule('user')" class="bg-blue-50 hover:bg-blue-100 cursor-pointer p-5 rounded-lg shadow-sm border border-blue-200 transition duration-200">
                    <div class="flex items-center">
                        <div class="bg-blue-600 text-white p-3 rounded-lg mr-4">👤</div>
                        <span class="font-medium text-gray-800">Kullanıcı Bilgileri</span>
                    </div>
                </div>

                <!-- SINIF MODÜLÜ -->
                <div onclick="moduleManager.showModule('classes')" class="bg-green-50 hover:bg-green-100 cursor-pointer p-5 rounded-lg shadow-sm border border-green-200 transition duration-200">
                    <div class="flex items-center">
                        <div class="bg-green-600 text-white p-3 rounded-lg mr-4">👥</div>
                        <div>
                            <span class="font-medium text-gray-800">Sınıf Modülü</span>
                            <span class="text-sm text-gray-600 block">Sınıf: ${classCount}</span>
                        </div>
                    </div>
                </div>

                <!-- DERS PROGRAMI -->
                <div onclick="moduleManager.showModule('dersprogrami')" class="bg-orange-50 hover:bg-orange-100 cursor-pointer p-5 rounded-lg shadow-sm border border-orange-200 transition duration-200">
                    <div class="flex items-center">
                        <div class="bg-orange-600 text-white p-3 rounded-lg mr-4">📋</div>
                        <div>
                            <span class="font-medium text-gray-800">Ders Programı</span>
                            <span class="text-sm text-gray-600 block">Günlük plan</span>
                        </div>
                    </div>
                </div>

                <!-- YILLIK PLAN -->
                <div onclick="moduleManager.showModule('yillikplan')" class="bg-teal-50 hover:bg-teal-100 cursor-pointer p-5 rounded-lg shadow-sm border border-teal-200 transition duration-200">
                    <div class="flex items-center">
                        <div class="bg-teal-600 text-white p-3 rounded-lg mr-4">📅</div>
                        <div>
                            <span class="font-medium text-gray-800">Yıllık Plan</span>
                            <span class="text-sm text-gray-600 block">Excel import</span>
                        </div>
                    </div>
                </div>

                <!-- ÖDEV TAKİP -->
                <div onclick="moduleManager.showModule('homework')" class="bg-yellow-50 hover:bg-yellow-100 cursor-pointer p-5 rounded-lg shadow-sm border border-yellow-200 transition duration-200">
                    <div class="flex items-center">
                        <div class="bg-yellow-600 text-white p-3 rounded-lg mr-4">📝</div>
                        <div>
                            <span class="font-medium text-gray-800">Ödev Takip</span>
                            <span class="text-sm text-gray-600 block">Ödev: ${homeworkCount}</span>
                        </div>
                    </div>
                </div>

                <!-- REHBERLİK MODÜLÜ -->
                <div onclick="moduleManager.showModule('rehberlik')" class="bg-pink-50 hover:bg-pink-100 cursor-pointer p-5 rounded-lg shadow-sm border border-pink-200 transition duration-200">
                    <div class="flex items-center">
                        <div class="bg-pink-600 text-white p-3 rounded-lg mr-4">💫</div>
                        <div>
                            <span class="font-medium text-gray-800">Rehberlik Modülü</span>
                            <span class="text-sm text-gray-600 block">Özel gereksinim</span>
                        </div>
                    </div>
                </div>
                
                <!-- RAPORLAR -->
                <div onclick="moduleManager.showModule('report')" class="bg-purple-50 hover:bg-purple-100 cursor-pointer p-5 rounded-lg shadow-sm border border-purple-200 transition duration-200">
                    <div class="flex items-center">
                        <div class="bg-purple-600 text-white p-3 rounded-lg mr-4">📊</div>
                        <span class="font-medium text-gray-800">Raporlar</span>
                    </div>
                </div>
                
                <!-- YOKLAMA -->
                <div onclick="moduleManager.showModule('attendance')" class="bg-indigo-50 hover:bg-indigo-100 cursor-pointer p-5 rounded-lg shadow-sm border border-indigo-200 transition duration-200">
                    <div class="flex items-center">
                        <div class="bg-indigo-600 text-white p-3 rounded-lg mr-4">📊</div>
                        <span class="font-medium text-gray-800">Yoklama</span>
                    </div>
                </div>
                
                <!-- YEDEKTEN GERİ YÜKLE -->
                <div onclick="app.restoreBackup()" class="bg-red-50 hover:bg-red-100 cursor-pointer p-5 rounded-lg shadow-sm border border-red-200 transition duration-200">
                    <div class="flex items-center">
                        <div class="bg-red-600 text-white p-3 rounded-lg mr-4">🔄</div>
                        <span class="font-medium text-gray-800">Yedekten Geri Yükle</span>
                    </div>
                </div>
            </div>

            <!-- SİSTEM İSTATİSTİKLERİ -->
            <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mt-6">
                <h3 class="text-xl font-bold mb-4">📊 Sistem İstatistikleri</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div class="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div class="text-2xl font-bold text-blue-600">${classCount}</div>
                        <div class="text-sm text-blue-800">Toplam Sınıf</div>
                    </div>
                    <div class="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                        <div class="text-2xl font-bold text-green-600">${studentCount}</div>
                        <div class="text-sm text-green-800">Toplam Öğrenci</div>
                    </div>
                    <div class="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <div class="text-2xl font-bold text-purple-600">${homeworkCount}</div>
                        <div class="text-sm text-purple-800">Toplam Ödev</div>
                    </div>
                    <div class="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                        <div class="text-2xl font-bold text-orange-600">${pendingHomework}</div>
                        <div class="text-sm text-orange-800">Bekleyen Ödev</div>
                    </div>
                </div>
            </div>
        `;
    }

    // YARDIMCI FONKSİYONLAR
    getTurkishDayName(dayIndex) {
        const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
        return days[dayIndex];
    }

    getTodaysLessons(db) {
        const today = new Date();
        const dayName = this.getTurkishDayName(today.getDay());
        let lessons = [];

        db.classes.forEach(sinif => {
            if (sinif.dersProgrami && sinif.dersProgrami[dayName]) {
                Object.values(sinif.dersProgrami[dayName]).forEach(ders => {
                    lessons.push({
                        ...ders,
                        sinifAdi: sinif.name,
                        sinifId: sinif.id
                    });
                });
            }
        });

        return lessons.sort((a, b) => a.baslangic.localeCompare(b.baslangic));
    }

    getTodaysSpecialDay(db, today) {
        const specialDays = this.getSpecialDays();
        const todayStr = today.toISOString().split('T')[0];
        const monthDay = today.toISOString().substring(5, 10);

        // Sabit günleri kontrol et
        if (specialDays.fixed[monthDay]) {
            return specialDays.fixed[monthDay].name;
        }

        // Kullanıcı tanımlı günleri kontrol et
        if (db.specialDays && db.specialDays[todayStr]) {
            return db.specialDays[todayStr].name;
        }

        return null;
    }

    getSpecialDays() {
        // Sabit milli/dini günler
        return {
            fixed: {
                '01-01': { name: 'Yılbaşı', type: 'milli' },
                '23-04': { name: 'Ulusal Egemenlik ve Çocuk Bayramı', type: 'milli' },
                '19-05': { name: 'Atatürk\'ü Anma Gençlik ve Spor Bayramı', type: 'milli' },
                '29-10': { name: 'Cumhuriyet Bayramı', type: 'milli' },
                '01-10': { name: 'Ramazan Bayramı (Yaklaşık)', type: 'dini' },
                '04-06': { name: 'Kurban Bayramı (Yaklaşık)', type: 'dini' }
            }
        };
    }

    getBackupInfo() {
        const backupData = localStorage.getItem('defter_backup');
        if (backupData) {
            const backup = JSON.parse(backupData);
            return {
                exists: true,
                timestamp: backup.timestamp,
                version: backup.version
            };
        }
        return { exists: false };
    }

    initWelcomeScreen() {
        this.updateTimerDisplay();
    }

    updateTimerDisplay() {
        const display = document.getElementById('timer-display');
        if (display) {
            const db = window.storageManager.getData();
            if (db.timer && db.timer.remaining !== undefined) {
                display.textContent = window.helperManager.formatTime(db.timer.remaining);
            }
        }
    }

    // Uygulama başlat
    initialize() {
        console.log('🔧 Modül yöneticisi başlatılıyor...');
        
        // Tüm modülleri kontrol et
        setTimeout(() => {
            const modulesToCheck = ['dersprogrami', 'yillikplan', 'rehberlik'];
            modulesToCheck.forEach(moduleName => {
                const globalVarName = moduleName + 'Module';
                if (window[globalVarName] && !this.modules[moduleName]) {
                    console.log(`🔧 ${moduleName} modülü manuel kaydediliyor...`);
                    this.registerModule(moduleName, window[globalVarName]);
                }
            });
        }, 1000);

        this.showWelcomeScreen();
        this.isInitialized = true;

        console.log('✅ Modül yöneticisi başlatıldı. Mevcut modüller:', Object.keys(this.modules));
    }
}

// Global modül yöneticisi
window.moduleManager = new ModuleManager();

// MODÜL KAYIT YARDIMCISI
window.safeRegisterModule = function(moduleName, moduleInstance) {
    console.log(`🔧 Güvenli modül kaydı: ${moduleName}`);
    
    if (!moduleInstance || typeof moduleInstance !== 'object') {
        console.error(`❌ Geçersiz modül instance: ${moduleName}`);
        return false;
    }
    
    if (typeof moduleInstance.render !== 'function') {
        console.error(`❌ Modül render fonksiyonu eksik: ${moduleName}`);
        return false;
    }
    
    if (!window.moduleManager) {
        console.warn(`⚠️ ModuleManager hazır değil, ${moduleName} bekletiliyor...`);
        setTimeout(() => {
            window.safeRegisterModule(moduleName, moduleInstance);
        }, 100);
        return false;
    }
    
    return window.moduleManager.registerModule(moduleName, moduleInstance);
};

// OTOMATİK MODÜL KAYDI
setTimeout(() => {
    if (window.moduleManager) {
        const modules = {
            'dersprogrami': window.dersProgramiModule,
            'yillikplan': window.yillikPlanModule,
            'rehberlik': window.rehberlikModule
        };
        
        Object.entries(modules).forEach(([name, module]) => {
            if (module && !window.moduleManager.modules[name]) {
                console.log(`🔧 ${name} modülü otomatik kaydediliyor...`);
                window.moduleManager.registerModule(name, module);
            }
        });
    }
}, 1500);

