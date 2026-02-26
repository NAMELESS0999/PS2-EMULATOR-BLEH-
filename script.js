const games = [
    { name: "God of War", img: "https://m.media-amazon.com/images/M/MV5BMzI0NmVlZjctN2U0ZS00ZWFmLTlmZGUtYjc3ZTU5YmRjYjVjXkEyXkFqcGdeQXVyMTA0MTM5NjI2._V1_.jpg" },
    { name: "Jak and Daxter", img: "https://m.media-amazon.com/images/M/MV5BMTYxNjkxNDY3NV5BMl5BanBnXkFtZTcwNjk0OTcyMQ@@._V1_.jpg" }
];

const container = document.getElementById('gameList');

games.forEach(game => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `<img src="${game.img}">`;
    card.onclick = () => alert("Now booting " + game.name + "...");
    container.appendChild(card);
});
