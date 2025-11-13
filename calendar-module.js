// Takvim modülü - TAM FONKSİYONEL (HATA DÜZELTMELİ)
class CalendarModule {
    constructor() {
        this.buttonText = '📅 Takvim';
        this.currentDate = new Date();
        this.selectedDate = new Date();
    }

    render() {
        return `
            <div class="calendar-module">
                <div class="mb-6 flex justify-between items-center">
                    <h2 class="text-2xl font-bold text-gray-800">📅 Takvim Planlayıcı</h2>
                    <button onclick="moduleManager.showWelcomeScreen()" class="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200">← Ana Sayfaya Dön</button>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <!-- TAKVİM GÖRÜNÜMÜ -->
                    <div class="lg:col-span-2">
                        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
                            <div class="p-6 border-b">
                                <div class="flex justify-between items-center">
                                    <h3 class="text-xl font-semibold text-gray-800">Takvim</h3>
                                    <div class="flex items-center space-x-4">
                                        <button onclick="calendarModule.prevMonth()" class="text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-100 transition duration-200">
                                            ←
                                        </button>
                                        <h4 id="current-month" class="text-lg font-semibold text-gray-700"></h4>
                                        <button onclick="calendarModule.nextMonth()" class="text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-100 transition duration-200">
                                            →
                                        </button>
                                        <button onclick="calendarModule.today()" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 text-sm">
                                            Bugün
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div class="p-6">
                                <div id="calendar-view" class="calendar-container">
                                    <!-- Takvim buraya eklenecek -->
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- ETKİNLİK FORMU ve LİSTESİ -->
                    <div class="space-y-6">
                        <!-- YENİ ETKİNLİK FORMU -->
                        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
                            <div class="p-6 border-b">
                                <h3 class="text-xl font-semibold text-gray-800">➕ Yeni Etkinlik</h3>
                                <p class="text-gray-600 text-sm mt-1">Seçili tarihe etkinlik ekleyin</p>
                            </div>
                            <div class="p-6">
                                <form id="event-form" class="space-y-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Etkinlik Başlığı *</label>
                                        <input type="text" id="event-title" 
                                               class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                               placeholder="Etkinlik adı">
                                    </div>
                                    
                                    <div class="grid grid-cols-2 gap-4">
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-1">Başlangıç Tarihi *</label>
                                            <input type="date" id="event-startDate" 
                                                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        </div>
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-1">Bitiş Tarihi</label>
                                            <input type="date" id="event-endDate" 
                                                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        </div>
                                    </div>

                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Etkinlik Türü</label>
                                        <select id="event-type" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                            <option value="ders">📚 Ders</option>
                                            <option value="toplantı">👥 Toplantı</option>
                                            <option value="sınav">📝 Sınav</option>
                                            <option value="etkinlik">🎉 Okul Etkinliği</option>
                                            <option value="tatil">🏖️ Tatil</option>
                                            <option value="diğer">🔵 Diğer</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                                        <textarea id="event-description" rows="3"
                                                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                  placeholder="Etkinlik detayları..."></textarea>
                                    </div>

                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">İlgili Sınıf</label>
                                        <select id="event-class" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                            <option value="">Tüm Sınıflar</option>
                                            ${this.getClassOptions()}
                                        </select>
                                    </div>

                                    <div class="flex space-x-3 pt-2">
                                        <button type="button" onclick="calendarModule.clearEventForm()" class="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200">
                                            Temizle
                                        </button>
                                        <button type="submit" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200">
                                            📅 Etkinlik Ekle
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        <!-- BUGÜNKÜ ETKİNLİKLER -->
                        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
                            <div class="p-6 border-b">
                                <h3 class="text-xl font-semibold text-gray-800">📋 Bugünkü Etkinlikler</h3>
                                <p class="text-gray-600 text-sm mt-1">${this.formatDate(new Date())}</p>
                            </div>
                            <div class="p-4" id="todays-events-container">
                                ${this.renderTodaysEvents()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // GÜVENLİ TARİH FORMATLAMA FONKSİYONU
    formatDate(date) {
        try {
            return date.toLocaleDateString('tr-TR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        } catch (error) {
            console.error('Tarih formatlama hatası:', error);
            return 'Tarih bilgisi yok';
        }
    }

    // GÜVENLİ TARİH STRING DÖNÜŞTÜRME
    getDateString(date) {
        try {
            if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
                return new Date().toISOString().split('T')[0];
            }
            return date.toISOString().split('T')[0];
        } catch (error) {
            console.error('Tarih dönüşüm hatası:', error);
            return new Date().toISOString().split('T')[0];
        }
    }

    getClassOptions() {
        const db = window.storageManager.getData();
        return db.classes.map(cls => `
            <option value="${cls.id}">${cls.name}</option>
        `).join('');
    }

    renderTodaysEvents() {
        try {
            const db = window.storageManager.getData();
            const today = new Date();
            const todayString = this.getDateString(today);
            const events = db.calendarEvents ? Object.values(db.calendarEvents).flat() : [];
            
            // GÜVENLİ FİLTRELEME
            const todaysEvents = events.filter(event => {
                try {
                    if (!event.startDate) return false;
                    const eventDate = new Date(event.startDate);
                    if (isNaN(eventDate.getTime())) return false;
                    return this.getDateString(eventDate) === todayString;
                } catch (error) {
                    console.error('Etkinlik filtreme hatası:', error, event);
                    return false;
                }
            });

            if (todaysEvents.length === 0) {
                return `
                    <div class="text-center py-4">
                        <div class="text-2xl mb-2">📅</div>
                        <p class="text-gray-500 text-sm">Bugün etkinlik yok</p>
                    </div>
                `;
            }

            return `
                <div class="space-y-3">
                    ${todaysEvents.map(event => {
                        const typeIcons = {
                            'ders': '📚',
                            'toplantı': '👥', 
                            'sınav': '📝',
                            'etkinlik': '🎉',
                            'tatil': '🏖️',
                            'diğer': '🔵'
                        };
                        
                        const typeColors = {
                            'ders': 'bg-blue-100 text-blue-800',
                            'toplantı': 'bg-green-100 text-green-800',
                            'sınav': 'bg-red-100 text-red-800', 
                            'etkinlik': 'bg-purple-100 text-purple-800',
                            'tatil': 'bg-yellow-100 text-yellow-800',
                            'diğer': 'bg-gray-100 text-gray-800'
                        };

                        // GÜVENLİ TARİH GÖSTERİMİ
                        let timeText = '';
                        try {
                            const startTime = event.startDate ? new Date(event.startDate) : null;
                            const endTime = event.endDate ? new Date(event.endDate) : null;
                            
                            if (startTime && !isNaN(startTime.getTime())) {
                                timeText = startTime.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
                                if (endTime && !isNaN(endTime.getTime())) {
                                    timeText += `-${endTime.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}`;
                                }
                            }
                        } catch (error) {
                            timeText = 'Saat bilgisi yok';
                        }

                        return `
                            <div class="border border-gray-200 rounded-lg p-3 hover:shadow-md transition duration-200">
                                <div class="flex justify-between items-start mb-2">
                                    <div class="flex items-center space-x-2">
                                        <span class="text-lg">${typeIcons[event.type] || '🔵'}</span>
                                        <span class="font-semibold text-gray-800">${event.title || 'İsimsiz Etkinlik'}</span>
                                    </div>
                                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${typeColors[event.type] || 'bg-gray-100 text-gray-800'}">
                                        ${event.type || 'diğer'}
                                    </span>
                                </div>
                                <p class="text-gray-600 text-sm">${event.description || 'Açıklama yok'}</p>
                                <div class="flex justify-between items-center mt-2">
                                    <span class="text-xs text-gray-500">${timeText}</span>
                                    <button onclick="calendarModule.deleteEvent('${event.id}')" class="text-red-500 hover:text-red-700 text-xs">
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
        } catch (error) {
            console.error('Bugünkü etkinlikler render hatası:', error);
            return `
                <div class="text-center py-4">
                    <div class="text-2xl mb-2">❌</div>
                    <p class="text-gray-500 text-sm">Etkinlikler yüklenirken hata oluştu</p>
                </div>
            `;
        }
    }

    onShow() {
        console.log('Takvim modülü açıldı');
        this.renderCalendar();
        this.initializeEventForm();
        this.updateSelectedDate(new Date());
    }

    initializeEventForm() {
        const form = document.getElementById('event-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.createEvent();
            });
        }
        
        // Bugünün tarihini varsayılan yap
        const today = this.getDateString(new Date());
        const startDateInput = document.getElementById('event-startDate');
        const endDateInput = document.getElementById('event-endDate');
        
        if (startDateInput) startDateInput.value = today;
        if (endDateInput) endDateInput.value = today;
    }

    renderCalendar() {
        try {
            const calendarEl = document.getElementById('calendar-view');
            const monthYearEl = document.getElementById('current-month');
            
            if (!calendarEl || !monthYearEl) return;

            const year = this.currentDate.getFullYear();
            const month = this.currentDate.getMonth();
            
            const monthNames = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 
                               'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
            monthYearEl.textContent = `${monthNames[month]} ${year}`;

            // Takvim başlıkları
            const dayNames = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
            
            let calendarHTML = `
                <div class="grid grid-cols-7 gap-1 mb-2">
                    ${dayNames.map(day => `
                        <div class="text-center text-sm font-semibold text-gray-600 py-2">${day}</div>
                    `).join('')}
                </div>
                <div class="grid grid-cols-7 gap-1" id="calendar-days">
            `;

            // İlk günü bul
            const firstDay = new Date(year, month, 1);
            const startingDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // Pazartesi başlangıç
            
            // Önceki ayın günleri
            const prevMonthLastDay = new Date(year, month, 0).getDate();
            for (let i = startingDay - 1; i >= 0; i--) {
                const day = prevMonthLastDay - i;
                calendarHTML += `<div class="p-2 text-center text-gray-400 bg-gray-50 rounded-lg">${day}</div>`;
            }

            // Bu ayın günleri
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const today = new Date();
            const db = window.storageManager.getData();
            const events = db.calendarEvents || {};

            for (let day = 1; day <= daysInMonth; day++) {
                const date = new Date(year, month, day);
                const dateString = this.getDateString(date);
                const isToday = date.toDateString() === today.toDateString();
                const isSelected = date.toDateString() === this.selectedDate.toDateString();
                const dayEvents = events[dateString] || [];
                
                let dayClass = "p-2 text-center cursor-pointer rounded-lg border-2 transition duration-200 ";
                
                if (isSelected) {
                    dayClass += "bg-blue-600 text-white border-blue-600 font-semibold";
                } else if (isToday) {
                    dayClass += "bg-blue-100 text-blue-800 border-blue-300 font-semibold";
                } else {
                    dayClass += "bg-white text-gray-800 border-transparent hover:bg-gray-50";
                }

                calendarHTML += `
                    <div class="${dayClass}" onclick="calendarModule.selectDate(${year}, ${month}, ${day})">
                        <div class="flex justify-between items-start">
                            <span>${day}</span>
                            ${dayEvents.length > 0 ? `
                                <span class="text-xs ${isSelected || isToday ? 'text-white' : 'text-blue-600'}">
                                    ●
                                </span>
                            ` : ''}
                        </div>
                        ${dayEvents.length > 0 ? `
                            <div class="mt-1 space-y-1">
                                ${dayEvents.slice(0, 2).map(event => {
                                    const typeIcons = {
                                        'ders': '📚',
                                        'toplantı': '👥',
                                        'sınav': '📝',
                                        'etkinlik': '🎉',
                                        'tatil': '🏖️',
                                        'diğer': '🔵'
                                    };
                                    return `
                                        <div class="text-xs truncate ${isSelected ? 'text-white' : 'text-gray-600'}" title="${event.title}">
                                            ${typeIcons[event.type] || '🔵'} ${event.title}
                                        </div>
                                    `;
                                }).join('')}
                                ${dayEvents.length > 2 ? `
                                    <div class="text-xs ${isSelected ? 'text-white' : 'text-gray-500'}">
                                        +${dayEvents.length - 2} more
                                    </div>
                                ` : ''}
                            </div>
                        ` : ''}
                    </div>
                `;
            }

            // Sonraki ayın günleri
            const totalCells = 42; // 6 hafta
            const remainingCells = totalCells - (startingDay + daysInMonth);
            for (let day = 1; day <= remainingCells; day++) {
                calendarHTML += `<div class="p-2 text-center text-gray-400 bg-gray-50 rounded-lg">${day}</div>`;
            }

            calendarHTML += `</div>`;
            calendarEl.innerHTML = calendarHTML;
        } catch (error) {
            console.error('Takvim render hatası:', error);
            const calendarEl = document.getElementById('calendar-view');
            if (calendarEl) {
                calendarEl.innerHTML = `
                    <div class="text-center py-8">
                        <div class="text-4xl mb-4">❌</div>
                        <p class="text-gray-500 font-medium mb-2">Takvim yüklenirken hata oluştu</p>
                        <button onclick="calendarModule.renderCalendar()" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200">
                            Tekrar Dene
                        </button>
                    </div>
                `;
            }
        }
    }

    selectDate(year, month, day) {
        try {
            this.selectedDate = new Date(year, month, day);
            this.renderCalendar();
            this.updateEventFormDate();
        } catch (error) {
            console.error('Tarih seçme hatası:', error);
        }
    }

    updateSelectedDate(date) {
        try {
            this.selectedDate = date;
            this.updateEventFormDate();
        } catch (error) {
            console.error('Tarih güncelleme hatası:', error);
        }
    }

    updateEventFormDate() {
        try {
            const dateInput = document.getElementById('event-startDate');
            if (dateInput) {
                dateInput.value = this.getDateString(this.selectedDate);
            }
        } catch (error) {
            console.error('Form tarih güncelleme hatası:', error);
        }
    }

    prevMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.renderCalendar();
    }

    nextMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.renderCalendar();
    }

    today() {
        this.currentDate = new Date();
        this.selectedDate = new Date();
        this.renderCalendar();
        this.updateEventFormDate();
    }

    createEvent() {
        const title = document.getElementById('event-title').value.trim();
        const startDate = document.getElementById('event-startDate').value;
        const endDate = document.getElementById('event-endDate').value;
        const type = document.getElementById('event-type').value;
        const description = document.getElementById('event-description').value.trim();
        const classId = document.getElementById('event-class').value;

        if (!title || !startDate) {
            window.notificationManager.show('Lütfen zorunlu alanları doldurun!', 'error');
            return;
        }

        try {
            const db = window.storageManager.getData();
            if (!db.calendarEvents) db.calendarEvents = {};

            const newEvent = {
                id: 'event_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                title,
                startDate,
                endDate: endDate || startDate,
                type,
                description,
                classId,
                createdAt: new Date().toISOString()
            };

            const dateKey = startDate.split('T')[0];
            if (!db.calendarEvents[dateKey]) {
                db.calendarEvents[dateKey] = [];
            }

            db.calendarEvents[dateKey].push(newEvent);
            
            if (window.storageManager.saveData(db)) {
                window.notificationManager.show('✅ Etkinlik başarıyla eklendi!', 'success');
                this.clearEventForm();
                this.renderCalendar();
                this.refreshTodaysEvents();
            } else {
                window.notificationManager.show('❌ Etkinlik eklenirken hata oluştu!', 'error');
            }
        } catch (error) {
            console.error('Etkinlik oluşturma hatası:', error);
            window.notificationManager.show('❌ Etkinlik eklenirken hata oluştu!', 'error');
        }
    }

    clearEventForm() {
        document.getElementById('event-title').value = '';
        document.getElementById('event-startDate').value = this.getDateString(this.selectedDate);
        document.getElementById('event-endDate').value = this.getDateString(this.selectedDate);
        document.getElementById('event-type').value = 'ders';
        document.getElementById('event-description').value = '';
        document.getElementById('event-class').value = '';
    }

    deleteEvent(eventId) {
        if (!confirm('Bu etkinliği silmek istediğinize emin misiniz?')) {
            return;
        }

        try {
            const db = window.storageManager.getData();
            if (db.calendarEvents) {
                for (const date in db.calendarEvents) {
                    db.calendarEvents[date] = db.calendarEvents[date].filter(event => event.id !== eventId);
                    if (db.calendarEvents[date].length === 0) {
                        delete db.calendarEvents[date];
                    }
                }
                
                if (window.storageManager.saveData(db)) {
                    window.notificationManager.show('🗑️ Etkinlik silindi!', 'success');
                    this.renderCalendar();
                    this.refreshTodaysEvents();
                }
            }
        } catch (error) {
            console.error('Etkinlik silme hatası:', error);
            window.notificationManager.show('❌ Etkinlik silinirken hata oluştu!', 'error');
        }
    }

    refreshTodaysEvents() {
        const container = document.getElementById('todays-events-container');
        if (container) {
            container.innerHTML = this.renderTodaysEvents();
        }
    }

    showDateEvents() {
        // Seçili tarihin etkinliklerini göster
        try {
            const db = window.storageManager.getData();
            const dateKey = this.getDateString(this.selectedDate);
            const events = db.calendarEvents ? db.calendarEvents[dateKey] || [] : [];
            
            if (events.length > 0) {
                window.notificationManager.show(`📅 ${this.formatDate(this.selectedDate)} - ${events.length} etkinlik`, 'info');
            }
        } catch (error) {
            console.error('Tarih etkinlikleri gösterim hatası:', error);
        }
    }
}

window.calendarModule = new CalendarModule();
window.safeRegisterModule('calendar', window.calendarModule);