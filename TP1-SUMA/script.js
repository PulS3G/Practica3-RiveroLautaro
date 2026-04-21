const display = document.getElementById("display");
const startBtn = document.getElementById("start-btn");
const answerSection = document.getElementById("answer-section");
const userSumInput = document.getElementById("user-sum");
const checkBtn = document.getElementById("check-btn");
const message = document.getElementById("message");

let numbers = [];
let totalSum = 0;

function generateNumbers() {
  numbers = [];
  let currentSum = 0;

  for (let i = 0; i < 5; i++) {
    let num;
    do {
      num = Math.floor(Math.random() * 21) - 10;
    } while (num === 0);

    numbers.push(num);
    currentSum += num;
  }

  totalSum = currentSum;

  if (totalSum <= 0) return generateNumbers();
}

async function startSequence() {
  startBtn.classList.add("hidden");
  answerSection.classList.add("hidden");
  message.innerText = "";
  userSumInput.value = "";

  generateNumbers();

  for (let num of numbers) {
    display.innerText = num;
    await new Promise((resolve) => setTimeout(resolve, 2000));
    display.innerText = "";
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  display.innerText = "?";
  answerSection.classList.remove("hidden");
}

checkBtn.onclick = () => {
  const userValue = parseInt(userSumInput.value);
  if (userValue === totalSum) {
    message.style.color = "#44ff44";
    message.innerText = "¡Correcto! La suma es " + totalSum;
  } else {
    message.style.color = "#ff4444";
    message.innerText = "Error. La suma era " + totalSum;
  }
  startBtn.classList.remove("hidden");
  startBtn.innerText = "Reintentar";
};

startBtn.onclick = startSequence;
