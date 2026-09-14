// Data management
let posts = JSON.parse(localStorage.getItem('tiktokPosts')) || [];
let currentDate = new Date(2026, 8); // Sept 2026
let currentWeekStart = getMonday(new Date(2026, 8, 16));
let selectedDate = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderPosts();
    populateSelects();
    renderWeekView();
});

// ==================== PAGE SWITCHING ====================
function switchPage(e, page) {
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    if (e.target.classList) {
        e.target.classList.add('active');
    }
    document.getElementById(page).classList.add('active');
    if (page === 'calendar') {
        renderCalendar();
        populateSelects();
    }
    if (page === 'week') {
        renderWeekView();
    }
}

// ==================== CALENDAR FUNCTIONS ====================
function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    document.getElementById('monthYearDisplay').textContent = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const calendarDays = document.getElementById('calendarDays');
    calendarDays.innerHTML = '';

    for (let i = firstDay - 1; i >= 0; i--) {
        const day = daysInPrevMonth - i;
        const cell = document.createElement('div');
        cell.className = 'calendar-day other-month';
        cell.innerHTML = `<div class="calendar-day-num">${day}</div>`;
        calendarDays.appendChild(cell);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayPosts = posts.filter(p => p.date === dateStr);
        const cell = document.createElement('div');
        cell.className = 'calendar-day';

        const today = new Date();
        if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            cell.classList.add('today');
        }

        let html = `<div class="calendar-day-num">${day}</div>`;
        if (dayPosts.length > 0) {
            html += '<div class="calendar-day-posts">';
            dayPosts.forEach(p => {
                html += `<div class="calendar-post-dot" style="background: ${getStatusColor(p.status)};"></div>`;
            });
            html += '</div>';
        }
        cell.innerHTML = html;
        cell.onclick = () => openModalForDate(dateStr);
        calendarDays.appendChild(cell);
    }

    const totalCells = firstDay + daysInMonth;
    const remainingCells = 42 - totalCells;
    for (let day = 1; day <= remainingCells; day++) {
        const cell = document.createElement('div');
        cell.className = 'calendar-day other-month';
        cell.innerHTML = `<div class="calendar-day-num">${day}</div>`;
        calendarDays.appendChild(cell);
    }
}

function getStatusColor(status) {
    const colors = {
        'toFilm': '#3B82F6',
        'toEdit': '#F59E0B',
        'toPost': '#10B981',
        'posted': '#B35A0C'
    };
    return colors[status] || '#B35A0C';
}

function prevMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
}

function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
}

function populateSelects() {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const monthSelect = document.getElementById('monthSelect');
    if (monthSelect) {
        monthSelect.innerHTML = months.map((m, i) => `<option value="${i}">${m}</option>`).join('');
        monthSelect.value = currentDate.getMonth();
    }

    const yearSelect = document.getElementById('yearSelect');
    if (yearSelect) {
        const years = [];
        for (let y = 2026; y <= 2030; y++) years.push(y);
        yearSelect.innerHTML = years.map(y => `<option value="${y}">${y}</option>`).join('');
        yearSelect.value = currentDate.getFullYear();
    }
}

function jumpToMonth() {
    const month = parseInt(document.getElementById('monthSelect').value);
    currentDate.setMonth(month);
    renderCalendar();
}

function jumpToYear() {
    const year = parseInt(document.getElementById('yearSelect').value);
    currentDate.setFullYear(year);
    renderCalendar();
}

// ==================== WEEK VIEW ====================
function getMonday(d) {
    d = new Date(d);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
}

