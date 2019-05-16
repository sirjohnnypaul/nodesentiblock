var globalScore;
var globalIndexesForML;

function setup() {
  createCanvas(800,500);

  console.log('Processing...');


  let button = select('#addWordBtn');
  button.mousePressed(sumbitWord);

  let buttonAnalyze = select('#analyzeBtn');
  buttonAnalyze.mousePressed(analyzeThis);


  let buttonAcceptSave = select('#buttonAcceptSave');
  buttonAcceptSave.mousePressed(saveThis);

  let buttonDeclineSave = select('#buttonDeclineSave');
  buttonDeclineSave.mousePressed(saveThisCorrected);
}

function saveThisCorrected(){

  let scoreChoosen;
  let scoreChosenValue;
  let sentenceValue;

  if((select('#choosenScore').value() != 'Choose your score from the list...') && (select('#textInputArea').value() != null)) {
    scoreChoosen = true;
    scoreChosenValue = select('#choosenScore').value();
    sentenceValue = select('#textInputArea').value().toLowerCase();
  } else {
    scoreChoosen = false;
  }

  if(scoreChoosen) {
    let sentence = sentenceValue;
    let score = scoreChosenValue;
  
    var data = {
      sentence: sentence,
      score: score,
      indexes: globalIndexesForML
    }
  
    httpPost('savetoDB',data,'json',dataPosted, postError);
  
    function dataPosted(result) {
      console.log(result);
    }
  
    function postError(err) {
      console.log(err);
    }
  }
  else {
    var validationP = select('#scoreNotProvided');
    validationP.html(`Please provide the sentence and the score first!`);
  }
}


function saveThis(){

  let sentence = select('#textInputArea').value().toLowerCase();
  let score = globalScore;

  var data = {
    sentence: sentence,
    score: score,
    indexes: globalIndexesForML
  }

  httpPost('savetoDB',data,'json',dataPosted, postError);

  function dataPosted(result) {
    console.log(result);

  }

  function postError(err) {
    console.log(err);
  }
}


function addWordOrWordPair() {
let wordOrPair = select('#newWord').value();
let score = select('#newScore').value();

var data = {
  wordOrPair: wordOrPair,
  score: score
}

httpPost('addNewWordOrPair',data,'json',dataPosted, postError);

function dataPosted(resultSend) {
  console.log("data added succesfully " +resultSend.wordOrPair);
}

function postError(err) {
  console.log(err);
}

var input1 = select('#newWord');
input1.value(' ');
var input2 = select('#newScore');
input2.value(' ');

}

function sumbitWord() {
  let word = select('#newWord').value();
  let score = select('#newScore').value();

  var data = {
    wordOrPhrase: word,
    score: score
  }

  httpPost('addNewWordOrPair',data,'json',dataPosted, postError);

  function dataPosted(result) {
    console.log(result);
  }

  function postError(err) {
    console.log(err);
  }
}

function analyzeThis() {


  let text = select('#textInputArea').value().toLowerCase();

  var data = {
    text: text
  }
  httpPost('analyze',data,'json',dataPosted, postError);

  function dataPosted(result) {
    console.log(result);
    //console.log('All indexes for ML', result.indexesTogether);
    if(result.indexesTogether) {
      globalIndexesForML = result.indexesTogether;
      console.log('All indexes for ML', globalIndexesForML);
    }

    var scoreP = select('#resultDisplayScore');
    scoreP.html('Score: '+ result.score);
    globalScore = result.score;

    let meaning;
    if (result.score <= -5 ) {
      meaning = "Your sentence or set of words seems to be very negative"
    } else if (result.score > -5 && result.score < 0 ) {
      meaning = "Your sentence or set of words seems to be quite negative"
    } else if (result.score == 0) {
      meaning = "Your sentence or set of words seems to be neutral"
    } else if (result.score > 0 && result.score <= 5) {
      meaning = "Your sentence or set of words seems to be quite positive"
    } else {
      meaning = "Your sentence or set of words seems to be very positive"
    }

    var meaningP = select('#resultDisplayMeaning');
    meaningP.html(`Interpretation: ${meaning}`);

    var comparativeP = select('#resultDisplayComparative');
    comparativeP.html('Comparative: '+ result.comparative);

    var myarray = [];
    result.words.map((a, index) => {
      myarray.push(` ${a.word} scored with ${a.score}`);
    });

    console.log(myarray);

    var wordlistP = select('#resultDisplayWordList');
    wordlistP.html('Provided Words: ' + myarray.toString());

    if (result.pairs) {
      var pairlistP = select('#resultDisplayPairList');
      pairlistP.html('The score was corrected with the pairs of words found in your sentence: ' + result.pairs);
    }

    // var wordlistP = select('#resultDisplayWordList');
    // wordlistP.html('List: '+ fullList.stringify());
  
  }

  function postError(err) {
    console.log(err);
  }
}


