// CONSOLE SYSTEM CORE
const Console = {
    currentIndex: 0,
    games: [
        { title: "God of War II", img: "https://m.media-amazon.com/images/M/MV5BMzI0NmVlZjctN2U0ZS00ZWFmLTlmZGUtYjc3ZTU5YmRjYjVjXkEyXkFqcGdeQXVyMTA0MTM5NjI2._V1_.jpg" },
        { title: "Jak and Daxter", img: "https://m.media-amazon.com/images/M/MV5BMTYxNjkxNDY3NV5BMl5BanBnXkFtZTcwNjk0OTcyMQ@@._V1_.jpg" },
        { title: "Ratchet & Clank", img: "https://m.media-amazon.com/images/M/MV5BMTYxNjkxNDY3NV5BMl5BanBnXkFtZTcwNjk0OTcyMQ@@._V1_.jpg" }
    ],

    init() {
        this.renderCarousel();
        this.updateClock();
        window.addEventListener('keydown', (e) => {
            if(e.key === "ArrowRight") this.move(1);
            if(e.key === "ArrowLeft") this.move(-1);
        });
    },

    renderCarousel() {
        const rail = document.getElementById('main-rail');
        if(!rail) return;
        rail.innerHTML = '';
        this.games.forEach((game, i) => {
            const card = document.createElement('div');
            card.className = `game-card ${i === 0 ? 'active' : ''}`;
            card.innerHTML = `<img src="${game.img}" alt="${game.title}">`;
            rail.appendChild(card);
        });
    },

    move(dir) {
        const cards = document.querySelectorAll('.game-card');
        cards[this.currentIndex].classList.remove('active');
        this.currentIndex = Math.max(0, Math.min(this.currentIndex + dir, this.games.length - 1));
        cards[this.currentIndex].classList.add('active');
        cards[this.currentIndex].scrollIntoView({ behavior: 'smooth', inline: 'center' });
    },

    updateClock() {
        setInterval(() => {
            const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            if(document.getElementById('system-time')) document.getElementById('system-time').innerText = time;
        }, 1000);
    }
};

// MODAL & NEWS LOGIC
function openNavMenu(menuId) {
    const overlay = document.getElementById('modal-overlay');
    const content = document.getElementById(menuId);
    if(overlay && content) {
        overlay.classList.add('show');
        content.classList.add('active');
        if(menuId === 'news-view') loadGlobalNews();
    }
}

function closeNavMenu() {
    document.getElementById('modal-overlay').classList.remove('show');
    document.querySelectorAll('.modal-content-wrapper').forEach(m => m.classList.remove('active'));
}

async function loadGlobalNews() {
    const container = document.getElementById('news-list-container');
    const feed = "https://api.rss2json.com/v1/api.json?rss_url=https://www.gamespot.com/feeds/news/";
    try {
        const res = await fetch(feed);
        const data = await res.json();
        container.innerHTML = data.items.slice(0, 10).map(item => `
            <div style="display:flex; gap:15px; background:rgba(255,255,255,0.05); padding:10px; margin-bottom:10px; border-radius:8px; cursor:pointer;" onclick="window.open('${item.link}', '_blank')">
                <img src="${item.thumbnail}" style="width:60px; height:60px; object-fit:cover; border-radius:4px;">
                <div>
                    <h4 style="margin:0; font-size:0.9rem;">${item.title}</h4>
                    <small style="color:cyan;">IGDB Global Feed</small>
                </div>
            </div>
        `).join('');
    } catch (e) { container.innerHTML = "Offline: Sync failed."; }
}

// Start everything
Console.init();
