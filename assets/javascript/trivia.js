const TOTAL_NUMBER_OF_QUESTIONS_TO_ASK = 5;
var questions = [];
var currentQuestionIndex;
var questionsAsked = [];
var playerAnswerIndex;
var totalCorrectAnswers;
var totalWrongAnswers;
var timeRemaining;
var timer;
var timerforNextQuestion;
var isTimeOut;
var mainDiv;

// This function is executed once document is ready
$(function(){
	"use strict";
	mainDiv = $("#mainDiv");

	//Creating Question objects
	questions = [new Question("What did Alfred Nobel develop?","TNT","C-4","Dynamite",3),
				 new Question("What will you get if you shake whipping cream in a glass can for 10 minutes?", "Cottage Cheese","Whipped Cream","Butter",3),
				 new Question("What is the largest country by area that has only one time zone?","China","Turkey","Russia",1),
				 new Question("How many times heart beats in a day?","10,000", "100,000" , "1,000",2),
				 new Question("How many squares are in normal Monopoly board?","60","40","20",2),
				 new Question("What is a shooting star?", "Comet", "Dying Star", "Meteor", 3),
				 new Question("Which country is not one of the founder members of EU?", "Great Britain", "France", "Germany", 1),
				 new Question("Which one of these is not a insect?","Flea", "Mosquito", "Tick", 3),
				 new Question("How many percent of the people live North of the equator?", "90%", "70%" ,"50%", 1),
				 new Question("Which city does not have an official Disneyland?", "Tokyo", "Moscow", "Hong Kong", 2),
				 new Question("What is the largest planet of our Solar System called?","Earth", "Jupiter", "Saturn", 2),
				 new Question("What animal first reached Earth orbits alive?","Dog","Cockroach","Ape",1),
				 new Question("What is the color of the stars in the flag of the United States of America?","Gold","Silver","White",3),
				 new Question("What was advertised in the World's first junk mail?","Weight Loss Pills","Dating Service","Computer",3),
				 new Question("Which of the following has been accepted to be human first name in New Zealand?","Lucifer","Number 16 Bus Shelter","Mafia No Fear",2)
				];

	$("#startGameButton").on("click", startNewGame);
});

// Constructor for Question object
function Question(qText, qOptOne, qOptTwo, qOptThree, qCorrectIndex){
	this.qText = qText;
	this.qOptOne = qOptOne;
	this.qOptTwo = qOptTwo;
	this.qOptThree = qOptThree;
	this.qCorrectIndex = qCorrectIndex;
}

// This function is called when new game is started
function startNewGame(){
	isTimeOut = false;
	totalWrongAnswers = 0;
	totalCorrectAnswers = 0;
	playerAnswerIndex = 0;
	questionsAsked = [];
	currentQuestionIndex = -1;

	new Audio('assets/sounds/startSound.mp3').play();
	displayNextQuestion();    //function is called to display next question
	mainDiv.removeClass("startButtonStyle");
	mainDiv.removeClass("finishStyle");
}

// This function is called after game is ended
function finishTrivia(){
	clearTimeout(timerforNextQuestion);
	mainDiv.empty();
	mainDiv.removeClass("correctWrongAnswerStyle");
	mainDiv.addClass("finishStyle");
	var finishMsgEl = $("<h2>")
	finishMsgEl.text("Thank you for playing. Here's your total score.");
	mainDiv.append(finishMsgEl);

	var correctMsgEl = $("<h3>")
	correctMsgEl.text("Total Correct Answers -> " + totalCorrectAnswers);
	mainDiv.append(correctMsgEl);

	var wrongMsgEl = $("<h3>")
	wrongMsgEl.text("Total In-Correct Answers -> " + totalWrongAnswers);
	mainDiv.append(wrongMsgEl);

	mainDiv.append("<br><br>")

	var playAgainMsgEl = $("<h3>")
	playAgainMsgEl.attr("id","playAgainButtonStyle");
	playAgainMsgEl.text("Click to Play Again !");
	mainDiv.append(playAgainMsgEl);

	finishMsgEl.hide();
	finishMsgEl.fadeIn(2000);
	correctMsgEl.hide();
	correctMsgEl.fadeIn(2000);
	wrongMsgEl.hide();
	wrongMsgEl.fadeIn(2000);

	playAgainMsgEl.on("click", startNewGame);
}

