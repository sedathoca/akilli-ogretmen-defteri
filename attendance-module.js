// Yoklama modülü - TAMAMEN FONKSİYONEL
class AttendanceModule {
    constructor() {
        this.buttonText = '📊 Yoklama';
        this.currentClassId = null;
    }

    render() {
        const db = window.storageManager.getData();
        const classCount = db.classes.length;
        
        return `
            <div class="attendance-module">
                <div class="mb-6 flex justify-between items-center">
                    <h2 class="text-2xl font-bold text-gray-800">Yoklama Sistemi</h2>
                    <button onclick="moduleManager.showWelcomeScreen()" class="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200">← Ana Sayfaya Dön</button>
                </div>
                
                ${classCount === 0 ? this.renderNoClass() : this.renderClassSelection()}
            </div>
        `;
    }

    renderNoClass() {
        return `
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
                <div class="text-4xl mb-4">🏫</div>
                <h3 class="text-xl font-semibold text-yellow-800 mb-2">Sınıf Bulunamadı</h3>
                <p class="text-yellow-600 mb-4">Yoklama almak için önce sınıf oluşturmalısınız</p>
                <button onclick="moduleManager.showModule('classes')" class="bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200">
                    Sınıf Oluştur
                </button>
            </div>
        `;
    }

    renderClassSelection() {
        const db = window.storageManager.getData();
        
        return `
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- SINIF LİSTESİ -->
                <div class="bg-white rounded-lg shadow-sm overflow-hidden">
                    <h3 class="text-xl font-semibold text-gray-700 p-6 border-b">Sınıf Seçimi</h3>
                    <div class="p-6">
                        <div class="space-y-4">
                            ${db.classes.map(cls => `
                                <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition duration-200 cursor-pointer" onclick="attendanceModule.selectClass('${cls.id}')">
                                    <div class="flex justify-between items-center">
                                        <h4 class="font-bold text-lg text-gray-800">${cls.name}</h4>
                                        <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">${cls.students ? cls.students.length : 0} öğrenci</span>
                                    </div>
                                    <p class="text-gray-600 text-sm mt-2">Yoklama almak için tıklayın</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <!-- YOKLAMA ÖNİZLEME -->
                <div class="bg-white rounded-lg shadow-sm overflow-hidden">
                    <h3 class="text-xl font-semibold text-gray-700 p-6 border-b">Yoklama Bilgileri</h3>
                    <div class="p-6">
                        <div class="text-center py-8">
                            <div class="text-4xl mb-4">📊</div>
                            <p class="text-gray-500 font-medium">Yoklama almak için bir sınıf seçin</p>
                            <p class="text-gray-400 text-sm mt-2">Modern yoklama arayüzü ile hızlı ve kolay yoklama alma</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    selectClass(classId) {
        this.currentClassId = classId;
        this.startAttendance();
    }

    startAttendance() {
        const db = window.storageManager.getData();
        const cls = db.classes.find(c => c.id === this.currentClassId);
        
        if (!cls || !cls.students || cls.students.length === 0) {
            window.notificationManager.show('Bu sınıfta öğrenci bulunamadı!', 'error');
            return;
        }

        // Modern yoklama arayüzünü göster
        document.getElementById('module-content').innerHTML = this.renderAttendanceInterface(cls);
        this.initAttendanceSystem(cls);
    }

    renderAttendanceInterface(cls) {
        return `
            <div class="attendance-interface">
                <div class="mb-6 flex justify-between items-center">
                    <div>
                        <h2 class="text-2xl font-bold text-gray-800">📊 Yoklama - ${cls.name}</h2>
                        <p class="text-gray-600">${cls.students.length} öğrenci - ${new Date().toLocaleDateString('tr-TR')}</p>
                    </div>
                    <div class="flex space-x-2">
                        <button onclick="attendanceModule.showClassSelection()" class="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200">← Sınıf Seç</button>
                        <button onclick="attendanceModule.saveAttendance()" class="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200">💾 Kaydet</button>
                    </div>
                </div>

                <!-- İSTATİSTİKLER -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div class="bg-white p-4 rounded-lg shadow-sm border-2 border-green-200 text-center">
                        <div class="text-2xl font-bold text-green-600" id="presentCount">0</div>
                        <div class="text-sm text-green-800">GELEN</div>
                    </div>
                    <div class="bg-white p-4 rounded-lg shadow-sm border-2 border-red-200 text-center">
                        <div class="text-2xl font-bold text-red-600" id="absentCount">0</div>
                        <div class="text-sm text-red-800">GELMEYEN</div>
                    </div>
                    <div class="bg-white p-4 rounded-lg shadow-sm border-2 border-yellow-200 text-center">
                        <div class="text-2xl font-bold text-yellow-600" id="remainingCount">${cls.students.length}</div>
                        <div class="text-sm text-yellow-800">BEKLEYEN</div>
                    </div>
                </div>

                <!-- YOKLAMA KONTROLLERİ -->
                <div class="bg-white p-4 rounded-lg shadow-sm mb-6">
                    <div class="flex flex-wrap gap-2 justify-center">
                        <button onclick="attendanceModule.markAllPresent()" class="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200">✅ Tümünü Geldi Yap</button>
                        <button onclick="attendanceModule.markAllAbsent()" class="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200">❌ Tümünü Gelmedi Yap</button>
                        <button onclick="attendanceModule.resetAttendance()" class="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200">🔄 Sıfırla</button>
                        <button onclick="attendanceModule.showAbsentList()" class="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200">📋 Gelmedikler Listesi</button>
                    </div>
                </div>

                <!-- ÖĞRENCİ LİSTESİ -->
                <div class="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div class="p-4 border-b bg-gray-50">
                        <h3 class="text-lg font-semibold text-gray-800">Öğrenci Listesi</h3>
                    </div>
                    <div class="student-list-container" style="max-height: 60vh; overflow-y: auto;">
                        <div class="student-list grid grid-cols-1 md:grid-cols-2 gap-4 p-4" id="attendanceStudentList">
                            ${this.renderAttendanceStudentList(cls)}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderAttendanceStudentList(cls) {
        // Öğrencileri numaraya göre sırala
        const sortedStudents = [...cls.students].sort((a, b) => {
            return a.no.localeCompare(b.no, undefined, { numeric: true });
        });

        return sortedStudents.map(student => `
            <div class="student-item bg-gray-50 border border-gray-200 rounded-lg p-4 transition duration-200 hover:shadow-md" id="attendance-student-${student.id}">
                <div class="flex justify-between items-center">
                    <div class="flex-1">
                        <div class="font-semibold text-gray-800">${student.name}</div>
                        <div class="text-sm text-gray-600">No: ${student.no}</div>
                    </div>
                    <div class="flex space-x-2">
                        <button onclick="attendanceModule.markStudentPresent('${student.id}')" class="present-btn bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200 transform hover:scale-105">
                            ✅
                        </button>
                        <button onclick="attendanceModule.markStudentAbsent('${student.id}')" class="absent-btn bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200 transform hover:scale-105">
                            ❌
                        </button>
                    </div>
                </div>
                <div class="mt-2 text-xs text-gray-500 status-text" id="status-${student.id}">
                    🔄 Bekliyor
                </div>
            </div>
        `).join('');
    }

    initAttendanceSystem(cls) {
        // Yoklama verilerini başlat
        this.attendanceData = {
            date: new Date().toISOString().split('T')[0],
            classId: this.currentClassId,
            records: {}
        };

        // Tüm öğrencileri bekleyen durumda işaretle
        cls.students.forEach(student => {
            this.attendanceData.records[student.id] = null; // null = bekliyor
        });

        this.updateStats();
    }

    markStudentPresent(studentId) {
        this.attendanceData.records[studentId] = true;
        this.updateStudentDisplay(studentId, true);
        this.updateStats();
    }

    markStudentAbsent(studentId) {
        this.attendanceData.records[studentId] = false;
        this.updateStudentDisplay(studentId, false);
        this.updateStats();
    }

    updateStudentDisplay(studentId, isPresent) {
        const studentElement = document.getElementById(`attendance-student-${studentId}`);
        const statusElement = document.getElementById(`status-${studentId}`);
        
        if (isPresent) {
            studentElement.classList.add('bg-green-50', 'border-green-300');
            studentElement.classList.remove('bg-gray-50', 'bg-red-50', 'border-gray-200', 'border-red-300');
            statusElement.innerHTML = '✅ <span class="text-green-600">Geldi</span>';
        } else {
            studentElement.classList.add('bg-red-50', 'border-red-300');
            studentElement.classList.remove('bg-gray-50', 'bg-green-50', 'border-gray-200', 'border-green-300');
            statusElement.innerHTML = '❌ <span class="text-red-600">Gelmedi</span>';
        }
    }

    updateStats() {
        if (!this.attendanceData) return;

        const records = Object.values(this.attendanceData.records);
        const presentCount = records.filter(status => status === true).length;
        const absentCount = records.filter(status => status === false).length;
        const remainingCount = records.filter(status => status === null).length;

        document.getElementById('presentCount').textContent = presentCount;
        document.getElementById('absentCount').textContent = absentCount;
        document.getElementById('remainingCount').textContent = remainingCount;
    }

    markAllPresent() {
        if (!this.attendanceData) return;
        
        Object.keys(this.attendanceData.records).forEach(studentId => {
            if (this.attendanceData.records[studentId] === null) {
                this.markStudentPresent(studentId);
            }
        });
    }

    markAllAbsent() {
        if (!this.attendanceData) return;
        
        Object.keys(this.attendanceData.records).forEach(studentId => {
            if (this.attendanceData.records[studentId] === null) {
                this.markStudentAbsent(studentId);
            }
        });
    }

    resetAttendance() {
        if (confirm('Yoklamayı sıfırlamak istediğinizden emin misiniz?')) {
            this.initAttendanceSystem(window.storageManager.getData().classes.find(c => c.id === this.currentClassId));
        }
    }

    showAbsentList() {
        if (!this.attendanceData) return;

        const absentStudents = Object.keys(this.attendanceData.records)
            .filter(studentId => this.attendanceData.records[studentId] === false)
            .map(studentId => {
                const cls = window.storageManager.getData().classes.find(c => c.id === this.currentClassId);
                return cls.students.find(s => s.id === studentId);
            });

        if (absentStudents.length === 0) {
            window.notificationManager.show('🎉 Tüm öğrenciler geldi!', 'success');
            return;
        }

        const absentListHTML = `
            <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
                    <div class="p-6 border-b">
                        <h3 class="text-xl font-semibold text-gray-800">❌ Gelmedikler Listesi</h3>
                    </div>
                    <div class="p-6 max-h-96 overflow-y-auto">
                        <div class="space-y-3">
                            ${absentStudents.map(student => `
                                <div class="flex justify-between items-center p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <div>
                                        <div class="font-semibold text-red-800">${student.name}</div>
                                        <div class="text-sm text-red-600">No: ${student.no}</div>
                                    </div>
                                    <button onclick="attendanceModule.markStudentPresentFromList('${student.id}')" class="bg-green-500 hover:bg-green-600 text-white font-medium py-1 px-3 rounded text-sm transition duration-200">
                                        Geldi Yap
                                    </button>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div class="p-4 border-t bg-gray-50 flex justify-end">
                        <button onclick="attendanceModule.closeAbsentList()" class="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded transition duration-200">
                            Kapat
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', absentListHTML);
    }

    markStudentPresentFromList(studentId) {
        this.markStudentPresent(studentId);
        this.closeAbsentList();
        this.showAbsentList(); // Listeyi yenile
    }

    closeAbsentList() {
        const modal = document.querySelector('.fixed.inset-0');
        if (modal) {
            modal.remove();
        }
    }

    showClassSelection() {
        document.getElementById('module-content').innerHTML = this.render();
    }

    saveAttendance() {
        if (!this.attendanceData) {
            window.notificationManager.show('Yoklama verisi bulunamadı!', 'error');
            return;
        }

        // Tüm öğrenciler işaretlenmiş mi kontrol et
        const remainingCount = Object.values(this.attendanceData.records).filter(status => status === null).length;
        if (remainingCount > 0) {
            if (!confirm(`${remainingCount} öğrenci henüz yoklaması yapılmamış. Yine de kaydetmek istiyor musunuz?`)) {
                return;
            }
        }

        const db = window.storageManager.getData();
        const cls = db.classes.find(c => c.id === this.currentClassId);
        
        if (!cls.attendance) {
            cls.attendance = {};
        }

        // Yoklamayı kaydet
        cls.attendance[this.attendanceData.date] = this.attendanceData.records;
        
        window.storageManager.saveData(db);
        window.notificationManager.show('✅ Yoklama başarıyla kaydedildi!', 'success');
        
        // Sınıf seçim ekranına dön
        this.showClassSelection();
    }

    onShow() {
        console.log('Yoklama modülü açıldı');
    }
}

window.attendanceModule = new AttendanceModule();
// ... (tüm mevcut kod aynı kalacak) ...

// SON SATIRI DEĞİŞTİR:
window.safeRegisterModule('attendance', window.attendanceModule);