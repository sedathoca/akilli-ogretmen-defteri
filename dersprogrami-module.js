// Ders Programı Modülü - OPTİMİZE EDİLMİŞ
class DersProgramiModule {
    constructor() {
        this.buttonText = '📋 Ders Programı';
        this.currentView = 'weekly';
        this.editingSchedule = false;
        this.isInitialized = false;
    }

    render() {
        return `
            <div class="dersprogrami-module">
                <div class="mb-6 flex justify-between items-center">
                    <h2 class="text-2xl font-bold text-gray-800">📋 Ders Programı</h2>
                    <button onclick="moduleManager.showWelcomeScreen()" class="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200">← Ana Sayfaya Dön</button>
                </div>

                <!-- KONTROL PANELİ -->
                <div class="bg-white rounded-lg shadow-sm p-4 mb-4">
                    <div class="flex flex-wrap gap-2 justify-center">
                        <button onclick="dersProgramiModule.switchView('weekly')" 
                                class="px-4 py-2 rounded-lg transition duration-200 ${this.currentView === 'weekly' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}">
                            📅 Haftalık Tablo
                        </button>
                        <button onclick="dersProgramiModule.switchView('daily')" 
                                class="px-4 py-2 rounded-lg transition duration-200 ${this.currentView === 'daily' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}">
                            📚 Günlük Plan
                        </button>
                        <button onclick="dersProgramiModule.toggleEditMode()" 
                                class="px-4 py-2 ${this.editingSchedule ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white rounded-lg transition duration-200">
                            ${this.editingSchedule ? '🔒 Düzenlemeyi Bitir' : '✏️ Düzenle'}
                        </button>
                        <button onclick="dersProgramiModule.saveSchedule()" 
                                class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition duration-200">
                            💾 Kaydet
                        </button>
                        <button onclick="dersProgramiModule.exportSchedule()" 
                                class="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition duration-200">
                            📤 Dışa Aktar
                        </button>
                    </div>
                </div>

                <!-- İÇERİK ALANI -->
                <div id="schedule-content">
                    ${this.renderCurrentView()}
                </div>
            </div>
        `;
    }

    renderCurrentView() {
        if (this.currentView === 'weekly') {
            return this.renderWeeklySchedule();
        } else {
            return this.renderDailySchedule();
        }
    }

    // === HAFTALIK TABLO - OPTİMİZE EDİLMİŞ ===
    renderWeeklySchedule() {
        const db = window.storageManager.getData();
        const weeklySchedule = db.weeklySchedule || this.createEmptyWeeklySchedule();
        
        return `
            <div class="bg-white rounded-lg shadow-sm overflow-hidden">
                <div class="p-4 border-b bg-gray-50">
                    <h3 class="text-lg font-semibold text-gray-800">📅 Haftalık Ders Programı</h3>
                    <p class="text-gray-600 text-sm">Pazartesi - Cuma • 10 Ders • Tam Özelleştirilebilir</p>
                </div>
                <div class="p-4">
                    ${this.renderWeeklyTable(weeklySchedule)}
                </div>
            </div>
        `;
    }

    renderWeeklyTable(weeklySchedule) {
        const days = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma'];
        const db = window.storageManager.getData();
        const classes = db.classes || [];

        // Önbellek için sınıf isimleri
        const classNames = {};
        classes.forEach(cls => {
            classNames[cls.id] = cls.name;
        });

        let tableHTML = `
            <div class="overflow-x-auto">
                <table class="min-w-full border border-gray-300 text-sm">
                    <thead>
                        <tr class="bg-gray-100">
                            <th class="border border-gray-300 p-2 font-semibold w-20">Ders</th>
                            ${days.map(day => `
                                <th class="border border-gray-300 p-2 font-semibold">${day}</th>
                            `).join('')}
                        </tr>
                    </thead>
                    <tbody>
        `;

        for (let lesson = 1; lesson <= 10; lesson++) {
            const times = weeklySchedule._times && weeklySchedule._times[lesson] 
                ? weeklySchedule._times[lesson] 
                : { baslangic: this.calculateStartTime(lesson), bitis: this.calculateEndTime(lesson) };

            tableHTML += `
                <tr>
                    <td class="border border-gray-300 p-2 bg-gray-50 text-center">
                        <div class="font-medium">${lesson}.</div>
                        <div class="text-xs text-gray-600 mt-1">
                            ${this.editingSchedule ? `
                                <input type="time" value="${times.baslangic}" 
                                       onchange="dersProgramiModule.updateLessonTime(${lesson}, 'baslangic', this.value)"
                                       class="w-full text-xs border rounded px-1 mb-1">
                                <input type="time" value="${times.bitis}" 
                                       onchange="dersProgramiModule.updateLessonTime(${lesson}, 'bitis', this.value)"
                                       class="w-full text-xs border rounded px-1">
                            ` : `${times.baslangic}-${times.bitis}`}
                        </div>
                    </td>
                    ${days.map(day => {
                        const cellData = weeklySchedule[day] && weeklySchedule[day][lesson];
                        return this.renderWeeklyCell(cellData, day, lesson, classNames);
                    }).join('')}
                </tr>
            `;
        }

        tableHTML += `
                    </tbody>
                </table>
            </div>
        `;

        return tableHTML;
    }

