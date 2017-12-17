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
const TOTAL_NUMBER_OF_QUESTIONS_TO_ASK = 5;
var mainDiv;

$(function(){

	"use strict";

	mainDiv = $("#mainDiv");

	questions = [new Question("What did Alfred Nobel develop?","TNT","C-4","Dynamite",3),
				 new Question("What will you get if you shake whipping cream in a glass can for 10 minutes?", "Cottage Cheese","Whipped Cream","Butter",3),
				 new Question("What is the largest country by area that has only one time zone?","China","Turkey","Russia",1),
				 new Question("How many times heart beats in a day?","10,000", "100,000" , "1,000",2),
				 new Question("How many squares are in normal Monopoly board?","60","40","20",2),
				 new Question("What is a shooting star?", "Comet", "Dying Star", "Meteor", 3),
				 new Question("Which country is not one of the founder members of EU?", "Great Britain", "France", "Germany", 1),
				 new Question("Which one of these is not a insect?","Flea", "Mosquito", "Tick", 3),
				 new Question("How many percent of the people live North of the equator?", "90%", "70%" ,"50%", 1),
				 new Question("Which city does not have an official Disneyland?", "Tokyo", "Moscow", "Hong Kong", 2)
				];

	$("#startGameButton").on("click", startNewGame);

});

function Question(qText, qOptOne, qOptTwo, qOptThree, qCorrectIndex){
	this.qText = qText;
	this.qOptOne = qOptOne;
	this.qOptTwo = qOptTwo;
	this.qOptThree = qOptThree;
	this.qCorrectIndex = qCorrectIndex;
}

function startNewGame(){
	totalWrongAnswers = 0;
	totalCorrectAnswers = 0;
	playerAnswerIndex = 0;
	questionsAsked = [];
	currentQuestionIndex = -1;

	displayNextQuestion();
	mainDiv.removeClass("startButtonStyle");
}

function finishTrivia(){

}

function displayNextQuestion(){
	var questionIndexNotFound = false;
	var randomIndex; 
	isTimeOut = false;
	playerAnswerIndex = 0;
	
	if(questionsAsked.length==5){
		finishTrivia();
	}

	while(!questionIndexNotFound){
		randomIndex = Math.floor(Math.random()*10);
		for(var i=0 ; i<questionsAsked.length ; i++){
			if (randomIndex==questionsAsked[i]) {
				questionIndexNotFound = false;
				break;
			}
		}
		questionIndexNotFound = true;
		currentQuestionIndex = randomIndex;
		questionsAsked.push(randomIndex);
	}

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

function displayTimer(){
	timeRemaining -=1;	
	$("#timerem").text(timeRemaining);

	if(timeRemaining==0){

		clearInterval(timer);
		isTimeOut = true;
		afterWrongAnswer();

	}
}

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

function afterCorrectAnswer(){
	mainDiv.empty();
	mainDiv.removeClass("questionStyle");
	mainDiv.addClass("correctAnswerStyle");
	var correctMsgEl = $("<h2>")
	correctMsgEl.text("Well done. That was the Correct Answer.");
	mainDiv.append(correctMsgEl);
	correctMsgEl.hide();
	correctMsgEl.fadeIn(2000);
	mainDiv.append("<img src='assets/images/congrats.gif' width=350px height=250px>");
}

function afterWrongAnswer(){

}