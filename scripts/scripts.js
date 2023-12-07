const grasses = document.querySelectorAll('.grass');
const scoreBoard = document.querySelector('.score');
const monkeys = document.querySelectorAll('.monkey');
const timerBoard = document.querySelector("#timer");
const startButton = document.getElementById("button");

let lastGrass;
let timeUp = false;
let score = 0;
let timer;
let countdown = 30;
let gameRunning = false;
let nextMonkeyTimeout;

function randomTime() {
    return Math.round(Math.random() * (1500 - 500) + 500); 
  }
  

function randomGrass(grasses) {
  const idx = Math.floor(Math.random() * grasses.length);
  const grass = grasses[idx];
  if (grass === lastGrass) {
    return randomGrass(grasses);
  }
  lastGrass = grass;
  return grass;
}

function updateTimer() {
  timerBoard.innerHTML = `Time: ${countdown}`;
}

function startCountdown() {
  if (countdown > 0) {
    countdown--;
    updateTimer();
    if (gameRunning) {
      setTimeout(startCountdown, 1000);
    }
  } else {
    stopGame();
  }
}

function peep() {
  const time = randomTime(800, 2000);
  const grass = randomGrass(grasses);
  grass.classList.add('up');
  timer = setTimeout(() => {
    grass.classList.remove('up');
    if (!timeUp) {
      nextMonkeyTimeout = setTimeout(peep, 500);
    }
  }, time);
}

function startGame() {
  if (gameRunning) {
    clearTimeout(timer);
    clearTimeout(nextMonkeyTimeout);
    grasses.forEach(grass => grass.classList.remove('up'));
  }


  scoreBoard.textContent = `Score: ${score}`;
  timeUp = false;
  score = 0;
  countdown = 30;
  updateTimer();
  gameRunning = true;
  nextMonkeyTimeout = setTimeout(peep, 0);
  startCountdown();
  startButton.removeEventListener('click', startGame);
  startButton.textContent = "Stop";
}

function stopGame() {
    clearTimeout(timer);
    clearTimeout(nextMonkeyTimeout);
    timeUp = true;
    alert("Game over. Your score is: " + score);
    scoreBoard.textContent = `Score: 0`; 
    countdown = 0;
    updateTimer(); 
    gameRunning = false;
    startButton.addEventListener('click', startGame);
    startButton.textContent = "Start";
}



function whack(e) {
  if (!e.isTrusted || timeUp || !gameRunning) return;
  score++;
  this.parentNode.classList.remove('up');
  scoreBoard.textContent = `Score: ${score}`;
}

monkeys.forEach(monkey => monkey.addEventListener('click', whack));
startButton.addEventListener('click', () => {
  if (gameRunning) {
    stopGame();
  } else {
    startGame();
  }
});
