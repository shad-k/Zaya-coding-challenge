// This module represents the data in the app
var Data = (function() {
	// This array contains the JSON for the lesson data
	var lessons = [
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
			title : "Advanced English",
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
	];
	// This array will contain all the topics created
	var topics = [];

	// Extract all the subjects out of lessons array and send to the app
	var sendSubjects = function() {
		var subjects = [];
		lessons.forEach(function(lesson) {
			subjects.push(lesson.subject);
		});

		return subjects;
	};

	// Extract all the grades out of lessons array and send to the app
	var sendGrades = function() {
		var grades = [];
		lessons.forEach(function(lesson) {
			grades.push(lesson.grade);
		});

		return grades;
	};

	// Return the lessons array to display on the left side
	var sendLessons = function() {
		return lessons;
	};

	// Add a new topic to the topics array
	var saveTopic = function(topic) {
		var title = topic;
		// Create an object literal for the new topic
		var obj = {
			title: title,
			lessons: []
		};

		// Push the new object literal into the topics array
		topics.push(obj);
	};
	// Add a new lesson to a particular topic
	var saveLesson = function(topic, lessonId) {
		// Access the topic at the topicId and push the new lesson
		// into its lessons array
		topics[topic - 1].lessons.push(lessonId);
	};

	// Remove a lesson from the lesson array
	var removeLesson = function(topic, lessonId) {
		// Find the lesson's index in the lessons array
		var index = topics[topic - 1].lessons.indexOf(lessonId);
		// and delete it
		topics[topic - 1].lessons.splice(index, 1);
	};

	var removeTopic = function(topicId) {
		// Delete the removed topic from the topics array
		topics.splice(topicId - 1, 1);
	};

	var checkLessonId = function(topicId, lessonId) {
		if(topics[topicId - 1].lessons.indexOf(lessonId) === -1) {
			return true;
		} else {
			return false;
		}
	}

	return {
		sendSubjects: sendSubjects,
		sendGrades: sendGrades,
		sendLessons: sendLessons,
		saveTopic: saveTopic,
		checkLessonId: checkLessonId,
		saveLesson: saveLesson,
		removeLesson: removeLesson,
		removeTopic: removeTopic
	};
})();