var quiz = new Array();

 var UserModel = function () {
	 this.number = 0;
	 this.score = 0;
	 this.quizNum = 0;
	 this.diffecult = 0;
	 this.questions = [];
	 this.answers = [];
	 this.easyEvent = new Event(this);
	 this.hardEvent = new Event(this);
	 this.submitEvent = new Event(this);
	 this.database = firebase.database();
	 
	 this.init();
 };

 UserModel.prototype = {
	 init: function () {
		 //this.getQuizFromLocal();
		 //this.loadFromDb();
		 this.readQuiz();
	 },
	 
	 readQuiz: function() {
		return this.database.ref('/quiz/').once('value').then(function(snapshot) {
			var quiz = (snapshot.val() && snapshot.val().quiz) || 'UNKNOWN';
			//this.questions = quiz;
			this.initQuiz(quiz);
			// this.number = this.questions.length;
			// for (let i=0; i<this.number; i++) {
			// 	this.answers.push(this.questions[i].correct);
			// }
		}.bind(this));
	 },

	 loadFromDb: function(){
		const url = '/qs/getq';
		$.get(url, (data, status)=>{
			console.log("data incoming from db: ", data);
			if(status != "success"){
				console.log("check connection: ", status);
			}
			for(let i = 0; i < data.length; ++i){
				quiz[i] = {
					questionText: data[i].question,
					answerA: data[i].answer_a,
					answerB: data[i].answer_b,
					answerC: data[i].answer_c,
					answerD: data[i].answer_d,
					correct: data[i].correct,
					tag: 	 data[i].tag
				};
			}
			this.loadQ(); // callback in a callback
		});
		
	},
	
	loadQ: function(){
		// load from local storage
		//let storage = localStorage.getItem('questions');
		//qstArr = JSON.parse(storage);
		this.questions = quiz;
		console.log("loadQ questions", this.questions);
		if(this.questions == null){
			console.log("NO DATA IN DATABASE");
		}else{
			this.questions = quiz;
		}
		this.initQuiz();
	},
	
	initQuiz: function(quiz) {
		this.questions = quiz;
		this.number = this.questions.length;
		for (let i=0; i<this.number; i++) {
			 this.answers.push(this.questions[i].correct);
		}
	},
		
	chkData: function() {
		if (this.number == 0) {
			return 0;
		}
		if (this.diffecult === 1) {
			for (let i=0;i<this.number;i++) {
				if (this.questions[i].tag == "easy") {
					return 1;
				}
			}
		}
		if (this.diffecult === 2) {
			for (let i=0;i<this.number;i++) {
				if (this.questions[i].tag == "hard") {
					return 1;
				}
			}
		}
		return 0;
	},
	 
	 getQuizFromLocal: function () {
		 this.questions = JSON.parse(localStorage.getItem('quiz'));
		 this.number = this.questions.length;
		 for (let i=0; i<this.number; i++) {
			 this.answers.push(this.questions[i].correct);
		 }
	 },

	writeRankData: function(userID, email, score) {
		this.database.ref('users/' + userID + '-' + this.diffecult + '-').set({
			email: email,
			score: score
		});
	},

	readRankData: function(userID) {
		return this.database.ref('/users/' + userID).once('value').then(function(snapshot) {
			var email = (snapshot.val() && snapshot.val().email) || 'UNKNOWN';
			var score = (snapshot.val() && snapshot.val().score) || 'HiGH MARK';
		})
	},
	 
	 getQuestions: function () {
		 return this.questions;
	 },
	 
	 easy: function () {
		 this.easyEvent.notify();
	 },
	 
	 hard: function () {
		 this.hardEvent.notify();
	 },
	 
	 submit: function () {
		 this.submitEvent.notify();
	 },
	 
	 getNumber: function () {
		 return this.number;
	 },
	 
	 setScore:function (num) {
		 this.score = num;
	 },
	 
	 getScore: function () {
		 return this.score;
	 },
	 
	 setQuizNum: function (num) {
		 this.quizNum = num;
	 },
	 
	 getQuizNum: function () {
		 return this.quizNum;
	 },
	 
	 setDiffecult: function (num) {
		 this.diffecult = num;
	 },
	 
	 getDiffecult: function () {
		 return this.diffecult;
	 },
	 
	 getAnswers: function() {
		 return this.answers;
	 },

 };