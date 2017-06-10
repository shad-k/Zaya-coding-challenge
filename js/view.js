// This module represents all the interactive/visual elements of the app
var View = (function() {
	// Initialization
	var init = function() {
		var topic = 1;

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
		setLessons(App.getLessons());

		// Add event handlers for filtering lessons
		$("#subject li").click(filterSubject);
		$("#grade li").click(filterGrade);

		// Add first topic div
		addTopic(topic++);

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
			addTopic(topic++);
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

		$(".searchBar").on("keyup", function(event) {
			filter();
		});
	};

	// Add the lessons to the View
	var setLessons = function(lessons) {
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
	};

	// Set the dropdown text to the current selected and call filter()
	var filterSubject = function(event) {
		var target = $(event.target);
		var subject = target.text();
		$(".subject").html(subject + ' <span class="caret"></span>');

		filter();
	};

	// Set the dropdown text to the current selected and call filter()
	var filterGrade = function(event) {
		var target = $(event.target);
		var grade = target.text();
		$(".grade").html(grade + ' <span class="caret"></span>');

		filter();
	};

	// Filter the lessons on the basis of the filters applied
	var filter = function() {
		var subject = $(".subject").text().trim();

		var grade = $(".grade").text().trim();
		grade = "Grade " + grade;

		var query = $(".searchBar").val();

		// If all the subjects and grades are selected
		// OR
		// each time a filter other than "All" is applied
		// show all the lessons
		$(".lesson").show();

		$(".lesson").each(function(lesson) {
			var title = $(this).find(".title").text();
			if(title.includes(query)) {
				$(this).show();
			}
			else {
				$(this).hide();
			}
		});

		// If subject is to be filtered
		if(subject !== "All" && subject !== "Subject") {
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
		if(grade !== "Grade All" && grade !== "Grade Grade") {
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
	};

	// Add a new topic div and apply proper ids
	var addTopic = function(topic) {
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
	};

	return {
		init: init
	};
})();