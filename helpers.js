// Yardımcı fonksiyonlar
class HelperManager {
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    getTodayDateString() {
        const today = new Date();
        return today.toISOString().split('T')[0];
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }

    getGradeColor(grade) {
        if (grade === '-' || grade === '') return 'text-gray-500';
        const numGrade = parseFloat(grade);
        if (numGrade >= 85) return 'text-green-600';
        if (numGrade >= 70) return 'text-blue-600';
        if (numGrade >= 50) return 'text-yellow-600';
        return 'text-red-600';
    }

    generateId(prefix = 'id') {
        return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}

window.helperManager = new HelperManager();