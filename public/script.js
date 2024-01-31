//Call id's from HTML
const verseContainer = document.getElementById('verse');
const paraphraseContainer = document.getElementById('paraphrase');
const userInput = document.getElementById('user-input');
const resultContainer = document.getElementById('result');
const difficultySelect = document.getElementById('difficulty');
const redoButton = document.getElementById('redo');
const paraphraseButton = document.getElementById('newParaphrase');
const versionSelect = document.getElementById('versionSelect');
const scoreButton = document.getElementById('scoreButton');
const scoreDisplay = document.getElementById('scoreDisplay');
const changeMode = document.getElementById('changeMode');
const boxTitle = document.getElementById('paraphraseBoxTitle');
const themeContainer = document.getElementById('themes');
const fuzzSwitch = document.getElementById('fuzzSwitch');
const languageSelect = document.getElementById('language');

//Help section
const helpButton = document.getElementById('helpButton');
const helpWindow = document.getElementById('helpWindow');
const closeHelp = document.getElementById("closeHelp");

//Peek features
const peekButton = document.getElementById('peek-button');
const peekWindow = document.getElementById('peek-window');
const peekVerse = document.getElementById('peek-verse');
const closePeekButton = document.getElementById('close-peek-button');

//Game container
const gameContainer = document.getElementById('game-container');

let currentLanguage = 'english';
let bibleData; //Variable to keep track of data from JSON file
let currentVerse; //Store current verse JSON reference
let verseText; // Verse content
let verseId; // Store the verses reference
let currentDifficulty = 50; //Default difficulty is 50%
let peekUsed = false; //Track if the peek feature has been used
let verseRef = 'esv'; // Keep track of 8 digit reference from json and set it to esv by default
let showCurrentScore = true; //By default, show current score
let currentScore = 0; //Keep track of current score
let currentMode = false; //If current mode is false, show paraphrase else show verse
let fuzzyScore = false; //This variable determines whether to check all translations or not. Default is to check
let versions = ['esv','niv', 'kjv','nlt','net']; //Store all the versions of the bible into an array

languageSelect.addEventListener('change', () =>{
    //Change to chinese
    if(languageSelect.value === 'chinese'){
        currentLanguage = 'chinese';
        displayVerse();
        scoreDisplay.innerText = '分数: 0%';
        verseContainer.innerText = '';
    }

    //change to english
    else if (languageSelect.value === 'english'){
        currentLanguage = 'english';
        displayVerse();
        scoreDisplay.innerText = 'Score 0%';
        verseContainer.innerText = '';
    }
})


//Receive difficulty level from user
difficultySelect.addEventListener('change', () => {
    currentDifficulty = parseInt(difficultySelect.value);
    resultContainer.textContent = '';
    verseContainer.textContent = '';
    resultContainer.innerText = '';
    if(showCurrentScore === true) {
        if(currentLanguage === 'english') {
            scoreDisplay.innerText = 'Score: ' + currentScore + '%';
        }
        if(currentLanguage === 'chinese'){
            scoreDisplay.innerText = '分数: ' + currentScore + '%';
        }
    }
});

versionSelect.addEventListener('change', () => {
    verseRef = versionSelect.value;
    peekUsed = false; //Set peek back to false since version has changed
    verseText = currentVerse[verseRef];
    verseContainer.innerText = '';
    resultContainer.innerText = '';
})

//Retrieve random verse from JSON file
function getRandomVerse(){
    const randomIndex = Math.floor(Math.random() * bibleData.verses.length);
    return bibleData.verses[randomIndex];
}

//Function to retrieve random paraphrase of selected verse
function getRandomParaphrase(verse){

    let paraphrases;

    if(currentLanguage === 'english'){
        paraphrases = verse.paraphrases;
    }

    if(currentLanguage === 'chinese'){
        paraphrases = verse.chineseParaphrases;
    }

    const randomIndex = Math.floor(Math.random() * paraphrases.length);
    return paraphrases[randomIndex].trim();
}

//Retrieve themes of verse
function getThemes(verse){
    return verse.themes;
}

