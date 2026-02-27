// CONSOLE SYSTEM CORE
const UI = {
    index: 0,
    games: [
        { name: "God of War II", img: "https://m.media-amazon.com/images/M/MV5BMzI0NmVlZjctN2U0ZS00ZWFmLTlmZGUtYjc3ZTU5YmRjYjVjXkEyXkFqcGdeQXVyMTA0MTM5NjI2._V1_.jpg" },
        { name: "Jak 3", img: "https://m.media-amazon.com/images/M/MV5BMTYxNjkxNDY3NV5BMl5BanBnXkFtZTcwNjk0OTcyMQ@@._V1_.jpg" },
        { name: "Ratchet & Clank", img: "https://m.media-amazon.com/images/M/MV5BMTYxNjkxNDY3NV5BMl5BanBnXkFtZTcwNjk0OTcyMQ@@._V1_.jpg" }
    ],

    start() {
        this.render();
        this.listen();
        setInterval(() => {
            document.getElementById('clock').innerText = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        }, 1000);
    },

    render() {
        const strip = document.getElementById('game-strip');
        strip.innerHTML = this.games.map((g, i) => `
            <div class="game-card ${i === 0 ? 'active' : ''}">
                <img src="${g.img}">
            </div>
        `).join('');
    },

    move(dir) {
        const cards = document.querySelectorAll('.game-card');
        cards[this.index].classList.remove('active');
        this.index = Math.max(0, Math.min(this.index + dir, this.games.length - 1));
        cards[this.index].classList.add('active');
        document.getElementById('game-title-display').innerText = this.games[this.index].name;
        cards[this.index].scrollIntoView({ behavior: 'smooth', inline: 'center' });
    },

    listen() {
        window.addEventListener('keydown', (e) => {
            if(e.key === "ArrowRight") this.move(1);
            if(e.key === "ArrowLeft") this.move(-1);
        });
    }
};

function openMenu(viewId) {
    document.getElementById('overlay-layer').classList.add('overlay-show');
    document.querySelectorAll('.menu-view').forEach(v => v.style.display = 'none');
    document.getElementById(viewId).style.display = 'block';
    if(viewId === 'news-view') loadIGDBNews();
}

function closeMenu() {
    document.getElementById('overlay-layer').classList.remove('overlay-show');
}

async function loadIGDBNews() {
    const feed = document.getElementById('news-feed');
    try {
        const res = await fetch("https://api.rss2json.com/v1/api.json?rss_url=https://www.gamespot.com/feeds/news/");
        const data = await res.json();
        feed.innerHTML = data.items.slice(0, 5).map(item => `
            <div class="news-item" onclick="window.open('${item.link}')">
                <img src="${item.thumbnail}">
                <div>
                    <h4 style="margin:0">${item.title}</h4>
                    <p style="margin:5px 0 0; font-size:12px; color:cyan;">Global Gaming Update</p>
                </div>
            </div>
        `).join('');
    } catch (e) { feed.innerHTML = "System Offline."; }
}

function adjustScale(val) {
    document.getElementById('master-ui').style.transform = `scale(${val})`;
}

UI.start();
