// Yıllık Plan Modülü - BAĞIMSIZ PLAN YÖNETİMİ
class YillikPlanModule {
    constructor() {
        this.buttonText = '📅 Yıllık Plan';
        this.currentPlanId = null;
        this.currentImportData = null;
        this.plans = [];
    }

    render() {
        return `
            <div class="yillikplan-module">
                <div class="mb-6 flex justify-between items-center">
                    <h2 class="text-2xl font-bold text-gray-800">📅 Yıllık Plan Yönetimi</h2>
                    <button onclick="moduleManager.showWelcomeScreen()" class="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200">← Ana Sayfaya Dön</button>
                </div>

                <!-- PLAN SEÇİMİ ve OLUŞTURMA -->
                <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <!-- PLAN LİSTESİ -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Mevcut Planlar</label>
                            <select id="plan-select" onchange="yillikPlanModule.onPlanChange()" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">Plan seçin</option>
                                ${this.getPlanOptions()}
                            </select>
                        </div>

                        <!-- YENİ PLAN ADI -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Yeni Plan Adı</label>
                            <div class="flex space-x-2">
                                <input type="text" id="new-plan-name" 
                                       class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                       placeholder="Örn: 9. Sınıf Fizik Yıllık Planı">
                                <button onclick="yillikPlanModule.createNewPlan()" class="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200">
                                    ➕
                                </button>
                            </div>
                        </div>

                        <!-- PLAN BİLGİSİ -->
                        <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <div class="text-sm font-semibold text-blue-800 mb-1">Plan Bilgisi</div>
                            <div id="plan-info-text" class="text-sm text-blue-600">Plan seçin veya yeni oluşturun</div>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
                    <!-- PLAN İSTATİSTİKLERİ -->
                    <div class="bg-white p-6 rounded-lg shadow-sm border-2 border-green-200">
                        <h3 class="text-lg font-semibold text-gray-800 mb-4">📊 Plan Bilgileri</h3>
                        <div id="plan-stats" class="text-center">
                            <p class="text-gray-500">Plan seçin</p>
                        </div>
                    </div>

                    <!-- TOPLAM DERS SAATİ -->
                    <div class="bg-white p-6 rounded-lg shadow-sm border-2 border-purple-200">
                        <h3 class="text-lg font-semibold text-gray-800 mb-4">⏰ Toplam Süre</h3>
                        <div id="total-hours" class="text-center">
                            <p class="text-gray-500">-</p>
                        </div>
                    </div>

                    <!-- ÜNİTE SAYISI -->
                    <div class="bg-white p-6 rounded-lg shadow-sm border-2 border-orange-200">
                        <h3 class="text-lg font-semibold text-gray-800 mb-4">📚 Ünite Bilgisi</h3>
                        <div id="unit-stats" class="text-center">
                            <p class="text-gray-500">-</p>
                        </div>
                    </div>

                    <!-- PLAN DURUMU -->
                    <div class="bg-white p-6 rounded-lg shadow-sm border-2 border-blue-200">
                        <h3 class="text-lg font-semibold text-gray-800 mb-4">📅 Plan Durumu</h3>
                        <div id="plan-status" class="text-center">
                            <p class="text-gray-500">-</p>
                        </div>
                    </div>
                </div>

                <!-- YILLIK PLAN İŞLEMLERİ -->
                <div class="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
                    <div class="p-6 border-b">
                        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h3 class="text-xl font-semibold text-gray-800">Yıllık Plan İşlemleri</h3>
                                <p class="text-gray-600 text-sm mt-1" id="selected-plan-info">Lütfen plan seçin veya yeni oluşturun</p>
                            </div>
                            <div class="flex flex-wrap gap-2">
                                <button onclick="yillikPlanModule.showImportModal()" class="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center">
                                    <span class="mr-2">📤</span> Excel Import
                                </button>
                                <button onclick="yillikPlanModule.exportPlan()" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center">
                                    <span class="mr-2">📥</span> Dışa Aktar
                                </button>
                                <button onclick="yillikPlanModule.showAddPlanForm()" class="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center">
                                    <span class="mr-2">➕</span> Manuel Ekle
                                </button>
                                <button onclick="yillikPlanModule.deleteCurrentPlan()" class="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center">
                                    <span class="mr-2">🗑️</span> Sil
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- YILLIK PLAN TABLOSU -->
                <div class="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div class="p-6 border-b">
                        <h3 class="text-xl font-semibold text-gray-800">Yıllık Plan Tablosu</h3>
                        <p class="text-gray-600 text-sm mt-1" id="plan-table-info">Lütfen bir plan seçin</p>
                    </div>
                    <div class="p-6">
                        <div id="yillikplan-table-container">
                            ${this.renderEmptyState()}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // PLAN YÖNETİM FONKSİYONLARI
    getPlanOptions() {
        const db = window.storageManager.getData();
        this.plans = db.yearlyPlans || [];
        
        if (this.plans.length === 0) {
            return '<option value="">Henüz plan yok</option>';
        }

        return this.plans.map(plan => 
            `<option value="${plan.id}">${plan.name}</option>`
        ).join('');
    }

    onPlanChange() {
        const planSelect = document.getElementById('plan-select');
        this.currentPlanId = planSelect.value;
        
        if (this.currentPlanId) {
            this.loadPlan();
        } else {
            this.clearPlanDisplay();
        }
    }

    createNewPlan() {
        const planNameInput = document.getElementById('new-plan-name');
        const planName = planNameInput.value.trim();
        
        if (!planName) {
            window.notificationManager.show('Lütfen plan adı girin!', 'error');
            return;
        }

        const db = window.storageManager.getData();
        if (!db.yearlyPlans) {
            db.yearlyPlans = [];
        }

        // Aynı isimde plan var mı kontrol et
        if (db.yearlyPlans.some(plan => plan.name === planName)) {
            window.notificationManager.show('Bu isimde bir plan zaten var!', 'error');
            return;
        }

        const newPlan = {
            id: 'plan_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            name: planName,
            items: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        db.yearlyPlans.push(newPlan);
        
        if (window.storageManager.saveData(db)) {
            window.notificationManager.show(`✅ "${planName}" planı oluşturuldu!`, 'success');
            planNameInput.value = '';
            this.refreshPlanList();
            this.currentPlanId = newPlan.id;
            this.selectPlanInDropdown(newPlan.id);
            this.loadPlan();
        }
    }

    refreshPlanList() {
        const planSelect = document.getElementById('plan-select');
        planSelect.innerHTML = '<option value="">Plan seçin</option>' + this.getPlanOptions();
    }

    selectPlanInDropdown(planId) {
        const planSelect = document.getElementById('plan-select');
        planSelect.value = planId;
    }

    loadPlan() {
        if (!this.currentPlanId) {
            this.clearPlanDisplay();
            return;
        }

        const db = window.storageManager.getData();
        const plan = db.yearlyPlans.find(p => p.id === this.currentPlanId);
        
        if (!plan || !plan.items || plan.items.length === 0) {
            document.getElementById('yillikplan-table-container').innerHTML = this.renderEmptyState();
            this.updatePlanStats(null);
            return;
        }

        this.renderYillikPlanTable(plan.items);
        this.updatePlanStats(plan.items);
        this.updatePlanInfo(plan);
    }

    updatePlanInfo(plan) {
        const infoText = document.getElementById('plan-info-text');
        const selectedPlanInfo = document.getElementById('selected-plan-info');
        const planTableInfo = document.getElementById('plan-table-info');
        
        if (infoText) {
            const createdDate = new Date(plan.createdAt).toLocaleDateString('tr-TR');
            const updatedDate = new Date(plan.updatedAt).toLocaleDateString('tr-TR');
            infoText.innerHTML = `
                <div><strong>${plan.name}</strong></div>
                <div>Oluşturulma: ${createdDate}</div>
                <div>Son Güncelleme: ${updatedDate}</div>
            `;
        }

        if (selectedPlanInfo) {
            selectedPlanInfo.textContent = `Seçili plan: ${plan.name}`;
        }

        if (planTableInfo) {
            planTableInfo.textContent = `${plan.name} - ${plan.items.length} haftalık plan`;
        }
    }

    // PLAN İSTATİSTİKLERİNİ GÜNCELLE
    updatePlanStats(planData) {
        const statsDiv = document.getElementById('plan-stats');
        const hoursDiv = document.getElementById('total-hours');
        const unitsDiv = document.getElementById('unit-stats');
        const statusDiv = document.getElementById('plan-status');

        if (!planData) {
            statsDiv.innerHTML = '<p class="text-gray-500">Plan yok</p>';
            hoursDiv.innerHTML = '<p class="text-gray-500">-</p>';
            unitsDiv.innerHTML = '<p class="text-gray-500">-</p>';
            statusDiv.innerHTML = '<p class="text-gray-500">-</p>';
            return;
        }

        const totalHours = planData.reduce((sum, item) => sum + item.dersSaati, 0);
        const uniqueUnits = [...new Set(planData.map(item => item.unite))].filter(unit => unit);
        const uniqueMonths = [...new Set(planData.map(item => item.ay))].filter(ay => ay);
        const completionRate = this.calculateCompletionRate(planData);

        statsDiv.innerHTML = `
            <div class="text-2xl font-bold text-green-600">${planData.length}</div>
            <div class="text-sm text-green-800">Hafta</div>
            <div class="text-xs text-gray-500">${uniqueMonths.length} ay</div>
        `;

        hoursDiv.innerHTML = `
            <div class="text-2xl font-bold text-blue-600">${totalHours}</div>
            <div class="text-sm text-blue-800">Ders Saati</div>
        `;

        unitsDiv.innerHTML = `
            <div class="text-2xl font-bold text-purple-600">${uniqueUnits.length}</div>
            <div class="text-sm text-purple-800">Ünite</div>
        `;

        statusDiv.innerHTML = `
            <div class="text-2xl font-bold ${completionRate >= 80 ? 'text-green-600' : completionRate >= 50 ? 'text-yellow-600' : 'text-red-600'}">${completionRate}%</div>
            <div class="text-sm ${completionRate >= 80 ? 'text-green-800' : completionRate >= 50 ? 'text-yellow-800' : 'text-red-800'}">Tamamlanma</div>
        `;
    }

    calculateCompletionRate(planData) {
        const currentMonth = new Date().getMonth() + 1;
        const completedWeeks = planData.filter(item => {
            const monthNumber = this.getMonthNumber(item.ay);
            return monthNumber < currentMonth;
        }).length;
        
        return planData.length > 0 ? Math.round((completedWeeks / planData.length) * 100) : 0;
    }

    getMonthNumber(monthName) {
        const months = {
            'eylül': 9, 'ekim': 10, 'kasım': 11, 'aralık': 12,
            'ocak': 1, 'şubat': 2, 'mart': 3, 'nisan': 4, 'mayıs': 5, 'haziran': 6
        };
        return months[monthName?.toLowerCase()] || 0;
    }

    clearPlanDisplay() {
        document.getElementById('yillikplan-table-container').innerHTML = this.renderEmptyState();
        document.getElementById('plan-stats').innerHTML = '<p class="text-gray-500">Plan seçin</p>';
        document.getElementById('total-hours').innerHTML = '<p class="text-gray-500">-</p>';
        document.getElementById('unit-stats').innerHTML = '<p class="text-gray-500">-</p>';
        document.getElementById('plan-status').innerHTML = '<p class="text-gray-500">-</p>';
        document.getElementById('plan-info-text').innerHTML = 'Plan seçin veya yeni oluşturun';
        document.getElementById('selected-plan-info').textContent = 'Lütfen plan seçin veya yeni oluşturun';
        document.getElementById('plan-table-info').textContent = 'Lütfen bir plan seçin';
    }

    // EXCEL IMPORT MODAL
    showImportModal() {
        if (!this.currentPlanId) {
            window.notificationManager.show('Önce bir plan seçin veya yeni plan oluşturun!', 'error');
            return;
        }

        const db = window.storageManager.getData();
        const plan = db.yearlyPlans.find(p => p.id === this.currentPlanId);
        
        const modalHTML = `
            <div id="yillikplan-import-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                    <div class="p-6 border-b">
                        <h3 class="text-xl font-semibold text-gray-800">📤 Yıllık Plan Import</h3>
                        <p class="text-gray-600 text-sm mt-1">Excel formatında yıllık planınızı yükleyin</p>
                    </div>
                    
                    <div class="p-6">
                        <!-- SEÇİLİ PLAN BİLGİSİ -->
                        <div class="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <h4 class="text-sm font-semibold text-blue-800 mb-2">Seçili Plan</h4>
                            <p class="text-blue-700">${plan ? plan.name : 'Plan bilgisi yok'}</p>
                        </div>

                        <!-- DOSYA YÜKLEME ALANI -->
                        <div class="student-import-area border-2 border-dashed border-blue-400 rounded-lg p-8 text-center mb-6 bg-blue-50" 
                             onclick="document.getElementById('yillikplan-excel-file').click()">
                            <div class="text-4xl mb-4">📊</div>
                            <h4 class="text-lg font-semibold text-blue-800 mb-2">Yıllık Plan Excel Dosyasını Yükleyin</h4>
                            <p class="text-blue-600 text-sm mb-4">MEB formatında Excel dosyasını yükleyin</p>
                            <p class="text-gray-500 text-xs mb-2">Desteklenen sütunlar: AY, HAFTA, DERS SAATİ, ÜNİTE/TEMA, KONU, ÖĞRENME ÇIKTILARI, SÜREÇ BİLEŞENLERİ</p>
                            <input type="file" id="yillikplan-excel-file" accept=".xlsx,.xls,.csv" class="hidden" onchange="yillikPlanModule.handleYillikPlanFileSelect(event)">
                        </div>

                        <!-- ÖNİZLEME TABLOSU -->
                        <div id="yillikplan-import-preview" class="hidden">
                            <h4 class="text-lg font-semibold text-gray-800 mb-4">Yıllık Plan Önizleme</h4>
                            <div class="overflow-x-auto max-h-96">
                                <table class="min-w-full divide-y divide-gray-200 text-sm">
                                    <thead class="bg-gray-50 sticky top-0">
                                        <tr>
                                            <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">AY</th>
                                            <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">HAFTA</th>
                                            <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">DERS SAATİ</th>
                                            <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">ÜNİTE/TEMA</th>
                                            <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">KONU</th>
                                            <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">ÖĞRENME ÇIKTILARI</th>
                                        </tr>
                                    </thead>
                                    <tbody id="yillikplan-preview-table-body" class="bg-white divide-y divide-gray-200">
                                    </tbody>
                                </table>
                            </div>
                            <div class="mt-4 flex justify-between items-center">
                                <span id="preview-stats" class="text-sm text-gray-600"></span>
                                <div class="flex space-x-3">
                                    <button onclick="yillikPlanModule.cancelImport()" class="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200">
                                        İptal
                                    </button>
                                    <button onclick="yillikPlanModule.confirmYillikPlanImport()" class="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200">
                                        ✅ Planı İmport Et
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- ŞABLON İNDİRME -->
                        <div class="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                            <h4 class="text-sm font-semibold text-yellow-800 mb-2">📋 Örnek Şablon İndir</h4>
                            <p class="text-yellow-700 text-sm mb-3">MEB formatında boş şablonu indirip doldurabilirsiniz:</p>
                            <button onclick="yillikPlanModule.downloadTemplate()" class="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 text-sm">
                                📥 Boş Şablon İndir
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const existingModal = document.getElementById('yillikplan-import-modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    // EXCEL DOSYASI İŞLEME
    handleYillikPlanFileSelect(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

                // MEB formatını parse et
                const planData = this.parseMEBFormat(jsonData);
                this.currentImportData = planData;

                this.showYillikPlanPreview(planData);
                
            } catch (error) {
                console.error('Excel okuma hatası:', error);
                window.notificationManager.show('Excel dosyası okunurken hata oluştu!', 'error');
            }
        };
        reader.readAsArrayBuffer(file);
    }

