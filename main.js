var style = document.getElementById('style');

class Word {
    str = '';
    map = new Map();

    constructor(inputString) {
        this.str = inputString.toUpperCase();
        this.wordToHash();
    }

    wordToHash() {
        for (let i = 0; i < this.str.length; i++) {

            var k = this.str[i];

            //check if letter key already exists
            if (this.map.hasOwnProperty(k)) {
                //add index 
                this.map[k][i] = true;
            } else // add letter
            {
                this.map.set(k, new Map());
                this.map.get(k).set(i, true)
            }
        }
    }
}

class Board {
    len;
    hgt;
    round = 0;

    table;

    boardContent = '';
    contentBool;

    colorRight;
    colorWrong;
    colorSwap;

    constructor(inWordStr, guessInt) {

        this.colorRight = 'rgb(41, 168, 37)'
        this.colorWrong = 'rgb(236, 53, 53)'
        this.colorSwap = 'rgb(255, 230, 116)'

        let colorsStr = ':root {\n--color-right: ' + this.colorRight +
                          ';\n--color-wrong: '     + this.colorWrong +
                          ';\n--color-swap: '      + this.colorSwap  +
                          ';\n}'

        style.innerText = colorsStr+style.innerText;

        //create gameplay grid in html
        this.len = inWordStr.length;
        this.hgt = guessInt;

        this.table = document.createElement("table");
        this.table.id = 'board'
        document.getElementById('container').appendChild(this.table)

        var row = document.createElement("tr")
        var elm;
        for (let i = 0; i < this.len; i++) {
            elm = document.createElement("td")
            elm.className = 'cell c' + i
            row.appendChild(elm)
        }

        this.table.appendChild(row)
        for (let i = 1; i < this.hgt; i++) {
            elm = row.cloneNode(true)
            elm.className = 'r' + i
            this.table.appendChild(elm)
        }
        row.className = 'r0'
    }

    addGuess(inputStr, round) {
        for (let i = 0; i < this.len; i++) {
            this.table.childNodes[round].childNodes[i].innerText = inputStr[i]
        }
    }

    mark(x, y, val) {
        var color;

        switch (val) {
            case 1:
                color = 'var(--color-right)';
                break;
            case 2:
                color = 'var(--color-swap)';
                break;
            default:
                color = 'var(--color-wrong)';
                break;
        }

        if (x == 'row') {
            style.innerText = style.innerText + ' .r' + y + ' td{background-color:' + color + ' !important;}'
        } else {
            style.innerText = style.innerText + ' .r' + x + ' .cell.c' + y + '{background-color:' + color + ';}'
        }
    }

    content() {
        if (!(this.boardContent == '')) {

        } else {
            this.boardContent = document.getElementsByClassName('cell')
        }
        return this.boardContent;
    }
}

class Game {
    debug = false;

    answerWord;

    guessStr;
    guessArr;

    board;
    round;
    maxRound

    gameOver;

    constructor(inWordStr, maxRound) {
        this.round = -1;
        this.gameOver = false;
        this.maxRound = maxRound;

        this.answerWord = new Word(inWordStr);
        this.board = new Board(inWordStr, maxRound)
    }

    playRound(inputStr) {
        this.round++
        if (this.debug) {
            inputStr = ['cactus', 'styles', "engine", 'rhrrhh', 'perohy'][this.round]
        }

        this.guessStr = inputStr.toUpperCase() //"test"+this.round //prompt()

        this.board.addGuess(this.guessStr, this.round);
        this.checkGuess();

        if (this.round > this.maxRound) {
            this.lose()
        }
    }

    win() {
        this.endGame()
        this.board.mark('row', this.round, 1);
        alert('Добрi!');
    }

    lose() {
        this.endGame()
        alert('You lose!');
    }

    endGame() {
        this.gameOver = true;
    }

    checkGuess() {
        let guessMap = new Map();
        let k;

        // Game Win
        if (this.guessStr == this.answerWord.str) {
            this.win()
        }

        // Game Continue
        else {
            for (let i = 0; i < this.guessStr.length; i++) {

                k = this.guessStr[i];


                // check if letter wrong
                if (!(this.answerWord.map.has(k))) {
                    this.board.mark(this.round, i, 0);
                }

                // if letter not wrong
                else {

                    // check if letter key in map guess map
                    if (!guessMap.has(k)) {
                        guessMap.set(k, 1); // create key and set count to 1
                    }
                    // add letter key if not in guess map
                    else {
                        guessMap.set(k, guessMap.get(k) + 1); // add to letter count
                    }

                    // check if letter index correct
                    if (k == this.answerWord.str[i]) {
                        this.board.mark(this.round, i, 1);
                    }
                    // otherwise, set index aside to check against letter count
                    else {
                        guessMap.set(i, k);
                    }
                }

            }

            // for each index in string
            var i = -1;
            for (let k of this.guessStr) {
                i++;

                // if letter exists in map (is neither right/wrong yet)
                if (guessMap.has(i)) {
                    // and if letter count is less than/equals that in answer
                    if (guessMap.get(k) <= this.answerWord.map.get(k).size) {
                        this.board.mark(this.round, i, 2);
                        guessMap.set(k, guessMap.get(k) + 1);
                    } else {
                        this.board.mark(this.round, i, 0);
                    }
                }

            }
        }
    }
}

function submitGuess() {
    if (!newGame.gameOver) {
        newGame.playRound(document.getElementById('inputStr').value);
    }
}


function share(inputGame){//inputGame) {
    var shareStr = '';
    var i = -1;
    var d = new Date

    for (var el of inputGame.board.content()) {
        i++

        if ( i % inputGame.board.len == 0){ shareStr = shareStr+'\n'; }

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

var dateStrArr = ['2022211','2022212','2022213','2022214','2022215','2022216','2022217','2022218','2022219','2022220','2022221','2022222','2022223','2022224','2022225','2022226','2022227','2022228','2022229','2022230']
let d = new Date();
var today = ''+ d.getUTCFullYear() + (d.getUTCMonth()) + d.getUTCDate();
var wordArr = ['слово','вельо','знати','руска','білый','меджі','школа','свиня','воьна','днесь','русин','новый','поміч','дякую','прошу','буква','земля','сонце','заход','кухня'];
var wordMap = new Map();

var i_date = -1;
for (var date of dateStrArr){
    i_date++;
    wordMap.set(date,wordArr[i_date]);
}

wordToday = wordMap.get(today);

newGame = new Game(wordToday, 6);

var x = 0;










