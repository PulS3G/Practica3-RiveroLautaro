class Memotest {
  constructor(boardId, attemptsId, messageId) {
    this.board = document.getElementById(boardId);
    this.attemptsDisplay = document.getElementById(attemptsId);
    this.message = document.getElementById(messageId);

    this.cardsData = [];
    this.flippedCards = [];
    this.matchedPairs = 0;
    this.failedAttempts = 0;
    this.isBusy = false;

    this.initGame();
  }

  initGame() {
    const baseEmojis = [
      "😀",
      "😃",
      "😄",
      "😁",
      "😆",
      "😅",
      "🤣",
      "😂",
      "🙂",
      "🙃",
      "🫠",
      "😉",
      "😊",
      "😇",
      "🥰",
      "😍",
      "🤩",
      "😘",
      "😗",
      "☺️",
      "😚",
      "😙",
      "🥲",
      "😋",
      "😛",
      "😜",
      "🤪",
      "😝",
      "🤑",
      "🤗",
      "🤭",
      "🫢",
      "🫣",
      "🤫",
      "🤔",
      "🫡",
      "🤐",
      "🤨",
      "😐",
      "😑",
      "😶",
      "🫥",
      "😏",
      "😒",
      "🙄",
      "😬",
      "😮‍💨",
      "🤥",
      "🫨",
      "👻",
    ];

    const deck = [...baseEmojis, ...baseEmojis];

    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    this.cardsData = deck;
    this.render();
  }

  render() {
    this.board.innerHTML = "";
    this.cardsData.forEach((emoji) => {
      const card = document.createElement("div");
      card.classList.add("card");

      card.style.cssText =
        "width: 40px; height: 40px; border: 1px solid #ccc; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 18px; background: #333; color: transparent; user-select: none;";

      card.dataset.value = emoji;
      card.addEventListener("click", () => this.handleFlip(card));
      this.board.appendChild(card);
    });
  }

  handleFlip(card) {
    if (
      this.isBusy ||
      card.classList.contains("flipped") ||
      card.classList.contains("matched")
    )
      return;

    card.innerText = card.dataset.value;
    card.style.color = "white";
    card.style.background = "#555";
    card.classList.add("flipped");
    this.flippedCards.push(card);

    if (this.flippedCards.length === 2) {
      this.checkMatch();
    }
  }

  checkMatch() {
    this.isBusy = true;
    const [card1, card2] = this.flippedCards;

    if (card1.dataset.value === card2.dataset.value) {
      card1.classList.add("matched");
      card2.classList.add("matched");
      card1.style.background = "#2ecc71";
      card2.style.background = "#2ecc71";
      this.matchedPairs++;
      this.flippedCards = [];
      this.isBusy = false;

      if (this.matchedPairs === 50) {
        this.message.innerText = `¡Ganaste! Total de fallos: ${this.failedAttempts}`;
      }
    } else {
      this.failedAttempts++;
      this.attemptsDisplay.innerText = `Errores: ${this.failedAttempts}`;

      setTimeout(() => {
        card1.innerText = "";
        card2.innerText = "";
        card1.classList.remove("flipped");
        card2.classList.remove("flipped");
        card1.style.background = "#333";
        card2.style.background = "#333";
        this.flippedCards = [];
        this.isBusy = false;
      }, 800);
    }
  }
}

new Memotest("board", "attempts", "message");