    parseMEBFormat(excelData) {
        const planItems = [];
        let currentUnit = '';
        let currentAy = '';

        // Başlık satırını bul (genellikle 2. satır)
        let startRow = 0;
        for (let i = 0; i < Math.min(5, excelData.length); i++) {
            const row = excelData[i];
            if (row && row.length >= 5) {
                const firstCell = row[0] ? row[0].toString().toLowerCase() : '';
                if (firstCell.includes('ay') || firstCell.includes('eylül') || firstCell.includes('ekim')) {
                    startRow = i;
                    break;
                }
            }
        }

        for (let i = startRow; i < excelData.length; i++) {
            const row = excelData[i];
            if (!row || row.length < 5) continue;

            // AY bilgisini güncelle
            if (row[0] && this.isValidAy(row[0].toString())) {
                currentAy = row[0].toString().trim();
            }

            // ÜNİTE bilgisini güncelle
            if (row[3] && row[3].toString().trim()) {
                currentUnit = row[3].toString().trim();
            }

            // Geçerli bir plan satırı mı kontrol et
            if (this.isValidPlanRow(row)) {
                const planItem = {
                    ay: currentAy,
                    hafta: row[1] ? this.cleanText(row[1].toString()) : '',
                    dersSaati: row[2] ? this.parseDersSaati(row[2]) : 0,
                    unite: currentUnit,
                    konu: row[4] ? this.cleanText(row[4].toString()) : '',
                    ogrenmeCiktilari: row[5] ? this.cleanText(row[5].toString()) : '',
                    surecBilesenleri: row[6] ? this.cleanText(row[6].toString()) : '',
                    rowIndex: i
                };

                planItems.push(planItem);
            }
        }

        return planItems;
    }

