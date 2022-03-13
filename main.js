var style = document.getElementById('style'); // get in-html stylesheet by ID, set to 'style' var for easy access

// WORD CLASS //
// Stores information for answer word
class Word {
    str = '';
    letterMap = new Map(); // Map object stores data as alpha-numeric (key, data) pair

    // Constructor for initial creation of Word class, answer word will be input 
    constructor(inputString) {
        this.str = inputString.toUpperCase(); // convert string upper case to avoid having to check upper/lower cases against 
        this.wordToMap(); // run below function adding letters to Map object 
    }

    // wordToMap(): function to put word in 'map' object
    // creates an index map within letterMap : 
    //      - first letterMap contains letter, 'letter', and associated letter position, letterIndex, of that letter, i.e. (letter,letterIndex) 
    //      - second map, letterIndex, only has position, letterIndex, with value true, i.e. (letterIndex, true)
    wordToMap() {

        // for each letterIndex in string, from 0 to string length
        for (let letterIndex = 0; letterIndex < this.str.length; letterIndex++) {

            // set letter equal to letter at current letterIndex
            var letter = this.str[letterIndex];

            // check if letterMap already has letter  
            if (this.letterMap.has(letter)) {

                // if so, add index to map
                this.letterMap.get(letter).set(letterIndex,true);
            } else 
            {   // else, create set new entry for letter and make new map for letterIndexes ("new Map")
                this.letterMap.set(letter, new Map());

                // indexMap = this.letterMap.get(letter)

                // add current letterIndex to index map
                this.letterMap.get(letter).set(letterIndex, true);
            }
        }
    }
}

// BOARD CLASS //
// Creates and modifies html gameboard
class Board {
    len;            // word length / width of board
    hgt;            // height of board / max number of rounds
    round;          // current round of game/guesses

    table;          // html table object making up the board and containing board tiles 

    boardContent;  
    contentBool;

    colorRight = 'rgb(41, 168, 37)';        // configurable color for right letters
    colorWrong = 'rgb(236, 53, 53)';        // ditto for wrong letters
    colorSwap = 'rgb(255, 230, 116)';  // ditto for right letters in wrong positions

    // Constructor for creating new Board object when
    constructor(inWordStr, guessInt) {
        this.round = 0;
        this.boardContent = '';
        
        // CSS code setting CSS variables equal to JS variables' values  
        let colorsStr = ':root {\n--color-right: ' + this.colorRight +
                          ';\n--color-wrong: '     + this.colorWrong +
                          ';\n--color-swap: '      + this.colorSwap  +
                          ';\n}'
        
        // Append above to inline style sheet in HTML document
        style.innerText = colorsStr + style.innerText;

        // create gameplay grid in html
        this.width = inWordStr.length;  // board length is length of input word
        this.height = guessInt;         // board height is allowed num of guesses

        this.table = document.createElement("table");   // set table equal to new html table element
        this.table.id = 'board'                         // set table html id to 'board'
        document.getElementById('container').appendChild(this.table)    // append table to html element with id 'container'

        var row = document.createElement("tr")  // create new tr (table row) element and assign to row variable
        var tile;

        // for each tileIndex in board width
        for (let tileIndex = 0; tileIndex < this.width; tileIndex++) {
            tile = document.createElement("td")     // create new html td element
            tile.className = 'tile c' + tileIndex   // add 'tile' and cX (c0, c1, c2, ...) classes to tile
            row.appendChild(tile)                   // append tile to row
        }

        this.table.appendChild(row)                 // append first "template" tow to table

        var newRow;
        // For the remaining rows in board
        for (let rowIndex = 1; rowIndex < this.height; rowIndex++) {
            newRow = row.cloneNode(true)        // duplicate 'row' to create 'newRow'
            newRow.className = 'r' + rowIndex   // add rX (r0, r1, r2 ...) class name
            this.table.appendChild(newRow)      // append newRow to game board
        }
        row.className = 'r0'    // set original row class to r0 (doing earlier would give duplicate 'newRow's r0 class, which we don't want)
    }

    // ADD GUESS: add text of guess to board //
    addGuess(inputStr, round) {

        // for each tile in row
        for (let i = 0; i < this.width; i++) {
            this.table.childNodes[round].childNodes[i].innerText = inputStr[i] // set tile of current 'round' and index, 'i' equal to letter at index, 'i'
        }
    }

    // MARK: function to color tile
    mark(col, row, val) {
        var color;

        // based on 'val' set color equal to applicable CSS variable (assigned earlier in Board)
        switch (val) {
            case 1:
                color = 'var(--color-right)';
                break;
            case 2:
                color = 'var(--color-swap)';
                break;
            default: // if not 1 or 2 then default to --color-wrong
                color = 'var(--color-wrong)';
                break;
        }

        // This function also allows us to color each tile in a row all at once if 'col' is a string w value 'row'
        if (col == 'row') {
            style.innerText = style.innerText + ' .r' + row + ' td{background-color:' + color + ' !important;}'       // CSS to color child 'td' elements of row class .rrow
        } else {
            style.innerText = style.innerText + ' .r' + col + ' .tile.c' + row + '{background-color:' + color + ';}'  // otherwise, only color tile with parent .r'Row' and class .c'Col'
        }
    }

    // get html elements of all tiles in board 
    content() {
        if (!(this.boardContent == '')) {

        } else {
            this.boardContent = document.getElementsByClassName('tile')
        }
        return this.boardContent;
    }
}

class Game {
    debug = false;  // bool value for debugging only

    answerWord;     // answer to game

    guessStr;       // guess word

    board;          // variable storing above board object
    round;          // current round
    maxRound        // max no. of rounds

    gameOver;       // boolean indicating game is over