    renderWeeklyCell(cellData, day, lesson, classNames) {
        const className = cellData && classNames[cellData.sinifId] ? classNames[cellData.sinifId] : '';
        
        let cellContent = '';
        if (cellData) {
            cellContent = `
                <div class="text-center">
                    <div class="font-semibold">${cellData.dersAdi}</div>
                    <div class="text-xs text-gray-600 mt-1">${className}</div>
                    ${cellData.ogretmen ? `<div class="text-xs text-gray-500">${cellData.ogretmen}</div>` : ''}
                    ${this.editingSchedule ? `
                        <div class="mt-2 flex justify-center space-x-1">
                            <button onclick="dersProgramiModule.editCell('${day}', ${lesson})" 
                                    class="bg-blue-500 hover:bg-blue-600 text-white text-xs py-1 px-2 rounded">
                                ✏️
                            </button>
                            <button onclick="dersProgramiModule.clearCell('${day}', ${lesson})" 
                                    class="bg-red-500 hover:bg-red-600 text-white text-xs py-1 px-2 rounded">
                                🗑️
                            </button>
                        </div>
                    ` : ''}
                </div>
            `;
        } else {
            cellContent = `
                <div class="text-center text-gray-400 h-20 flex items-center justify-center">
                    ${this.editingSchedule ? 
                        '<button onclick="dersProgramiModule.editCell(\'' + day + '\', ' + lesson + ')" class="text-blue-500 hover:text-blue-700 text-sm">+ Ders Ekle</button>' : 
                        'Boş'
                    }
                </div>
            `;
        }

        return `
            <td class="border border-gray-300 p-2 min-w-40 ${this.editingSchedule && !cellData ? 'bg-blue-50 cursor-pointer hover:bg-blue-100' : ''}">
                ${cellContent}
            </td>
        `;
    }

    // === GÜNLÜK PLAN - BASİTLEŞTİRİLMİŞ ===
    renderDailySchedule() {
        const today = new Date();
        const dayName = this.getTurkishDayName(today.getDay());
        const db = window.storageManager.getData();
        
        return `
            <div class="bg-white rounded-lg shadow-sm overflow-hidden">
                <div class="p-4 border-b bg-gray-50">
                    <h3 class="text-lg font-semibold text-gray-800">📚 Günlük Plan - ${dayName}</h3>
                    <p class="text-gray-600 text-sm">${today.toLocaleDateString('tr-TR')}</p>
                </div>
                <div class="p-4">
                    ${this.renderDailyContent(db, dayName)}
                </div>
            </div>
        `;
    }

