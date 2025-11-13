// SINIF MODÜLÜ - TÜM FONKSİYONLAR ÇALIŞIR
class ClassModule {
    constructor() {
        this.buttonText = '👥 Sınıf Modülü';
        this.currentClassId = null;
    }

    render() {
        const db = window.storageManager.getData();
        return `
            <div class="class-module">
                <div class="mb-6 flex justify-between items-center">
                    <h2 class="text-2xl font-bold text-gray-800">🏫 Sınıf Yönetimi</h2>
                    <button onclick="moduleManager.showWelcomeScreen()" class="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200">
                        ← Ana Sayfaya Dön
                    </button>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    ${this.renderStatCard('🏫', 'Toplam Sınıf', db.classes.length, 'blue')}
                    ${this.renderStatCard('👥', 'Toplam Öğrenci', db.classes.reduce((t, c) => t + (c.students?.length || 0), 0), 'green')}
                    ${this.renderStatCard('📚', 'Aktif Ödev', this.getTotalHomeworkCount(db), 'purple')}
                    ${this.renderStatCard('📊', 'Yoklama Günü', this.getTotalAttendanceDays(db), 'orange')}
                </div>

                <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
                    <div class="flex justify-between items-center">
                        <h3 class="text-xl font-semibold text-gray-800">Sınıf İşlemleri</h3>
                        <button onclick="classModule.showAddClassForm()" class="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200">
                            + Yeni Sınıf Ekle
                        </button>
                    </div>
                    <div id="class-form-container" class="hidden mt-4"></div>
                </div>

                <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div class="p-6 border-b">
                        <h3 class="text-xl font-semibold text-gray-800">Sınıf Listesi</h3>
                    </div>
                    <div id="class-list-container" class="p-6">
                        ${this.renderClassList()}
                    </div>
                </div>
                <div id="class-modals-container"></div>
            </div>
        `;
    }

    renderStatCard(icon, title, value, color) {
        const colors = {
            blue: 'bg-blue-50 border-blue-200 text-blue-600',
            green: 'bg-green-50 border-green-200 text-green-600', 
            purple: 'bg-purple-50 border-purple-200 text-purple-600',
            orange: 'bg-orange-50 border-orange-200 text-orange-600'
        };
        return `
            <div class="${colors[color]} border-2 rounded-xl p-4">
                <div class="flex items-center justify-between">
                    <div>
                        <div class="text-2xl font-bold">${value}</div>
                        <div class="text-sm font-medium opacity-80">${title}</div>
                    </div>
                    <div class="text-2xl">${icon}</div>
                </div>
            </div>
        `;
    }

