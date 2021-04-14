
const canvas = document.getElementById("pong");
const context = canvas.getContext("2d");
// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;

// CREER L'USER 
const user ={
    x : 0,
    y : canvas.height/2 - 100/2,
    width : 10,
    height : 100,
    color : "#070600",
    score : 0
};

//CREER L'ORDI
const com ={
    x : canvas.width -10,
    y : canvas.height/2 - 100/2,
    width : 10,
    height : 100,
    color : "#070600",
    score : 0
};

// CREER LA RAQUETTE
function drawRect(x, y, w, h, color) {
    context.fillStyle = color;
    
    context.fillRect(x, y, w, h);
}

// CREER LA LIGNE DE SEPARATION
const net = {
    x : canvas.width/2 - 2/2, // x : canvas.width/2 - 1,
    y : 0,
    width : 2,
    height : 10,
    color : "white"
}

function drawNet() {
    for(let i = 0; i <= canvas.height; i +=15){
        drawRect(net.x, net.y + i,net.width, net.height, net.color)
    }
}

// CREER LA BALLE
const ball = {
    x : canvas.width/2,
    y : canvas.height/2,
    radius : 10,
    speed : 5,
    velocityX : 5,
    velocityY : 5,
    color : "#EA526F"
}

// CREER LE CERCLE
function drawCircle(x, y, r, color) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI*2, false);
    context.closePath();
    context.fill();
}

// CREER LE TEXTE
function drawText(text,x, y, color) {
    context.fillStyle = color;
    context.font = "45px 'Russo One'";
    context.fillText(text, x, y) 
}
 
// SET UP LES ELEMENTS
function render() {
    drawRect(0,0, canvas.width, canvas.height, "#C9C6D0")

    drawNet();

    drawText(user.score, canvas.width/4, canvas.height/5, "white")
    drawText(com.score, 3*canvas.width/4, canvas.height/5, canvas.height/5, "white")
    
    drawRect(user.x, user.y, user.width, user.height, user.color);
    drawRect(com.x, com.y, com.width, com.height, com.color);

    drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

// CONTROLER LA RAQUETTE
canvas.addEventListener("mousemove", movePaddle)

function movePaddle(event) {
    let rect = canvas.getBoundingClientRect();

    user.y = event.clientY - rect.top - user.height/2;
}

// CREER LES COLLISIONS
function collision(b, p){
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x -b.radius;
    b.right = b.x + b.radius;

    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    return b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom;
}

// CREER LE RESET APRES GOAL
function resetBall() {
    ball.x = canvas.width/2;
    ball.y = canvas.height/2

    ball.speed = 5
    ball.velocityX = -ball.velocityX;
}

// CREER L'UPDATE DE LA POSITION + MS + SCORE
function update() {
    ball.x += ball.velocityX;
    ball.y += ball.velocityY; 

    // CREER L'ADVERSAIRE
    let computerLevel = 0.1;
    com.y += (ball.y - (com.y + com.height/2)) * computerLevel;

    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0){
        ball.velocityY = - ball.velocityY;
    }

    let player = (ball.x < canvas.width/2) ? user : com;

    if (collision(ball, player)) {
        let collidePoint = ball.y - (player.y + player.height/2);

        collidePoint = collidePoint /(player.height/2);

        let angleRad = collidePoint * Math.PI/4;

        let direction = (ball.x < canvas.width/2) ? 1 : -1;

        ball.velocityX = direction * ball.speed * Math.cos(angleRad)
        ball.velocityY =             ball.speed * Math.sin(angleRad)

        ball.speed += 0.5;

    }
    if (ball.x - ball.radius < 0){
        com.score++;
        resetBall()
        console.log(com);
    }else if(ball.x + ball.radius > canvas.width){
        user.score++;
        resetBall()
    }
}

// CREER LA GAME
function game(){
    update()
    render()
}

const framePerSecond = 50;
setInterval(game, 1000/framePerSecond);


