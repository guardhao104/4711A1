var UserView = function (model) {
    this.model = model;
	this.easyEvent = new Event(this);
	this.hardEvent = new Event(this);
	this.submitEvent = new Event(this);
	this.diffecult = 0;
	this.user;
	this.database = firebase.database();

    this.init();
};

UserView.prototype = {

    init: function () {
        this.createChildren()
            .setupHandlers()
            .enable();
		//this.buildQuestion();
		$("#btn-container").hide();
		firebase.auth().onAuthStateChanged(function(user) {
			if (user) {
			this.user = user;
			  var displayName = user.displayName;
			  var email = user.email;
			  var emailVerified = user.emailVerified;
			  var photoURL = user.photoURL;
			  var isAnonymous = user.isAnonymous;
			  var uid = user.uid;
			  var providerData = user.providerData;
			  $("#user-welcome").html("Welcome! " + email);
			} else {
				window.location.href="login.html";
			}
		}.bind(this));
    },

    createChildren: function () {
        // cache the document object
		this.$easy = $("#btn-easy");
		this.$hard = $("#btn-hard");
		this.$submit = $("#btn-submit");

        return this;
    },

    setupHandlers: function () {
	
		this.easyButtonHandler = this.easyButton.bind(this);
		this.hardButtonHandler = this.hardButton.bind(this);
		this.submitButtonHandler = this.submitButton.bind(this);

        /**
        Handlers from Event Dispatcher
        */

		this.easyHandler = this.easy.bind(this);
		this.hardHandler = this.hard.bind(this);
		this.submitHandler = this.submit.bind(this);

        return this;
    },

    enable: function () {

		this.$easy.click(this.easyButtonHandler);
		this.$hard.click(this.hardButtonHandler);
		this.$submit.click(this.submitButtonHandler);

        /**
         * Event Dispatcher
         */

		this.model.easyEvent.attach(this.easyHandler);
		this.model.hardEvent.attach(this.hardHandler);
		this.model.submitEvent.attach(this.submitHandler);

        return this;
    },
	
	easyButton: function () {
		this.easyEvent.notify();
	},
	
	hardButton: function () {
		this.hardEvent.notify();
	},
	
	submitButton: function () {
		this.submitEvent.notify();
	},

	hideInitContainer: function() {
		$("#init-container").hide();
	},
	
	showBtnContainer: function() {
		$("#btn-container").show();
	},
	
	buildQuestion: function (diffecult) {
		$("#alert-message").remove();
		if (diffecult === 1) {
			var tag = "easy";
		} else if (diffecult === 2) {
			var tag = "hard";
		} else {
			return -1;
		}
		var num = this.model.getNumber();
		var quiz = this.model.getQuestions();
		for (let i=0; i<num; i++) {
			if (quiz[i].tag === tag) {
				$( "#text-container" ).append(" \
				<div class='question-block' id='block"+i+"'>\
				  <hr>\
					<p class='lead' id='q"+i+"-text'>"+quiz[i].questionText+"</p>\
					<input type='radio' name='q"+i+"' id='q"+i+"a'>\
					<label id='q"+i+"0'>"+quiz[i].answerA+"</label><br>\
					<input type='radio' name='q"+i+"' id='q"+i+"b'>\
					<label id='q"+i+"1'>"+quiz[i].answerB+"</label><br>\
					<input type='radio' name='q"+i+"' id='q"+i+"c'>\
					<label id='q"+i+"2'>"+quiz[i].answerC+"</label><br>\
					<input type='radio' name='q"+i+"' id='q"+i+"d'>\
					<label id='q"+i+"3'>"+quiz[i].answerD+"</label>\
				</div>\
			");
			}
		}

    },
	
	markQuestions: function (diffecult) {
		if (diffecult === 1) {
			var tag = "easy";
		} else if (diffecult === 2) {
			var tag = "hard";
		} else {
			return -1;
		}
		var num = this.model.getNumber();
		var quiz = this.model.getQuestions(); 
		var answer = this.model.getAnswers();
		var correct = 0;
		var quiznum = 0;
		for (let i=0; i<num; i++) {		
			if (quiz[i].tag === tag) {
				quiznum++;
				let radio = $("input[type='radio'][name='q"+i+"']");
				let index = radio.index(radio.filter(':checked'));
				if (index != answer[i]) {
					$("#block"+i).addClass("alert alert-danger");
					$("#q"+i+index).css('color', 'red');
					$("#q"+i+answer[i]).css('color', 'blue');
				} else {
					correct++;
					$("#block"+i).removeClass("alert alert-danger");
					for (let j=0; j<4; j++) {
						$("#q"+i+j).css('color', 'black');
					}
				}
			}
		}
		this.model.setScore(correct);
		this.model.setQuizNum(quiznum);
	},
	
	showResult: function () {
		$("#alert-message").remove();
		$("#alert-message-div").prepend(" \
			<div id='alert-message' class='container alert alert-success' role='alert'>\
			  <h4 class='alert-heading'>Successfully submitted!</h4>\
			  <p>Your final score is "+this.model.getScore()+" / "+this.model.getQuizNum()+"!</p>\
			</div>\
		");

		window.scrollTo(0,0);
	},
	
	showWarning: function () {
		$("#alert-message").remove();
		$("#alert-message-div").prepend(" \
			<div id='alert-message' class='container alert alert-danger' role='alert'>\
			  <h4 class='alert-heading'>Failed to read data!</h4>\
			  <p>There is no data in this selection or in our back-end database! Please check the storage and then refresh.</p>\
			</div>\
		");
	},

	writeRankData: function(userID, email, score) {
		this.database.ref('users/' + userID).set({
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

    /* -------------------- Handlers From Event Dispatcher ----------------- */
	
	easy: function () {
		this.model.setDiffecult(1);
		if (this.model.chkData() == 1) {
			this.hideInitContainer();
			this.showBtnContainer();
			this.buildQuestion(this.model.getDiffecult());
		} else {
			this.showWarning();
		}
	},
	
	hard: function () {
		this.model.setDiffecult(2);
		if (this.model.chkData() == 1) {
			this.hideInitContainer();
			this.showBtnContainer();
			this.buildQuestion(this.model.getDiffecult());
		} else {
			this.showWarning();
		}
	},
	
	submit: function () {
		this.markQuestions(this.model.getDiffecult());
		this.showResult();
		this.writeRankData(this.user.uid, this.user.email, this.model.getScore());
	},

    /* -------------------- End Handlers From Event Dispatcher ----------------- */


};