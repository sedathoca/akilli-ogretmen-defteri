class BEPModule {
    constructor() {
        this.buttonText = '📝 BEP';
        this.currentOgrenci = null;
        this.bepFormData = {
            // BÖLÜM 1: ÖĞRENCİ ve AİLE BİLGİLERİ
            ogrenciBilgileri: {},
            aileBilgileri: {},
            
            // BÖLÜM 2: EĞİTSEL PERFORMANS
            performansBilgileri: {},
            gelisimOykusu: {},
            
            // BÖLÜM 3: BİREYSELLEŞTİRİLMİŞ EĞİTİM PLANI
            uzunDonemliAmaclar: [],
            kisaDonemliAmaclar: [],
            ogretimYontemleri: [],
            materyaller: [],
            degerlendirme: {},
            
            // BÖLÜM 4: BEP BİRİM KARARLARI
            birimKararlari: {},
            
            // BÖLÜM 5: ÜYELER ve İMZALAR
            bepUyeleri: []
        };
    }

    render() {
        return this.renderBEPAnaArayuz();
    }

    onShow() {
        console.log('🔍 BEP modülü açıldı');
        this.bepOgrenciListesiniYukle();
    }

    renderBEPAnaArayuz() {
        return `
            <div class="bep-module bg-white rounded-lg shadow-sm p-6">
                <!-- BAŞLIK -->
                <div class="mb-6 flex justify-between items-center">
                    <h2 class="text-2xl font-bold text-gray-800">📝 Bireyselleştirilmiş Eğitim Programı (BEP)</h2>
                    <button onclick="moduleManager.showWelcomeScreen()" 
                            class="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200">
                        ← Ana Sayfaya Dön
                    </button>
                </div>

                <!-- ÖĞRENCİ SEÇİMİ -->
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <h3 class="text-lg font-semibold text-blue-800 mb-3">👥 BEP Hazırlanacak Öğrenciyi Seçin</h3>
                    <div class="flex gap-4 items-center">
                        <select id="bepOgrenciSecim" class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                onchange="bepModule.ogrenciSec(this.value)">
                            <option value="">-- Öğrenci Seçin --</option>
                            ${this.renderBEPOgrenciSecenekleri()}
                        </select>
                        <button onclick="bepModule.yeniBEPOlustur()" 
                                class="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 ${!this.currentOgrenci ? 'opacity-50 cursor-not-allowed' : ''}"
                                ${!this.currentOgrenci ? 'disabled' : ''}>
                            🆕 Yeni BEP Oluştur
                        </button>
                    </div>
                </div>

                <!-- BEP FORMU -->
                ${this.currentOgrenci ? this.renderBEPFormu() : this.renderBEPBosDurum()}
            </div>
        `;
    }

    // BEP FORMU - MEB STANDARTLARINA UYGUN
    renderBEPFormu() {
        return `
            <div class="bep-formu">
                <!-- BEP BAŞLIK -->
                <div class="text-center mb-8 py-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
                    <h3 class="text-2xl font-bold text-gray-800">BİREYSELLEŞTİRİLMİŞ EĞİTİM PROGRAMI (BEP)</h3>
                    <p class="text-gray-600">Milli Eğitim Bakanlığı Özel Eğitim ve Rehberlik Hizmetleri Yönetmeliği</p>
                </div>

                <!-- BÖLÜM 1: ÖĞRENCİ ve AİLE BİLGİLERİ -->
                <div class="mb-8">
                    <div class="bg-gray-800 text-white px-4 py-3 rounded-t-lg">
                        <h4 class="text-lg font-semibold">BÖLÜM 1: ÖĞRENCİ ve AİLE BİLGİLERİ</h4>
                    </div>
                    <div class="border border-gray-300 border-t-0 rounded-b-lg p-6">
                        ${this.renderOgrenciAileBilgileri()}
                    </div>
                </div>

                <!-- BÖLÜM 2: EĞİTSEL PERFORMANS -->
                <div class="mb-8">
                    <div class="bg-gray-800 text-white px-4 py-3 rounded-t-lg">
                        <h4 class="text-lg font-semibold">BÖLÜM 2: EĞİTSEL PERFORMANS ve GELİŞİM ÖYKÜSÜ</h4>
                    </div>
                    <div class="border border-gray-300 border-t-0 rounded-b-lg p-6">
                        ${this.renderEğitselPerformans()}
                    </div>
                </div>

                <!-- BÖLÜM 3: BİREYSELLEŞTİRİLMİŞ EĞİTİM PLANI -->
                <div class="mb-8">
                    <div class="bg-gray-800 text-white px-4 py-3 rounded-t-lg">
                        <h4 class="text-lg font-semibold">BÖLÜM 3: BİREYSELLEŞTİRİLMİŞ EĞİTİM PLANI</h4>
                    </div>
                    <div class="border border-gray-300 border-t-0 rounded-b-lg p-6">
                        ${this.renderBireysellestirilmisEgitimPlani()}
                    </div>
                </div>

                <!-- BÖLÜM 4: BEP BİRİM KARARLARI -->
                <div class="mb-8">
                    <div class="bg-gray-800 text-white px-4 py-3 rounded-t-lg">
                        <h4 class="text-lg font-semibold">BÖLÜM 4: BEP GELİŞTİRME BİRİM KARARLARI</h4>
                    </div>
                    <div class="border border-gray-300 border-t-0 rounded-b-lg p-6">
                        ${this.renderBEPBirimKararlari()}
                    </div>
                </div>

                <!-- BÖLÜM 5: BEP ÜYELERİ -->
                <div class="mb-8">
                    <div class="bg-gray-800 text-white px-4 py-3 rounded-t-lg">
                        <h4 class="text-lg font-semibold">BÖLÜM 5: BEP GELİŞTİRME BİRİMİ ÜYELERİ</h4>
                    </div>
                    <div class="border border-gray-300 border-t-0 rounded-b-lg p-6">
                        ${this.renderBEPUyeleri()}
                    </div>
                </div>

                <!-- KAYDET ve YAZDIR BUTONLARI -->
                <div class="flex justify-end gap-4 mt-8">
                    <button onclick="bepModule.bepKaydet()" 
                            class="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200">
                        💾 BEP'i Kaydet
                    </button>
                    <button onclick="bepModule.bepYazdir()" 
                            class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200">
                        🖨️ BEP'i Yazdır
                    </button>
                    <button onclick="bepModule.bepPDFIndir()" 
                            class="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200">
                        📄 PDF Olarak İndir
                    </button>
                </div>
            </div>
        `;
    }

    // BÖLÜM 1: ÖĞRENCİ ve AİLE BİLGİLERİ
    renderOgrenciAileBilgileri() {
        return `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- ÖĞRENCİ BİLGİLERİ -->
                <div>
                    <h5 class="font-semibold text-gray-700 mb-3 border-b pb-2">👤 ÖĞRENCİ BİLGİLERİ</h5>
                    <div class="space-y-3">
                        <div>
                            <label class="block text-sm font-medium text-gray-600">Adı Soyadı</label>
                            <input type="text" value="${this.currentOgrenci.adi}" 
                                   class="w-full px-3 py-2 border border-gray-300 rounded-lg" readonly>
                        </div>
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block text-sm font-medium text-gray-600">Sınıfı</label>
                                <input type="text" value="${this.currentOgrenci.sinif}" 
                                       class="w-full px-3 py-2 border border-gray-300 rounded-lg" readonly>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-600">Okul No</label>
                                <input type="text" value="${this.currentOgrenci.numara}" 
                                       class="w-full px-3 py-2 border border-gray-300 rounded-lg" readonly>
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-600">Doğum Tarihi</label>
                            <input type="date" class="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                   onchange="bepModule.bepGuncelle('ogrenciBilgileri.dogumTarihi', this.value)">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-600">Tanı (Özel Gereksinim)</label>
                            <div class="flex flex-wrap gap-1 mt-1">
                                ${this.currentOgrenci.ozelGereksinimler.map(gereksinim => 
                                    `<span class="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">${gereksinim}</span>`
                                ).join('')}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- AİLE BİLGİLERİ -->
                <div>
                    <h5 class="font-semibold text-gray-700 mb-3 border-b pb-2">👨‍👩‍👧‍👦 AİLE BİLGİLERİ</h5>
                    <div class="space-y-3">
                        <div>
                            <label class="block text-sm font-medium text-gray-600">Anne Adı Soyadı</label>
                            <input type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                   onchange="bepModule.bepGuncelle('aileBilgileri.anneAdi', this.value)">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-600">Baba Adı Soyadı</label>
                            <input type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                   onchange="bepModule.bepGuncelle('aileBilgileri.babaAdi', this.value)">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-600">Telefon</label>
                            <input type="tel" class="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                   onchange="bepModule.bepGuncelle('aileBilgileri.telefon', this.value)">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-600">Adres</label>
                            <textarea class="w-full px-3 py-2 border border-gray-300 rounded-lg" rows="2"
                                      onchange="bepModule.bepGuncelle('aileBilgileri.adres', this.value)"></textarea>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // BÖLÜM 2: EĞİTSEL PERFORMANS
    renderEğitselPerformans() {
        return `
            <div class="space-y-6">
                <!-- GÜÇLÜ YÖNLER -->
                <div>
                    <h5 class="font-semibold text-gray-700 mb-2">💪 Öğrencinin Güçlü Yönleri</h5>
                    <textarea class="w-full px-3 py-2 border border-gray-300 rounded-lg" rows="3"
                              placeholder="Öğrencinin başarılı olduğu alanlar, yetenekleri, ilgi alanları..."
                              onchange="bepModule.bepGuncelle('performansBilgileri.gucluYonler', this.value)"></textarea>
                </div>

                <!-- İHTİYAÇLAR -->
                <div>
                    <h5 class="font-semibold text-gray-700 mb-2">🎯 Eğitsel İhtiyaçlar</h5>
                    <textarea class="w-full px-3 py-2 border border-gray-300 rounded-lg" rows="3"
                              placeholder="Öğrencinin akademik, sosyal, davranışsal ihtiyaçları..."
                              onchange="bepModule.bepGuncelle('performansBilgileri.ihtiyaclar', this.value)"></textarea>
                </div>

                <!-- PERFORMANS DÜZEYİ -->
                <div>
                    <h5 class="font-semibold text-gray-700 mb-2">📊 Mevcut Performans Düzeyi</h5>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-600">Akademik Performans</label>
                            <select class="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    onchange="bepModule.bepGuncelle('performansBilgileri.akademikPerformans', this.value)">
                                <option value="">Seçiniz</option>
                                <option value="cok_iyi">Çok İyi</option>
                                <option value="iyi">İyi</option>
                                <option value="orta">Orta</option>
                                <option value="zayif">Zayıf</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-600">Sosyal Beceriler</label>
                            <select class="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    onchange="bepModule.bepGuncelle('performansBilgileri.sosyalBeceriler', this.value)">
                                <option value="">Seçiniz</option>
                                <option value="cok_iyi">Çok İyi</option>
                                <option value="iyi">İyi</option>
                                <option value="orta">Orta</option>
                                <option value="zayif">Zayıf</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- GELİŞİM ÖYKÜSÜ -->
                <div>
                    <h5 class="font-semibold text-gray-700 mb-2">📖 Gelişim Öyküsü</h5>
                    <textarea class="w-full px-3 py-2 border border-gray-300 rounded-lg" rows="3"
                              placeholder="Öğrencinin geçmiş eğitim durumu, tıbbi geçmişi, aile öyküsü..."
                              onchange="bepModule.bepGuncelle('gelisimOykusu', this.value)"></textarea>
                </div>
            </div>
        `;
    }

    // BÖLÜM 3: BİREYSELLEŞTİRİLMİŞ EĞİTİM PLANI
    renderBireysellestirilmisEgitimPlani() {
        return `
            <div class="space-y-6">
                <!-- UZUN DÖNEMLİ AMAÇLAR -->
                <div>
                    <h5 class="font-semibold text-gray-700 mb-3">🎯 UZUN DÖNEMLİ AMAÇLAR</h5>
                    <div id="uzunDonemliAmaclarListesi">
                        ${this.renderAmacListesi('uzunDonemli')}
                    </div>
                    <button onclick="bepModule.yeniAmacEkle('uzunDonemli')"
                            class="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition duration-200">
                        + Uzun Dönemli Amaç Ekle
                    </button>
                </div>

                <!-- KISA DÖNEMLİ AMAÇLAR -->
                <div>
                    <h5 class="font-semibold text-gray-700 mb-3">📝 KISA DÖNEMLİ AMAÇLAR</h5>
                    <div id="kisaDonemliAmaclarListesi">
                        ${this.renderAmacListesi('kisaDonemli')}
                    </div>
                    <button onclick="bepModule.yeniAmacEkle('kisaDonemli')"
                            class="mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition duration-200">
                        + Kısa Dönemli Amaç Ekle
                    </button>
                </div>

                <!-- ÖĞRETİM YÖNTEMLERİ -->
                <div>
                    <h5 class="font-semibold text-gray-700 mb-3">🏫 ÖĞRETİM YÖNTEM ve TEKNİKLERİ</h5>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="flex items-center">
                                <input type="checkbox" class="mr-2" value="bire_bir_ogretim">
                                Bire-bir Öğretim
                            </label>
                            <label class="flex items-center">
                                <input type="checkbox" class="mr-2" value="kucuk_grup">
                                Küçük Grup Öğretimi
                            </label>
                            <label class="flex items-center">
                                <input type="checkbox" class="mr-2" value="model_olma">
                                Model Olma
                            </label>
                        </div>
                        <div>
                            <label class="flex items-center">
                                <input type="checkbox" class="mr-2" value="soru_cevap">
                                Soru-Cevap
                            </label>
                            <label class="flex items-center">
                                <input type="checkbox" class="mr-2" value="gosterip_yaptirma">
                                Gösterip Yaptırma
                            </label>
                            <label class="flex items-center">
                                <input type="checkbox" class="mr-2" value="oyun_temelli">
                                Oyun Temelli Öğrenme
                            </label>
                        </div>
                    </div>
                </div>

                <!-- MATERYALLER -->
                <div>
                    <h5 class="font-semibold text-gray-700 mb-3">🛠️ KULLANILACAK MATERYALLER</h5>
                    <div class="flex flex-wrap gap-2">
                        <button onclick="bepModule.materyalEkle('Akıllı Tahta')" class="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm">Akıllı Tahta</button>
                        <button onclick="bepModule.materyalEkle('Tablet/Bilgisayar')" class="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm">Tablet/Bilgisayar</button>
                        <button onclick="bepModule.materyalEkle('Eğitsel Oyunlar')" class="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm">Eğitsel Oyunlar</button>
                        <button onclick="bepModule.materyalEkle('Görsel Kartlar')" class="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm">Görsel Kartlar</button>
                        <button onclick="bepModule.materyalEkle('Ödül Sistemi')" class="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm">Ödül Sistemi</button>
                    </div>
                    <div class="mt-2">
                        <input type="text" id="yeniMateryal" placeholder="Diğer materyaller..." 
                               class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                        <button onclick="bepModule.manuelMateryalEkle()"
                                class="mt-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm">
                            Materyal Ekle
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // AMAÇ LİSTESİ RENDER
    renderAmacListesi(tip) {
        const amaclar = tip === 'uzunDonemli' ? this.bepFormData.uzunDonemliAmaclar : this.bepFormData.kisaDonemliAmaclar;
        
        if (amaclar.length === 0) {
            return '<p class="text-gray-500 text-sm">Henüz amaç eklenmemiş</p>';
        }

        return amaclar.map((amac, index) => `
            <div class="flex items-start gap-3 mb-3 p-3 bg-gray-50 rounded-lg">
                <div class="flex-1">
                    <input type="text" value="${amac}" 
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg"
                           onchange="bepModule.amacGuncelle('${tip}', ${index}, this.value)">
                </div>
                <button onclick="bepModule.amacSil('${tip}', ${index})"
                        class="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm">
                    🗑️
                </button>
            </div>
        `).join('');
    }

    // BÖLÜM 4: BEP BİRİM KARARLARI
    renderBEPBirimKararlari() {
        return `
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-600 mb-2">📅 BEP Uygulama Başlangıç Tarihi</label>
                    <input type="date" class="w-full px-3 py-2 border border-gray-300 rounded-lg"
                           onchange="bepModule.bepGuncelle('birimKararlari.baslangicTarihi', this.value)">
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-600 mb-2">📅 BEP Uygulama Bitiş Tarihi</label>
                    <input type="date" class="w-full px-3 py-2 border border-gray-300 rounded-lg"
                           onchange="bepModule.bepGuncelle('birimKararlari.bitisTarihi', this.value)">
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-600 mb-2">⏰ Haftalık Destek Eğitim Süresi</label>
                    <select class="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            onchange="bepModule.bepGuncelle('birimKararlari.destekEgitimSuresi', this.value)">
                        <option value="">Seçiniz</option>
                        <option value="2_saat">2 Saat</option>
                        <option value="4_saat">4 Saat</option>
                        <option value="6_saat">6 Saat</option>
                        <option value="8_saat">8 Saat</option>
                        <option value="10_saat">10+ Saat</option>
                    </select>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-600 mb-2">📝 Değerlendirme Sıklığı</label>
                    <select class="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            onchange="bepModule.bepGuncelle('birimKararlari.degerlendirmeSikligi', this.value)">
                        <option value="">Seçiniz</option>
                        <option value="haftalik">Haftalık</option>
                        <option value="iki_haftada_bir">İki Haftada Bir</option>
                        <option value="aylik">Aylık</option>
                        <option value="donemlik">Dönemlik</option>
                    </select>
                </div>
            </div>
        `;
    }

    // BÖLÜM 5: BEP ÜYELERİ
    renderBEPUyeleri() {
        return `
            <div class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-600">Okul Müdürü</label>
                        <input type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg"
                               onchange="bepModule.bepGuncelle('bepUyeleri.okulMuduru', this.value)">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-600">Rehber Öğretmen</label>
                        <input type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg"
                               onchange="bepModule.bepGuncelle('bepUyeleri.rehberOgretmen', this.value)">
                    </div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-600">Sınıf Öğretmeni</label>
                        <input type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg"
                               onchange="bepModule.bepGuncelle('bepUyeleri.sinifOgretmeni', this.value)">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-600">Branş Öğretmeni</label>
                        <input type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg"
                               onchange="bepModule.bepGuncelle('bepUyeleri.bransOgretmeni', this.value)">
                    </div>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-600">Veli/Öğrenci</label>
                    <input type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg"
                           onchange="bepModule.bepGuncelle('bepUyeleri.veli', this.value)">
                </div>
            </div>
        `;
    }

    // BEP BOŞ DURUM
    renderBEPBosDurum() {
        return `
            <div class="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <div class="text-6xl mb-4">📝</div>
                <h3 class="text-xl font-semibold text-gray-700 mb-2">BEP Dosyası Hazırlamak İçin Öğrenci Seçin</h3>
                <p class="text-gray-500">Rehberlik listesindeki öğrencilerden birini seçerek BEP hazırlamaya başlayabilirsiniz.</p>
            </div>
        `;
    }

    // YARDIMCI FONKSİYONLAR
    bepOgrenciListesiniYukle() {
        const db = window.storageManager.getData();
        this.ogrenciListesi = db.rehberlikOgrenciler || [];
    }

    renderBEPOgrenciSecenekleri() {
        return this.ogrenciListesi.map(ogrenci => 
            `<option value="${ogrenci.id}">${ogrenci.adi} - ${ogrenci.sinif} (${ogrenci.ozelGereksinimler.length} gereksinim)</option>`
        ).join('');
    }

    ogrenciSec(ogrenciId) {
        this.currentOgrenci = this.ogrenciListesi.find(o => o.id === ogrenciId);
        // Eğer bu öğrenci için kayıtlı BEP varsa yükle
        this.mevcutBEPiYukle();
    }

    yeniBEPOlustur() {
        if (!this.currentOgrenci) return;
        
        this.bepFormData = {
            ogrenciBilgileri: { ...this.currentOgrenci },
            aileBilgileri: {},
            performansBilgileri: {},
            gelisimOykusu: '',
            uzunDonemliAmaclar: [],
            kisaDonemliAmaclar: [],
            ogretimYontemleri: [],
            materyaller: [],
            degerlendirme: {},
            birimKararlari: {},
            bepUyeleri: []
        };
        
        window.notificationManager.show('🆕 Yeni BEP formu hazırlandı!', 'success');
    }

    bepGuncelle(yol, deger) {
        // Örnek: 'aileBilgileri.anneAdi' -> this.bepFormData.aileBilgileri.anneAdi
        const yollar = yol.split('.');
        let hedef = this.bepFormData;
        
        for (let i = 0; i < yollar.length - 1; i++) {
            hedef = hedef[yollar[i]];
        }
        
        hedef[yollar[yollar.length - 1]] = deger;
    }

    yeniAmacEkle(tip) {
        const yeniAmac = tip === 'uzunDonemli' ? 'Yeni uzun dönemli amaç' : 'Yeni kısa dönemli amaç';
        
        if (tip === 'uzunDonemli') {
            this.bepFormData.uzunDonemliAmaclar.push(yeniAmac);
        } else {
            this.bepFormData.kisaDonemliAmaclar.push(yeniAmac);
        }
        
        // Arayüzü güncelle
        document.getElementById(`${tip}AmaclarListesi`).innerHTML = this.renderAmacListesi(tip);
    }

    amacGuncelle(tip, index, deger) {
        if (tip === 'uzunDonemli') {
            this.bepFormData.uzunDonemliAmaclar[index] = deger;
        } else {
            this.bepFormData.kisaDonemliAmaclar[index] = deger;
        }
    }

    amacSil(tip, index) {
        if (tip === 'uzunDonemli') {
            this.bepFormData.uzunDonemliAmaclar.splice(index, 1);
        } else {
            this.bepFormData.kisaDonemliAmaclar.splice(index, 1);
        }
        
        document.getElementById(`${tip}AmaclarListesi`).innerHTML = this.renderAmacListesi(tip);
    }

    materyalEkle(materyal) {
        if (!this.bepFormData.materyaller.includes(materyal)) {
            this.bepFormData.materyaller.push(materyal);
            window.notificationManager.show(`🛠️ "${materyal}" eklendi!`, 'success');
        }
    }

    manuelMateryalEkle() {
        const input = document.getElementById('yeniMateryal');
        if (input.value.trim()) {
            this.materyalEkle(input.value.trim());
            input.value = '';
        }
    }

    bepKaydet() {
        if (!this.currentOgrenci) return;
        
        const db = window.storageManager.getData();
        if (!db.bepPlanlari) {
            db.bepPlanlari = [];
        }
        
        // Mevcut BEP'i güncelle veya yeni ekle
        const bepIndex = db.bepPlanlari.findIndex(bep => bep.ogrenciId === this.currentOgrenci.id);
        const yeniBEP = {
            ...this.bepFormData,
            ogrenciId: this.currentOgrenci.id,
            olusturmaTarihi: new Date().toISOString(),
            durum: 'aktif'
        };
        
        if (bepIndex > -1) {
            db.bepPlanlari[bepIndex] = yeniBEP;
        } else {
            db.bepPlanlari.push(yeniBEP);
        }
        
        window.storageManager.saveData(db);
        window.notificationManager.show('✅ BEP başarıyla kaydedildi!', 'success');
    }

    bepYazdir() {
        window.notificationManager.show('🖨️ BEP yazdırma özelliği yakında eklenecek!', 'info');
    }

    bepPDFIndir() {
        window.notificationManager.show('📄 PDF indirme özelliği yakında eklenecek!', 'info');
    }

    mevcutBEPiYukle() {
        if (!this.currentOgrenci) return;
        
        const db = window.storageManager.getData();
        const mevcutBEP = db.bepPlanlari?.find(bep => bep.ogrenciId === this.currentOgrenci.id);
        
        if (mevcutBEP) {
            this.bepFormData = { ...mevcutBEP };
            window.notificationManager.show('📂 Öğrencinin mevcut BEP\'i yüklendi!', 'success');
        }
    }
}

// Global instance
window.bepModule = new BEPModule();

// Modül kaydı
function registerBEPModule() {
    if (window.moduleManager) {
        window.moduleManager.registerModule('bep', window.bepModule);
        console.log('✅ BEP Modülü kaydedildi - MEB Standartlarına Uygun');
    } else {
        setTimeout(registerBEPModule, 100);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', registerBEPModule);
} else {
    registerBEPModule();
}