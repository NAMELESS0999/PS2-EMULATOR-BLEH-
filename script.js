const pfpImages = [
    'goodmanpfp.jpg', 'gtacarlpfp.jpg', 'jamesbondpfp.jpg', 'johnwickpfp.jpg',
    'kratospfp.jpg', 'kratospfpb.jpg', 'luigipfp.jpg', 'mariopfp.jpg',
    'milespfp.jpg', 'pacmangpfp.jpg', 'pyramidheadpfp.jpg', 'rambopfp.jpg',
    'rdrpfp.png', 'shadowpfp.png', 'shrekpfp.jpg', 'silenthillpfp.jpg',
    'sonicpfp.jpg', 'spidermanpfp.jpg'
];

const games = ["God of War II", "Sly Cooper", "Ratchet & Clank", "Jak 3"];

// Fake News Data to make it look incredibly real
const mockHeadlines = [
    "From One Ghost To Cosmic Gods, RPGs Are Unrecognizable After 30 Years",
    "We Were All Wrong About The Latest Patch Update",
    "Video Game Chickens Are Having A Massive Moment Right Now",
    "New Survival Game Skips Major Consoles, And That's A Good Thing",
    "The 90s Throwback In More Ways Than One",
    "Developers Finally Address The Frame Rate Controversy",
    "Next-Gen Graphics Engine Revealed at Tech Expo",
    "Top 10 Hidden Details You Missed In Your Favorite Games"
];
const mockTags = ["Industry News", "Update", "Review", "Trending", "Rumor"];

function init() {
    buildGameCarousel();
    updateClock();
    setInterval(updateClock, 1000);
    initBattery();
}

function buildGameCarousel() {
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
}

// Battery Tracker Logic
async function initBattery() {
    const batteryStatus = document.getElementById('battery-status');
    if ('getBattery' in navigator) {
        try {
            const battery = await navigator.getBattery();
            updateBatteryUI(battery, batteryStatus);
            battery.addEventListener('levelchange', () => updateBatteryUI(battery, batteryStatus));
            battery.addEventListener('chargingchange', () => updateBatteryUI(battery, batteryStatus));
        } catch (e) {
            batteryStatus.innerText = '🔋 100%';
        }
    } else {
        batteryStatus.innerText = '🔋 100%'; // Fallback for browsers that don't support it
    }
}

function updateBatteryUI(battery, element) {
    const level = Math.round(battery.level * 100);
    const isCharging = battery.charging ? '⚡' : '🔋';
    element.innerText = `${isCharging} ${level}%`;
}

// News Feed Generation
function openNews() {
    const grid = document.getElementById('news-grid');
    grid.innerHTML = '';
    
    // Generate 100 random news items
    for(let i=1; i<=100; i++) {
        const randomHeadline = mockHeadlines[Math.floor(Math.random() * mockHeadlines.length)];
        const randomTag = mockTags[Math.floor(Math.random() * mockTags.length)];
        // Use realistic gaming placeholder images
        const imgId = Math.floor(Math.random() * 200) + 100; 
        
        grid.innerHTML += `
            <div class="news-block">
                <img src="https://picsum.photos/id/${imgId}/400/250" alt="News Image">
                <div class="news-content">
                    <span class="news-tag">${randomTag}</span>
                    <h3>${randomHeadline}</h3>
                </div>
            </div>`;
    }
    openMenu('news-view');
}

function showBtHelp() {
    alert("Bluetooth Pairing Tutorial:\n\n1. Hold the Sync/Share button on your controller.\n2. Open your device Settings.\n3. Select the Controller from the Bluetooth list.\n4. Once the light stays solid, you are connected!");
}

function toggleTheme(mode) {
    if(mode === 'light') document.body.classList.add('light-mode');
    else document.body.classList.remove('light-mode');
}

function setFPS(val) {
    alert("System Frame Rate Limit target set to: " + val + " FPS");
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