    constructor(inWordStr, maxRound) {
        this.round = -1;                                // Set round to -1, will increment to 0 on game start.
        this.gameOver = false;
        this.maxRound = maxRound;

        this.answerWord = new Word(inWordStr);          // Take input string and create new instance of above Word class definition
        this.board = new Board(inWordStr, maxRound);    // Create new instance of Board class based on above class definition
    }

    // PLAYROUND: Take new guess, check, and determine if game over.
    playRound(inputStr) {
        this.round++    // increment current round number (first round will start at 0 from previously set -1)

        // Code for debugging
        if (this.debug) {
            inputStr = ['cactus', 'styles', "engine", 'rhrrhh', 'perohy'][this.round]
        }

        // Convert guess to upper case to avoid issues with comparing guess to answer 
        this.guessStr = inputStr.toUpperCase()
        
        this.board.addGuess(this.guessStr, this.round); // add guess to board
        this.checkGuess();                              // check if letters in guess correct

        // if game is not over and current round is last round, run lose function
        if (!this.gameOver && this.round >= this.maxRound -1) {
            this.lose()
        }
    }

    // WIN actions
    win() {
        this.board.mark('row', this.round, 1); // color row correct
        alert('Добрi!');
        this.endGame()
    }

    // LOSE actions
    lose() {
        alert('Йой, шкода...');
        this.endGame()
    }

    // ENDGAME actions
    endGame() {
        this.gameOver = true; // set game over  
    }

    // CHECKGUESS: algorithm to evaluate each letter in a guess
    checkGuess() {
        let guessMap = new Map();   // map object to store guess letters and corresponding indices

        // Game Win, if guess and answer are equal
        if (this.guessStr == this.answerWord.str) {
            this.win();
            console.log('win')
        } 
        else { // Game Continue
            let letter;

            // for each index in guess
            for (let letterIndex = 0; letterIndex < this.guessStr.length; letterIndex++) {

                letter = this.guessStr[letterIndex]; // set letter at current letterIndex of guess

                // if letterMap in answer does not contain 'letter', the letter is wrong
                if (!(this.answerWord.letterMap.has(letter))) {
                    this.board.mark(this.round, letterIndex, 0); // mark wrong
                }

                // if letter not wrong
                else {

                    // if letter exists in guessМap
                    if (!guessMap.has(letter)) {
                        guessMap.set(letter, 0); // create key and set count to 0
                    }

                    // check if letter index correct
                    if (letter == this.answerWord.str[letterIndex]) {
                        this.board.mark(this.round, letterIndex, 1);    // mark correct
                        guessMap.set(letter, guessMap.get(letter)+1);   // increment correct letter count for guessMap[letter]
                    }
                    else { // otherwise, set index aside to check against letter count
                        guessMap.set(letterIndex, letter);
                    }
                }
            }

            var letterIndex = -1; // set starting index to -1, will start at 0 in following loop

            // for each letter in guess
            for (let letter of this.guessStr) {
                letterIndex++;  // increment index
                
                // if letter exists in guessMap (is neither right/wrong yet)
                if (guessMap.has(letterIndex)) {

                    guessMap.set(letter, guessMap.get(letter)+1); // increment correct letter count for guessMap[letter]   

                    // and if letter count is less than/equals that letter in answer
                    if (guessMap.get(letter) <= this.answerWord.letterMap.get(letter).size) {
                        this.board.mark(this.round, letterIndex, 2);    // mark as wrong position
                    } else {
                        this.board.mark(this.round, letterIndex, 0);    // otherwise, there are too many of that letter -> wrong
                    }
                }

            }
            
        }
    }
}

// SUBMIT GUESS: function used in 'on-click' property of button to submit text to game 
function submitGuess() {
    if (!newGame.gameOver) {
        newGame.playRound(document.getElementById('inputStr').value);
    }
}

// SHARE: function to generate emoji grid to share results of game
function share(inputGame){
    var shareStr = '';
    var i = -1;
    var d = new Date

    for (var el of inputGame.board.content()) {
        i++

        if ( i % inputGame.board.width == 0){ shareStr = shareStr+'\n'; }

        switch(window.getComputedStyle(el)['background-color']){
            case inputGame.board.colorRight:
                shareStr = shareStr + '🟩'
            break;
            case inputGame.board.colorWrong:
                shareStr = shareStr + '🟥'
            break;
            case inputGame.board.colorSwap:
                shareStr = shareStr + '🟨'
            break;
            default:
                shareStr = shareStr + '⬜'
            break;
        }
    }

    shareStr = "Вордел "+[d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate()].join('-')+'\n'+shareStr

    navigator.clipboard.writeText(shareStr);
}

// TEMPORARY SOLUTION FOR DAILY WORD LIST 
let d = new Date(); // current date
var dateStrArr =    // string of dates in text form
['2022211','2022212','2022213','2022214','2022215','2022216','2022217','2022218','2022219','2022220','2022221','2022222','2022223','2022224','2022225','2022226','2022227','2022228','2022229','2022230']
var today =         // current date in text form
''+ d.getUTCFullYear() + (d.getUTCMonth()) + d.getUTCDate();
var wordArr =       // corresponding words for each date
['слово','вельо','знати','руска','білый','меджі','школа','свиня','воьна','днесь','русин','новый','поміч','дякую','прошу','буква','земля','сонце','заход','кухня'];
var wordMap = new Map();    // map to relate dates to words

var i_date = -1;
for (var date of dateStrArr){   // for each date string in above array
    i_date++;                   // increment index
    wordMap.set(date,wordArr[i_date]);  // add date string/word pair to map
}

wordToday = wordMap.get(today); // retrieve today's word from map using 'today' date string

newGame = new Game(wordToday, 6);   // start new game with today's word and 6 rounds 

var x = 0; // no use just for setting breakpoints










