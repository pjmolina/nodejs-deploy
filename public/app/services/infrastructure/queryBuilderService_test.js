describe('QueryBuilderService', function(){

  	beforeEach(angular.mock.module("myApp"));

	describe('buildBaucisQuery', function() {
		it('buildBaucisQuery build page=0 & pageSize=3',  inject(function(QueryBuilderService) { 
			expect(QueryBuilderService.buildBaucisQuery({ page: 0, pageSize: 3})).toEqual('?limit=3');
		}));
		it('buildBaucisQuery build page=3 & pageSize=4',  inject(function(QueryBuilderService) { 
			expect(QueryBuilderService.buildBaucisQuery({ page: 3, pageSize: 4})).toEqual('?skip=8&limit=4');
		}));
		it('buildBaucisQuery build sort=id -a',  inject(function(QueryBuilderService) { 
			expect(
				QueryBuilderService.uriDecode(QueryBuilderService.buildBaucisQuery({ 
					sort: {
						id : true,
						a  : false
					},
					paginate: false
				}))
			).toEqual('?sort=id -a');
		}));
		it('buildBaucisQuery build conditions={a:b}',  inject(function(QueryBuilderService) { 
			expect(
				QueryBuilderService.uriDecode(QueryBuilderService.buildBaucisQuery({ 
					criteria: "{a:b}",
					paginate: false
				}))
			).toEqual('?conditions={a:b}');
		}));
		it('buildBaucisQuery build select=a b',  inject(function(QueryBuilderService) { 
			expect(
				QueryBuilderService.uriDecode(QueryBuilderService.buildBaucisQuery({ 
					select: "a b",
					paginate: false
				}))
			).toEqual('?select=a b');
		}));
		it('buildBaucisQuery build count',  inject(function(QueryBuilderService) { 
			expect(
				QueryBuilderService.uriDecode(QueryBuilderService.buildBaucisQuery({ count: true}))
			).toEqual('?count=true');
		}));
	});

	describe('andBuild', function() {
		it('andBuild empty list',  inject(function(QueryBuilderService) { 
			expect(QueryBuilderService.andBuild([])).toEqual(null);
		}));
		it('andBuild 1 item',  inject(function(QueryBuilderService) { 
			expect(QueryBuilderService.andBuild(['clause1'])).toEqual('clause1');
		}));
		it('andBuild 2 items',  inject(function(QueryBuilderService) { 
			expect(QueryBuilderService.andBuild(['a', 'b'])).toEqual('{"$and":[a,b]}');
		}));
		it('andBuild 3 items',  inject(function(QueryBuilderService) { 
			expect(QueryBuilderService.andBuild(['a', 'b', 'c'])).toEqual('{"$and":[a,b,c]}');
		}));
		it('andBuild 5 items, 2 nulls',  inject(function(QueryBuilderService) { 
			expect(QueryBuilderService.andBuild(['a', null, 'b', null, 'c'])).toEqual('{"$and":[a,b,c]}');
		}));
	});

	describe('orBuild', function() {
		it('orBuild empty list',  inject(function(QueryBuilderService) { 
			expect(QueryBuilderService.orBuild([])).toEqual(null);
		}));
		it('orBuild 1 item',  inject(function(QueryBuilderService) { 
			expect(QueryBuilderService.orBuild(['clause1'])).toEqual('clause1');
		}));
		it('orBuild 2 items',  inject(function(QueryBuilderService) { 
			expect(QueryBuilderService.orBuild(['a', 'b'])).toEqual('{"$or":[a,b]}');
		}));
		it('orBuild 3 items',  inject(function(QueryBuilderService) { 
			expect(QueryBuilderService.orBuild(['a', 'b', 'c'])).toEqual('{"$or":[a,b,c]}');
		}));
		it('orBuild 5 items, 2 nulls',  inject(function(QueryBuilderService) { 
			expect(QueryBuilderService.orBuild(['a', null, 'b', null, 'c'])).toEqual('{"$or":[a,b,c]}');
		}));
	});

	describe('buildStringExactMatch', function() {
		it('buildStringExactMatch prop1 = text2',  inject(function(QueryBuilderService) { 
			expect(QueryBuilderService.buildStringExactMatch('prop1', 'text2')).toEqual('{"prop1":"text2"}');
		}));
	});

	describe('buildExactMatch', function() {
		it('buildExactMatch prop1 = 12',  inject(function(QueryBuilderService) { 
			expect(QueryBuilderService.buildExactMatch('prop1', 12)).toEqual('{"prop1":12}');
		}));
		it('buildExactMatch prop1 = true',  inject(function(QueryBuilderService) { 
			expect(QueryBuilderService.buildExactMatch('prop1', true)).toEqual('{"prop1":true}');
		}));
		it('buildExactMatch prop1 = null',  inject(function(QueryBuilderService) { 
			expect(QueryBuilderService.buildExactMatch('prop1', null)).toEqual('{"prop1":null}');
		}));
	});

	describe('buildBaucisQuery-like', function() {
		it('buildBaucisQuery abc no-fields',  inject(function(QueryBuilderService) { 
			expect(
				QueryBuilderService.uriDecode(QueryBuilderService.buildBaucisQuery({ 
					searchText: "abc",
					paginate: false 
				}))
			).toEqual('');
		}));
		it('buildBaucisQuery 1 field string abc',  inject(function(QueryBuilderService) { 
			expect(
				QueryBuilderService.uriDecode(QueryBuilderService.buildBaucisQuery({
					searchText: "abc",
					fields: [
						{ name: "t1", type: "string" }
					],
					paginate: false
				}))
			).toEqual('?conditions={"t1":{"$regex":"abc","$options":"i"}}');
		}));
		it('buildBaucisQuery 1 field string 15',  inject(function(QueryBuilderService) { 
			expect(
				QueryBuilderService.uriDecode(QueryBuilderService.buildBaucisQuery({
					searchText: "15",
					fields: [
						{ name: "t1", type: "string" }
					],
					paginate: false 
				}))
			).toEqual('?conditions={"t1":{"$regex":"15","$options":"i"}}');
		}));
		it('buildBaucisQuery 1 field string true',  inject(function(QueryBuilderService) { 
			expect(
				QueryBuilderService.uriDecode(QueryBuilderService.buildBaucisQuery({
					searchText: "true",
					fields: [
						{ name: "t1", type: "string" }
					],
					paginate: false 
				}))
			).toEqual('?conditions={"t1":{"$regex":"true","$options":"i"}}');
		}));
		it('buildBaucisQuery 1 field number abc',  inject(function(QueryBuilderService) { 
			expect(
				QueryBuilderService.uriDecode(QueryBuilderService.buildBaucisQuery({
					searchText: "12",
					fields: [
						{ name: "n1", type: "number" }
					],
					paginate: false
				}))
			).toEqual('?conditions={"n1":12}');
		}));
		it('buildBaucisQuery 1 field bool 12',  inject(function(QueryBuilderService) { 
			expect(
				QueryBuilderService.uriDecode(QueryBuilderService.buildBaucisQuery({
					searchText: "12",
					fields: [
						{ name: "b1", type: "bool" }
					],
					paginate: false
				}))
			).toEqual('');
		}));
		it('buildBaucisQuery 1 field bool true',  inject(function(QueryBuilderService) { 
			expect(
				QueryBuilderService.uriDecode(QueryBuilderService.buildBaucisQuery({
					searchText: "true",
					fields: [
						{ name: "b1", type: "bool" }
					],
					paginate: false 
				}))
			).toEqual('?conditions={"b1":true}');
		}));
		it('buildBaucisQuery 1 field date 25/11/2001 day precision',  inject(function(QueryBuilderService) { 
			
			var dateTxt1 = '25/11/2001';
			var date1 = new Date(2001, 10, 25);
			var date2 = new Date(2001, 10, 26);
			var dateIso1 = date1.toISOString();
			var dateIso2 = date2.toISOString();
			
			expect(
				QueryBuilderService.uriDecode(QueryBuilderService.buildBaucisQuery({
					searchText: dateTxt1,
					fields: [
						{ name: "d1", type: "date" }
					],
					paginate: false 
				}))
			//).toEqual('?conditions={"d1":{"$gte":"2001-11-24T23:00:00.000Z","$lt":"2001-11-25T23:00:00.000Z"}}');
			).toEqual('?conditions={"d1":{"$gte":"'+ dateIso1 +'","$lt":"'+ dateIso2 +'"}}');
		}));
		it('buildBaucisQuery 1 field datetime 2001-11-25 21:00 hour precision',  inject(function(QueryBuilderService) { 
			
			var dateTxt1 = '25/11/2001 21:00';
			var date1 = new Date(2001, 10, 25, 21, 0);
			var date2 = new Date(2001, 10, 25, 22, 0);
			var dateIso1 = date1.toISOString();
			var dateIso2 = date2.toISOString();

			expect(
				QueryBuilderService.uriDecode(QueryBuilderService.buildBaucisQuery({
					searchText: dateTxt1,
					fields: [
						{ name: "d1", type: "datetime" }
					],
					paginate: false 
				}))
			).toEqual('?conditions={"d1":{"$gte":"'+ dateIso1 +'","$lt":"'+ dateIso2 +'"}}');
		}));
		it('buildBaucisQuery 1 field datetime 2001-11-25 21:38 minute precision',  inject(function(QueryBuilderService) { 
			
			var dateTxt1 = '25/11/2001 21:38';
			var date1 = new Date(2001, 10, 25, 21, 38);
			var date2 = new Date(2001, 10, 25, 21, 39);
			var dateIso1 = date1.toISOString();
			var dateIso2 = date2.toISOString();

			expect(
				QueryBuilderService.uriDecode(QueryBuilderService.buildBaucisQuery({
					searchText: dateTxt1,
					fields: [
						{ name: "d1", type: "datetime" }
					],
					paginate: false 
				}))
			).toEqual('?conditions={"d1":{"$gte":"'+ dateIso1 +'","$lt":"'+ dateIso2 +'"}}');
		}));
		
		it('buildBaucisQuery 2 fields string abc',  inject(function(QueryBuilderService) { 
			expect(
				QueryBuilderService.uriDecode(QueryBuilderService.buildBaucisQuery({
					searchText: "abc",
					fields: [
						{ name: "t1", type: "string" },
						{ name: "t2", type: "string" }
					],
					paginate: false 
				}))
			).toEqual('?conditions={"$or":[{"t1":{"$regex":"abc","$options":"i"}},{"t2":{"$regex":"abc","$options":"i"}}]}');
		}));

		it('buildBaucisQuery fieldQuery t1=abc',  inject(function(QueryBuilderService) { 
			expect(
				QueryBuilderService.uriDecode(QueryBuilderService.buildBaucisQuery({
					searchText: "t1=abc",
					fields: [
						{ name: "t1", type: "string" },
						{ name: "d2", type: "date" }
					],
					paginate: false 
				}))
			).toEqual('?conditions={"t1":{"$regex":"abc","$options":"i"}}');
		}));

		it('buildBaucisQuery fieldQuery t1=abc t2=3',  inject(function(QueryBuilderService) { 
			expect(
				QueryBuilderService.uriDecode(QueryBuilderService.buildBaucisQuery({
					searchText: "t1=abc t2=3",
					fields: [
						{ name: "t1", type: "string" },
						{ name: "t2", type: "number" }
					],
					paginate: false 
				}))
			).toEqual('?conditions={"$and":[{"t1":{"$regex":"abc","$options":"i"}},{"t2":3}]}');
		}));

	});
});