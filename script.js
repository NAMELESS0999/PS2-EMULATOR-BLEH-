/**
 * JS CONSOLE CORE ENGINE
 * Purpose: Handle Switch-like UI interactions and system settings
 */

// 1. SYSTEM STATE
const state = {
    activeGame: 0,
    isMenuOpen: false,
    theme: 'dark',
    fps: 60
};

// 2. GAME LIBRARY DATA
const gameLibrary = [
    { id: 1, title: "God of War II", cover: "https://m.media-amazon.com/images/M/MV5BMzI0NmVlZjctN2U0ZS00ZWFmLTlmZGUtYjc3ZTU5YmRjYjVjXkEyXkFqcGdeQXVyMTA0MTM5NjI2._V1_.jpg" },
    { id: 2, title: "Jak 3", cover: "https://m.media-amazon.com/images/M/MV5BMTYxNjkxNDY3NV5BMl5BanBnXkFtZTcwNjk0OTcyMQ@@._V1_.jpg" },
    { id: 3, title: "Ratchet: Deadlocked", cover: "https://m.media-amazon.com/images/M/MV5BMTYxNjkxNDY3NV5BMl5BanBnXkFtZTcwNjk0OTcyMQ@@._V1_.jpg" },
    { id: 4, title: "Sly 2: Band of Thieves", cover: "https://m.media-amazon.com/images/M/MV5BMTYxNjkxNDY3NV5BMl5BanBnXkFtZTcwNjk0OTcyMQ@@._V1_.jpg" }
];

// 3. INITIALIZATION
function initConsole() {
    const container = document.getElementById('game-container');
    
    // Inject games + 5 empty slots
    gameLibrary.forEach((game, index) => {
        const card = document.createElement('div');
        card.className = 'game-card';
        if(index === 0) card.classList.add('focused');
        card.innerHTML = `<img src="${game.cover}" alt="${game.title}">`;
        card.onclick = () => bootGame(game.title);
        container.appendChild(card);
    });

    for(let i=0; i<6; i++) {
        const empty = document.createElement('div');
        empty.className = 'game-card';
        empty.style.opacity = "0.2";
        container.appendChild(empty);
    }

    startClock();
    initKeyHandlers();
}

// 4. UI LOGIC FUNCTIONS
function toggleTheme() {
    state.theme = (state.theme === 'dark') ? 'light' : 'dark';
    document.body.setAttribute('data-theme', state.theme);
}

function rescaleUI(value) {
    document.documentElement.style.setProperty('--zoom', value);
}

function limitFPS(value) {
    state.fps = value;
    document.getElementById('fps-counter').innerText = value + " FPS";
}

function openMenu(id) {
    state.isMenuOpen = true;
    document.getElementById(id).style.display = 'flex';
}

function closeMenus() {
    state.isMenuOpen = false;
    const overlays = document.querySelectorAll('.overlay');
    overlays.forEach(o => o.style.display = 'none');
}

// 5. KEYBOARD NAVIGATION ENGINE
function initKeyHandlers() {
    window.addEventListener('keydown', (e) => {
        if(state.isMenuOpen) {
            if(e.key === "Escape" || e.key === "b") closeMenus();
            return;
        }

        const cards = document.querySelectorAll('.game-card');
        cards[state.activeGame].classList.remove('focused');

        if(e.key === "ArrowRight" && state.activeGame < cards.length - 1) {
            state.activeGame++;
        } else if(e.key === "ArrowLeft" && state.activeGame > 0) {
            state.activeGame--;
        } else if(e.key === "Enter") {
            bootGame(gameLibrary[state.activeGame]?.title || "Empty Slot");
        }

        cards[state.activeGame].classList.add('focused');
        cards[state.activeGame].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        
        // Update selection title
        document.getElementById('active-title').innerText = gameLibrary[state.activeGame]?.title || "System Slot";
    });
}

function bootGame(title) {
    alert("🚀 BOOTING SYSTEM: Initializing Play! Wasm Core for " + title);
}

function startClock() {
    setInterval(() => {
        const now = new Date();
        document.getElementById('clock-display').innerText = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }, 1000);
}

// Start the console
initConsole();
