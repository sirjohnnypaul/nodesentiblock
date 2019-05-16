//this file presents the functionality of the sentiblock system
//I kept it one file for easier review

var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var cors = require('cors');
var firebase = require('firebase');

var app = express();

var loadWords = fs.readFileSync('availableWords.json');
var loadWordsPairs = fs.readFileSync('availablePairs.json');
var afinndata = fs.readFileSync('afin111.json');
var availableWords = JSON.parse(loadWords);
var availablePairs = JSON.parse(loadWordsPairs);
var afinn = JSON.parse(afinndata);

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors());

app.get('/', renderHome);

function renderHome(req,res){
    res.render('index');
}


//there were more functions like that, just kept it to show what i was doing to make some json files ready to use
//app.get('/cleanAndSplit', cleanAndSplit);

// let linesSeparated = [];
// let linesSeparatedMore = [];
// let linesSeparatedFinal = [];
// let jsonWORD;
// let readyForJSON ={};
// let readyForJSONArray =[];
// let wordReady;
// let indexI = 0;


// function cleanAndSplit(req,res) {
    // fs.readFileSync('senticnet4.txt').toString().split('\n').forEach(function (line) { 
    //     //console.log(typeof(line));
    //     //console.log(line.match(/\w*/));
    //     linesSeparated.push(line.match(/\w*/));
    // }); 
    // fs.writeFile('linesseparated.txt', linesSeparated, function (err) {
    //     if (err) 
    //         return console.log(err);
    //     console.log('Writing Done');
    // });
    //console.log(linesSeparated);
    // linesSeparated.forEach(function (line) { 
    //     linesSeparatedMore.push(line.substr(0,line.indexOf(' \t')));
//   });
//   console.log(linesSeparatedMore);

    // fs.readFileSync('linesseparated.txt').toString().split(',').forEach(function (word) { 
    //     //console.log(typeof(line));
    //     //console.log(line.match(/\w*/));
    //        linesSeparatedMore.push(findAndReplace(word,"_"," ") + "\n");
    // }); 
    //     fs.writeFile('linesseparatedmore.txt', linesSeparatedMore, function (err) {
    //     if (err) 
    //         return console.log(err);
    //     console.log('Writing Done');
    // });

    

//         fs.readFileSync('linesseparatedmore.txt').toString().split(',').forEach(function (word) { 
//             //console.log(word);
//             let score = -10;
//             let key = word;
//             readyForJSON[key] = score;
//     }); 
//     console.log(readyForJSON);
//         let data = JSON.stringify(readyForJSON);
//         data = data.replace(/\\n/g, '');
//         console.log(data);
//     fs.writeFile('separatedFinal.json', data, function (err) {
//         if (err) 
//             return console.log(err);
//         console.log('Writing Done');
// }); 

    // fs.readFileSync('linesseparatedmore.txt').toString().split(',').forEach(function (word) { 
    //     indexI = indexI++;
    //     let score = -10;
    //     let key = word;
    //     jsonWORD = {
    //         word: word,
    //         score: score,
    //         id:indexI
    //     };
    //     readyForJSONArray.push(jsonWORD);
    // }); 
    // console.log(readyForJSONArray);
    // let data = JSON.stringify(readyForJSONArray);
    // data = data.replace(/\\n/g, '');
    // console.log(data);
    // fs.writeFile('separatedFinal2.json', data, function (err) {
    // if (err) 
    //     return console.log(err);
    // console.log('Writing Done');
    // }); 
//}

// function findAndReplace(string, target, replacement) {
 
//     var i = 0, length = string.length;
    
//     for (i; i < length; i++) {
    
//       string = string.replace(target, replacement);
    
//     }
    
//     return string;
    
//    }

app.get('/rateWords', rateDisplay);

let wordToRate;
function rateDisplay(req,res) {
    var loadExtraWordsWothIndex = fs.readFileSync('separatedFinal2.json');
    var extraWordsWithIndex = JSON.parse(loadExtraWordsWothIndex);

    wordToRate = extraWordsWithIndex[ Math.floor(Math.random() * extraWordsWithIndex.length) ]
    console.log(wordToRate.word);

    res.render('rating', {wordToRate:wordToRate.word} );
}

app.get('/rateWordsSend', rateDisplay);

