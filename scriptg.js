/********** UI: sidebar collapse **********/
(function(){
  const sb = document.getElementById('sidebar');
  const btn = document.getElementById('collapseBtn');
  let collapsed = false;

  btn.addEventListener('click', ()=>{
    collapsed = !collapsed;
    if(collapsed){
      sb.style.transform = 'translateX(-220px)';
      btn.textContent = 'Expand';
    } else {
      sb.style.transform = '';
      btn.textContent = 'Collapse';
    }
  });

  document.getElementById('open-portal').addEventListener('click', (e)=>{
    e.preventDefault();
    document.getElementById('gallery')
      .scrollIntoView({behavior:'smooth', block:'center'});
  });
})();

/********** Custom cursor & trail **********/
(function(){
  const cursor = document.getElementById('cursor');
  const trail = document.getElementById('trail');

  let mouseX = innerWidth/2;
  let mouseY = innerHeight/2;
  let trailX = mouseX;
  let trailY = mouseY;

  document.addEventListener('mouseenter', ()=>{
    cursor.style.display='grid';
    trail.style.display='block';
  });

  document.addEventListener('mouseleave', ()=>{
    cursor.style.display='none';
    trail.style.display='none';
  });

  document.addEventListener('mousemove', (e)=>{
    mouseX = e.clientX;
    mouseY = e.clientY;

    cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;

    trailX += (mouseX - trailX) * 0.16;
    trailY += (mouseY - trailY) * 0.16;
    trail.style.transform = `translate(${trailX}px, ${trailY}px)`;
  });

  const interactiveSelector = 'a,button,input,textarea,.thumb';

  document.querySelectorAll(interactiveSelector).forEach(el=>{
    el.addEventListener('mouseenter', ()=>{
      cursor.style.width='48px';
      cursor.style.height='48px';
    });

    el.addEventListener('mouseleave', ()=>{
      cursor.style.width='34px';
      cursor.style.height='34px';
    });
  });
})();

