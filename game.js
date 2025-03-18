const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game Objects
let player = { x: 50, y: 300, width: 30, height: 30, speed: 5, velocityY: 0, jumping: false };
let gravity = 0.8;
let platforms = [{ x: 0, y: 350, width: 800, height: 10 }];
let spikes = [];
let backgroundX = 0;
let score = 0;
let gameSpeed = 2;

// Key Controls
let keys = {};
document.addEventListener('keydown', (e) => keys[e.code] = true);
document.addEventListener('keyup', (e) => keys[e.code] = false);

// Load Images
const spikeImg = new Image();
spikeImg.src = 'spike.png';

// Generate Spikes
function spawnSpike() {
  spikes.push({ x: canvas.width, y: 320, width: 30, height: 30 });
  setTimeout(spawnSpike, 2000); // New spike every 2 seconds
}

// Game Loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Scroll Background
  backgroundX -= gameSpeed;
  if (backgroundX <= -canvas.width) backgroundX = 0;

  // Draw Background
  ctx.fillStyle = '#1e1e2f'; // Ground color
  ctx.fillRect(0, 350, canvas.width, 50);

  // Draw Player
  ctx.fillStyle = 'red';
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Move Player
  if (keys['ArrowRight']) player.x += player.speed;
  if (keys['ArrowLeft']) player.x -= player.speed;
  if (keys['Space'] && !player.jumping) {
    player.velocityY = -12;
    player.jumping = true;
  }

  // Apply Gravity
  player.y += player.velocityY;
  player.velocityY += gravity;

  // Collision with Platforms
  platforms.forEach(platform => {
    if (player.y + player.height >= platform.y &&
        player.x < platform.x + platform.width &&
        player.x + player.width > platform.x) {
      player.y = platform.y - player.height;
      player.jumping = false;
    }
  });

  // Draw and Move Spikes
  spikes.forEach((spike, index) => {
    spike.x -= gameSpeed;
    ctx.drawImage(spikeImg, spike.x, spike.y, spike.width, spike.height);

    // Collision Detection
    if (player.x < spike.x + spike.width &&
        player.x + player.width > spike.x &&
        player.y < spike.y + spike.height &&
        player.y + player.height > spike.y) {
      spikes.splice(index, 1); // Remove spike on collision
      score++;
      document.getElementById('score').innerText = score;
    }
  });

  requestAnimationFrame(gameLoop);
}

spawnSpike();
gameLoop();
