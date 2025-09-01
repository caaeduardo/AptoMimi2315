// Eventos JavaScript

// Global variables
let currentDate = new Date();
let events = [
    {
        id: 1,
        title: 'Entrega das Chaves',
        description: 'Recebimento das chaves do apartamento',
        date: '2025-01-15',
        time: '14:00',
        category: 'mudanca'
    },
    {
        id: 2,
        title: 'Compra de Móveis',
        description: 'Visita à loja de móveis para escolher sofá e mesa',
        date: '2025-01-20',
        time: '10:00',
        category: 'compras'
    },
    {
        id: 3,
        title: 'Instalação da Internet',
        description: 'Técnico virá instalar internet e TV a cabo',
        date: '2025-01-25',
        time: '08:00',
        category: 'servicos'
    }
];

let nextEventId = 4;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    generateCalendar();
    renderEventsList();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            // Filter events
            filterEvents(this.dataset.filter);
        });
    });

    // Modal close on outside click
    const modal = document.getElementById('addEventModal');
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeAddEventModal();
        }
    });
}

// Calendar functions
function generateCalendar() {
    const calendarDays = document.getElementById('calendarDays');
    const currentMonthElement = document.getElementById('currentMonth');
    
    // Clear previous calendar
    calendarDays.innerHTML = '';
    
    // Set month/year display
    const monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    currentMonthElement.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    
    // Get first day of month and number of days
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    // Get previous month's last days
    const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
    const daysInPrevMonth = prevMonth.getDate();
    
    // Add previous month's trailing days
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
        const dayElement = createDayElement(daysInPrevMonth - i, true);
        calendarDays.appendChild(dayElement);
    }
    
    // Add current month's days
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = createDayElement(day, false);
        calendarDays.appendChild(dayElement);
    }
    
    // Add next month's leading days
    const totalCells = calendarDays.children.length;
    const remainingCells = 42 - totalCells; // 6 rows × 7 days
    for (let day = 1; day <= remainingCells; day++) {
        const dayElement = createDayElement(day, true);
        calendarDays.appendChild(dayElement);
    }
}

function createDayElement(day, isOtherMonth) {
    const dayElement = document.createElement('div');
    dayElement.className = 'calendar-day';
    dayElement.textContent = day;
    
    if (isOtherMonth) {
        dayElement.classList.add('other-month');
    } else {
        // Check if it's today
        const today = new Date();
        if (currentDate.getFullYear() === today.getFullYear() &&
            currentDate.getMonth() === today.getMonth() &&
            day === today.getDate()) {
            dayElement.classList.add('today');
        }
        
        // Check if day has events
        const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        if (hasEventOnDate(dateString)) {
            dayElement.classList.add('has-event');
        }
    }
    
    return dayElement;
}

function hasEventOnDate(dateString) {
    return events.some(event => event.date === dateString);
}

function previousMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    generateCalendar();
}

function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    generateCalendar();
}

// Events list functions
function renderEventsList(filter = 'all') {
    const eventsList = document.getElementById('eventsList');
    eventsList.innerHTML = '';
    
    // Sort events by date
    const sortedEvents = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Filter events
    const filteredEvents = filter === 'all' ? sortedEvents : sortedEvents.filter(event => event.category === filter);
    
    if (filteredEvents.length === 0) {
        eventsList.innerHTML = '<div class="no-events"><p>Nenhum evento encontrado para este filtro.</p></div>';
        return;
    }
    
    filteredEvents.forEach(event => {
        const eventElement = createEventElement(event);
        eventsList.appendChild(eventElement);
    });
}

function createEventElement(event) {
    const eventDate = new Date(event.date);
    const day = eventDate.getDate();
    const month = eventDate.toLocaleDateString('pt-BR', { month: 'short' });
    
    const eventElement = document.createElement('div');
    eventElement.className = 'event-item';
    eventElement.dataset.category = event.category;
    
    eventElement.innerHTML = `
        <div class="event-date">
            <div class="event-day">${day}</div>
            <div class="event-month">${month}</div>
        </div>
        <div class="event-details">
            <h4>${event.title}</h4>
            <p>${event.description}</p>
            <div class="event-meta">
                <span class="event-time">🕐 ${event.time || 'Horário não definido'}</span>
                <span class="event-category ${event.category}">${getCategoryName(event.category)}</span>
            </div>
        </div>
        <div class="event-actions">
            <button class="btn-icon" onclick="editEvent(${event.id})" title="Editar">✏️</button>
            <button class="btn-icon" onclick="deleteEvent(${event.id})" title="Excluir">🗑️</button>
        </div>
    `;
    
    return eventElement;
}

function getCategoryName(category) {
    const categories = {
        'mudanca': 'Mudança',
        'compras': 'Compras',
        'servicos': 'Serviços',
        'outros': 'Outros'
    };
    return categories[category] || 'Outros';
}

function filterEvents(filter) {
    renderEventsList(filter);
}

// Modal functions
function openAddEventModal() {
    const modal = document.getElementById('addEventModal');
    modal.classList.add('active');
    
    // Reset form
    const form = modal.querySelector('.event-form');
    form.reset();
    
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('eventDate').value = today;
}

function closeAddEventModal() {
    const modal = document.getElementById('addEventModal');
    modal.classList.remove('active');
}

// Event management functions
function addEvent(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    const newEvent = {
        id: nextEventId++,
        title: formData.get('eventTitle'),
        description: formData.get('eventDescription'),
        date: formData.get('eventDate'),
        time: formData.get('eventTime'),
        category: formData.get('eventCategory')
    };
    
    events.push(newEvent);
    
    // Update displays
    generateCalendar();
    renderEventsList();
    
    // Close modal
    closeAddEventModal();
    
    // Show success message
    showNotification('Evento adicionado com sucesso!', 'success');
}

function editEvent(eventId) {
    const event = events.find(e => e.id === eventId);
    if (!event) return;
    
    // For now, just show an alert. In a real app, you'd open an edit modal
    const newTitle = prompt('Novo título:', event.title);
    if (newTitle && newTitle !== event.title) {
        event.title = newTitle;
        generateCalendar();
        renderEventsList();
        showNotification('Evento atualizado com sucesso!', 'success');
    }
}

function deleteEvent(eventId) {
    if (confirm('Tem certeza que deseja excluir este evento?')) {
        events = events.filter(e => e.id !== eventId);
        generateCalendar();
        renderEventsList();
        showNotification('Evento excluído com sucesso!', 'success');
    }
}

// Utility functions
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '600',
        zIndex: '9999',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease'
    });
    
    // Set background color based on type
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8'
    };
    notification.style.background = colors[type] || colors.info;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Save events to localStorage
function saveEvents() {
    localStorage.setItem('apartamento-eventos', JSON.stringify(events));
}

// Load events from localStorage
function loadEvents() {
    const savedEvents = localStorage.getItem('apartamento-eventos');
    if (savedEvents) {
        events = JSON.parse(savedEvents);
        // Update nextEventId
        nextEventId = Math.max(...events.map(e => e.id)) + 1;
    }
}

// Auto-save events when they change
const originalPush = events.push;
events.push = function(...args) {
    const result = originalPush.apply(this, args);
    saveEvents();
    return result;
};

// Load events on page load
loadEvents();