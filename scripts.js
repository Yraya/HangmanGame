//*** Hangman game ***

//**Falta por implementar: 
// 1) Comportamiento ante tildes
//    - No hay palabras con tilde
//    - Se añaden las letras con tilde a la lista de botones
//    - Se comprueba para cada letra si es un carácter especial
// 2) El usuario puede modiviar las vidas
// 3) Todos los mensajes con cambio de idioma

var vocalA = "áàäâ";
var vocalE = "úùüû";
var vocalI = "íìïî";
var vocalO = "óòöô";
var vocalU = "úùüû";

//

//English words > index 0
//Spanish words > index 1
//German words  > index 2
var countries = [[
    "Spain", "England", "France", "Germany", "Italy", "United States", "Canada", "Venezuela", "Chile", "Argentina", "Greece", "Australia", "Uruguay", "Poland", "Russia", "China", "Japan", "Ukraine", "Morocco", "Iceland", "Ireland", "Finland", "Norway", "Holland", "Israel", "Switzerland", "Sweden"
],[
    "España", "Inglaterra", "Francia", "Alemania", "Italia", "Estados Unidos", "Canadá","Venezuela", "Chile", "Argentina", "Grecia", "Australia", "Uruguay", "Polonia", "Rusia", "China", "Japón", "Ucrania", "Marruecos", "Islandia", "Irlanda", "Finlandia", "Noruega", "Holanda", "Israel", "Suiza", "Suecia"
],[
   "Spanien", "England", "Frankreich", "Deutschland", "Italien", "Vereinigte Staaten", "Kanada", "Venezuela", "Chile", "Argentinien", "Griechenland", "Australien", "Uruguay", "Polen", "Russland", "China", "Japan", "Ukraine", "Marokko", "Island", "Irland", "Finnland", "Norwegen", "Holland", "Israel", "Schweiz", "Schweden"
]];
var language = 0;
var lang = ["en", "es", "de"];
var alphabets = ["ABCDEFGHIJKLMNOPQRSTUVWXYZ", "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ", "ABCDEFGHIJKLMNOPQRSTUVWXYZẞ"];
var titlesArray = ["Hangman Game","Juego del Ahorcado","Henker Spiel"];
var instructionsArray = ["Use the alphabet below to guess the word.",
                    "Utilice el alfabeto de abajo para adivinar la palabra.","Verwenden Sie das Alphabet unten, um das Wort zu erraten."];

var askConfirmText = ["Do not ask for confirm when the game is about to be reset.","No pedir confirmación cuando el juego está a punto de resetearse.","Fragen Sie nicht nach Bestätigung, wenn das Spiel zurückgesetzt wird."];

var newGameButtonText = ["New game", "Nueva partida", "Neues Spiel"];


var selectedChars = [];
var charCount = 0;
var word = null;
var initalLives = 8; //Can be changed by the user >> Reset game
var currentLives;
var nextLine;
var resetFlag = true;
var askConfirmation = true;
var gameFinished = false;

