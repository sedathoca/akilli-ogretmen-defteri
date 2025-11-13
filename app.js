
class App {
    constructor() {
        this.timerInterval = null;
        this.isInitialized = false;
    }

// Uygulamayi baslat
    initialize() {
        if (this.isInitialized) {
            console.log('Uygulama zaten baslatildi');
            return;
        }

        console.log('>> Akilli Ogretmen Defteri baslatiliyor...');
        
        // Temel kontroller
        const dependenciesReady = this.checkDependencies();
        if (!dependenciesReady) {
            this.showCriticalError('Gerekli bilesenler yuklenemedi. Sayfayi yenileyip tekrar deneyin.');
            return;
        }
        
        // Verileri kontrol et
        this.initializeData();
        
        // Modül yöneticisini başlat
        this.initializeModuleManager();
        
        // Zil sayacını kontrol et
        this.checkTimer();
        
        // Çevrimdışı desteği kontrol et
        this.checkOfflineSupport();

        this.isInitialized = true;
        console.log('✅ Uygulama başarıyla başlatıldı');
    }

// app.js - checkDependencies fonksiyonuna modalManager ekle
checkDependencies() {
    const required = ['storageManager', 'notificationManager', 'helperManager', 'moduleManager', 'modalManager'];
    const missing = required.filter(dep => !window[dep]);
    
    if (missing.length > 0) {
        console.error('Eksik bagimliliklar:', missing);
        const unresolved = [];
    
        missing.forEach(dep => {
            if (dep === 'modalManager') {
                console.log('!! ModalManager eksik, basit versiyon olusturuluyor...');
                this.createFallbackModalManager();
                if (!window.modalManager) {
                    unresolved.push(dep);
                }
            } else {
                unresolved.push(dep);
            }
        });

        if (unresolved.length > 0) {
            return false;
        }
    }
    
    console.log('>> Tum bagimliliklar yuklendi');
    return true;
}

// Fallback modal manager
createFallbackModalManager() {
    window.modalManager = {
        showModal: function(title, content) {
            console.log('Modal:', title, content);
            // Basit bir alert goster
            alert(`${title}\n\nModal ozelligi yakinda eklenecek...`);
        },
        hideModal: function() {
            console.log('Modal kapatildi');
        }
    };
}

    // Kritik hata göster
    showCriticalError(message) {
        document.getElementById('module-content').innerHTML = `
            <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <div class="text-red-600 text-4xl mb-4">❌</div>
                <h2 class="text-xl font-bold text-red-800 mb-2">Sistem Hatası</h2>
                <p class="text-red-700 mb-4">${message}</p>
                <button onclick="location.reload()" class="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded">
                    Sayfayı Yenile
                </button>
            </div>
        `;
    }

    // Veri yapılarını başlat
    initializeData() {
        const db = window.storageManager.getData();
        
        // MEVCUT VERİ YAPILARI
        if (!db.classes) db.classes = [];
        if (!db.calendarEvents) db.calendarEvents = {};
        if (!db.timer) db.timer = { remaining: 2700, running: false };
        if (!db.homework) db.homework = [];
        if (!db.user) db.user = { fullname: '', branch: '', school: '', principal: '' };
        if (!db.customLogo) db.customLogo = null;
        if (!db.lastBackup) db.lastBackup = null;
        if (!db.yearlyPlans) db.yearlyPlans = [];
        
        // REHBERLİK MODÜLÜ VERİ YAPILARI
        if (!db.rehberlikOgrenciler) db.rehberlikOgrenciler = [];
        if (!db.bepPlanlari) db.bepPlanlari = [];
        if (!db.mebFormlar) db.mebFormlar = {};
        if (!db.rehberlikAyarlar) db.rehberlikAyarlar = {
            okulAdi: '',
            rehberlikServisi: '',
            sonGuncelleme: new Date().toISOString()
        };
        if (!db.rehberlikAktiviteLog) db.rehberlikAktiviteLog = [];
        
        window.storageManager.saveData(db);
        console.log('✅ Tüm veri yapıları başlatıldı');
    }

