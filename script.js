// Pong Game Script

const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

// Create the paddle
const paddleWidth = 10, paddleHeight = 100;
const player = {
    x: 0,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: "#fff",
    dy: 6
};
const computer = {
    x: canvas.width - paddleWidth,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: "#fff",
    dy: 5
};

// Create the ball
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speed: 5,
    dx: 5,
    dy: 5,
    color: "#fff"
};

// Draw rectangle function
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

// Draw circle function
function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI*2, false);
    ctx.closePath();
    ctx.fill();
}

// Draw text
function drawText(text, x, y) {
    ctx.fillStyle = "#fff";
    ctx.font = "32px Arial";
    ctx.fillText(text, x, y);
}

// Collision detection
function collision(b, p) {
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    return p.left < b.right && p.right > b.left && p.top < b.bottom && p.bottom > b.top;
}

// Reset ball
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = -ball.dx;
    ball.speed = 5;
}

// Update location of game objects
let playerScore = 0, computerScore = 0;
function update() {
    // Move player paddle
    if (upArrowPressed && player.y > 0) {
        player.y -= player.dy;
    } else if (downArrowPressed && player.y + player.height < canvas.height) {
        player.y += player.dy;
    }

    // Simple AI for computer paddle
    if (computer.y + computer.height/2 < ball.y && computer.y + computer.height < canvas.height) {
        computer.y += computer.dy;
    } else if (computer.y + computer.height/2 > ball.y && computer.y > 0) {
        computer.y -= computer.dy;
    }

    // Move ball
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Wall collision (top/bottom)
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.dy = -ball.dy;
    }

    // Paddle collision
    let user = (ball.x < canvas.width/2) ? player : computer;
    if (collision(ball, user)) {
        // Check where the ball hit the paddle
        let collidePoint = ball.y - (user.y + user.height/2);
        // Normalize
        collidePoint = collidePoint / (user.height/2);
        // Calculate angle in Radian
        let angleRad = (Math.PI/4) * collidePoint;
        // X direction of the ball when hit
        let direction = (ball.x < canvas.width/2) ? 1 : -1;
        // Change dx and dy
        ball.dx = direction * ball.speed * Math.cos(angleRad);
        ball.dy = ball.speed * Math.sin(angleRad);
        // Every hit increases speed
        ball.speed += 0.5;
    }

    // Score update
    if (ball.x - ball.radius < 0) {
        computerScore++;
        resetBall();
    } else if (ball.x + ball.radius > canvas.width) {
        playerScore++;
        resetBall();
    }
}

// Render game objects
function render() {
    // Clear canvas
    drawRect(0, 0, canvas.width, canvas.height, "#000");
    // Draw net
    for (let i = 0; i <= canvas.height; i += 20) {
        drawRect(canvas.width/2 - 1, i, 2, 10, "#fff");
    }
    // Draw scores
    drawText(playerScore, canvas.width/4, 50);
    drawText(computerScore, 3*canvas.width/4, 50);
    // Draw paddles and ball
    drawRect(player.x, player.y, player.width, player.height, player.color);
    drawRect(computer.x, computer.y, computer.width, computer.height, computer.color);
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

// Game loop
function game() {
    update();
    render();
}

// Keyboard controls
let upArrowPressed = false;
let downArrowPressed = false;
window.addEventListener("keydown", function(e) {
    if (e.key === "ArrowUp") upArrowPressed = true;
    if (e.key === "ArrowDown") downArrowPressed = true;
});
window.addEventListener("keyup", function(e) {
    if (e.key === "ArrowUp") upArrowPressed = false;
    if (e.key === "ArrowDown") downArrowPressed = false;
});

// Run the game at 60 FPS
setInterval(game, 1000/60);