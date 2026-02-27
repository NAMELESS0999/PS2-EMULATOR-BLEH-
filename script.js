/**
 * SWITCH UI ENGINE v3.0
 */

const App = {
    index: 0,
    games: [
        { title: "God of War II", cover: "https://m.media-amazon.com/images/M/MV5BMzI0NmVlZjctN2U0ZS00ZWFmLTlmZGUtYjc3ZTU5YmRjYjVjXkEyXkFqcGdeQXVyMTA0MTM5NjI2._V1_.jpg" },
        { title: "Jak 3", cover: "https://m.media-amazon.com/images/M/MV5BMTYxNjkxNDY3NV5BMl5BanBnXkFtZTcwNjk0OTcyMQ@@._V1_.jpg" },
        { title: "Ratchet: Deadlocked", cover: "https://m.media-amazon.com/images/M/MV5BMTYxNjkxNDY3NV5BMl5BanBnXkFtZTcwNjk0OTcyMQ@@._V1_.jpg" },
        { title: "Sly Cooper", cover: "https://m.media-amazon.com/images/M/MV5BN2ZkYjdiZDMtMWI2Mi00Y2FlLWJiOWMtYmZlZTRlY2M5YTQ2XkEyXkFqcGdeQXVyMTA0MTM5NjI2._V1_.jpg" }
    ],

    start() {
        this.render();
        this.listen();
        this.clock();
    },

    render() {
        const strip = document.getElementById('game-strip');
        strip.innerHTML = '';
        
        this.games.forEach((g, i) => {
            const card = document.createElement('div');
            card.className = `card ${i === 0 ? 'active' : ''}`;
            card.innerHTML = `<img src="${g.cover}" alt="${g.title}">`;
            card.onclick = () => this.focus(i);
            strip.appendChild(card);
        });

        // Add blank padding slots
        for(let i=0; i<6; i++) {
            const empty = document.createElement('div');
            empty.className = 'card';
            empty.style.opacity = "0.1";
            strip.appendChild(empty);
        }
    },

    focus(idx) {
        const cards = document.querySelectorAll('.card');
        cards[this.index].classList.remove('active');
        
        this.index = idx;
        const active = cards[this.index];
        active.classList.add('active');
        
        document.getElementById('selection-name').innerText = this.games[idx]?.title || "System Software";
        active.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    },

    listen() {
        window.addEventListener('keydown', (e) => {
            if(e.key === "ArrowRight") this.focus(Math.min(this.index + 1, this.games.length - 1));
            if(e.key === "ArrowLeft") this.focus(Math.max(this.index - 1, 0));
        });
    },

    clock() {
        setInterval(() => {
            document.getElementById('clock-txt').innerText = new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
        }, 1000);
    }
};

// UI HELPER FUNCTIONS
function openNavMenu(menuId) {
    const overlay = document.getElementById('modal-overlay');
    const content = document.getElementById(menuId);
    
    overlay.classList.add('show');
    content.classList.add('active');

    // Add this part below:
    if(menuId === 'news-view') {
        loadGlobalNews();
    }
}
    
    // Hide all views first
    document.getElementById('view-set').className = 'view-hide';
    document.getElementById('view-ctrl').className = 'view-hide';
    
    // Show specific view
    if(type === 'set') document.getElementById('view-set').className = 'view-show';
    if(type === 'ctrl') document.getElementById('view-ctrl').className = 'view-show';
}

function closeModals() {
    document.getElementById('modal-overlay').className = 'overlay-hide';
}

function swapTheme() {
    const b = document.body;
    b.setAttribute('data-theme', b.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
}

function rescaleUI(v) {
    document.documentElement.style.setProperty('--scale', v);
}

function updateFPS(v) {
    document.getElementById('fps-counter').innerText = v + " FPS";
}

App.start();
