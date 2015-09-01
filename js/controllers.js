angular.module('mlb')

.controller('AppCtrl', ['$scope', '$ionicModal', 'Storage', function($scope, $ionicModal, Storage) {

  $scope.gv = {
      players : Storage.loadResult(),
      team_scoreA : 0,
      team_scoreB : 0,
      gameId : Storage.loadGameId(),
      gameDone : false,
      gameStarted : false
  };

      // start new game functionality
    $ionicModal.fromTemplateUrl('templates/teammodal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });

    $scope.create_teams = function () {
      var valid = false,
        team_a = [],
        team_b = [];
      angular.forEach($scope.gv.players, function (player) {
        player.curr = {
          black: 0,
          white: 3,
          whiteDown : 0,
          combo: 0,
          won: 0,
          lost: 0,
          points: 0,
          ecpoints: 0,
          total: 3
        };
        if (player.curr_team === true) {
          team_a.push(player);
        } else {
          team_b.push(player);
        }
      });
      if (team_a.length === 2) {
        team_a[0].curr.team = 'A';
        team_a[1].curr.team = 'A';
        team_b[0].curr.team = 'B';
        team_b[1].curr.team = 'B';
        $scope.gv.gameDone = false;
        $scope.gv.gameStarted = true;
        $scope.gv.gameId = $scope.gv.gameId + 1;
        $scope.gv.team_scoreA = 0;
        $scope.gv.team_scoreB = 0;
        $scope.modal.hide();
      }
    };
    $scope.start_game = function () {
        console.log('start new game');
        $scope.modal.show();
    };

}])

.controller('TableCtrl', function($scope) {
})
.controller('MLBTableCtrl', function($scope) {
})

.controller('GameCtrl', ['$scope', 'Storage', 'Util', function($scope, Storage, Util) {
    // current value update functions
    $scope.update_total = function (player) {
      //$scope.update_white(player);
      $scope.gv.players[player.name].curr.total = 
        $scope.gv.players[player.name].curr.white + 
        $scope.gv.players[player.name].curr.combo + 
        $scope.gv.players[player.name].curr.points +
        $scope.gv.players[player.name].curr.ecpoints;
    };
    $scope.update_white = function (player) {
      if (player.curr.black !== 0 ||
          player.curr.whiteDown > 3) {
        $scope.gv.players[player.name].curr.white = 0;
        return;
      }
      $scope.gv.players[player.name].curr.white = 3 - player.curr.whiteDown;
      $scope.update_total(player);
    };

    // check if game has finished
    $scope.gv.gameDone = true;
    function score_change (newValue) {
      if (newValue === 0) {
        return;
      }
      // update points for each player
      angular.forEach($scope.gv.players, function (player) {
        var scorename = 'team_score' + player.curr.team;
        player.curr.points = $scope.gv[scorename];
        if ($scope.gv[scorename] > $scope.gv['team_score' + Util.getOtherTeam(player.curr.team)]) {
          player.curr.ecpoints = 2;
          player.curr.won = 1;
          player.curr.lost = 0;
        } else {
          player.curr.ecpoints = 0;
          player.curr.won = 0;
          player.curr.lost = 1;
        }
        $scope.update_total(player);
      });
      // check if game has finished
      if ($scope.gv.team_scoreA === 6 || $scope.gv.team_scoreB === 6) {
        $scope.gv.gameDone = true;
      }
    };
    $scope.$watch('gv.team_scoreA', score_change);
    $scope.$watch('gv.team_scoreB', score_change);

    $scope.end_game = function () {
        console.log('end current game - store results');
        var result = {
            date : Util.getTimestamp(),
            id : $scope.gv.gameId,
            teamA : {score : $scope.team_scoreA, player1: {}, player2:{}},
            teamB : {score : $scope.team_scoreB, player1: {}, player2:{}}
          },
          count = {
            A : 1,
            B : 1
          };

        angular.forEach($scope.gv.players, function (player) {
          angular.forEach(player.curr, function (value, key) {
            if (player.hasOwnProperty(key)) {
              player[key] += value;
            }
          });
          result['team' + player.curr.team]['player' + count[player.curr.team]] = player;
          player.curr = {};
        });
        console.log(result);
        Storage.storeGame(result);
        Storage.storeResult($scope.gv.players);
        $scope.gv.gameStarted = false;
    };
}])

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