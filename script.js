const games = [
    { name: "God of War II", img: "" },
    { name: "Jak 3", img: "" },
    { name: "Ratchet & Clank", img: "" },
    { name: "Sly Cooper", img: "" }
];

const pfpImages = [
    'kratospfp.jpg', 'spidermanpfp.jpg', 'gtacarlpfp.jpg', 'mariopfp.jpg', 
    'sonicpfp.jpg', 'johnwickpfp.jpg', 'shrekpfp.jpg', 'pacmanpfp.jpg',
    'shadowpfp.png', 'rdrpfp.png', 'milespfp.jpg', 'goodmanpfp.jpg'
];

function init() {
    const strip = document.getElementById('game-strip');
    strip.innerHTML = ''; // Clean start
    games.forEach((game, index) => {
        const card = document.createElement('div');
        card.className = `game-card ${index === 0 ? 'active' : ''}`;
        card.innerHTML = `<img src="${game.img || 'https://via.placeholder.com/300?text=PS2'}" style="width:100%; height:100%; border-radius:8px;">`;
        card.onclick = () => {
            document.querySelectorAll('.game-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            document.getElementById('game-title-display').innerText = game.name;
        };
        strip.appendChild(card);
    });
    updateClock();
    setInterval(updateClock, 1000);
}

function updateClock() {
    const now = new Date();
    document.getElementById('clock').innerText = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// PFP Logic
function openPfpMenu() {
    const grid = document.getElementById('pfp-grid');
    grid.innerHTML = '';
    pfpImages.forEach(imgName => {
        const img = document.createElement('img');
        img.src = `pfp/${imgName}`;
        img.className = 'pfp-option';
        img.onclick = () => {
            document.getElementById('main-avatar').style.backgroundImage = `url('pfp/${imgName}')`;
            closePfpMenu();
        };
        grid.appendChild(img);
    });
    document.getElementById('pfp-modal').classList.add('overlay-show');
}

function closePfpMenu() { document.getElementById('pfp-modal').classList.remove('overlay-show'); }

// Universal Menu Controls
function openMenu(id) {
    const menu = document.getElementById(id);
    if(menu) menu.classList.add('overlay-show');
}

function closeMenu(id) {
    const menu = document.getElementById(id);
    if(menu) menu.classList.remove('overlay-show');
}

window.onload = init;
