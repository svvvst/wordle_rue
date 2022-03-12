function genWordList(){
    var date = new Date();
    var wordMap = new Map();
    var output=''
    var output2 = ''
    var wordList = ['слово','вельо','знати','руска','білый','меджі','школа','свиня','воьна','днесь','русин','новый','поміч','дякую','прошу','буква','земля','сонце','заход','кухня'];

    var i=0;
    for (var word of wordList){
        let d = new Date(date);
        d.setDate(d.getDate() + i);
        //wordMap.set(date.setDate(date.getDate() + i).toString(),word);
        //output = output + date.setDate(date.getDate() + i).toString() + ',' + word + '\n';
        output2 = output2 + "'" + d.getFullYear() + (d.getUTCMonth()) + d.getUTCDate() + "',"
        i++;
    }
    console.log(output2)
}

genWordList();

/*
var wordList = `
1647205032972,вельо
1647550632972,знати
1648069032972,руска
1648760232972,білый
1649624232972,меджі
1650661032972,школа
1651870632972,свиня
1653253032972,воьна
1654808232972,днесь
1656536232972,русин
1658437032972,новый
1660510632972,поміч
1662757032972,дякую
1665176232972,прошу
1667771832972,буква
1670536632972,земля
1673474232972,сонце
1676584632972,заход
1679864232972,кухня
`
*/

//console.log(wordList)