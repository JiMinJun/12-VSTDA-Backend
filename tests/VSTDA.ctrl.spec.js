'use strict';

describe ("VSTDA controller tests", function() {

	beforeEach(module('VSTDApp'));
	var $scope;
	var $controller;
	var $q;
	var defer;
	var vm;
	var VSTDAFactory;
	var toastr;

//mock of factory
	describe ("mock of VSTDAFactory", function() {
		beforeEach(inject(function(_$rootScope_, _$controller_, _$q_, _VSTDAFactory_) {
			$scope = _$rootScope_.$new();
			$controller = _$controller_;
			$q = _$q_;	
			VSTDAFactory = _VSTDAFactory_;	
		}));

		//tests getToDoData
		describe ("get ToDoData", function () {
			beforeEach(inject(function() {
				defer = $q.defer();
				spyOn(VSTDAFactory, 'getToDoData').and.returnValue(defer.promise);	
				vm = $controller ('VSTDACtrl', {
					$scope: $scope,
					VSTDAFactory: VSTDAFactory
				});
			}));

			it("title should be VSTDACtrl", function() {
				expect(vm.title).toBe('VSTDACtrl');
			});

		//should succeed if given an array
			it("should return an array of todo items", function () {
				defer.resolve({data: [{description: 'unit test'}]});
				vm.getToDo();
				$scope.$apply();

				expect(vm.toDoList).not.toBe(undefined);
				expect(vm.toDoList).toEqual([{description: 'unit test'}]);
				expect(vm.toDoList[0].description).toBe('unit test');
			});

		//should fail if not given an object of arrays
			it("should fail if reseponse is not an array",  function() {
				defer.resolve({description: 'unit test'});
				$scope.$apply();
				expect(vm.toDoList).toBeUndefined();
			})

		//should fail if factory rejects the response
			it ("should fail if the get call is rejected by factory", function() {
				defer.reject();
				$scope.$apply();
				expect(vm.toDoList).toBeUndefined();
			})
		});

//tests addToTo
		describe("vm.addToDo tests", function() {
			beforeEach(inject(function() {
				defer = $q.defer();
				spyOn(VSTDAFactory, 'addToDoData').and.returnValue(defer.promise);
				vm = $controller('VSTDACtrl', {
					$scope: $scope,
					VSTDAFactory: VSTDAFactory
				});
				vm.toDoList= [];
			}));

			//if passed in an empty string it should not do anything
			it("the array should remain the same if it receives an empty description", function() {
				//todo item with no description
				var todo = {priority: 3}
				vm.addToDo(todo);
				//factory and all code after will never be reached
				expect(VSTDAFactory.addToDoData).not.toHaveBeenCalled();
				expect(vm.toDoList.length).toBe(0);
				expect(todo).not.toBe({});
				expect(todo).toBe(todo);		
			})
			//if todo item already exists. it should not do anything
			it("the array should remain the same if it receives a duplicate item", function() {
				//passing in duplicate items
				vm.toDoList = [{description: 'unit test'}];
				var todo = {description: 'unit test'};

				vm.addToDo(todo);
				//factory and all code after will never be reached
				expect(VSTDAFactory.addToDoData).not.toHaveBeenCalled();
				expect(vm.toDoList.length).toBe(1);

			})
			it("should be added to the todoList", function() {
				
				defer.resolve({data:{description: 'unit test'}});

				var todo = {description: 'unit test'};
				vm.addToDo(todo);

				$scope.$apply();

				expect(VSTDAFactory.addToDoData).toHaveBeenCalled();
				expect(vm.toDoList.length).toBe(1);
				expect(vm.toDoList[0]).toEqual({description: 'unit test'});
			})
			it('should not be added to the todolist', function() {
				defer.reject();

				var todo = {description: 'unit test'};
				vm.addToDo(todo);

				$scope.$apply();

				expect(VSTDAFactory.addToDoData).toHaveBeenCalled();
				expect(vm.toDoList.length).toBe(0);
			})
		});
		describe("the deleteToDo function tests", function () {
			beforeEach(inject(function() {
				defer = $q.defer();
				spyOn(VSTDAFactory, 'deleteToDoData').and.returnValue(defer.promise);
				
			    toastr = {
			      success: function (message, title, options) { },
			      warning: function (message, title, options) { }
			    };

			    spyOn(toastr, 'success');
			    spyOn(toastr, 'warning');
				vm = $controller('VSTDACtrl', {
					$scope: $scope,
					VSTDAFactory: VSTDAFactory,
					toastr: toastr
				});
			}))

			it("should delete the todo item from the todolist", function() {
				defer.resolve({data:{id:1, description:"unit test"}});
				vm.toDoList = [{id:1, description:"unit test"}];
				vm.deleteToDo(1, 0);
				$scope.$apply();

				expect(vm.toDoList).toEqual([]); 
				expect(toastr.success).toHaveBeenCalled();
			})
			it("should not delete the todoitem from the list", function() {
				defer.reject();
				vm.deleteToDo(1,0);
				$scope.$apply();
				expect(toastr.warning).toHaveBeenCalled();
			})
		})
		describe("the saveToDo function tests", function() {
			beforeEach(inject(function() {
				defer = $q.defer();
				spyOn(VSTDAFactory, 'saveToDoData').and.returnValue(defer.promise);

				vm = $controller('VSTDACtrl', {
					$scope: $scope;
					VSTDAFactory: VSTDAFactory 
				});
			}))
			it("should update the todo item", function() {
				var todo = {
					description: 'unit test',
					updatedDescription : null;
				}
				vm.saveToDo(todo);
				
			})
		})

	})

})