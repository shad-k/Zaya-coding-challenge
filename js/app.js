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
	topics: [
	],
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
		var id = this.topics.length;
		var title = topic;
		var obj = {
			id: id,
			title: title
		};
		this.topics.push(obj);
		console.log(obj);
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
	addTopicLesson: function(topic, lessonTitle) {
		console.log(topic, lessonTitle);
	}
};


var View = {
	init: function() {
		let topic = 1;
		let self = this;
		self.setDropDowns();

		var lessons = App.getLessons();
		self.setLessons(lessons);

		$("#subject li").click(self.filterSubject);
		$("#grade li").click(self.filterGrade);
		self.addTopic(topic++);

		$(".lesson").draggable({
			helper: function(event) {
        		return $("<h2>" + $(this).find(".title").text() + "</h2>");
      		},
			scroll: false,
			appendTo: ".main",
			cursor: "move",
			revert: "invalid",
		});

		$(".addTopic").click(function(){
			self.addTopic(topic++);
		});
	},
	setDropDowns: function() {
		var subjects = App.getSubjects();

		subjects.forEach(function(subject) {
			$("#subject").append("<li>" + subject + "</li>");
		});

		var grades = App.getGrade();
		grades.sort();


		grades.forEach(function(grade) {
			$("#grade").append("<li>" + grade + "</li>");
		});
	},
	setLessons: function(lessons) {
		$(".lessons").empty();
		lessons.forEach(function(lesson) {
			var html = '<div class="lesson col-xs-12"><div class="col-xs-4 lessonImg">'
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
		$(".subject").html(target.text() + '<span class="caret"></span>');

		var lessons = App.getLessons();

		if(target.text() === "All") {
			View.setLessons(lessons);
		} else {
			var showLessons = [];
			lessons.forEach(function(lesson) {
				if(target.text() === lesson.subject) {
					showLessons.push(lesson);
				}
			});

			View.setLessons(showLessons);
		}
	},
	filterGrade: function(event) {
		var target = $(event.target);
		$(".grade").html(target.text() + '<span class="caret"></span>');

		var lessons = App.getLessons();

		if(target.text() === "All") {
			View.setLessons(lessons);
		} else {
			var showLessons = [];
			lessons.forEach(function(lesson) {
				if(target.text() == lesson.grade) {
					showLessons.push(lesson);
				}
			});

			View.setLessons(showLessons);
		}
	},
	addTopic: function(topic) {
		var html = '<div class="topic col-xs-12">'
					+ '<div class="topicNo col-xs-1 text-center">' + topic + '</div>'
					+ '<div class="col-xs-10 topicBody">'
					+ '<input type="text" class="topicText form-control" placeholder="Write topic and press Enter">'
					+ '<div class="droppableDiv" id="' + topic + '">'
					+ '<span class="divPlaceholder">Add Lessons</span>'
					+ '</div>'
					+ '</div>'
					+ '</div>';
		$(".topics").append(html);

		$(".topicText").unbind("keypress");

		$(".topicText").keypress(function(event) {
			if(event.keyCode === 13) {
				App.saveTopic(this.value);
			}
		});

		$(".droppableDiv").droppable({
			drop: function(event, ui) {
				var target = ui.draggable[0];
				var img = $(target).find("img").attr("src");

				var title = $(target).find(".title").text();

				var html = '<div class="topicLesson">'
						   + '<img class="topicLessonImg" src="' + img + '">'
						   + '<h5 class="topicLessonTitle">' + title + '</h5>'
						   + '<span class="removeTopicLesson glyphicon glyphicon-remove-circle"></span>';

				$(event.target).before(html);

				App.addTopicLesson($(event.target).attr("id"), title);
			}
		});
	}
};

App.init();

});