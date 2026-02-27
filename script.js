// --- Data & State ---
let currentUser = null;
let controllerIndex = 0;
let lastButtonPress = 0;

const pfpImages = [
    'goodmanpfp.jpg', 'gtacarlpfp.jpg', 'jamesbondpfp.jpg', 'johnwickpfp.jpg',
    'kratospfp.jpg', 'kratospfpb.jpg', 'luigipfp.jpg', 'mariopfp.jpg',
    'milespfp.jpg', 'pacmangpfp.jpg', 'pyramidheadpfp.jpg', 'rambopfp.jpg',
    'rdrpfp.png', 'shadowpfp.png', 'shrekpfp.jpg', 'silenthillpfp.jpg',
    'sonicpfp.jpg', 'spidermanpfp.jpg'
];
const games = ["God of War II", "Sly Cooper", "Ratchet & Clank", "Jak 3"];

// --- Initialization ---
function init() {
    checkLogin();
    buildGameCarousel();
    updateClock();
    setInterval(updateClock, 1000);
    initBattery();
    window.addEventListener("gamepadconnected", (e) => {
        document.getElementById('active-gamepad').innerHTML = `Controller Connected <span class="status-badge">Online</span>`;
        requestAnimationFrame(gamepadLoop);
    });
}

// --- Login & Save System ---
function checkLogin() {
    const savedData = localStorage.getItem('ps2_user_profile');
    if (savedData) {
        currentUser = JSON.parse(savedData);
        applyUserData();
        document.getElementById('login-screen').classList.remove('active');
    } else {
        document.getElementById('login-avatar').style.backgroundImage = `url('pfp/kratospfp.jpg')`;
    }
}

function handleLogin() {
    const user = document.getElementById('username-input').value.trim();
    const pass = document.getElementById('password-input').value;
    
    if(!user || !pass) return;

    // Check if returning user
    const savedData = localStorage.getItem('ps2_user_profile');
    if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed.username === user && parsed.password !== pass) {
            document.getElementById('login-error').style.display = 'block';
            return;
        }
    }

    // Create or Log In
    currentUser = savedData ? JSON.parse(savedData) : { username: user, password: pass, pfp: 'goodmanpfp.jpg', theme: 'dark', fps: 60 };
    if(!savedData) saveProfile(); 
    
    applyUserData();
    document.getElementById('login-screen').classList.remove('active');
}

function handleLogout() {
    document.getElementById('login-screen').classList.add('active');
    document.getElementById('password-input').value = '';
    document.getElementById('login-error').style.display = 'none';
}

function saveProfile() {
    if(currentUser) localStorage.setItem('ps2_user_profile', JSON.stringify(currentUser));
}

function applyUserData() {
    document.getElementById('display-username').innerText = currentUser.username;
    document.getElementById('main-avatar').style.backgroundImage = `url('pfp/${currentUser.pfp}')`;
    document.getElementById('login-avatar').style.backgroundImage = `url('pfp/${currentUser.pfp}')`;
    toggleTheme(currentUser.theme, false);
}

// --- Controller Navigation (Gamepad API) ---
function gamepadLoop() {
    const gamepads = navigator.getGamepads();
    if (!gamepads || !gamepads[0]) return;
    const gp = gamepads[0];
    const now = Date.now();

    // Prevent button spamming (cooldown of 200ms)
    if (now - lastButtonPress > 200) {
        // Find all visible interactable elements
        const focusables = Array.from(document.querySelectorAll('.focusable')).filter(el => el.offsetParent !== null);
        
        if(focusables.length > 0) {
            // D-Pad or Left Stick Movement
            if (gp.buttons[15]?.pressed || gp.axes[1] > 0.5 || gp.buttons[14]?.pressed || gp.axes[0] > 0.5) { // Right/Down
                focusables[controllerIndex]?.classList.remove('focused');
                controllerIndex = (controllerIndex + 1) % focusables.length;
                lastButtonPress = now;
            } else if (gp.buttons[12]?.pressed || gp.axes[1] < -0.5 || gp.buttons[13]?.pressed || gp.axes[0] < -0.5) { // Left/Up
                focusables[controllerIndex]?.classList.remove('focused');
                controllerIndex = (controllerIndex - 1 + focusables.length) % focusables.length;
                lastButtonPress = now;
            }
            
            // Highlight current
            if(focusables[controllerIndex]) {
                focusables.forEach(f => f.classList.remove('focused'));
                focusables[controllerIndex].classList.add('focused');
                focusables[controllerIndex].scrollIntoView({ block: "nearest", inline: "nearest" });
            }

            // 'A' or 'Cross' Button to Click
            if (gp.buttons[0]?.pressed) {
                focusables[controllerIndex].click();
                lastButtonPress = now;
                controllerIndex = 0; // Reset index on new screen
            }
        }
    }
    requestAnimationFrame(gamepadLoop);
}

