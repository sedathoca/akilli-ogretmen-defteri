class RehberlikGorusmeModule {
    constructor() {
        this.buttonText = 'Rehberlik Gorusmeleri';
    }

    render() {
        const meetings = this.getMeetings();
        return `
            <div class="rehberlik-gorusme-module">
                <div class="mb-6 flex justify-between items-center">
                    <h2 class="text-2xl font-bold text-gray-800">Gorusme Kayit Defteri</h2>
                    <div class="flex gap-2">
                        <button onclick="rehberlikGorusmeModule.exportMeetings()" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200">Kayitlari Disari Aktar</button>
                        <button onclick="moduleManager.showWelcomeScreen()" class="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200">Ana Sayfaya Don</button>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div class="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <div class="flex justify-between items-center mb-4">
                            <div>
                                <h3 class="text-xl font-semibold text-gray-800">Son Gorusmeler</h3>
                                <p class="text-gray-500 text-sm">Toplam ${meetings.length} kayit</p>
                            </div>
                            <button onclick="rehberlikGorusmeModule.clearMeetings()" class="text-sm text-red-600 hover:text-red-700 font-semibold">Tum Kayitlari Temizle</button>
                        </div>
                        ${this.renderMeetingTimeline(meetings)}
                    </div>

                    <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <h3 class="text-xl font-semibold text-gray-800 mb-4">Yeni Gorusme Kaydi</h3>
                        <form onsubmit="rehberlikGorusmeModule.saveMeeting(event)" class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Gorusme Basligi *</label>
                                <input type="text" name="meetingTitle" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Orn: Veli gorusmesi">
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Ogrenci / Veli</label>
                                    <input type="text" name="meetingPerson" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ad Soyad">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Tarih *</label>
                                    <input type="date" name="meetingDate" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                </div>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Gorusme Kanal</label>
                                <select name="meetingChannel" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option value="yuz yuze">Yuz yuze</option>
                                    <option value="telefon">Telefon</option>
                                    <option value="online">Online</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Ozet *</label>
                                <textarea name="meetingSummary" rows="4" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Kisa notlar"></textarea>
                            </div>
                            <button type="submit" class="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200">
                                Gorusmeyi Kaydet
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        `;
    }

    getMeetings() {
        const db = window.storageManager.getData();
        if (!Array.isArray(db.rehberlikAktiviteLog)) {
            db.rehberlikAktiviteLog = [];
            window.storageManager.saveData(db);
        }
        return db.rehberlikAktiviteLog;
    }

    renderMeetingTimeline(meetings) {
        if (meetings.length === 0) {
            return `
                <div class="text-center py-12">
                    <div class="text-5xl mb-4">[Not]</div>
                    <p class="text-gray-600">Kayitli gorusme yok. Sagdaki formdan ilk notu ekleyin.</p>
                </div>
            `;
        }

        return `
            <div class="space-y-4">
                ${meetings.slice().reverse().map(meeting => `
                    <div class="border border-gray-200 rounded-lg p-4">
                        <div class="flex justify-between items-start">
                            <div>
                                <h4 class="text-lg font-semibold text-gray-800">${meeting.title}</h4>
                                <p class="text-sm text-gray-500">${meeting.person || 'Kayitli isim yok'} • ${meeting.channel || 'Kanal belirtilmedi'}</p>
                            </div>
                            <button onclick="rehberlikGorusmeModule.removeMeeting('${meeting.id}')" class="text-sm text-red-600 hover:text-red-700 font-semibold">Sil</button>
                        </div>
                        <p class="text-gray-700 mt-3">${meeting.summary}</p>
                        <div class="text-sm text-gray-500 mt-2">${new Date(meeting.date).toLocaleDateString()} • Kayit: ${new Date(meeting.createdAt).toLocaleString()}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    saveMeeting(event) {
        event.preventDefault();
        const form = event.target;
        const title = form.meetingTitle.value.trim();
        const person = form.meetingPerson.value.trim();
        const date = form.meetingDate.value;
        const channel = form.meetingChannel.value;
        const summary = form.meetingSummary.value.trim();

        if (!title || !date || !summary) {
            window.notificationManager.show('Baslik, tarih ve ozet alanlari zorunludur.', 'error');
            return;
        }

        const db = window.storageManager.getData();
        if (!Array.isArray(db.rehberlikAktiviteLog)) {
            db.rehberlikAktiviteLog = [];
        }

        db.rehberlikAktiviteLog.push({
            id: window.helperManager.generateId('rehberlik_meeting'),
            title,
            person,
            date,
            channel,
            summary,
            createdAt: new Date().toISOString()
        });

        window.storageManager.saveData(db);
        window.notificationManager.show('Gorusme kaydedildi.', 'success');
        this.refresh();
    }

    removeMeeting(meetingId) {
        const db = window.storageManager.getData();
        db.rehberlikAktiviteLog = (db.rehberlikAktiviteLog || []).filter(item => item.id !== meetingId);
        window.storageManager.saveData(db);
        window.notificationManager.show('Gorusme silindi.', 'info');
        this.refresh();
    }

    clearMeetings() {
        if (!confirm('Tum gorusme kayitlarini silmek istediginizden emin misiniz?')) {
            return;
        }
        const db = window.storageManager.getData();
        db.rehberlikAktiviteLog = [];
        window.storageManager.saveData(db);
        window.notificationManager.show('Tum gorusmeler temizlendi.', 'warning');
        this.refresh();
    }

    exportMeetings() {
        const meetings = this.getMeetings();
        const payload = {
            exportedAt: new Date().toISOString(),
            total: meetings.length,
            meetings
        };
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'rehberlik_gorusme_kayitlari.json';
        a.click();
        URL.revokeObjectURL(url);
    }

    refresh() {
        window.moduleManager.showModule('rehberlikGorusme');
    }
}

window.rehberlikGorusmeModule = new RehberlikGorusmeModule();
window.safeRegisterModule('rehberlikGorusme', window.rehberlikGorusmeModule);


