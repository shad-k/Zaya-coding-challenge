/* This file contains the JavaScript code for the app.
 * The file contains three object literals representing the various
 * parts of the app; Data, App and View.
 */
$(function() {
	// This object represents the data in the app
	var Data = {
		// This array contains the JSON for the lesson data
		lessons: [
		{
			id : 1,
			title : "Lorem Ipsum",
			subject : "Math",
			grade : 1,
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
	// This array will contain all the topics created
	topics: [],
	// Extract all the subjects out of lessons array and send to the app
	sendSubjects: function() {
		var subjects = [];
		this.lessons.forEach(function(lesson) {
			subjects.push(lesson.subject);
		});

		return subjects;
	},
	// Extract all the grades out of lessons array and send to the app
	sendGrades: function() {
		var grades = [];
		this.lessons.forEach(function(lesson) {
			grades.push(lesson.grade);
		});

		return grades;
	},
	// Return the lessons array to display on the left side
	sendLessons: function() {
		return this.lessons;
	},
	// Add a new topic to the topics array
	saveTopic: function(topic) {
		var title = topic;
		// Create an object literal for the new topic
		var obj = {
			title: title,
			lessons: []
		};

		// Push the new object literal into the topics array
		this.topics.push(obj);
	},
	// Add a new lesson to a particular topic
	saveLesson: function(topic, lessonId) {
		// Access the topic at the topicId and push the new lesson
		// into its lessons array
		this.topics[topic - 1].lessons.push(lessonId);
	},
	// Remove a lesson from the lesson array
	removeLesson: function(topic, lessonId) {
		// Find the lesson's index in the lessons array
		var index = this.topics[topic - 1].lessons.indexOf(lessonId);
		// and delete it
		this.topics[topic - 1].lessons.splice(index, 1);
	},
	removeTopic: function(topicId) {
		// Delete the removed topic from the topics array
		this.topics.splice(topicId - 1, 1);
	}
};


// This object literal represents the app
// It initializes the app and handles all the interactions between Data and View
var App = {
	// Initialize the app
	init: function() {
		// Initialize the view
		View.init();
	},
	// Retrieve the subjects from the Data and send it to the View
	getSubjects: function() {

		var subjects = Data.sendSubjects();

		var returnData = [];
		// Filter duplicate values
		subjects.forEach(function(subject) {
			if(returnData.indexOf(subject) < 0) {
				returnData.push(subject);
			}
		});

		// Send to the View
		return returnData;
	},
	// Retrieve the grades from the Data and send it to the View
	getGrade: function() {

		var grades = Data.sendGrades();

		var returnData = [];

		// Filter duplicate values
		grades.forEach(function(grade) {
			if(returnData.indexOf(grade) < 0) {
				returnData.push(grade);
			}
		});

		// Send to the View
		return returnData;
	},
	// Get all the lessons from Data and return to the View to display
	getLessons: function() {
		return Data.sendLessons();
	},
	// Add a new topic
	saveTopic: function(topic) {
		Data.saveTopic(topic);
	},
	// Add a lesson to a topic
	addTopicLesson: function(topic, lessonId) {
		Data.saveLesson(topic, lessonId);
	},
	// Remove a lesson from a topic
	removeTopicLesson: function(topic, lessonId) {
		Data.removeLesson(topic, lessonId);
	},
	// Check whether a lesson already exists
	// If it does tell the View not to add it and give an error to the user
	checkLessonId: function(topicId, lessonId) {
		if(Data.topics[topicId - 1].lessons.indexOf(lessonId) === -1) {
			return true;
		} else {
			return false;
		}
	},
	removeTopic: function(topicId) {
		Data.removeTopic(topicId);
	}
};

// This object literal represents all the interactive/visual elements of the app
var View = {
	// Initialization
	init: function() {
		let topic = 1;

		// Save the value of this
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

		// Add event handlers for filtering lessons
		$("#subject li").click(self.filterSubject);
		$("#grade li").click(self.filterGrade);

		// Add first topic div
		self.addTopic(topic++);

		// Set event handlers for topic
		$(".rightSide").on("keypress", ".topicText", function(event) {
			if(event.keyCode === 13) {
				App.saveTopic(this.value);
			}
		});

		// Set the lesson div draggable using jquery-ui
		$(".lesson").draggable({
			// Specify a custom visual feedback for the dragged element
			helper: function(event) {
        		return $("<h2>" + $(this).find(".title").text() + "</h2>");
      		},
			scroll: false,
			appendTo: ".main",
			cursor: "move",
			revert: "invalid",
		});

		// Event handler for click event on the remove button
		$(".rightSide").on("click", ".remove", function(event) {
			var parent = $(this).parent(".topicLesson");
			var lessonId = parent.attr("id");

			var topicId = parent.nextAll(".droppableDiv").attr("data-id");
			// Remove the lesson from the topic in the topics array of Data
			App.removeTopicLesson(topicId, lessonId);
			// Remove the lesson from the DOM
			parent.remove();
		});

		// Click event handler for add event on the addTopic button
		$(".addTopic").click(function(){
			// Add a new topic div
			self.addTopic(topic++);
		});

		// Click event handler for the remove topic button
		$(".topics").on("click", ".removeTopic", function(event) {
			var topicDiv = $(this).parents(".topic");
			var topicId = topicDiv.find(".droppableDiv").attr("data-id");

			// Tell the app to remove the topic from the data
			App.removeTopic(topicId);
			topicDiv.remove();
			topic--;
		});
	},
	// Add the lessons to the View
	setLessons: function(lessons) {
		$(".lessons").empty();
		// For each lesson construct the html and add to the View
		lessons.forEach(function(lesson) {
			var html = '<div class="lesson col-xs-12" id='+ lesson.id + '><div class="col-xs-4 lessonImg">'
						+ '<img src="images/placeholder.png" alt="" class="col-xs-12 img-responsive">' +
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
	// Set the dropdown text to the current selected and call filter()
	filterSubject: function(event) {
		var target = $(event.target);
		var subject = target.text();
		$(".subject").html(subject + ' <span class="caret"></span>');

		View.filter();
	},
	// Set the dropdown text to the current selected and call filter()
	filterGrade: function(event) {
		var target = $(event.target);
		var grade = target.text();
		$(".grade").html(grade + ' <span class="caret"></span>');

		View.filter();
	},
	// Filter the lessons on the basis of the filters applied
	filter: function() {
		var subject = $(".subject").text().trim();

		var grade = $(".grade").text().trim();
		grade = "Grade " + grade;

		// If all the subjects and grades are selected
		// OR
		// each time a filter other than "All" is applied
		// show all the lessons
		$(".lesson").show();

		// If subject is to be filtered
		if(subject !== "All") {
			$(".lesson").each(function(lesson) {
				// Find the subject of the current lesson
				var lessonSubject = $(this).find(".lessonSubject").text();
				// Check if the subject is the same as that selected
				if(lessonSubject !== subject) {
					// And hide those that do not match
					$(this).hide();
				}
			});
		}

		// If grade is to be filtered
		if(grade !== "Grade All") {
			// Run the callback function on all the visible lessons
			// That is those not filtered out by the subject filter
			$(".lesson:visible").each(function(lesson) {
				// Find the grade of the current lesson
				var lessonGrade = $(this).find(".lessonGrade").text();
				// Check if the grade is the same as that selected
				if(lessonGrade !== grade) {
					// And hide those that do not match
					$(this).hide();
				}
			});
		}
	},
	// Add a new topic div and apply proper ids
	addTopic: function(topic) {
		var html = '<div class="topic col-xs-12">'
					+ '<div class="topicNo col-xs-1 text-center">' + topic + '</div>'
					+ '<div class="col-xs-9 topicBody">'
					+ '<input type="text" class="topicText form-control" placeholder="Write topic and press Enter">'
					+ '<div class="droppableDiv" data-id="' + topic
					+ '" id="topic' + topic + '">'
					+ '<span class="divPlaceholder">Add Lessons</span>'
					+ '</div>'
					+ '</div>'
					+ '<div class="col-xs-1 col-xs-offset-1">'
					+ '<span class=" text-center glyphicon glyphicon-remove-circle removeTopic ">'
					+ '</span>'
					+ '</div>'
					+ '</div>';
		$(".topics").append(html);

		// Mark the topic droppableDiv as a droppable element
		$("#topic" + topic).droppable({
			// Provide an event handler for the drop event
			drop: function(event, ui) {
				// eventTarget = droppableDiv where drop is being done
				var eventTarget = event.target;
				var topicId = $(eventTarget).attr("data-id");

				// target = lesson being dragged
				var target = ui.draggable[0];
				var id = $(target).attr("id");


				var topicName = $(eventTarget).parent().find(".topicText").val();

				if(!topicName) {
					// If topic name is not provided show an error to the user
					alert("First enter the Topic name");
				} else if(!App.checkLessonId(topicId, id)){
					// Check if the lesson has already been added
					// If yes show an error to the user
					alert("This lesson is already added to the topic");
				} else {
					// If the lesson has not already been added
					// Extract the value of image source and title from
					// the lesson being dropped
					var img = $(target).find("img").attr("src");

					var title = $(target).find(".title").text();


					// Add a lesson div under the specific topic
					var html = '<div class="topicLesson" id=' + id + '>'
							   + '<img class="topicLessonImg" src="' + img + '">'
							   + '<h5 class="topicLessonTitle">' + title + '</h5>'
							   + '<span class="glyphicon glyphicon-remove-circle remove"></span></div>';
					$(eventTarget).before(html);

					// Add the lesson to the topic in the Data
					App.addTopicLesson(topicId, id);
				}
			},
			// If the app is accessed on a device other than desktop,
			// scroll down to the droppable topic div as soon drag starts
			activate: function() {
				var scrollPosition = $(".rightSide").offset().top;
				$(window).scrollTop(scrollPosition);
			},
			// When the drop is finished on a device other than desktop
			// scroll back to the list of lessons
			deactivate: function() {
				$(window).scrollTop(0);
			}
		});
	}
};

// Initialize the app once the page has been loaded
App.init();

});