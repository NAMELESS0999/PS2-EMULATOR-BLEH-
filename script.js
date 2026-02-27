/** * CONSOLE ENGINE v2.0 
 * Features: Dynamic Scaling, Animated Modals, Scroll-Centering
 */

const Console = {
    currentIndex: 0,
    games: [
        { title: "God of War II", img: "https://m.media-amazon.com/images/M/MV5BMzI0NmVlZjctN2U0ZS00ZWFmLTlmZGUtYjc3ZTU5YmRjYjVjXkEyXkFqcGdeQXVyMTA0MTM5NjI2._V1_.jpg" },
        { title: "Jak and Daxter", img: "https://m.media-amazon.com/images/M/MV5BMTYxNjkxNDY3NV5BMl5BanBnXkFtZTcwNjk0OTcyMQ@@._V1_.jpg" },
        { title: "Ratchet & Clank", img: "https://m.media-amazon.com/images/M/MV5BMTYxNjkxNDY3NV5BMl5BanBnXkFtZTcwNjk0OTcyMQ@@._V1_.jpg" },
        { title: "Sly Cooper", img: "https://m.media-amazon.com/images/M/MV5BN2ZkYjdiZDMtMWI2Mi00Y2FlLWJiOWMtYmZlZTRlY2M5YTQ2XkEyXkFqcGdeQXVyMTA0MTM5NjI2._V1_.jpg" }
    ],

    init() {
        this.renderCarousel();
        this.setupEventListeners();
        this.updateClock();
        console.log("Console initialized. Monitor resolution scaling active.");
    },

    renderCarousel() {
        const rail = document.getElementById('main-rail');
        rail.innerHTML = ''; // Clear

        this.games.forEach((game, i) => {
            const card = document.createElement('div');
            card.className = `game-card ${i === 0 ? 'active' : ''}`;
            card.innerHTML = `<img src="${game.img}" alt="${game.title}">`;
            
            // Interaction
            card.addEventListener('mouseenter', () => this.setSelection(i));
            card.onclick = () => alert("Launching " + game.title);
            
            rail.appendChild(card);
        });

        // Add padding slots
        for(let i=0; i<6; i++) {
            const slot = document.createElement('div');
            slot.className = 'game-card empty-slot';
            slot.style.opacity = "0.1";
            rail.appendChild(slot);
        }
    },

    setSelection(index) {
        const cards = document.querySelectorAll('.game-card');
        cards[this.currentIndex].classList.remove('active');
        
        this.currentIndex = index;
        const activeCard = cards[this.currentIndex];
        activeCard.classList.add('active');
        
        // Update title
        document.getElementById('current-title').innerText = this.games[index] ? this.games[index].title : "System Software";
        
        // Center the card smoothly
        activeCard.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    },

    setupEventListeners() {
        window.addEventListener('keydown', (e) => {
            if(e.key === "ArrowRight") this.setSelection(Math.min(this.currentIndex + 1, this.games.length - 1));
            if(e.key === "ArrowLeft") this.setSelection(Math.max(this.currentIndex - 1, 0));
        });
    },

    updateClock() {
        const clock = document.getElementById('system-time');
        setInterval(() => {
            const now = new Date();
            clock.innerText = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }, 1000);
    }
};

// GLOBAL UI HELPERS
function openNavMenu(menuId) {
    const overlay = document.getElementById('modal-overlay');
    const content = document.getElementById(menuId);
    
    overlay.classList.add('show');
    content.classList.add('active');
}

function closeNavMenu() {
    const overlay = document.getElementById('modal-overlay');
    overlay.classList.remove('show');
    document.querySelectorAll('.modal-content-wrapper').forEach(m => m.classList.remove('active'));
}

function updateUIScale(val) {
    document.documentElement.style.setProperty('--scale-factor', val);
}

function toggleSystemTheme() {
    const body = document.body;
    const isDark = body.getAttribute('data-theme') === 'dark';
    body.setAttribute('data-theme', isDark ? 'light' : 'dark');
}

function updateFPSCap(val) {
    document.getElementById('live-fps').innerText = val;
}

// Start
Console.init();
