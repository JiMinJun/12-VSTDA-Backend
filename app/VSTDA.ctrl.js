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

	        ////////////////
//get ToDoData. called on activate
	        var getToDoData = function() {
	        	VSTDAFactory.getToDoData().then(function (response) {
	        		vm.toDoList = response.data;
	        	});
	        };

//add new ToDo. throws error if already exists
	        vm.addToDo = function(newToDo) {
	        	if (!newToDo.description ) {
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

//delete todo
	        vm.deleteToDo = function(todo, index) {
	        	VSTDAFactory.deleteToDoData(todo.vstdaEntryId)
	        	.then(function (response) {
	        		vm.toDoList.splice(index, 1);	        	
	        	});
	        };

//updated todo
	        vm.saveToDo = function (todo) {
	        	/*if (!todo.updatedPriority) {
	        		todo.updatedPriority = todo.priority;
	        	}*/

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

	        vm.completedItem = function (todo) {
	        	todo.oldPriority = todo.priority;
	        	todo.updatedPriority = 9;
	        	vm.saveToDo(todo);
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