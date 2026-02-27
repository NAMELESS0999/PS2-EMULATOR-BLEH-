const pfpImages = [
    'kratospfp.jpg', 'spidermanpfp.jpg', 'gtacarlpfp.jpg', 'mariopfp.jpg', 
    'sonicpfp.jpg', 'johnwickpfp.jpg', 'shrekpfp.jpg', 'pacmanpfp.jpg',
    'shadowpfp.png', 'rdrpfp.png', 'milespfp.jpg', 'goodmanpfp.jpg'
];

const games = ["God of War II", "Jak 3", "Ratchet & Clank", "Sly Cooper"];

function init() {
    const strip = document.getElementById('game-strip');
    strip.innerHTML = ''; 

    games.forEach((name, i) => {
        const card = document.createElement('div');
        card.className = `game-card ${i === 0 ? 'active' : ''}`;
        card.onclick = () => {
            document.querySelectorAll('.game-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            document.getElementById('game-title-display').innerText = name;
        };
        strip.appendChild(card);
    });

    updateClock();
    setInterval(updateClock, 1000);
}

function updateClock() {
    const clockEl = document.getElementById('clock');
    if (clockEl) {
        const now = new Date();
        clockEl.innerText = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
}

// Menu Controls
function openMenu(id) {
    const menu = document.getElementById(id);
    if (menu) menu.classList.add('active');
}

function closeMenu(id) {
    const menu = document.getElementById(id);
    if (menu) menu.classList.remove('active');
}

// Profile Picture Gallery Logic
function openPfpMenu() {
    const grid = document.getElementById('pfp-grid');
    grid.innerHTML = '';
    pfpImages.forEach(img => {
        const el = document.createElement('img');
        el.src = `pfp/${img}`;
        el.className = 'pfp-option';
        el.onclick = () => {
            document.getElementById('main-avatar').style.backgroundImage = `url('pfp/${img}')`;
            closePfpMenu();
        };
        grid.appendChild(el);
    });
    document.getElementById('pfp-modal').classList.add('active');
}

function closePfpMenu() {
    document.getElementById('pfp-modal').classList.remove('active');
}

window.onload = init;
