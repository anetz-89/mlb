angular.module('mlb')

.directive('plusminus', function() {
  return {
	    templateUrl: 'templates/plusminus.html',
	    controller: 'PlusMinusCtrl',
	    scope: {
	        value: '=',
	        update: '=?',
	        player : '=',
	        players : '='
	    }
	};
  })

.directive('mlbtable', function() {
  return {
	    templateUrl: 'templates/mlbtable.html',
	    controller: 'MLBTableCtrl',
	    scope: {
	        islive: '=',
	        players: '='
	    }
	};
  });