let canvas;
let c;
let oldTimeStamp = 0;
let keyhold = {};
let keypress = {};
let mouseclicks = 0;
let player;
let bullets = [];
let enemies = [];
let running;
let score;
let currentVelocity = {x: 0, y: 0,};


window.onload = init;

function init() {
	canvas = document.getElementById("canvas")
	canvas.width = Math.min(innerWidth, 1000);
	canvas.height = Math.min(innerHeight, 800);
	c = canvas.getContext("2d")


	player = new Player();
	player.init(canvas);
	score = new Score();


	spawnEnemies(100, 100, 200);

	window.requestAnimationFrame(gameloop);
}

function gameloop(timeStamp) {
	frametime = (timeStamp - oldTimeStamp)/1000;
	oldTimeStamp = timeStamp;

	user_inputs();
	update();
	draw();

	if(running==false){
		return;
	}

	window.requestAnimationFrame(gameloop);
}

function spawnEnemies(spawnTimeDiff, minSpawnTime, maxEnemies) {
	if(maxEnemies > enemies.length) {
		let randomTime = (spawnTimeDiff) + minSpawnTime; 
		// console.log(randomTime);
		setInterval(()=> {
			let temp = new Enemy();
			temp.setLocation(Math.random()*(canvas.width- 200-temp.size.w) + 200,-temp.size.h);
			enemies.push(temp);
		}, randomTime);
	}
}


function user_inputs() {
	window.onkeydown = (event) => {
		if(event.keyCode == 32)
			mouseclicks += 1;
		else
			keyhold[event.keyCode] = true;
	}

	window.onkeyup = (event) => {
		keyhold[event.keyCode] = false;
	}


	window.onresize = (event) => {
		canvas.width = Math.min(innerWidth, 1000);
		canvas.height = Math.min(innerHeight, 800);
	}

	// console.log(keyhold);

	currentVelocity = {
		x: 0,
		y: 0,
	};

	player.acceleration = keyhold[16] ? 0.2:0.1;
	player.maxVelocity = keyhold[16] ? 7: 5;

	if(keyhold[65]) {
		currentVelocity.x -= player.acceleration;
	}
	if(keyhold[68]) {
		currentVelocity.x += player.acceleration;
	}
	if(keyhold[87]){
		currentVelocity.y -= player.acceleration;
	}
	if(keyhold[83]){
		currentVelocity.y += player.acceleration;
	}

	// console.log(`Curr: ${currentVelocity.x}`);
	// console.log(` Velocity : ${player.velocity.x}`);

	currentVelocity.x += player.velocity.x;
	currentVelocity.y += player.velocity.y;

	if(GetSquaredSum(currentVelocity.x, currentVelocity.y) <= player.maxVelocity*player.maxVelocity){
		// console.log(cumulativeSpeed(currentVelocity.x, currentVelocity.y));
		player.velocity = {...currentVelocity};
	}

	// if(cumulativeSpeed(player.velocity) > player.maxVelocity)
	// 	;



	if(mouseclicks>0) {
		let temp = new Bullet();
		temp.location = {...player.location};
		temp.location.x += (player.size.w - temp.size.w)/2;
		temp.location.y -= temp.size.h;
		bullets.push(temp);
		player.velocity.y = 0.3*temp.speed;
		mouseclicks -=1;
	}
}

function GetSquaredSum(x, y) {
	return x*x + y*y;
}

function update() {
	if(running==false)
		return;
	player.move()
	if(player.location.x < 0){
		// player.velocity.x += 2;
		player.playerDamage(100);
	}
	else if((player.location.x + player.size.w) > canvas.width){
		// player.velocity.x -= 2;
		player.playerDamage(100);
	}
	else if(player.location.y < 0) {
		// player.velocity.y += 2;
		player.playerDamage(100);
	}
	else if((player.location.y + player.size.h) > canvas.height) {
		player.playerDamage(100);
	}

	bullets.forEach((bullet, bulletIndex) => {
		bullet.move()
		// remove bulletsd
		if(bullet.location.y + bullet.size.h < 0)
			bullets.splice(bulletIndex, 1);
		// move bullets
	})

	// enemies
	enemies.forEach((enemy, enemyIndex) => {
		enemy.move();

		bullets.forEach((bullet, bulletIndex) => {
			if(checkCollision(bullet.size, bullet.location, enemy.size, enemy.location)) {
				bullets.splice(bulletIndex, 1);
				enemies.splice(enemyIndex, 1);
				score.scoreValue += 20;
			}
		})

		if(checkCollision(enemy.size, enemy.location, player.size, player.location)) {
			enemies.splice(enemyIndex, 1);
			player.playerDamage(25);
		}

		if(enemy.location.y > canvas.height)
			enemies.splice(enemyIndex, 1);
	})

	if(player.health <= 0) {
		setTimeout(()=> {
			running = false;
		}, 10);
	}
}

function checkCollision(objSize1, objLoc1, objSize2, objLoc2) {
	let rectA = {
		x1: objLoc1.x,
		y1: objLoc1.y,
		x2: objLoc1.x + objSize1.w,
		y2: objLoc1.y + objSize1.h,
	}

	let rectB = {
		x1: objLoc2.x,
		y1: objLoc2.y,
		x2: objLoc2.x + objSize2.w,
		y2: objLoc2.y + objSize2.h,
	}

	return !(rectA.x1 > rectB.x2 || rectA.x2 < rectB.x1 ||
    rectA.y1 > rectB.y2 || rectA.y2 < rectB.y1);

}

function draw() {
	c.fillStyle =  "rgba(0, 0, 0, 0.5)";
	c.fillRect(0, 0, canvas.width, canvas.height);
	bullets.forEach((bullet) => {
		bullet.draw(c);
	})
	enemies.forEach((enemy) => {
		enemy.draw(c);
	})

	player.draw(c);
	score.draw(c);
}
