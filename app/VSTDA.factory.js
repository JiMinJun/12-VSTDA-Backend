(function() {
    'use strict';

    angular
        .module('VSTDApp')
        .factory('VSTDAFactory', [
    	'$http',
    	'$q',
	    function VSTDAFactory($http, $q) {
	    	var vstdaUrl = 'http://localhost:54111/api/VSTDAEntries'

//get ToDo activates upon load
	        function getToDoData() {
	        	var defer = $q.defer();

	        	$http({
	        		method: 'GET',
	        		url: vstdaUrl
	        	}).then(function (response) {
	        		defer.resolve(response);
	        	}),function(error) {
	        		defer.reject(error);
	        		toastr.error('error: ' + error.data + '<br/>status: ' + error.statusText);
	        	}

	        	return defer.promise;
	        };

//add new ToDoItem
	        function addToDoData(newToDoEntry) {
	        	var defer = $q.defer();
	        	
	        	$http ({
	        		method: "POST",
	        		url: vstdaUrl,
	        		data: newToDoEntry
	        	}).then(function(response) {
	        		defer.resolve(response);
	        	}),function(error) {
	        		defer.reject(error);
	        		toastr.error('error: ' + error.data + '<br/>status: ' + error.statusText);
	        	}
	        	return defer.promise;
	        };

//delete tododata
	        function deleteToDoData(todoId) {
	        	var defer = $q.defer();
	        	$http({
	        		method: 'DELETE',
	        		url: vstdaUrl + '/' + todoId,
	        		data: todoId
	        	}).then (function (response) {
	        		defer.resolve(response);
	        		},function(error) {
	        		toastr.error('error: ' + error.data + '<br/>status: ' + error.statusText);
	             	})

	        	return defer.promise;
	        };

//update tododata
			function saveToDoData(todo) {

				var defer = $q.defer();
				$http({
					method: "PUT",
					url: vstdaUrl + '/' + todo.vstdaEntryId,
					data: todo
				}).then (function (response) {
					defer.resolve(response.config.data);	
				},function(error) {
					toastr.error('error: ' + error.data + '<br/>status: ' + error.statusText);
				})

				return defer.promise;
			};
	        return {
	            getToDoData: getToDoData,
	            addToDoData: addToDoData,
	            deleteToDoData: deleteToDoData,
	            saveToDoData: saveToDoData
	        };
	    }]);
})();