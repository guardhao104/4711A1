 var AdminModel = function () {
	 this.number = 1;
	 this.questions = [];
	 this.addQuestionEvent = new Event(this);
	 this.removeQuestionEvent = new Event(this);
	 this.submitEvent = new Event(this);
	 this.database = firebase.database();
 };

 AdminModel.prototype = {

     addQuestion: function () {
		 this.number++;
		 this.addQuestionEvent.notify();
	 },
	 
	 removeQuestion: function () {
		 if (this.number >= 2) {
			 this.number--;
			 this.removeQuestionEvent.notify();
		 }
	 },
	 
	 submit: function () {
		 //localStorage.setItem('quiz', JSON.stringify(this.questions));
		 //this.send(this.questions);
		 this.writeQuiz(this.questions);
		 this.submitEvent.notify();
	 },
	 
	 setQuestions: function (quizes) {
		 this.questions = quizes;
	 },
	 
	 getNumber: function () {
		 return this.number;
	 },
	 
	writeQuiz: function(qst) {
		this.database.ref('quiz/').set({
			quiz: qst
		});
	},

	send: function(qst){
		var qstdata = [];
		for(let i = 0; i < qst.length; ++i){
			qstdata[i] = {
				question: qst[i].questionText,
				answer_a: qst[i].answerA,
				answer_b: qst[i].answerB,
				answer_c: qst[i].answerC,
				answer_d: qst[i].answerD,
				correct:  qst[i].correct,
				tag: 	  qst[i].tag
			};
		}
		const url = '/qs/save';
		var data = { // convert to obj and send to db
			qst: qstdata
		};
		//send to server
		$.post(url, data, function(data, status){
			console.log("from server ", data);
		});

	}

	
 };