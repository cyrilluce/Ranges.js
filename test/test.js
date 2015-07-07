var assert = require("assert"),
	Ranges = require('../index');
describe('Ranges', function() {
	function getRanges(){
		return new Ranges([
			[10,19],
			[30,39],
			[50,59]
		]);
	}
	function getStringRanges(){
		return new Ranges([
			['10','19'],
			['30','39'],
			['50','59'],
			['a', 'z']
		]);
	}
	function assertRanges(ranges, array){
		assert.deepEqual(ranges.ranges, array);
	}
	describe('#constructor()', function () {
		it('auto sort and combine', function () {
			assertRanges(new Ranges([
				[12,15],
				[1,2],
				[4,9],
				[3,5]
			]), [
				[1,9],
				[12,15]
			])
		});
		it('single range construct', function(){
			assertRanges(new Ranges(1,9), [
				[1,9]
			])
		});
		it('support string range', function () {
			assertRanges(new Ranges([
				['1','9'],
				['10','19'],
				['30','39'],
				['a', 'z'],
				['50','59']
			]), [
				['1', '9'],
				['a', 'z']
			])
		});
	});

	describe('#add()', function () {
		it('no adjacent before range directly add and sort', function () {
			assertRanges(getRanges().add([1,5]), [
				[1,5],
				[10,19],
				[30,39],
				[50,59]
			])
			assertRanges(getStringRanges().add(['01','05']), [
				['01', '05'],
				['10','19'],
				['30','39'],
				['50','59'],
				['a', 'z']
			])
		});
		it('no adjacent middle range directly add and sort', function () {
			assertRanges(getRanges().add([21,25]), [
				[10,19],
				[21,25],
				[30,39],
				[50,59]
			])
			assertRanges(getStringRanges().add(['21','25']), [
				['10','19'],
				['21','25'],
				['30','39'],
				['50','59'],
				['a', 'z']
			])
		});
		it('no adjacent after range directly add and sort', function () {
			assertRanges(getRanges().add([61,65]), [
				[10,19],
				[30,39],
				[50,59],
				[61,65]
			])
			assertRanges(getStringRanges().add(['61','65']), [
				['10','19'],
				['30','39'],
				['50','59'],
				['61', '65'],
				['a', 'z']
			])
		});
		it('front adjacent range auto combine', function(){
			assertRanges(getRanges().add([1,9]), [
				[1,19],
				[30,39],
				[50,59]
			])
			assertRanges(getStringRanges().add(['01','09']), [
				['01','09'],
				['10','19'],
				['30','39'],
				['50','59'],
				['a', 'z']
			])
		});
		it('after adjacent range auto combine', function(){
			assertRanges(getRanges().add([60,65]), [
				[10,19],
				[30,39],
				[50,65]
			])
			assertRanges(getStringRanges().add(['60','65']), [
				['10','19'],
				['30','39'],
				['50','59'],
				['60','65'],
				['a', 'z']
			])
		});
		it('both adjacent ranges auto combine', function(){
			assertRanges(getRanges().add([20,29]), [
				[10,39],
				[50,59]
			])
			assertRanges(getStringRanges().add(['20','29']), [
				['10','19'],
				['20','29'],
				['30','39'],
				['50','59'],
				['a', 'z']
			])
		});
		it('front conflict range auto combine', function(){
			assertRanges(getRanges().add([1,15]), [
				[1,19],
				[30,39],
				[50,59]
			])
			assertRanges(getStringRanges().add(['01','15']), [
				['01','19'],
				['30','39'],
				['50','59'],
				['a', 'z']
			])
		});
		it('after conflict range auto combine', function(){
			assertRanges(getRanges().add([15,25]), [
				[10,25],
				[30,39],
				[50,59]
			])
			assertRanges(getStringRanges().add(['15','25']), [
				['10','25'],
				['30','39'],
				['50','59'],
				['a', 'z']
			])
		});
		it('both conflict range auto combine', function(){
			assertRanges(getRanges().add([15,35]), [
				[10,39],
				[50,59]
			])
			assertRanges(getStringRanges().add(['15','35']), [
				['10','39'],
				['50','59'],
				['a', 'z']
			])
		});
		it('multi conflict range auto combine1', function(){
			assertRanges(getRanges().add([15,55]), [
				[10,59]
			])
			assertRanges(getStringRanges().add(['15','55']), [
				['10','59'],
				['a', 'z']
			])
		});
		it('multi conflict range auto combine2', function(){
			assertRanges(getRanges().add([15,65]), [
				[10,65]
			])
			assertRanges(getStringRanges().add(['15','65']), [
				['10','65'],
				['a', 'z']
			])
		});
		it('contain range ignore', function(){
			assertRanges(getRanges().add([12,17]), [
				[10,19],
				[30,39],
				[50,59]
			])
			assertRanges(getStringRanges().add(['12','17']), [
				['10','19'],
				['30','39'],
				['50','59'],
				['a', 'z']
			])
		});
	})


	describe('#sub()', function () {
		it('no conflict no adjacent range ignore', function () {
			assertRanges(getRanges().sub([1,5]), [
				[10,19],
				[30,39],
				[50,59]
			])});
		it('front adjacent range ignore', function(){
			assertRanges(getRanges().sub([1,9]), [
				[10,19],
				[30,39],
				[50,59]
			])});
		it('after adjacent range ignore', function(){
			assertRanges(getRanges().sub([60,69]), [
				[10,19],
				[30,39],
				[50,59]
			])});
		it('adjacent both ranges ignore', function(){
			assertRanges(getRanges().sub([20,29]), [
				[10,19],
				[30,39],
				[50,59]
			])});
		it('front conflict range sub', function(){
			assertRanges(getRanges().sub([1,15]), [
				[16,19],
				[30,39],
				[50,59]
			])});
		it('after conflict range sub', function(){
			assertRanges(getRanges().sub([55,65]), [
				[10,19],
				[30,39],
				[50,54]
			])});
		it('both conflict range sub', function(){
			assertRanges(getRanges().sub([15,35]), [
				[10,14],
				[36,39],
				[50,59]
			])});
		it('multi conflict range sub 1', function(){
			assertRanges(getRanges().sub([15,55]), [
				[10,14],
				[56,59]
			])});
		it('multi conflict range sub 2', function(){
			assertRanges(getRanges().sub([1,55]), [
				[56,59]
			])});
		it('multi conflict range sub 3', function(){
			assertRanges(getRanges().sub([1,65]), [
			])});
		it('contain range sub', function(){
			assertRanges(getRanges().sub([13,17]), [
				[10,12],
				[18,19],
				[30,39],
				[50,59]
			])});
		it('not support non integer range subtraction', function(){
			assert.throws(function(){
				new Ranges('1', '9').sub(['10', '11']);
			});
		})
	});

	describe('#isConflict()', function () {
		it('no conflict no adjacent range ignore', function (){
			assert.ok(!getRanges().isConflict([1, 5]));
			assert.ok(!getStringRanges().isConflict(['01', '05']));
		});
		it('adjacent range ignore', function(){
			assert.ok(!getRanges().isConflict([1,9]));
			assert.ok(!getStringRanges().isConflict(['0','0']));
		});
		it('adjacent multi ranges ignore', function(){
			assert.ok(!getRanges().isConflict([20,29]));
			assert.ok(!getStringRanges().isConflict(['20','29']));
		});
		it('front conflict', function(){
			assert.ok(getRanges().isConflict([1,15]));
			assert.ok(getStringRanges().isConflict(['01','15']));
		});
		it('after conflict', function(){
			assert.ok(getRanges().isConflict([55,65]));
			assert.ok(getStringRanges().isConflict(['55','65']));
		});
		it('multi conflict 1', function(){
			assert.ok(getRanges().isConflict([1,55]));
			assert.ok(getStringRanges().isConflict(['01','55']));
		});
		it('multi conflict 2', function(){
			assert.ok(getRanges().isConflict([15,65]));
			assert.ok(getStringRanges().isConflict(['15','65']));
		});
		it('multi conflict 3', function(){
			assert.ok(getRanges().isConflict([1,65]));
			assert.ok(getStringRanges().isConflict(['01','65']));
		});
	});

	describe('#isContain()', function () {
		it('before', function (){
			assert.ok(!getRanges().isContain(5));
			assert.ok(!getStringRanges().isContain('05'));
		});
		it('after', function(){
			assert.ok(!getRanges().isContain(70));
			assert.ok(!getStringRanges().isContain('70'));
		});
		it('middle', function(){
			assert.ok(!getRanges().isContain(25));
			assert.ok(!getStringRanges().isContain('25'));
		});
		it('before adjacent', function(){
			assert.ok(!getRanges().isContain(9));
			assert.ok(!getStringRanges().isContain('09'));
		});
		it('after adjacent', function(){
			assert.ok(!getRanges().isContain(60));
			assert.ok(!getStringRanges().isContain('60'));
		});
		it('contain 1', function(){
			assert.ok(getRanges().isContain(15));
			assert.ok(getStringRanges().isContain('15'));
		});
		it('contain 2', function(){
			assert.ok(getRanges().isContain(55));
			assert.ok(getStringRanges().isContain('c'));
		});
	});
});