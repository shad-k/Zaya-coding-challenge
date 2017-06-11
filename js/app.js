// This module represents the app
// It initializes the app and handles all the interactions between Data and View
var App = (function() {
	// Initialize the app
	var init = function() {
		// Initialize the view
		View.init();
	};

	// Retrieve the subjects from the Data and send it to the View
	var getSubjects = function() {

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
	};

	// Retrieve the grades from the Data and send it to the View
	var getGrade = function() {

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
	};

	// Get all the lessons from Data and return to the View to display
	var getLessons = function() {
		return Data.sendLessons();
	};

	// Add a new topic
	var saveTopic = function(topicId, topic) {
		Data.saveTopic(topicId, topic);
	};

	// Add a lesson to a topic
	var addTopicLesson = function(topic, lessonId) {
		Data.saveLesson(topic, lessonId);
	};

	// Remove a lesson from a topic
	var removeTopicLesson = function(topic, lessonId) {
		Data.removeLesson(topic, lessonId);
	};

	// Check whether a lesson already exists
	// If it does tell the View not to add it and give an error to the user
	var checkLessonId = function(topicId, lessonId) {
		return Data.checkLessonId(topicId, lessonId);
	};

	var removeTopic = function(topicId) {
		Data.removeTopic(topicId);
	};

	var addTopic = function(topicId) {
		Data.addTopic(topicId);
	}

	return {
		init: init,
		getSubjects: getSubjects,
		getGrade: getGrade,
		getLessons: getLessons,
		saveTopic: saveTopic,
		checkLessonId: checkLessonId,
		addTopicLesson: addTopicLesson,
		removeTopicLesson: removeTopicLesson,
		removeTopic: removeTopic,
		addTopic: addTopic
	};
})();