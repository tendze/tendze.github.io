var isFirstTime = localStorage.getItem('isFirstTime');
    
    if (isFirstTime === null || isFirstTime === "true") {
        // Set flag to false after the first visit
        localStorage.setItem('isFirstTime', 'false');
        isFirstTime = true; // Add this line
    }

    function submitQuiz() {
        var questionsCount = document.querySelectorAll('.question').length;
        
        if (questionsCount > 0 && validateQuiz()) {
            // You can add logic here to collect and process the user's answers
            alert("Quiz submitted!");
        } else if (questionsCount === 0) {
            alert("Please add at least one question before submitting the quiz.");
        } else {
            alert("Not all questions have the correct answer selected, or there are invalid questions.");
        }
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
        addQuestionButton.innerText = (addQuestionButton.innerText === "Add New Question") ? "Cancel Adding New Question" : "Add New Question";
    }

    function addNewQuestion() {
        var questionContainer = document.getElementById("quiz-container");
        var newQuestion = document.createElement("div");

        var questionText = document.getElementById("new-question").value.trim();
        var optionsText = document.getElementById("new-options").value.split(',');

        // Check if question is non-empty and does not exceed 100 characters
        if (questionText === "" || questionText.length > 100) {
            alert("Please enter a non-empty question with at most 100 characters.");
            return;
        }

        // Check if there are at least 2 options
        if (optionsText.length < 2 || optionsText.length > 4) {
            alert("Please enter at least two and at most four options for the question.");
            return;
        }

        // Check if each option does not exceed 100 characters
        for (var i = 0; i < optionsText.length; i++) {
            if (optionsText[i].trim().length > 100) {
                alert("Each option should have at most 100 characters.");
                return;
            }

            // Check if each variant does not exceed 30 characters
            if (optionsText[i].trim().length > 30) {
                alert("Each variant should have at most 30 characters.");
                return;
            }
        }

        newQuestion.className = "question";
        newQuestion.innerHTML = "<h2>" + questionText + "</h2>";

        var optionsList = document.createElement("ul");
        optionsList.className = "options";

        for (var i = 0; i < optionsText.length; i++) {
            var optionItem = document.createElement("li");
            optionItem.className = "option";
            optionItem.innerHTML = "<input type='checkbox' name='q" + (document.querySelectorAll('.question').length + 1) + "' value='" + optionsText[i].trim() + "'>" + optionsText[i].trim();
            optionsList.appendChild(optionItem);
        }

        newQuestion.appendChild(optionsList);

        var deleteButton = document.createElement("button");
        deleteButton.className = "delete-button";
        deleteButton.innerHTML = "Delete";
        deleteButton.style.background = '#ff5252'
        deleteButton.onclick = function() {
            deleteQuestion(this);
        };

        newQuestion.appendChild(deleteButton);

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

    function validateQuiz() {
        var questions = document.querySelectorAll('.question');
        
        for (var i = 0; i < questions.length; i++) {
            var options = questions[i].querySelectorAll('input[type="checkbox"]');
            var answerSelected = false;
            
            for (var j = 0; j < options.length; j++) {
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