    isValidAy(text) {
        const aylar = ['eylül', 'ekim', 'kasım', 'aralık', 'ocak', 'şubat', 'mart', 'nisan', 'mayıs', 'haziran'];
        return aylar.some(ay => text.toLowerCase().includes(ay));
    }

    isValidPlanRow(row) {
        const filledCells = row.filter(cell => cell && cell.toString().trim()).length;
        if (filledCells < 3) return false;

        const rowText = row.join(' ').toLowerCase();
        const excludeKeywords = ['tatil', 'tatili', 'ara tatil', 'yıl sonu', 'okul temelli', 'sosyal etkinlik'];
        
        return !excludeKeywords.some(keyword => rowText.includes(keyword));
    }

    parseDersSaati(saat) {
        if (!saat) return 0;
        const text = saat.toString().trim();
        const match = text.match(/(\d+)/);
        return match ? parseInt(match[1]) : 0;
    }

    cleanText(text) {
        if (!text) return '';
        return text.toString()
            .replace(/\n/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    // ÖNİZLEME GÖSTER
    showYillikPlanPreview(planData) {
        const previewDiv = document.getElementById('yillikplan-import-preview');
        const tableBody = document.getElementById('yillikplan-preview-table-body');
        const statsSpan = document.getElementById('preview-stats');
        
        if (previewDiv && tableBody && statsSpan) {
            previewDiv.classList.remove('hidden');
            
            let tableRows = '';
            const displayData = planData.slice(0, 20); // İlk 20 kaydı göser
            
            displayData.forEach(item => {
                tableRows += `
                    <tr class="hover:bg-gray-50">
                        <td class="px-3 py-2 text-xs text-gray-900">${item.ay}</td>
                        <td class="px-3 py-2 text-xs text-gray-900">${item.hafta}</td>
                        <td class="px-3 py-2 text-xs text-gray-900 text-center">${item.dersSaati}</td>
                        <td class="px-3 py-2 text-xs text-gray-900">${item.unite}</td>
                        <td class="px-3 py-2 text-xs text-gray-900">${item.konu}</td>
                        <td class="px-3 py-2 text-xs text-gray-900">${item.ogrenmeCiktilari.substring(0, 50)}...</td>
                    </tr>
                `;
            });
            
            tableBody.innerHTML = tableRows;
            
            const totalHours = planData.reduce((sum, item) => sum + item.dersSaati, 0);
            const uniqueUnits = [...new Set(planData.map(item => item.unite))].filter(unit => unit);
            
            statsSpan.textContent = `${planData.length} haftalık plan • ${totalHours} ders saati • ${uniqueUnits.length} ünite`;
        }
    }

    // ŞABLON İNDİRME
    downloadTemplate() {
        const templateData = [
            ['AY', 'HAFTA', 'DERS SAATİ', 'ÜNİTE/TEMA', 'KONU', 'ÖĞRENME ÇIKTILARI', 'SÜREÇ BİLEŞENLERİ'],
            ['EYLÜL', '1. Hafta: 8-12 Eylül', '2', 'FİZİK BİLİMİ VE KARİYER KEŞFİ', 'Fizik Bilimi', 'FİZ.9.1.1. Fizik biliminin tanımına yönelik tümevarımsal akıl yürütebilme', 'a) Fizik biliminin diğer disiplinlerle arasındaki ilişkileri belirler.'],
            ['EYLÜL', '2. Hafta: 15-19 Eylül', '2', 'FİZİK BİLİMİ VE KARİYER KEŞFİ', 'Fizik Biliminin Alt Dalları', 'FİZ.9.1.2. Fizik biliminin alt dallarını sınıflandırabilme', 'a) Fizik biliminin alt dallarının niteliklerini belirler.'],
            ['EKİM', '4. Hafta: 29 Eylül-3 Ekim', '2', 'FİZİK BİLİMİ VE KARİYER KEŞFİ', 'Fizik Bilimi İle İlgili Kariyer Keşfi', 'FİZ.9.1.4. Bilim ve teknoloji alanında faaliyet gösteren kurum veya kuruluşlarda fizik bilimi ile ilişkili kariyer olanaklarını sorgulayabilme', 'a) Bilim ve teknoloji alanında faaliyet gösteren kurum veya kuruluşlarda fizik bilimi ile ilişkili çalışmalara ve mesleklere yönelik merak ettiği konuları belirler.']
        ];

        const worksheet = XLSX.utils.aoa_to_sheet(templateData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Yıllık Plan Şablonu');
        
        XLSX.writeFile(workbook, 'Yillik_Plan_Sablonu.xlsx');
        window.notificationManager.show('📥 Şablon indirildi!', 'success');
    }

    // IMPORT ONAYLA
    confirmYillikPlanImport() {
        if (!this.currentImportData || !this.currentPlanId) {
            window.notificationManager.show('İçe aktarılacak veri bulunamadı!', 'error');
            return;
        }

        const db = window.storageManager.getData();
        const plan = db.yearlyPlans.find(p => p.id === this.currentPlanId);
        
        if (!plan) {
            window.notificationManager.show('Plan bulunamadı!', 'error');
            return;
        }

        // Yıllık planı kaydet
        plan.items = this.currentImportData;
        plan.updatedAt = new Date().toISOString();

        if (window.storageManager.saveData(db)) {
            window.notificationManager.show(`✅ ${this.currentImportData.length} haftalık plan başarıyla import edildi!`, 'success');
            this.cancelImport();
            this.loadPlan();
        } else {
            window.notificationManager.show('❌ Plan kaydedilirken hata oluştu!', 'error');
        }
    }

    cancelImport() {
        this.currentImportData = null;
        const modal = document.getElementById('yillikplan-import-modal');
        if (modal) {
            modal.remove();
        }
    }

    // YILLIK PLAN TABLOSU RENDER
    renderYillikPlanTable(planData) {
        let tableHTML = `
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200 text-sm">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AY</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HAFTA</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SAAT</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ÜNİTE/TEMA</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">KONU</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ÖĞRENME ÇIKTILARI</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İŞLEMLER</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
        `;

        planData.forEach((item, index) => {
            tableHTML += `
                <tr class="hover:bg-gray-50">
                    <td class="px-4 py-3 whitespace-nowrap text-xs font-medium text-gray-900">${item.ay}</td>
                    <td class="px-4 py-3 text-xs text-gray-900">${item.hafta}</td>
                    <td class="px-4 py-3 text-xs text-gray-900 text-center">${item.dersSaati}</td>
                    <td class="px-4 py-3 text-xs text-gray-900">${item.unite}</td>
                    <td class="px-4 py-3 text-xs text-gray-900">${item.konu}</td>
                    <td class="px-4 py-3 text-xs text-gray-900 max-w-xs truncate" title="${item.ogrenmeCiktilari}">
                        ${item.ogrenmeCiktilari.substring(0, 60)}...
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-xs font-medium">
                        <button onclick="yillikPlanModule.editPlanItem(${index})" class="text-blue-600 hover:text-blue-900 mr-2">✏️</button>
                        <button onclick="yillikPlanModule.deletePlanItem(${index})" class="text-red-600 hover:text-red-900">🗑️</button>
                    </td>
                </tr>
            `;
        });

        tableHTML += `
                    </tbody>
                </table>
            </div>
        `;

        document.getElementById('yillikplan-table-container').innerHTML = tableHTML;
    }

    renderEmptyState() {
        return `
            <div class="text-center py-12">
                <div class="text-6xl mb-4">📅</div>
                <h4 class="text-xl font-semibold text-gray-700 mb-2">Henüz yıllık plan eklenmemiş</h4>
                <p class="text-gray-500 mb-6">Excel import veya manuel ekleme ile plan oluşturun</p>
                <button onclick="yillikPlanModule.showImportModal()" class="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200 text-lg">
                    📤 Excel ile İmport Et
                </button>
            </div>
        `;
    }

    // MANUEL PLAN EKLEME
    showAddPlanForm() {
        if (!this.currentPlanId) {
            window.notificationManager.show('Önce bir plan seçin veya yeni plan oluşturun!', 'error');
            return;
        }
        
        const modalHTML = `
            <div id="add-plan-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                    <div class="p-6 border-b">
                        <h3 class="text-xl font-semibold text-gray-800">➕ Manuel Plan Ekle</h3>
                        <p class="text-gray-600 text-sm mt-1">Yıllık plana manuel olarak hafta ekleyin</p>
                    </div>
                    
                    <div class="p-6">
                        <form id="add-plan-form" class="space-y-4">
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Ay</label>
                                    <select id="plan-ay" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="eylül">Eylül</option>
                                        <option value="ekim">Ekim</option>
                                        <option value="kasım">Kasım</option>
                                        <option value="aralık">Aralık</option>
                                        <option value="ocak">Ocak</option>
                                        <option value="şubat">Şubat</option>
                                        <option value="mart">Mart</option>
                                        <option value="nisan">Nisan</option>
                                        <option value="mayıs">Mayıs</option>
                                        <option value="haziran">Haziran</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Hafta</label>
                                    <input type="text" id="plan-hafta" 
                                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                           placeholder="Örn: 1. Hafta: 8-12 Eylül" required>
                                </div>
                            </div>

                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Ders Saati</label>
                                    <input type="number" id="plan-saat" min="1" max="10" 
                                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                           value="2" required>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Ünite/Tema</label>
                                    <input type="text" id="plan-unite" 
                                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                           placeholder="Ünite adı" required>
                                </div>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Konu</label>
                                <input type="text" id="plan-konu" 
                                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                       placeholder="Konu başlığı" required>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Öğrenme Çıktıları</label>
                                <textarea id="plan-cikti" rows="3"
                                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                          placeholder="Kazanım ve göstergeler..."></textarea>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Süreç Bileşenleri</label>
                                <textarea id="plan-surec" rows="2"
                                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                          placeholder="Etkinlikler, yöntemler..."></textarea>
                            </div>
                        </form>
                    </div>

                    <div class="p-6 border-t bg-gray-50 flex justify-end space-x-3">
                        <button onclick="yillikPlanModule.closeAddPlanModal()" class="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200">
                            İptal
                        </button>
                        <button onclick="yillikPlanModule.saveManualPlan()" class="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200">
                            💾 Planı Ekle
                        </button>
                    </div>
                </div>
            </div>
        `;

        const existingModal = document.getElementById('add-plan-modal');
        if (existingModal) {
            existingModal.remove();
        }

        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    closeAddPlanModal() {
        const modal = document.getElementById('add-plan-modal');
        if (modal) {
            modal.remove();
        }
    }

    saveManualPlan() {
        const ay = document.getElementById('plan-ay').value;
        const hafta = document.getElementById('plan-hafta').value.trim();
        const saat = parseInt(document.getElementById('plan-saat').value);
        const unite = document.getElementById('plan-unite').value.trim();
        const konu = document.getElementById('plan-konu').value.trim();
        const cikti = document.getElementById('plan-cikti').value.trim();
        const surec = document.getElementById('plan-surec').value.trim();

        if (!ay || !hafta || !unite || !konu) {
            window.notificationManager.show('Lütfen zorunlu alanları doldurun!', 'error');
            return;
        }

        const db = window.storageManager.getData();
        const plan = db.yearlyPlans.find(p => p.id === this.currentPlanId);
        
        if (!plan) {
            window.notificationManager.show('Plan bulunamadı!', 'error');
            return;
        }

        if (!plan.items) {
            plan.items = [];
        }

        const newPlanItem = {
            ay: ay,
            hafta: hafta,
            dersSaati: saat,
            unite: unite,
            konu: konu,
            ogrenmeCiktilari: cikti,
            surecBilesenleri: surec,
            rowIndex: plan.items.length
        };

        plan.items.push(newPlanItem);
        plan.updatedAt = new Date().toISOString();

        if (window.storageManager.saveData(db)) {
            window.notificationManager.show('✅ Plan öğesi başarıyla eklendi!', 'success');
            this.closeAddPlanModal();
            this.loadPlan();
        } else {
            window.notificationManager.show('❌ Plan kaydedilirken hata oluştu!', 'error');
        }
    }

    // PLAN DIŞA AKTARMA
    exportPlan() {
        if (!this.currentPlanId) {
            window.notificationManager.show('Önce bir plan seçin!', 'error');
            return;
        }

        const db = window.storageManager.getData();
        const plan = db.yearlyPlans.find(p => p.id === this.currentPlanId);
        
        if (!plan || !plan.items || plan.items.length === 0) {
            window.notificationManager.show('Dışa aktarılacak plan bulunamadı!', 'warning');
            return;
        }

        // CSV formatına dönüştür
        let csvContent = "AY,HAFTA,DERS SAATİ,ÜNİTE/TEMA,KONU,ÖĞRENME ÇIKTILARI,SÜREÇ BİLEŞENLERİ\n";
        
        plan.items.forEach(item => {
            const row = [
                `"${item.ay}"`,
                `"${item.hafta}"`,
                item.dersSaati,
                `"${item.unite}"`,
                `"${item.konu}"`,
                `"${item.ogrenmeCiktilari}"`,
                `"${item.surecBilesenleri}"`
            ].join(',');
            csvContent += row + '\n';
        });

        // Blob oluştur ve indir
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `${plan.name}_yillik_plan_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        window.notificationManager.show('📤 Yıllık plan dışa aktarıldı!', 'success');
    }

    // PLAN SİLME
    deleteCurrentPlan() {
        if (!this.currentPlanId) {
            window.notificationManager.show('Önce bir plan seçin!', 'error');
            return;
        }

        if (!confirm('Bu planı silmek istediğinize emin misiniz? Bu işlem geri alınamaz!')) {
            return;
        }

        const db = window.storageManager.getData();
        const planIndex = db.yearlyPlans.findIndex(p => p.id === this.currentPlanId);
        
        if (planIndex !== -1) {
            const planName = db.yearlyPlans[planIndex].name;
            db.yearlyPlans.splice(planIndex, 1);
            
            if (window.storageManager.saveData(db)) {
                window.notificationManager.show(`🗑️ "${planName}" planı silindi!`, 'success');
                this.currentPlanId = null;
                this.refreshPlanList();
                this.clearPlanDisplay();
            }
        }
    }

    editPlanItem(index) {
        window.notificationManager.show('Plan düzenleme özelliği yakında eklenecek!', 'info');
    }

    deletePlanItem(index) {
        if (!this.currentPlanId) return;
        
        if (confirm('Bu plan öğesini silmek istediğinize emin misiniz?')) {
            const db = window.storageManager.getData();
            const plan = db.yearlyPlans.find(p => p.id === this.currentPlanId);
            
            if (plan && plan.items) {
                plan.items.splice(index, 1);
                plan.updatedAt = new Date().toISOString();
                window.storageManager.saveData(db);
                this.loadPlan();
                window.notificationManager.show('Plan öğesi silindi!', 'success');
            }
        }
    }

    onShow() {
        console.log('Yıllık Plan modülü açıldı');
        this.refreshPlanList();
    }
}

// Global instance oluştur
window.yillikPlanModule = new YillikPlanModule();

// Modülü kaydet
window.safeRegisterModule('yillikplan', window.yillikPlanModule);