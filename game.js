const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let player = { x: 50, y: 300, width: 30, height: 30, speed: 5, velocityY: 0, jumping: false };
let gravity = 0.8;
let platforms = [{ x: 0, y: 350, width: 800, height: 10 }];
let shards = [{ x: 400, y: 320, width: 10, height: 10 }];
let score = 0;

// Key controls
let keys = {};

document.addEventListener('keydown', (e) => keys[e.code] = true);
document.addEventListener('keyup', (e) => keys[e.code] = false);

// Game Loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw player
  ctx.fillStyle = 'red';
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Draw platforms
  ctx.fillStyle = 'green';
  platforms.forEach(platform => {
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
  });

  // Draw shards
  ctx.fillStyle = 'yellow';
  shards.forEach(shard => {
    ctx.fillRect(shard.x, shard.y, shard.width, shard.height);
  });

  // Player movement
  if (keys['ArrowRight']) player.x += player.speed;
  if (keys['ArrowLeft']) player.x -= player.speed;
  if (keys['Space'] && !player.jumping) {
    player.velocityY = -12;
    player.jumping = true;
  }

  // Apply gravity
  player.y += player.velocityY;
  player.velocityY += gravity;

  // Collision with platforms
  platforms.forEach(platform => {
    if (player.y + player.height >= platform.y && 
        player.x < platform.x + platform.width &&
        player.x + player.width > platform.x) {
      player.y = platform.y - player.height;
      player.jumping = false;
    }
  });

  // Collect shards
  shards = shards.filter(shard => {
    if (player.x < shard.x + shard.width &&
        player.x + player.width > shard.x &&
        player.y < shard.y + shard.height &&
        player.y + player.height > shard.y) {
      score++;
      document.getElementById('score').innerText = score;
      return false;
    }
    return true;
  });

  requestAnimationFrame(gameLoop);
}

gameLoop();