function displayVerse(){
    const randomVerse = getRandomVerse();
    const randomParaphrase = getRandomParaphrase(randomVerse);

    currentVerse = randomVerse;

    if(currentLanguage === 'english') {
        verseText = randomVerse[verseRef];
    }

    //If it is chinese remove all the spaces and punctuations
    else if(currentLanguage === 'chinese'){
        verseText = randomVerse.chinese;
    }

    //If user is playing on paraphrase mode
    if(currentMode === false) {
        paraphraseContainer.textContent = randomParaphrase;
    }
    else{
        paraphraseContainer.textContent = verseId;
    }
    themeContainer.textContent = '';
    userInput.value = '';
    resultContainer.textContent = '';
}

//function to resize users guess box
function resizeTextArea(){
    userInput.style.height = 'auto';
    userInput.style.height = 'auto';
    userInput.style.height = userInput.scrollHeight + 'px';
}

function removeChinesePunctuation(text){
    //Remove all common punctuations used in chinese writing
    const regex = /[\s\u3000-\u303F\uff00-\uffef]/g;

    //Replace matched characters with empty string
    return text.replace(regex, '');
}

//Split the translated and reference texts into words
function tokenize(text){
    //Remove punctuation and split into words
    return text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").toLowerCase().split('');
}

//create n-grams from tokens.
function getNgrams(tokens,n){
    let ngrams = [];

    for (let i = 0; i <tokens.length - n+1; i++) {
        ngrams.push(tokens.slice(i,i+n).join(' '));
    }

    return ngrams;
}


//Calculate the precision for each n-gram level
function calculatePrecision(translatedNgrams, referenceNgrams){
    let count = 0;
    let total = translatedNgrams.length;

    translatedNgrams.forEach(ngram => {
        if(referenceNgrams.includes(ngram)) {
            count++;
            //Remove to avoid counting the same n-gram multiple times
            referenceNgrams.splice(referenceNgrams.indexOf(ngram), 1);
        }
    });

    return total > 0 ? count/total :0;
}

//Calculate similarity using BLEU score method
function calculateSimilarity(userInput, referenceVerse) {
    let tokenizedInput = tokenize(userInput);
    let tokenizedReference = tokenize(referenceVerse);

    let precisions = [];
    for (let n = 1; n <= 4; n++) {
        let translatedNgrams = getNgrams(tokenizedInput, n);
        let referenceNgrams = getNgrams(tokenizedReference,n);
        precisions.push(calculatePrecision(translatedNgrams, referenceNgrams));
    }

    let precisionProduct = precisions.reduce((acc, val) => acc*val, 1);
    let geometricMean = Math.pow(precisionProduct, 1/4);

    //Brevity Penalty
    let brevityPenalty = 1.0;
    if(tokenizedInput.length < tokenizedReference.length){
        brevityPenalty = Math.exp(1-tokenizedReference.length/tokenizedInput.length);
    }

    //Smooth Bleu score
    const percentageScore = (geometricMean * brevityPenalty) * 100;
    return Math.round(percentageScore + (100 - percentageScore) * (geometricMean*brevityPenalty));
}

//calculate bleu score for chinese
async function calculateBLEUScore(candidateText, referenceText) {
    try {
        const response = await fetch('http://localhost:5000/calculate-bleu', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ candidate: candidateText, reference: referenceText })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data.bleu_score;
    } catch (error) {
        console.error('Error calculating BLEU score:', error);
    }
}

//Fetch JSON data asynchronously
fetch('/VerseMemoryQuiz/public/text.json')
    .then(response => response.json())
    .then(data => {
        bibleData = data;
        displayVerse();
        //Update current score
        if(showCurrentScore === true){
            scoreDisplay.innerText = 'Score: ' + currentScore + '%';
        }
    })
    .catch(error => console.error('Error fetching data', error));

//Wait for user to click new paraphrase button
paraphraseButton.addEventListener('click', () => {
    if(currentMode === false) {
        paraphraseContainer.innerText = getRandomParaphrase(currentVerse);
    }
    else {
        if(themeContainer.innerText === '') {
            themeContainer.innerText = "Themes: " + getThemes(currentVerse);
        }
        else {
            themeContainer.innerText = '';
        }
    }
});

//Wait for user to click peek button
peekButton.addEventListener('click', () => {
    //If the user hasn't peeked the original verse
    if(!peekUsed){
        //Display the original verse temporarily
        peekVerse.textContent = verseText;
        peekWindow.style.display = 'block';

        //User is only allowed to peek once
        peekUsed = true;
    }

    //If user has already used peek
    else{
        peekVerse.textContent = 'Check already used!';
        peekWindow.style.display = 'block';
    }


});

