//***** Actor's Quiz Game *****/// www.themoviedb.org

//Get info from www.themoviedb.org : 
//    - person name = name
//    - profile picture = profile_path (To create the img url)
//    - status_code (To handle errors)

//**********************************************
// Game global variables

//The range where the player is gonna be guessing actors from 1 to 1000 and that number correspond with the actor imdb id.
var actorsRange = 10000;
var level = 1;
var wins = 0;
var loss = 0;
var actorsName = '';
var wordsToFind = 0;
var chances = 10;

function resetActor() {
    deleteDivAndSpan();
    getInfoAPI(randomNumber(actorsRange));
}

//**************************************************** 
// Game functions

function getInfoAPI(number) {
    // ***** XMLHttpRequest ini *****

    //1  Instantiating XMLHttpRequest class
    var myRequest = new XMLHttpRequest();
    //2  geting the json with the name and img path info
    myRequest.open('GET', 'https://api.themoviedb.org/3/person/' + number + '?api_key=bd933cb33c4e914196fb398dd91ef160', true);
    //3  This is what to do with the json info
    myRequest.onload = function () {
        var jsonData = JSON.parse(myRequest.responseText);
        //        testing the info
        //            alert(jsonData.name+' '+jsonData.profile_path);
        //        assigning the name to a global var actorsName
        //        handling the api response
        if (jsonData.status_code != 34) {
            if (jsonData.profile_path !== null) {
                //          call OkAPIreponse
                actorsName = jsonData.name.toLowerCase();
                OkAPIreponse(jsonData, actorsName);
                console.log(jsonData.name);
                waitForKey();
            } else {
                nullAPIresponse();
                resetActor(); // When data is missing -> Retry
            }
        } else {
            console.log("WRONG", jsonData);
            resetActor();
        }

    }
    //4  Finally this is to send the request
    myRequest.send();

    //// ***** END XMLHttpRequest ini *****
}

getInfoAPI(randomNumber(actorsRange));

//**************************************************** OK
//random number function to create the getInfoAPI argument
function randomNumber(range) {
    var randomNvar = Math.floor(Math.random() * range) + 1;
    return randomNvar;
}

//**************************************************** OK
function nullAPIresponse() {
    //    alert('no enough data');
    //    call deletedivandspans
    deleteDivAndSpan();
    //    location.reload(false);
}
//**************************************************** OK
function deleteDivAndSpan() {
    var parentDiv = document.getElementById('divContainer');
    parentDiv.innerHTML = '';
}
//**************************************************** OK
function OkAPIreponse(dataJson, dataJsonName) {
    createImgUrl(dataJson);
    //    also create the a div empty underscore
    createUnderscoreDivs(dataJsonName);
}
//**************************************************** OK
function createImgUrl(data) {
    var img = data.profile_path;
    var apiBaseUrl = "http://image.tmdb.org/t/p/original";
    var sourceImg = apiBaseUrl + img;
    document.getElementById("imagenId").src = sourceImg;
}
//**************************************************** 
function createUnderscoreDivs(word) {
    for (var i = 0; i < word.length; i++) {
        //        create the div container
        var div = document.createElement("div");
        div.id = i + 'div';
        //        create the span inside the div
        var span = document.createElement("span");
        span.id = i;
        //        put the span into the div created
        div.appendChild(span);
        //        select the parent of the new div created
        var parent = document.getElementById("divContainer");
        //        first create the element, then style it - following the order
        parent.appendChild(div);
        //        call ifSpaceDiffClass();
        ifSpaceDiffClass(word, div, span, i);
    }
}

//**************************************************** 
//if the actor name contains space apply another class to the div
function ifSpaceDiffClass(word, div, span, i) {
    var space = ' ';
    if (word[i] == space) {
        div.classList.add("L2");
        span.classList.add("letters2");
    } else {
        wordsToFind++;
        div.classList.add("L1");
        span.classList.add("letters");
    }
}

//**************************************************** 
function keyValidation(event) {
    var theKeyNumber = event.keyCode;
    //    Here I need to validate to only letters and the space bar (32)
    if ((theKeyNumber >= 65 && theKeyNumber <= 90) || (theKeyNumber >= 97 && theKeyNumber <= 122) || (theKeyNumber == 32)) {
        var theKey = event.key;
        console.log('the key pressed is ' + theKey);
        //      call correctKeyPressed means letters and space
        correctKeyPressed(theKey, actorsName);
    }
}

//**************************************************** 
function waitForKey() {
    document.onkeyup = keyValidation;
}

//**************************************************** 
function correctKeyPressed(keyP, word) {
    //    if we find the key pressed into the word(name of actor)
    if (word.indexOf(keyP) > -1) {
        //    call howManyPlacesTakeLetter 
        howManyPlacesTakeLetter(keyP, word);

        //    the else if the key doesn't match with any letter inside the word       
    } else {
        //    call wrongKey 
        wrongKey();
    }
}

//**************************************************** 
function wrongKey() {
    chances--;
    //  call putChancesIntoHtml
    printGameStats();
    if (chances <= 0) {
        lossRound();
    }
}

function printGameStats() {
    var remainingChancesSpan = document.getElementById("chances")
    var winsSpan = document.getElementById("wins")
    var lossSpan = document.getElementById("loss")
    remainingChancesSpan.innerText = chances;
    winsSpan.innerText = wins;
    lossSpan.innerText = loss;
}

function lossRound() {
    loss++;
    chances = 10;
    wordsToFind = 0;
    actorsNameLength = 0;
    resetActor();
    deleteDivAndSpan();
    printGameStats();
}

function winRound() {
    wins++;
    chances = 10;
    wordsToFind = 0;
    actorsNameLength = 0;
    resetActor();
    deleteDivAndSpan();
    printGameStats();
}

//**************************************************** 
function howManyPlacesTakeLetter(keyFounded, wordDos) {
    var positions = new Array;
    for (var i = 0; i < wordDos.length; i++) {
        if (wordDos[i] == keyFounded) {
            positions.push(i);
        };
    };
    //    alert(positions);
    //    call printLetter
    matchLetter(positions, keyFounded);
    if (wordsToFind <= 0) {
        winRound();
    }
    //    call play sound 
    playSoundOK();
}

//howManyPlacesTakeLetter('b','burbuja');
//*******************************
function matchLetter(p, keyPressed) {
    for (var i = 0; i < p.length; i++) {
        var texto = document.createTextNode(keyPressed);
        var span = document.getElementById(p[i]);
        if (span.innerText.length === 0) {
            span.appendChild(texto);
            wordsToFind --;
        }
    }
}

//*******************************
function playSoundOK() {
    var audio = new Audio;
    audio.src = ('OK.wav')
    audio.volume = 0.5;
    audio.play();
}