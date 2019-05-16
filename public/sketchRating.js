buttonAddScoreForWord

function setup() {

    let buttonAddScoreForWord = select('#buttonAddScoreForWord');
    buttonAddScoreForWord.mousePressed(saveThisScore);

  }

  function saveThisScore(){

    let scoreChoosen;
    let scoreChosenValue;
    let wordToSave;

    if((select('#choosenScoreForWord2').value() != 'Choose your score from the list...')) {
      scoreChoosen = true;
      scoreChosenValue = select('#choosenScoreForWord2').value();
      wordToSave = select('#resultDisplayWordToRate').value();
    } else {
      scoreChoosen = false;
    }
  
    if(scoreChoosen) {
      let sentence = wordToSave;
      let score = scoreChosenValue;
    
      var data = {
        wordOrPhrase: sentence,
        score: score,
        extraWord: true
      }
    
      console.log(data);
      httpPost('addNewWordOrPair',data,'json',dataPosted, postError);
    
      function dataPosted(result) {
        console.log(result);
        var infoAfter = select('#scoreForPrevious');
        infoAfter.html(`${result.msg}! To rate another word or phrase, click next button or reload the page! <br>
        <div class="text-center m-auto pt-3">
        <form method="GET" action="/rateWords">
        <button class="text-center p-4 m-auto d-inline-block btn btn-danger col-md-3 col-5" id="buttonNextWord">Next!</button>                </form>  
    </div>`);
      }
    
      function postError(err) {
        console.log(err);
      }
    }
    else {
      var validationP2 = select('#scoreNotProvided2');
      validationP2.html(`Please provide the score first!`);
    }
  }