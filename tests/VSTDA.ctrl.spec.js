'use strict';

describe ("VSTDA controller tests", function() {

	beforeEach(module('VSTDApp'));
	var $scope;
	var $controller;
	var $q;
	var defer;
	var vm;
	var VSTDAFactory;

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
			}));
			it("should ")
		})

	})

})