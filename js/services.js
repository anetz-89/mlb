angular.module('mlb')

.factory('Storage', function() {

  var game_id_prefix = 'mlb-game-season8-game',
    players = [{
      position : 0,
      name : 'Dimi',
      white : 0,
      combo : 0,
      won : 0,
      lost : 0,
      points : 0,
      ecpoints : 0,
      total : 0,
    }, {
      position : 1,
      name : 'Tobi',
      white : 0,
      combo : 0,
      won : 0,
      lost : 0,
      points : 0,
      ecpoints : 0,
      total : 0,
    }, {
      position : 2,
      name : 'Alex',
      white : 0,
      combo : 0,
      won : 0,
      lost : 0,
      points : 0,
      ecpoints : 0,
      total : 0,
    }, {
      position : 3,
      name : 'Makler',
      white : 0,
      combo : 0,
      won : 0,
      lost : 0,
      points : 0,
      ecpoints : 0,
      total : 0,
    }];
  function load (key, fallback, parse) {
    if (window.localStorage.hasOwnProperty(key)) {
      var stored_data = window.localStorage[key];
      if (parse) {
        stored_data = JSON.parse(stored_data);
      }
      if (stored_data) {
        return stored_data
      }
    }
    return fallback;
  };
  return {
    loadHistory : function () {
      var history = [],
        curr_item = true,
        index = 0;
      while (curr_item) {
        if (index !== 0) {
          history.push(curr_item);
        }
        index += 1;
        curr_item = load(game_id_prefix + index, null, true);
      }
      return history.reverse();
    },
    loadResult : function () {
      players = load('mlb-result', players, true);
      return players;
    },
    loadGameId : function () {
      var last_id = load('mlb-last-game-id', '0')
      return parseInt(last_id, 10);
    },
    storeResult : function (result) {
      window.localStorage['mlb-result'] = JSON.stringify(result);
    },
    storeGame : function (game) {
      window.localStorage[game_id_prefix + game.id] = JSON.stringify(game);
      window.localStorage['mlb-last-game-id'] = '' + game.id;
    }
  };
})

.factory('Util', function () {
  return {
    getTimestamp : function () {
      var now = new Date(),
        date = [ now.getFullYear(), now.getMonth() + 1, now.getDate() ],
        time = [ now.getHours(), now.getMinutes(), now.getSeconds() ];
      // If seconds and minutes are less than 10, add a zero
      for ( var i = 1; i < 3; i++ ) {
        if ( time[i] < 10 ) {
          time[i] = "0" + time[i];
        }
      }
      // Return the formatted string
      return date.join("-") + "_" + time.join(":");
    },
    getOtherTeam : function (teamName) {
      if (teamName === 'A') {
        return 'B';
      }
      return 'A';
    },
    reorder_table : function (players) {
      // reoder
      players.sort(function(a, b) {
        return (b.total + b.curr.total) - (a.total + a.curr.total);
      });
      // update 
      angular.forEach(players, function (player, index) {
        player.position = index;
      });
      return players;
    },
    // current value update functions
    update_total : function (players, playerId, ignore_teamplayer) {
      // update teamplayer's combo
      var curr_player = players[playerId],
        team_value = players[playerId].curr_team,
        teamplayer,
        i;
      if (!ignore_teamplayer) {
        for (i = 0; i < 3; i += 1) {
          teamplayer = players[i];
          if (i !== playerId &&
                teamplayer.curr_team === team_value) {
            // found correct teamplayer
            teamplayer.curr.teamcombo = curr_player.curr.combo / 2;
            this.update_total(players, teamplayer.position, true)
          }
        }
      }

      // update total of player
      curr_player.curr.total = 
        curr_player.curr.white + 
        curr_player.curr.combo + 
        curr_player.curr.teamcombo + 
        curr_player.curr.points +
        curr_player.curr.ecpoints;
      return this.reorder_table(players);
    },
    update_white : function (players, playerId) {
      var player = players[playerId];
      if (player.curr.black !== 0 ||
          player.curr.whiteDown > 3) {
        player.curr.white = 0;
      } else {
        player.curr.white = 3 - player.curr.whiteDown;
      }
      this.update_total(players, playerId);
    }

  };
});