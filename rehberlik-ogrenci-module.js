class RehberlikOgrenciModule {
    constructor() {
        this.buttonText = 'Rehberlik Ogrencileri';
    }

    render() {
        const students = this.getStudents();
        return `
            <div class="rehberlik-ogrenci-module">
                <div class="mb-6 flex justify-between items-center">
                    <h2 class="text-2xl font-bold text-gray-800">Rehberlik Ogrenci Kayitlari</h2>
                    <button onclick="moduleManager.showWelcomeScreen()" class="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200">
                        Ana Sayfaya Don
                    </button>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div class="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <div class="flex justify-between items-center mb-4">
                            <div>
                                <h3 class="text-xl font-semibold text-gray-800">Kayitli Ogrenciler</h3>
                                <p class="text-gray-500 text-sm">Toplam ${students.length} ogrenci takip ediliyor</p>
                            </div>
                            <button onclick="rehberlikOgrenciModule.exportStudents()" class="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition duration-200">
                                Listeyi Disari Aktar
                            </button>
                        </div>
                        ${this.renderStudentList(students)}
                    </div>

                    <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <h3 class="text-xl font-semibold text-gray-800 mb-4">Yeni Ogrenci Kaydi</h3>
                        <form onsubmit="rehberlikOgrenciModule.saveStudent(event)" class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Ogrenci Adi *</label>
                                <input type="text" name="studentName" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Adi Soyadi">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Sinif</label>
                                <input type="text" name="studentClass" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Orn: 9-A">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Oncelik</label>
                                <select name="priority" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option value="normal">Normal</option>
                                    <option value="medium">Orta</option>
                                    <option value="high">Yuksek</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Not</label>
                                <textarea name="note" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Kisa aciklama"></textarea>
                            </div>
                            <button type="submit" class="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200">
                                Kaydi Ekle
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        `;
    }

    getStudents() {
        const db = window.storageManager.getData();
        if (!Array.isArray(db.rehberlikOgrenciler)) {
            db.rehberlikOgrenciler = [];
            window.storageManager.saveData(db);
        }
        return db.rehberlikOgrenciler;
    }

    renderStudentList(students) {
        if (students.length === 0) {
            return `
                <div class="text-center py-12">
                    <div class="text-5xl mb-4">:)</div>
                    <p class="text-gray-600">Henuz ogrenci kaydi yok. Sag taraftan ilk kaydi ekleyebilirsiniz.</p>
                </div>
            `;
        }

        return `
            <div class="space-y-4">
                ${students.map(student => `
                    <div class="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition duration-200">
                        <div class="flex justify-between items-start">
                            <div>
                                <h4 class="text-lg font-semibold text-gray-800">${student.name}</h4>
                                <p class="text-sm text-gray-500">${student.className || 'Sinif belirtilmedi'}</p>
                            </div>
                            <span class="px-3 py-1 rounded-full text-xs font-semibold ${this.getPriorityBadge(student.priority)}">
                                ${this.getPriorityText(student.priority)}
                            </span>
                        </div>
                        ${student.note ? `<p class="text-gray-600 mt-3">${student.note}</p>` : ''}
                        <div class="flex justify-between items-center text-sm text-gray-500 mt-3">
                            <span>Kayit: ${new Date(student.createdAt).toLocaleDateString()}</span>
                            <button onclick="rehberlikOgrenciModule.removeStudent('${student.id}')" class="text-red-600 hover:text-red-700 font-semibold">
                                Kaydi Sil
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    getPriorityBadge(priority) {
        switch(priority) {
            case 'high':
                return 'bg-red-100 text-red-700';
            case 'medium':
                return 'bg-yellow-100 text-yellow-700';
            default:
                return 'bg-blue-100 text-blue-700';
        }
    }

    getPriorityText(priority) {
        switch(priority) {
            case 'high':
                return 'Yuksek Oncelik';
            case 'medium':
                return 'Orta Oncelik';
            default:
                return 'Normal';
        }
    }

    saveStudent(event) {
        event.preventDefault();
        const form = event.target;
        const name = form.studentName.value.trim();
        const className = form.studentClass.value.trim();
        const note = form.note.value.trim();
        const priority = form.priority.value;

        if (!name) {
            window.notificationManager.show('Ogrenci adi zorunludur.', 'error');
            return;
        }

        const db = window.storageManager.getData();
        if (!Array.isArray(db.rehberlikOgrenciler)) {
            db.rehberlikOgrenciler = [];
        }

        db.rehberlikOgrenciler.push({
            id: window.helperManager.generateId('rehberlik_student'),
            name,
            className,
            note,
            priority,
            createdAt: new Date().toISOString()
        });

        window.storageManager.saveData(db);
        window.notificationManager.show('Ogrenci kaydedildi.', 'success');
        this.refresh();
    }

    removeStudent(studentId) {
        const db = window.storageManager.getData();
        db.rehberlikOgrenciler = (db.rehberlikOgrenciler || []).filter(student => student.id !== studentId);
        window.storageManager.saveData(db);
        window.notificationManager.show('Ogrenci kaydi silindi.', 'info');
        this.refresh();
    }

    exportStudents() {
        const students = this.getStudents();
        const payload = {
            exportedAt: new Date().toISOString(),
            total: students.length,
            students
        };
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'rehberlik_ogrenci_kayitlari.json';
        a.click();
        URL.revokeObjectURL(url);
    }

    refresh() {
        window.moduleManager.showModule('rehberlikOgrenci');
    }
}

window.rehberlikOgrenciModule = new RehberlikOgrenciModule();
window.safeRegisterModule('rehberlikOgrenci', window.rehberlikOgrenciModule);