function rateDisplay(req,res) {
    var loadExtraWordsWothIndex = fs.readFileSync('separatedFinal2.json');
    var extraWordsWithIndex = JSON.parse(loadExtraWordsWothIndex);

    wordToRate = extraWordsWithIndex[ Math.floor(Math.random() * extraWordsWithIndex.length) ]
    console.log(wordToRate.word);

    res.render('rating', {wordToRate:wordToRate.word} );
}


app.post('/addNewWordOrPair', addNewWordOrPair);

function addNewWordOrPair(req,res) {
    var wordPair = req.body.wordOrPhrase;
    console.log(wordPair);
    var score = Number(req.body.score);
    var isextraWord = req.body.extraWord;

    var words = wordPair.split(/\W+/);
    var count = words.length;
    console.log(count);

    var found = false;
    var wordToAdd;
    var msg;

    if(isextraWord) {
        let indexToDelete;

        if(count == 1){

            if (availableWords.hasOwnProperty(wordPair)) {
                found = true;
            } 
            else if (afinn.hasOwnProperty(wordPair)) {
                    found = true;
            } else {
                found = false;
                wordToAdd = wordPair;
            }

            if(found) {
                msg = 'The word already exist in the database';
                deleteFromJSONFILE(score);
            } else {
                availableWords[wordToAdd] = score;
                var availableWordsUpdates = JSON.stringify(availableWords);
                fs.writeFile('availableWords.json',availableWordsUpdates,finished);
                deleteFromJSONFILE(score);
            }
    } else  {
            if (availablePairs.hasOwnProperty(wordPair)) {
                found = true;
            }
            else {
                found = false;
            }

            if(found) {
                msg = 'The word already exist in the database';
                deleteFromJSONFILE(score);
            } else {
                availablePairs[wordPair] = score;
                var availablePairsUpdates = JSON.stringify(availablePairs);
                fs.writeFile('availablePairs.json',availablePairsUpdates,finished);
                deleteFromJSONFILE(score);
            }
    }
    } else {

    if(count == 1){

            if (availableWords.hasOwnProperty(wordPair)) {
                found = true;
            } 
            else if (afinn.hasOwnProperty(wordPair)) {
                    found = true;
            } else {
                found = false;
                wordToAdd = wordPair;
            }

            if(found) {
                msg = 'The word already exist in the database';
            } else {
                availableWords[wordToAdd] = score;
                var availableWordsUpdates = JSON.stringify(availableWords);
                fs.writeFile('availableWords.json',availableWordsUpdates,finished);
            }
    } else  {
            if (availablePairs.hasOwnProperty(wordPair)) {
                found = true;
            }
            else {
                found = false;
            }

            if(found) {
                msg = 'The word already exist in the database';
            } else {
                availablePairs[wordPair] = score;
                var availablePairsUpdates = JSON.stringify(availablePairs);
                fs.writeFile('availablePairs.json',availablePairsUpdates,finished);
            }
    }
}

    function finished(err) {
        console.log('Saving done');

        if(msg) {
            var replay = {
                msg: msg,
            }
        } else {
            if(count == 1) {
                var replay = {
                    msg: `The word ''${wordToAdd}'' was added with the score of ${score}`
                }
            } else {
                var replay = {
                    msg: `The word phrase ''${wordPair}'' was added with the score of ${score}`
                }
            }
        }

  
            res.send(replay);

        loadWords = fs.readFileSync('availableWords.json');
        loadWordsPairs = fs.readFileSync('availablePairs.json');
        afinndata = fs.readFileSync('afin111.json');
        availableWords = JSON.parse(loadWords);
        availablePairs = JSON.parse(loadWordsPairs);
        afinn = JSON.parse(afinndata);
        console.log(availablePairs);
    }

    function finishedUpdating(err) {
        console.log("Update succesfull");
    }

    function deleteFromJSONFILE(scorePassed) {
        for (var i = 0; i < extraWordsWithIndex.length; i++){
            try {
                if (extraWordsWithIndex[i].word == wordPair){
                    console.log('hey',extraWordsWithIndex[i].word);
                    extraWordsWithIndex[i].score = scorePassed;
                    console.log('hey updated score',extraWordsWithIndex[i].score);
                    let updatedtosave = JSON.parse(JSON.stringify(extraWordsWithIndex));
                    fs.truncate('separatedFinal3.json', 0, function(){console.log('JSON FILE CLEANED')})
                    fs.writeFile('separatedFinal3.json',JSON.stringify(updatedtosave),finishedUpdating);
                }
            } catch (error) {
                console.log(error);
            }
        }
    }
}

