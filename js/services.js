angular.module('mlb')

.factory('Storage', function() {

  var players = [{
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
      window.localStorage['mlb-game-season8-game' + game.id] = JSON.stringify(game);
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
    }

  };
});