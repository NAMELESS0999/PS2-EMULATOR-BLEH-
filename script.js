// CONSOLE SYSTEM CORE
const ConsoleApp = {
    currentIndex: 0,
    games: [
        { id: 1, title: "God of War II", img: "https://m.media-amazon.com/images/M/MV5BMzI0NmVlZjctN2U0ZS00ZWFmLTlmZGUtYjc3ZTU5YmRjYjVjXkEyXkFqcGdeQXVyMTA0MTM5NjI2._V1_.jpg" },
        { id: 2, title: "Jak and Daxter", img: "https://m.media-amazon.com/images/M/MV5BMTYxNjkxNDY3NV5BMl5BanBnXkFtZTcwNjk0OTcyMQ@@._V1_.jpg" },
        { id: 3, title: "Ratchet & Clank", img: "https://m.media-amazon.com/images/M/MV5BMTYxNjkxNDY3NV5BMl5BanBnXkFtZTcwNjk0OTcyMQ@@._V1_.jpg" }
    ],

    init() {
        this.renderGames();
        this.startClock();
        this.bindEvents();
    },

    renderGames() {
        const rail = document.getElementById('game-rail');
        this.games.forEach((game, i) => {
            const card = document.createElement('div');
            card.className = `game-card ${i === 0 ? 'active' : ''}`;
            card.innerHTML = `<img src="${game.img}" alt="${game.title}">`;
            card.onclick = () => alert("Booting " + game.title);
            rail.appendChild(card);
        });

        // Add dummy slots for sliding
        for(let i=0; i<8; i++) {
            const empty = document.createElement('div');
            empty.className = 'game-card';
            empty.style.opacity = "0.2";
            rail.appendChild(empty);
        }
    },

    bindEvents() {
        window.addEventListener('keydown', (e) => {
            if(e.key === "ArrowRight") this.moveSelection(1);
            if(e.key === "ArrowLeft") this.moveSelection(-1);
            if(e.key === "Enter") alert("System: Initializing Emulator Core...");
        });
    },

    moveSelection(dir) {
        const cards = document.querySelectorAll('.game-card');
        cards[this.currentIndex].classList.remove('active');
        this.currentIndex = Math.max(0, Math.min(this.currentIndex + dir, this.games.length - 1));
        cards[this.currentIndex].classList.add('active');
        cards[this.currentIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        document.getElementById('game-title').innerText = this.games[this.currentIndex].title;
    },

    startClock() {
        const clock = document.getElementById('digital-clock');
        setInterval(() => {
            clock.innerText = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }, 1000);
    }
};

// UI CONTROLS
function openModal(id) { document.getElementById(id).style.display = 'flex'; }
function closeAllModals() { document.querySelectorAll('.overlay').forEach(el => el.style.display = 'none'); }

function uiThemeToggle() {
    const b = document.body;
    b.setAttribute('data-theme', b.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
}

function uiScaleUpdate(val) {
    document.documentElement.style.setProperty('--ui-zoom', val);
}

function uiFpsUpdate(val) {
    document.getElementById('fps-display').innerText = val + " FPS";
}

ConsoleApp.init();
