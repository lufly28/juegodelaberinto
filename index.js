const canvas = document.getElementById("miLaberinto");
const ctx = canvas.getContext("2d");

// Player properties
const player = {
    x: 20,
    y: 20,
    size: 15,
    color: "blue",
    speed: 2,
    dx: 0,
    dy: 0
};

// Wall definitions
const walls = [
    { x: 0, y: 0, width: 600, height: 10 },
    { x: 0, y: 0, width: 10, height: 600 },
    { x: 590, y: 0, width: 10, height: 600 },
    { x: 0, y: 590, width: 600, height: 10 },
    { x: 100, y: 100, width: 400, height: 10 },
    { x: 100, y: 200, width: 10, height: 200 },
    { x: 200, y: 200, width: 10, height: 200 },
    { x: 300, y: 200, width: 10, height: 200 },
    { x: 400, y: 200, width: 10, height: 200 },
    { x: 250,  y:203, with: 20,  height:300  },
    // Add more walls here to create the maze
];

// Exit definition
const exit = {
    x: 570,
    y: 570,
    size: 30,
    color: "green"
};

let gameOver = false;

// Function to draw the player
function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.size, player.size);
}

// Function to draw the walls
function drawWalls() {
    ctx.fillStyle = "black";
    walls.forEach(wall => {
        ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
    });
}

// Function to draw the exit
function drawExit() {
    ctx.fillStyle = exit.color;
    ctx.fillRect(exit.x, exit.y, exit.size, exit.size);
}

// Function to move the player
function movePlayer() {
    player.x += player.dx;
    player.y += player.dy;

    // Prevent player from going outside the canvas
    player.x = Math.max(0, Math.min(player.x, canvas.width - player.size));
    player.y = Math.max(0, Math.min(player.y, canvas.height - player.size));
}

// Function to check for collisions with walls
function checkCollision() {
    walls.forEach(wall => {
        if (player.x < wall.x + wall.width &&
            player.x + player.size > wall.x &&
            player.y < wall.y + wall.height &&
            player.y + player.size > wall.y) {
            player.x = 20; // Reset player position
            player.y = 20; // Reset player position
        }
    });
}

// Function to check if the player has reached the exit
function checkWin() {
    if (player.x < exit.x + exit.size &&
        player.x + player.size > exit.x &&
        player.y < exit.y + exit.size &&
        player.y + player.size > exit.y) {
        gameOver = true;
        document.getElementById("mensaje").textContent = "¡Ganaste!";
    }
}

// Event listeners for keyboard input
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

function keyDown(e) {
    if (e.key === "ArrowRight" || e.key === "d") player.dx = player.speed;
    if (e.key === "ArrowLeft" || e.key === "a") player.dx = -player.speed;
    if (e.key === "ArrowUp" || e.key === "w") player.dy = -player.speed;
    if (e.key === "ArrowDown" || e.key === "s") player.dy = player.speed;
}

function keyUp(e) {
    if (["ArrowRight", "ArrowLeft", "d", "a"].includes(e.key)) player.dx = 0;
    if (["ArrowUp", "ArrowDown", "w", "s"].includes(e.key)) player.dy = 0;
}

// Main game loop
function gameLoop() {
    if (!gameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawWalls();
        drawPlayer();
        drawExit();
        movePlayer();
        checkCollision();
        checkWin();
        requestAnimationFrame(gameLoop);
    }
}

gameLoop();