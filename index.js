const canvas = document.getElementById("miLaberinto");
const ctx = canvas.getContext("2d");

// Elementos UI
const winModal = document.getElementById("win-modal");
const restartBtn = document.getElementById("restart-btn");
const mensaje = document.getElementById("mensaje");

// Variables globales
let gameOver = false;
let currentLevelIndex = 0;

// Propiedades del Jugador
const player = {
    x: 20, y: 20, size: 15, color: "#007BFF", speed: 3, dx: 0, dy: 0
};

// Propiedades de la Salida
const exit = {
    x: 0, y: 0, size: 30, color: "#28A745"
};

// Contenedor de paredes actual
let walls = [];

// DEFINICIÓN DE NIVELES (Cada nivel aumenta en complejidad)
const levels = [
    {
        // NIVEL 1: Fácil (Zig-Zag simple)
        start: { x: 20, y: 20 },
        end: { x: 540, y: 540 },
        walls: [
            { x: 0, y: 0, width: 600, height: 10 }, { x: 0, y: 0, width: 10, height: 600 },
            { x: 590, y: 0, width: 10, height: 600 }, { x: 0, y: 590, width: 600, height: 10 },
            // Estructura interna
            { x: 100, y: 0, width: 10, height: 450 },
            { x: 100, y: 450, width: 350, height: 10 },
            { x: 440, y: 150, width: 10, height: 310 },
            { x: 250, y: 150, width: 200, height: 10 },
            { x: 250, y: 150, width: 10, height: 150 }
        ]
    },
    {
        // NIVEL 2: Medio (Espiral)
        start: { x: 20, y: 20 },
        end: { x: 300, y: 300 },
        walls: [
            { x: 0, y: 0, width: 600, height: 10 }, { x: 0, y: 0, width: 10, height: 600 },
            { x: 590, y: 0, width: 10, height: 600 }, { x: 0, y: 590, width: 600, height: 10 },
            // Estructura interna
            { x: 100, y: 100, width: 400, height: 10 },
            { x: 500, y: 100, width: 10, height: 400 },
            { x: 100, y: 500, width: 410, height: 10 },
            { x: 100, y: 200, width: 10, height: 300 },
            { x: 100, y: 200, width: 300, height: 10 },
            { x: 400, y: 200, width: 10, height: 200 },
            { x: 200, y: 400, width: 210, height: 10 },
            { x: 200, y: 300, width: 10, height: 100 }
        ]
    },
    {
        // NIVEL 3: Difícil (Pasillos estrechos)
        start: { x: 20, y: 20 },
        end: { x: 20, y: 540 },
        walls: [
            { x: 0, y: 0, width: 600, height: 10 }, { x: 0, y: 0, width: 10, height: 600 },
            { x: 590, y: 0, width: 10, height: 600 }, { x: 0, y: 590, width: 600, height: 10 },
            // Estructura interna
            { x: 80, y: 0, width: 10, height: 500 },
            { x: 160, y: 100, width: 10, height: 500 },
            { x: 240, y: 0, width: 10, height: 500 },
            { x: 320, y: 100, width: 10, height: 500 },
            { x: 400, y: 0, width: 10, height: 500 },
            { x: 480, y: 100, width: 10, height: 500 },
            // Trampas horizontales
            { x: 240, y: 250, width: 80, height: 10 },
            { x: 400, y: 400, width: 80, height: 10 }
        ]
    }
];


// Función para cargar un nivel específico
function loadLevel(index) {
    const level = levels[index];
    player.x = level.start.x;
    player.y = level.start.y;
    player.dx = 0;
    player.dy = 0;
    exit.x = level.end.x;
    exit.y = level.end.y;
    walls = level.walls;
    
    mensaje.textContent = `Nivel ${index + 1} - Encuentra la salida`;
}

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

// Movimiento y colisión
function movePlayer() {
    let nextX = player.x + player.dx;
    let nextY = player.y + player.dy;

    nextX = Math.max(0, Math.min(nextX, canvas.width - player.size));
    nextY = Math.max(0, Math.min(nextY, canvas.height - player.size));

    let collisionX = false;
    let collisionY = false;

    walls.forEach(wall => {
        if (nextX < wall.x + wall.width && nextX + player.size > wall.x &&
            player.y < wall.y + wall.height && player.y + player.size > wall.y) {
            collisionX = true;
        }
        if (player.x < wall.x + wall.width && player.x + player.size > wall.x &&
            nextY < wall.y + wall.height && nextY + player.size > wall.y) {
            collisionY = true;
        }
    });

    if (!collisionX) player.x = nextX;
    if (!collisionY) player.y = nextY;
}

// Comprobar victoria y cambio de nivel
function checkWin() {
    if (player.x < exit.x + exit.size && player.x + player.size > exit.x &&
        player.y < exit.y + exit.size && player.y + player.size > exit.y) {
        
        currentLevelIndex++; // Avanzar al siguiente nivel
        
        if (currentLevelIndex < levels.length) {
            loadLevel(currentLevelIndex); // Cargar el siguiente laberinto
        } else {
            // Se pasaron todos los niveles
            gameOver = true;
            mensaje.textContent = "¡Juego completado!";
            winModal.classList.remove("hidden");
        }
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

// Reiniciar juego desde el Nivel 1
restartBtn.addEventListener("click", () => {
    currentLevelIndex = 0;
    loadLevel(currentLevelIndex);
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

// Inicializar el primer nivel al abrir el juego
loadLevel(currentLevelIndex);
gameLoop();
