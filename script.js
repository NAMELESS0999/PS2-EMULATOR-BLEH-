// 1. Fill the Carousel
const games = [
    { name: "God of War", img: "https://m.media-amazon.com/images/M/MV5BMzI0NmVlZjctN2U0ZS00ZWFmLTlmZGUtYjc3ZTU5YmRjYjVjXkEyXkFqcGdeQXVyMTA0MTM5NjI2._V1_.jpg" },
    { name: "Jak & Daxter", img: "https://m.media-amazon.com/images/M/MV5BMTYxNjkxNDY3NV5BMl5BanBnXkFtZTcwNjk0OTcyMQ@@._V1_.jpg" }
];

const container = document.getElementById('gameList');

// Add real games
games.forEach(game => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `<img src="${game.img}" style="width:100%; height:100%; object-fit:cover;">`;
    container.appendChild(card);
});

// Add 10 empty "Empty Slots" for the sliding effect
for (let i = 0; i < 10; i++) {
    const empty = document.createElement('div');
    empty.className = 'card';
    empty.style.opacity = "0.3";
    container.appendChild(empty);
}

// 2. Controller Configuration (The Logic)
function showControllerConfig() {
    // This uses the Gamepad API
    const gamepads = navigator.getGamepads();
    if (gamepads[0]) {
        alert("Controller Detected: " + gamepads[0].id);
    } else {
        alert("No controller detected. Plug one in and press a button!");
    }
}

// 3. Simple Clock
setInterval(() => {
    const now = new Date();
    document.getElementById('clock').innerText = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}, 1000);
