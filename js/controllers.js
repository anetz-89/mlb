angular.module('mlb')

.controller('AppCtrl', ['$scope', 'Players', function($scope, Players) {

  $scope.teama_score = 0;
  $scope.teamb_score = 0;
  $scope.gv = {
      players : Players.load()
  };

}])

.controller('TableCtrl', function($scope) {
})
.controller('MLBTableCtrl', function($scope) {
})

.controller('GameCtrl', function($scope) {
    $scope.start_new = function () {
        console.log('start new game');

    };
    $scope.end_game = function () {
        console.log('end current game');

    };
    $scope.update_total = function (player) {
      $scope.gv.players[player.name].curr.total = 
        $scope.gv.players[player.name].curr.white + 
        $scope.gv.players[player.name].curr.combo;
    };
    $scope.update_white = function (player) {
      if (player.curr.black !== 0 ||
          player.curr.whiteDown > 3) {
        $scope.gv.players[player.name].curr.white = 0;
        console.log('updated ' + player.name + 's white: 0')
        return;
      }
      $scope.gv.players[player.name].curr.white = 3 - player.curr.whiteDown;
      console.log('updated ' + player.name + 's white: ' + $scope.gv.players[player.name].curr.white )
      $scope.update_total(player);
    };
})

.controller('PlusMinusCtrl', function($scope) {

    $scope.increment = function () {
      $scope.player.curr[$scope.value] += 1;
      if ($scope.update) {
        $scope.update($scope.player);
      }
    };
    $scope.decrement = function () {
      if ($scope.player.curr[$scope.value] > 0) {
        $scope.player.curr[$scope.value] -= 1;
        if ($scope.update) {
          $scope.update($scope.player);
        }
      }
    }
});