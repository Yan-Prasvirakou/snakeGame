export default class Game {

	constructor({element, width, height, images, box, speed})	{
		this.element = element;
		this.width = width;
		this.height = height;
		this.box = box;
		this.speed = speed;

		this.canvas = document.querySelector(this.element);
		this.canvas.width = this.width;
		this.canvas.height = this.height;
		this.ctx = this.canvas.getContext('2d');
		this.ctx.font = 'Balsamiq Sans';

		this.returnImages = function() {
			for (let key in images) {
					images[key] = new Image();
					images[key].src = `img/${key}.png`;
			}
			return images;
		}

		this.score = 0;
		this.isPlaying = false;
		this.game;
		this.dir;
		this.gameOver = false;

		this.food;

		this.snake = [];
		this.snake[0] = {
			x: 9 * this.box,
			y: 10 * this.box
		};

		document.addEventListener('keydown', this.direction);
		document.addEventListener('keydown', this.pausePlay);

		this.play();
		this.getFoodCoords();
			
	}


	getFoodCoords() {
		this.food = {
			x: Math.floor((Math.random() * 17 + 1)) * this.box,
			y: Math.floor((Math.random() * 15 + 3)) * this.box,
		};
	}

	direction = (event) => {
		if (event.code == 'KeyA' && this.dir != 'right') this.dir = 'left';
		else if (event.code == 'KeyW' && this.dir != 'down') this.dir = 'up';
		else if (event.code == 'KeyD' && this.dir != 'left') this.dir = 'right';
		else if (event.code == 'KeyS' && this.dir != 'up') this.dir = 'down';
	}

	eatTail(head, body) {
		for (let i = 0; i < body.length; i++) {
			if (head.x == body[i].x && head.y == body[i].y) {
				return true;
			}
		}
		return false
	}

	pausePlay = (event) => {
		if (event.code == 'Enter' && this.dir) {
			if (this.isPlaying) this.pause();
			else this.play();
		}
	}

	startGame(int) {
		this.game = setInterval(() => {
			this.drawGame()
		}, int);
	}

	stopGame() {
		clearInterval(this.game);
	}

	play() {
		this.isPlaying = true;
		this.startGame(this.speed);
		document.removeEventListener('keydown', this.startAgain);
	}

	pause() {
		this.isPlaying = false;
		this.stopGame();
		this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
		this.ctx.fillRect(0, 0, this.width, this.height);

		this.ctx.font = '32px "Balsamiq Sans"';
		this.ctx.fillStyle = '#fff';
		this.ctx.textAlign = 'center';
		this.ctx.textBaseline = 'middle';
		this.ctx.fillText('Пауза', this.width / 2, this.height / 2);
	}

	startAgain = (event) => {
		if (event.code == 'Enter') {
			this.dir = undefined;
			this.score = 0;

			this.snake = [];
			this.snake[0] = {
				x: 9 * this.box,
				y: 10 * this.box
			};

			document.addEventListener('keydown', this.pausePlay);
			this.play()
		}
	}


	drawGame() {

		this.ctx.drawImage(this.returnImages().ground, 0, 0);
		this.ctx.drawImage(this.returnImages().carrot, this.food.x, this.food.y);

		for (let i = 0; i < this.snake.length; i++) {

			switch (this.dir) {
				case 'left':
					this.ctx.drawImage(this.returnImages().headLeft, this.snake[0].x, this.snake[0].y);
					break;
				case 'right':
					this.ctx.drawImage(this.returnImages().headRight, this.snake[0].x, this.snake[0].y);
					break;
				case 'up':
					this.ctx.drawImage(this.returnImages().headUp, this.snake[0].x, this.snake[0].y);
					break;
				case 'down':
				case undefined:
					this.ctx.drawImage(this.returnImages().headDown, this.snake[0].x, this.snake[0].y);
					break;
			}

			if (i > 0) {
				this.ctx.beginPath();
				this.ctx.strokeStyle = i % 2 ? '#0bdb2a' : '#dff20f';
				this.ctx.lineWidth = '32';
				this.ctx.lineCap = 'round';
				this.ctx.moveTo(this.snake[i].x + this.box / 2, this.snake[i].y + this.box / 2);
				this.ctx.lineTo(this.snake[i].x + this.box / 2, this.snake[i].y + this.box / 2);
				this.ctx.stroke();
			}

		}

		this.ctx.fillStyle = '#fff';
		this.ctx.font = '50px "Arial"';
		this.ctx.textAlign = 'center';
		this.ctx.textBaseline = 'middle';
		this.ctx.fillText(this.score, this.box * 3, this.box * 1.3);

		let snakeX = this.snake[0].x;
		let snakeY = this.snake[0].y;

		if (snakeX == this.food.x && snakeY == this.food.y) {
			this.score++;
			this.getFoodCoords();
		} else this.snake.pop();

		if (this.dir == 'left') snakeX -= this.box;
		if (this.dir == 'right') snakeX += this.box;
		if (this.dir == 'up') snakeY -= this.box;
		if (this.dir == 'down') snakeY += this.box;

		let newHead = {
			x: snakeX,
			y: snakeY
		};

		if (snakeX < this.box || snakeX > this.box * 17 || snakeY < 3 * this.box ||
			snakeY > this.box * 17 || this.eatTail(newHead, this.snake)) {
			clearInterval(this.game);
			this.isPlaying = false;
			document.removeEventListener('keydown', this.pausePlay);

			this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
			this.ctx.fillRect(0, 0, 620, 620);

			this.ctx.fillStyle = '#fff';
			this.ctx.textAlign = 'center';
			this.ctx.textBaseline = 'middle';

			this.ctx.font = '32px "Balsamiq Sans"';
			this.ctx.fillText('Игра окончена', this.width / 2, this.height / 2.2);
			this.ctx.font = '24px "Balsamiq Sans"';
			this.ctx.fillText('Чтобы начать занаво нажмите Enter', this.width / 2, this.height / 1.8);

			document.addEventListener('keydown', this.startAgain);
		};

		this.snake.unshift(newHead);

	}
}