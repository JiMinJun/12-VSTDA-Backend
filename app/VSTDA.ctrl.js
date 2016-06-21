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
/*	        vm.toDoList = [];*/	        

	        ////////////////
//get ToDoData. called on activate
	        vm.getToDo = function() {
	        	VSTDAFactory.getToDoData().then(function (response) {
	        		vm.toDoList = response.data;
	        		vm.toDoList.forEach(function(todo) {
	        			todo.updatedPriority = todo.priority;
	        		});
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
        		});
        		if (duplicate === true) {
        			return;
        		}	

	        	newToDo.CreatedTime = moment().format('YYYY-MM-DD h:mm:ss a');

	        	VSTDAFactory.addToDoData(newToDo).then(function (response) {
	        		vm.toDoList.push(response.data);
	        	},function(error) {
	        		toastr.warning("There was an error adding the newToDo item");
	        	});
	        	vm.newToDo = {};
	        };

//delete todo
	        vm.deleteToDo = function(todo, index) {
	        	VSTDAFactory.deleteToDoData(todo.vstdaEntryId)
	        	.then(function (response) {
	        		vm.toDoList.splice(index, 1);
	        		toastr.success('"'+ response.data.description + '"' + " was deleted");	        	
	        	},function(error) {
	        		toastr.warning("This item could not be deleted. Please try again later");
	        	});
	        };

//updated todo
	        vm.saveToDo = function (todo) {
	        	if (!todo.updatedDescription) {
	        		todo.updatedDescription = todo.description;
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
	        				console.log(element);
	        				element.description = response.description;
	        				element.priority = parseInt(response.priority);
	        				element.updatedPriority = parseInt(response.priority);
	        			}
	        			todo.updatedDescription = null;
	        			vm.closeTable();		
	        		});
	        	},function() {
	        		toastr.warning("Could not save item. Please try again momentarily.");
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
		    	});
    		};

		    vm.closeAllOtherItems = function(id) {
		    	vm.toDoList.forEach(function(element) {
		    		if(element.vstdaEntryId !== id) {
		    			element.isBeingEdited = false;
		    		}
		    	});
		    };
	    }]);
})();