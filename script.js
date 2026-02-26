// 1. Theme Toggle
function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const target = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', target);
}

// 2. Resolution/Scale Adjuster
function updateResolution(val) {
    // This updates the CSS variable we made earlier
    document.documentElement.style.setProperty('--card-size', val);
}

// 3. FPS Limiter Logic (Placeholder for Emulator Core)
let fps = 60;
document.getElementById('fpsLimit').onchange = (e) => {
    fps = parseInt(e.target.value);
    console.log(`System: FPS limited to ${fps}`);
    // In a real emulator, you'd pass this value to the Wasm loop
};

// 4. Modal Controls
function showSettings() { document.getElementById('settingsModal').style.display = 'block'; }
function closeSettings() { document.getElementById('settingsModal').style.display = 'none'; }
