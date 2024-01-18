let tg = window.Telegram.WebApp;
tg.expand();

var isFirstTime = localStorage.getItem('isFirstTime');
    
if (isFirstTime === null || isFirstTime === "true") {
    // Set flag to false after the first visit
    localStorage.setItem('isFirstTime', 'false');
    isFirstTime = true; // Add this line
}

function sendDataToTg() {
    var data = new Map();

    var name = document.getElementById("title-input").value
    data["name"] = name
    var questionList = []
    var questions = document.querySelectorAll('.question');
    for (var i = 0; i < questions.length; i++) {
        var options = questions[i].querySelectorAll('input[type="checkbox"]');
        var question = questions[i].querySelector("h2").textContent
        var considerPartialAnswers = options[0].checked
        var variants = []
        var right_variants = []
        
        for (var j = 1; j < options.length; j++) {
            variants.push(options[j].value)
            if (options[j].checked) {
                right_variants.push(options[j].value)
            }
        }
        
        questionList.push(
            {
                "question": question,
                "variants": variants,
                "right_variants": right_variants,
                "consider_partial_answers": considerPartialAnswers ? 1 : 0
            }
        )
    }
    data["questions"] = questionList
    tg.sendData(JSON.stringify(data))
}

function submit() { 
    var questionsCount = document.querySelectorAll('.question').length;

    if (questionsCount > 0 && validateQuestion()) {
        // You can add logic here to collect and process the user's answers
        alert("Отправлено!");
    } else if (questionsCount === 0) {
        alert("Пожалуйста, добавьте хотя бы один вопрос");
    } else if (!validateName()) {
        alert("Введите название квиза")
    } else {
        alert("Не у всех вопросов отмечены варианты ответов");
    } 
    sendDataToTg()
}

function toggleAddQuestionForm() {
    var addQuestionForm = document.getElementById("add-question-form");
    var addQuestionButton = document.getElementById("add-question-button");

    if (isFirstTime) {
        addQuestionForm.style.display = "none";
        isFirstTime = false;
    } else {
        addQuestionForm.style.display = (addQuestionForm.style.display === "none") ? "block" : "none";
    }

    // Toggle button text
    addQuestionButton.innerText = (addQuestionButton.innerText === "Добавить новый вопрос") ? "Отменить добавление нового вопроса" : "Добавить новый вопрос";
}

function escapeRegExp(strToEscape) {
    return strToEscape.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
};

function trimChar(origString, charToTrim) {
    charToTrim = escapeRegExp(charToTrim);
    var regEx = new RegExp("^[" + charToTrim + "]+|[" + charToTrim + "]+$", "g");
    return origString.replace(regEx, "");
}

function onSwitchToggleChange(checkbox) {
    var questionBox = checkbox.closest('.question');
    var checkboxes = questionBox.querySelectorAll('.options input[type="checkbox"]');

    var checkedCheckboxes = 0;
    checkboxes.forEach(function(checkbox) {
        if (checkbox.checked) {
            checkedCheckboxes++;
        }
    });
    
    if (checkedCheckboxes <= 1) {
        alert("Можно переключить, если выбрано больше 1 верного ответа")
        checkbox.checked = false; // Switch off if 1 or fewer checkboxes are checked
    }
}

function onCheckboxClick(checkbox) {
    var questionBox = checkbox.closest('.question');
    var switchToggle = questionBox.querySelector('.question-checkbox');
    var checkboxes = questionBox.querySelectorAll('.options input[type="checkbox"]');

    var checkedCheckboxes = 0;
    checkboxes.forEach(function(checkbox) {
        if (checkbox.checked) {
            checkedCheckboxes++;
        }
    });
    
    if (checkedCheckboxes <= 1) {
        switchToggle.checked = false
    }
}

function addNewQuestion() {
    var currentQuestionsCount = document.querySelectorAll('.question').length;

    // Check if the limit of 30 questions is reached
    if (currentQuestionsCount >= 30) {
        alert("Вы достигли лимита в 30 вопросов");
        return;
    }

    var questionContainer = document.getElementById("container");
    var newQuestion = document.createElement("div");
    
    var questionText = document.getElementById("new-question").value.trim();
    var optionsText = trimChar(document.getElementById("new-options").value, ";").split(';');

    // Check if question is non-empty and does not exceed 100 characters
    if (questionText === "" || questionText.length > 100) {
        alert("Введите текст вопроса ненулевой длины, не превосходящий 100 символов");
        return;
    }

    // Check if there are at least 2 options
    if (optionsText.length < 2 || optionsText.length > 4) {
        alert("Введите, пожалуйста, хотя бы 2 варианта ответов, но не более 4х");
        return;
    }

    // Check if each option does not exceed 100 characters
    for (var i = 0; i < optionsText.length; i++) {
        // Check if each variant does not exceed 30 characters
        if (optionsText[i].trim().length > 30) {
            alert("каждый вариант ответа не должен превышать 30 символов");
            return;
        }
    }

    newQuestion.className = "question";
    newQuestion.innerHTML = "<h2>" + questionText + "</h2>";

    // new

    // Add text "Consider partial answers"
    var considerPartialAnswers = document.createElement("p");
    considerPartialAnswers.textContent = "Учитывать частичные ответы";
    newQuestion.appendChild(considerPartialAnswers);

    var switchToggle = document.createElement("label");
    switchToggle.className = "switch-toggle";
    switchToggle.innerHTML = "<input type='checkbox' class='question-checkbox' onclick='onSwitchToggleChange(this)' unchecked><span class='slider'></span>";
    newQuestion.appendChild(switchToggle);


    var closeButton = document.createElement("button");
    closeButton.className = "close-button";
    closeButton.innerHTML = "✖"; // Unicode character for a cross
    closeButton.onclick = function() {
        deleteQuestion(this);
    };
    newQuestion.appendChild(closeButton);
    
    // new

    var optionsList = document.createElement("ul");
    optionsList.className = "options";
    

    for (var i = 0; i < optionsText.length; i++) {
        var optionItem = document.createElement("li");
        optionItem.className = "option";
        optionItem.innerHTML = "<input type='checkbox' onclick='onCheckboxClick(this)' name='q" + (document.querySelectorAll('.question').length + 1) + "' value='" + optionsText[i].trim() + "'>" + optionsText[i].trim();
        optionsList.appendChild(optionItem);
    }

    newQuestion.appendChild(optionsList);

    questionContainer.insertBefore(newQuestion, document.getElementById("add-question-form"));

    // Clear the form
    document.getElementById("new-question").value = "";
    document.getElementById("new-options").value = "";

    // Hide the form after adding a question
    toggleAddQuestionForm();
}

function deleteQuestion(button) {
    var question = button.parentNode;
    question.parentNode.removeChild(question);
}

function validateQuestion() {
    var questions = document.querySelectorAll('.question');
    
    for (var i = 0; i < questions.length; i++) {
        var options = questions[i].querySelectorAll('input[type="checkbox"]');
        var answerSelected = false;
        
        for (var j = 1; j < options.length; j++) {
            if (options[j].checked) {
                answerSelected = true;
                break;
            }
        }
        if (!answerSelected) {
            return false; // At least one question doesn't have a selected answer
        }
    }

    return true; // All questions have a selected answer
}

function validateName() {
    var name = document.getElementById("title-input").value
    if (name == "") {
        return false;
    }
    return true;
}