    // Modül yöneticisini başlat
    initializeModuleManager() {
        try {
            window.moduleManager.initialize();
            console.log('✅ Modül yöneticisi başlatıldı');
        } catch (error) {
            console.error('Modül yöneticisi başlatılamadı:', error);
            this.showCriticalError('Modül sistemi başlatılamadı.');
        }
    }

    // === YENİ EKLENEN FONKSİYONLAR ===
    
    // Kullanıcı bilgileri modalı
    showUserInfoModal() {
        window.moduleManager.showModule('user');
    }

    // Hibrit import sistemi
    showHybridImportSystem() {
        window.notificationManager.show('Hibrit import sistemi yakında eklenecek!', 'info');
    }

    // Yedekten geri yükleme
    restoreBackup() {
        const backupData = localStorage.getItem('defter_backup');
        if (backupData) {
            if (confirm('Son yedeği geri yüklemek istediğinize emin misiniz? Mevcut verileriniz kaybolacak.')) {
                try {
                    const backup = JSON.parse(backupData);
                    window.storageManager.saveData(backup.data);
                    window.notificationManager.show('Yedek geri yüklendi! Sayfa yenileniyor...', 'success');
                    setTimeout(function() { location.reload(); }, 2000);
                } catch (error) {
                    window.notificationManager.show('Yedek geri yüklenirken hata oluştu!', 'error');
                }
            }
        } else {
            window.notificationManager.show('Yedek bulunamadı!', 'error');
        }
    }

    // Modül gösterimi
    showModule(moduleName) {
        window.moduleManager.showModule(moduleName);
    }

    // Logo yükleme
    uploadLogo() {
        const fileInput = document.getElementById('logo-upload');
        const file = fileInput.files[0];
        
        if (!file) return;
        
        if (!file.type.startsWith('image/')) {
            window.notificationManager.show('Lütfen bir resim dosyası seçin!', 'error');
            return;
        }
        
        if (file.size > 2 * 1024 * 1024) {
            window.notificationManager.show('Resim dosyası 2MB dan küçük olmalı!', 'error');
            return;
        }
        
        const reader = new FileReader();
        const self = this;
        reader.onload = function(e) {
            const customLogo = document.getElementById('custom-logo');
            const defaultLogo = document.getElementById('default-logo');
            
            customLogo.src = e.target.result;
            customLogo.classList.remove('hidden');
            defaultLogo.classList.add('hidden');
            
            const db = window.storageManager.getData();
            db.customLogo = e.target.result;
            window.storageManager.saveData(db);
            window.notificationManager.show('Logo başarıyla yüklendi!', 'success');
        };
        reader.readAsDataURL(file);
    }

    // Takvim fonksiyonları
    prevMonth() {
        window.notificationManager.show('Takvim özelliği yakında eklenecek!', 'info');
    }

    nextMonth() {
        window.notificationManager.show('Takvim özelliği yakında eklenecek!', 'info');
    }

    // === ZİL SAYACI FONKSİYONLARI ===

    startTimer(seconds) {
        this.stopTimer();
        
        const db = window.storageManager.getData();
        db.timer = {
            remaining: seconds,
            running: true,
            startedAt: new Date().toISOString()
        };
        
        window.storageManager.saveData(db);
        this.updateTimerDisplay();
        
        const self = this;
        this.timerInterval = setInterval(function() {
            const db = window.storageManager.getData();
            if (db.timer.remaining > 0) {
                db.timer.remaining--;
                window.storageManager.saveData(db);
                self.updateTimerDisplay();
                
                // Son 5 dakika uyarısı
                if (db.timer.remaining === 5 * 60) {
                    window.notificationManager.show('⏰ Son 5 dakika!', 'warning');
                }
            } else {
                self.stopTimer();
                window.notificationManager.show('⏰ Ders süresi doldu!', 'warning');
                
                // Otomatik ses çal (isteğe bağlı)
                self.playBellSound();
            }
        }, 1000);
        
        window.notificationManager.show('⏰ ' + (seconds/60) + ' dakika sayacı başlatıldı', 'success');
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        const db = window.storageManager.getData();
        if (db.timer) {
            db.timer.running = false;
            window.storageManager.saveData(db);
        }
    }

