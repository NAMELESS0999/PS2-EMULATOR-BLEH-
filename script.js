const pfpImages = [
    'goodmanpfp.jpg', 'gtacarlpfp.jpg', 'jamesbondpfp.jpg', 'johnwickpfp.jpg',
    'kratospfp.jpg', 'kratospfpb.jpg', 'luigipfp.jpg', 'mariopfp.jpg',
    'milespfp.jpg', 'pacmangpfp.jpg', 'pyramidheadpfp.jpg', 'rambopfp.jpg',
    'rdrpfp.png', 'shadowpfp.png', 'shrekpfp.jpg', 'silenthillpfp.jpg',
    'sonicpfp.jpg', 'spidermanpfp.jpg'
];

function init() {
    const strip = document.getElementById('game-strip');
    const games = ["God of War II", "Jak 3", "Ratchet & Clank", "Sly Cooper"];
    
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

function openNews() {
    const grid = document.getElementById('news-grid');
    grid.innerHTML = '';
    for(let i=1; i<=100; i++) {
        grid.innerHTML += `
            <div class="news-block">
                <img src="https://picsum.photos/seed/${i+50}/300/200">
                <h3>Latest Gaming Update #${i}</h3>
            </div>`;
    }
    openMenu('news-view');
}

function showBtHelp() {
    alert("Bluetooth Pairing Tutorial:\n1. Hold the Sync/Share button on your controller.\n2. Open your device Settings.\n3. Select the Controller from the Bluetooth list.\n4. Once the light stays solid, you are connected!");
}

function toggleTheme(mode) {
    if(mode === 'light') document.body.classList.add('light-mode');
    else document.body.classList.remove('light-mode');
}

function setFPS(val) {
    alert("System FPS set to " + val);
}

function openPfpMenu() {
    const grid = document.getElementById('pfp-grid');
    grid.innerHTML = '';
    pfpImages.forEach(img => {
        const el = document.createElement('img');
        el.src = `pfp/${img}`;
        el.className = 'pfp-option';
        el.onclick = () => {
            document.getElementById('main-avatar').style.backgroundImage = `url('pfp/${img}')`;
            closeMenu('pfp-modal');
        };
        grid.appendChild(el);
    });
    openMenu('pfp-modal');
}

function openMenu(id) { document.getElementById(id).classList.add('active'); }
function closeMenu(id) { document.getElementById(id).classList.remove('active'); }

function updateClock() {
    const now = new Date();
    document.getElementById('clock').innerText = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

window.onload = init;