app.post('/analyze', analyzeThis);

const alltogetherdata = fs.readFileSync('allTogether.json');
let allTogether = JSON.parse(alltogetherdata);

function analyzeThis(req, res) {

    var txt = req.body.text;
    var words = txt.split(/\W+/);
    let totalScore = 0;
    let wordList = [];
    let tempPairsArray = [];
    let wordsFoundIndexes = [];
    let afinnfoundIndexes = [];
    let pairsFoundIndexes = [];
    let allFound = [];
    let indexesAllTogether = [];

    for (object in availablePairs) {
        tempPairsArray.push(object);
    }

    let wordsPairsFound = [];
    let wordFound;

    for(var y = 0; y<tempPairsArray.length; y++) {
        var result = txt.search(tempPairsArray[y]);
        if (result != -1) {
            wordFound = tempPairsArray[y];
            wordsPairsFound.push(wordFound);
            pairsFoundIndexes.push(y);
            allFound.push(wordFound);
        }
    }
    console.log(wordsPairsFound);

    let scorePairs = 0;
    let pairsFullData = [];

    for(var z = 0; z < wordsPairsFound.length; z++) {
            if(availablePairs.hasOwnProperty(wordsPairsFound[z])) {
                scoreOfWord = Number(availablePairs[wordsPairsFound[z]]);
                pairsFullData.push(` ${wordsPairsFound[z]} : with score ${scoreOfWord}`);
                scorePairs += scoreOfWord;
            }
    }
    console.log(scorePairs);
    console.log(pairsFullData);
    let pairsFound = false;

    if(wordsPairsFound.length != 0) {
        pairsFound = true;
    } else {
        pairsFound = false;
    }

    for (var i = 0; i< words.length; i++) {

        var word = words[i];
        var score = 0;
        var found = false;

        if (availableWords.hasOwnProperty(word)) {
            score = Number(availableWords[word]);
            found = true;
            wordsFoundIndexes.push(i);
            allFound.push(word);
        } 
        else if (afinn.hasOwnProperty(word)) {
                score = Number(afinn[word]);
                found = true;
                    let indexFound = 0;
                    for(let element in afinn) {
                        //console.log(element);
                        indexFound++;
                        if (element == word) {
                            //console.log(element);
                            afinnfoundIndexes.push(indexFound);
                        }
                }
                allFound.push(word);
        }
        if (found) {
            wordList.push({
                word: word,
                score: score
            });
        }
            totalScore += score;
        }

        var comparative = totalScore / words.length;
    
        for(el in allFound) {
            initIndex = 0;
            for (element in allTogether) {
                initIndex++;
                 if(element == allFound[el]) {
                    console.log(element);
                    indexesAllTogether.push(initIndex);
                 } 
                
            }
        }

        let fullTotalScore = totalScore + scorePairs;

        if(pairsFound) {
            var replay = {
                score: fullTotalScore,
                comparative: comparative,
                wordsIndexes:wordsFoundIndexes,
                afinnIndexes: afinnfoundIndexes,
                pairsIndexes: pairsFoundIndexes,
                words:wordList,
                pairs:wordsPairsFound,
                allfound: allFound,
                indexesTogether: indexesAllTogether
                }
        } else {
            var replay = {
                score: fullTotalScore,
                comparative: comparative,
                words:wordList,
                wordsIndexes:wordsFoundIndexes,
                afinnIndexes: afinnfoundIndexes,
                pairsIndexes: pairsFoundIndexes,
                allfound: allFound,
                indexesTogether: indexesAllTogether
                }
        }
        
        res.send(replay);
}


app.post('/savetoDB', saveThis);

