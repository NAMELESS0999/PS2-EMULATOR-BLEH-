// ==========================================
// 1. YOUR EXACT GITHUB LIBRARY
// ==========================================
const gameLibrary = {
    "Spider-Man 3": { 
        cover: "covers/spiderman3.jpg", 
        url: "https://archive.org/download/god-of-war-ii-usa_202603/Spider-Man%203%20%28USA%29.iso" 
    },
    "God of War II": { 
        cover: "covers/godofwartwo.jpg", 
        url: "https://archive.org/download/god-of-war-ii-usa_202603/God%20of%20War%20II%20%28USA%29.iso" 
    },
    "Black": { 
        cover: "covers/black.jpg", 
        url: "https://archive.org/download/god-of-war-ii-usa_202603/Black%20%28USA%29.iso" 
    },
    "The Simpsons: Hit & Run": { 
        cover: "covers/simpsonhitnrun.jpg", 
        url: "https://archive.org/download/god-of-war-ii-usa_202603/Simpsons%2C%20The%20-%20Hit%20%26%20Run%20%28USA%29.iso" 
    },
    "Red Dead Revolver": { 
        cover: "covers/rdr.jpg", 
        url: "https://archive.org/download/god-of-war-ii-usa_202603/Red%20Dead%20Revolver%20%28USA%29.iso" 
    },
    "Need for Speed: Underground 2": { 
        cover: "covers/nfsunderground2.jpg", 
        url: "https://archive.org/download/god-of-war-ii-usa_202603/Need%20for%20Speed%20-%20Underground%202%20%28USA%29.iso" 
    },
    "Metal Gear Solid 3": { 
        cover: "covers/metalgearsolid.jpg", 
        url: "https://archive.org/download/god-of-war-ii-usa_202603/Metal%20Gear%20Solid%203%20-%20Subsistence%20%28USA%29%20%28En%2CEs%29%20%28Disc%201%29%20%28Subsistence%29.iso" 
    },
    "Harry Potter": { 
        cover: "covers/harrypotter.jpg", 
        url: "https://archive.org/download/god-of-war-ii-usa_202603/Harry%20Potter%20and%20the%20Half-Blood%20Prince%20%28USA%29%20%28En%2CFr%2CEs%2CPt%29.iso" 
    },
    "Madden NFL 12": { 
        cover: "covers/maddennfl.jpg", 
        url: "https://archive.org/download/god-of-war-ii-usa_202603/Madden%20NFL%2012%20%28USA%29.iso" 
    }
};

let currentDownloadController = null;
let emulatorInstance = null;

// ==========================================
// 2. BUILD THE UI
// ==========================================
window.onload = () => {
    updateClock();
    setInterval(updateClock, 1000);
    buildGameCarousel();
};

function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    document.getElementById('clock').innerText = `${hours}:${minutes < 10 ? '0'+minutes : minutes} ${ampm}`;
}

function buildGameCarousel() {
    const strip = document.getElementById('game-strip');
    strip.innerHTML = '';
    
    Object.keys(gameLibrary).forEach((name, i) => {
        const game = gameLibrary[name];
        const card = document.createElement('div');
        card.className = `game-card ${i === 0 ? 'active' : ''}`;
        
        // This links directly to your github 'covers' folder
        card.style.backgroundImage = `url('${game.cover}')`;
        
        if (i === 0) document.getElementById('game-title-display').innerText = name;

        card.onclick = () => {
            if (card.classList.contains('active')) {
                startDownload(name, game.url);
            } else {
                document.querySelectorAll('.game-card').forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                document.getElementById('game-title-display').innerText = name;
            }
        };
        strip.appendChild(card);
    });
}

// ==========================================
// 3. SWITCH DOWNLOAD LOGIC
// ==========================================
async function startDownload(gameName, url) {
    const modal = document.getElementById('download-modal');
    const barFill = document.getElementById('switch-bar-fill');
    const percentTxt = document.getElementById('switch-percent');
    const statusTxt = document.getElementById('dl-status-text');
    
    // Reset UI
    modal.classList.remove('hidden');
    barFill.style.width = '0%';
    percentTxt.innerText = '0%';
    statusTxt.innerText = `Connecting to cloud servers...`;
    
    currentDownloadController = new AbortController();

    try {
        const response = await fetch(url, { signal: currentDownloadController.signal });
        if (!response.ok) throw new Error("Archive.org connection failed.");
        
        const contentLength = +response.headers.get('Content-Length');
        const reader = response.body.getReader();
        let receivedLength = 0;
        let chunks = [];

        while(true) {
            const {done, value} = await reader.read();
            if (done) break;
            
            chunks.push(value);
            receivedLength += value.length;
            
            let percent = Math.round((receivedLength / contentLength) * 100);
            barFill.style.width = percent + "%";
            percentTxt.innerText = percent + "%";
            statusTxt.innerText = `Downloading ${gameName}... (${(receivedLength / 1024 / 1024).toFixed(1)} MB)`;
        }

        statusTxt.innerText = "Download Complete. Booting Engine...";
        
        // Combine chunks into a single virtual ISO file
        const isoBlob = new Blob(chunks);
        const isoFile = new File([isoBlob], gameName + ".iso");

        setTimeout(() => {
            modal.classList.add('hidden');
            bootEmulator(isoFile);
        }, 1000);

    } catch (error) {
        if (error.name === 'AbortError') {
            statusTxt.innerText = "Download paused/cancelled.";
        } else {
            console.error(error);
            statusTxt.innerText = "Error: File too large or network blocked.";
        }
    }
}

function cancelDownload() {
    if (currentDownloadController) {
        currentDownloadController.abort();
    }
    document.getElementById('download-modal').classList.add('hidden');
}

// ==========================================
// 4. PURE EMULATOR BOOT
// ==========================================
async function bootEmulator(isoFile) {
    // Hide UI, Show pure black canvas screen
    document.getElementById('ui-layer').classList.add('hidden');
    document.getElementById('emulator-layer').classList.remove('hidden');
    
    const canvas = document.getElementById('emulator-canvas');

    try {
        // Create the Play! engine instance attached to our full-screen canvas
        emulatorInstance = await window.Play.create({
            canvas: canvas
        });

        // Load the ISO we just downloaded
        await emulatorInstance.loadGame(isoFile);
        
    } catch (err) {
        console.error("Emulator failed to boot:", err);
        alert("Emulator Engine Error. Check console.");
        exitGame();
    }
}

function exitGame() {
    // If the emulator is running, we would ideally stop it here, 
    // but purei.js doesn't have a strict "destroy" method exposed yet.
    // The easiest way to cleanly kill it and return to the UI is to reload the page.
    window.location.reload();
}
