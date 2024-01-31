const currentVersion = document.getElementById('language');
const usersInput = document.getElementById('user-input');
const showScore = document.getElementById('scoreDisplay');
const verseCurrent = document.getElementById('verse');

usersInput.addEventListener('change', ()=>{
    const userGuess = usersInput.value;
    const currentVerse = verseCurrent.innerText;
    console.log(currentVerse)

    let score = calculateBLEUScore(userGuess,currentVerse);

    console.log(score);

    if(currentVersion.value === 'chinese'){
        showScore.innerText = "分数: " + score + '%';
    }
})