    renderDailyContent(db, dayName) {
        let dailyLessons = [];
        
        // Haftalık programdan bugünün derslerini al
        if (db.weeklySchedule && db.weeklySchedule[dayName]) {
            Object.entries(db.weeklySchedule[dayName]).forEach(([lesson, data]) => {
                if (data.dersAdi) {
                    const times = db.weeklySchedule._times && db.weeklySchedule._times[lesson] 
                        ? db.weeklySchedule._times[lesson] 
                        : { baslangic: this.calculateStartTime(parseInt(lesson)), bitis: this.calculateEndTime(parseInt(lesson)) };
                    
                    dailyLessons.push({
                        ...data,
                        lesson: parseInt(lesson),
                        baslangic: times.baslangic,
                        bitis: times.bitis
                    });
                }
            });
        }

        dailyLessons.sort((a, b) => a.lesson - b.lesson);

        if (dailyLessons.length === 0) {
            return `
                <div class="text-center py-8">
                    <div class="text-4xl mb-4">📚</div>
                    <p class="text-gray-500">${dayName} günü için planlanmış ders bulunmuyor.</p>
                    <button onclick="dersProgramiModule.switchView('weekly')" class="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
                        Haftalık Programa Git
                    </button>
                </div>
            `;
        }

        return `
            <div class="space-y-3">
                ${dailyLessons.map(lesson => `
                    <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition duration-200">
                        <div class="flex justify-between items-start">
                            <div>
                                <h4 class="font-semibold text-lg">${lesson.dersAdi}</h4>
                                <p class="text-gray-600 text-sm">${lesson.baslangic} - ${lesson.bitis}</p>
                                ${lesson.ogretmen ? `<p class="text-gray-500 text-sm">${lesson.ogretmen}</p>` : ''}
                            </div>
                            <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                                ${lesson.lesson}. Ders
                            </span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // === OPTİMİZE EDİLMİŞ FONKSİYONLAR ===
    createEmptyWeeklySchedule() {
        const schedule = { _times: {} };
        ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma'].forEach(day => {
            schedule[day] = {};
        });
        return schedule;
    }

    calculateStartTime(lesson) {
        let hour = 8;
        let minute = 30 + (lesson - 1) * 50;
        hour += Math.floor(minute / 60);
        minute = minute % 60;
        return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    }

    calculateEndTime(lesson) {
        let hour = 8;
        let minute = 30 + (lesson - 1) * 50 + 40;
        hour += Math.floor(minute / 60);
        minute = minute % 60;
        return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    }

    getTurkishDayName(dayIndex) {
        const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
        return days[dayIndex];
    }

    // === HIZLI İŞLEM FONKSİYONLARI ===
    switchView(view) {
        this.currentView = view;
        this.updateContentView();
    }

    updateContentView() {
        const content = document.getElementById('schedule-content');
        if (content) {
            content.innerHTML = this.renderCurrentView();
        }
    }

    toggleEditMode() {
        this.editingSchedule = !this.editingSchedule;
        this.updateContentView();
    }

    editCell(day, lesson) {
        if (!this.editingSchedule) return;
        this.showEditModal(day, lesson);
    }

    clearCell(day, lesson) {
        if (!confirm('Bu dersi silmek istediğinize emin misiniz?')) return;
        
        const db = window.storageManager.getData();
        if (db.weeklySchedule && db.weeklySchedule[day] && db.weeklySchedule[day][lesson]) {
            delete db.weeklySchedule[day][lesson];
            window.storageManager.saveData(db);
            this.updateContentView();
            window.notificationManager.show('🗑️ Ders silindi!', 'success');
        }
    }

    showEditModal(day, lesson) {
        const db = window.storageManager.getData();
        const cellData = db.weeklySchedule && db.weeklySchedule[day] && db.weeklySchedule[day][lesson] 
            ? db.weeklySchedule[day][lesson] 
            : { dersAdi: '', sinifId: '', ogretmen: '' };

        const classes = db.classes || [];

        const modalHTML = `
            <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
                    <div class="p-4 border-b">
                        <h3 class="text-lg font-semibold">Ders Ekle/Düzenle</h3>
                        <p class="text-gray-600 text-sm">${day} - ${lesson}. Ders</p>
                    </div>
                    <div class="p-4">
                        <div class="space-y-3">
                            <div>
                                <label class="block text-sm font-medium mb-1">Ders Adı *</label>
                                <input type="text" id="modal-ders-adi" value="${cellData.dersAdi}" 
                                       class="w-full px-3 py-2 border rounded" placeholder="Matematik..." required>
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-1">Sınıf *</label>
                                <select id="modal-sinif" class="w-full px-3 py-2 border rounded" required>
                                    <option value="">Seçiniz</option>
                                    ${classes.map(cls => `
                                        <option value="${cls.id}" ${cellData.sinifId === cls.id ? 'selected' : ''}>${cls.name}</option>
                                    `).join('')}
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-1">Öğretmen</label>
                                <input type="text" id="modal-ogretmen" value="${cellData.ogretmen}" 
                                       class="w-full px-3 py-2 border rounded" placeholder="Öğretmen adı">
                            </div>
                        </div>
                    </div>
                    <div class="p-4 border-t bg-gray-50 flex justify-between">
                        <button onclick="dersProgramiModule.closeModal()" class="px-4 py-2 bg-gray-500 text-white rounded">İptal</button>
                        <div class="flex gap-2">
                            ${cellData.dersAdi ? `
                                <button onclick="dersProgramiModule.clearCell('${day}', ${lesson})" class="px-4 py-2 bg-red-500 text-white rounded">Sil</button>
                            ` : ''}
                            <button onclick="dersProgramiModule.saveCell('${day}', ${lesson})" class="px-4 py-2 bg-green-600 text-white rounded">Kaydet</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    saveCell(day, lesson) {
        const dersAdi = document.getElementById('modal-ders-adi').value.trim();
        const sinifId = document.getElementById('modal-sinif').value;
        const ogretmen = document.getElementById('modal-ogretmen').value.trim();

        if (!dersAdi || !sinifId) {
            window.notificationManager.show('Ders adı ve sınıf zorunludur!', 'error');
            return;
        }

        const db = window.storageManager.getData();
        if (!db.weeklySchedule) db.weeklySchedule = this.createEmptyWeeklySchedule();
        if (!db.weeklySchedule[day]) db.weeklySchedule[day] = {};

        db.weeklySchedule[day][lesson] = { dersAdi, sinifId, ogretmen };
        
        window.storageManager.saveData(db);
        this.closeModal();
        this.updateContentView();
        window.notificationManager.show('✅ Ders kaydedildi!', 'success');
    }

    updateLessonTime(lesson, type, time) {
        const db = window.storageManager.getData();
        if (!db.weeklySchedule) db.weeklySchedule = this.createEmptyWeeklySchedule();
        if (!db.weeklySchedule._times) db.weeklySchedule._times = {};
        if (!db.weeklySchedule._times[lesson]) db.weeklySchedule._times[lesson] = {};

        db.weeklySchedule._times[lesson][type] = time;
        window.storageManager.saveData(db);
    }

    closeModal() {
        const modal = document.querySelector('.fixed.inset-0');
        if (modal) modal.remove();
    }

    saveSchedule() {
        window.notificationManager.show('✅ Program kaydedildi!', 'success');
    }

    exportSchedule() {
        const db = window.storageManager.getData();
        if (!db.weeklySchedule) {
            window.notificationManager.show('Dışa aktarılacak program bulunamadı!', 'warning');
            return;
        }

        let csvContent = 'Gün,Ders,Saat,Ders Adı,Sınıf,Öğretmen\n';
        const days = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma'];

        days.forEach(day => {
            for (let lesson = 1; lesson <= 10; lesson++) {
                const cellData = db.weeklySchedule[day] && db.weeklySchedule[day][lesson];
                if (cellData) {
                    const times = db.weeklySchedule._times && db.weeklySchedule._times[lesson] 
                        ? `${db.weeklySchedule._times[lesson].baslangic}-${db.weeklySchedule._times[lesson].bitis}`
                        : `${this.calculateStartTime(lesson)}-${this.calculateEndTime(lesson)}`;
                    
                    const className = db.classes.find(c => c.id === cellData.sinifId)?.name || cellData.sinifId;
                    
                    csvContent += `"${day}","${lesson}. Ders","${times}","${cellData.dersAdi}","${className}","${cellData.ogretmen || ''}"\n`;
                }
            }
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `ders_programi_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        window.notificationManager.show('📤 Program dışa aktarıldı!', 'success');
    }

    onShow() {
        if (!this.isInitialized) {
            this.isInitialized = true;
            console.log('Ders Programı modülü başlatıldı');
        }
    }
}

// Global instance
window.dersProgramiModule = new DersProgramiModule();
window.safeRegisterModule('dersprogrami', window.dersProgramiModule);