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
var wins = 0; // nro of actor's name guessed
var actorsName;
var chances = 10;
var pressedKeysOK = [''];
var toWin = 0; // letters that you still need to guess to win 

//**************************************************** 
// Game functions

function getInfoAPI(number){
// ***** XMLHttpRequest ini *****

//1  Instantiating XMLHttpRequest class
    var myRequest = new XMLHttpRequest();
//2  geting the json with the name and img path info
    myRequest.open('GET','https://api.themoviedb.org/3/person/'+number+'?api_key=bd933cb33c4e914196fb398dd91ef160',true);
//3  This is what to do with the json info
    myRequest.onload = function (){
        var jsonData = JSON.parse(myRequest.responseText);
//        testing the info
//        alert(jsonData.name+' '+jsonData.profile_path);
//        assigning the name to a global var actorsName
        actorsName = jsonData.name;
        putToWinIntoHtml(toWin);
//        handling the api response
        if ((jsonData.status_code != 34) && (jsonData.profile_path !== null)){
//          call OkAPIreponse
            OkAPIreponse(jsonData, jsonData.name);
//          just for me to see guess the actor's name
            console.log(jsonData.name);
//          call waitForKey
            waitForKey();
        }else{
          getInfoAPI(randomNumber(actorsRange));    
//          nullAPIresponse();       
        }
     }   
//4  Finally this is to send the request
    myRequest.send();  
    
//// ***** END XMLHttpRequest ini *****
}

getInfoAPI(randomNumber(actorsRange));

//**************************************************** OK
//random number function to create the getInfoAPI argument
function randomNumber(range){
    var randomNvar = Math.floor(Math.random() * range) + 1;
    return randomNvar;
}

//**************************************************** OK

//**************************************************** OK
function deleteDivAndSpan(){
    var elements = document.getElementsByClassName("L1");
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
}
//**************************************************** OK
function OkAPIreponse(dataJson, dataJsonName){
    createImgUrl(dataJson);
//    also create the a div empty underscore
    createUnderscoreDivs(dataJsonName);
}
//**************************************************** OK
function createImgUrl(data){
    var img = data.profile_path;
    var apiBaseUrl = "http://image.tmdb.org/t/p/original";
    var sourceImg = apiBaseUrl+img;
    document.getElementById("imagenId").src = sourceImg;
}
//**************************************************** 
function createUnderscoreDivs(word){
    for (var i=0; i< word.length; i++){
//        create the div container
          var div = document.createElement("div");
          div.id = i+'div';
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
          ifSpaceDiffClass(word,div,span,i);
    }
}

//**************************************************** 
//if the actor name contains space apply another class to the div
function ifSpaceDiffClass(word,div,span,i){
    var space = ' ';
    if (word[i] == space){
                div.classList.add("L2");
                span.classList.add("letters2");
    }else{
                div.classList.add("L1");
                span.classList.add("letters");
    }
}

//**************************************************** 
function keyValidation(event){
    var theKeyNumber = event.keyCode;
//    Here I need to validate to only letters 
    if ((theKeyNumber >= 65 && theKeyNumber <= 90) || (theKeyNumber >= 97 && theKeyNumber <= 122)){
        var theKey = event.key;
        console.log('the key pressed is '+theKey);
//      call correctKeyPressed means letters and space
        theKey = convertToUpper(theKey);
//        alert(theKey);
        actorsName = convertToUpper(actorsName);
//        alert(actorsName);
        correctKeyPressed(theKey,actorsName);
    }
}    

//**************************************************** 
function waitForKey(){
    document.onkeyup = keyValidation;
}

//**************************************************** 
function correctKeyPressed(keyP,word){
//    if we find the key pressed into the word(name of actor)
    if (word.indexOf(keyP)>-1){
//      call check for repeated key
        youWin(toWin);
        checkRepeatedKey(keyP,word);
        
//   the else if the key doesn't match with any letter inside the word       
    }else{
//    call youlose to check if the player lose 
      youLose();
    }
}
//**************************************************** 
function checkRepeatedKey(keyPressed,word){
        if (pressedKeysOK.indexOf(keyPressed)>-1){
            playSound('assets/audios/OK.wav');
            alert('You already guessed the '+keyPressed);
            
        }else{
            
            pressedKeysOK.push(keyPressed);
            howManyPlacesTakeLetter(keyPressed,word);    
        }  
}
//**************************************************** 
function putToWinIntoHtml(value){
    var wordLengthWhitoutSpaces = actorsName.replace(/\s/g,"");
    var pressedCorr = pressedKeysOK.length;
    var length = wordLengthWhitoutSpaces.length;
    value = length - pressedCorr+2;
    document.getElementById("towin").innerHTML = value;
    return value;
};

//**************************************************** 
function nextLevel(){
    if (wins == 5){
        level++; 
        alert('Congratulations !!!, You got a new badge');
//        call showNewBadge
    }else{
        wins++;
    }
}
//**************************************************** 
function youLose(){
    if (chances == 0){
        alert('Sorry, you lose, the name was '+actorsName);
        reset();
    }else{
        wrongKey();
    }
}
//**************************************************** 
function youWin(v){
    v = putToWinIntoHtml;
    if (v == 0){
        nextLevel();
        alert('Congratulations !!!, yo got it');
        reset();
    }
       
    
}
//**************************************************** 
function wrongKey(){
//  play audio
    playSound('assets/audios/WRONG.wav');
//  modify the global variables fails and chances
    chances--;
//  call putChancesIntoHtml
    putChancesIntoHtml(chances);
//  msg the player press wrong key
    alert('Wrong Key, you have '+chances+' chances more');
}
//**************************************************** 
function putChancesIntoHtml(ch){
    var chancesSpan = document.getElementById("chances").innerHTML = ch;
}
//**************************************************** 
function putFailsIntoHtml(fa){
    var failSpan = document.getElementById("fails").innerHTML = fa;   
}
//**************************************************** 
function howManyPlacesTakeLetter(keyFounded,wordDos){
    var position = new Array;
    for (var i = 0; i<wordDos.length; i++){
        if(wordDos[i] == keyFounded){
            position.push(i); 
            putToWinIntoHtml();
        };
    };
//    call printLetter
    printLetter(position,keyFounded);
//    call play sound 
    playSound('assets/audios/OK.wav');
}

//howManyPlacesTakeLetter('b','burbuja');
//*******************************************
function printLetter (p,keyPressed){
    for (var i=0; i<p.length; i++){
            var texto = document.createTextNode(keyPressed);
            var span = document.getElementById(p[i]);
            span.appendChild(texto);
    }
}

//*******************************************
function playSound (audioSource){
    var audio = new Audio;
//    'assets/audios/OK.wav'
//    'assets/audios/WRONG.wav'
        audio.src = (audioSource);
        audio.volume = 0.5;
        audio.play();
}

//*******************************************
//FUNCTION TO RESET THE GAME
function reset (){
//  reload img by defaut
//  call clear the screen
    clearTheScreen('L1'); 
    clearTheScreen('L2'); 
    clearTheScreen('letters'); 
    clearTheScreen('letters2'); 
//  resend the API request
    getInfoAPI(randomNumber(actorsRange));
};

//*******************************************
function clearTheScreen(className){
    var elements = document.getElementsByClassName(className);
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
}
//*******************************************
function convertToUpper(string){
    return string.toUpperCase(); 
}
//*******************************************