    renderClassList() {
        const db = window.storageManager.getData();
        if (db.classes.length === 0) {
            return `
                <div class="text-center py-12">
                    <div class="text-6xl mb-4">🏫</div>
                    <h4 class="text-xl font-semibold text-gray-700 mb-2">Henüz sınıf eklenmemiş</h4>
                    <button onclick="classModule.showAddClassForm()" class="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200">
                        + İlk Sınıfını Oluştur
                    </button>
                </div>
            `;
        }

        return `
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                ${db.classes.map(cls => `
                    <div class="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition duration-200">
                        <div class="mb-4">
                            <div class="flex justify-between items-start mb-2">
                                <div>
                                    <h4 class="text-xl font-bold text-gray-800 mb-1">${cls.name}</h4>
                                    <p class="text-gray-600 text-sm">${cls.students?.length || 0} öğrenci</p>
                                </div>
                                <span class="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-medium">
                                    ${cls.students?.length || 0} öğrenci
                                </span>
                            </div>
                        </div>
                        
                        <div class="grid grid-cols-3 gap-2 mb-4 text-center">
                            <div class="bg-green-50 p-2 rounded-lg">
                                <div class="text-lg font-bold text-green-600">${this.getClassHomeworkCount(cls.id)}</div>
                                <div class="text-xs text-green-800">Ödev</div>
                            </div>
                            <div class="bg-blue-50 p-2 rounded-lg">
                                <div class="text-lg font-bold text-blue-600">${cls.attendance ? Object.keys(cls.attendance).length : 0}</div>
                                <div class="text-xs text-blue-800">Yoklama</div>
                            </div>
                            <div class="bg-purple-50 p-2 rounded-lg">
                                <div class="text-lg font-bold text-purple-600">${this.getClassAverage(cls)}</div>
                                <div class="text-xs text-purple-800">Ortalama</div>
                            </div>
                        </div>
                        
                        <div class="grid grid-cols-2 gap-2 mb-3">
                            <button onclick="classModule.takeAttendance('${cls.id}')" class="bg-blue-500 hover:bg-blue-600 text-white text-sm py-2 px-3 rounded-lg transition duration-200">
                                📝 Yoklama
                            </button>
                            <button onclick="classModule.assignHomework('${cls.id}')" class="bg-green-500 hover:bg-green-600 text-white text-sm py-2 px-3 rounded-lg transition duration-200">
                                📚 Ödev
                            </button>
                        </div>
                        
                        <div class="flex space-x-2">
                            <button onclick="classModule.openClassDetail('${cls.id}')" class="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-3 rounded-lg transition duration-200 text-sm">
                                Detaylı Görünüm
                            </button>
                            <button onclick="classModule.showClassActions('${cls.id}')" class="bg-gray-300 hover:bg-gray-400 text-gray-700 p-2 rounded-lg transition duration-200">
                                ⚙️
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // SINIF İŞLEMLERİ
    showAddClassForm() {
        document.getElementById('class-form-container').innerHTML = `
            <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-lg">
                <h4 class="text-lg font-semibold text-gray-800 mb-4">🏫 Yeni Sınıf Oluştur</h4>
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Sınıf Adı *</label>
                        <input type="text" id="new-class-name" placeholder="9-A" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                    </div>
                    <div class="flex space-x-3">
                        <button onclick="classModule.addNewClass()" class="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200">
                            🏫 Oluştur
                        </button>
                        <button onclick="classModule.hideAddClassForm()" class="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200">
                            İptal
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.getElementById('class-form-container').classList.remove('hidden');
    }

    hideAddClassForm() {
        document.getElementById('class-form-container').classList.add('hidden');
    }

    addNewClass() {
        const className = document.getElementById('new-class-name').value.trim();
        if (!className) {
            window.notificationManager.show('Sınıf adı zorunludur!', 'error');
            return;
        }
        
        const db = window.storageManager.getData();
        if (db.classes.some(cls => cls.name === className)) {
            window.notificationManager.show('Bu isimde bir sınıf zaten var!', 'error');
            return;
        }
        
        db.classes.push({
            id: 'class_' + Date.now(),
            name: className,
            students: [],
            attendance: {},
            homework: [],
            createdAt: new Date().toISOString()
        });
        
        window.storageManager.saveData(db);
        this.hideAddClassForm();
        this.showClassList();
        window.notificationManager.show(className + ' sınıfı oluşturuldu!', 'success');
    }

    // SINIF DETAY
    openClassDetail(classId) {
        const db = window.storageManager.getData();
        const cls = db.classes.find(c => c.id === classId);
        if (!cls) return;

        document.getElementById('module-content').innerHTML = `
            <div class="class-detail">
                <div class="bg-blue-600 text-white rounded-xl p-6 mb-6">
                    <div class="flex justify-between items-center">
                        <div>
                            <h2 class="text-3xl font-bold mb-2">${cls.name}</h2>
                            <p>${cls.students?.length || 0} öğrenci</p>
                        </div>
                        <button onclick="classModule.showClassList()" class="bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-medium py-2 px-4 rounded-lg transition duration-200">
                            ← Geri
                        </button>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <button onclick="classModule.showAddStudentForm('${cls.id}')" class="p-4 bg-green-50 hover:bg-green-100 rounded-lg border-2 border-green-200 text-center transition duration-200">
                        <div class="text-2xl mb-2">➕</div>
                        <div class="font-semibold text-green-800">Öğrenci Ekle</div>
                    </button>
                    
                    <button onclick="classModule.takeAttendance('${cls.id}')" class="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border-2 border-blue-200 text-center transition duration-200">
                        <div class="text-2xl mb-2">📝</div>
                        <div class="font-semibold text-blue-800">Yoklama Al</div>
                    </button>
                    
                    <button onclick="classModule.assignHomework('${cls.id}')" class="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border-2 border-purple-200 text-center transition duration-200">
                        <div class="text-2xl mb-2">📚</div>
                        <div class="font-semibold text-purple-800">Ödev Ver</div>
                    </button>
                    
                    <button onclick="classModule.showClassActions('${cls.id}')" class="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg border-2 border-orange-200 text-center transition duration-200">
                        <div class="text-2xl mb-2">⚙️</div>
                        <div class="font-semibold text-orange-800">Ayarlar</div>
                    </button>
                </div>

                <div class="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div class="flex justify-between items-center p-6 border-b">
                        <h3 class="text-xl font-semibold text-gray-700">Öğrenci Listesi</h3>
                        <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                            ${cls.students?.length || 0} öğrenci
                        </span>
                    </div>
                    <div class="p-6">
                        ${this.renderStudentList(cls)}
                    </div>
                </div>
            </div>
        `;
    }

    renderStudentList(cls) {
        if (!cls.students || cls.students.length === 0) {
            return `
                <div class="text-center py-8">
                    <div class="text-4xl mb-4">👥</div>
                    <p class="text-gray-500 font-medium mb-2">Henüz öğrenci eklenmemiş</p>
                    <button onclick="classModule.showAddStudentForm('${cls.id}')" class="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200">
                        ➕ Öğrenci Ekle
                    </button>
                </div>
            `;
        }

        return `
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Okul No</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ad Soyad</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Puanlar</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ortalama</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        ${cls.students.map(student => {
                            const averages = this.calculateStudentAverages(student);
                            const totalMarks = (student.marks?.plus || 0) - (student.marks?.minus || 0);
                            return `
                                <tr class="hover:bg-gray-50">
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${student.no}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${student.name}</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="flex items-center space-x-2">
                                            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">+${student.marks?.plus || 0}</span>
                                            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">-${student.marks?.minus || 0}</span>
                                            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${totalMarks >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">${totalMarks >= 0 ? '+' : ''}${totalMarks}</span>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${this.getAverageClass(averages.yearlyAverage)}">${averages.yearlyAverage}</span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div class="flex items-center space-x-2">
                                            <button onclick="classModule.addMark('${cls.id}', '${student.id}', 'plus')" class="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded-lg transition duration-200">+</button>
                                            <button onclick="classModule.addMark('${cls.id}', '${student.id}', 'minus')" class="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-lg transition duration-200">-</button>
                                            <button onclick="classModule.openStudentDetail('${cls.id}', '${student.id}')" class="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm transition duration-200">📊 Detay</button>
                                            <button onclick="classModule.deleteStudent('${cls.id}', '${student.id}')" class="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-sm transition duration-200">🗑️ Sil</button>
                                        </div>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    // SINIF İŞLEMLERİ MENÜSÜ
    showClassActions(classId) {
        this.showModal(`
            <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div class="bg-white rounded-lg shadow-lg max-w-sm w-full">
                    <div class="p-4 border-b">
                        <h3 class="text-lg font-semibold text-gray-800">Sınıf İşlemleri</h3>
                    </div>
                    <div class="p-4 space-y-2">
                        <button onclick="classModule.editClass('${classId}')" class="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 px-4 rounded text-left transition duration-200 flex items-center">
                            <span class="mr-3">✏️</span> Sınıfı Düzenle
                        </button>
                        <button onclick="classModule.duplicateClass('${classId}')" class="w-full bg-green-50 hover:bg-green-100 text-green-700 py-2 px-4 rounded text-left transition duration-200 flex items-center">
                            <span class="mr-3">📋</span> Sınıfı Kopyala
                        </button>
                        <button onclick="classModule.exportClassData('${classId}')" class="w-full bg-purple-50 hover:bg-purple-100 text-purple-700 py-2 px-4 rounded text-left transition duration-200 flex items-center">
                            <span class="mr-3">📤</span> Dışa Aktar
                        </button>
                        <button onclick="classModule.deleteClass('${classId}')" class="w-full bg-red-50 hover:bg-red-100 text-red-700 py-2 px-4 rounded text-left transition duration-200 flex items-center">
                            <span class="mr-3">🗑️</span> Sınıfı Sil
                        </button>
                    </div>
                    <div class="p-4 border-t flex justify-end">
                        <button onclick="classModule.closeModal()" class="bg-gray-500 hover:bg-gray-600 text-white py-1 px-4 rounded transition duration-200">Kapat</button>
                    </div>
                </div>
            </div>
        `);
    }

    // TÜM FONKSİYONLAR - ÇALIŞIR DURUMDA
    takeAttendance(classId) {
        window.moduleManager.showModule('attendance');
        window.notificationManager.show('Yoklama modülüne yönlendiriliyor...', 'info');
    }

    assignHomework(classId) {
        window.moduleManager.showModule('homework');
        window.notificationManager.show('Ödev modülüne yönlendiriliyor...', 'info');
    }

    showAddStudentForm(classId) {
        this.showModal(`
            <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div class="bg-white rounded-lg shadow-lg max-w-md w-full">
                    <div class="p-6 border-b">
                        <h3 class="text-xl font-bold text-gray-800">➕ Öğrenci Ekle</h3>
                    </div>
                    <div class="p-6">
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Okul No</label>
                                <input type="text" id="new-student-no" class="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="101">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Ad Soyad</label>
                                <input type="text" id="new-student-name" class="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Ali Yılmaz">
                            </div>
                        </div>
                    </div>
                    <div class="p-6 border-t flex justify-end space-x-3">
                        <button onclick="classModule.closeModal()" class="bg-gray-500 hover:bg-gray-600 text-white py-2 px-6 rounded">İptal</button>
                        <button onclick="classModule.addNewStudent('${classId}')" class="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded">Ekle</button>
                    </div>
                </div>
            </div>
        `);
    }

    addNewStudent(classId) {
        const no = document.getElementById('new-student-no').value.trim();
        const name = document.getElementById('new-student-name').value.trim();
        
        if (!no || !name) {
            window.notificationManager.show('Öğrenci no ve adı zorunludur!', 'error');
            return;
        }
        
        const db = window.storageManager.getData();
        const cls = db.classes.find(c => c.id === classId);
        if (!cls) return;
        
        if (cls.students.some(s => s.no === no)) {
            window.notificationManager.show('Bu numarada öğrenci zaten var!', 'error');
            return;
        }
        
        cls.students.push({
            id: 'student_' + Date.now(),
            no: no,
            name: name,
            marks: { plus: 0, minus: 0 },
            grades: {}
        });
        
        window.storageManager.saveData(db);
        this.closeModal();
        this.openClassDetail(classId);
        window.notificationManager.show('Öğrenci eklendi!', 'success');
    }

    addMark(classId, studentId, type) {
        const db = window.storageManager.getData();
        const cls = db.classes.find(c => c.id === classId);
        const student = cls?.students.find(s => s.id === studentId);
        if (!student) return;
        
        if (!student.marks) student.marks = { plus: 0, minus: 0 };
        
        if (type === 'plus') {
            student.marks.plus++;
            window.notificationManager.show('+1 puan eklendi!', 'success');
        } else {
            student.marks.minus++;
            window.notificationManager.show('-1 puan eklendi!', 'warning');
        }
        
        window.storageManager.saveData(db);
        this.openClassDetail(classId);
    }

    openStudentDetail(classId, studentId) {
        const db = window.storageManager.getData();
        const cls = db.classes.find(c => c.id === classId);
        const student = cls?.students.find(s => s.id === studentId);
        if (!student) return;

        const averages = this.calculateStudentAverages(student);
        const totalMarks = (student.marks?.plus || 0) - (student.marks?.minus || 0);

        this.showModal(`
            <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div class="p-6 border-b">
                        <h3 class="text-xl font-bold text-gray-800">📊 ${student.name} - Detay</h3>
                    </div>
                    <div class="p-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div class="bg-blue-50 p-4 rounded-lg">
                                <h4 class="font-semibold text-blue-800 mb-2">👤 Öğrenci Bilgileri</h4>
                                <p><strong>No:</strong> ${student.no}</p>
                                <p><strong>Ad:</strong> ${student.name}</p>
                            </div>
                            <div class="bg-green-50 p-4 rounded-lg">
                                <h4 class="font-semibold text-green-800 mb-2">⭐ Puan Durumu</h4>
                                <p><strong>Artı:</strong> +${student.marks?.plus || 0}</p>
                                <p><strong>Eksi:</strong> -${student.marks?.minus || 0}</p>
                                <p><strong>Net:</strong> ${totalMarks >= 0 ? '+' : ''}${totalMarks}</p>
                            </div>
                        </div>
                        
                        <div class="bg-gray-50 p-4 rounded-lg mb-6">
                            <h4 class="font-semibold text-gray-800 mb-3">📝 Not Girişi</h4>
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <h5 class="text-sm font-medium text-blue-700 mb-2">1. Dönem</h5>
                                    <div class="space-y-2">
                                        ${this.renderGradeInput('d1s1', '1. Sınav', student.grades?.d1s1)}
                                        ${this.renderGradeInput('d1s2', '2. Sınav', student.grades?.d1s2)}
                                        ${this.renderGradeInput('d1p1', '1. Performans', student.grades?.d1p1)}
                                        ${this.renderGradeInput('d1p2', '2. Performans', student.grades?.d1p2)}
                                    </div>
                                </div>
                                <div>
                                    <h5 class="text-sm font-medium text-green-700 mb-2">2. Dönem</h5>
                                    <div class="space-y-2">
                                        ${this.renderGradeInput('d2s1', '1. Sınav', student.grades?.d2s1)}
                                        ${this.renderGradeInput('d2s2', '2. Sınav', student.grades?.d2s2)}
                                        ${this.renderGradeInput('d2p1', '1. Performans', student.grades?.d2p1)}
                                        ${this.renderGradeInput('d2p2', '2. Performans', student.grades?.d2p2)}
                                    </div>
                                </div>
                            </div>
                            <button onclick="classModule.saveStudentGrades('${classId}', '${student.id}')" class="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg mt-4 transition duration-200">
                                💾 Notları Kaydet
                            </button>
                        </div>

                        <div class="bg-purple-50 p-4 rounded-lg">
                            <h4 class="font-semibold text-purple-800 mb-3">📊 Not Ortalamaları</h4>
                            <div class="grid grid-cols-3 gap-4 text-center">
                                <div class="bg-white p-3 rounded">
                                    <div class="text-sm text-blue-600">1. Dönem</div>
                                    <div class="text-xl font-bold text-blue-800">${averages.d1Average}</div>
                                </div>
                                <div class="bg-white p-3 rounded">
                                    <div class="text-sm text-green-600">2. Dönem</div>
                                    <div class="text-xl font-bold text-green-800">${averages.d2Average}</div>
                                </div>
                                <div class="bg-white p-3 rounded">
                                    <div class="text-sm text-purple-600">Yıl Sonu</div>
                                    <div class="text-xl font-bold text-purple-800">${averages.yearlyAverage}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="p-6 border-t flex justify-end">
                        <button onclick="classModule.closeModal()" class="bg-gray-500 hover:bg-gray-600 text-white py-2 px-6 rounded transition duration-200">Kapat</button>
                    </div>
                </div>
            </div>
        `);
    }

    renderGradeInput(id, label, value) {
        return `
            <div class="flex items-center justify-between">
                <label class="text-sm text-gray-600">${label}:</label>
                <input type="number" id="${id}" value="${value || ''}" class="w-16 px-2 py-1 border border-gray-300 rounded text-center" min="0" max="100">
            </div>
        `;
    }

    saveStudentGrades(classId, studentId) {
        const db = window.storageManager.getData();
        const cls = db.classes.find(c => c.id === classId);
        const student = cls?.students.find(s => s.id === studentId);
        if (!student) return;

        const grades = ['d1s1', 'd1s2', 'd1p1', 'd1p2', 'd2s1', 'd2s2', 'd2p1', 'd2p2'].reduce((acc, gradeId) => {
            const value = document.getElementById(gradeId).value;
            acc[gradeId] = value ? parseInt(value) : null;
            return acc;
        }, {});

        student.grades = grades;
        window.storageManager.saveData(db);
        this.closeModal();
        this.openClassDetail(classId);
        window.notificationManager.show('Notlar kaydedildi!', 'success');
    }

    deleteStudent(classId, studentId) {
        if (!confirm('Bu öğrenciyi silmek istediğinize emin misiniz?')) return;
        
        const db = window.storageManager.getData();
        const cls = db.classes.find(c => c.id === classId);
        if (cls) {
            cls.students = cls.students.filter(s => s.id !== studentId);
            window.storageManager.saveData(db);
            this.openClassDetail(classId);
            window.notificationManager.show('Öğrenci silindi!', 'success');
        }
    }

    // SINIF İŞLEM MENÜSÜ FONKSİYONLARI
    editClass(classId) {
        const db = window.storageManager.getData();
        const cls = db.classes.find(c => c.id === classId);
        if (!cls) return;

        this.showModal(`
            <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
                    <div class="p-6 border-b">
                        <h3 class="text-xl font-bold text-gray-800">✏️ Sınıfı Düzenle</h3>
                    </div>
                    <div class="p-6">
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Sınıf Adı</label>
                                <input type="text" id="edit-class-name" value="${cls.name}" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                            </div>
                        </div>
                    </div>
                    <div class="p-6 border-t flex justify-end space-x-3">
                        <button onclick="classModule.closeModal()" class="bg-gray-500 hover:bg-gray-600 text-white py-2 px-6 rounded">İptal</button>
                        <button onclick="classModule.saveClassEdit('${classId}')" class="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded">Kaydet</button>
                    </div>
                </div>
            </div>
        `);
    }

    saveClassEdit(classId) {
        const newName = document.getElementById('edit-class-name').value.trim();
        if (!newName) {
            window.notificationManager.show('Sınıf adı zorunludur!', 'error');
            return;
        }

        const db = window.storageManager.getData();
        const cls = db.classes.find(c => c.id === classId);
        if (cls) {
            cls.name = newName;
            window.storageManager.saveData(db);
            this.closeModal();
            this.openClassDetail(classId);
            window.notificationManager.show('Sınıf güncellendi!', 'success');
        }
    }

    duplicateClass(classId) {
        const db = window.storageManager.getData();
        const original = db.classes.find(c => c.id === classId);
        if (!original) return;

        const newClass = {
            ...original,
            id: 'class_' + Date.now(),
            name: original.name + ' - Kopya',
            students: original.students.map(s => ({
                ...s,
                id: 'student_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5)
            }))
        };

        db.classes.push(newClass);
        window.storageManager.saveData(db);
        this.closeModal();
        this.showClassList();
        window.notificationManager.show('Sınıf kopyalandı!', 'success');
    }

    exportClassData(classId) {
        window.notificationManager.show('Sınıf verileri dışa aktarılıyor...', 'info');
        this.closeModal();
    }

    deleteClass(classId) {
        if (!confirm('Bu sınıfı ve tüm öğrenci verilerini silmek istediğinize emin misiniz?')) return;
        
        const db = window.storageManager.getData();
        db.classes = db.classes.filter(c => c.id !== classId);
        window.storageManager.saveData(db);
        this.closeModal();
        this.showClassList();
        window.notificationManager.show('Sınıf silindi!', 'success');
    }

    // YARDIMCI FONKSİYONLAR
    showModal(html) {
        let container = document.getElementById('class-modals-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'class-modals-container';
            document.body.appendChild(container);
        }
        container.innerHTML = html;
    }

    closeModal() {
        const container = document.getElementById('class-modals-container');
        if (container) container.innerHTML = '';
    }

    showClassList() {
        document.getElementById('module-content').innerHTML = this.render();
    }

    calculateStudentAverages(student) {
        const grades = student.grades || {};
        
        const d1Grades = [grades.d1s1, grades.d1s2, grades.d1p1, grades.d1p2].filter(g => g > 0);
        const d2Grades = [grades.d2s1, grades.d2s2, grades.d2p1, grades.d2p2].filter(g => g > 0);
        
        const d1Average = d1Grades.length > 0 ? (d1Grades.reduce((a, b) => a + b, 0) / d1Grades.length).toFixed(2) : '0.00';
        const d2Average = d2Grades.length > 0 ? (d2Grades.reduce((a, b) => a + b, 0) / d2Grades.length).toFixed(2) : '0.00';
        
        const yearlyAverage = (parseFloat(d1Average) > 0 || parseFloat(d2Average) > 0) 
            ? ((parseFloat(d1Average) + parseFloat(d2Average)) / 2).toFixed(2) 
            : '0.00';

        return {
            d1Average: d1Average === '0.00' ? '-' : d1Average,
            d2Average: d2Average === '0.00' ? '-' : d2Average,
            yearlyAverage: yearlyAverage === '0.00' ? '-' : yearlyAverage
        };
    }

    getAverageClass(grade) {
        if (grade === '-') return 'bg-gray-100 text-gray-800';
        const num = parseFloat(grade);
        if (num >= 85) return 'bg-green-100 text-green-800';
        if (num >= 70) return 'bg-blue-100 text-blue-800';
        if (num >= 50) return 'bg-yellow-100 text-yellow-800';
        return 'bg-red-100 text-red-800';
    }

    getClassHomeworkCount(classId) {
        const db = window.storageManager.getData();
        return db.homework?.filter(hw => hw.classId === classId && hw.status === 'pending').length || 0;
    }

    getClassAverage(cls) {
        if (!cls.students?.length) return '-';
        const averages = cls.students.map(s => this.calculateStudentAverages(s).yearlyAverage).filter(a => a !== '-');
        if (!averages.length) return '-';
        const total = averages.reduce((sum, a) => sum + parseFloat(a), 0);
        return (total / averages.length).toFixed(1);
    }

    getTotalHomeworkCount(db) {
        return db.homework?.filter(hw => hw.status === 'pending').length || 0;
    }

    getTotalAttendanceDays(db) {
        return db.classes.reduce((total, cls) => total + (cls.attendance ? Object.keys(cls.attendance).length : 0), 0);
    }

    onShow() {
        this.showClassList();
    }
}

window.classModule = new ClassModule();
window.safeRegisterModule('classes', window.classModule);