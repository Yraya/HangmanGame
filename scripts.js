//*** Hangman game ***

//**Falta por implementar: 
// 1) Comportamiento ante tildes
//    - No hay palabras con tilde  << SELECTED
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
    "España", "Inglaterra", "Francia", "Alemania", "Italia", "Estados Unidos", "Canada","Venezuela", "Chile", "Argentina", "Grecia", "Australia", "Uruguay", "Polonia", "Rusia", "China", "Japon", "Ucrania", "Marruecos", "Islandia", "Irlanda", "Finlandia", "Noruega", "Holanda", "Israel", "Suiza", "Suecia"
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

/*
var selectedChars = [];
var charCount = 0;
var word = null;
var initialLives = 8; //Can be changed by the user >> Reset game
var currentLives;
var nextLine;
var resetFlag = true;
var askConfirmation = true;
var gameFinished = false;
*/

var stateObejct = function privateData(){
    return {
        state: {
        selectedChars: [],     //Characters selected in the current game
        charCount: 0,          //Number of characters guessed
        word: null,            //Current word to guess
        initialLives: 8,        //Initial lives
        currentLives: null,    //Current lives
        nextLine: 1,           //Next line of the hangman to draw
        resetFlag: true,       //Only restes if resetFlag == true
        askConfirmation: true, //Only ask user for confirmation if askConfirmation == true
        gameFinished: false,   //Indicates if the game is finished or not
        defeats: 0,            //Number of defeats till current moment
        victories: 0           //Number of victories till current moment
    },
        
        getState: function(){
            return this.state;
        },
        setState: function(newState){
            this.state = newState;
        },
        
        //Selected chars
        getSelectedChars: function(){
            return this.state.selectedChars;
        },
        setSelectedChars: function(selectedCharsArray){
            this.state.selectedChars = selectedCharsArray;
        },
        addSelectedChar: function(selectedChar){
            this.state.selectedChars.push(selectedChar);
        },
        resetSelectedChars: function(){
            this.state.selectedChars = [];
        },
        
        //Char count
        getCharCount: function(){
            return this.state.charCount;
        },
        incrementCharCount: function(){
            this.state.charCount++;
        },
        resetCharCount: function(){
            this.state.charCount = 0;
        },
        
        //Word
        getWord: function(){
            return this.state.word;
        },  
        setWord: function(newWord){
            this.state.word = newWord;
        },
        
        //Initial lives
        getInitialLives: function(){
            return this.state.initialLives;
        },  
        setInitialLives: function(lives){
            this.state.initialLives = lives;
        },
        
        //Current lives
        getCurrentLives: function(){
            return this.state.currentLives;
        },  
        incrementCurrentLives: function(){
            this.state.currentLives++;
        },
        decrementCurrentLives: function(){
            this.state.currentLives--;
        },
        resetCurrentLives: function(){
            this.state.currentLives = this.state.initialLives;
        },
        
        //Next line
        getNextLine: function(){
            return this.state.nextLine;
        },  
        incrementNexLine: function(){
            this.state.nextLine++;
        },
        decrementNexLine: function(){
            this.state.nextLine--;
        },
        resetNexLine: function(){
            this.state.nextLine = 1;
        },
        
        //Reset flag
        getResetFlag: function(){
            return this.state.resetFlag;
        },
        setResetFlag: function(resetFlagState){
            this.state.resetFlag = resetFlagState;
        },
        
        //Ask confirmation
        getAskConfirmation: function(){
            return this.state.askConfirmation;
        },
        setAskConfirmation: function(askConfirmationValue){
            this.state.askConfirmation = askConfirmationValue;
        },
        
        //Game finished
        getGameFinished: function(){
            return this.state.gameFinished;
        },
        setGameFinished: function(gameFinishedValue){
            this.state.gameFinished = gameFinishedValue;
        },
        
        //Defeats
        getDefeats: function(){
            return this.state.defeats;
        },
        incrementDefeats: function(){
            this.state.defeats++;
        },
        
        //Victories
        getVictories: function(){
            return this.state.victories;
        },
        incrementVictories: function(){
            this.state.victories++;
        }
    };
}();

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
    while (alphabetContainer.firstChild) {
        alphabetContainer.removeChild(alphabetContainer.firstChild);
    }
}

