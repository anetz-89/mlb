angular.module('mlb')

.factory('Players', function() {

  var players = {
    'Dimi': {
      name : 'Dimi',
      white : 0,
      combo : 0,
      won : 0,
      lost : 0,
      points : 0,
      ecpoints : 0,
      total : 0,
      curr : {
        team : 'A',
        black: 0,
        white: 3,
        whiteDown : 0,
        combo: 0,
        won: 0,
        lost: 0,
        points: 0,
        ecpoints: 0,
        total: 3
      }
    },
    'Tobi' : {
      name : 'Tobi',
      white : 0,
      combo : 0,
      won : 0,
      lost : 0,
      points : 0,
      ecpoints : 0,
      total : 0,
      curr : {
        team: 'A',
        black: 0,
        white: 3,
        whiteDown : 0,
        combo: 0,
        won: 0,
        lost: 0,
        points: 0,
        ecpoints: 0,
        total: 3
      }
    },
    'Alex' : {
      name : 'Alex',
      white : 0,
      combo : 0,
      won : 0,
      lost : 0,
      points : 0,
      ecpoints : 0,
      total : 0,
      curr : {
        team: 'B',
        black: 0,
        white: 3,
        whiteDown : 0,
        combo: 0,
        won: 0,
        lost: 0,
        points: 0,
        ecpoints: 0,
        total: 3
      }
    },
    'Makler' : {
      name : 'Makler',
      white : 0,
      combo : 0,
      won : 0,
      lost : 0,
      points : 0,
      ecpoints : 0,
      total : 0,
      curr : {
        team: 'B',
        black: 0,
        white: 3,
        whiteDown : 0,
        combo: 0,
        won: 0,
        lost: 0,
        points: 0,
        ecpoints: 0,
        total: 3
      }
    }
  };

  return {
    load : function () {
      return players;
    }
  };
});