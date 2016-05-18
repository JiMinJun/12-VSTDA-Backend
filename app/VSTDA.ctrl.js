(function() {
    'use strict';

    angular
        .module('VSTDApp')
        .controller('VSTDACtrl', [
        'VSTDAFactory',
        '$filter',
        'toastr',

	    function VSTDACtrl(VSTDAFactory, $filter, toastr) {
	        var vm = this;
	        vm.title = 'VSTDACtrl';	        

	        ////////////////
//get ToDoData. called on activate
	        vm.getToDo = function() {
	        	VSTDAFactory.getToDoData().then(function (response) {
	        		vm.toDoList = response.data;
	        	});
	        };

//add new ToDo. throws error if already exists
	        vm.addToDo = function(newToDo) {
	        	//if no description is provided do not add item
	        	if (!newToDo.description ) {
	        		alert("Please provide a description of the ToDo item you want to add.");
	        		return;
	        	}
	        	//if same todItem already exists to not add item
	        	var duplicate = false;
        		vm.toDoList.forEach(function(todo) {
        			if(newToDo.description == todo.description) {
        				alert("This item already exists");
        				duplicate = true;
        			}
        		})
        		if (duplicate === true) {
        			return;
        		}	

	        	newToDo.CreatedTime = moment().format('YYYY-MM-DD h:mm:ss a');

	        	VSTDAFactory.addToDoData(newToDo).then(function (response) {
	        		vm.toDoList.push(response.data);
	        		console.log(vm.toDoList);
	        	}),function(error) {
	        		console.log(error);
	        		alert("There was an error adding the newToDo item");
	        	};
	        	vm.newToDo = {};
	        };

//delete todo
	        vm.deleteToDo = function(todo, index) {
	        	VSTDAFactory.deleteToDoData(todo.vstdaEntryId)
	        	.then(function (response) {
	        		vm.toDoList.splice(index, 1);
	        		console.log(response);
	        		toastr.success('"'+ response.data.description + '"' + " was deleted");	        	
	        	},function(error) {
	        		toastr.warning("This item could not be deleted. Please try again later");
	        		console.log(error);
	        	});
	        };

//updated todo
	        vm.saveToDo = function (todo) {

	        	if (!todo.updatedDescription) {
	        		todo.updatedDescription = todo.description;
	        	}

	        	if (!todo.updatedPriority) {
	        		todo.updatedPriority = 0;
	        	}

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
	        			todo.updatedDescription = null;
	        			todo.updatedPriority = null;
	        		});
	        	});
	        };

/*	        vm.completedItem = function (todo) {
	        	todo.oldPriority = todo.priority;
	        	todo.updatedPriority = 9;
	        	vm.saveToDo(todo);
	        }*/
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
	    }])
})();