    resetTimer() {
        this.stopTimer();
        const db = window.storageManager.getData();
        db.timer.remaining = 2700; // 45 dakika
        window.storageManager.saveData(db);
        this.updateTimerDisplay();
        window.notificationManager.show('⏰ Zil sayacı sıfırlandı!', 'success');
    }

    updateTimerDisplay() {
        const display = document.getElementById('timer-display');
        if (display) {
            const db = window.storageManager.getData();
            if (db.timer && db.timer.remaining !== undefined) {
                display.textContent = window.helperManager.formatTime(db.timer.remaining);
                
                // Son 5 dakika kırmızı yap
                if (db.timer.remaining <= 5 * 60) {
                    display.className = 'text-4xl font-bold text-red-600';
                } else {
                    display.className = 'text-4xl font-bold text-white';
                }
            }
        }
    }

    checkTimer() {
        const db = window.storageManager.getData();
        if (db.timer && db.timer.running && db.timer.remaining > 0) {
            console.log('⏰ Önceki timer devam ediyor, yeniden başlatılıyor...');
            this.startTimer(db.timer.remaining);
        }
    }

    // Çevrimdışı destek
    checkOfflineSupport() {
        if (!navigator.onLine) {
            window.notificationManager.show('🔌 Çevrimdışı moddasınız', 'warning');
        }

        const self = this;
        window.addEventListener('online', function() {
            window.notificationManager.show('🌐 Çevrimiçi moda geçildi', 'success');
        });

        window.addEventListener('offline', function() {
            window.notificationManager.show('🔌 Çevrimdışı moda geçildi', 'warning');
        });
    }

    // Zil sesi (isteğe bağlı)
    playBellSound() {
        // Basit bir bip sesi
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 1);
        } catch (error) {
            console.log('Ses çalınamadı, sessiz mod');
        }
    }

    // Veri yedekleme
    createBackup() {
        const backup = window.storageManager.createBackup();
        window.notificationManager.show('💾 Yedek oluşturuldu!', 'success');
        return backup;
    }

    // Veri dışa aktarma
    exportData() {
        const db = window.storageManager.getData();
        const dataStr = JSON.stringify(db, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const url = URL.createObjectURL(dataBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ogretmen_defteri_' + window.helperManager.getTodayDateString() + '.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        window.notificationManager.show('📤 Veri dışa aktarıldı!', 'success');
    }

    // Sistem bilgisi
    getSystemInfo() {
        const db = window.storageManager.getData();
        return {
            version: '1.1.0', // Versiyon güncellendi
            classCount: db.classes.length,
            studentCount: db.classes.reduce(function(total, cls) { return total + cls.students.length; }, 0),
            eventCount: Object.values(db.calendarEvents).flat().length,
            homeworkCount: db.homework.length,
            rehberlikOgrenciCount: db.rehberlikOgrenciler.length,
            bepPlanCount: db.bepPlanlari.length,
            dataSize: (JSON.stringify(db).length / 1024).toFixed(2) + ' KB',
            lastBackup: db.lastBackup
        };
    }

    // Rehberlik modülü için yardımcı fonksiyonlar
    showRehberlikModule() {
        window.moduleManager.showModule('rehberlik');
    }
}

// Global app instance oluştur
window.app = new App();

// Sayfa yüklendiğinde başlat
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM yüklendi, uygulama başlatılıyor...');
    
    // Kısa bir gecikme ile başlat (tüm dosyaların yüklenmesi için)
    setTimeout(function() {
        window.app.initialize();
    }, 100);
});

// Hata yakalama
window.addEventListener('error', function(e) {
    console.error('🚨 Global hata:', e.error);
    window.notificationManager.show('Sistem hatası oluştu!', 'error');
});

// Promise hatalarını yakala
window.addEventListener('unhandledrejection', function(e) {
    console.error('🚨 İşlenmemiş promise hatası:', e.reason);
    window.notificationManager.show('Beklenmeyen bir hata oluştu!', 'error');
});

