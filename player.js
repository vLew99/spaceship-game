function Player() {

	this.init = (canvas) => {
		this.location.x = canvas.width/2;
		this.location.y = canvas.height/2;
		this.sprite = new Image();
		this.sprite.src = "spaceship2.png";
	};

	this.acceleration = 0.1;
	this.maxVelocity = 5;
	this.health = 100;
	this.color = "white";
	this.location = {
		x: null,
		y: null,
	};

	this.size = {
		w: 40,
		h: 70,
	};

	this.sprite = null;

	this.draw = (ctx) => {
		ctx.beginPath();
		ctx.drawImage(this.sprite, this.location.x, this.location.y, this.size.w, this.size.h);
		ctx.fillStyle = this.color;
		ctx.font = "14px Arial";
		ctx.fillText(`Speed: (${this.velocity.x}, ${this.velocity.y})`, 20, 70);	
		// ctx.fillRect(this.location.x, this.location.y, this.size.w, this.size.h);
	}

	this.velocity = {
		x: 0,
		y: 0,
	}

	this.move = () => {
		this.location.x += this.velocity.x;
		this.location.y += this.velocity.y;
	}

	this.damaged = false;

	this.playerDamage = (damage) => {
		this.health -= damage;
		this.damaged = true;
		this.sprite.src = "spaceship_hurt.png";
		setTimeout(() => {
			this.sprite.src = "spaceship2.png";
		}, 1000);
	}
}


function Bullet() {
	this.color = "#7777FF";
	
	this.speed = 1.5;

	this.location = {
		x: null,
		y: null,
	}
	
	this.size = {
		w: 5,
		h: 10,
	}

	this.draw = (ctx) => {
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.fillRect(this.location.x, this.location.y, this.size.w, this.size.h);
	}

	this.move = () => {
		// this.location.x += 0;
		this.location.y -= this.speed;
	}

}

function Enemy() {
	this.color = `hsl(${Math.floor(Math.random()*360)}, 50%, 50%)`;
	this.speed = 2;
	this.size = {
		w: 40,
		h: 40,
	}

	this.location = {
		x: null,
		y: null, 
	}


	this.setLocation = (x, y) => {
		this.location.x = x;
		this.location.y = y;
	}

	this.draw = (ctx) => {
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.fillRect(this.location.x, this.location.y, this.size.w, this.size.h);
	}

	this.move = () => {
		this.location.y += this.speed;
	}

	this.enemyDestroy = (enemies) => {

	}
}


function Score() {
	this.scoreValue = 0;
	this.fontSize = 12;
	this.position = {
		x: 20,
		y: 40,
	};
	this.fontFamily = "Arial";
	this.color = "white";
	this.draw =(ctx) => {
		ctx.fillStyle = this.color;
		ctx.font = `${this.fontSize}px ${this.fontFamily}`;
		ctx.fillText(`SCORE: ${this.scoreValue}`, this.position.x, this.position.y );
	}
}