/*
var stateObejct = function privateData(){
    var state = {
        selectedChars: [],     //Characters selected in the current game
        charCount: 0,          //Number of characters guessed
        word: null,            //Current word to guess
        initalLives: 8,        //Initial lives
        currentLives: null,    //Current lives
        nextLine: 1,           //Next line of the hangman to draw
        resetFlag: true,       //Only restes if resetFlag == true
        askConfirmation: true, //Only ask user for confirmation if askConfirmation == true
        gameFinished: false,   //Indicates if the game is finished or not
        defeats: 0,            //Number of defeats till current moment
        victories: 0           //Number of victories till current moment
    };
    
    return {
        getState: function(){
            return state;
        },
        setState: function(newState){
            state = newState;
        },
        
        //Selected chars
        getSelectedChars: function(){
            return selectedChars;
        },
        setSelectedChars: function(selectedCharsArray){
            selectedChars = selectedCharsArray;
        },
        addSelectedChar: function(selectedChar){
            selectedChars.push(selectedChar);
        },
        
        //Char count
        getCharCount: function(){
            return charCount;
        },
        incrementCharCount: function(){
            charCount++;
        },
        resetCharCount: function(){
            charCount = 0;
        },
        
        //Word
        getWord: function(){
            return word;
        },  
        setWord: function(newWord){
            word = newWord;
        },
        
        //Initial lives
        getInitialLives: function(){
            return initalLives;
        },  
        setInitialLives: function(lives){
            initialLives = lives;
        },
        
        //Current lives
        getCurrentLives: function(){
            return currentLives;
        },  
        incrementCurrentLives: function(){
            currentLives++;
        },
        decrementCurrentLives: function(){
            currentLives--;
        },
        resetCurrentLives: function(){
            currentLives = initialLives;
        },
        
        //Next line
        getNextLine: function(){
            return nextLine;
        },  
        incrementNexLine: function(){
            nextLine++;
        },
        decrementNexLine: function(){
            nextLine--;
        },
        resetNexLine: function(){
            nextLine = 1;
        },
        
        //Reset flag
        getResetFlag: function(){
            return resetFlag;
        },
        setResetFlag: function(resetFlagState){
            resetFlag = resetFlagState;
        },
        
        //Ask confirmation
        getAskConfirmation: function(){
            return askConfirmation;
        },
        setAskConfirmation: function(askConfirmationValue){
            askConfirmation = askConfirmationValue;
        },
        
        //Game finished
        getGameFinished: function(){
            return gameFinished;
        },
        setGameFinished: function(gameFinishedValue){
            gameFinished = gameFinishedValue;
        },
        
        //Defeats
        getDefeats: function(){
            return defeats;
        },
        incrementDefeats: function(){
            defeats++;
        },
        
        //Victories
        getVictories: function(){
            return victories;
        },
        incrementVictories: function(){
            victories++;
        }
    };
}();
*/

//References
var wordContainer;
var alphabetContainer;
var currentLivesContainer;

//Text elements references
var title;
var instructions;
var newButton;
var disableOption;

function init(){
    initTextElementsReferences();
    addLanguageButtonsListeners();
    alphabetContainer = document.getElementById("alphabetButtons");
    createButtons(createButtonWithLetter);
    wordContainer = document.getElementById("word");
    currentLivesContainer = document.getElementById("livesRemeaningNumber");
    newGame();
}

function initTextElementsReferences(){
    title = document.getElementById("title");
    instructions = document.getElementById("instructions");
    disableOption = document.getElementById("disableOptionText");
    newButton = document.getElementById("newGameButton");
}

function addLanguageButtonsListeners(){
    var languageButtons = document.getElementsByClassName("languageButton");
    for (var i=0; i < languageButtons.length; i++){
         languageButtons[i].addEventListener("click", changeLanguage);
        languageButtons[i].setAttribute("languageIndex", i);
    }
}

function createButtonWithLetter(letter){
    var btn = document.createElement("BUTTON");
    var text = document.createTextNode(letter);
    btn.appendChild(text);
    btn.addEventListener("click", charSelected);
    alphabetContainer.appendChild(btn);
}


function createButtons(createButtonFunction){
    var alphabet = alphabets[language];
    for (var i in alphabet){
        createButtonFunction(alphabet[i]);
    }
}

function deleteButtons(){
    var buttonsContainer = document.getElementById("alphabetButtons");
    while (buttonsContainer.firstChild) {
        buttonsContainer.removeChild(buttonsContainer.firstChild);
    }
}

function charSelected(event){
    if (!gameFinished){
        var selectedChar = event.target.innerHTML;
        selectedChars.push(selectedChar);
        console.log(selectedChars);
        //Deshabilitar botón pulsado
        event.target.setAttribute("disabled", true);
   
        var indexOfCharacter = word.indexOf(selectedChar);    
        if (indexOfCharacter == -1){
            wrongLetter();
        } else {
            rightLetter(selectedChar, indexOfCharacter);
        }
    }
}