function charSelected(event){
    if (!stateObejct.getGameFinished()){
        var selectedChar = event.target.innerHTML;
        //selectedChars.push(selectedChar);
        stateObejct.addSelectedChar(selectedChar);
        console.log(stateObejct.getSelectedChars());
        //Deshabilitar botón pulsado
        event.target.setAttribute("disabled", true);
   
        var indexOfCharacter = stateObejct.getWord().indexOf(selectedChar);    
        if (indexOfCharacter == -1){
            wrongLetter();
        } else {
            rightLetter(selectedChar, indexOfCharacter);
        }
    }
}

function wrongLetter(){
    stateObejct.decrementCurrentLives();
    currentLivesContainer.innerHTML = stateObejct.getCurrentLives();
            
    //Draw line
    var line = document.getElementById("l"+stateObejct.getNextLine());
    line.style.visibility ="visible";
    stateObejct.incrementNexLine();

    if (stateObejct.getCurrentLives() == 0){
        lose();
    }
}

function rightLetter(selectedChar, indexOfCharacter){
    stateObejct.incrementCharCount();
    var wordContainerElements = wordContainer.children;
    wordContainerElements[indexOfCharacter].innerHTML = selectedChar;
    var word = stateObejct.getWord();
    for (var i = indexOfCharacter+1; i < wordContainerElements.length; i++){
        if(word[i] == selectedChar){
            wordContainerElements[i].innerHTML = selectedChar;
            stateObejct.incrementCharCount();
        }
    }
    if (stateObejct.getCharCount() == stateObejct.getWord().length){
        win();
    }
}

function endGame(message){
    console.log(message);
    alert(message);
    stateObejct.setGameFinished(true);
}

function lose(){
    //lose
    stateObejct.incrementDefeats();
    endGame("OH, YOU LOSE");
}

function win(){
    //win
    stateObejct.incrementVictories();
    endGame("YOU WIN!!!");
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
    //Resets score
    hideHangmanLines();
    stateObejct.resetNexLine();
    stateObejct.resetCurrentLives();
    currentLivesContainer.innerHTML = stateObejct.getInitialLives();
    if (stateObejct.getWord() != null) activeButtons();
    stateObejct.resetSelectedChars();
    stateObejct.setGameFinished(false);
}

function activeButtons(){
    var letters = alphabetContainer.children;
    for (var i = 0; i < letters.length; i++){
        letters[i].removeAttribute("disabled");
    }
}

function hideHangmanLines(){
    var nextLine = stateObejct.getNextLine();
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
        if (stateObejct.getAskConfirmation()){
            checkConfirmation();
        }
        if (stateObejct.getResetFlag()) {
            language = languageIndex;
            refreshLanguage();
            var initialConfirmation = stateObejct.getAskConfirmation();
            stateObejct.setAskConfirmation (false);
            newGame();
            stateObejct.setAskConfirmation (initialConfirmation);
        }
    }
}

function newGame() {
    if (stateObejct.getAskConfirmation()){
        checkConfirmation();
    }
    
    if (stateObejct.getResetFlag()) {
        //Delete previous word elements
        while (wordContainer.firstChild) {
            wordContainer.removeChild(wordContainer.firstChild);
        }
        
        //Get the new word
        var randomIndex = Math.floor((Math.random() * countries[language].length));
        var word = countries[language][randomIndex].toUpperCase();
        stateObejct.setWord(word);
        stateObejct.resetCharCount();
        createHiddenWord(word);
               
        //Reset score
        resetScore();
    }

}

function createHiddenWord(word){
    var character;
    var wordText = "_";
    var word = stateObejct.getWord();
    if (word.length > 0){
        for (var i in word){
            character = document.createElement('span');
            character.className = "character";
            if (word[i] == ' ' || word[i] == '-') {
                character.innerHTML = word[i];
                stateObejct.incrementCharCount();
            } else
                character.innerHTML = wordText;
            wordContainer.appendChild(character);
        }
    }
    console.log(word);
}

function checkConfirmation(){
    if (stateObejct.getWord() != null)
        stateObejct.setResetFlag(confirm("You are about to reset the game. Continue?"));
    else stateObejct.setResetFlag(true);
}

function askForConfirmation(check){
    stateObejct.setAskConfirmation(!stateObejct.getAskConfirmation());
}

init();