//This function is called to display next question
function displayNextQuestion(){
	var questionIndexNotFound = false;
	var randomIndex; 
	isTimeOut = false;
	playerAnswerIndex = 0;
	
	clearTimeout(timerforNextQuestion);

	//this loop make sure no question is asked more than one time per game 
	while(!questionIndexNotFound){
		questionIndexNotFound = true;
		randomIndex = Math.floor(Math.random()*15);
		for(var i=0 ; i<questionsAsked.length ; i++){
			if (randomIndex==Number(questionsAsked[i])) {
				questionIndexNotFound = false;
				break;
			}
		}
	}

	currentQuestionIndex = randomIndex; //saving index of current question to the variable
	questionsAsked.push(randomIndex); //saving index of current question to array

	mainDiv.empty();
	mainDiv.addClass("questionStyle");

	var timerEl = $("<h4>");
	var cQTextEl = $("<h3>");
	var cQOpt1El = $("<h5>");
	var cQOpt2El = $("<h5>");
	var cQOpt3El = $("<h5>");

	cQOpt1El.attr("answerIndex", "1");
	cQOpt2El.attr("answerIndex", "2");
	cQOpt3El.attr("answerIndex", "3");

	timerEl.append("Time remaining : <span id='timerem'>30</span> seconds");
	cQTextEl.text(questions[randomIndex].qText);
	cQOpt1El.text(questions[randomIndex].qOptOne);
	cQOpt2El.text(questions[randomIndex].qOptTwo);
	cQOpt3El.text(questions[randomIndex].qOptThree);
	
	mainDiv.append(timerEl);
	mainDiv.append(cQTextEl);
	mainDiv.append(cQOpt1El);
	mainDiv.append(cQOpt2El);
	mainDiv.append(cQOpt3El);

	cQTextEl.hide();
	cQTextEl.fadeIn(2000);
	cQOpt1El.hide();
	cQOpt1El.fadeIn(2000);
	cQOpt2El.hide();
	cQOpt2El.fadeIn(2000);
	cQOpt3El.hide();
	cQOpt3El.fadeIn(2000);

	$("h5[answerIndex]").on("click", checkAnswer);
	timeRemaining = 30;
	timer = setInterval(displayTimer, 1000);
}

// This function controls the 30 seconds timer
function displayTimer(){
	timeRemaining -=1;	
	$("#timerem").text(timeRemaining);

	if(timeRemaining==0){
		clearInterval(timer);
		isTimeOut = true;
		totalWrongAnswers++;
		afterWrongAnswer();
	}
}

// This function checks for answer correctness after user clicks on any answer
function checkAnswer(){
	clearInterval(timer);
	var playerAnswerIndex = $(this).attr("answerIndex");

	if(playerAnswerIndex==questions[currentQuestionIndex].qCorrectIndex){
		totalCorrectAnswers++;
		afterCorrectAnswer();
	}else{
		totalWrongAnswers++;
		afterWrongAnswer();
	}
}

// This function is executed after user clicked on the correct answer
function afterCorrectAnswer(){
	new Audio('assets/sounds/winSound.mp3').play();
	mainDiv.empty();
	mainDiv.removeClass("questionStyle");
	mainDiv.addClass("correctWrongAnswerStyle");
	var correctMsgEl = $("<h2>")
	correctMsgEl.text("Well done. That was the Correct Answer.");
	mainDiv.append(correctMsgEl);
	correctMsgEl.hide();
	correctMsgEl.fadeIn(2000);
	mainDiv.append("<img src='assets/images/congrats.gif' width=350px height=250px>");

	//setting timer between questions
	timerforNextQuestion = setTimeout(function(){
		if(questionsAsked.length==TOTAL_NUMBER_OF_QUESTIONS_TO_ASK){
			finishTrivia();
		}
		else{
			displayNextQuestion();
		}
	}, 4000);	
}

// This function is executed after user clicked on wrong answer or if there is a time out
function afterWrongAnswer(){
	new Audio('assets/sounds/loseSound.mp3').play();
	mainDiv.empty();
	mainDiv.removeClass("questionStyle");
	mainDiv.addClass("correctWrongAnswerStyle");
	var wrongMsgEl = $("<h2>")
	var correctAnsEl = $("<h3>");

	if(isTimeOut)
		wrongMsgEl.text("Oh no!. Time Out. Correct Answer is.");
	else
		wrongMsgEl.text("Sorry. That was InCorrect Answer. Correct Answer is.");

	mainDiv.append(wrongMsgEl);
	
	if(questions[currentQuestionIndex].qCorrectIndex==1)
		correctAnsEl.text(questions[currentQuestionIndex].qOptOne);
	else if(questions[currentQuestionIndex].qCorrectIndex==2)
		correctAnsEl.text(questions[currentQuestionIndex].qOptTwo);
	else
		correctAnsEl.text(questions[currentQuestionIndex].qOptThree);

	mainDiv.append(correctAnsEl);

	wrongMsgEl.hide();
	wrongMsgEl.fadeIn(2000);

	correctAnsEl.hide();
	correctAnsEl.fadeIn(2000);

	if(isTimeOut){
		mainDiv.append("<img src='assets/images/timeout.gif' width=350px height=250px>");
		isTimeOut = false;
	}else{
		mainDiv.append("<img src='assets/images/wrongans.gif' width=350px height=250px>");
	}

	//setting timer between questions
	timerforNextQuestion = setTimeout(function(){
		if(questionsAsked.length==TOTAL_NUMBER_OF_QUESTIONS_TO_ASK){
			finishTrivia();
		}
		else{
			displayNextQuestion();
		}
	}, 5000);
}