function wrongLetter(){
    currentLives--;
    currentLivesContainer.innerHTML = currentLives;
            
    //Draw line
    var line = document.getElementById("l"+nextLine);
    line.style.visibility ="visible";
    nextLine++;

    if (currentLives == 0){
        lose("OH, YOU LOSE");
    }
}

function rightLetter(selectedChar, indexOfCharacter){
    charCount++;
    var wordContainerElements = wordContainer.children;
    wordContainerElements[indexOfCharacter].innerHTML = selectedChar;
    for (var i = indexOfCharacter+1; i < wordContainerElements.length; i++){
        if(word[i] == selectedChar){
            wordContainerElements[i].innerHTML = selectedChar;
            charCount++;
        }
    }
    if (charCount == word.length){
        win("YOU WIN!!!");
    }
}

function endGame(message){
    console.log(message);
    alert(message);
    gameFinished = true;
}

function lose(message){
    //lose
    //defeats++;
    endGame(message);
}

function win(message){
    //win
    //victories++;
    endGame(message);
}

function refreshLanguage(){
    updateLang();
    updateText();
    deleteButtons();
    createButtons(createButtonWithLetter);
}

function updateLang(){
    document.documentElement.lang = lang[language];
    console.log("Lang: "+ document.documentElement.lang);
}

function updateText(){
    title.innerHTML = titlesArray[language];
    instructions.innerHTML = instructionsArray[language];
    disableOption.innerHTML = askConfirmText[language];
    newGameButton.innerHTML = newGameButtonText[language];
}

function resetScore(){
    /*var state = stateObejct.getState();
    console.log(state);*/
    
    //Resets score
    hideHangmanLines();
    nextLine = 1;
    currentLives = initalLives;
    currentLivesContainer.innerHTML = initalLives;
    if (word != null) activeButtons();
    selectedChars = [];
    gameFinished = false;
}

function activeButtons(){
    var letters = alphabetContainer.children;
    for (var i = 0; i < letters.length; i++){
        letters[i].removeAttribute("disabled");
    }
}

function hideHangmanLines(){
    if (nextLine > 1){
        for(var i = 1; i < nextLine; i++){
            var line = document.getElementById("l"+i);
            line.style.visibility ="hidden";
        }
    }
}

function changeLanguage(event){
    var languageIndex = event.target.getAttribute("languageIndex");
    
    if (language != languageIndex){
        if (askConfirmation){
            checkConfirmation();
        }
        if (resetFlag) {
            language = languageIndex;
            refreshLanguage();
            var initialConfirmation = askConfirmation;
            askConfirmation = false;
            newGame();
            askConfirmation = initialConfirmation;
        }
    }
}

function newGame() {
    if (askConfirmation){
        checkConfirmation();
    }
    /*
    if (stateObejct.getState().askConfirmation){
        checkConfirmation();
    }
    */
    if (resetFlag) {
        //Delete previous word elements
        while (wordContainer.firstChild) {
            wordContainer.removeChild(
                wordContainer.firstChild);
        }
        
        //Get the new word
        var randomIndex = Math.floor((Math.random() * countries[language].length));
        word = countries[language][randomIndex];
        word = word.toUpperCase();
        charCount = 0;
        createHiddenWord(word.toUpperCase());
        
        
        //Reset score
        resetScore();
    }

}

function createHiddenWord(word){
    var character;
    var wordText = "_";
    
    if (word.length > 0){
        for (var i in word){
            character = document.createElement('span');
            character.className = "character";
            if (word[i] == ' ' || word[i] == '-') {
                character.innerHTML = word[i];
                charCount++;
            } else
                character.innerHTML = wordText;
            wordContainer.appendChild(character);
        }
    }
    console.log(word);
}

function checkConfirmation(){
    if (word != null)
        resetFlag = confirm("You are about to reset the game. Continue?");
    else resetFlag = true;
}

function askForConfirmation(check){
    askConfirmation = !check.checked;
    console.log(askConfirmation);
}

init();