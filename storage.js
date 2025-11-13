// storage.js - REHBERLİK VERİ YAPILARI EKLENDİ
class StorageManager {
    constructor() {
        this.storageKey = 'dijital_defter_data';
    }

    getData() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : {
            // MEVCUT VERİLER...
            
            // REHBERLİK MODÜLÜ VERİ YAPILARI
            rehberlikOgrenciler: [],
            rehberlikGorusmeleri: [],
            rehberlikGozlemler: [],
            rehberlikTestler: [],
            rehberlikRaporlar: [],
            veliGorusmeleri: [],
            meslekiRehberlik: [],
            rehberlikAyarlar: {
                okulAdi: '',
                rehberlikServisi: '',
                psikolojikDanisman: '',
                sonGuncelleme: new Date().toISOString()
            },
            mebFormlari: {
                gorusmeFormlari: [],
                gozlemFormlari: [],
                degerlendirmeFormlari: []
            },
            rehberlikAktiviteLog: []
        };
    }

    // REHBERLİK ÖZEL FONKSİYONLARI
    addRehberlikOgrenci(ogrenci) {
        const db = this.getData();
        db.rehberlikOgrenciler.push({
            id: 'reh_ogrenci_' + Date.now(),
            ...ogrenci,
            createdAt: new Date().toISOString(),
            status: 'active'
        });
        return this.saveData(db);
    }

    addRehberlikGorusme(gorusme) {
        const db = this.getData();
        db.rehberlikGorusmeleri.push({
            id: 'reh_gorusme_' + Date.now(),
            ...gorusme,
            createdAt: new Date().toISOString()
        });
        return this.saveData(db);
    }

    // Diğer fonksiyonlar aynı kalacak...
}