/********** Space Invaders Game **********/
(function(){
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  let W = 900, H = 360;

  function resize(){
    const rect = canvas.getBoundingClientRect();
    W = rect.width;
    H = rect.height;
    canvas.width = W * devicePixelRatio;
    canvas.height = H * devicePixelRatio;
    ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
  }

  resize();
  window.addEventListener('resize', resize);

  let left=false, right=false, space=false;
  let score=0, lives=3;

  const scoreEl = document.getElementById('score');
  const livesEl = document.getElementById('lives');

  const player = {
    x: W/2,
    y: H - 30,
    w:38,
    h:12,
    speed:6,
    bullets:[]
  };

  let enemies=[];
  let enemyBullets=[];
  let enemyRows=3;
  let enemyCols=8;
  let enemyGap=8;
  let enemySpeed=0.4;
  let enemyDir=1;
  let frame=0;

  function spawnEnemies(){
    enemies=[];
    const ew=28, eh=16;
    const totalW = enemyCols * ew + (enemyCols-1)*enemyGap;
    const startX = (W - totalW)/2;

    for(let r=0;r<enemyRows;r++){
      for(let c=0;c<enemyCols;c++){
        enemies.push({
          x:startX + c*(ew+enemyGap),
          y:40 + r*(eh+enemyGap),
          w:ew,h:eh,row:r
        });
      }
    }
  }

  spawnEnemies();

  window.addEventListener('keydown',(e)=>{
    if(e.key==='ArrowLeft') left=true;
    if(e.key==='ArrowRight') right=true;
    if(e.code==='Space') space=true;
  });

  window.addEventListener('keyup',(e)=>{
    if(e.key==='ArrowLeft') left=false;
    if(e.key==='ArrowRight') right=false;
    if(e.code==='Space') space=false;
  });

  function rectsOverlap(a,b){
    return a.x < b.x + b.w &&
           a.x + a.w > b.x &&
           a.y < b.y + b.h &&
           a.y + a.h > b.y;
  }

  function resetGame(){
    lives=3;
    score=0;
    enemyRows=3;
    enemySpeed=0.4;
    player.bullets=[];
    enemyBullets=[];
    spawnEnemies();
  }

  function drawRoundedRect(x,y,w,h,r){
    ctx.beginPath();
    ctx.moveTo(x+r,y);
    ctx.arcTo(x+w,y,x+w,y+h,r);
    ctx.arcTo(x+w,y+h,x,y+h,r);
    ctx.arcTo(x,y+h,x,y,r);
    ctx.arcTo(x,y,x+w,y,r);
    ctx.closePath();
  }

  function render(){
    ctx.clearRect(0,0,W,H);

    ctx.fillStyle="rgba(255,255,255,0.02)";
    for(let gx=0;gx<W;gx+=30)
      ctx.fillRect(gx,0,0.6,H);

    ctx.fillStyle="#9be7d4";
    drawRoundedRect(player.x,player.y,player.w,player.h,4);
    ctx.fill();

    ctx.fillStyle="#fff";
    player.bullets.forEach(b=>{
      drawRoundedRect(b.x,b.y,b.w,b.h,2);
      ctx.fill();
    });

    const colors=["#ff9aa2","#ffd3b6","#d5f4e6","#b5e7ff","#cbb2ff"];

    enemies.forEach(e=>{
      ctx.fillStyle=colors[e.row%colors.length];
      drawRoundedRect(e.x,e.y,e.w,e.h,4);
      ctx.fill();
    });

    ctx.fillStyle="#ffd6a5";
    enemyBullets.forEach(b=>{
      drawRoundedRect(b.x,b.y,b.w,b.h,2);
      ctx.fill();
    });

    scoreEl.textContent=score;
    livesEl.textContent=lives;
  }

  function step(){
    frame++;

    if(left) player.x -= player.speed;
    if(right) player.x += player.speed;

    player.x = Math.max(6,Math.min(W-player.w-6,player.x));

    if(space && player.bullets.length<3 && frame%10===0){
      player.bullets.push({
        x:player.x + player.w/2 - 2,
        y:player.y - 8,
        w:4,h:8,speed:8
      });
    }

    player.bullets.forEach(b=> b.y -= b.speed);
    player.bullets = player.bullets.filter(b=> b.y>-10);

    let shiftDown=false;
    let minX=Infinity,maxX=-Infinity;

    enemies.forEach(e=>{
      minX=Math.min(minX,e.x);
      maxX=Math.max(maxX,e.x+e.w);
    });

    if(maxX>W-12 && enemyDir===1){
      enemyDir=-1;
      shiftDown=true;
    }

    if(minX<12 && enemyDir===-1){
      enemyDir=1;
      shiftDown=true;
    }

    enemies.forEach(e=>{
      e.x += enemyDir*enemySpeed;
      if(shiftDown) e.y+=12;
    });

    if(frame%40===0 && enemies.length){
      const cand=enemies[Math.floor(Math.random()*enemies.length)];
      enemyBullets.push({
        x:cand.x + cand.w/2 - 2,
        y:cand.y + cand.h + 4,
        w:4,h:8,speed:4
      });
    }

    enemyBullets.forEach(b=> b.y+=b.speed);
    enemyBullets = enemyBullets.filter(b=> b.y<H+20);

    for(let i=player.bullets.length-1;i>=0;i--){
      for(let j=enemies.length-1;j>=0;j--){
        if(rectsOverlap(player.bullets[i],enemies[j])){
          player.bullets.splice(i,1);
          enemies.splice(j,1);
          score+=10;
          break;
        }
      }
    }

    for(let i=enemyBullets.length-1;i>=0;i--){
      if(rectsOverlap(enemyBullets[i],player)){
        enemyBullets.splice(i,1);
        lives--;
        if(lives<=0) resetGame();
      }
    }

    if(enemies.length===0){
      enemyRows=Math.min(5,enemyRows+1);
      enemySpeed*=1.12;
      spawnEnemies();
    }

    render();
    requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
})();
