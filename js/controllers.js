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
        // create new current values for each player
        player.curr = {
          black: 0,
          white: 3,
          whiteDown : 0,
          combo: 0,
          teamcombo: 0,
          won: 0,
          lost: 0,
          points: 0,
          ecpoints: 0,
          total: 3
        };
        // check if player is checked -> team a
        if (player.curr_team === true) {
          team_a.push(player);
        } else {
          team_b.push(player);
        }
      });
      // create new game properties, assign teams, if 2:2 teams
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

.controller('HistoryCtrl', ['$scope', 'Storage', function($scope, Storage) {
  $scope.history = Storage.loadHistory();
}])

.controller('GameCtrl', ['$scope', 'Storage', 'Util', function($scope, Storage, Util) {
    $scope.update_white = Util.update_white.bind(Util);
    $scope.update_total = Util.update_total.bind(Util);
    // game score has changed.
    function score_change (newValue) {
      // care about integer conversion
      $scope.gv.team_scoreA = parseInt($scope.gv.team_scoreA, 10);
      $scope.gv.team_scoreB = parseInt($scope.gv.team_scoreB, 10);
      // no need to do anything when new value = 0
      if (parseInt(newValue, 10) === 0) {
        return;
      }
      // update all score relevant points for each player
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
        $scope.gv.players = Util.update_total($scope.gv.players, player.position);
      });
      // check if game has finished
      if ($scope.gv.team_scoreA === 6 || $scope.gv.team_scoreB === 6) {
        $scope.gv.gameDone = true;
      } else {
        $scope.gv.gameDone = false;
      }
    };

    // bind score change listener to teamscore
    $scope.$watch('gv.team_scoreA', score_change);
    $scope.$watch('gv.team_scoreB', score_change);


    $scope.end_game = function () {
        console.log('end current game - store results');
        var result = {
            date : Util.getTimestamp(),
            id : $scope.gv.gameId,
            teamA : {score : $scope.gv.team_scoreA, player1: {}, player2:{}},
            teamB : {score : $scope.gv.team_scoreB, player1: {}, player2:{}}
          },
          count = {
            A : 1,
            B : 1
          };
        // assign every player to his team 
        angular.forEach($scope.gv.players, function (player) {
          angular.forEach(player.curr, function (value, key) {
            if (player.hasOwnProperty(key)) {
              player[key] += value;
            }
          });
          result['team' + player.curr.team]['player' + count[player.curr.team]] = player;
          count[player.curr.team] += 1;
          player.curr = {};
        });

        Storage.storeGame(result);
        Storage.storeResult($scope.gv.players);
        $scope.gv.gameStarted = false;
    };
}])

.controller('PlusMinusCtrl', function($scope) {
    // increment the relevant current value and trigger table update
    $scope.increment = function () {
      $scope.player.curr[$scope.value] += 1;
      if ($scope.update) {
        $scope.update($scope.players, $scope.player.position);
      }
    };
    // increment the relevant current value and trigger table update
    $scope.decrement = function () {
      if ($scope.player.curr[$scope.value] > 0) {
        $scope.player.curr[$scope.value] -= 1;
        if ($scope.update) {
          $scope.update($scope.players, $scope.player.position);
        }
      }
    }
  });