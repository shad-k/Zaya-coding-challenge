$(function() {
	var Data = {
		lessons: [
		{
			id : 1,
			title : "Lorem Ipsum",
			subject : "Math",
			grade : 2,
			noOfVideos : 1,
			noOfDocuments : 1,
			noOfQuestions : 2
		},
		{
			id : 2,
			title : "Advanced Lorem Ipsum",
			subject : "Math",
			grade : 2,
			noOfVideos : 1,
			noOfDocuments : 0,
			noOfQuestions : 1
		},
		{
			id : 3,
			title : "Lorem Ipsum",
			subject : "English",
			grade : 1,
			noOfVideos : 0,
			noOfDocuments : 1,
			noOfQuestions : 1
		},
		{
			id : 4,
			title : "Lorem Ipsum",
			subject : "Science",
			grade : 1,
			noOfVideos : 1,
			noOfDocuments : 1,
			noOfQuestions : 2
		},
		{
			id : 5,
			title : "Lorem Ipsum",
			subject : "Computers",
			grade : 2,
			noOfVideos : 1,
			noOfDocuments :1,
			noOfQuestions : 1
		}
	],
	topics: [],
	sendSubjects: function() {
		var subjects = [];
		this.lessons.forEach(function(lesson) {
			subjects.push(lesson.subject);
		});

		return subjects;
	},
	sendGrades: function() {
		var grades = [];
		this.lessons.forEach(function(lesson) {
			grades.push(lesson.grade);
		});

		return grades;
	},
	sendLessons: function() {
		return this.lessons;
	},
	saveTopic: function(topic) {
		var title = topic;
		var obj = {
			title: title,
			lessons: []
		};
		this.topics.push(obj);
	},
	saveLesson: function(topic, lessonId) {
		this.topics[topic - 1].lessons.push(lessonId);
		console.log(this.topics);
	},
	removeLesson: function(topic, lessonId) {
		var index = this.topics[topic - 1].lessons.indexOf(lessonId);
		console.log(index);
		this.topics[topic - 1].lessons.splice(index, 1);
		console.log(this.topics);
	}
};



var App = {
	init: function() {
		View.init();
	},
	getSubjects: function() {

		var subjects = Data.sendSubjects();

		var returnData = [];

		subjects.forEach(function(subject) {
			if(returnData.indexOf(subject) < 0) {
				returnData.push(subject);
			}
		});

		return returnData;
	},
	getGrade: function() {

		var grades = Data.sendGrades();

		var returnData = [];

		grades.forEach(function(grade) {
			if(returnData.indexOf(grade) < 0) {
				returnData.push(grade);
			}
		});

		return returnData;
	},
	getLessons: function() {
		return Data.sendLessons();
	},
	saveTopic: function(topic) {
		Data.saveTopic(topic);
	},
	addTopicLesson: function(topic, lessonId) {
		Data.saveLesson(topic, lessonId);
	},
	removeTopicLesson: function(topic, lessonId) {
		console.log(topic, lessonId)
		Data.removeLesson(topic, lessonId);
	},
	checkLessonId: function(topicId, lessonId) {
		if(Data.topics[topicId - 1].lessons.indexOf(lessonId) === -1) {
			return true;
		} else {
			return false;
		}
	}
};


var View = {
	// Initialization
	init: function() {
		let topic = 1;
		let self = this;

		// Set the dropdowns
		// Subject dropdown
		var subjects = App.getSubjects();

		subjects.forEach(function(subject) {
			$("#subject").append("<li>" + subject + "</li>");
		});

		// Grade dropdown
		var grades = App.getGrade();
		grades.sort();


		grades.forEach(function(grade) {
			$("#grade").append("<li>" + grade + "</li>");
		});

		// Show all the lessons in the data
		self.setLessons(App.getLessons());

		$("#subject li").click(self.filterSubject);
		$("#grade li").click(self.filterGrade);


		// Add first topic div
		self.addTopic(topic++);

		// Set event handlers for topic
		$(".rightSide").on("keypress", ".topicText", function(event) {
			if(event.keyCode === 13) {
				console.log("Add topic" + this.value);
				App.saveTopic(this.value);
			}
		});


		$(".lesson").draggable({
			helper: function(event) {
        		return $("<h2>" + $(this).find(".title").text() + "</h2>");
      		},
			scroll: false,
			appendTo: ".main",
			cursor: "move",
			revert: "invalid",
		});

		$(".rightSide").on("click", ".remove", function(event) {
			var parent = $(this).parent(".topicLesson");
			var lessonId = parent.attr("id");

			var topicId = parent.nextAll(".droppableDiv").attr("data-id");

			App.removeTopicLesson(topicId, lessonId);
			parent.remove();
		});

		$(".addTopic").click(function(){
			self.addTopic(topic++);
		});
	},
	setLessons: function(lessons) {
		$(".lessons").empty();
		lessons.forEach(function(lesson) {
			var html = '<div class="lesson col-xs-12" id='+ lesson.id + '><div class="col-xs-4 lessonImg">'
						+ '<img src="http://placeholder.pics/svg/200x150/3819FF-FF3F3F" alt="" class="col-xs-12 img-responsive">' +
						'</div><div class="lessonDetails col-xs-8">'
						+ '<h4 class="title col-xs-offset-1 col-xs-11">'+ lesson.title
						+ '</h4><hr class="hRule" /><span class="lessonSubject col-xs-offset-1 col-xs-6">'
						+ lesson.subject + '</span>'
						+ '<span class="lessonGrade col-xs-5">Grade ' + lesson.grade + '</span>'
						+ '<div class="col-xs-offset-1 col-xs-11 lessonContents">'
						+ '<span class="contents video">' + lesson.noOfVideos + '</span>'
						+ '<span class="glyphicon glyphicon-facetime-video"></span>'
						+ '<span class="contents file">' + lesson.noOfDocuments + '</span>'
						+ '<span class="glyphicon glyphicon-file"></span>'
						+ '<span class="contents quiz">' + lesson.noOfQuestions + '</span>'
						+ '<span class="glyphicon glyphicon-question-sign"></span>'
						+ '</div><!-- lessonContents -->'
						+ '</div><!-- lessonDetails -->'
						+ '</div><!-- lesson -->';
			$(".lessons").append(html);
		});
	},
	filterSubject: function(event) {
		var target = $(event.target);
		var subject = target.text();
		$(".subject").html(subject + '<span class="caret"></span>');

		if(subject !== "All") {
			$(".lesson").each(function(lesson) {
				var lessonSubject = $(this).find(".lessonSubject").text();
				if(lessonSubject !== subject) {
					$(this).hide();
				} else {
					$(this).show();
				}
			});
		} else {
			$(".lesson").show();
		}
	},
	filterGrade: function(event) {
		var target = $(event.target);
		var grade = target.text();
		$(".grade").html(grade + '<span class="caret"></span>');

		if(grade !== "All") {
			grade = "Grade " + target.text();
			$(".lesson").each(function(lesson) {
				var lessonGrade = $(this).find(".lessonGrade").text();
				if(lessonGrade !== grade) {
					$(this).hide();
				} else {
					$(this).show();
				}
			});
		} else {
			$(".lesson").show();
		}
	},
	addTopic: function(topic) {
		var html = '<div class="topic col-xs-12">'
					+ '<div class="topicNo col-xs-1 text-center">' + topic + '</div>'
					+ '<div class="col-xs-10 topicBody">'
					+ '<input type="text" class="topicText form-control" placeholder="Write topic and press Enter">'
					+ '<div class="droppableDiv" data-id="' + topic
					+ '" id="topic' + topic + '">'
					+ '<span class="divPlaceholder">Add Lessons</span>'
					+ '</div>'
					+ '</div>'
					+ '</div>';
		$(".topics").append(html);

		$("#topic" + topic).droppable({
			drop: function(event, ui) {
				var eventTarget = event.target;
				var topicId = $(eventTarget).attr("data-id");

				var target = ui.draggable[0];
				var id = $(target).attr("id");

				var topicName = $(eventTarget).parent().find(".topicText").val();

				if(!topicName) {
					alert("First enter the Topic name");
				} else if(!App.checkLessonId(topicId, id)){
					alert("This lesson is already added to the topic");
				} else {

					var img = $(target).find("img").attr("src");

					var title = $(target).find(".title").text();



					var html = '<div class="topicLesson" id=' + id + '>'
							   + '<img class="topicLessonImg" src="' + img + '">'
							   + '<h5 class="topicLessonTitle">' + title + '</h5>'
							   + '<span class="glyphicon glyphicon-remove-circle remove"></span></div>';

					$(eventTarget).before(html);

					App.addTopicLesson(topicId, id);
				}
			},
			activate: function() {
				console.log("Start");
				var scrollPosition = $(".rightSide").offset().top;
				console.log(scrollPosition);
				$(window).scrollTop(scrollPosition);
			},
			deactivate: function() {
				$(window).scrollTop(0);
			}
		});
	}
};

App.init();

});