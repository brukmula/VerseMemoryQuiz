//Script to handle language selection

const logo = document.getElementById('logo');
const languageSelected = document.getElementById('language');
const difficultyText = document.getElementById('difficultyText');
const selectDifficultyText = document.getElementById('difficultySelect');
const versionText = document.getElementById('verseText');
const selectVersionText = document.getElementById('selectVersion');
const gameText = document.getElementById('gameText');
const fuzzText = document.getElementById('fuzz');
const tootTipText = document.getElementById('toolTip');
const helpText = document.getElementById('helpButton');
const paraphraseTitleText = document.getElementById('paraphraseBoxTitle');
const checkVerseText = document.getElementById('peek-button');
const newVerseText = document.getElementById('redo');
const paraphraseButtonText = document.getElementById('newParaphrase');
const answerText = document.getElementById('answerText');
const completedVerseText = document.getElementById('completedVerse');

//If language is changed, change contents of game to that language
languageSelected.addEventListener('change', () => {
    switch (languageSelected.value){
        case "english":
            english();
            break;
        case "chinese":
            chinese();
            break;
        case "amharic":
            amharic();
            break;
        case "spanish":
            spanish();
            break;
    }

});

//Change app text to english
function english(){
    logo.innerText = 'Verse Memory Quiz';
    difficultyText.innerText = 'Difficulty';
    selectDifficultyText.innerText = 'Select Difficulty';
    selectVersionText.innerText = 'Select Version';
    gameText.innerText = 'Change Game Mode'
    fuzzText.innerText = 'Fuzzy:'
    tootTipText.innerText = 'When fuzzy score is activated, your guess will be checked against all translations.'
    helpText.innerText = 'Help';
    paraphraseTitleText.innerText = 'Meaning of Verse';
    answerText.innerText = 'Enter Your Answer';
    checkVerseText.innerText = 'Check Verse';
    newVerseText.innerText = 'New Verse';
    paraphraseButtonText.innerText = 'Other expression of the meaning';
    completedVerseText.innerText = 'Completed Verse';
}

//Change app text to Chinese
function chinese(){
    logo.innerText = '圣经经文记忆测验';
    selectDifficultyText.innerText = '选择难度';
    selectVersionText.innerText = '选择版本';
    gameText.innerText = '改变游戏模式';
    fuzzText.innerText = ' 模糊匹配'
    tootTipText.innerText = '当回合计分被激活时，您的猜测将与所有翻译进行检查。';
    helpText.innerText = '帮助';
    paraphraseTitleText.innerText = '经文内容';
    answerText.innerText = '输入您的答案 (猜完后按空格键)';
    checkVerseText.innerText = '查看经文';
    newVerseText.innerText = ' 新的经文'
    paraphraseButtonText.innerText = '其他释义';
    completedVerseText.innerText = '完整经文';
}

function amharic(){
    logo.innerText = 'የመጽሐፍ ቅዱስ ትውስታ ጨዋታ';
    difficultyText.innerText = 'ክህሎት';
    selectDifficultyText.innerText = 'የክህሎት ደረጃ';
    selectVersionText.innerText = 'ትርጉም ይምረጡ';
    gameText.innerText = 'የጨዋታ ሁነታን ይቀይሩ'
    fuzzText.innerText = 'ፋዚ'
    tootTipText.innerText = 'ሲነቃ የእርስዎ ግምት በሁሉም ትርጉሞች ላይ ይመረመራል።'
    helpText.innerText = 'እርዳታ';
    paraphraseTitleText.innerText = 'ሐረግ';
    answerText.innerText = 'መልሱን እዚህ ያስገቡ';
    checkVerseText.innerText = 'ጥቅስ ይመልከቱ';
    newVerseText.innerText = 'አዲስ ጥቅስ';
    paraphraseButtonText.innerText = 'ሌላ ሐረግ';
    completedVerseText.innerText = 'ሙሉ ጥቅስ';
}

function spanish(){
    logo.innerText = 'Prueba de Memoria de Versos';
    difficultyText.innerText = 'Dificultad: ';
    selectDifficultyText.innerText = 'Seleccione dificultad:';
    selectVersionText.innerText = 'Seleccionar versión';
    gameText.innerText = 'Cambiar modo de juego'
    fuzzText.innerText = 'Redondo:'
    tootTipText.innerText = 'Cuando se activa la ronda, su suposición se comparará con todas las traducciones.'
    helpText.innerText = 'Ayuda';
    paraphraseTitleText.innerText = 'Paráfrasis';
    answerText.innerText = 'Ingrese su respuesta';
    checkVerseText.innerText = 'Comprobar Verso';
    newVerseText.innerText = 'Nuevo Verso';
    paraphraseButtonText.innerText = 'Otra parafrasis';
    completedVerseText.innerText = 'Verso completado';
}
