'use strict';

describe("VSTDA Factory Tests", function() {
	var VSTDAFactory, $httpBackend, toastr;
	beforeEach(module("VSTDApp"));
	beforeEach(inject(function(_VSTDAFactory_, _$httpBackend_, _toastr_) {
		VSTDAFactory = _VSTDAFactory_;
		$httpBackend = _$httpBackend_;
		toastr = _toastr_;
		toastr = {
		      error: function (message, title, options) { },
		};
		spyOn(toastr, 'error');
	}));
	afterEach(function() {
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	}); 
	it("should get todo items", function() {
		$httpBackend
			.whenGET("http://localhost:54111/api/VSTDAEntries")
			.respond({description: 'eat dinner'});

		VSTDAFactory.getToDoData()
			.then(function(response) {
				expect(response.data).not.toBeUndefined();
				expect(response.status).toBe(200);
				expect(response.data).toEqual({description: 'eat dinner'});
			});
		$httpBackend.flush();
	});
	it("should not return any todo items and throw an error", function( ) {
		$httpBackend
			.whenGET("http://localhost:54111/api/VSTDAEntries")
			.respond(500);
		VSTDAFactory.getToDoData()
			.then(function() {
				expect(response.data).toBeUndefined();
				expect(response.status).toBe(500);
				expect(toastr.error).toHaveBeenCalled();
			});
		$httpBackend.flush();
	});
	it("should add a new todo item and return the item", function() {
		$httpBackend
			.whenPOST("http://localhost:54111/api/VSTDAEntries")
			.respond({description: 'eat dinner'});

		VSTDAFactory.addToDoData({description: 'eat dinner'})
			.then(function(response) {
				expect(response.data).not.toBeUndefined();
				expect(response.data).toEqual({description: 'eat dinner'});
				expect(response.status).toBe(200);
			})
		$httpBackend.flush();
	});
	it("should just return an error when post call does not work", function() {
		$httpBackend
			.whenPOST("http://localhost:54111/api/VSTDAEntries")
			.respond(400);

		VSTDAFactory.addToDoData({description: 'eat dinner'})
			.then(function(response) {
				expect(response.status).toBe(400);
				expect(response.data).toBeUndefined();
				expect(toastr.error).toHaveBeenCalled();
			});
		$httpBackend.flush();
	});
	it("should return the item that is being deleted", function() {
		$httpBackend
			.whenDELETE("http://localhost:54111/api/VSTDAEntries/2")
			.respond({description: 'eat dinner'});

		VSTDAFactory.deleteToDoData(2)
			.then(function(response) {
				expect(response.data).not.toBeUndefined();
				expect(response.status).toBe(200);
				expect(response.data).toEqual({description: 'eat dinner'});
			})
		$httpBackend.flush();
	});
	it("should throw an error", function() {
		$httpBackend
			.whenDELETE("http://localhost:54111/api/VSTDAEntries/2")
			.respond(404);

		VSTDAFactory.deleteToDoData(2)
			.then(function(response) {
				expect(response.data).toBeUndefined();
				expect(response.status).toBe(404);
				expect(toastr.error).toHaveBeenCalled();
			})
		$httpBackend.flush();
	});
	it("should return a sucess code", function() {
		$httpBackend
			.whenPUT("http://localhost:54111/api/VSTDAEntries/2")
			.respond({description: 'eat dinner', vstdaEntryId: 2});

		VSTDAFactory.saveToDoData({description: 'eat dinner', vstdaEntryId: 2})
			.then(function(response) {
				expect(toastr.error).not.toHaveBeenCalled();
				expect(response).toEqual({description: 'eat dinner', vstdaEntryId: 2});
			});
		$httpBackend.flush();
	})
	it("should return an error code", function() {
		$httpBackend
			.whenPUT("http://localhost:54111/api/VSTDAEntries/2")
			.respond(400);

		VSTDAFactory.saveToDoData({description: 'eat dinner', vstdaEntryId: 2})
			.then(function(response) {
				expect(response.status).toBe(400);
				expect(toastr.error).toHaveBeenCalled();
			})
		$httpBackend.flush();
	})

})
