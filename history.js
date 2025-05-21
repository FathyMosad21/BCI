/* // وظيفة للحصول على السجل من localStorage
function getHistory() {
    return JSON.parse(localStorage.getItem('keyboardHistory') || '[]');
}

// وظيفة لحفظ السجل في localStorage
function saveHistory(history) {
    localStorage.setItem('keyboardHistory', JSON.stringify(history));
}

// وظيفة لعرض السجل
function displayHistory() {
    const history = getHistory();
    const tableBody = document.getElementById('historyTableBody');
    const noHistoryMessage = document.getElementById('noHistoryMessage');

    // مسح المحتوى الحالي
    tableBody.innerHTML = '';

    if (history.length === 0) {
        noHistoryMessage.style.display = 'block';
    } else {
        noHistoryMessage.style.display = 'none';
        
        history.forEach((entry, index) => {
            const row = document.createElement('tr');
            
            // إنشاء خلية النص مع إمكانية التوسيع للنصوص الطويلة
            const textCell = document.createElement('td');
            textCell.textContent = entry.text;
            textCell.addEventListener('click', function() {
                this.classList.toggle('expanded-cell');
            });
            
            // إنشاء خلية التاريخ
            const dateCell = document.createElement('td');
            dateCell.textContent = entry.date;
            
            // إنشاء خلية الإجراءات مع زر الحذف
            const actionCell = document.createElement('td');
            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-btn';
            deleteButton.innerHTML = '<span>×</span> Delete';
            deleteButton.onclick = function() {
                deleteHistoryEntry(index);
            };
            actionCell.appendChild(deleteButton);
            
            // إضافة الخلايا إلى الصف
            row.appendChild(textCell);
            row.appendChild(dateCell);
            row.appendChild(actionCell);
            
            tableBody.appendChild(row);
        });
    }
}

// وظيفة لحذف إدخال من السجل
function deleteHistoryEntry(index) {
    const history = getHistory();
    history.splice(index, 1);
    saveHistory(history);
    displayHistory();
}

// تسجيل الخروج
document.getElementById('logoutBtn').addEventListener('click', () => {
    window.location.href = 'login.html';
});

// تحميل السجل عند فتح الصفحة
document.addEventListener('DOMContentLoaded', displayHistory); */
// وظيفة للحصول على السجل من localStorage
function getHistory() {
    return JSON.parse(localStorage.getItem('keyboardHistory') || '[]');
}

// وظيفة لحفظ السجل في localStorage
function saveHistory(history) {
    localStorage.setItem('keyboardHistory', JSON.stringify(history));
}

// وظيفة لعرض السجل
function displayHistory() {
    const history = getHistory();
    const tableBody = document.getElementById('historyTableBody');
    const noHistoryMessage = document.getElementById('noHistoryMessage');

    // مسح المحتوى الحالي
    tableBody.innerHTML = '';

    if (history.length === 0) {
        noHistoryMessage.style.display = 'block';
    } else {
        noHistoryMessage.style.display = 'none';
        
        history.forEach((entry, index) => {
            const row = document.createElement('tr');
            
            // إنشاء خلية النص مع إمكانية التوسيع للنصوص الطويلة
            const textCell = document.createElement('td');
            textCell.textContent = entry.text;
            textCell.addEventListener('click', function() {
                this.classList.toggle('expanded-cell');
            });
            
            // إنشاء خلية التاريخ
            const dateCell = document.createElement('td');
            dateCell.textContent = entry.date;
            
            // إنشاء خلية الإجراءات مع زر الحذف
            const actionCell = document.createElement('td');
            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-btn';
            deleteButton.innerHTML = '<span>×</span> Delete';
            deleteButton.onclick = function() {
                deleteHistoryEntry(index);
            };
            actionCell.appendChild(deleteButton);
            
            // إضافة الخلايا إلى الصف
            row.appendChild(textCell);
            row.appendChild(dateCell);
            row.appendChild(actionCell);
            
            tableBody.appendChild(row);
        });
    }
}

// وظيفة لحذف إدخال من السجل
function deleteHistoryEntry(index) {
    const history = getHistory();
    
    // إضافة تأثير الاختفاء قبل الحذف الفعلي
    const row = document.getElementById('historyTableBody').children[index];
    row.classList.add('deleting');
    
    setTimeout(() => {
        history.splice(index, 1);
        saveHistory(history);
        displayHistory();
    }, 300); // تأخير قليل للسماح بالتأثير البصري
}

// تسجيل الخروج
document.getElementById('logoutBtn').addEventListener('click', () => {
    window.location.href = 'login.html';
});

// تحميل السجل عند فتح الصفحة
document.addEventListener('DOMContentLoaded', displayHistory);