function saveThis(req, res) {

    //yes, credentials, not sensitive data ;)
    var config = {
        apiKey: "AIzaSyA3cpfYm_wnVP5jBKmT_adZlR7AuAnLmBU",
        authDomain: "sentiblock.firebaseapp.com",
        databaseURL: "https://sentiblock.firebaseio.com",
        projectId: "sentiblock",
        storageBucket: "sentiblock.appspot.com",
        messagingSenderId: "42339630714"
      };

      if (!firebase.apps.length) {
        firebase.initializeApp(config);
    }
      database = firebase.database();

      var replay;
      let scoreCorrected;
      var sentence = req.body.sentence;
      var score = Number(req.body.score);
      var indexesToSave = req.body.indexes;
      let labelForMLToSave;
      console.log(`Sentence: ${sentence} and score: ${score}`);
      console.log(`Indexes For ML: ${indexesToSave}`);

      if(sentence != '' && score != null) {

            let tempSentence = sentence.split();
            console.log(tempSentence);

            let sentencesDB = database.ref('sentences');

            if(score <= -5) {
                scoreCorrected = -5;
            } else if (score >= 5) {
                scoreCorrected = 5;
            } else {
                scoreCorrected = score;
            }
          
            var data = {
                sentence: sentence,
                score: scoreCorrected
            }
          
            console.log("Saving to Firebase started...");
            console.log(data);
          
            let sentenceSaved = sentencesDB.push(data, finished);
            console.log("Generated key: "+sentenceSaved.key);
          
            function finished(err) {
                if (err) {
                    console.error("something went wrong");
                    console.error(err);
                } else {
                    console.log("Success");
                    replay = {
                        sentence: sentence,
                        score: scoreCorrected
                        }
                }
            }
          }

          if(score >3) {
            labelForMLToSave = 'very positive';
          }
          else if(score <=3 && score >0) {
            labelForMLToSave = 'positive';
          }
          else if(score == 0) {
            labelForMLToSave = 'neutral';
          }
          else if(score <0 && score >= -3) {
            labelForMLToSave = 'negative';
          }
          else {
            labelForMLToSave = 'very negative';
          }

          var data2 = {
            indexes: indexesToSave,
            label: labelForMLToSave
            }

        let trainingsetDB = database.ref('trainingset');
      
        console.log("Saving to Firebase ML started...");
        console.log(data2);
      
        let trainingExampleSaved = trainingsetDB.push(data2, finished2);
        console.log("Generated key: "+trainingExampleSaved.key);
      
        function finished2(err) {
            if (err) {
                console.error("something went wrong");
                console.error(err);
            } else {
                console.log("Success");
            }
        }

          res.send(replay);
      }


app.get('/combinetogether', combineJSONS);


function combineJSONS(req,res) {
    loadWords = fs.readFileSync('availableWords.json');
    loadWordsPairs = fs.readFileSync('availablePairs.json');
    afinndata = fs.readFileSync('afin111.json');
    availableWords = JSON.parse(loadWords);
    availablePairs = JSON.parse(loadWordsPairs);
    afinn = JSON.parse(afinndata);

    let allTogether = {};
    let indexP = 0;
    let indexW = 0;
    let indexA = 0;

    for (element in availablePairs) {
        indexP++;
        //console.log(element);
        let content = element;
        let score = Number(availablePairs[element]);
        allTogether[content] = score;
    }

    for (element1 in availableWords) {
        indexW++;
        let content = element1;
        let score = Number(availableWords[element1]);
        allTogether[content] = score;
    }

    for (element2 in afinn) {
        indexA++;
        let content = element2;
        let score = Number(afinn[element2]);
        allTogether[content] = score;
    }

    try {
        fs.truncate('allTogether.json', 0, function(){console.log('JSON FILE CLEANED')})
        let AllTogetherUpdated = JSON.parse(JSON.stringify(allTogether));
        fs.writeFile('allTogether.json', JSON.stringify(AllTogetherUpdated),finishedCombining);

    } catch (error) {
        console.log(error);
    }

    function finishedCombining() {
        console.log('Combined JSON');
    }

    let indexAll = 0;
    for (elementor in allTogether){
        indexAll++;
    }

    console.log(indexP+" "+indexA+" "+indexW+" "+indexAll);
}

app.get('/machinelearning', machineLearning);

function machineLearning(req, res) {

    //to be implemented soon
    res.render('machinelearning');
}


app.get('*', renderError);

function renderError(req,res){
    res.send('Sorry, it is a modest error handling but it works ;) Will make it better soon!');
}

var server = app.listen(5001, listening);

function listening() {
    console.log('Listening on port 5001');
}


