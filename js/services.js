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
    }
  };

  return {
    load : function () {
      return players;
    }
  };
});