// This function checks if the click is outside the modal
function handleClickOutside(event) {
    if ((peekWindow).contains(event.target)) {
        peekWindow.style.display = 'none';
    }
}

// Attach the event listener to the whole document
document.addEventListener('click', handleClickOutside);

//If fuzz switch is turned on check all translation
fuzzSwitch.addEventListener('change', () => {
    //Switch from true to false
    fuzzyScore = fuzzyScore !== true;
})

closePeekButton.addEventListener('click', () => {
    //Close the peek window
    peekWindow.style.display = 'none';
});

//If help button is clicked
helpButton.addEventListener('click', () => {
    helpWindow.style.display = 'block';
});

closeHelp.addEventListener('click',()=> {
    helpWindow.style.display = 'none';
});

//If user clicks redo button, they start a new session
redoButton.addEventListener('click', () => {
    paraphraseContainer.innerText = '';
    verseContainer.innerText = '';
    resultContainer.innerText = '';
    peekUsed= false;
    displayVerse();
})

//When check score button is clicked
scoreButton.addEventListener('click', () => {
    //Show or hide current score
    if(showCurrentScore === false){
        showCurrentScore = true;
        scoreButton.innerText = 'Hide Score';
        userInput.placeholder = 'Begin typing to see score';
        scoreDisplay.innerText = 'Score: ' + currentScore + '%' ;
    }
    else {
        showCurrentScore = false;
        scoreButton.innerText = 'Show Score';
        userInput.placeholder = 'Enter the verse';
        scoreDisplay.innerText = '';
    }

})

//If user wants to change the game mode
changeMode.addEventListener('click', () => {
    //If paraphrase mode is on change to verse mode
    if(currentMode === false) {
        currentMode = true;

        if(currentLanguage === 'english') {
            boxTitle.innerText = "Verse Reference";
            paraphraseContainer.innerText = verseId;
            paraphraseButton.innerText = "Themes";
        }
        else if(currentLanguage === 'chinese') {
            boxTitle.innerText = "Verse Reference";
            paraphraseButton.innerText = "Themes";
        }
    }
    else{
        currentMode = false;
        boxTitle.innerText = "Paraphrase";
        themeContainer.textContent = '';
        paraphraseContainer.innerText = verseText;
        paraphraseButton.innerText = "Other Paraphrase";
    }
})

//While user is typing check score
userInput.addEventListener('input', () => {
    const userAnswer = userInput.value.trim();

    //Check score when in english
    if (currentLanguage === 'english') {
        //If fuzzy score is on, compare all versions
        if (fuzzyScore === true) {
            let highest = []
            versions.forEach((version, index, array) => {
                let versionScore = currentVerse[version];
                highest.push(calculateSimilarity(userAnswer, versionScore));
            })
            currentScore = Math.max(...highest);
        }

        //If fuzzy score is off, only compare to selected version
        else {
            const similarityPercentage = calculateSimilarity(userAnswer, verseText);
            currentScore = similarityPercentage;
        }

        //Update current score
        if (showCurrentScore === true) {
            scoreDisplay.innerText = 'Score: ' + currentScore + '%';
        }

        //Check if user correct percentage is greater than or equal to selected difficulty
        if (currentScore >= currentDifficulty) {
            verseContainer.textContent = verseId + ': ' + verseText;
            resultContainer.textContent = 'Correct!'
        } else if (currentScore < currentDifficulty) {
            verseContainer.textContent = '';
        }
    }

    //Calculate bleu score differently for chinese
    if(currentLanguage === 'chinese') {

        let chineseText = removeChinesePunctuation(verseText);

        //Use the calculate bleu score function created for chinese
        calculateBLEUScore(userAnswer,chineseText)
            .then(score => currentScore = Math.round(score));

        console.log(currentScore);
        console.log(userAnswer);
        console.log(chineseText);

        //Update current score
        if (showCurrentScore === true) {
            scoreDisplay.innerText = '分数: ' + currentScore + '%';
        }

        //Check if user correct percentage is greater than or equal to selected difficulty
        if (currentScore >= currentDifficulty) {
            verseContainer.textContent = verseText;
            resultContainer.textContent = 'Correct!'
        } else if (currentScore < currentDifficulty) {
            verseContainer.textContent = '';
        }
    }


});
