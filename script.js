// ==========================================
// 1. MASTER GAME LIBRARY (GitHub Covers + Archive ISOs)
// ==========================================
const gameLibrary = {
    "God of War II": { 
        cover: "covers/godofwartwo.jpg", 
        url: "https://archive.org/download/god-of-war-ii-usa_202603/God%20of%20War%20II%20%28USA%29.iso" 
    },
    "Spider-Man 3": { 
        cover: "covers/spiderman3.jpg", 
        url: "https://archive.org/download/god-of-war-ii-usa_202603/Spider-Man%203%20%28USA%29.iso" 
    },
    "The Simpsons: Hit & Run": { 
        cover: "covers/simpsonhitnrun.jpg", 
        url: "https://archive.org/download/god-of-war-ii-usa_202603/Simpsons%2C%20The%20-%20Hit%20%26%20Run%20%28USA%29.iso" 
    },
    "Black": { 
        cover: "covers/black.jpg", 
        url: "https://archive.org/download/god-of-war-ii-usa_202603/Black%20%28USA%29.iso" 
    },
    "Metal Gear Solid 3": { 
        cover: "covers/metalgearsolid.jpg", 
        url: "https://archive.org/download/god-of-war-ii-usa_202603/Metal%20Gear%20Solid%203%20-%20Subsistence%20%28USA%29%20%28En%2CEs%29%20%28Disc%201%29%20%28Subsistence%29.iso" 
    },
    "Need for Speed: Underground 2": { 
        cover: "covers/nfsunderground2.jpg", 
        url: "https://archive.org/download/god-of-war-ii-usa_202603/Need%20for%20Speed%20-%20Underground%202%20%28USA%29.iso" 
    },
    "Red Dead Revolver": { 
        cover: "covers/rdr.jpg", 
        url: "https://archive.org/download/god-of-war-ii-usa_202603/Red%20Dead%20Revolver%20%28USA%29.iso" 
    },
    "Shadow the Hedgehog": { 
        cover: "covers/shadowthehedgehog.jpg", 
        url: "https://archive.org/download/god-of-war-ii-usa_202603/Shadow%20the%20Hedgehog%20%28USA%29%20%28En%2CJa%2CFr%2CDe%2CEs%2CIt%29.iso" 
    },
    "Madden NFL 12": { 
        cover: "covers/madden11.jpg", 
        url: "https://archive.org/download/god-of-war-ii-usa_202603/Madden%20NFL%2012%20%28USA%29.iso" 
    },
    "Harry Potter": { 
        cover: "covers/harrypotter.jpg", 
        url: "https://archive.org/download/god-of-war-ii-usa_202603/Harry%20Potter%20and%20the%20Half-Blood%20Prince%20%28USA%29%20%28En%2CFr%2CEs%2CPt%29.iso" 
    }
};

// ==========================================
// 2. THE STORAGE VAULT (IndexedDB)
// ==========================================
let db;
const request = indexedDB.open("PS2_Console_Storage", 1);
request.onupgradeneeded = (e) => {
    db = e.target.result;
    db.createObjectStore("iso_vault");
};
request.onsuccess = (e) => db = e.target.result;

// ==========================================
// 3. UI INITIALIZATION
// ==========================================
window.onload = () => {
    updateClock();
    setInterval(updateClock, 1000);
    buildGameCarousel();
    loadProfileAvatars();
};

function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    document.getElementById('clock').innerText = `${hours}:${minutes} ${ampm}`;
}

// ==========================================
// 4. CAROUSEL & DOWNLOAD LOGIC
// ==========================================
function buildGameCarousel() {
    const strip = document.getElementById('game-strip');
    strip.innerHTML = '';
    
    Object.keys(gameLibrary).forEach((name, i) => {
        const game = gameLibrary[name];
        const card = document.createElement('div');
        card.className = `game-card focusable ${i === 0 ? 'active' : ''}`;
        
        // Apply GitHub Cover Art
        card.style.backgroundImage = `url('${game.cover}')`;
        
        if (i === 0) document.getElementById('game-title-display').innerText = name;

        card.onclick = () => {
            if (card.classList.contains('active')) {
                // If already active, check vault / download / play
                checkAndPlay(name);
            } else {
                // Make active and center
                document.querySelectorAll('.game-card').forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                document.getElementById('game-title-display').innerText = name;
                card.scrollIntoView({ behavior: 'smooth', inline: 'center' });
            }
        };
        strip.appendChild(card);
    });
}

