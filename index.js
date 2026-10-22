const canvas = document.getElementById("miLaberinto");
const ctx = canvas.getContext("2d");

// Elementos UI
const winModal = document.getElementById("win-modal");
const restartBtn = document.getElementById("restart-btn");
const mensaje = document.getElementById("mensaje");

// Jugador
const player = {
    x: 20,
    y: 20,
    size: 15,
    color: "#007BFF", // Azul moderno
    speed: 3,
    dx: 0,
    dy: 0
};

// Paredes
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
    { x: 250, y: 203, width: 20, height: 300 },
    // Cierre extra para hacerlo un laberinto
    { x: 100, y: 490, width: 400, height: 10 }
];

// Salida
const exit = {
    x: 540,
    y: 540,
    size: 30,
    color: "#28A745" // Verde brillante
};

let gameOver = false;

// Funciones de dibujo
function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.size, player.size);
}

function drawWalls() {
    ctx.fillStyle = "#333333";
    walls.forEach(wall => {
        ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
    });
}

function drawExit() {
    ctx.fillStyle = exit.color;
    ctx.fillRect(exit.x, exit.y, exit.size, exit.size);
}

// Movimiento y colisión mejorada (Bloqueo en vez de reinicio)
function movePlayer() {
    let nextX = player.x + player.dx;
    let nextY = player.y + player.dy;

    // Prevenir salida del canvas
    nextX = Math.max(0, Math.min(nextX, canvas.width - player.size));
    nextY = Math.max(0, Math.min(nextY, canvas.height - player.size));

    let collisionX = false;
    let collisionY = false;

    walls.forEach(wall => {
        // Chequeo eje X
        if (nextX < wall.x + wall.width && nextX + player.size > wall.x &&
            player.y < wall.y + wall.height && player.y + player.size > wall.y) {
            collisionX = true;
        }
        // Chequeo eje Y
        if (player.x < wall.x + wall.width && player.x + player.size > wall.x &&
            nextY < wall.y + wall.height && nextY + player.size > wall.y) {
            collisionY = true;
        }
    });

    if (!collisionX) player.x = nextX;
    if (!collisionY) player.y = nextY;
}

// Comprobar victoria
function checkWin() {
    if (player.x < exit.x + exit.size && player.x + player.size > exit.x &&
        player.y < exit.y + exit.size && player.y + player.size > exit.y) {
        gameOver = true;
        winModal.classList.remove("hidden");
    }
}

// Eventos de teclado (PC)
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === "d") player.dx = player.speed;
    if (e.key === "ArrowLeft" || e.key === "a") player.dx = -player.speed;
    if (e.key === "ArrowUp" || e.key === "w") player.dy = -player.speed;
    if (e.key === "ArrowDown" || e.key === "s") player.dy = player.speed;
});

document.addEventListener("keyup", (e) => {
    if (["ArrowRight", "ArrowLeft", "d", "a"].includes(e.key)) player.dx = 0;
    if (["ArrowUp", "ArrowDown", "w", "s"].includes(e.key)) player.dy = 0;
});

// Eventos de botones (Móvil)
const addTouchControl = (btnId, dx, dy) => {
    const btn = document.getElementById(btnId);
    // Táctil y ratón
    const startMove = (e) => { e.preventDefault(); player.dx = dx; player.dy = dy; };
    const stopMove = (e) => { e.preventDefault(); player.dx = 0; player.dy = 0; };
    
    btn.addEventListener('touchstart', startMove);
    btn.addEventListener('touchend', stopMove);
    btn.addEventListener('mousedown', startMove);
    btn.addEventListener('mouseup', stopMove);
    btn.addEventListener('mouseleave', stopMove);
};

addTouchControl('btn-up', 0, -player.speed);
addTouchControl('btn-down', 0, player.speed);
addTouchControl('btn-left', -player.speed, 0);
addTouchControl('btn-right', player.speed, 0);

// Reiniciar juego
restartBtn.addEventListener("click", () => {
    player.x = 20;
    player.y = 20;
    gameOver = false;
    winModal.classList.add("hidden");
    gameLoop();
});

// Bucle principal
function gameLoop() {
    if (!gameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawWalls();
        drawExit();
        drawPlayer();
        movePlayer();
        checkWin();
        requestAnimationFrame(gameLoop);
    }
}

// Iniciar
gameLoop();
