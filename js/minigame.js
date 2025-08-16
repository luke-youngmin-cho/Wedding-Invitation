// ===== Wedding Runner Mini Game =====
(() => {
  let gameContainer = null;
  let canvas = null;
  let ctx = null;
  let isGameActive = false;
  let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
  
  // Firebase functions will be defined globally
  window.initMiniGame = function(containerId) {
    gameContainer = document.getElementById(containerId);
    if (!gameContainer) return;
    
    setupGameHTML();
    setupCanvas();
    setupEventListeners();
  };

  function setupGameHTML() {
    // Check if mobile or small screen
    const showButtons = isMobile || window.innerWidth <= 768;
    
    // Simple 16:9 game container as a section
    gameContainer.innerHTML = `
      <div class="game-section-wrapper" style="
        width: 100%;
        max-width: 100%;
        margin: 0 auto;
      ">
        <!-- Game Screen with 16:9 ratio -->
        <div class="game-screen-container" style="
          position: relative;
          width: 100%;
          padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
          background: #0b1020;
          border: 3px solid #ff006e;
          overflow: hidden;
          box-shadow: 0 0 30px rgba(255,0,110,0.5);
        ">
          <div class="game-wrapper" style="
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
          ">
            <canvas id="miniGameCanvas" width="1280" height="720" style="
              display: block;
              width: 100%;
              height: 100%;
              image-rendering: pixelated;
              image-rendering: crisp-edges;
            "></canvas>
        
        <!-- UI Overlay -->
        <div class="game-ui" style="position:absolute;left:1%;top:1%;padding:0.8% 1.2%;background:rgba(7,10,20,.8);border:2px solid #ff006e;color:#ffde00;font-family:'Press Start 2P',monospace;font-size:calc(8px + 0.3vw);z-index:10;">
          <div style="margin-bottom:0.3vw;">WEDDING RUNNER</div>
          <div style="display:flex;gap:1vw;">
            <span>DIST: <span id="gameDistance">0m</span></span>
            <span>SPD: <span id="gameSpeed">0</span></span>
          </div>
          <div style="margin-top:0.3vw;">
            <span>CHAR: <span id="gameChar">GROOM</span></span>
          </div>
        </div>
        
            
            <!-- Leaderboard (Inside game wrapper) -->
            <div id="leaderboardPanel" style="position:absolute;top:8%;right:1%;padding:0.8%;background:rgba(7,10,20,.9);border:2px solid #ffde00;color:white;font-family:'Press Start 2P';font-size:calc(6px + 0.3vw);width:15%;min-width:120px;z-index:10;">
              <div style="margin-bottom:0.5vw;color:#ffde00;font-size:calc(7px + 0.3vw);">TOP 3</div>
              <div id="leaderboardList" style="line-height:1.4;font-size:calc(5px + 0.2vw);">
                Loading...
              </div>
            </div>
            
            <!-- Start Screen (Inside game wrapper) -->
            <div id="startScreen" style="position:absolute;top:0;left:0;right:0;bottom:0;display:flex;align-items:center;justify-content:center;background:rgba(10,10,10,0.95);z-index:100;">
              <div style="text-align:center;padding:2%;max-width:90%;">
                <h2 style="color:#ff006e;font-family:'Press Start 2P';font-size:calc(14px + 1vw);margin-bottom:2vw;">WEDDING RUNNER</h2>
                <p style="color:#ffde00;font-family:'Press Start 2P';font-size:calc(6px + 0.4vw);line-height:1.8;margin-bottom:2vw;">
                  신랑과 신부가 함께하는<br>
                  무한 러닝 게임!<br><br>
                  [조작법]<br>
                  점프 : SPACE/↑ <br>
                  공격 : J<br>
                  캐릭터 전환 : Q<br>
                  슬램 : K/↓<br>
                  모바일: 화면 버튼 사용
                </p>
                <button id="startGameBtn" style="padding:1.5% 3%;background:#ff006e;border:none;color:white;font-family:'Press Start 2P';font-size:calc(8px + 0.5vw);cursor:pointer;animation:blink 1s infinite;">
                  START GAME
                </button>
              </div>
            </div>
            
            <!-- Game Over Screen (Inside game wrapper) -->
            <div id="gameOverScreen" style="position:absolute;top:0;left:0;right:0;bottom:0;display:none;align-items:center;justify-content:center;background:rgba(10,10,10,0.95);z-index:100;">
              <div style="background:#0b1020;border:3px solid #ff006e;padding:2%;text-align:center;color:#ffde00;font-family:'Press Start 2P';min-width:40%;max-width:80%;">
                <h2 style="margin:0 0 2vw;font-size:calc(14px + 1vw);">GAME OVER</h2>
                <div id="finalScore" style="margin:1vw 0;font-size:calc(8px + 0.5vw);line-height:1.8;"></div>
                <div id="recordSubmit" style="display:none;">
                  <input type="text" id="playerName" placeholder="이름 입력" maxlength="10" style="margin:1.5vw 0;padding:0.8vw;background:#1a1a2e;border:2px solid #ff006e;color:white;font-family:'Press Start 2P';font-size:calc(7px + 0.3vw);width:60%;">
                  <div style="display:flex;gap:1vw;justify-content:center;margin-top:1.5vw;">
                    <button id="submitScore" style="padding:1vw 2vw;background:#ff006e;border:none;color:white;font-family:'Press Start 2P';font-size:calc(7px + 0.3vw);cursor:pointer;">SUBMIT</button>
                    <button id="restartGame" style="padding:1vw 2vw;background:#ffde00;border:none;color:black;font-family:'Press Start 2P';font-size:calc(7px + 0.3vw);cursor:pointer;">RETRY</button>
                  </div>
                </div>
                <div id="normalRestart" style="display:none;">
                  <button id="restartGameOnly" style="padding:1.5vw 3vw;background:#ffde00;border:none;color:black;font-family:'Press Start 2P';font-size:calc(8px + 0.4vw);cursor:pointer;margin-top:2vw;">RETRY</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Control Panel for Mobile/Touch -->
        <div class="control-panel" style="
          margin-top: 10px;
          padding: 15px;
          background: rgba(15,15,35,0.9);
          border: 2px solid #ff006e;
          display: ${showButtons ? 'flex' : 'none'};
          justify-content: space-around;
          align-items: center;
          gap: 20px;
        ">
          <!-- Left Controls -->
          <div style="display: flex; flex-direction: column; gap: 10px; align-items: center;">
            <button class="game-btn" id="btnTag" style="
              width: 55px;
              height: 55px;
              background: #ff66ff;
              border: 2px solid #ff99ff;
              color: #fff;
              font-family: 'Press Start 2P', monospace;
              font-size: 9px;
              cursor: pointer;
              border-radius: 5px;
              display: flex;
              align-items: center;
              justify-content: center;
              text-align: center;
            ">TAG</button>
            
            <button class="game-btn" id="btnJump" style="
              width: 65px;
              height: 65px;
              background: #ff006e;
              border: 2px solid #ff3388;
              color: #fff;
              font-family: 'Press Start 2P', monospace;
              font-size: 11px;
              cursor: pointer;
              border-radius: 5px;
              display: flex;
              align-items: center;
              justify-content: center;
              text-align: center;
            ">JUMP</button>
          </div>
          
          <!-- Right Controls -->
          <div style="display: flex; flex-direction: column; gap: 10px; align-items: center;">
            <button class="game-btn" id="btnAttack" style="
              width: 55px;
              height: 55px;
              background: #0099ff;
              border: 2px solid #44bbff;
              color: #fff;
              font-family: 'Press Start 2P', monospace;
              font-size: 9px;
              cursor: pointer;
              border-radius: 5px;
              display: flex;
              align-items: center;
              justify-content: center;
              text-align: center;
            ">ATK</button>
            
            <button class="game-btn" id="btnSlam" style="
              width: 65px;
              height: 65px;
              background: #ff0033;
              border: 2px solid #ff4466;
              color: #fff;
              font-family: 'Press Start 2P', monospace;
              font-size: 11px;
              cursor: pointer;
              border-radius: 5px;
              display: flex;
              align-items: center;
              justify-content: center;
              text-align: center;
            ">SLAM</button>
          </div>
        </div>
        
        <!-- Full Leaderboard Section Below Control Panel -->
        <div id="fullLeaderboard" style="
          margin-top: 20px;
          padding: 20px;
          background: rgba(15,15,35,0.95);
          border: 2px solid #ffde00;
          display: none;
        ">
          <h3 style="
            color: #ffde00;
            font-family: 'Press Start 2P', monospace;
            font-size: 14px;
            text-align: center;
            margin-bottom: 15px;
          ">FULL LEADERBOARD</h3>
          <div id="leaderboardPages" style="
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 10px;
            margin-bottom: 15px;
          "></div>
          <div id="leaderboardPagination" style="
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-top: 15px;
          "></div>
        </div>
      </div>
    `;
  }

  function setupCanvas() {
    canvas = document.getElementById('miniGameCanvas');
    if (!canvas) {
      console.error('Canvas not found!');
      return;
    }
    ctx = canvas.getContext('2d');
    
    // 16:9 aspect ratio dimensions
    canvas.width = 1280;
    canvas.height = 720;
    
    // Update world dimensions
    world.w = canvas.width;
    world.h = canvas.height;
    
    console.log('Canvas setup:', canvas.width, 'x', canvas.height);
  }

  // ===== Game Variables =====
  let DPR = 1;
  const world = {
    w: 1280, h: 720,
    gravity: 1600,
    baseSpeed: 250,
    speed: 250,
    maxSpeed: 750,
    accelPerSec: 20,
    distance: 0,
    time: 0,
    shake: 0,
  };

  const CHAR = { MALE: 0, FEMALE: 1 };
  const player = {
    x: 150, y: 0, w: 65, h: 80,
    vx: 0, vy: 0,
    onGround: false,
    jumpsLeft: 2,
    jumpV: 600,
    who: CHAR.MALE,
    tagCooldown: 0,
    attackCooldown: 0,
    animTime: 0,
    baseAnimRate: 1.0,
    coyote: 0,
    buffer: 0,
    slamming: false,
    slamCooldown: 0,
    swordSwing: 0, // 칼 휘두르는 애니메이션 타이머
    invulnerable: 0, // 무적 시간
  };

  const COYOTE_TIME = 0.10;
  const JUMP_BUFFER = 0.12;

  const platforms = [];
  const obstacles = [];
  const bullets = [];
  const waves = [];
  const slashes = [];
  const meleeRects = [];
  const burstQueue = [];

  // ===== Input System =====
  const keys = new Set();
  const touches = new Set();
  let running = false;

  function setupEventListeners() {
    // Keyboard events - simplified without focus checks
    document.addEventListener('keydown', (e) => {
      // Always handle game keys when game container exists
      if (!gameContainer) return;
      
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        
        // Start game if not running
        if (!running) {
          const startBtn = document.getElementById('startGameBtn');
          if (startBtn && startBtn.style.display !== 'none') {
            startGame();
            return;
          }
        }
        
        // Jump
        keys.add(e.code);
        player.buffer = JUMP_BUFFER;
        console.log('Jump key pressed');
      }
      else if (e.code === 'KeyJ') {
        e.preventDefault();
        keys.add(e.code);
        console.log('Attack key pressed');
      }
      else if (e.code === 'KeyQ') {
        e.preventDefault();
        keys.add(e.code);
        console.log('Tag key pressed');
      }
      else if (e.code === 'ArrowDown' || e.code === 'KeyK') {
        e.preventDefault();
        keys.add(e.code);
        console.log('Slam key pressed');
      }
    });

    document.addEventListener('keyup', (e) => {
      keys.delete(e.code);
    });

    // Mobile button events (support both touch and mouse)
    const btnJump = document.getElementById('btnJump');
    const btnAttack = document.getElementById('btnAttack');
    const btnTag = document.getElementById('btnTag');
    const btnSlam = document.getElementById('btnSlam');

    if (btnJump) {
      // Touch events
      btnJump.addEventListener('touchstart', (e) => {
        e.preventDefault();
        touches.add('jump');
        player.buffer = JUMP_BUFFER;
      });
      btnJump.addEventListener('touchend', () => touches.delete('jump'));
      
      // Mouse events for testing
      btnJump.addEventListener('mousedown', (e) => {
        e.preventDefault();
        touches.add('jump');
        player.buffer = JUMP_BUFFER;
      });
      btnJump.addEventListener('mouseup', () => touches.delete('jump'));
    }

    if (btnAttack) {
      btnAttack.addEventListener('touchstart', (e) => {
        e.preventDefault();
        touches.add('attack');
      });
      btnAttack.addEventListener('touchend', () => touches.delete('attack'));
      
      btnAttack.addEventListener('mousedown', (e) => {
        e.preventDefault();
        touches.add('attack');
      });
      btnAttack.addEventListener('mouseup', () => touches.delete('attack'));
    }

    if (btnTag) {
      btnTag.addEventListener('touchstart', (e) => {
        e.preventDefault();
        touches.add('tag');
      });
      btnTag.addEventListener('touchend', () => touches.delete('tag'));
      
      btnTag.addEventListener('mousedown', (e) => {
        e.preventDefault();
        touches.add('tag');
      });
      btnTag.addEventListener('mouseup', () => touches.delete('tag'));
    }

    if (btnSlam) {
      btnSlam.addEventListener('touchstart', (e) => {
        e.preventDefault();
        touches.add('slam');
      });
      btnSlam.addEventListener('touchend', () => touches.delete('slam'));
      
      btnSlam.addEventListener('mousedown', (e) => {
        e.preventDefault();
        touches.add('slam');
      });
      btnSlam.addEventListener('mouseup', () => touches.delete('slam'));
    }

    // Start/Restart buttons
    const startBtn = document.getElementById('startGameBtn');
    const restartBtn = document.getElementById('restartGame');
    const restartOnlyBtn = document.getElementById('restartGameOnly');
    const submitBtn = document.getElementById('submitScore');

    if (startBtn) startBtn.addEventListener('click', startGame);
    if (restartBtn) restartBtn.addEventListener('click', startGame);
    if (restartOnlyBtn) restartOnlyBtn.addEventListener('click', startGame);
    if (submitBtn) submitBtn.addEventListener('click', submitScore);
  }

  // ===== Game Functions =====
  function resetWorld() {
    // Ensure canvas is set up
    if (!canvas) {
      setupCanvas();
    }
    
    world.speed = world.baseSpeed;
    world.distance = 0;
    world.time = 0;
    world.shake = 0;
    
    // Reset player state
    player.x = 100;
    player.vx = 0;
    player.vy = 0;
    player.onGround = false;
    player.jumpsLeft = 2;
    player.who = CHAR.MALE;
    player.tagCooldown = 0;
    player.attackCooldown = 0;
    player.animTime = 0;
    player.coyote = 0;
    player.buffer = 0;
    player.slamming = false;
    player.slamCooldown = 0;
    player.swordSwing = 0;
    player.invulnerable = 0;
    
    platforms.length = 0;
    obstacles.length = 0;
    bullets.length = 0;
    waves.length = 0;
    slashes.length = 0;
    meleeRects.length = 0;
    burstQueue.length = 0;
    
    // Initial platform at bottom of screen
    const groundY = 400; // Fixed position
    platforms.push({x: -200, y: groundY, w: 1200, h: 100});
    
    // Place player on the first platform
    player.y = groundY - player.h - 5;
    
    console.log('World reset - Canvas:', canvas.width, 'x', canvas.height);
    console.log('Player position:', player.x, player.y);
    console.log('First platform:', platforms[0]);
    
    let cursor = platforms[0].x + platforms[0].w;
    for (let i = 0; i < 10; i++) {
      cursor = spawnPlatformCursor(cursor);
    }
    
    updateUI();
  }

  function spawnPlatformCursor(cursorX) {
    const maxGap = Math.min(200, maxHorizontalDoubleJumpDistance(world.speed) * 0.8);
    const gap = randRange(60, maxGap);
    const minW = 150, maxW = 300;
    const t = Math.pow(Math.random(), 0.35);
    const width = minW + (maxW - minW) * t;
    const baseY = world.h - 100;
    const y = clamp(baseY - randRange(0, 120), world.h * 0.3, world.h - 60);
    const h = 40;
    const x = cursorX + gap;
    
    platforms.push({x, y, w: width, h});

    // Spawn obstacles
    const slots = Math.random() < 0.4 ? 1 : 0;
    for (let i = 0; i < slots; i++) {
      const isMine = Math.random() < 0.6;
      const ox = x + randRange(30, Math.max(40, width - 40));
      if (isMine) {
        obstacles.push({ x: ox, y: y - 20, w: 30, h: 20, hp: 1, type: 'mine' });
      } else {
        obstacles.push({ x: ox, y: y - 60 - randRange(0, 30), w: 35, h: 25, hp: 1, type: 'drone' });
      }
    }
    
    return x + width;
  }

  function maxHorizontalJumpDistance(scrollSpeed) {
    const t = (2 * player.jumpV) / world.gravity;
    return scrollSpeed * t;
  }

  function maxHorizontalDoubleJumpDistance(scrollSpeed) {
    return maxHorizontalJumpDistance(scrollSpeed) * 1.9;
  }

  function randRange(a, b) {
    return a + Math.random() * (b - a);
  }

  function clamp(v, lo, hi) {
    return Math.max(lo, Math.min(hi, v));
  }

  const justPressed = new Set();
  const justTouched = new Set();

  function handleInput(dt) {
    // Jump - Space or ArrowUp
    if (player.buffer > 0) {
      if (canJump()) {
        doJump();
        player.buffer = 0;
      } else {
        player.buffer -= dt;
      }
    }
    
    // Also check for ArrowUp directly
    if (keys.has('ArrowUp') && !justPressed.has('ArrowUp')) {
      justPressed.add('ArrowUp');
      if (canJump()) {
        doJump();
      }
    }
    
    // Attack
    if (pressedOnce('KeyJ') || touchedOnce('attack')) {
      console.log('Attack triggered!');
      tryAttack();
    }
    
    // Tag
    if (pressedOnce('KeyQ') || touchedOnce('tag')) {
      console.log('Tag triggered!');
      tryTag();
    }
    
    // Slam
    if (pressedOnce('ArrowDown') || pressedOnce('KeyK') || touchedOnce('slam')) {
      console.log('Slam triggered!');
      trySlam();
    }
  }

  function pressedOnce(code) {
    if (keys.has(code) && !justPressed.has(code)) {
      justPressed.add(code);
      return true;
    }
    return false;
  }

  function touchedOnce(action) {
    if (touches.has(action) && !justTouched.has(action)) {
      justTouched.add(action);
      return true;
    }
    return false;
  }

  function lateInputFlush() {
    justPressed.clear();
    justTouched.clear();
  }

  function canJump() {
    return player.onGround || player.coyote > 0 || player.jumpsLeft > 0;
  }

  function doJump() {
    if (player.onGround || player.coyote > 0) {
      player.vy = -player.jumpV;
      player.onGround = false;
      player.jumpsLeft = 1;
      player.coyote = 0;
    } else if (player.jumpsLeft > 0) {
      player.vy = -player.jumpV * 0.95;
      player.jumpsLeft = 0;
    }
  }

  function tryAttack() {
    if (player.attackCooldown > 0) return;
    
    if (player.who === CHAR.MALE) {
      // Katana attack with animation
      player.swordSwing = 0.3; // Start sword swing animation
      const box = { x: player.x + player.w - 6, y: player.y - 20, w: 130, h: player.h + 60, life: 0.12 };
      meleeRects.push(box);
      slashes.push({ x: player.x + player.w + 10, y: player.y + player.h*0.25, life: 0.12, angle: -0.15, scaleX: 4, scaleY: 3 });
      slashes.push({ x: player.x + player.w + 20, y: player.y + player.h*0.70, life: 0.12, angle: 0.1, scaleX: 5, scaleY: 3 });
      player.attackCooldown = 0.3;
    } else {
      // Machine gun burst
      const shots = 6;
      const cadence = 0.06;
      burstQueue.push({ shotsLeft: shots, timer: 0, cadence });
      player.attackCooldown = shots * cadence + 0.12;
    }
  }

  function tryTag() {
    if (player.tagCooldown > 0) return;
    player.who = (player.who === CHAR.MALE) ? CHAR.FEMALE : CHAR.MALE;
    player.tagCooldown = 0.18;
    updateUI();
  }

  function trySlam() {
    if (player.onGround || player.slamCooldown > 0) return;
    player.vy = Math.max(player.vy, 2000);
    player.slamming = true;
    player.slamCooldown = 0.7;
    player.invulnerable = 0.5; // 슬램 중 0.5초 무적
  }

  function updateUI() {
    const distEl = document.getElementById('gameDistance');
    const speedEl = document.getElementById('gameSpeed');
    const charEl = document.getElementById('gameChar');
    
    if (distEl) distEl.textContent = Math.floor(world.distance) + 'm';
    if (speedEl) speedEl.textContent = Math.floor(world.speed);
    if (charEl) charEl.textContent = (player.who === CHAR.MALE) ? 'GROOM' : 'BRIDE';
  }

  function updateCombat(dt) {
    // Update melee rectangles
    for (let i = meleeRects.length - 1; i >= 0; i--) {
      const a = meleeRects[i];
      a.life -= dt;
      
      // Check collision with obstacles
      for (let j = obstacles.length - 1; j >= 0; j--) {
        const o = obstacles[j];
        if (aabb(a, o)) o.hp = 0;
      }
      
      if (a.life <= 0) meleeRects.splice(i, 1);
    }

    // Update slashes
    for (let i = slashes.length - 1; i >= 0; i--) {
      slashes[i].life -= dt;
      if (slashes[i].life <= 0) slashes.splice(i, 1);
    }

    // Update waves
    for (let i = waves.length - 1; i >= 0; i--) {
      const wv = waves[i];
      wv.life -= dt;
      wv.x -= world.speed * dt;
      wv.w += wv.expand * dt * 2;
      wv.x -= wv.expand * dt;
      
      for (let j = obstacles.length - 1; j >= 0; j--) {
        const o = obstacles[j];
        if (o.type === 'mine' && aabb(wv, o)) o.hp = 0;
      }
      
      if (wv.life <= 0) waves.splice(i, 1);
    }

    // Update burst firing
    for (let i = burstQueue.length - 1; i >= 0; i--) {
      const b = burstQueue[i];
      b.timer -= dt;
      
      if (b.timer <= 0 && b.shotsLeft > 0) {
        bullets.push({
          x: player.x + player.w * 0.9,
          y: player.y + player.h * 0.28,
          w: 12,
          h: 6,
          vx: 900,
          ttl: 1.6
        });
        b.shotsLeft--;
        b.timer = b.cadence;
      }
      
      if (b.shotsLeft <= 0) burstQueue.splice(i, 1);
    }

    // Update bullets
    for (let i = bullets.length - 1; i >= 0; i--) {
      const b = bullets[i];
      b.x += (b.vx - world.speed) * dt;
      b.ttl -= dt;
      
      for (let j = obstacles.length - 1; j >= 0; j--) {
        const o = obstacles[j];
        if (aabb(b, o)) {
          if (o.type === 'drone') o.hp = 0;
          b.ttl = 0;
          break;
        }
      }
      
      if (b.ttl <= 0 || b.x > world.w + 120) bullets.splice(i, 1);
    }
  }

  function aabb(a, b) {
    return a.x < b.x + b.w && a.x + (a.w || 0) > b.x && 
           a.y < b.y + b.h && a.y + (a.h || 0) > b.y;
  }

  // ===== Game Loop =====
  let lastTime = 0;
  let animationId = null;

  function startGame() {
    console.log('Starting game...');
    
    // Hide screens
    const startScreen = document.getElementById('startScreen');
    const gameOverScreen = document.getElementById('gameOverScreen');
    if (startScreen) startScreen.style.display = 'none';
    if (gameOverScreen) gameOverScreen.style.display = 'none';
    
    // Ensure canvas is set up
    if (!canvas || !ctx) {
      console.log('Canvas not ready, setting up...');
      setupCanvas();
      
      // Double check
      if (!canvas || !ctx) {
        console.error('Failed to set up canvas!');
        return;
      }
    }
    
    resetWorld();
    running = true;
    lastTime = performance.now();
    
    if (animationId) cancelAnimationFrame(animationId);
    animationId = requestAnimationFrame(gameLoop);
    
    console.log('Game started successfully');
  }

  function gameLoop(t) {
    if (!running) return;
    
    const dt = Math.min(0.033, (t - lastTime) / 1000);
    lastTime = t;

    // Verify canvas is still valid
    if (!ctx || !canvas) {
      console.error('Canvas lost during game loop!');
      return;
    }

    handleInput(dt);

    // Update world
    world.time += dt;
    world.speed = clamp(world.baseSpeed + world.accelPerSec * world.time, world.baseSpeed, world.maxSpeed);
    const animScale = world.speed / world.baseSpeed;
    player.animTime += dt * player.baseAnimRate * animScale;

    // Physics
    const prevY = player.y;
    player.vy += world.gravity * dt;
    player.y += player.vy * dt;

    // Coyote time
    if (player.onGround) {
      player.coyote = COYOTE_TIME;
    } else {
      player.coyote = Math.max(0, player.coyote - dt);
    }

    // Platform collisions
    let landedThisFrame = false;
    const prevOnGround = player.onGround;
    player.onGround = false;
    
    for (const p of platforms) {
      const xOverlap = !(player.x + player.w < p.x || player.x > p.x + p.w);
      const topY = p.y - player.h;
      const crossed = (prevY <= topY && player.y >= topY);
      
      if (xOverlap && crossed && player.vy >= 0 && (player.y - prevY) <= 120) {
        player.y = topY;
        player.vy = 0;
        player.onGround = true;
        player.jumpsLeft = 2;
        player.buffer = 0;
        landedThisFrame = !prevOnGround;
        break;
      }
      
      const feet = {x: player.x + 6, y: player.y + player.h - 4, w: player.w - 12, h: 6};
      if (player.vy >= 0 && feet.x < p.x + p.w && feet.x + feet.w > p.x) {
        if (player.y >= topY - 6 && player.y <= topY + 14) {
          player.y = topY;
          player.vy = 0;
          player.onGround = true;
          player.jumpsLeft = 2;
          player.buffer = 0;
          landedThisFrame = !prevOnGround;
          break;
        }
      }
    }

    // Slam landing
    if (landedThisFrame && player.slamming) {
      waves.push({
        x: player.x - 40,
        y: player.y + player.h - 10,
        w: 80,
        h: 18,
        life: 0.18,
        expand: 1000
      });
      world.shake = Math.min(world.shake + 12, 18);
      player.slamming = false;
      player.invulnerable = 0.3; // 착지 후 추가 무적
      
      // 슬램 착지 시 주변 지뢰 즉시 파괴
      for (let i = obstacles.length - 1; i >= 0; i--) {
        const o = obstacles[i];
        if (o.type === 'mine' && Math.abs(o.x - player.x) < 150) {
          o.hp = 0;
        }
      }
    }

    // Scroll world
    const dx = world.speed * dt;
    for (const p of platforms) p.x -= dx;
    for (const o of obstacles) o.x -= dx;
    for (const m of meleeRects) m.x -= dx;

    // Clean up off-screen elements
    while (platforms.length && platforms[0].x + platforms[0].w < -200) platforms.shift();
    while (obstacles.length && obstacles[0].x + obstacles[0].w < -200) obstacles.shift();

    // Spawn new platforms
    let rightMost = -1e9;
    for (const p of platforms) rightMost = Math.max(rightMost, p.x + p.w);
    while (rightMost < world.w + 300) rightMost = spawnPlatformCursor(rightMost);

    // Update cooldowns and timers
    player.attackCooldown = Math.max(0, player.attackCooldown - dt);
    player.tagCooldown = Math.max(0, player.tagCooldown - dt);
    player.slamCooldown = Math.max(0, player.slamCooldown - dt);
    player.swordSwing = Math.max(0, player.swordSwing - dt);
    player.invulnerable = Math.max(0, player.invulnerable - dt);

    // Update combat
    updateCombat(dt);

    // Remove destroyed obstacles
    for (let i = obstacles.length - 1; i >= 0; i--) {
      if (obstacles[i].hp <= 0) obstacles.splice(i, 1);
    }

    // Check collisions with player (if not invulnerable)
    if (player.invulnerable <= 0) {
      const body = {x: player.x + 4, y: player.y + 4, w: player.w - 8, h: player.h - 8};
      for (const o of obstacles) {
        if (aabb(body, o)) {
          // 슬램 중이면 지뢰는 파괴
          if (player.slamming && o.type === 'mine') {
            o.hp = 0;
            continue;
          }
          endGame();
          return;
        }
      }
    }

    // Check if player fell
    if (player.y > world.h + 200) {
      endGame();
      return;
    }

    // Update distance
    world.distance += dx / 50;

    // Render
    render(animScale);
    updateUI();

    // Camera shake decay
    world.shake = Math.max(0, world.shake - 0.9);

    lateInputFlush();
    animationId = requestAnimationFrame(gameLoop);
  }

  let highScore = 0;
  
  async function endGame() {
    running = false;
    
    const currentScore = Math.floor(world.distance);
    
    // Check if it's a new high score
    try {
      if (window.getGameLeaderboard) {
        const scores = await window.getGameLeaderboard();
        if (scores.length > 0) {
          highScore = scores[0].score || 0;
        }
      }
    } catch (error) {
      console.error('Error fetching high score:', error);
    }
    
    const isNewRecord = currentScore > highScore;
    
    const finalScoreEl = document.getElementById('finalScore');
    const recordSubmit = document.getElementById('recordSubmit');
    const normalRestart = document.getElementById('normalRestart');
    const gameOverScreen = document.getElementById('gameOverScreen');
    
    if (finalScoreEl) {
      if (isNewRecord) {
        finalScoreEl.innerHTML = `
          <div style="color:#ffde00;font-size:16px;margin-bottom:10px;animation:blink 0.5s infinite;">
            🏆 신기록 달성! 🏆
          </div>
          거리: ${currentScore}m<br>
          최고 속도: ${Math.floor(world.speed)}
        `;
      } else {
        finalScoreEl.innerHTML = `
          거리: ${currentScore}m<br>
          최고 속도: ${Math.floor(world.speed)}<br>
          <span style="color:#888;">최고 기록: ${highScore}m</span>
        `;
      }
      
      // 항상 기록 입력 패널 표시 (점수가 0보다 클 때만)
      if (currentScore > 0) {
        if (recordSubmit) recordSubmit.style.display = 'block';
        if (normalRestart) normalRestart.style.display = 'none';
      } else {
        // 점수가 0이면 재시작 버튼만 표시
        if (recordSubmit) recordSubmit.style.display = 'none';
        if (normalRestart) normalRestart.style.display = 'block';
      }
      
      // Show game over screen
      if (gameOverScreen) gameOverScreen.style.display = 'flex';
    }
    
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  }

  // ===== Rendering =====
  function render(animScale) {
    if (!ctx || !canvas) {
      console.error('Canvas or context not initialized');
      return;
    }
    
    const W = canvas.width;
    const H = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, W, H);
    
    // Apply camera shake
    if (world.shake > 0) {
      const sx = (Math.random() - 0.5) * world.shake;
      const sy = (Math.random() - 0.5) * world.shake;
      ctx.save();
      ctx.translate(sx, sy);
      renderScene(W, H, animScale);
      ctx.restore();
    } else {
      renderScene(W, H, animScale);
    }
  }

  function renderScene(W, H, animScale) {
    // Background - dark gradient
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#1a0633');
    g.addColorStop(1, '#0a0318');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    
    // Stars
    drawStars(W, H);
    
    // Platforms - simple neon style
    for (const p of platforms) {
      // Platform body
      ctx.fillStyle = '#ff006e';
      ctx.fillRect(p.x, p.y, p.w, p.h);
      
      // Top highlight
      ctx.fillStyle = '#ff4590';
      ctx.fillRect(p.x, p.y, p.w, 4);
    }
    
    // Obstacles
    for (const o of obstacles) {
      if (o.type === 'mine') {
        // Mine - red spiky
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(o.x, o.y, o.w, o.h);
        ctx.fillStyle = '#ffff00';
        ctx.fillRect(o.x + o.w/2 - 2, o.y + 2, 4, 4);
      } else {
        // Drone - blue flying enemy
        ctx.fillStyle = '#00ffff';
        ctx.fillRect(o.x, o.y, o.w, o.h);
        ctx.fillStyle = '#0099ff';
        ctx.fillRect(o.x + 2, o.y + 2, o.w - 4, o.h - 4);
      }
    }

    // Bullets
    ctx.fillStyle = '#ffde00';
    for (const b of bullets) {
      ctx.fillRect(b.x, b.y, b.w, b.h);
    }

    // Waves
    for (const wv of waves) {
      const alpha = Math.max(0, wv.life / 0.18);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#00ffff';
      ctx.fillRect(wv.x, wv.y, wv.w, wv.h);
      ctx.restore();
    }

    // Slashes
    for (const s of slashes) {
      const alpha = Math.max(0, s.life / 0.12);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#ff006e';
      ctx.translate(s.x, s.y);
      ctx.rotate(s.angle);
      ctx.fillRect(0, 0, 40, 8);
      ctx.restore();
    }

    // Player
    drawPlayer(animScale);
  }

  const starField = [...Array(80)].map(() => ({
    x: Math.random(),
    y: Math.random(),
    z: Math.random()
  }));

  function drawStars(W, H) {
    for (const s of starField) {
      let x = (s.x * W - (world.speed * 0.12 * world.time) % W);
      if (x < 0) x += W;
      const size = 1 + Math.floor(s.z * 2);
      ctx.globalAlpha = 0.5 + s.z * 0.5;
      ctx.fillStyle = '#c2d3ff';
      ctx.fillRect(x, s.y * H * 0.7, size, size);
      ctx.globalAlpha = 1;
    }
  }

  function drawPlayer(animScale) {
    const t = player.animTime;
    const leg = Math.sin(t * 10) * 3 * animScale;
    const x = Math.floor(player.x);
    const y = Math.floor(player.y);
    
    // Invulnerability flashing effect
    if (player.invulnerable > 0) {
      const flash = Math.sin(player.invulnerable * 30) > 0;
      if (flash) {
        ctx.globalAlpha = 0.5;
      }
    }
    
    if (player.who === CHAR.MALE) {
      // GROOM - Simple White Tuxedo
      // Body
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x + 10, y + 20, 30, 25);
      
      // Head
      ctx.fillStyle = '#fdbcb4';
      ctx.fillRect(x + 15, y + 5, 20, 18);
      
      // Hair
      ctx.fillStyle = '#000000';
      ctx.fillRect(x + 15, y + 5, 20, 7);
      
      // Eyes
      ctx.fillStyle = '#000000';
      ctx.fillRect(x + 19, y + 12, 3, 3);
      ctx.fillRect(x + 28, y + 12, 3, 3);
      
      // Bow tie
      ctx.fillStyle = '#ff006e';
      ctx.fillRect(x + 22, y + 23, 6, 3);
      
      // Legs
      ctx.fillStyle = '#000000';
      ctx.fillRect(x + 12, y + 45, 10, 15 + leg);
      ctx.fillRect(x + 28, y + 45, 10, 15 - leg);
      
      // Katana with swing animation
      ctx.save();
      if (player.swordSwing > 0) {
        // Swing animation - fast downward slash
        const progress = 1 - (player.swordSwing / 0.3);
        const swingAngle = -Math.PI/4 + (Math.PI * 0.7 * progress); // Start from up, swing down
        ctx.translate(x + 35, y + 27);
        ctx.rotate(swingAngle);
        
        // Draw sword
        ctx.fillStyle = '#e0e0e0';
        ctx.fillRect(0, -2, 50, 5);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, -1, 50, 3);
        
        // Swing effect - multiple slash lines
        if (progress < 0.6) {
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.8 - progress})`;
          ctx.lineWidth = 3;
          for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.moveTo(10 + i * 5, -10 - i * 3);
            ctx.lineTo(40 + i * 5, 10 + i * 3);
            ctx.stroke();
          }
        }
      } else {
        // Normal sword position
        ctx.fillStyle = '#e0e0e0';
        ctx.fillRect(x + 42, y + 25, 35, 4);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x + 42, y + 26, 35, 2);
      }
      ctx.restore();
      
    } else {
      // BRIDE - Simple Pink Dress
      // Dress
      ctx.fillStyle = '#ff69b4';
      ctx.fillRect(x + 8, y + 25, 34, 30);
      
      // Head
      ctx.fillStyle = '#fdbcb4';
      ctx.fillRect(x + 15, y + 5, 20, 18);
      
      // Hair
      ctx.fillStyle = '#8b4513';
      ctx.fillRect(x + 12, y + 5, 26, 15);
      
      // Eyes
      ctx.fillStyle = '#000000';
      ctx.fillRect(x + 19, y + 12, 3, 3);
      ctx.fillRect(x + 28, y + 12, 3, 3);
      
      // Legs
      ctx.fillStyle = '#fdbcb4';
      ctx.fillRect(x + 15, y + 50, 8, 10 + leg);
      ctx.fillRect(x + 27, y + 50, 8, 10 - leg);
      
      // Machine Gun
      ctx.fillStyle = '#2a2a2a';
      ctx.fillRect(x + 44, y + 28, 20, 6);
      ctx.fillStyle = '#4a4a4a';
      ctx.fillRect(x + 62, y + 29, 10, 4);
      
      // Muzzle flash when shooting
      if (player.attackCooldown > 0.1) {
        ctx.fillStyle = '#ffff00';
        ctx.fillRect(x + 72, y + 27, 12, 8);
      }
    }
    
    // Reset alpha after drawing
    ctx.globalAlpha = 1;
  }

  // ===== Firebase Integration =====
  async function submitScore() {
    const nameInput = document.getElementById('playerName');
    const name = nameInput.value.trim();
    
    if (!name) {
      alert('이름을 입력해주세요!');
      return;
    }
    
    const score = Math.floor(world.distance);
    
    try {
      // Firebase 연동 (전역 함수로 정의됨)
      if (window.submitGameScore) {
        await window.submitGameScore(name, score);
        
        // 점수 등록 성공 메시지
        alert(`${name}님의 기록(${score}m)이 등록되었습니다!`);
        
        // 이름 입력란 초기화
        nameInput.value = '';
        
        // 리더보드 새로고침
        loadLeaderboard();
        
        // Close the submit panel after successful submission
        document.getElementById('gameOverScreen').style.display = 'none';
        document.getElementById('startScreen').style.display = 'flex';
      }
    } catch (error) {
      console.error('Error submitting score:', error);
      alert('점수 등록에 실패했습니다.');
    }
  }

  let currentLeaderboardPage = 0;
  const ITEMS_PER_PAGE = 10;
  
  async function loadLeaderboard() {
    try {
      if (window.getGameLeaderboard) {
        const scores = await window.getGameLeaderboard();
        const listEl = document.getElementById('leaderboardList');
        const fullLeaderboardEl = document.getElementById('fullLeaderboard');
        const leaderboardPagesEl = document.getElementById('leaderboardPages');
        const paginationEl = document.getElementById('leaderboardPagination');
        
        // Show top 3 in game panel
        if (listEl && scores.length > 0) {
          listEl.innerHTML = scores.slice(0, 3).map((s, i) => {
            const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉';
            return `<div style="margin-bottom:0.3vw;">${medal} ${s.name}: ${s.score}m</div>`;
          }).join('');
        } else if (listEl) {
          listEl.innerHTML = 'No scores yet';
        }
        
        // Show full leaderboard with pagination for all scores
        if (scores.length > 0 && fullLeaderboardEl && leaderboardPagesEl && paginationEl) {
          fullLeaderboardEl.style.display = 'block';
          
          // Calculate pagination for ALL scores
          const totalPages = Math.ceil(scores.length / ITEMS_PER_PAGE);
          const startIdx = currentLeaderboardPage * ITEMS_PER_PAGE;
          const endIdx = Math.min(startIdx + ITEMS_PER_PAGE, scores.length);
          const pageScores = scores.slice(startIdx, endIdx);
          
          // Display current page scores
          leaderboardPagesEl.innerHTML = pageScores.map((s, i) => {
            const rank = startIdx + i + 1;
            let rankDisplay = '';
            if (rank === 1) rankDisplay = '🥇 #1';
            else if (rank === 2) rankDisplay = '🥈 #2';
            else if (rank === 3) rankDisplay = '🥉 #3';
            else rankDisplay = `#${rank}`;
            
            return `
              <div style="
                padding: 8px;
                background: ${rank <= 3 ? 'rgba(255,0,110,0.2)' : 'rgba(10,10,20,0.8)'};
                border: 2px solid ${rank <= 3 ? '#ffde00' : '#ff006e'};
                color: #ffde00;
                font-family: 'Press Start 2P', monospace;
                font-size: 10px;
                line-height: 1.5;
              ">
                ${rankDisplay} ${s.name}: ${s.score}m
              </div>
            `;
          }).join('');
          
          // Create pagination buttons
          paginationEl.innerHTML = '';
          for (let i = 0; i < totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.textContent = `${i + 1}`;
            pageBtn.style.cssText = `
              padding: 8px 12px;
              background: ${i === currentLeaderboardPage ? '#ff006e' : '#333'};
              border: 2px solid #ff006e;
              color: white;
              font-family: 'Press Start 2P', monospace;
              font-size: 10px;
              cursor: pointer;
            `;
            pageBtn.onclick = () => {
              currentLeaderboardPage = i;
              loadLeaderboard();
            };
            paginationEl.appendChild(pageBtn);
          }
        } else if (fullLeaderboardEl) {
          fullLeaderboardEl.style.display = 'none';
        }
      }
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    }
  }

  // Load leaderboard on init
  setTimeout(() => {
    console.log('Loading initial leaderboard...');
    loadLeaderboard();
  }, 1000);
})();