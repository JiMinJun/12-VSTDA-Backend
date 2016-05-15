(function() {
    'use strict';

    angular
        .module('VSTDApp')
        .controller('VSTDACtrl', [
        'VSTDAFactory',
        '$filter',

	    function VSTDACtrl(VSTDAFactory, $filter) {
	        var vm = this;
	        vm.title = 'VSTDACtrl';
	        vm.newToDo = {};
	        

	        ////////////////
	        var getToDoData = function() {
	        	VSTDAFactory.getToDoData().then(function (response) {
	        		vm.toDoList = response.data;
	        		console.log(response.data);
	        	});
	        };

	        vm.addToDo = function(newToDo) {
	        	if (!newToDo.priority || !newToDo.description ) {
	        		alert("Please provide a description and priority of the ToDo item you want to add.");
	        		return;
	        	}
        		vm.toDoList.forEach(function(todo) {
        			if(newToDo.description == todo.description) {
        				alert("This item already exists");
        			}
        		})
        	
	        	newToDo.CreatedTime = moment().format('YYYY-MM-DD h:mm:ss a');
	        	VSTDAFactory.addToDoData(newToDo).then(function (response) {
	        		vm.toDoList.push(response.data);
	        		console.log(vm.toDoList);
	        	});
	        	vm.newToDo = {};
	        };

	        vm.deleteToDo = function(todo, index) {
	        	VSTDAFactory.deleteToDoData(todo.vstdaEntryId)
	        	.then(function (response) {
	        		vm.toDoList.splice(index, 1);	        	
	        	});
	        };

	        vm.saveToDo = function (todo) {
	        	if (!todo.updatedPriority) {
	        		todo.updatedPriority = todo.priority;
	        	}

	        	if (!todo.updatedTodo) {
	        		todo.updatedDescription = todo.description;
	        	}
	        	
	        	console.log(todo);
	        	var updatedTodo = {
	        		'vstdaEntryId' : todo.vstdaEntryId,
	        		'description' : todo.updatedDescription,
	        		'priority' : todo.updatedPriority,
	        		'createdTime' : todo.createdTime
	        	};

	        	VSTDAFactory.saveToDoData(updatedTodo)
	        	.then(function(response) {
	        		vm.toDoList.forEach(function(element) {
	        			if (response.vstdaEntryId == element.vstdaEntryId) {
	        				element.description = response.description;
	        				element.priority = response.priority;
	        			};
	        			vm.closeTable();
	        		});
	        	});
	        }
//order items
	vm.sortToDo = function (order) {
        vm.toDoList = $filter('orderBy')(vm.toDoList, order);
    };

	        

//closes the table when something else is clicked
	        vm.closeTable = function() {
		    	vm.toDoList.forEach(function(element) {
		    		element.isBeingEdited = false;
		    		element.description = element.description;
		    	});
    		};

		    vm.closeAllOtherItems = function(id) {
		    	vm.toDoList.forEach(function(element) {
		    		if(element.vstdaEntryId !== id) {
		    			element.isBeingEdited = false;
		    			element.titleProgress = element.description;
		    		}
		    	});
		    };

//upon page load
		    function activate() {
	        	getToDoData();
	        };

	        activate();
	    }])
})();