async function checkAndPlay(gameName) {
    const container = document.getElementById('download-container');
    const status = document.getElementById('download-status');
    const bar = document.getElementById('download-bar');

    // Open transaction to check Vault
    const tx = db.transaction("iso_vault", "readonly");
    const store = tx.objectStore("iso_vault");
    const getReq = store.get(gameName);

    getReq.onsuccess = async () => {
        if (getReq.result) {
            // Game exists! Boot it up.
            bootGame(getReq.result, gameName);
        } else {
            // Game missing. Start Download.
            container.classList.remove('hidden');
            status.innerText = `Fetching ${gameName} from Cloud...`;
            bar.style.width = "0%";

            try {
                // NOTE: Fetching directly from Archive.org. 
                // If it fails, we will need a CORS proxy.
                const response = await fetch(gameLibrary[gameName].url);
                if (!response.ok) throw new Error("Network response was not ok");
                
                const reader = response.body.getReader();
                const contentLength = +response.headers.get('Content-Length');
                let receivedLength = 0;
                let chunks = [];

                while(true) {
                    const {done, value} = await reader.read();
                    if (done) break;
                    chunks.push(value);
                    receivedLength += value.length;
                    
                    let percent = (receivedLength / contentLength) * 100;
                    bar.style.width = percent + "%";
                    status.innerText = `Downloading: ${Math.round(percent)}%`;
                }

                // Save to IndexedDB
                const fullBlob = new Blob(chunks);
                const saveTx = db.transaction("iso_vault", "readwrite");
                saveTx.objectStore("iso_vault").put(fullBlob, gameName);

                status.innerText = "Install Complete!";
                setTimeout(() => {
                    container.classList.add('hidden');
                    bootGame(fullBlob, gameName);
                }, 2000);

            } catch (error) {
                console.error("Download failed:", error);
                status.innerText = "Download Error. Please check console.";
                setTimeout(() => container.classList.add('hidden'), 4000);
            }
        }
    };
}

// ==========================================
// 5. EMULATOR BOOT SEQUENCE
// ==========================================
async function bootGame(isoFile, name) {
    // 1. Hide the menu and show the black game screen
    document.getElementById('game-player').classList.remove('hidden');
    
    // 2. Start the Play! Engine
    const p2 = await window.Play.create({
        canvas: document.getElementById('emulator-canvas')
    });

    // 3. Put the game in the console
    const disc = new File([isoFile], name + ".iso");
    await p2.loadGame(disc);
    
    // 4. Hide the loading text so you can see the game
    document.getElementById('loading-screen').classList.add('hidden');
    document.getElementById('emulator-canvas').classList.remove('hidden');
}

    // Simulation of emulator load time
    setTimeout(() => {
        loadScreen.classList.add('hidden');
        canvas.classList.remove('hidden');
        // Future code: Module.callMain() or WASM initialization goes here
    }, 3000);
}

function closeGame() {
    document.getElementById('game-player').classList.add('hidden');
    document.getElementById('emulator-canvas').classList.add('hidden');
}

// ==========================================
// 6. MODAL & PROFILE LOGIC
// ==========================================
function openModal(id) {
    document.getElementById(id).classList.remove('hidden');
}

function closeModal(id) {
    document.getElementById(id).classList.add('hidden');
}

function loadProfileAvatars() {
    // You can point these to your 'pfp' folder images later
    const pfps = [
        "https://via.placeholder.com/60/ff0000/fff?text=K", // Kratos placeholder
        "https://via.placeholder.com/60/0000ff/fff?text=S", // Spidey placeholder
        "https://via.placeholder.com/60/00ff00/fff?text=L", // Luigi placeholder
    ];
    const grid = document.getElementById('pfp-grid');
    pfps.forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        img.className = 'pfp-option';
        img.onclick = () => {
            document.getElementById('current-pfp').src = src;
            closeModal('profile-modal');
        };
        grid.appendChild(img);
    });
}