function renderWeekView() {
    const container = document.getElementById('weekDaysContainer');
    if (!container) return;

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(currentWeekStart);
        date.setDate(date.getDate() + i);
        weekDays.push(date);
    }

    // Update week label
    const firstDay = weekDays[0];
    const lastDay = weekDays[6];
    const label = `Week of ${firstDay.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}-${lastDay.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    const weekLabel = document.getElementById('weekLabel');
    if (weekLabel) weekLabel.textContent = label;

    container.innerHTML = '';

    weekDays.forEach((day, idx) => {
        const dateStr = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
        const dayPosts = posts.filter(p => p.date === dateStr);
        const dayName = day.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

        let html = `<div class="week-day-item" style="animation-delay: ${idx * 100}ms;">`;
        html += `<div><div class="week-day-label">${dayName}</div></div>`;
        html += `<div class="week-day-posts">`;

        if (dayPosts.length > 0) {
            dayPosts.forEach(p => {
                html += `
                    <div class="week-post" style="border-left-color: ${getStatusColor(p.status)};">
                        <div>
                            <div class="week-post-title">${p.desc}</div>
                            <div class="week-post-meta">${p.format}</div>
                        </div>
                    </div>
                `;
            });
        } else {
            html += `<button class="week-post-add" onclick="openModalForDate('${dateStr}')">+ Plan content</button>`;
        }

        html += `</div></div>`;
        container.innerHTML += html;
    });
}

function prevWeek() {
    currentWeekStart.setDate(currentWeekStart.getDate() - 7);
    renderWeekView();
}

function nextWeek() {
    currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    renderWeekView();
}

function thisWeek() {
    currentWeekStart = getMonday(new Date());
    renderWeekView();
}

// ==================== MODAL MANAGEMENT ====================
function openModalForDate(dateStr) {
    selectedDate = dateStr;
    const dateObj = new Date(dateStr + 'T00:00');
    document.getElementById('dateSelected').textContent = `Posts for ${dateObj.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`;
    openModal();
}

function openModalDefault() {
    const today = new Date();
    selectedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    document.getElementById('dateSelected').textContent = `Posts for today`;
    openModal();
}

function openModal() {
    document.getElementById('modal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('modal').classList.remove('active');
    document.body.style.overflow = 'auto';
    document.getElementById('postDesc').value = '';
    document.getElementById('postAngle').value = '';
}

// Keyboard shortcut
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// ==================== POST MANAGEMENT ====================
function savePost() {
    const desc = document.getElementById('postDesc').value.trim();
    const format = document.getElementById('postFormat').value;
    const angle = document.getElementById('postAngle').value.trim();
    const effort = document.getElementById('postEffort').value;
    const status = document.getElementById('postStatus').value;

    if (desc && angle && selectedDate) {
        posts.push({
            id: Date.now(),
            date: selectedDate,
            desc,
            format,
            angle,
            effort,
            status
        });
        localStorage.setItem('tiktokPosts', JSON.stringify(posts));
        renderPosts();
        closeModal();
    }
}

function deletePost(id) {
    posts = posts.filter(p => p.id !== id);
    localStorage.setItem('tiktokPosts', JSON.stringify(posts));
    renderPosts();
}

function renderPosts() {
    document.getElementById('toFilm').innerHTML = '';
    document.getElementById('toEdit').innerHTML = '';
    document.getElementById('toPost').innerHTML = '';
    document.getElementById('posted').innerHTML = '';

    const effortEmoji = { 'Bas': '💬', 'Moyen': '🎬', 'Haut': '✨' };

    posts.forEach(post => {
        const card = document.createElement('div');
        card.className = `post-card ${post.status}`;

        const dateDisplay = post.date ? ' • ' + new Date(post.date + 'T00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';

        card.innerHTML = `
            <div class="post-title">${post.desc}</div>
            <div class="post-meta">${post.format}${dateDisplay}</div>
            <div class="post-tags">
                <span class="tag">${effortEmoji[post.effort]} ${post.effort}</span>
                <span class="tag">${post.angle}</span>
            </div>
            <button style="position: absolute; top: 8px; right: 8px; background: none; border: none; color: #8A7059; cursor: pointer; font-size: 18px;" onclick="deletePost(${post.id})">×</button>
        `;
        card.style.position = 'relative';
        document.getElementById(post.status).appendChild(card);
    });

    document.getElementById('plannedCount').textContent = posts.filter(p => p.status !== 'posted').length;
    document.getElementById('boardCount').textContent = posts.filter(p => p.status !== 'posted').length;
    document.getElementById('totalPosts').textContent = posts.length + 8;
    document.getElementById('plannedToday').textContent = new Date().toDateString();
}

// ==================== EXPORT ====================
function exportToIcal() {
    let ical = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Amy Content Hub//NONSGML v1.0//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VTIMEZONE
TZID:Europe/Paris
BEGIN:STANDARD
TZOFFSETFROM:+0200
TZOFFSETTO:+0100
TZNAME:CET
DTSTART:19701025T030000
RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU
END:STANDARD
END:VTIMEZONE
`;

    posts.forEach(post => {
        if (post.date) {
            const date = post.date.replace(/-/g, '');
            const title = post.desc;
            const description = `${post.format}\\nAngle: ${post.angle}\\nEffort: ${post.effort}\\nStatus: ${post.status}`;

            ical += `BEGIN:VEVENT
UID:${post.id}@amycontenthub.local
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART;TZID=Europe/Paris:${date}T100000
DTEND;TZID=Europe/Paris:${date}T110000
SUMMARY:TikTok - ${title}
DESCRIPTION:${description}
CATEGORIES:Content,TikTok
STATUS:TENTATIVE
END:VEVENT
`;
        }
    });

    ical += `END:VCALENDAR`;

    const blob = new Blob([ical], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `amy-content-hub-${new Date().toISOString().split('T')[0]}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