// --- Live Real News Feed (RSS Proxy) ---
async function openNews() {
    const grid = document.getElementById('news-grid');
    grid.innerHTML = '<p>Fetching live feed...</p>';
    openMenu('news-view');
    
    try {
        // Using a free RSS-to-JSON proxy to pull REAL gaming news from PushSquare/IGN style feeds
        const response = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://www.gameinformer.com/news.xml');
        const data = await response.json();
        
        grid.innerHTML = '';
        data.items.forEach((item) => {
            // Extract image from description or use placeholder
            const imgMatch = item.description.match(/src="(.*?)"/);
            const imgSrc = imgMatch ? imgMatch[1] : 'https://picsum.photos/seed/'+Math.random()+'/400/200';
            
            grid.innerHTML += `
                <div class="news-block focusable" onclick="window.open('${item.link}', '_blank')">
                    <img src="${imgSrc}" alt="Article Image">
                    <div class="news-content">
                        <h3>${item.title}</h3>
                    </div>
                </div>`;
        });
    } catch(err) {
        grid.innerHTML = '<p>Failed to load live news. Check your internet connection.</p>';
    }
}

// --- Standard UI Functions ---
function buildGameCarousel() {
    const strip = document.getElementById('game-strip');
    strip.innerHTML = '';
    games.forEach((name, i) => {
        const card = document.createElement('div');
        card.className = `game-card focusable ${i === 0 ? 'active' : ''}`;
        card.onclick = () => {
            document.querySelectorAll('.game-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            document.getElementById('game-title-display').innerText = name;
        };
        strip.appendChild(card);
    });
}

async function initBattery() {
    const batteryStatus = document.getElementById('battery-status');
    if ('getBattery' in navigator) {
        try {
            const battery = await navigator.getBattery();
            const updateUI = () => batteryStatus.innerText = `${battery.charging ? '⚡' : '🔋'} ${Math.round(battery.level * 100)}%`;
            updateUI();
            battery.addEventListener('levelchange', updateUI);
            battery.addEventListener('chargingchange', updateUI);
        } catch (e) { batteryStatus.innerText = '🔋 --%'; }
    }
}

function toggleTheme(mode, save = true) {
    if(mode === 'light') document.body.classList.add('light-mode');
    else document.body.classList.remove('light-mode');
    if(save && currentUser) { currentUser.theme = mode; saveProfile(); }
}

function setFPS(val) {
    alert("System Frame Rate Limit target saved: " + val + " FPS");
    if(currentUser) { currentUser.fps = val; saveProfile(); }
}

function openPfpMenu() {
    const grid = document.getElementById('pfp-grid');
    grid.innerHTML = '';
    pfpImages.forEach(img => {
        const el = document.createElement('img');
        el.src = `pfp/${img}`;
        el.className = 'pfp-option focusable';
        el.onclick = () => {
            if(currentUser) { currentUser.pfp = img; saveProfile(); applyUserData(); }
            closeMenu('pfp-modal');
        };
        grid.appendChild(el);
    });
    openMenu('pfp-modal');
    controllerIndex = 0; // Reset controller focus for the new menu
}

function openMenu(id) { document.getElementById(id).classList.add('active'); controllerIndex = 0; }
function closeMenu(id) { document.getElementById(id).classList.remove('active'); controllerIndex = 0; }
function updateClock() { document.getElementById('clock').innerText = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); }

window.onload = init;
