let questions;
let can_continue = true;


function loadJSONSync(url) {
    const request = new XMLHttpRequest();
    request.open('GET', url, false); // Set the third parameter to false for synchronous request
    request.send();

    if (request.status === 200) {
        questions = JSON.parse(request.responseText);
    } else {
        console.error('Error:', request.statusText);
    }
}


function randomize_ans(index){
    let answers = [
        questions[index]["answer"], 
        questions[index]["wrong 1"], 
        questions[index]["wrong 2"]
    ];
    
    // Shuffle answers using Fisher-Yates algorithm
    for (let i = answers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [answers[i], answers[j]] = [answers[j], answers[i]];
    }

    return answers;
}



function getQuestion(index = 0) {
    const answers = randomize_ans(index)
    document.getElementById('question').innerHTML = questions[index]['question']
    document.getElementById('ans_1').innerHTML = answers[0]
    document.getElementById('ans_2').innerHTML = answers[1]
    document.getElementById('ans_3').innerHTML = answers[2]
    document.getElementById('explanation_content').innerHTML = questions[index]['brief']
}


document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('ans_1').onclick = handleAnswer;
    document.getElementById('ans_2').onclick = handleAnswer;
    document.getElementById('ans_3').onclick = handleAnswer;
});



function handleAnswer(event) {
    let index = Number(document.getElementById('question_num').innerHTML) - 1;
    const selectedAnswer = event.target.innerHTML;
    if (selectedAnswer === questions[index].answer){
        document.getElementById('action-music').play();
        document.getElementById('answer_state').innerHTML = "CORRECT " + '+'+questions[index].points+"🥳"
        document.getElementById('answer_state').style.color = "green"
        let score = document.getElementById('score').innerHTML
        score = Number(score) + questions[index].points
        document.getElementById('score').innerHTML = score
    }else {
        document.getElementById('answer_state').innerHTML = "Sorry, that's incorrect 😓"
        document.getElementById('answer_state').style.color = "orange"
    }

    document.getElementById("explanation").style.display = "block";
    document.getElementById("quiz").style.display = "none";

}

function NextQuestion() {
    let index = Number(document.getElementById('question_num').innerHTML);
    if (index < questions.length) {
        document.getElementById('question_num').innerHTML = index + 1;
        getQuestion(index);
    } else {
        if (confirm('Do you want to continue') && can_continue) {
            loadJSONSync('more_science_questions.json');
            can_continue = false;
        } else {
            alert('All questions have been answered. Your final score is ' + document.getElementById('score').innerHTML);
            document.getElementById("explanation").style.display = "none";
        }
    }
    document.getElementById("explanation").style.display = "none";
    document.getElementById("quiz").style.display = "flex";
}
