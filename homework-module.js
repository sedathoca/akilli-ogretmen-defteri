// Ödev modülü - YENİLENMİŞ ve TAM FONKSİYONEL
class HomeworkModule {
    constructor() {
        this.buttonText = '📝 Ödev Takip';
        this.currentFilters = {
            status: 'all',
            class: 'all',
            priority: 'all'
        };
    }

    render() {
        const db = window.storageManager.getData();
        const homeworkCount = db.homework ? db.homework.length : 0;
        const pendingCount = db.homework ? db.homework.filter(hw => hw.status === 'pending').length : 0;
        const completedCount = db.homework ? db.homework.filter(hw => hw.status === 'completed').length : 0;
        const lateCount = db.homework ? db.homework.filter(hw => hw.status === 'late').length : 0;
        
        return `
            <div class="homework-module">
                <div class="mb-6 flex justify-between items-center">
                    <h2 class="text-2xl font-bold text-gray-800">📝 Ödev Takip Sistemi</h2>
                    <div class="flex space-x-2">
                        <button onclick="homeworkModule.showBulkAssignment()" class="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200">
                            📚 Toplu Ödev Ver
                        </button>
                        <button onclick="moduleManager.showWelcomeScreen()" class="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200">
                            ← Ana Sayfaya Dön
                        </button>
                    </div>
                </div>

                <!-- HIZLI İSTATİSTİKLER ve FİLTRELER -->
                <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
                    <!-- İSTATİSTİK KARTLARI -->
                    <div class="bg-white p-6 rounded-lg shadow-sm border-2 border-blue-200">
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="text-2xl font-bold text-blue-600">${homeworkCount}</div>
                                <div class="text-sm text-blue-800">Toplam Ödev</div>
                            </div>
                            <div class="text-3xl text-blue-500">📚</div>
                        </div>
                    </div>
                    
                    <div class="bg-white p-6 rounded-lg shadow-sm border-2 border-yellow-200">
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="text-2xl font-bold text-yellow-600">${pendingCount}</div>
                                <div class="text-sm text-yellow-800">Bekleyen</div>
                            </div>
                            <div class="text-3xl text-yellow-500">⏰</div>
                        </div>
                    </div>
                    
                    <div class="bg-white p-6 rounded-lg shadow-sm border-2 border-green-200">
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="text-2xl font-bold text-green-600">${completedCount}</div>
                                <div class="text-sm text-green-800">Tamamlanan</div>
                            </div>
                            <div class="text-3xl text-green-500">✅</div>
                        </div>
                    </div>
                    
                    <div class="bg-white p-6 rounded-lg shadow-sm border-2 border-red-200">
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="text-2xl font-bold text-red-600">${lateCount}</div>
                                <div class="text-sm text-red-800">Geciken</div>
                            </div>
                            <div class="text-3xl text-red-500">⚠️</div>
                        </div>
                    </div>
                </div>

                <!-- FİLTRE ve ARAMA BÖLÜMÜ -->
                <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Durum</label>
                            <select id="hw-filter-status" onchange="homeworkModule.applyFilters()" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="all">Tüm Durumlar</option>
                                <option value="pending">⏰ Bekleyen</option>
                                <option value="completed">✅ Tamamlanan</option>
                                <option value="late">⚠️ Geciken</option>
                            </select>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Sınıf</label>
                            <select id="hw-filter-class" onchange="homeworkModule.applyFilters()" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="all">Tüm Sınıflar</option>
                                ${db.classes.map(cls => `
                                    <option value="${cls.id}">${cls.name}</option>
                                `).join('')}
                            </select>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Öncelik</label>
                            <select id="hw-filter-priority" onchange="homeworkModule.applyFilters()" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="all">Tüm Öncelikler</option>
                                <option value="high">🔴 Yüksek</option>
                                <option value="medium">🟡 Orta</option>
                                <option value="low">🟢 Düşük</option>
                            </select>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Arama</label>
                            <input type="text" id="hw-search" placeholder="Ödev ara..." 
                                   onkeyup="homeworkModule.applyFilters()"
                                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                    </div>
                    
                    <!-- HIZLI FİLTRE BUTONLARI -->
                    <div class="flex flex-wrap gap-2 mt-4">
                        <button onclick="homeworkModule.setQuickFilter('status', 'pending')" class="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 text-sm px-3 py-1 rounded-full transition duration-200">
                            ⏰ Bekleyen
                        </button>
                        <button onclick="homeworkModule.setQuickFilter('status', 'late')" class="bg-red-100 hover:bg-red-200 text-red-800 text-sm px-3 py-1 rounded-full transition duration-200">
                            ⚠️ Geciken
                        </button>
                        <button onclick="homeworkModule.setQuickFilter('priority', 'high')" class="bg-red-100 hover:bg-red-200 text-red-800 text-sm px-3 py-1 rounded-full transition duration-200">
                            🔴 Acil
                        </button>
                        <button onclick="homeworkModule.clearFilters()" class="bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm px-3 py-1 rounded-full transition duration-200">
                            🗑️ Filtreleri Temizle
                        </button>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <!-- YENİ ÖDEV FORMU -->
                    <div class="lg:col-span-1">
                        <div class="bg-white rounded-lg shadow-sm overflow-hidden sticky top-4">
                            <div class="p-6 border-b">
                                <h3 class="text-xl font-semibold text-gray-800">➕ Yeni Ödev Ekle</h3>
                                <p class="text-gray-600 text-sm mt-1">Hızlı ödev oluşturma</p>
                            </div>
                            <div class="p-6">
                                <form id="homework-form" class="space-y-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Ödev Başlığı *</label>
                                        <input type="text" id="hw-title" 
                                               class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                               placeholder="Ödev konusu" required>
                                    </div>
                                    
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                                        <textarea id="hw-description" rows="3"
                                                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                  placeholder="Ödev detayları..."></textarea>
                                    </div>

                                    <div class="grid grid-cols-2 gap-4">
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-1">Teslim Tarihi *</label>
                                            <input type="date" id="hw-dueDate" 
                                                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                   required>
                                        </div>
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-1">Öncelik</label>
                                            <select id="hw-priority" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                                <option value="low">🟢 Düşük</option>
                                                <option value="medium" selected>🟡 Orta</option>
                                                <option value="high">🔴 Yüksek</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Ders / Konu</label>
                                        <input type="text" id="hw-subject" 
                                               class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                               placeholder="Matematik, Türkçe...">
                                    </div>

                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Sınıf *</label>
                                        <select id="hw-class" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                                            <option value="">Sınıf seçin</option>
                                            ${db.classes.map(cls => `
                                                <option value="${cls.id}">${cls.name}</option>
                                            `).join('')}
                                        </select>
                                    </div>

                                    <div class="flex space-x-3 pt-2">
                                        <button type="button" onclick="homeworkModule.clearForm()" class="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200">
                                            Temizle
                                        </button>
                                        <button type="submit" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200">
                                            📚 Ödev Ekle
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    <!-- ÖDEV LİSTESİ -->
                    <div class="lg:col-span-3">
                        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
                            <div class="p-6 border-b flex justify-between items-center">
                                <div>
                                    <h3 class="text-xl font-semibold text-gray-800">📋 Ödev Listesi</h3>
                                    <p class="text-gray-600 text-sm mt-1" id="homework-count-text">
                                        ${homeworkCount} ödev bulundu
                                    </p>
                                </div>
                                <div class="flex items-center space-x-2">
                                    <button onclick="homeworkModule.exportHomework()" class="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 text-sm">
                                        📤 Dışa Aktar
                                    </button>
                                    <button onclick="homeworkModule.bulkComplete()" class="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 text-sm">
                                        ✅ Toplu Tamamla
                                    </button>
                                </div>
                            </div>
                            <div class="p-6">
                                <div id="homework-list-container">
                                    ${this.renderHomeworkList()}
                                </div>
                            </div>
                        </div>

                        <!-- ÖDEV İSTATİSTİKLERİ -->
                        <div class="mt-6 bg-white rounded-lg shadow-sm p-6">
                            <h3 class="text-xl font-semibold text-gray-800 mb-4">📊 Ödev İstatistikleri</h3>
                            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                                ${this.renderHomeworkStats()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderHomeworkList() {
        const db = window.storageManager.getData();
        let homeworkList = db.homework || [];
        
        // Filtreleme uygula
        homeworkList = this.applyHomeworkFilters(homeworkList);
        
        if (homeworkList.length === 0) {
            return `
                <div class="text-center py-12">
                    <div class="text-6xl mb-4">📚</div>
                    <p class="text-gray-500 font-medium mb-2">Henüz ödev eklenmemiş</p>
                    <p class="text-gray-400 text-sm mb-4">İlk ödevinizi oluşturmak için soldaki formu kullanın</p>
                    <button onclick="homeworkModule.clearFilters()" class="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200">
                        Tüm Ödevleri Göster
                    </button>
                </div>
            `;
        }

        // Tarihe göre sırala (yakın teslim tarihi önce)
        homeworkList.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

        return `
            <div class="space-y-4">
                ${homeworkList.map(hw => this.renderHomeworkItem(hw)).join('')}
            </div>
        `;
    }

    renderHomeworkItem(hw) {
        const db = window.storageManager.getData();
        const classInfo = db.classes.find(c => c.id === hw.classId);
        const dueDate = new Date(hw.dueDate);
        const today = new Date();
        const isLate = dueDate < today && hw.status !== 'completed';
        const daysLeft = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
        
        let statusColor = 'bg-yellow-100 text-yellow-800 border-yellow-200';
        let statusIcon = '⏰';
        let statusText = 'Bekliyor';
        
        if (hw.status === 'completed') {
            statusColor = 'bg-green-100 text-green-800 border-green-200';
            statusIcon = '✅';
            statusText = 'Tamamlandı';
        } else if (isLate) {
            statusColor = 'bg-red-100 text-red-800 border-red-200';
            statusIcon = '⚠️';
            statusText = 'Geciken';
        } else if (daysLeft <= 2) {
            statusColor = 'bg-orange-100 text-orange-800 border-orange-200';
            statusIcon = '🔥';
            statusText = 'Yaklaşıyor';
        }

        let priorityColor = 'bg-gray-100 text-gray-800';
        let priorityIcon = '🟢';
        
        if (hw.priority === 'medium') {
            priorityColor = 'bg-blue-100 text-blue-800';
            priorityIcon = '🟡';
        } else if (hw.priority === 'high') {
            priorityColor = 'bg-red-100 text-red-800';
            priorityIcon = '🔴';
        }

        const timeInfo = this.getTimeInfo(hw.dueDate, hw.status);

        return `
            <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition duration-200 homework-item" data-id="${hw.id}">
                <div class="flex justify-between items-start mb-3">
                    <div class="flex-1">
                        <div class="flex items-start space-x-3">
                            <div class="flex-shrink-0 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-lg">
                                📚
                            </div>
                            <div class="flex-1">
                                <h4 class="font-semibold text-gray-800 text-lg mb-1">${hw.title}</h4>
                                <p class="text-gray-600 text-sm">${hw.description || 'Açıklama yok'}</p>
                                
                                <div class="flex flex-wrap items-center gap-2 mt-2">
                                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColor}">
                                        ${statusIcon} ${statusText}
                                    </span>
                                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${priorityColor}">
                                        ${priorityIcon} ${hw.priority === 'high' ? 'Yüksek' : hw.priority === 'medium' ? 'Orta' : 'Düşük'}
                                    </span>
                                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                        🏫 ${classInfo?.name || 'Sınıf Yok'}
                                    </span>
                                    ${hw.subject ? `
                                        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                            📖 ${hw.subject}
                                        </span>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="flex justify-between items-center pt-3 border-t border-gray-100">
                    <div class="flex items-center space-x-4 text-sm text-gray-600">
                        <span class="flex items-center space-x-1">
                            <span>📅</span>
                            <span>${dueDate.toLocaleDateString('tr-TR')}</span>
                        </span>
                        <span class="flex items-center space-x-1 ${timeInfo.color} font-medium">
                            <span>${timeInfo.icon}</span>
                            <span>${timeInfo.text}</span>
                        </span>
                        <span class="flex items-center space-x-1">
                            <span>👤</span>
                            <span>${hw.assignedBy || 'Öğretmen'}</span>
                        </span>
                    </div>
                    <div class="flex space-x-2">
                        <button onclick="homeworkModule.toggleHomeworkStatus('${hw.id}')" class="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-3 rounded-lg transition duration-200 text-sm">
                            ${hw.status === 'completed' ? '❌ Geri Al' : '✅ Tamamla'}
                        </button>
                        <button onclick="homeworkModule.editHomework('${hw.id}')" class="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-3 rounded-lg transition duration-200 text-sm">
                            ✏️ Düzenle
                        </button>
                        <button onclick="homeworkModule.showHomeworkDetail('${hw.id}')" class="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-3 rounded-lg transition duration-200 text-sm">
                            👁️ Detay
                        </button>
                        <button onclick="homeworkModule.deleteHomework('${hw.id}')" class="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-3 rounded-lg transition duration-200 text-sm">
                            🗑️ Sil
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    renderHomeworkStats() {
        const db = window.storageManager.getData();
        const homeworkList = db.homework || [];
        
        const stats = {
            total: homeworkList.length,
            pending: homeworkList.filter(hw => hw.status === 'pending').length,
            completed: homeworkList.filter(hw => hw.status === 'completed').length,
            late: homeworkList.filter(hw => {
                const dueDate = new Date(hw.dueDate);
                const today = new Date();
                return dueDate < today && hw.status !== 'completed';
            }).length,
            highPriority: homeworkList.filter(hw => hw.priority === 'high').length,
            thisWeek: homeworkList.filter(hw => {
                const dueDate = new Date(hw.dueDate);
                const today = new Date();
                const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
                return dueDate <= nextWeek && hw.status === 'pending';
            }).length
        };

        return `
            <div class="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div class="text-2xl font-bold text-blue-600">${stats.total}</div>
                <div class="text-sm text-blue-800">Toplam Ödev</div>
            </div>
            <div class="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div class="text-2xl font-bold text-yellow-600">${stats.pending}</div>
                <div class="text-sm text-yellow-800">Bekleyen</div>
            </div>
            <div class="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <div class="text-2xl font-bold text-green-600">${stats.completed}</div>
                <div class="text-sm text-green-800">Tamamlanan</div>
            </div>
            <div class="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                <div class="text-2xl font-bold text-red-600">${stats.late}</div>
                <div class="text-sm text-red-800">Geciken</div>
            </div>
        `;
    }

    getTimeInfo(dueDateString, status) {
        if (status === 'completed') {
            return { icon: '✅', text: 'Tamamlandı', color: 'text-green-600' };
        }
        
        const dueDate = new Date(dueDateString);
        const today = new Date();
        const daysLeft = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
        
        if (daysLeft < 0) {
            return { icon: '⚠️', text: `${Math.abs(daysLeft)} gün gecikti`, color: 'text-red-600' };
        } else if (daysLeft === 0) {
            return { icon: '🔥', text: 'Bugün teslim', color: 'text-orange-600' };
        } else if (daysLeft === 1) {
            return { icon: '⏰', text: 'Yarın teslim', color: 'text-orange-600' };
        } else if (daysLeft <= 3) {
            return { icon: '⏰', text: `${daysLeft} gün kaldı`, color: 'text-yellow-600' };
        } else {
            return { icon: '📅', text: `${daysLeft} gün kaldı`, color: 'text-blue-600' };
        }
    }

    // === FİLTRELEME SİSTEMİ ===
    applyHomeworkFilters(homeworkList) {
        const statusFilter = document.getElementById('hw-filter-status')?.value || this.currentFilters.status;
        const classFilter = document.getElementById('hw-filter-class')?.value || this.currentFilters.class;
        const priorityFilter = document.getElementById('hw-filter-priority')?.value || this.currentFilters.priority;
        const searchTerm = document.getElementById('hw-search')?.value.toLowerCase() || '';

        let filtered = homeworkList;

        // Durum filtresi
        if (statusFilter !== 'all') {
            filtered = filtered.filter(hw => hw.status === statusFilter);
        }

        // Sınıf filtresi
        if (classFilter !== 'all') {
            filtered = filtered.filter(hw => hw.classId === classFilter);
        }

        // Öncelik filtresi
        if (priorityFilter !== 'all') {
            filtered = filtered.filter(hw => hw.priority === priorityFilter);
        }

        // Arama filtresi
        if (searchTerm) {
            filtered = filtered.filter(hw => 
                hw.title.toLowerCase().includes(searchTerm) ||
                (hw.description && hw.description.toLowerCase().includes(searchTerm)) ||
                (hw.subject && hw.subject.toLowerCase().includes(searchTerm))
            );
        }

        // Ödev sayısını güncelle
        const countText = document.getElementById('homework-count-text');
        if (countText) {
            countText.textContent = `${filtered.length} ödev bulundu`;
        }

        return filtered;
    }

    applyFilters() {
        const homeworkListContainer = document.getElementById('homework-list-container');
        if (homeworkListContainer) {
            homeworkListContainer.innerHTML = this.renderHomeworkList();
        }
    }

    setQuickFilter(type, value) {
        if (type === 'status') {
            document.getElementById('hw-filter-status').value = value;
        } else if (type === 'priority') {
            document.getElementById('hw-filter-priority').value = value;
        }
        this.applyFilters();
    }

    clearFilters() {
        document.getElementById('hw-filter-status').value = 'all';
        document.getElementById('hw-filter-class').value = 'all';
        document.getElementById('hw-filter-priority').value = 'all';
        document.getElementById('hw-search').value = '';
        this.applyFilters();
    }

    // === TEMEL FONKSİYONLAR ===
    onShow() {
        console.log('Ödev modülü açıldı');
        this.initializeForm();
        this.checkLateHomeworks();
    }

    initializeForm() {
        const form = document.getElementById('homework-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.createHomework();
            });
        }
        
        // Bugünün tarihini varsayılan yap
        const today = new Date().toISOString().split('T')[0];
        const dueDateInput = document.getElementById('hw-dueDate');
        if (dueDateInput) {
            dueDateInput.min = today;
            dueDateInput.value = today;
        }
    }

    createHomework() {
        const title = document.getElementById('hw-title').value.trim();
        const description = document.getElementById('hw-description').value.trim();
        const dueDate = document.getElementById('hw-dueDate').value;
        const priority = document.getElementById('hw-priority').value;
        const subject = document.getElementById('hw-subject').value.trim();
        const classId = document.getElementById('hw-class').value;

        // Validasyon
        if (!title || !dueDate || !classId) {
            window.notificationManager.show('Lütfen zorunlu alanları doldurun!', 'error');
            return;
        }

        const db = window.storageManager.getData();
        const cls = db.classes.find(c => c.id === classId);
        
        if (!cls) {
            window.notificationManager.show('Sınıf bulunamadı!', 'error');
            return;
        }

        const newHomework = {
            id: 'hw_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            title,
            description,
            dueDate,
            priority,
            subject,
            classId,
            className: cls.name,
            status: 'pending',
            assignedDate: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            completedAt: null,
            assignedBy: db.user?.fullname || 'Öğretmen'
        };

        if (!db.homework) db.homework = [];
        db.homework.push(newHomework);
        
        if (window.storageManager.saveData(db)) {
            window.notificationManager.show(`✅ "${title}" ödevi başarıyla oluşturuldu!`, 'success');
            this.clearForm();
            this.refreshHomeworkList();
        } else {
            window.notificationManager.show('❌ Ödev eklenirken hata oluştu!', 'error');
        }
    }

    clearForm() {
        document.getElementById('hw-title').value = '';
        document.getElementById('hw-description').value = '';
        document.getElementById('hw-priority').value = 'medium';
        document.getElementById('hw-subject').value = '';
        document.getElementById('hw-class').value = '';
        
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('hw-dueDate').value = today;
    }

    toggleHomeworkStatus(homeworkId) {
        const db = window.storageManager.getData();
        const homework = db.homework.find(hw => hw.id === homeworkId);
        
        if (homework) {
            if (homework.status === 'completed') {
                homework.status = 'pending';
                homework.completedAt = null;
                window.notificationManager.show('📝 Ödev beklemeye alındı!', 'info');
            } else {
                homework.status = 'completed';
                homework.completedAt = new Date().toISOString();
                window.notificationManager.show('🎉 Ödev tamamlandı olarak işaretlendi!', 'success');
            }
            
            window.storageManager.saveData(db);
            this.refreshHomeworkList();
        }
    }

    deleteHomework(homeworkId) {
        if (!confirm('Bu ödevi silmek istediğinize emin misiniz?')) {
            return;
        }
        
        const db = window.storageManager.getData();
        db.homework = db.homework.filter(hw => hw.id !== homeworkId);
        
        if (window.storageManager.saveData(db)) {
            window.notificationManager.show('🗑️ Ödev silindi!', 'success');
            this.refreshHomeworkList();
        }
    }

    refreshHomeworkList() {
        const homeworkListContainer = document.getElementById('homework-list-container');
        if (homeworkListContainer) {
            homeworkListContainer.innerHTML = this.renderHomeworkList();
        }
    }

    // === YENİ ÖZELLİKLER ===
    showBulkAssignment() {
        const db = window.storageManager.getData();
        
        const modalHTML = `
            <div id="bulk-assignment-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                    <div class="p-6 border-b">
                        <h3 class="text-xl font-semibold text-gray-800">📚 Toplu Ödev Verme</h3>
                        <p class="text-gray-600 text-sm mt-1">Birden fazla sınıfa aynı ödevi verin</p>
                    </div>
                    
                    <div class="p-6">
                        <form id="bulk-homework-form" class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Ödev Başlığı *</label>
                                <input type="text" id="bulk-hw-title" 
                                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                       placeholder="Ödev konusu" required>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                                <textarea id="bulk-hw-description" rows="3"
                                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                          placeholder="Ödev detayları..."></textarea>
                            </div>

                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Teslim Tarihi *</label>
                                    <input type="date" id="bulk-hw-dueDate" 
                                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                           required>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Öncelik</label>
                                    <select id="bulk-hw-priority" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="low">🟢 Düşük</option>
                                        <option value="medium" selected>🟡 Orta</option>
                                        <option value="high">🔴 Yüksek</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Ders / Konu</label>
                                <input type="text" id="bulk-hw-subject" 
                                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                       placeholder="Matematik, Türkçe...">
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Sınıflar *</label>
                                <div class="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                                    ${db.classes.map(cls => `
                                        <label class="flex items-center space-x-2 p-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                                            <input type="checkbox" value="${cls.id}" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                                            <span class="text-sm text-gray-700">${cls.name}</span>
                                            <span class="text-xs text-gray-500">(${cls.students ? cls.students.length : 0} öğr.)</span>
                                        </label>
                                    `).join('')}
                                </div>
                            </div>
                        </form>
                    </div>

                    <div class="p-6 border-t bg-gray-50 flex justify-end space-x-3">
                        <button onclick="homeworkModule.closeBulkAssignment()" class="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded-lg transition duration-200">
                            İptal
                        </button>
                        <button onclick="homeworkModule.saveBulkHomework()" class="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200">
                            📚 Tümüne Ödev Ver
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Eski modalı temizle
        const existingModal = document.getElementById('bulk-assignment-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // Yeni modalı ekle
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Teslim tarihini bugün olarak ayarla
        const today = new Date().toISOString().split('T')[0];
        const dueDateInput = document.getElementById('bulk-hw-dueDate');
        if (dueDateInput) {
            dueDateInput.min = today;
            dueDateInput.value = today;
        }
    }

    closeBulkAssignment() {
        const modal = document.getElementById('bulk-assignment-modal');
        if (modal) {
            modal.remove();
        }
    }

    saveBulkHomework() {
        const title = document.getElementById('bulk-hw-title').value.trim();
        const description = document.getElementById('bulk-hw-description').value.trim();
        const dueDate = document.getElementById('bulk-hw-dueDate').value;
        const priority = document.getElementById('bulk-hw-priority').value;
        const subject = document.getElementById('bulk-hw-subject').value.trim();

        // Seçili sınıfları al
        const selectedClasses = Array.from(document.querySelectorAll('#bulk-assignment-modal input[type="checkbox"]:checked'))
            .map(checkbox => checkbox.value);

        if (!title || !dueDate || selectedClasses.length === 0) {
            window.notificationManager.show('Lütfen zorunlu alanları doldurun ve en az bir sınıf seçin!', 'error');
            return;
        }

        const db = window.storageManager.getData();
        let addedCount = 0;

        selectedClasses.forEach(classId => {
            const cls = db.classes.find(c => c.id === classId);
            if (cls) {
                const newHomework = {
                    id: 'hw_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9) + '_' + classId,
                    title,
                    description,
                    dueDate,
                    priority,
                    subject,
                    classId,
                    className: cls.name,
                    status: 'pending',
                    assignedDate: new Date().toISOString(),
                    createdAt: new Date().toISOString(),
                    completedAt: null,
                    assignedBy: db.user?.fullname || 'Öğretmen',
                    isBulk: true
                };

                if (!db.homework) db.homework = [];
                db.homework.push(newHomework);
                addedCount++;
            }
        });

        if (window.storageManager.saveData(db)) {
            window.notificationManager.show(`✅ "${title}" ödevi ${addedCount} sınıfa başarıyla verildi!`, 'success');
            this.closeBulkAssignment();
            this.refreshHomeworkList();
        }
    }

    bulkComplete() {
        const db = window.storageManager.getData();
        const pendingHomeworks = db.homework.filter(hw => hw.status === 'pending');
        
        if (pendingHomeworks.length === 0) {
            window.notificationManager.show('Tamamlanacak bekleyen ödev bulunamadı!', 'info');
            return;
        }

        if (confirm(`${pendingHomeworks.length} bekleyen ödevi toplu olarak tamamlandı olarak işaretlemek istiyor musunuz?`)) {
            const today = new Date().toISOString();
            pendingHomeworks.forEach(hw => {
                hw.status = 'completed';
                hw.completedAt = today;
            });
            
            window.storageManager.saveData(db);
            window.notificationManager.show(`✅ ${pendingHomeworks.length} ödev tamamlandı olarak işaretlendi!`, 'success');
            this.refreshHomeworkList();
        }
    }

    editHomework(homeworkId) {
        const db = window.storageManager.getData();
        const homework = db.homework.find(hw => hw.id === homeworkId);
        
        if (!homework) {
            window.notificationManager.show('Ödev bulunamadı!', 'error');
            return;
        }

        // Düzenleme modalı göster
        const modalHTML = `
            <div id="edit-homework-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                    <div class="p-6 border-b">
                        <h3 class="text-xl font-semibold text-gray-800">✏️ Ödev Düzenle</h3>
                    </div>
                    
                    <div class="p-6">
                        <form id="edit-homework-form" class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Ödev Başlığı *</label>
                                <input type="text" id="edit-hw-title" value="${homework.title}"
                                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                       required>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                                <textarea id="edit-hw-description" rows="3"
                                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                          placeholder="Ödev detayları...">${homework.description || ''}</textarea>
                            </div>

                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Teslim Tarihi *</label>
                                    <input type="date" id="edit-hw-dueDate" value="${homework.dueDate}"
                                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                           required>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Öncelik</label>
                                    <select id="edit-hw-priority" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="low" ${homework.priority === 'low' ? 'selected' : ''}>🟢 Düşük</option>
                                        <option value="medium" ${homework.priority === 'medium' ? 'selected' : ''}>🟡 Orta</option>
                                        <option value="high" ${homework.priority === 'high' ? 'selected' : ''}>🔴 Yüksek</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Ders / Konu</label>
                                <input type="text" id="edit-hw-subject" value="${homework.subject || ''}"
                                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                       placeholder="Matematik, Türkçe...">
                            </div>
                        </form>
                    </div>

                    <div class="p-6 border-t bg-gray-50 flex justify-end space-x-3">
                        <button onclick="homeworkModule.closeEditModal()" class="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded-lg transition duration-200">
                            İptal
                        </button>
                        <button onclick="homeworkModule.saveEditedHomework('${homeworkId}')" class="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200">
                            💾 Kaydet
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Eski modalı temizle
        const existingModal = document.getElementById('edit-homework-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // Yeni modalı ekle
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    closeEditModal() {
        const modal = document.getElementById('edit-homework-modal');
        if (modal) {
            modal.remove();
        }
    }

    saveEditedHomework(homeworkId) {
        const title = document.getElementById('edit-hw-title').value.trim();
        const description = document.getElementById('edit-hw-description').value.trim();
        const dueDate = document.getElementById('edit-hw-dueDate').value;
        const priority = document.getElementById('edit-hw-priority').value;
        const subject = document.getElementById('edit-hw-subject').value.trim();

        if (!title || !dueDate) {
            window.notificationManager.show('Lütfen zorunlu alanları doldurun!', 'error');
            return;
        }

        const db = window.storageManager.getData();
        const homework = db.homework.find(hw => hw.id === homeworkId);
        
        if (homework) {
            homework.title = title;
            homework.description = description;
            homework.dueDate = dueDate;
            homework.priority = priority;
            homework.subject = subject;
            homework.updatedAt = new Date().toISOString();
            
            window.storageManager.saveData(db);
            window.notificationManager.show('✅ Ödev başarıyla güncellendi!', 'success');
            this.closeEditModal();
            this.refreshHomeworkList();
        }
    }

    showHomeworkDetail(homeworkId) {
        const db = window.storageManager.getData();
        const homework = db.homework.find(hw => hw.id === homeworkId);
        const classInfo = db.classes.find(c => c.id === homework.classId);
        
        if (!homework) {
            window.notificationManager.show('Ödev bulunamadı!', 'error');
            return;
        }

        const dueDate = new Date(homework.dueDate);
        const assignedDate = new Date(homework.assignedDate);
        const timeInfo = this.getTimeInfo(homework.dueDate, homework.status);

        const modalHTML = `
            <div id="homework-detail-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                    <div class="p-6 border-b">
                        <h3 class="text-xl font-semibold text-gray-800">👁️ Ödev Detayları</h3>
                    </div>
                    
                    <div class="p-6">
                        <div class="space-y-6">
                            <div>
                                <h4 class="text-lg font-semibold text-gray-800 mb-2">${homework.title}</h4>
                                <p class="text-gray-600">${homework.description || 'Açıklama yok'}</p>
                            </div>
                            
                            <div class="grid grid-cols-2 gap-4">
                                <div class="bg-gray-50 p-4 rounded-lg">
                                    <div class="text-sm text-gray-600">Sınıf</div>
                                    <div class="font-semibold">${classInfo?.name || 'Bilinmiyor'}</div>
                                </div>
                                <div class="bg-gray-50 p-4 rounded-lg">
                                    <div class="text-sm text-gray-600">Ders/Konu</div>
                                    <div class="font-semibold">${homework.subject || 'Belirtilmemiş'}</div>
                                </div>
                                <div class="bg-gray-50 p-4 rounded-lg">
                                    <div class="text-sm text-gray-600">Teslim Tarihi</div>
                                    <div class="font-semibold">${dueDate.toLocaleDateString('tr-TR')}</div>
                                </div>
                                <div class="bg-gray-50 p-4 rounded-lg">
                                    <div class="text-sm text-gray-600">Verilme Tarihi</div>
                                    <div class="font-semibold">${assignedDate.toLocaleDateString('tr-TR')}</div>
                                </div>
                            </div>
                            
                            <div class="grid grid-cols-2 gap-4">
                                <div class="bg-gray-50 p-4 rounded-lg">
                                    <div class="text-sm text-gray-600">Durum</div>
                                    <div class="font-semibold ${timeInfo.color}">${timeInfo.icon} ${timeInfo.text}</div>
                                </div>
                                <div class="bg-gray-50 p-4 rounded-lg">
                                    <div class="text-sm text-gray-600">Öncelik</div>
                                    <div class="font-semibold">
                                        ${homework.priority === 'high' ? '🔴 Yüksek' : 
                                          homework.priority === 'medium' ? '🟡 Orta' : '🟢 Düşük'}
                                    </div>
                                </div>
                            </div>
                            
                            <div class="bg-gray-50 p-4 rounded-lg">
                                <div class="text-sm text-gray-600">Ödev Veren</div>
                                <div class="font-semibold">${homework.assignedBy || 'Öğretmen'}</div>
                            </div>
                            
                            ${homework.completedAt ? `
                                <div class="bg-green-50 p-4 rounded-lg border border-green-200">
                                    <div class="text-sm text-green-600">Tamamlanma Tarihi</div>
                                    <div class="font-semibold text-green-800">
                                        ${new Date(homework.completedAt).toLocaleDateString('tr-TR')}
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                    </div>

                    <div class="p-6 border-t bg-gray-50 flex justify-end">
                        <button onclick="homeworkModule.closeDetailModal()" class="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded-lg transition duration-200">
                            Kapat
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Eski modalı temizle
        const existingModal = document.getElementById('homework-detail-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // Yeni modalı ekle
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    closeDetailModal() {
        const modal = document.getElementById('homework-detail-modal');
        if (modal) {
            modal.remove();
        }
    }

    exportHomework() {
        const db = window.storageManager.getData();
        const homeworkList = db.homework || [];
        
        if (homeworkList.length === 0) {
            window.notificationManager.show('Dışa aktarılacak ödev bulunamadı!', 'info');
            return;
        }

        // CSV formatına dönüştür
        let csvContent = "Ödev Başlığı,Açıklama,Sınıf,Ders,Teslim Tarihi,Öncelik,Durum,Verilme Tarihi\n";
        
        homeworkList.forEach(hw => {
            const classInfo = db.classes.find(c => c.id === hw.classId);
            const row = [
                `"${hw.title}"`,
                `"${hw.description || ''}"`,
                `"${classInfo?.name || ''}"`,
                `"${hw.subject || ''}"`,
                `"${new Date(hw.dueDate).toLocaleDateString('tr-TR')}"`,
                `"${hw.priority === 'high' ? 'Yüksek' : hw.priority === 'medium' ? 'Orta' : 'Düşük'}"`,
                `"${hw.status === 'completed' ? 'Tamamlandı' : hw.status === 'late' ? 'Geciken' : 'Bekleyen'}"`,
                `"${new Date(hw.assignedDate).toLocaleDateString('tr-TR')}"`
            ].join(',');
            
            csvContent += row + '\n';
        });

        // Blob oluştur ve indir
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `ogretmen_defteri_odevleri_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        window.notificationManager.show('📊 Ödev listesi CSV olarak dışa aktarıldı!', 'success');
    }

    checkLateHomeworks() {
        const db = window.storageManager.getData();
        const homeworkList = db.homework || [];
        const today = new Date();
        let hasChanges = false;

        homeworkList.forEach(hw => {
            if (hw.status === 'pending') {
                const dueDate = new Date(hw.dueDate);
                if (dueDate < today) {
                    hw.status = 'late';
                    hasChanges = true;
                }
            }
        });

        if (hasChanges) {
            window.storageManager.saveData(db);
            this.refreshHomeworkList();
        }
    }
}

window.homeworkModule = new HomeworkModule();
window.safeRegisterModule('homework', window.homeworkModule);