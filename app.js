const parent = document.querySelector("body")

// Initial vy
const startView = document.querySelector(".welcome-view")
const inputOne = document.getElementById("playerOneInput");
const inputTwo = document.getElementById("playerTwoInput");
const startGameBtn = document.getElementById("startGameBtn");
startGameBtn.addEventListener('click', startGame);

// spelvy
const playGround = document.querySelector(".playground");
const playerOneName = document.getElementById("playerOne");
const playerTwoName = document.getElementById("playerTwo");
const playerTurnLbl = document.querySelector(".player-turn-lbl");
const cardContainer = document.querySelector(".card-container");

// skapa återställ och avsluta knappar
const resetContainer = document.querySelector(".reset-container");
const resetBtn = document.createElement("button");
resetBtn.innerHTML = "Återställ poängen";
const endGameBtn = document.createElement("button");
endGameBtn.innerHTML = "Avsluta matchen";

// Spelare objekt
const playerOne = {
    name: "",
    score: 0,
}
const playerTwo = {
    name: "",
    score: 0,
}

// Array med våra två spelare
let players = [playerOne, playerTwo];
let gameTurn = 0;

const updateDisplays = () => {
    let currentPlayer = players[gameTurn];
    playerTurnLbl.innerText = currentPlayer.name + "s tur";

    playerOneName.innerHTML = `${playerOne.name}: ${playerOne.score}`;
    playerTwoName.innerHTML = `${playerTwo.name}: ${playerTwo.score}`;
}

const resetPoints = () => {
    // Töm poäng -> uppdatera display
    playerOne.score = 0;
    playerTwo.score = 0;
    updateDisplays();

    let randomCardData = randomize(cardData);
  
    const images = document.querySelectorAll("img");
    const cards = document.querySelectorAll(".card");

    randomCardData.forEach((item, index) => {
        // Ta bort klasser som korten fått från tidigare spelomgång
        // lägg tillbaka klickbarhet
        cards[index].classList.remove("toggleCard");
        cards[index].classList.remove("wonCard");
        cards[index].style.pointerEvents = "all";
        // Vänta 1 sekund innan nya kort fördelas ut
        setTimeout(() => {
            images[index].src = item.imgSrc;
            cards[index].setAttribute("name", item.name);
        }, 1000); 
    });
}

const endGame = () => {
    // Ladda om sidan
    window.location.reload();
}

const randomize = (array) => {
    // Fisher–Yates algoritmen
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];

        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function startGame() {
    if (inputOne.value == "" || inputTwo.value == "") {
        alert("You must input player names");
        return;
    }

    // ta bort initial vy, ta tillbaka spelplanen
    parent.removeChild(startView);
    parent.append(playGround);

    // Setting players
    playerOne.name = inputOne.value;
    playerTwo.name = inputTwo.value;
    updateDisplays();

    // Reset Game knapp
    resetContainer.appendChild(resetBtn);
    resetBtn.addEventListener('click', resetPoints);

    // End Game knapp
    resetContainer.appendChild(endGameBtn);
    endGameBtn.addEventListener('click', endGame);

    let randomCardData = randomize(cardData);

    randomCardData.forEach(item => {
        // skapa kort (div) för alla item i array cardData
        const card = document.createElement("div");
        card.classList.add("card");
        card.setAttribute("name", item.name);

        // skapa bild för varje item i array cardData
        const img = document.createElement("img");
        img.setAttribute("src", item.imgSrc);
        img.setAttribute("alt", item.name);

        const cover = document.createElement("div");
        cover.classList.add("cover");
        
        card.append(img);
        card.append(cover);

        cardContainer.appendChild(card);

        card.addEventListener('click', (e) => {
            handleGuess(e);
            card.classList.add("toggleCard");
        })
    });
}

const handleGuess = (e) => {
    let selectedCard = e.target.parentElement;

    selectedCard.classList.add("selected");

    const allSelectedCards = document.querySelectorAll(".selected");
    let currentPlayer = players[gameTurn];

    if (allSelectedCards.length == 2) {
       if(allSelectedCards[0].getAttribute('name') === allSelectedCards[1].getAttribute('name')) {

            allSelectedCards.forEach(element => {
                element.classList.remove("selected");
                // Gör så kortet inte är klickbart längre
                element.style.pointerEvents = "none";
                element.classList.add("wonCard");        
            });
            currentPlayer.score += 1; 
            updateDisplays();
       } else {
            // Om man väljer fel kort (ingen match) går turen över till nästa spelare
            setTimeout(() => {
                gameTurn = (gameTurn + 1) % 2; 
                updateDisplays();
            }, 1000);

            allSelectedCards.forEach(element => {
                element.classList.remove("selected");
                setTimeout(() => {
                    element.classList.remove("toggleCard");
                }, 1000);
            });        
       }
    }

    updateDisplays();
    const wonCards = document.querySelectorAll(".wonCard");

    if (wonCards.length === cardData.length) {
        if (players[0].score > players[1].score) {
            alert(`${players[0].name} vinner med ${players[0].score} poäng!`);
        } else if (players[1].score > players[0].score) {
            alert(`${players[1].name} vinner med ${players[1].score} poäng!`)
        } else {
            alert(`Det blev lika.${players[0].name}: ${players[0].score}. ${players[1].name}: ${players[1].score}`)
        }
   
    }
}