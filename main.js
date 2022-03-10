//// <reference path='https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js' />

var style = document.getElementById('style');

class Word {
    str = '';
    map = new Map();

    constructor(inputString) {
      this.str = inputString;
      this.wordToHash();
    }

    wordToHash(){
        for (let i = 0; i < this.str.length; i++){

            var k = this.str[i];

            //check if letter key already exists
            if (this.map.hasOwnProperty(k))
            {
                //add index 
                this.map[k][i] = true;
            }
            else // add letter
            {
                this.map.set(k, new Map());
                this.map.get(k).set(i,true)
            }
        }
    }
  }

class Board {
    len;
    hgt;
    round = 0;

    table;

    constructor(inWordStr,guessInt){

        //create gameplay grid in html
        this.len = inWordStr.length;
        this.hgt = guessInt;

        this.table = document.createElement("table");
        this.table.id = 'board'
        document.body.appendChild(this.table)

        var row = document.createElement("tr")
        var elm;
        for (let i = 0; i < this.len; i++){
            elm = document.createElement("td")
            elm.className = 'c'+i
            row.appendChild(elm)
        }

        this.table.appendChild(row)
        for (let i = 1; i < this.hgt ; i++){
            elm = row.cloneNode(true)
            elm.className = 'r'+i
            this.table.appendChild(elm)
        }
        row.className = 'r0'
    }

    addGuess(inputStr,round){
        for (let i = 0; i < inputStr.length; i++){
            this.table.childNodes[round].childNodes[i].innerText = inputStr[i]
        }
    }

    mark(x,y,val){
        var color;
        
        switch(val){
            case 1: color = 'var(--color-right)';
            break;
            case 2: color = 'var(--color-swap)';
            break;
            default: color = 'var(--color-wrong)';
            break;
        }

        if (x == 'row'){
            style.innerText = style.innerText + ' .r'+ y +' td{background-color:'+ color +' !important;}'
        }
        else{
            style.innerText = style.innerText + ' .r'+ x +' .c'+ y +'{background-color:'+ color +';}'
        }
    }
}

class Game {
    debug = false;

    answerWord;

    guessStr;
    guessArr;

    board;
    round;

    gameOver;
    
    constructor(inWordStr,maxround){
        this.round=-1;

        this.answerWord = new Word(inWordStr);

        this.board = new Board(inWordStr,maxround)

        this.gameOver = false;
    }

    playRound(inputStr){
        this.round++
        if (this.debug){
            inputStr = ['cactus', 'styles', "engine", 'rhrrhh', 'perohy'][this.round]
        }

        this.guessStr = inputStr.toUpperCase() //"test"+this.round //prompt()

        this.board.addGuess(this.guessStr,this.round);
        this.checkGuess();

        if (this.round > this.answerWord.str.length){this.lose()}
    }

    win(){
        this.endGame()
        this.board.mark('row',this.round,1);
        alert('Добре робота!');
    }

    lose(){
        this.endGame()
        alert('You lose!');
    }

    endGame(){this.gameOver = true;}

    checkGuess(){
        console.log(this.guessStr+ ' =============================')
        
        let guessMap = new Map();
        let k;

        // Game Win
        if (this.guessStr == this.answerWord.str){
            this.win()
        }

        // Game Continue
        else{   
            for (let i=0; i < this.guessStr.length; i++){

                k = this.guessStr[i];


                // check if letter wrong
                if (!( this.answerWord.map.has(k) )){
                    this.board.mark(this.round, i, 0);
                    console.log(i+' wrong');
                }

                // if letter not wrong
                else{

                    // check if letter key in map guess map
                    if (!guessMap.has(k)){
                        guessMap.set(k,1);  // create key and set count to 1
                    }
                    // add letter key if not in guess map
                    else{
                        guessMap.set(k,guessMap.get(k)+1);  // add to letter count
                    }
                    
                    // check if letter index correct
                    if (k == this.answerWord.str[i]){
                        this.board.mark(this.round, i, 1);
                        console.log(k+' right');
                    }
                    // otherwise, set index aside to check against letter count
                    else{
                        guessMap.set(i, k);
                    }
                }

            }

            console.log(guessMap);
            
            // for each index in string
            var i = -1;
            for (let k of this.guessStr){ i++;

                // if letter exists in map (is neither right/wrong yet)
                if (guessMap.has(i)){
                    // and if letter count is less than/equals that in answer
                    if (guessMap.get(k) <= this.answerWord.map.get(k).size){
                        this.board.mark(this.round, i, 2);
                        guessMap.set(k,guessMap.get(k)+1);
                    }
                    else{
                        console.log(k+' wrong')
                        this.board.mark(this.round, i, 0);
                    }
                }

            }
        }
    }
}

function submitGuess(){
    if (!newGame.gameOver){
        newGame.playRound(document.getElementById('inputStr').value);
    }
}

newGame = new Game("МАЧКА",7);

var x=0;

/* 
testArr.forEach( x => {
    testGame.playRound(x)
}); 
*/






