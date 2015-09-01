angular.module('mlb')

.controller('AppCtrl', ['$scope', 'Players', function($scope, Players) {

  $scope.gv = {
      players : Players.load(),
      teama_score : 0,
      teamb_score : 0
  };

}])

.controller('TableCtrl', function($scope) {
})
.controller('MLBTableCtrl', function($scope) {
})

.controller('GameCtrl', function($scope, $ionicModal) {
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
        $scope.game_done = false;
        $scope.gv.teama_score = 0;
        $scope.gv.teamb_score = 0;
        $scope.modal.hide();
      }
    };
    $scope.start_game = function () {
        console.log('start new game');
        $scope.modal.show();
    };
    
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
        console.log('updated ' + player.name + 's white: 0')
        return;
      }
      $scope.gv.players[player.name].curr.white = 3 - player.curr.whiteDown;
      console.log('updated ' + player.name + 's white: ' + $scope.gv.players[player.name].curr.white )
      $scope.update_total(player);
    };

    // check if game has finished
    $scope.game_done = true;
    function score_change () {
      // update points for each player
      angular.forEach($scope.gv.players, function (player) {
        if (player.curr.team === 'A') {
          player.curr.points = $scope.gv.teama_score;
          if ($scope.gv.teama_score > $scope.gv.teamb_score) {
            player.curr.ecpoints = 2;
            player.curr.won = 1;
            player.curr.lost = 0;
          } else {
            player.curr.ecpoints = 0;
            player.curr.won = 0;
            player.curr.lost = 1;
          }
        } else {
          player.curr.points = $scope.gv.teamb_score;
          if ($scope.gv.teamb_score > $scope.gv.teama_score) {
            player.curr.ecpoints = 2;
            player.curr.won = 1;
            player.curr.lost = 0;
          } else {
            player.curr.ecpoints = 0;
            player.curr.won = 0;
            player.curr.lost = 1;
          }
        }
        $scope.update_total(player);
      });
      // check if game has finished
      if ($scope.gv.teama_score === 6 || $scope.gv.teamb_score === 6) {
        $scope.game_done = true;
      }
    };
    $scope.$watch('gv.teama_score', function () {
      if ($scope.gv.teama_score !== 0) {
        score_change();
      }
    });
    $scope.$watch('gv.teamb_score', function () {
      if ($scope.gv.teamb_score !== 0) {
        score_change();
      }
    });
    $scope.end_game = function () {
        console.log('end current game - store results');
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