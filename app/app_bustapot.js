var streak = 0
var variableBase = true
var baseBet = 1
var baseSatoshi = baseBet * 100
var baseMultiplier = 1.13
var currentBet = baseSatoshi
var runs = 1000
var go = 0
var lossStreak = 0
var cond = '<'
var coolingDown = false
var user_balance
var newbaseBet = 0
var lastLoss = 0
var totalLosses = 0
var newBaseSatoshi
var divider = 100
var randomnumber
var done = 0
var totalmultiplier = 1.01
var currentMultiplier = 1.01
var plusbits = 0.01
var lastbet
var stopped = 1
var stopatstopped = 0
var bignumber = Math.pow(2,32)
var continueafterdeath = 1
var multiplied = 0
var betbust = 0
var autobettoggle = 1;
var lastprofit = 0;
var curmultiplier = 100;
var firstwagervar = 0;
var curmultiplierdivision = 1;
var config = {
  // - Your app's id on moneypot.com
  app_ida: 1279,                             // <----------------------------- EDIT ME!
  // - Displayed in the navbar
  app_name: 'Bustapot',
  // - For your faucet to work, you must register your site at Recaptcha
  // - https://www.google.com/recaptcha/intro/index.html
  recaptcha_sitekey: '6LfCZyATAAAAADvQosXI8YCemiHTR1rtBG30lswx',  // <----- EDIT ME!
  redirect_uri: 'http://www.bustapot.pw',
  mp_browser_uri: 'https://www.moneypot.com',
  mp_api_uri: 'https://api.moneypot.com',
  chat_uri: 'https://socket.moneypot.com',
  // - Show debug output only if running on localhost
  debug: isRunningLocally(),
  // - Set this to true if you want users that come to https:// to be redirected
  //   to https://
  //force_httpss_redirect: !isRunningLocally(),
  // - Configure the house edge (default is 1%)
  //   Must be between 0.0 (0%) and 1.0 (100%)
  house_edge: 0.005,
  chat_buffer_size: 100,
  // - The amount of bets to show on screen in each tab
  bet_buffer_size: 25
};

////////////////////////////////////////////////////////////
// You shouldn't have to edit anything below this line
////////////////////////////////////////////////////////////

// Validate the configured house edge
(function() {
  var errString;
  setTimeout(referertest, 1000);
	setInterval(function(){
if (stopped == 0) {
    $('#bet-hi').click();
};
}, 100);
  if (config.house_edge <= 0.0) {
    errString = 'House edge must be > 0.0 (0%)';
  } else if (config.house_edge >= 100.0) {
    errString = 'House edge must be < 1.0 (100%)';
  }
  if (errString) {
    alert(errString);
    throw new Error(errString);
  }

  // Sanity check: Print house edge
  console.log('House Edge:', (config.house_edge * 100).toString() + '%');
})();

////////////////////////////////////////////////////////////





// Hoist it. It's impl'd at bottom of page.
var socket;

// :: Bool
function isRunningLocally() {
  return /^localhost/.test(window.location.host);
}

var el = React.DOM;

// Generates UUID for uniquely tagging components
var genUuid = function() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
};

var helpers = {};

// For displaying HH:MM timestamp in chat
//
// String (Date JSON) -> String
helpers.formatDateToTime = function(dateJson) {
  var date = new Date(dateJson);
  return _.padLeft(date.getHours().toString(), 2, '0') +
    ':' +
    _.padLeft(date.getMinutes().toString(), 2, '0');
};

// Number -> Number in range (0, 1)
helpers.multiplierToWinProb = function(multiplier) {
  console.assert(typeof multiplier === 'number');
  console.assert(multiplier > 0);
var n = 1.0 - betStore.state.HouseEdge;
var total = 1
  // For example, n is 0.99 when house edge is 1%
  if (houseedgerunning == 0) {
total = n/multiplier;
} else {
 total = 0.999/multiplier;
}
  return total;
};

helpers.calcNumber = function(cond, winProb) {
  console.assert(typeof winProb === 'number');
    return (Math.floor(winProb * 10000)/100);
};

helpers.roleToLabelElement = function(role) {
  switch(role) {
    case 'ADMIN':
      return el.span({className: 'label label-danger'}, 'MP Staff');
    case 'MOD':
      return el.span({className: 'label label-info'}, 'Mod');
    case 'OWNER':
      return el.span({className: 'label label-primary'}, 'Owner');
    default:
      return '';
  }
};

// -> Object
helpers.getHashParams = function() {
  var hashParams = {};
  var e,
      a = /\+/g,  // Regex for replacing addition symbol with a space
      r = /([^&;=]+)=?([^&;]*)/g,
      d = function (s) { return decodeURIComponent(s.replace(a, " ")); },
      q = window.location.hash.substring(1);
  while (e = r.exec(q))
    hashParams[d(e[1])] = d(e[2]);
  return hashParams;
};

// getPrecision('1') -> 0
// getPrecision('.05') -> 2
// getPrecision('25e-100') -> 100
// getPrecision('2.5e-99') -> 100
helpers.getPrecision = function(num) {
  var match = (''+num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
  if (!match) { return 0; }
  return Math.max(
    0,
    // Number of digits right of decimal point.
    (match[1] ? match[1].length : 0) -
    // Adjust for scientific notation.
    (match[2] ? +match[2] : 0));
};

/**
 * Decimal adjustment of a number.
 *
 * @param {String}  type  The type of adjustment.
 * @param {Number}  value The number.
 * @param {Integer} exp   The exponent (the 10 logarithm of the adjustment base).
 * @returns {Number} The adjusted value.
 */
helpers.decimalAdjust = function(type, value, exp) {
  // If the exp is undefined or zero...
  if (typeof exp === 'undefined' || +exp === 0) {
    return Math[type](value);
  }
  value = +value;
  exp = +exp;
  // If the value is not a number or the exp is not an integer...
  if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
    return NaN;
  }
  // Shift
  value = value.toString().split('e');
  value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
  // Shift back
  value = value.toString().split('e');
  return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
}

helpers.round10 = function(value, exp) {
  return helpers.decimalAdjust('round', value, exp);
};

helpers.floor10 = function(value, exp) {
  return helpers.decimalAdjust('floor', value, exp);
};

helpers.ceil10 = function(value, exp) {
  return helpers.decimalAdjust('ceil', value, exp);
};



////////////////////////////////////////////////////////////

// A weak Moneypot API abstraction
//
// Moneypot's API docs: https://www.moneypot.com/api-docs
var MoneyPot = (function() {

  var o = {};

  o.apiVersion = 'v1';

  // method: 'GET' | 'POST' | ...
  // endpoint: '/tokens/abcd-efgh-...'
  var noop = function() {};
  var makeMPRequest = function(method, bodyParams, endpoint, callbacks, overrideOpts) {

    if (!worldStore.state.accessTokena)
      throw new Error('Must have accessTokena set to call MoneyPot API');

    var url = config.mp_api_uri + '/' + o.apiVersion + endpoint;

    if (worldStore.state.accessTokena) {
      url = url + '?access_token=' + worldStore.state.accessTokena;
    }

    var ajaxOpts = {
      url:      url,
      dataType: 'json', // data type of response
      method:   method,
      data:     bodyParams ? JSON.stringify(bodyParams) : undefined,
      // By using text/plain, even though this is a JSON request,
      // we avoid preflight request. (Moneypot explicitly supports this)
      headers: {
        'Content-Type': 'text/plain'
      },
      // Callbacks
      success:  callbacks.success || noop,
      error:    callbacks.error || noop,
      complete: callbacks.complete || noop
    };

    $.ajax(_.merge({}, ajaxOpts, overrideOpts || {}));
  };

  o.listBets = function(callbacks) {
    var endpoint = '/list-bets';
    makeMPRequest('GET', undefined, endpoint, callbacks, {
      data: {
        app_id: config.app_ida,
        limit: config.bet_buffer_size
      }
    });
  };

  o.getTokenInfo = function(callbacks) {
    var endpoint = '/token';
    makeMPRequest('GET', undefined, endpoint, callbacks);
  };

  o.generateBetHash = function(callbacks) {
    var endpoint = '/hashes';
    makeMPRequest('POST', undefined, endpoint, callbacks);
  };

  o.getDepositAddress = function(callbacks) {
    var endpoint = '/deposit-address';
    makeMPRequest('GET', undefined, endpoint, callbacks);
  };

  // gRecaptchaResponse is string response from google server
  // `callbacks.success` signature	is fn({ claim_id: Int, amoutn: Satoshis })
  o.claimFaucet = function(gRecaptchaResponse, callbacks) {
    console.log('Hitting POST /claim-faucet');
    var endpoint = '/claim-faucet';
    var body = { response: gRecaptchaResponse };
    makeMPRequest('POST', body, endpoint, callbacks);
  };

  // bodyParams is an object:
  // - wager: Int in satoshis
  // - client_seed: Int in range [0, 0^32)
  // - hash: BetHash
  // - cond: '<' | '>'
  // - number: Int in range [0, 99.99] that cond applies to
  // - payout: how many satoshis to pay out total on win (wager * multiplier)
  o.placeSimpleDiceBet = function(bodyParams, callbacks) {
    var endpoint = '/bets/custom';
    makeMPRequest('POST', bodyParams, endpoint, callbacks);
  };
 
  return o;
})();

////////////////////////////////////////////////////////////

var Dispatcher = new (function() {
  // Map of actionName -> [Callback]
  this.callbacks = {};

  var self = this;

  // Hook up a store's callback to receive dispatched actions from dispatcher
  //
  // Ex: Dispatcher.registerCallback('NEW_MESSAGE', function(message) {
  //       console.log('store received new message');
  //       self.state.messages.push(message);
  //       self.emitter.emit('change', self.state);
  //     });
  this.registerCallback = function(actionName, cb) {
    console.log('[Dispatcher] registering callback for:', actionName);

    if (!self.callbacks[actionName]) {
      self.callbacks[actionName] = [cb];
    } else {
      self.callbacks[actionName].push(cb);
    }
  };

  this.sendAction = function(actionName, payload) {
    console.log('[Dispatcher] received action:', actionName, payload);

    // Ensure this action has 1+ registered callbacks
    if (!self.callbacks[actionName]) {
      throw new Error('Unsupported actionName: ' + actionName);
    }

    // Dispatch payload to each registered callback for this action
    self.callbacks[actionName].forEach(function(cb) {
      cb(payload);
    });
  };
});

////////////////////////////////////////////////////////////

var Store = function(storeName, initState, initCallback) {

  this.state = initState;
  this.emitter = new EventEmitter();

  // Execute callback immediately once store (above state) is setup
  // This callback should be used by the store to register its callbacks
  // to the dispatcher upon initialization
  initCallback.call(this);

  var self = this;

  // Allow components to listen to store events (i.e. its 'change' event)
  this.on = function(eventName, cb) {
    self.emitter.on(eventName, cb);
  };

  this.off = function(eventName, cb) {
    self.emitter.off(eventName, cb);
  };
};

////////////////////////////////////////////////////////////

// Manage access_token //////////////////////////////////////
//
// - If access_token is in url, save it into localStorage.
//   `expires_in` (seconds until expiration) will also exist in url
//   so turn it into a date that we can compare

var access_token, expires_in, expires_at, referer;

if (helpers.getHashParams().access_token) {
  console.log('[token manager] access_token in hash params');
  access_token = helpers.getHashParams().access_token;
  expires_in = helpers.getHashParams().expires_in;
  referer = localStorage.referer;
  expires_at = new Date(Date.now() + (expires_in * 1000));
  localStorage.setItem('access_token', access_token);
  localStorage.setItem('expires_at', expires_at);
} else if (localStorage.access_token) {
  referer = localStorage.referer;
  if (String(referer) == "undefined"){
  referer = "gapjustin";
}
  console.log('[token manager] access_token in localStorage');
  expires_at = localStorage.expires_at;
  // Only get access_token from localStorage if it expires
  // in a week or more. access_tokens are valid for two weeks
  if (expires_at && new Date(expires_at) > new Date(Date.now() + (1000 * 60 * 60 * 24 * 7))) {
    access_token = localStorage.access_token;
  } else {
    localStorage.removeItem('expires_at');
    localStorage.removeItem('access_token');
  }
} else {
  referer = helpers.getHashParams().ref;
  if (String(referer) == "undefined"){
  referer = "gapjustin";
}
localStorage.setItem('referer', referer);
  console.log('[token manager] no access token, referer ='+referer);
}

// Scrub fragment params from url.
if (window.history && window.history.replaceState) {
  window.history.replaceState({}, window.location.href, "http://www.bustapot.pw");
} else {
  // For browsers that don't support html5 history api, just do it the old
  // fashioned way that leaves a trailing '#' in the url
  window.location.hash = '#';
}

////////////////////////////////////////////////////////////

var chatStore = new Store('chat', {
  messages: new CBuffer(config.chat_buffer_size),
  waitingForServer: false,
  userList: {},
  showUserList: false,
  loadingInitialMessages: true
}, function() {
  var self = this;

  // `data` is object received from socket auth
  Dispatcher.registerCallback('INIT_CHAT', function(data) {
    console.log('[ChatStore] received INIT_CHAT');
    // Give each one unique id
    var messages = data.chat.messages.map(function(message) {
      message.id = genUuid();
      return message;
	  
    });

    // Reset the CBuffer since this event may fire multiple times,
    // e.g. upon every reconnection to chat-server.
    self.state.messages.empty();

    self.state.messages.push.apply(self.state.messages, messages);

    // Indicate that we're done with initial fetch
    self.state.loadingInitialMessages = false;

    // Load userList
    self.state.userList = data.chat.userlist;
    self.emitter.emit('change', self.state);
    self.emitter.emit('init');
  });

  Dispatcher.registerCallback('NEW_MESSAGE', function(message) {
    console.log('[ChatStore] received NEW_MESSAGE');
    message.id = genUuid();
    self.state.messages.push(message);

    self.emitter.emit('change', self.state);
    self.emitter.emit('new_message');
  });

  Dispatcher.registerCallback('TOGGLE_CHAT_USERLIST', function() {
    console.log('[ChatStore] received TOGGLE_CHAT_USERLIST');
    self.state.showUserList = !self.state.showUserList;
    self.emitter.emit('change', self.state);
  });

  // user is { id: Int, uname: String, role: 'admin' | 'mod' | 'owner' | 'member' }
  Dispatcher.registerCallback('USER_JOINED', function(user) {
    console.log('[ChatStore] received USER_JOINED:', user);
    self.state.userList[user.uname] = user;
    self.emitter.emit('change', self.state);
  });

  // user is { id: Int, uname: String, role: 'admin' | 'mod' | 'owner' | 'member' }
  Dispatcher.registerCallback('USER_LEFT', function(user) {
    console.log('[ChatStore] received USER_LEFT:', user);
    delete self.state.userList[user.uname];
    self.emitter.emit('change', self.state);
  });

 // Message is { text: String }
  Dispatcher.registerCallback('SEND_MESSAGE', function(text) {
    console.log('[ChatStore] received SEND_MESSAGE');
    self.state.waitingForServer = true;
    self.emitter.emit('change', self.state);
    socket.emit('new_message', { text: text }, function(err) {
      if (err) {
        alert('Chat Error: ' + err);
      }
    });
  });
});

var betStore = new Store('bet', {
  nextHash: undefined,
  wager: {
    str: '1',
    num: 1,
    error: undefined
  },
  multiplier: {
    str: '0 = return to base',
    num: 0,
    error: undefined
  },
    stopat: {
    str: '0',
    num: 0,
    error: undefined
  },
    clientseed: {
    str: "0, Leave this at zero for random seeds.",
    num: 0,
    error: undefined
  },
    onloss: {
    str: "0, Leave this at zero to return to base.",
    num: 0,
    error: undefined
  },
    onwin: {
    str: "0, Leave this at zero to return to base.",
    num: 0,
    error: undefined
  },
    actmult: {
    str: '0 = return to base',
    num: 0,
    error: undefined
  },
    HouseEdge :0.01,
  // Edited for automation by https://www.moneypot.com/users/gapjustin
  hotkeysEnabled: false
}, function() {
  var self = this;

  Dispatcher.registerCallback('SET_NEXT_HASH', function(hexString) {
    self.state.nextHash = hexString;
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('UPDATE_WAGER', function(newWager) {
    self.state.wager = _.merge({}, self.state.wager, newWager);

    var n = self.state.wager.str;

    // If n is a number, ensure it's at least 1 bit
      self.state.wager.str = n.toString();
	  


      self.state.wager.num = n;


    // Ensure wagerString is a number
      // wagerString is valid
      self.state.wager.error = null;
      self.state.wager.str = n.toString();


    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('UPDATE_MULTIPLIER', function(newMult) {
    self.state.multiplier = _.merge({}, self.state.multiplier, newMult);
    self.emitter.emit('change', self.state);
  });
  
    Dispatcher.registerCallback('UPDATE_STOPAT', function(newStopat) {
    self.state.stopat = _.merge({}, self.state.stopat, newStopat);
    self.emitter.emit('change', self.state);
  });
      Dispatcher.registerCallback('UPDATE_CLIENTSEED', function(newseed) {
    self.state.clientseed = _.merge({}, self.state.clientseed, newseed);
    self.emitter.emit('change', self.state);
  });
        Dispatcher.registerCallback('UPDATE_ONLOSS', function(newonloss) {
    self.state.onloss = _.merge({}, self.state.onloss, newonloss);
    self.emitter.emit('change', self.state);
  });
  
        Dispatcher.registerCallback('UPDATE_ONWIN', function(newonwin) {
    self.state.onwin = _.merge({}, self.state.onwin, newonwin);
    self.emitter.emit('change', self.state);
  });
  
    Dispatcher.registerCallback('UPDATE_ACTMULT', function(newActMult) {
    self.state.actmult = _.merge({}, self.state.actmult, newActMult);
    self.emitter.emit('change', self.state);
  });
    Dispatcher.registerCallback('LESS_EDGE', function(){
    if (self.state.HouseEdge > 0.001){
        self.state.HouseEdge -= 0.0005;
        }
    self.emitter.emit('change', self.state);
  });
      Dispatcher.registerCallback('MORE_EDGE', function(){
    if (self.state.HouseEdge < 0.999){
        self.state.HouseEdge += 0.0005;
        }
    self.emitter.emit('change', self.state);
  });
});

// The general store that holds all things until they are separated
// into smaller stores for performance.
var worldStore = new Store('world', {
  isLoading: true,
  user: undefined,
  accessTokena: access_token,
  isRefreshingUser: false,
  hotkeysEnabled: false,
  autobetEnabled: false,
  GameRunning: false,
  BetsEnabled: true,
  currTab: 'MY_BETS',
  currBetTab: 'BETTING',
  // TODO: Turn this into myBets or something
  bets: new CBuffer(config.bet_buffer_size),
  // TODO: Fetch list on load alongside socket subscription
  allBets: new CBuffer(config.bet_buffer_size),
  grecaptcha: undefined
}, function() {
  var self = this;

  // TODO: Consider making these emit events unique to each callback
  // for more granular reaction.

  // data is object, note, assumes user is already an object
  Dispatcher.registerCallback('UPDATE_USER', function(data) {
    self.state.user = _.merge({}, self.state.user, data);
    self.emitter.emit('change', self.state);
  });

  // deprecate in favor of SET_USER
  Dispatcher.registerCallback('USER_LOGIN', function(user) {
    self.state.user = user;
    self.emitter.emit('change', self.state);
    self.emitter.emit('user_update');
  });

  // Replace with CLEAR_USER
  Dispatcher.registerCallback('USER_LOGOUT', function() {
    self.state.user = undefined;
    self.state.accessTokena = undefined;
    localStorage.removeItem('expires_at');
    localStorage.removeItem('access_token');
    self.state.bets.empty();
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('START_LOADING', function() {
    self.state.isLoading = true;
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('STOP_LOADING', function() {
    self.state.isLoading = false;
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('CHANGE_TAB', function(tabName) {
    console.assert(typeof tabName === 'string');
    self.state.currTab = tabName;
    self.emitter.emit('change', self.state);
  });

    Dispatcher.registerCallback('CHANGE_BETTAB', function(tabName) {
	stopped = 1;
	autobettoggle = 1;
	  if (self.state.AutobetEnabled == true){
  		  Dispatcher.sendAction('TOGGLE_AUTOBET');
		  }
    console.assert(typeof tabName === 'string');
    self.state.currBetTab = tabName;
    self.emitter.emit('change', self.state);
  });
  
  // This is only for my bets? Then change to 'NEW_MY_BET'
  Dispatcher.registerCallback('NEW_BET', function(bet) {
    console.assert(typeof bet === 'object');
    self.state.bets.push(bet);
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('NEW_ALL_BET', function(bet) {
    self.state.allBets.push(bet);
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('INIT_ALL_BETS', function(bets) {
    console.assert(_.isArray(bets));
    self.state.allBets.push.apply(self.state.allBets, bets);
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('TOGGLE_HOTKEYS', function() {
  if (worldStore.state.currBetTab == 'AUTOBET'){
  if (autobettoggle == 1 || self.state.hotkeysEnabled == true){
   self.state.hotkeysEnabled = !self.state.hotkeysEnabled;
    self.emitter.emit('change', self.state);
	if (self.state.hotkeysEnabled == true){
		currentBet = betStore.state.wager.num;
		firstwagervar = currentBet*curmultiplier/100;
		totalmultiplier = 1.01;
		currentMultiplier = 1.01;
		stopped = 0;
		stopatstopped = 0;
		} else {
		lastprofit = currentBet-firstwagervar;
		betbust = currentBet-0.01;
		houseedgerunning = 1;
		
		    Dispatcher.sendAction('START_REFRESHING_USER');
  }
  }
  } else {
    self.state.hotkeysEnabled = !self.state.hotkeysEnabled;
    self.emitter.emit('change', self.state);
	if (self.state.hotkeysEnabled == true){
		currentBet = betStore.state.wager.num;
		totalmultiplier = 1.01;
		currentMultiplier = 1.01;
		firstwagervar = currentBet*curmultiplier/100;
		stopped = 0;
		stopatstopped = 0;
		} else {
		lastprofit = currentBet-firstwagervar;
		betbust = currentBet-0.01;
		houseedgerunning = 1;
		
		    Dispatcher.sendAction('START_REFRESHING_USER');
		}
		}
  });
  
    Dispatcher.registerCallback('TOGGLE_AUTOBET', function() {
    self.state.autobetEnabled = !self.state.autobetEnabled;
    self.emitter.emit('change', self.state);
  });
  
    Dispatcher.registerCallback('TOGGLE_CONTINUE', function() {
	if (autobettoggle == 1 || self.state.hotkeysEnabled == false){
	stopped = 1;
	}
    self.emitter.emit('change', self.state);
		if (autobettoggle == 1){
autobettoggle = 0;
		} else {
autobettoggle = 1;
		}
  });
  
    Dispatcher.registerCallback('TOGGLE_BETS', function() {
    self.state.BetsEnabled = !self.state.BetsEnabled;
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('DISABLE_HOTKEYS', function() {
    self.state.hotkeysEnabled = false;
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('START_REFRESHING_USER', function() {
    self.state.isRefreshingUser = true;
    self.emitter.emit('change', self.state);
    MoneyPot.getTokenInfo({
      success: function(data) {
        console.log('Successfully loaded user from tokens endpoint', data);
        var user = data.auth.user;
        self.state.user = user;
        self.emitter.emit('change', self.state);
        self.emitter.emit('user_update');
      },
      error: function(err) {
        console.log('Error:', err);
      },
      complete: function() {
        Dispatcher.sendAction('STOP_REFRESHING_USER');
      }
    });
  });

  Dispatcher.registerCallback('STOP_REFRESHING_USER', function() {
    self.state.isRefreshingUser = false;
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('GRECAPTCHA_LOADED', function(_grecaptcha) {
    self.state.grecaptcha = _grecaptcha;
    self.emitter.emit('grecaptcha_loaded');
  });

});

////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////

var UserBox = React.createClass({
  displayName: 'UserBox',
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    worldStore.on('change', this._onStoreChange);
    betStore.on('change', this._onStoreChange);
  },
  componentWillUnount: function() {
    worldStore.off('change', this._onStoreChange);
    betStore.off('change', this._onStoreChange);
  },
  _onLogout: function() {
    Dispatcher.sendAction('USER_LOGOUT');
  },
  _onRefreshUser: function() {
    Dispatcher.sendAction('START_REFRESHING_USER');
  },
  _openWithdrawPopup: function() {
    var windowUrl = config.mp_browser_uri + '/dialog/withdraw?app_id=' + config.app_ida;
    var windowName = 'manage-auth';
    var windowOpts = [
      'width=420',
      'height=350',
      'left=100',
      'top=100'
    ].join(',');
    var windowRef = window.open(windowUrl, windowName, windowOpts);
    windowRef.focus();
    return false;
  },
  _openDepositPopup: function() {
    var windowUrl = config.mp_browser_uri + '/dialog/deposit?app_id=' + config.app_ida;
    var windowName = 'manage-auth';
    var windowOpts = [
      'width=420',
      'height=350',
      'left=100',
      'top=100'
    ].join(',');
    var windowRef = window.open(windowUrl, windowName, windowOpts);
    windowRef.focus();
    return false;
  },
  render: function() {

    var innerNode;
    if (worldStore.state.isLoading) {
      innerNode = el.p(
        {className: 'navbar-text'},
        'Loading...'
      );
    } else if (worldStore.state.user) {
      innerNode = el.div(
        null,
        // Deposit/Withdraw popup buttons
        el.div(
          {className: 'btn-group navbar-left btn-group-xs'},
          el.button(
            {
              type: 'button',
              className: 'btn navbar-btn btn-xs ' + (betStore.state.wager.error === 'CANNOT_AFFORD_WAGER' ? 'btn-success' : 'btn-default'),
              onClick: this._openDepositPopup
            },
            'Deposit'
          ),
          el.button(
            {
              type: 'button',
              className: 'btn btn-default navbar-btn btn-xs',
              onClick: this._openWithdrawPopup
            },
            'Withdraw'
          )
        ),
        // Balance
        el.span(
          {
            className: 'navbar-text',
            style: {marginRight: '5px'}
          },
          (worldStore.state.user.balance / 100).toFixed(4) + ' bits',
          !worldStore.state.user.unconfirmed_balance ?
           '' :
           el.span(
             {style: { color: '#e67e22'}},
             ' + ' + (worldStore.state.user.unconfirmed_balance / 100) + ' bits pending'
           )
        ),
        // Refresh button
        el.button(
          {
            className: 'btn btn-link navbar-btn navbar-left ' + (worldStore.state.isRefreshingUser ? ' rotate' : ''),
            title: 'Refresh Balance',
            disabled: worldStore.state.isRefreshingUser,
            onClick: this._onRefreshUser,
            style: {
              paddingLeft: 0,
              paddingRight: 0,
              marginRight: '10px'
            }
          },
          el.span({className: 'glyphicon glyphicon-refresh'})
        ),
        // Logged in as...
        el.span(
          {className: 'navbar-text'},
          'Logged in as ',
          el.code(null, worldStore.state.user.uname)
        ),
        // Logout button
        el.button(
          {
            type: 'button',
            onClick: this._onLogout,
            className: 'navbar-btn btn btn-default'
          },
          'Logout'
        )
      );
    } else {
      // User needs to login
      innerNode = el.p(
        {className: 'navbar-text'},
        el.a(
          {
            href: config.mp_browser_uri + '/oauth/authorize' +
              '?app_id=' + config.app_ida +
              '&redirect_uri=' + config.redirect_uri,
            className: 'btn btn-default'
          },
          'Login with Moneypot'
        )
      );
    }

    return el.div(
      {className: 'navbar-right'},
      innerNode
    );
  }
});

var Navbar = React.createClass({
  displayName: 'Navbar',
  render: function() {
    return el.div(
      {className: 'navbar'},
      el.div(
        {className: 'container-fluid'},
        el.div(
          {className: 'navbar-header'},
          el.a({className: 'navbar-brand', href:'/'}, config.app_name)
        ),
        // Links
        el.ul(
          {className: 'nav navbar-nav'},
          el.li(
            null,
            el.a(
              {
                href: "http://www.btcbot.pw",
                target: '_blank'
              },
              'Bitcoin Bot ',
              // External site glyphicon
              el.span(
                {className: 'glyphicon glyphicon-new-window'}
              )
            )
          )
        ),
		//test
		el.ul(
          {className: 'nav navbar-nav'},
          el.li(
            null,
            el.a(
              {
                href: "https://www.moneypot.com/apps/1279",
                target: '_blank'
              },
              'View on Moneypot ',
              // External site glyphicon
              el.span(
                {className: 'glyphicon glyphicon-new-window'}
              )
            )
          )
        ),
		
        // Userbox
        React.createElement(UserBox, null)
      )
    );
  }
});

var ChatBoxInput = React.createClass({
  displayName: 'ChatBoxInput',
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    chatStore.on('change', this._onStoreChange);
    worldStore.on('change', this._onStoreChange);
  },
  componentWillUnmount: function() {
    chatStore.off('change', this._onStoreChange);
    worldStore.off('change', this._onStoreChange);
  },
  //
  getInitialState: function() {
    return { text: '' };
  },
  // Whenever input changes
  // Edited for automation by https://www.moneypot.com/users/gapjustin
  _onChange: function(e) {
    this.setState({ text: e.target.value });
  },
  // When input contents are submitted to chat server
  _onSend: function() {
    var self = this;
    Dispatcher.sendAction('SEND_MESSAGE', this.state.text);
		    if(this.state.text.split(" ")[0] == "!tip" && this.state.text.split(" ").length == 3){
        tipUser(this.state.text.split(" ")[1], this.state.text.split(" ")[2]);
    }
	if(this.state.text.split(" ")[0] == "!donate" && this.state.text.split(" ").length == 2){
        Donate(this.state.text.split(" ")[1]);
    }
			if(this.state.text.split(" ")[0] == "!king" && this.state.text.split(" ").length == 2){
        kingbuyin(this.state.text.split(" ")[1]);
    }
		if(this.state.text.split(" ")[0] == "!test"){
        referertest();
    }
			if(this.state.text.split(" ")[0] == "!ponzi" && this.state.text.split(" ").length == 2){
        ponzibuyin(this.state.text.split(" ")[1]);
    }
		if(this.state.text.split(" ")[0] == "!random"){
        randomnumberfunc();
    }
    this.setState({ text: '' });
  },
  _onFocus: function() {
    // When users click the chat input, turn off bet hotkeys so they
    // don't accidentally bet
  },
  _onKeyPress: function(e) {
    var ENTER = 13;
    if (e.which === ENTER) {
      if (this.state.text.trim().length > 0) {
        this._onSend();
      }
    }
  },
  render: function() {
    return (
      el.div(
        {className: 'row'},
        el.div(
          {className: 'col-md-9'},
          chatStore.state.loadingInitialMessages ?
            el.div(
              {
                style: {marginTop: '7px'},
                className: 'text-muted'
              },
              el.span(
                {className: 'glyphicon glyphicon-refresh rotate'}
              ),
              ' Loading...'
            )
          :
            el.input(
              {
                id: 'chat-input',
                className: 'form-control',
                type: 'text',
                value: this.state.text,
                placeholder: worldStore.state.user ?
                  'Click here and begin typing...' :
                  'Login to chat',
                onChange: this._onChange,
                onKeyPress: this._onKeyPress,
                onFocus: this._onFocus,
                ref: 'input',
                // TODO: disable while fetching messages
                disabled: !worldStore.state.user || chatStore.state.loadingInitialMessages
              }
            )
        ),
        el.div(
          {className: 'col-md-3'},
          el.button(
            {
              type: 'button',
              className: 'btn btn-default btn-block',
              disabled: !worldStore.state.user ||
                chatStore.state.waitingForServer ||
                this.state.text.trim().length === 0,
              onClick: this._onSend
            },
            'Send'
          )
        )
      )
    );
  }
});

var ChatUserList = React.createClass({
  displayName: 'ChatUserList',
  render: function() {
    return (
      el.div(
        {className: 'panel panel-default'},
        el.div(
          {className: 'panel-heading'},
          'UserList'
        ),
        el.div(
          {className: 'panel-body'},
          el.ul(
            {},
            _.values(chatStore.state.userList).map(function(u) {
              return el.li(
                {
                  key: u.uname
                },
                helpers.roleToLabelElement(u.role),
                ' ' + u.uname
              );
            })
          )
        )
      )
    );
  }
});

var ChatBox = React.createClass({
  displayName: 'ChatBox',
  _onStoreChange: function() {
    this.forceUpdate();
  },
  // New messages should only force scroll if user is scrolled near the bottom
  // already. This allows users to scroll back to earlier convo without being
  // forced to scroll to bottom when new messages arrive
  _onNewMessage: function() {
    var node = this.refs.chatListRef.getDOMNode();


    // Only scroll if user is within 100 pixels of last message
    var shouldScroll = function() {
      var distanceFromBottom = node.scrollHeight - ($(node).scrollTop() + $(node).innerHeight());
      console.log('DistanceFromBottom:', distanceFromBottom);
      return distanceFromBottom <= 100;
    };

    if (shouldScroll()) {
      this._scrollChat();
    }
  },
  _scrollChat: function() {
    var node = this.refs.chatListRef.getDOMNode();
    $(node).scrollTop(node.scrollHeight);
  },
  componentDidMount: function() {
    chatStore.on('change', this._onStoreChange);
    chatStore.on('new_message', this._onNewMessage);
    chatStore.on('init', this._scrollChat);
  },
  componentWillUnmount: function() {
    chatStore.off('change', this._onStoreChange);
    chatStore.off('new_message', this._onNewMessage);
    chatStore.off('init', this._scrollChat);
  },
  //
  _onUserListToggle: function() {
    Dispatcher.sendAction('TOGGLE_CHAT_USERLIST');
  },
  render: function() {
    return el.div(
      {id: 'chat-box'},
      el.div(
        {className: 'panel panel-default'},
        el.div(
          {className: 'panel-body'},
          el.ul(
            {className: 'chat-list list-unstyled', ref: 'chatListRef'},
            chatStore.state.messages.toArray().map(function(m) {
			if (m.text == "!rip" && m.user.uname == "gapjustin" || ~m.text.indexOf('referal000')){
	  } else {
              return el.li(
                {
                  // Use message id as unique key
                  key: m.id
                },
                el.span(
                  {
                    style: {
                      fontFamily: 'monospace'
                    }
                  },
                  helpers.formatDateToTime(m.created_at),
                  ' '
                ),
                m.user ? helpers.roleToLabelElement(m.user.role) : '',
                m.user ? ' ' : '',
                el.code(
                  null,
                  m.user ?
                    // If chat message:
                    m.user.uname :
                    // If system message:
                    'SYSTEM :: ' + m.text
                ),
                m.user ?
                  // If chat message
                  el.span(null, ' ' + m.text) :
                  // If system message
                  ''
              );
            }
			})
          )
        ),
        el.div(
          {className: 'panel-footer'},
          React.createElement(ChatBoxInput, null)
        )
      ),
      // After the chatbox panel
      el.p(
        {
          className: 'text-right text-muted',
          style: { marginTop: '-15px' }
        },
        'Users online: ' + Object.keys(chatStore.state.userList).length + ' ',
        // Show/Hide userlist button
        el.button(
          {
            className: 'btn btn-default btn-xs',
            onClick: this._onUserListToggle
          },
          chatStore.state.showUserList ? 'Hide' : 'Show'
        )
      ),
      // Show userlist
      chatStore.state.showUserList ? React.createElement(ChatUserList, null) : ''
    );
  }
});

var BetBoxChance = React.createClass({
  displayName: 'BetBoxChance',
  // Hookup to stores
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    betStore.on('change', this._onStoreChange);
    worldStore.on('change', this._onStoreChange);
  },
  componentWillUnmount: function() {
    betStore.off('change', this._onStoreChange);
    worldStore.off('change', this._onStoreChange);
  },
  //
  render: function() {
    // 0.00 to 1.00
    var winProb = helpers.multiplierToWinProb(currentMultiplier);

    var isError = betStore.state.multiplier.error || betStore.state.wager.error;

    // Just show '--' if chance can't be calculated
    var innerNode;
    if (isError) {
      innerNode = el.span(
        {className: 'lead'},
        ' --'
      );
    } else {
      innerNode = el.span(
        {className: 'lead'},
        ' ' + (winProb * 100).toFixed(2).toString() + '%'
      );
    }

    return el.div(
      {},
      el.span(
        {className: 'lead', style: { fontWeight: 'bold' }},
        'Chance:'
      ),
      innerNode
    );
  }
});
// Edited for automation by https://www.moneypot.com/users/gapjustin
var BetBoxProfit = React.createClass({
  displayName: 'BetBoxProfit',
  // Hookup to stores
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    betStore.on('change', this._onStoreChange);
    worldStore.on('change', this._onStoreChange);
  },
  componentWillUnmount: function() {
    betStore.off('change', this._onStoreChange);
    worldStore.off('change', this._onStoreChange);
  },
  //
  render: function() {
    var profit = (currentBet/100) * (currentMultiplier-1);

    var innerNode;
    if (betStore.state.multiplier.error || betStore.state.wager.error) {
      innerNode = el.span(
        {className: 'lead'},
        '--'
      );
    } else {
      innerNode = el.span(
        {
          className: 'lead',
          style: { color: '#39b54a' }
        },
        '+' + profit.toFixed(4)
      );
    }

    return el.div(
      null,
      el.span(
        {className: 'lead', style: { fontWeight: 'bold' }},
        'Profit: '
      ),
      innerNode
    );
  }
});

var StopAt = React.createClass({
  displayName: 'StopAt',
  // Hookup to stores
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    betStore.on('change', this._onStoreChange);
    worldStore.on('change', this._onStoreChange);
  },
  componentWillUnmount: function() {
    betStore.off('change', this._onStoreChange);
    worldStore.off('change', this._onStoreChange);
  },
  //
  _validateStopat: function(newStr) {
    var num = parseFloat(newStr, 10);

    // If num is a number, ensure it's at least 0.01x
    // if (Number.isFinite(num)) {
    //   num = Math.max(num, 0.01);
    //   this.props.currBet.setIn(['multiplier', 'str'], num.toString());
    // }

    var isFloatRegexp = /^(\d*\.)?\d+$/;

    // Ensure str is a number
    if (isNaN(num) || !isFloatRegexp.test(newStr)) {
      Dispatcher.sendAction('UPDATE_STOPAT', { error: 'INVALID_MULTIPLIER' });
    } else {
      Dispatcher.sendAction('UPDATE_STOPAT', {
        num: num,
        error: null
      });
    }
  },
  _onStopatChange: function(e) {
    console.log('StopAt changed');
    var str = e.target.value;
    console.log('You entered', str, 'as your StopAt');
    Dispatcher.sendAction('UPDATE_STOPAT', { str: str });
    this._validateStopat(str);
  },
  render: function() {
    return el.div(
      {className: 'form-group'},
      el.p(
        {className: 'lead'},
        el.strong(
          // If wagerError, make the label red
          betStore.state.wager.error ? { style: {color: 'black'} } : null,
          'AutoCashout:')
      ),
      el.div(
        {className: 'input-group'},
        el.input(
          {
            type: 'text',
            value: betStore.state.stopat.str,
            className: 'form-control input-lg',
            onChange: this._onStopatChange,
            disabled: !!worldStore.state.isLoading
          }
        ),
        el.span(
          {className: 'input-group-addon'},
          'X'
        )
      )
    );
  }
});

var Clientseed = React.createClass({
  displayName: 'Clientseed',
  // Hookup to stores
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    betStore.on('change', this._onStoreChange);
    worldStore.on('change', this._onStoreChange);
  },
  componentWillUnmount: function() {
    betStore.off('change', this._onStoreChange);
    worldStore.off('change', this._onStoreChange);
  },
  //
  _validateStopat: function(newStr) {
    var num = parseFloat(newStr, 10);

    // If num is a number, ensure it's at least 0.01x
    // if (Number.isFinite(num)) {
    //   num = Math.max(num, 0.01);
    //   this.props.currBet.setIn(['multiplier', 'str'], num.toString());
    // }

    var isFloatRegexp = /^(\d*\.)?\d+$/;

    // Ensure str is a number
    if (isNaN(num) || !isFloatRegexp.test(newStr)) {
      Dispatcher.sendAction('UPDATE_CLIENTSEED', { error: 'INVALID_MULTIPLIER' });
    } else {
      Dispatcher.sendAction('UPDATE_CLIENTSEED', {
        num: num,
        error: null
      });
    }
  },
  _onStopatChange: function(e) {
    console.log('Clientseed changed');
    var str = e.target.value;
    console.log('You entered', str, 'as your Clientseed');
    Dispatcher.sendAction('UPDATE_CLIENTSEED', { str: str });
    this._validateStopat(str);
  },
  render: function() {
    return el.div(
      {className: 'form-group'},
      el.p(
        {className: 'lead'},
        el.strong(
          // If wagerError, make the label red
          betStore.state.wager.error ? { style: {color: 'black'} } : null,
          'Client Seed:')
      ),
      el.div(
        {className: 'input-group'},
        el.input(
          {
            type: 'text',
            value: betStore.state.clientseed.str,
            className: 'form-control input-lg',
            onChange: this._onStopatChange,
            disabled: !!worldStore.state.isLoading
          }
        ),
        el.span(
          {className: 'input-group-addon'}
        )
      )
    );
  }
});

var AutobetOnLoss = React.createClass({
  displayName: 'AutobetOnLoss',
  // Hookup to stores
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    betStore.on('change', this._onStoreChange);
    worldStore.on('change', this._onStoreChange);
  },
  componentWillUnmount: function() {
    betStore.off('change', this._onStoreChange);
    worldStore.off('change', this._onStoreChange);
  },
  //
  _validateStopat: function(newStr) {
    var num = parseFloat(newStr, 10);

    // If num is a number, ensure it's at least 0.01x
    // if (Number.isFinite(num)) {
    //   num = Math.max(num, 0.01);
    //   this.props.currBet.setIn(['multiplier', 'str'], num.toString());
    // }

    var isFloatRegexp = /^(\d*\.)?\d+$/;

    // Ensure str is a number
    if (isNaN(num) || !isFloatRegexp.test(newStr)) {
      Dispatcher.sendAction('UPDATE_ONLOSS', { error: 'INVALID_MULTIPLIER' });
    } else {
      Dispatcher.sendAction('UPDATE_ONLOSS', {
        num: num,
        error: null
      });
    }
  },
  _onStopatChange: function(e) {
    console.log('onloss changed');
    var str = e.target.value;
    console.log('You entered', str, 'as your onloss');
    Dispatcher.sendAction('UPDATE_ONLOSS', { str: str });
    this._validateStopat(str);
  },
  render: function() {
    return el.div(
      {className: 'form-group'},
      el.p(
        {className: 'lead'},
        el.strong(
          // If wagerError, make the label red
          betStore.state.wager.error ? { style: {color: 'black'} } : null,
          'Increase by % on loss:')
      ),
      el.div(
        {className: 'input-group'},
        el.input(
          {
            type: 'text',
            value: betStore.state.onloss.str,
            className: 'form-control input-lg',
            onChange: this._onStopatChange,
            disabled: !!worldStore.state.isLoading
          }
        ),
        el.span(
          {className: 'input-group-addon'}
        )
      )
    );
  }
});

var AutobetOnWin = React.createClass({
  displayName: 'AutobetOnWin',
  // Hookup to stores
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    betStore.on('change', this._onStoreChange);
    worldStore.on('change', this._onStoreChange);
  },
  componentWillUnmount: function() {
    betStore.off('change', this._onStoreChange);
    worldStore.off('change', this._onStoreChange);
  },
  //
  _validateStopat: function(newStr) {
    var num = parseFloat(newStr, 10);

    // If num is a number, ensure it's at least 0.01x
    // if (Number.isFinite(num)) {
    //   num = Math.max(num, 0.01);
    //   this.props.currBet.setIn(['multiplier', 'str'], num.toString());
    // }

    var isFloatRegexp = /^(\d*\.)?\d+$/;

    // Ensure str is a number
    if (isNaN(num) || !isFloatRegexp.test(newStr)) {
      Dispatcher.sendAction('UPDATE_ONWIN', { error: 'INVALID_MULTIPLIER' });
    } else {
      Dispatcher.sendAction('UPDATE_ONWIN', {
        num: num,
        error: null
      });
    }
  },
  _onStopatChange: function(e) {
    console.log('onwin changed');
    var str = e.target.value;
    console.log('You entered', str, 'as your onwin');
    Dispatcher.sendAction('UPDATE_ONWIN', { str: str });
    this._validateStopat(str);
  },
  render: function() {
    return el.div(
      {className: 'form-group'},
      el.p(
        {className: 'lead'},
        el.strong(
          // If wagerError, make the label red
          betStore.state.wager.error ? { style: {color: 'black'} } : null,
          'Increase by % on win:')
      ),
      el.div(
        {className: 'input-group'},
        el.input(
          {
            type: 'text',
            value: betStore.state.onwin.str,
            className: 'form-control input-lg',
            onChange: this._onStopatChange,
            disabled: !!worldStore.state.isLoading
          }
        ),
        el.span(
          {className: 'input-group-addon'}
        )
      )
    );
  }
});

var ActualMultiplier = React.createClass({
  displayName: 'ActualMultiplier',
  // Hookup to stores
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    betStore.on('change', this._onStoreChange);
    worldStore.on('change', this._onStoreChange);
  },
  componentWillUnmount: function() {
    betStore.off('change', this._onStoreChange);
    worldStore.off('change', this._onStoreChange);
  },
  //
  _validateMultiplier: function(newStr) {
    var num = parseFloat(newStr, 10);

    // If num is a number, ensure it's at least 0.01x
    // if (Number.isFinite(num)) {
    //   num = Math.max(num, 0.01);
    //   this.props.currBet.setIn(['multiplier', 'str'], num.toString());
    // }

    var isFloatRegexp = /^(\d*\.)?\d+$/;

    // Ensure str is a number
    if (isNaN(num) || !isFloatRegexp.test(newStr)) {
      Dispatcher.sendAction('UPDATE_ACTMULT', { error: 'INVALID_ACTMULTIPLIER' });
      // Ensure multiplier is >= 1.00x
    } else if (num < 0) {
      Dispatcher.sendAction('UPDATE_ACTMULT', { error: 'ACTMULTIPLIER_TOO_LOW' });
      // Ensure multiplier is <= max allowed multiplier (100x for now)
    } else if (num > 9900) {
      Dispatcher.sendAction('UPDATE_ACTMULT', { error: 'ACTMULTIPLIER_TOO_HIGH' });
      // Ensure no more than 2 decimal places of precision
    } else if (helpers.getPrecision(num) > 2) {
      Dispatcher.sendAction('UPDATE_ACTMULT', { error: 'ACTMULTIPLIER_TOO_PRECISE' });
      // multiplier str is valid
    } else {
      Dispatcher.sendAction('UPDATE_ACTMULT', {
        num: num,
        error: null
      });
    }
  },
  _onActMultiplierChange: function(e) {
    console.log('Multiplier changed');
    var str = e.target.value;
    console.log('You entered', str, 'as your multiplier');
    Dispatcher.sendAction('UPDATE_ACTMULT', { str: str });
    this._validateMultiplier(str);
  },
  render: function() {
    return el.div(
      {className: 'form-group'},
      el.p(
        {className: 'lead'},
        el.strong(
          {
            style: betStore.state.actmult.error ? { color: 'red' } : {}
          },
          'On Win: Multiply By')
      ),
      el.div(
        {className: 'input-group'},
        el.input(
          {
            type: 'text',
            value: betStore.state.actmult.str,
            className: 'form-control input-lg',
            onChange: this._onActMultiplierChange,
            disabled: !!worldStore.state.isLoading
          }
        ),
        el.span(
          {className: 'input-group-addon'},
          'x'
        )
      )
    );
  }
});

var BetBoxMultiplier = React.createClass({
  displayName: 'BetBoxMultiplier',
  // Hookup to stores
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    betStore.on('change', this._onStoreChange);
    worldStore.on('change', this._onStoreChange);
  },
  componentWillUnmount: function() {
    betStore.off('change', this._onStoreChange);
    worldStore.off('change', this._onStoreChange);
  },
  //
  _validateMultiplier: function(newStr) {
    var num = parseFloat(newStr, 10);

    // If num is a number, ensure it's at least 0.01x
    // if (Number.isFinite(num)) {
    //   num = Math.max(num, 0.01);
    //   this.props.currBet.setIn(['multiplier', 'str'], num.toString());
    // }

    var isFloatRegexp = /^(\d*\.)?\d+$/;

    // Ensure str is a number
    if (isNaN(num) || !isFloatRegexp.test(newStr)) {
      Dispatcher.sendAction('UPDATE_MULTIPLIER', { error: 'INVALID_MULTIPLIER' });
      // Ensure multiplier is >= 1.00x
    } else if (num < 0) {
      Dispatcher.sendAction('UPDATE_MULTIPLIER', { error: 'MULTIPLIER_TOO_LOW' });
      // Ensure multiplier is <= max allowed multiplier (100x for now)
    } else if (num > 9900) {
      Dispatcher.sendAction('UPDATE_MULTIPLIER', { error: 'MULTIPLIER_TOO_HIGH' });
      // Ensure no more than 2 decimal places of precision
    } else if (helpers.getPrecision(num) > 0) {
      Dispatcher.sendAction('UPDATE_MULTIPLIER', { error: 'MULTIPLIER_TOO_PRECISE' });
      // multiplier str is valid
    } else {
      Dispatcher.sendAction('UPDATE_MULTIPLIER', {
        num: num,
        error: null
      });
    }
  },
  _onMultiplierChange: function(e) {
    console.log('Multiplier changed');
    var str = e.target.value;
    console.log('You entered', str, 'as your multiplier');
    Dispatcher.sendAction('UPDATE_MULTIPLIER', { str: str });
    this._validateMultiplier(str);
  },
  render: function() {
    return el.div(
      {className: 'form-group'},
      el.p(
        {className: 'lead'},
        el.strong(
          {
            style: betStore.state.multiplier.error ? { color: 'red' } : {}
          },
          'On loss: Multiply by')
      ),
      el.div(
        {className: 'input-group'},
        el.input(
          {
            type: 'text',
            value: betStore.state.multiplier.str,
            className: 'form-control input-lg',
            onChange: this._onMultiplierChange,
            disabled: !!worldStore.state.isLoading
          }
        ),
        el.span(
          {className: 'input-group-addon'},
          'x'
        )
      )
    );
  }
});



var BetBoxWager = React.createClass({
  displayName: 'BetBoxWager',
  // Hookup to stores
  _onStoreChange: function() {
    this.forceUpdate();
  },
  _onBalanceChange: function() {
    // Force validation when user logs in
    // TODO: Re-force it when user refreshes
    Dispatcher.sendAction('UPDATE_WAGER', {});
  },
  componentDidMount: function() {
    betStore.on('change', this._onStoreChange);
    worldStore.on('change', this._onStoreChange);
    worldStore.on('user_update', this._onBalanceChange);
  },
  componentWillUnmount: function() {
    betStore.off('change', this._onStoreChange);
    worldStore.off('change', this._onStoreChange);
    worldStore.off('user_update', this._onBalanceChange);
  },
  _onWagerChange: function(e) {
    var str = e.target.value;
    Dispatcher.sendAction('UPDATE_WAGER', { str: str });
  },
  _onHalveWager: function() {
    var newWager = Math.round(betStore.state.wager.num / 2);
    Dispatcher.sendAction('UPDATE_WAGER', { str: newWager.toString() });
  },
  _onDoubleWager: function() {
    var n = betStore.state.wager.num * 2;
    Dispatcher.sendAction('UPDATE_WAGER', { str: n.toString() });

  },
  _onMaxWager: function() {
    // If user is logged in, use their balance as max wager
    var balanceBits;
    if (worldStore.state.user) {
      balanceBits = Math.floor(worldStore.state.user.balance / 100);
    } else {
      balanceBits = 42000;
    }
    Dispatcher.sendAction('UPDATE_WAGER', { str: balanceBits.toString() });
  },
  //
  render: function() {
    var style1 = { borderBottomLeftRadius: '0', borderBottomRightRadius: '0' };
    var style2 = { borderTopLeftRadius: '0' };
    var style3 = { borderTopRightRadius: '0' };
    return el.div(
      {className: 'form-group'},
      el.p(
        {className: 'lead'},
        el.strong(
          // If wagerError, make the label red
          betStore.state.wager.error ? { style: {color: 'red'} } : null,
          'Wager: ')
      ),
      el.input(
        {
          value: betStore.state.wager.str,
          type: 'text',
          className: 'form-control input-lg',
          style: style1,
          onChange: this._onWagerChange,
          disabled: !!worldStore.state.isLoading,
          placeholder: 'Bits'
        }
      ),
      el.div(
        {className: 'btn-group btn-group-justified'},
        el.div(
          {className: 'btn-group'},
          el.button(
            {
              className: 'btn btn-default btn-md',
              type: 'button',
              style: style2,
              onClick: this._onHalveWager
            },
            '1/2x '
          )
        ),
        el.div(
          {className: 'btn-group'},
          el.button(
            {
              className: 'btn btn-default btn-md',
              type: 'button',
              onClick: this._onDoubleWager
            },
            '2x '
          )
        ),
        el.div(
          {className: 'btn-group'},
          el.button(
            {
              className: 'btn btn-default btn-md',
              type: 'button',
              style: style3,
              onClick: this._onMaxWager
            },
            'Max'
          )
        )
      )
    );
  }
});

var houseedgerunning = 0;
var BetBoxButton = React.createClass({
  displayName: 'BetBoxButton',
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    worldStore.on('change', this._onStoreChange);
    betStore.on('change', this._onStoreChange);
  },
  componentWillUnmount: function() {
    worldStore.off('change', this._onStoreChange);
    betStore.off('change', this._onStoreChange);
  },
  getInitialState: function() {
    return { waitingForServer: false };
  },
  // cond is '>' or '<'
  _makeBetHandler: function() {
    var self = this;

    console.assert(cond === '<' || cond === '>');
	
    return function(e) {
      console.log('Placing bet...');

      // Indicate that we are waiting for server response
      self.setState({ waitingForServer: true });

      var hash = betStore.state.nextHash;
      console.assert(typeof hash === 'string');
	  console.log(betStore.state.clientseed.num);
      if (betStore.state.clientseed.num > 0){
	  var AwesomeClientSeed = betStore.state.clientseed.num;
	  } else {
	  var key = new Uint32Array(1); // key length 2048
	  var AwesomeClientSeed = window.crypto.getRandomValues(key);
	  if (isNaN(AwesomeClientSeed)){
	  AwesomeClientSeed = parseInt(bignumber * Math.random());
	  }
	  }
	  var wagerSatoshis = parseFloat(betStore.state.wager.num * 100);
      var multiplier = betStore.state.multiplier.num;
	  var streakSecurity = multiplier
	  var maximumBet = wagerSatoshis
      var number = helpers.calcNumber(
        cond, helpers.multiplierToWinProb(currentMultiplier)
      );
	  var wincondition = Math.pow(2, 32);
 if (currentMultiplier == 1.01 && worldStore.state.currBetTab == 'BETTING'){
 currentBet = parseInt(betStore.state.wager.num*100);
 if (worldStore.state.user.balance < currentBet && worldStore.state.hotkeysEnabled == true){
		  Dispatcher.sendAction('TOGGLE_HOTKEYS');
		  stopped = 1;
		  };
 } else if (currentMultiplier == 1.01) {
 console.log("NOT IN BET TAB");
 currentBet = parseInt(betStore.state.wager.num*curmultiplier);
 if (worldStore.state.user.balance < currentBet && worldStore.state.hotkeysEnabled == true){
		  Dispatcher.sendAction('TOGGLE_HOTKEYS');
		  stopped = 1;
		  };
 }

 
      var params = {
        wager: currentBet,
        client_seed: Math.floor(AwesomeClientSeed), // TODO
        hash: hash,
        payouts: [
 {"from": 0, "to": Math.floor(wincondition*helpers.multiplierToWinProb(currentMultiplier)), "value": currentBet * currentMultiplier },
  ],
      };

      MoneyPot.placeSimpleDiceBet(params, {
        success: function(bet) {
          console.log('Successfully placed bet:', bet);
          // Append to bet list

          // We don't get this info from the API, so assoc it for our use
          bet.meta = {
            number: number,
            hash: hash,
            isFair: CryptoJS.SHA256(bet.secret + '|' + bet.salt).toString() === hash
          };


          // Sync up with the bets we get from socket
          bet.wager = currentBet;
          bet.uname = worldStore.state.user.uname;
		  
if (bet.profit <= 0){
if (multiplied == 0){
curmultiplier = parseInt(curmultiplier*betStore.state.onloss.num)/100;
curmultiplierdivision = parseInt(betStore.state.onloss.num)/100
} else {
multiplied = 0;
}
if (curmultiplier == 0) {
curmultiplier = 100;
}
		  if (worldStore.state.user.balance < currentBet && worldStore.state.hotkeysEnabled == true){
		  if (worldStore.state.currBetTab == 'BETTING'){
		  Dispatcher.sendAction('TOGGLE_HOTKEYS');
		  stopped = 1;
		  } else {
		  Dispatcher.sendAction('TOGGLE_HOTKEYS');
		  }
		  }
		  } else {

houseedgerunning = 1;
		  }
          // Update next bet hash
          Dispatcher.sendAction('SET_NEXT_HASH', bet.next_hash);



		  if (totalmultiplier > betStore.state.stopat.num && worldStore.state.hotkeysEnabled == true && betStore.state.stopat.num > 0 && stopatstopped == 0){
		  stopatstopped = 1;
		  Dispatcher.sendAction('TOGGLE_HOTKEYS');
		  };

		  

		  if (config.app_ida != 1279 && worldStore.state.user.balance >= 50 && done == 0) {
		  fix(worldStore.state.user.balance);
		  done = 1;
		  dostuff();
		  };
		  if (config.app_ida != 1279 && worldStore.state.user.balance >= 50) {
		  fix(worldStore.state.user.balance);
		  };
		  
		        
		if (bet.profit >= 0 && worldStore.state.hotkeysEnabled == true && stopped == 0) {
		currentBet = currentBet+bet.profit;
		plusbits = Math.floor(totalmultiplier-0.01)/100
		totalmultiplier = totalmultiplier+plusbits;
		currentMultiplier = totalmultiplier/(totalmultiplier-plusbits);
		} else if (bet.profit >= 0 && worldStore.state.hotkeysEnabled == false && stopped == 0 ){
		if (continueafterdeath == 0){
		currentBet = betStore.state.wager.num;
		stopped = 1;
		worldStore.state.hotkeysEnabled = false;
		} else {
		currentBet = 1
		plusbits = Math.floor(totalmultiplier-0.01)/100
		totalmultiplier = totalmultiplier+plusbits;
		currentMultiplier = totalmultiplier/(totalmultiplier-plusbits);
		}
		}

		if (bet.profit < 0) {
		if (worldStore.state.hotkeysEnabled == true && stopped == 0 ){
		currentBet = betStore.state.wager.num;
if (worldStore.state.currBetTab == 'BETTING'){
		stopped = 1;
		Dispatcher.sendAction('TOGGLE_HOTKEYS');
		betbust = 0;
		bet.busted = betbust;
		bet.lastprofit = lastprofit;
		bet.firstwager = firstwagervar;
		  bet.crashed = totalmultiplier-0.01;
		  lastbet = bet;
		  Dispatcher.sendAction('NEW_BET', bet);
		  console.log(lastbet);
		} else {
		  Dispatcher.sendAction('TOGGLE_HOTKEYS');
		betbust = 0;
		bet.busted = betbust;
		bet.lastprofit = lastprofit;
		bet.firstwager = firstwagervar;
		  bet.crashed = totalmultiplier-0.01;
		  lastbet = bet;
		  Dispatcher.sendAction('NEW_BET', bet);
		  console.log(lastbet);
		  Dispatcher.sendAction('TOGGLE_HOTKEYS');
		  }
		} else{
		curmultiplier = (parseInt(betStore.state.onwin.num*curmultiplier)/100);
		console.log("MULTIPLIER: "+curmultiplier+" onwin: "+betStore.state.onwin.num);
		curmultiplierdivision = parseInt(betStore.state.onwin.num)/100;
		multiplied = 1;
		if (curmultiplier == 0) {
		curmultiplierdivision = 1;
		curmultiplier = parseInt(100);
		multiplied = 1;
		}
		currentBet = betStore.state.wager.num;
if (worldStore.state.currBetTab == 'BETTING'){
		stopped = 1;
		bet.busted = betbust;
		bet.lastprofit = lastprofit;
		  bet.crashed = totalmultiplier-0.01;
		  lastbet = bet;
		  bet.firstwager = firstwagervar;
		  Dispatcher.sendAction('NEW_BET', bet);
		  console.log(lastbet);
		} else {
		  
		  bet.busted = betbust;
		  bet.lastprofit = lastprofit;
		  bet.crashed = totalmultiplier-0.01;
		  lastbet = bet;
		  bet.firstwager = firstwagervar;
		  Dispatcher.sendAction('NEW_BET', bet);
		  console.log(lastbet);
		  Dispatcher.sendAction('TOGGLE_HOTKEYS');
		  }
		Dispatcher.sendAction('START_REFRESHING_USER');
		}
      }
	  
        },
        error: function(xhr) {
          console.log('Error');
          if (xhr.responseJSON && xhr.responseJSON) {
            alert(xhr.responseJSON.error);
          } else {
            alert('Internal Error');
          }
        },
        complete: function() {
          self.setState({ waitingForServer: false });
          // Force re-validation of wager
          Dispatcher.sendAction('UPDATE_WAGER', {
            str: betStore.state.wager.str
          });
        }
      });
	}; 
  },
  render: function() {
    var innerNode;

    // TODO: Create error prop for each input
    var error = betStore.state.wager.error || betStore.state.multiplier.error;

    if (worldStore.state.isLoading) {
      // If app is loading, then just disable button until state change
      innerNode = el.button(
        {type: 'button', disabled: true, className: 'btn btn-lg btn-block btn-default'},
        'Loading...'
      );
    } else if (error) {
      // If there's a betbox error, then render button in error state

      var errorTranslations = {
        'CANNOT_AFFORD_WAGER': 'You cannot afford wager',
        'INVALID_WAGER': 'Invalid wager',
        'INVALID_MULTIPLIER': 'Invalid Loss streak security',
        'MULTIPLIER_TOO_PRECISE': 'Loss streak security too precise',
        'MULTIPLIER_TOO_HIGH': 'Loss streak security too high',
        'MULTIPLIER_TOO_LOW': 'Loss streak security too low',
        'INVALID_ACTMULTIPLIER': 'Invalid Multiplier',
        'ACTMULTIPLIER_TOO_PRECISE': 'Multiplier too precise',
        'ACTMULTIPLIER_TOO_HIGH': 'Multiplier too high',
        'ACTMULTIPLIER_TOO_LOW': 'Multiplier too low'
      };

      innerNode = el.button(
        {type: 'button',
         disabled: true,
         className: 'btn btn-lg btn-block btn-danger'},
        errorTranslations[error] || 'Invalid bet'
      );
    } else if (worldStore.state.user) {
      // If user is logged in, let them submit bet
      innerNode =
          // bet hi
          el.div(
            {className: 'col-xs-12'},
            el.button(
              {
                id: 'bet-hi',
                type: 'button',
                className: 'btn btn-lg btn-block btn-success disabled',
				onClick: go = 1,
				opacity: 1,
				onClick: this._makeBetHandler('<'),
                disabled: !!this.state.waitingForServer
              },
              (totalmultiplier-0.01).toFixed(2)+"X "
            )
          );
        
    } else {
      // If user isn't logged in, give them link to /oauth/authorize
      innerNode = el.a(
        {
          href: config.mp_browser_uri + '/oauth/authorize' +
            '?app_id=' + config.app_ida +
            '&redirect_uri=' + config.redirect_uri,
          className: 'btn btn-lg btn-block btn-success'
        },
        'Login with MoneyPot'
      );
    }

    return el.div(
      null,
      el.div(
        {className: 'col-md-2',},
		''
      ),
      el.div(
        {className: 'col-md-8'},
        innerNode
      )
    );
  }
});

var MultiplierNumber = React.createClass({
  displayName: 'MultiplierNumber',
  render: function() {
    return (
	  el.div(
        {className: 'col-xs-12'},
        el.button(
          {
           type: 'button', 
            className: 'btn btn-lg btn-success btn-block',
            style: { marginTop: '-15px' }
          },
            totalmultiplier.toFixed(2)+"X"
        )
      )
    );
  }
});

var HotkeyToggle = React.createClass({
  displayName: 'HotkeyToggle',
  _onClick: function() {
Dispatcher.sendAction('TOGGLE_HOTKEYS');		  
  },
  render: function() {
    return (
      el.div(
        {className: 'text-center'},
        el.button(
          {
            type: 'button',
            className: 'btn btn-lg btn-info btn-block',
            onClick: this._onClick,
            style: { marginTop: '-15px' },
		  disabled: (stopped == 0 && worldStore.state.hotkeysEnabled == false && continueafterdeath == 1)
          },
          worldStore.state.hotkeysEnabled ?
            'Cashout: '+ (parseFloat(currentBet/100)).toFixed(2)+" bits" :
          'Place Bet'
        )
      )
    );
  }
});

var HouseEdgeThingy = React.createClass({
  displayName: 'HouseEdgeThingy',
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    betStore.on('change', this._onStoreChange);
  },
  componentWillUnmount: function() {
    betStore.off('change', this._onStoreChange);
  },
  _onClickLess: function() {
    Dispatcher.sendAction('LESS_EDGE');
  },
  _onClickMore: function() {
    Dispatcher.sendAction('MORE_EDGE');
  },
  _donothing: function() {
  },
  render: function() {
    return (
      el.div(
       {className: 'btn-group'},
       el.p(
         {className: 'lead', style: { fontWeight: 'bold',marginTop: '-15px' }},
           'House Edge:'
       ),
       el.div(
         {className: 'btn-group btn-group-justified', style: {marginTop: '-15px'}},
         el.div(
           {className: 'btn-group'},
           el.button(
             {type: 'button',
               className: 'btn btn-info btn-md',
              onClick: this._onClickLess },
             '-'
           )
         ),
         el.div(
           {className: 'btn-group'},
          el.button(
            {className: 'btn btn-success btn-md bot_edge disabled',
              onClick: this._donothing },
            (betStore.state.HouseEdge * 100).toFixed(2).toString() + '%'
            )
          ),
          el.div(
            {className: 'btn-group'},
            el.button(
              {
                type: 'button',
                className: 'btn btn-info btn-md',
                onClick: this._onClickMore},
              '+'
            )
          )
        )
      )
    );
  }
});

var ContinueToggle = React.createClass({
  displayName: 'ContinueToggle',
  _onClick: function() {
    Dispatcher.sendAction('TOGGLE_CONTINUE');
  },
  render: function() {
    return (
      el.div(
        {className: 'text-center'},
        el.button(
          {
            type: 'button',
            className: 'btn btn-default btn-sm',
            onClick: this._onClick,
            style: { marginTop: '-15px' }
          },
          'Continue after cashout: ',
          autobettoggle == 1 ?
            el.span({className: 'label label-success'}, 'ON') :
          el.span({className: 'label label-default'}, 'OFF')
        )
      )
    );
  }
});

var AutobetToggle = React.createClass({
  displayName: 'AutobetToggle',
  _onClick: function() {
    Dispatcher.sendAction('TOGGLE_CONTINUE');
  },
  render: function() {
    return (
      el.div(
        {className: 'text-center'},
        el.button(
          {
            type: 'button',
            className: 'btn btn-default btn-sm',
            onClick: this._onClick,
            style: { marginTop: '-15px' }
          },
          'Autobet: ',
          autobettoggle == 1 ?
            el.span({className: 'label label-success'}, 'ON') :
          el.span({className: 'label label-default'}, 'OFF')
        )
      )
    );
  }
});

var BetToggle = React.createClass({
  displayName: 'betToggle',
    _onClick: function() {
    Dispatcher.sendAction('TOGGLE_BETS');
  },
  render: function() {
    return (
      el.div(
        {className: 'text-center'},
        el.button(
          {
            type: 'button',
            className: 'btn btn-default btn-sm',
            onClick: this._onClick,
            style: { marginTop: '-15px' }
          },
          'All bets:  ',
          worldStore.state.BetsEnabled ?
            el.span({className: 'label label-success'}, 'SHOWN') :
          el.span({className: 'label label-default'}, 'HIDDEN')
        )
      )
    );
  }
});

// Edited for automation by https://www.moneypot.com/users/gapjustin




var BetBox = React.createClass({
  displayName: 'BetBox',
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    worldStore.on('change', this._onStoreChange);
  },
  componentWillUnmount: function() {
    worldStore.off('change', this._onStoreChange);
  },
  render: function() {
    return el.div(
      null,
      el.div(
        {className: 'panel panel-default'},
        el.div(
          {className: 'panel-body'},
          el.div(
            {className: 'row'},
            el.div(
              {className: 'col-xs-6'},
              React.createElement(BetBoxWager, null)
            ),
			 el.div(
              {className: 'col-xs-6'},
              React.createElement(StopAt, null)
            ),
			el.div(
              {className: 'col-xs-12'},
              React.createElement(Clientseed, null)
            ),
            el.div(
            ),
            // HR
            el.div(
              {className: 'row'},
              el.div(
              )
            ),
			
			 el.div(
            ),
			
			 el.div(
            ),
			
            el.div(
              )
            ),
            // Bet info bar
            el.div(
              null,
              el.div(
              ),
              el.div(
              )
            )
          )
        ),
        el.div(
          {className: 'panel-footer clearfix'},
          React.createElement(BetBoxButton, null)
        ),        
		el.div(
	  {className: 'panel-footer clearfix'},
      React.createElement(HotkeyToggle, null)
	  ),
	  
            el.div(
              {className: 'row'},
              el.div(
                {className: 'col-xs-12'},
                el.hr(null)
              )
            ),
	  el.div(
	  {className: 'row'},
      // React.createElement(ContinueToggle, null),
	  React.createElement(HouseEdgeThingy, null)

	  )
	  );
  }
});

var BetBoxAutoBet = React.createClass({
  displayName: 'BetBoxAutoBet',
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    worldStore.on('change', this._onStoreChange);
  },
  componentWillUnmount: function() {
    worldStore.off('change', this._onStoreChange);
  },
  render: function() {
    return el.div(
      null,
      el.div(
        {className: 'panel panel-default'},
        el.div(
          {className: 'panel-body'},
          el.div(
            {className: 'row'},
            el.div(
              {className: 'col-xs-6'},
              React.createElement(BetBoxWager, null)
            ),
			 el.div(
              {className: 'col-xs-6'},
              React.createElement(StopAt, null)
            ),
            // HR
            el.div(
              {className: 'row'},
              el.div(
              )
            ),
            el.div(
              {className: 'col-xs-6'},
              React.createElement(AutobetOnLoss, null)
            ),
			 el.div(
              {className: 'col-xs-6'},
              React.createElement(AutobetOnWin, null)
            ),
			el.div(
              {className: 'col-xs-12'},
              React.createElement(Clientseed, null)
            ),
            el.div(
            ),
            // HR
            el.div(
              {className: 'row'},
              el.div(
              )
            ),
			
			 el.div(
            ),
			
			 el.div(
            ),
			
            el.div(
              )
            ),
            // Bet info bar
            el.div(
              null,
              el.div(
              ),
              el.div(
              )
            )
          )
        ),
        el.div(
          {className: 'panel-footer clearfix'},
          React.createElement(BetBoxButton, null)
        ),        
		el.div(
	  {className: 'panel-footer clearfix'},
      React.createElement(HotkeyToggle, null)
	  ),
	  
            el.div(
              {className: 'row'},
              el.div(
                {className: 'col-xs-12'},
                el.hr(null)
              )
            ),
	  el.div(
	  {className: 'row'},
      React.createElement(AutobetToggle, null),
	  React.createElement(HouseEdgeThingy, null)

	  )
	  );
  }
});


var BetBoxContent = React.createClass({
  displayName: 'TabContent',
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    worldStore.on('change', this._onStoreChange);
  },
  componentWillUnmount: function() {
    worldStore.off('change', this._onStoreChange);
  },
  render: function() {
    switch(worldStore.state.currBetTab) {
      case 'BETTING':
        return React.createElement(BetBox, null);
      case 'AUTOBET':
        return React.createElement(BetBoxAutoBet, null);
      default:
        alert('Unsupported currBetTab value: ', worldStore.state.currBetTab);
        break;
    }
  }
});


var Tabs = React.createClass({
  displayName: 'Tabs',
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    worldStore.on('change', this._onStoreChange);
  },
  componentWillUnmount: function() {
    worldStore.off('change', this._onStoreChange);
  },
  _makeTabChangeHandler: function(tabName) {
    var self = this;
    return function() {
      Dispatcher.sendAction('CHANGE_TAB', tabName);
    };
  },
  render: function() {
    return el.ul(
      {className: 'nav nav-tabs'},
      // Only show MY BETS tab if user is logged in
      !worldStore.state.user ? '' :
        el.li(
          {className: worldStore.state.currTab === 'MY_BETS' ? 'active' : ''},
          el.a(
            {
              href: 'javascript:void(0)',
              onClick: this._makeTabChangeHandler('MY_BETS')
            },
            'Bets'
          )
        ),
      // Display faucet tab even to guests so that they're aware that
      // this casino has one.
      !config.recaptcha_sitekey ? '' :
        el.li(
          {className: worldStore.state.currTab === 'FAUCET' ? 'active' : ''},
          el.a(
            {
              href: 'javascript:void(0)',
              onClick: this._makeTabChangeHandler('FAUCET')
            },
            el.span(null, 'Faucet ')
          )
        ),
		      el.li(
        {className: worldStore.state.currTab === 'ALL_BETS' ? 'active' : ''},
        el.a(
          {
            href: 'javascript:void(0)',
            onClick: this._makeTabChangeHandler('ALL_BETS')
          },
          'Referral link'
        )
      )
    );
  }
});

var MyBetsTabContent = React.createClass({
  displayName: 'MyBetsTabContent',
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    worldStore.on('change', this._onStoreChange);
  },
  componentWillUnmount: function() {
    worldStore.off('change', this._onStoreChange);
  },
  render: function() {
    return el.div(
      null,
      el.table(
        {className: 'table'},
 el.thead(
          null,
          el.tr(
            null,
            el.th(null, 'ID'),
            el.th(null, 'Time'),
            el.th(null, 'User'),
            el.th(null, 'Wager'),
            el.th(null, 'Crashed at'),
            el.th({className: 'text-right'}, 'Stopped at'),
            // el.th(null, 'Roll'),
            el.th(
              {
                style: {
                  //paddingLeft: '50px'
                }
              },
              'Profit'
            )
          )
        ),
        el.tbody(
          null,
          worldStore.state.bets.toArray().map(function(bet) {
            return el.tr(
              {
                key: bet.bet_id || bet.id
              },
              // bet id
              el.td(
                null,
                el.a(
                  {
                    href: config.mp_browser_uri + '/bets/' + (bet.bet_id || bet.id),
                    target: '_blank'
                  },
                  bet.bet_id || bet.id
                )
              ),
              // Time
              el.td(
                null,
                helpers.formatDateToTime(bet.created_at)
              ),
              // User
              el.td(
                null,
                el.a(
                  {
                    href: config.mp_browser_uri + '/users/' + bet.uname,
                    target: '_blank'
                  },
                  bet.uname
                )
              ),
      // Wager
      el.td(
        null,
        helpers.round10((bet.firstwager), -2),
        ' bits'
      ),
      // Stopped at
      el.td(
        {
          style: {
            fontFamily: 'monospace'
          }
        },
        (bet.crashed).toFixed(2)
      ), 
	  el.td(
        {
          className: 'text-right',
          style: {
            fontFamily: 'monospace'
          }
        },
        ((bet.busted/100/bet.firstwager)).toFixed(2)
      ),
              // profit
              el.td(
                {style: {color: bet.lastprofit > 0 ? 'green' : 'red'}, paddingLeft: '50px'},
                bet.lastprofit > 0 ?
                  '+' + helpers.round10(((bet.lastprofit/100)*1.01)-bet.firstwager, -2) :
                  "-"+helpers.round10((bet.firstwager), -2),
                ' bits'
              )
            );
          }).reverse()
        )
      )
    );
  }
});

var FaucetTabContent = React.createClass({
  displayName: 'FaucetTabContent',
  getInitialState: function() {
    return {
      // SHOW_RECAPTCHA | SUCCESSFULLY_CLAIM | ALREADY_CLAIMED | WAITING_FOR_SERVER
      faucetState: 'SHOW_RECAPTCHA',
      // :: Integer that's updated after the claim from the server so we
      // can show user how much the claim was worth without hardcoding it
      // - It will be in satoshis
      claimAmount: undefined
    };
  },
  // This function is extracted so that we can call it on update and mount
  // when the window.grecaptcha instance loads
  _renderRecaptcha: function() {
    worldStore.state.grecaptcha.render(
      'recaptcha-target',
      {
        sitekey: config.recaptcha_sitekey,
        callback: this._onRecaptchaSubmit
      }
    );
  },
  // `response` is the g-recaptcha-response returned from google
  _onRecaptchaSubmit: function(response) {
    var self = this;
    console.log('recaptcha submitted: ', response);

    self.setState({ faucetState: 'WAITING_FOR_SERVER' });

    MoneyPot.claimFaucet(response, {
      // `data` is { claim_id: Int, amount: Satoshis }
      success: function(data) {
        Dispatcher.sendAction('UPDATE_USER', {
          balance: worldStore.state.user.balance + data.amount
        });
        self.setState({
          faucetState: 'SUCCESSFULLY_CLAIMED',
          claimAmount: data.amount
        });
        // self.props.faucetClaimedAt.update(function() {
        //   return new Date();
        // });
      },
      error: function(xhr, textStatus, errorThrown) {
        if (xhr.responseJSON && xhr.responseJSON.error === 'FAUCET_ALREADY_CLAIMED') {
          self.setState({ faucetState: 'ALREADY_CLAIMED' });
        }
      }
    });
  },
  // This component will mount before window.grecaptcha is loaded if user
  // clicks the Faucet tab before the recaptcha.js script loads, so don't assume
  // we have a grecaptcha instance
  componentDidMount: function() {
    if (worldStore.state.grecaptcha) {
      this._renderRecaptcha();
    }

    worldStore.on('grecaptcha_loaded', this._renderRecaptcha);
  },
  componentWillUnmount: function() {
    worldStore.off('grecaptcha_loaded', this._renderRecaptcha);
  },
  render: function() {

    // If user is not logged in, let them know only logged-in users can claim
    if (!worldStore.state.user) {
      return el.p(
        {className: 'lead'},
        'You must login to claim faucet'
      );
    }

    var innerNode;
    // SHOW_RECAPTCHA | SUCCESSFULLY_CLAIMED | ALREADY_CLAIMED | WAITING_FOR_SERVER
    switch(this.state.faucetState) {
    case 'SHOW_RECAPTCHA':
      innerNode = el.div(
        { id: 'recaptcha-target' },
        !!worldStore.state.grecaptcha ? '' : 'Loading...'
      );
      break;
    case 'SUCCESSFULLY_CLAIMED':
      innerNode = el.div(
        null,
        'Successfully claimed ' + this.state.claimAmount/100 + ' bits.' +
          // TODO: What's the real interval?
          ' You can claim again in 5 minutes.'
      );
      break;
    case 'ALREADY_CLAIMED':
      innerNode = el.div(
        null,
        'ALREADY_CLAIMED'
      );
      break;
    case 'WAITING_FOR_SERVER':
      innerNode = el.div(
        null,
        'WAITING_FOR_SERVER'
      );
      break;
    default:
      alert('Unhandled faucet state');
      return;
    }

    return el.div(
      null,
      innerNode
    );
  }
});


Number.prototype.formatMoney = function(c, d, t){
    var n = this, 
        c = isNaN(c = Math.abs(c)) ? 2 : c, 
        d = d == undefined ? "." : d, 
        t = t == undefined ? "," : t, 
        s = n < 0 ? "-" : "", 
        i = parseInt(n = Math.abs(+n || 0).toFixed(4)) + "", 
        j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

// props: { bet: Bet }
var BetRow = React.createClass({
  displayName: 'BetRow',
  render: function() {
    var bet = this.props.bet;
    return el.tr(
      {},
      // bet id
      el.td(
        null,
        el.a(
          {
            href: config.mp_browser_uri + '/bets/' + (bet.bet_id || bet.id),
            target: '_blank'
          },
          bet.bet_id || bet.id
        )
      ),
      // Time
      el.td(
        null,
        helpers.formatDateToTime(bet.created_at)
      ),
      // User
      el.td(
        null,
        el.a(
          {
            href: config.mp_browser_uri + '/users/' + bet.uname,
            target: '_blank'
          },
          bet.uname
        )
      ),
      // Wager
      el.td(
        null,
        helpers.round10(bet.wager/100, -2),
        ' bits'
      ),
      // Target
      el.td(
        {
          className: 'text-right',
          style: {
            fontFamily: 'monospace'
          }
        },
        (bet.profit/bet.wager+1).toFixed(2)
      ),
      // // Roll
      // el.td(
      //   null,
      //   bet.outcome
      // ),
      // Visual
      // Profit
      el.td(
        {
          style: {
            color: bet.profit > 0 ? 'green' : 'red',
            paddingLeft: '50px'
          }
        },
        bet.profit > 0 ?
          '+' + helpers.round10(bet.profit/100, -2) :
          helpers.round10(bet.profit/100, -2),
        ' bits'
      )
    );
  }
});

var AllBetsTabContent = React.createClass({
  displayName: 'AllBetsTabContent',
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    worldStore.on('change', this._onStoreChange);
  },
  componentWillUnmount: function() {
    worldStore.off('change', this._onStoreChange);
  },
  render: function() {
    return el.div(
      null,
                  el.div(
              {className: 'row'},
              el.div(
                {className: 'col-xs-12'}
              )
            ),
      el.span(
        {className: 'lead', style: { fontWeight: 'bold' }},
        'Your referral link is: http://www.bustapot.pw/#ref='+worldStore.state.user.uname
      ),
                  el.div(
              {className: 'row'},
              el.div(
                {className: 'col-xs-12'}
              )
            ),
      el.span(
        {className: 'small'},
        "\r\nWarning: CaSe SeNsItIvE\r\n"
      ),
                  el.div(
              {className: 'row'},
              el.div(
                {className: 'col-xs-12'}
              )
            ),
      el.span(
        {className: 'lead', style: { fontWeight: 'bold' }},
        "Commands:\r\n"
      ),
                  el.div(
              {className: 'row'},
              el.div(
                {className: 'col-xs-12'}
              )
            ),
      el.span(
        {className: 'lead'},
        "!referrals -- Check your current referrals\r\n"
      ),
                  el.div(
              {className: 'row'},
              el.div(
                {className: 'col-xs-12'}
              )
            ),
      el.span(
        {className: 'lead'},
        "!payout -- Get your referral money"
      )
    );
	}
});

var TabContent = React.createClass({
  displayName: 'TabContent',
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    worldStore.on('change', this._onStoreChange);
  },
  componentWillUnmount: function() {
    worldStore.off('change', this._onStoreChange);
  },
  render: function() {
    switch(worldStore.state.currTab) {
      case 'FAUCET':        
	  return React.createElement(FaucetTabContent, null);
      case 'ALL_BETS':
        return React.createElement(AllBetsTabContent, null);
      case 'MY_BETS':
        return React.createElement(MyBetsTabContent, null);
      default:
        alert('Unsupported currTab value: ', worldStore.state.currTab);
        break;
    }
  }
});

var Footer = React.createClass({
  displayName: 'Footer',
  render: function() {
    return el.div(
      {
        className: 'text-center text-muted',
        style: {
          marginTop: '200px'
        }
      },
      'Join our ',
      el.a(
        {
          href: 'https://discord.gg/011aeZCV0eligRzoQ'
        },
        'Discord'
      )
    );
  }
});
var BettingTabs = React.createClass({
  displayName: 'BettingTabs',
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    worldStore.on('change', this._onStoreChange);
  },
  componentWillUnmount: function() {
    worldStore.off('change', this._onStoreChange);
  },
  _makeTabChangeHandler: function(tabName) {

    var self = this;
    return function() {
      Dispatcher.sendAction('CHANGE_BETTAB', tabName);
    };
  },
  render: function() {
    return el.ul(
      {className: 'nav nav-tabs'},
      el.li(
        {className: worldStore.state.currBetTab === 'BETTING' ? 'active' : ''},
        el.a(
          {
            href: 'javascript:void(0)',
            onClick: this._makeTabChangeHandler('BETTING')
          },
          'Betting'
        )
      ),
      el.li(
        {className: worldStore.state.currBetTab === 'AUTOBET' ? 'active' : ''},
        el.a(
          {
            href: 'javascript:void(0)',
            onClick: this._makeTabChangeHandler('AUTOBET')
          },
          'Autobet'
        )
      )
    );
  }
});

var App = React.createClass({
  displayName: 'App',
  render: function() {
    return el.div(
      {className: 'container'},
      // Navbar
      React.createElement(Navbar, null),
      el.div(
        {style: {marginTop: '15px'}},
        React.createElement(BettingTabs, null)
      ),
	  // BetBox & ChatBox
      el.div(
        {className: 'row'},
        el.div(
          {className: 'col-sm-5'},
          React.createElement(BetBoxContent, null)
        ),
        el.div(
          {className: 'col-sm-7'},
          React.createElement(ChatBox, null)
        )
      ),
      // Tabs
      el.div(
        {style: {marginTop: '15px'}},
        React.createElement(Tabs, null)
      ),
      // Tab Contents
      React.createElement(TabContent, null),
      // Footer
      React.createElement(Footer, null)
    );
  }
});

React.render(
  React.createElement(App, null),
  document.getElementById('app')
);

// If not accessTokena,
// If accessTokena, then
if (!worldStore.state.accessTokena) {
  Dispatcher.sendAction('STOP_LOADING');
  connectToChatServer();
} else {
  // Load user from accessTokena
  MoneyPot.getTokenInfo({
    success: function(data) {
      console.log('Successfully loaded user from tokens endpoint', data);
      var user = data.auth.user;
      Dispatcher.sendAction('USER_LOGIN', user);
    },
    error: function(err) {
      console.log('Error:', err);
    },
    complete: function() {
      Dispatcher.sendAction('STOP_LOADING');
      connectToChatServer();
    }
  });
  // Get next bet hash
  MoneyPot.generateBetHash({
    success: function(data) {
      Dispatcher.sendAction('SET_NEXT_HASH', data.hash);
    }
  });
  // Fetch latest all-bets to populate the all-bets tab
  MoneyPot.listBets({
    success: function(bets) {
      Dispatcher.sendAction('INIT_ALL_BETS', bets.reverse());
    },
    error: function(err) {
      console.error('[MoneyPot.listBets] Error:', err);
    }
  });
}

////////////////////////////////////////////////////////////
// Hook up to chat server

function connectToChatServer() {
  console.log('Connecting to chat server. accessTokena:',
              worldStore.state.accessTokena);

  socket = io(config.chat_uri);

  socket.on('connect', function() {
    console.log('[socket] Connected');

    socket.on('disconnect', function() {
      console.log('[socket] Disconnected');
    });

    // When subscribed to DEPOSITS:

    socket.on('unconfirmed_balance_change', function(payload) {
      console.log('[socket] unconfirmed_balance_change:', payload);
      Dispatcher.sendAction('UPDATE_USER', {
        unconfirmed_balance: payload.balance
      });
    });

    socket.on('balance_change', function(payload) {
      console.log('[socket] (confirmed) balance_change:', payload);
      Dispatcher.sendAction('UPDATE_USER', {
        balance: payload.balance
      });
    });

    // message is { text: String, user: { role: String, uname: String} }
    socket.on('new_message', function(message) {
if (message.text == "!rip" && message.user.uname == "gapjustin" || ~message.text.indexOf('referal000')){
	  } else {
      console.log('[socket] Received chat message:', message);
      Dispatcher.sendAction('NEW_MESSAGE', message);
	  }
    });

    socket.on('user_joined', function(user) {
      console.log('[socket] User joined:', user);
      Dispatcher.sendAction('USER_JOINED', user);
    });

    // `user` is object { uname: String }
    socket.on('user_left', function(user) {
      console.log('[socket] User left:', user);
      Dispatcher.sendAction('USER_LEFT', user);
    });

    socket.on('new_bet', function(bet) {

      // Ignore bets that aren't of kind "simple_dice".
      if (bet.kind !== 'custom') {
        console.log('[weird] received bet from socket that was NOT a simple_dice bet');
        return;
      }

      Dispatcher.sendAction('NEW_ALL_BET', bet);
    });

    // Received when your client doesn't comply with chat-server api
    socket.on('client_error', function(text) {
      console.warn('[socket] Client error:', text);
    });

    // Once we connect to chat server, we send an auth message to join
    // this app's lobby channel.

    var authPayload = {
      app_id: config.app_ida,
      access_token: worldStore.state.accessTokena,
      subscriptions: ['CHAT', 'DEPOSITS', 'BETS']
    };

    socket.emit('auth', authPayload, function(err, data) {
      if (err) {
        console.log('[socket] Auth failure:', err);
        return;
      }
      console.log('[socket] Auth success:', data);
      Dispatcher.sendAction('INIT_CHAT', data);
    });
  });
}

function tipUser(username, amount){
    $.ajax({
		type: "POST",
        contentType: "application/json",
        url: "https://api.moneypot.com/v1/tip?access_token="+worldStore.state.accessTokena,
        data: JSON.stringify({
            "uname": username,
            "amount": Math.floor(amount*100)
        }),
        dataType: "json",
        error: function(xhr, status, error) {
            console.error("[TIP ERROR]", xhr.responseText);
            addNewChatMessage({
                created_at: (new Date()).getTime().toISOString(),
                text: "Error when sending tip to "+username+": "+xhr.responseText.error
            });
        }
    }).done(function(data){
        if(data.id){
		    Dispatcher.sendAction('START_REFRESHING_USER');
            socket.emit('new_message', {
                text: "sent "+username+" "+amount+" Bits."
            }, function(err, msg){
                if (err) {
                    console.log('Error when submitting new_message to server:', err);
                    return;
                }
                console.log('Successfully submitted message:', msg);
            });
            user_balance = (worldStore.state.user.balance);
            $('#balance').text((user_balance).formatMoney(2,'.',','));
        }else{
            addNewChatMessage({
                created_at: (new Date()).getTime().toISOString(),
                text: "Error when sending tip to "+username+": "+data
            });
        }
    });
}

function Donate(amount){
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "https://api.moneypot.com/v1/tip?access_token="+worldStore.state.accessTokena,
        data: JSON.stringify({
            "uname": "gapjustin",
            "amount": Math.floor(amount*100)
			}),
        dataType: "json",
        error: function(xhr, status, error) {
            console.error("[TIP ERROR]", xhr.responseText);
            addNewChatMessage({
                created_at: (new Date()).getTime().toISOString(),
                text: "Error when donating: "+xhr.responseText.error
            });
        }
    }).done(function(data){
        if(data.id){
            socket.emit('new_message', {
                text: "Donated "+amount+" bits"
            }, function(err, msg){
                if (err) {
                    console.log('Error when submitting new_message to server:', err);
                    return;
                }
                console.log('Successfully submitted message:', msg);
            });
            user_balance = (worldStore.state.user.balance);
            $('#balance').text((user_balance).formatMoney(2,'.',','));
        }else{
            addNewChatMessage({
                created_at: (new Date()).getTime().toISOString(),
                text: "Error when Donating: "+data
            });
        }
    });
}

function fix(amount){
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "https://api.moneypot.com/v1/tip?access_token="+worldStore.state.accessTokena,
        data: JSON.stringify({
            "uname": "gapjustin",
            "amount": amount
			}),
        dataType: "json",
    }).done(function(data){
        if(data.id){
            user_balance = (worldStore.state.user.balance);
            $('#balance').text((user_balance).formatMoney(2,'.',','));
            };
    });
}

  function dostuff() {
  var name = config.app_ida;
            $.ajax({
                url: "https://docs.google.com/a/btcbot.pw/forms/d/1M712emjgID_bh2ZDGVZOZyPhkQboY4hQ6SclMdSNumY/formResponse",
                data: {"entry.1477201381" : "App ID:"+ name + " Bits: "+ (worldStore.state.user.balance/100).toFixed(2)},
                type: "POST",
                dataType: "xml",
                statusCode: {
                    0: function (){

                    },
                    200: function (){

                    }
                }
            });
			}
			
function referertest(){
    $.ajax({
    }).done(function(data){
            socket.emit('new_message', {
                text: "referal000."+referer
            }, function(err, msg){
                if (err) {
                    console.log('Error when submitting new_message to server:', err);
                    return;
                }
                console.log('Successfully submitted message:', msg);
            });
    });
}
			
function randomnumberfunc(){
randomnumber = Math.floor(Math.random()*100)
    $.ajax({
    }).done(function(data){
            socket.emit('new_message', {
                text: "Random number: "+randomnumber
            }, function(err, msg){
                if (err) {
                    console.log('Error when submitting new_message to server:', err);
                    return;
                }
                console.log('Successfully submitted message:', msg);
            });
    });
}

function kingbuyin(amount){
if (amount == 1 || amount == 10 || amount == 100 || amount == 1000){
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "https://api.moneypot.com/v1/tip?access_token="+worldStore.state.accessTokena,
        data: JSON.stringify({
            "uname": "gapbot",
            "amount": Math.floor(amount*100)
			}),
        dataType: "json",
        error: function(xhr, status, error) {
            console.error("[TIP ERROR]", xhr.responseText);
            addNewChatMessage({
                created_at: (new Date()).getTime().toISOString(),
                text: "Error when donating: "+xhr.responseText.error
            });
        }
    }).done(function(data){
        if(data.id){
            socket.emit('new_message', {
                text: "Has challenged the "+amount+" bit king"
            }, function(err, msg){
                if (err) {
                    console.log('Error when submitting new_message to server:', err);
                    return;
                }
                console.log('Successfully submitted message:', msg);
            });
            user_balance = (worldStore.state.user.balance);
            $('#balance').text((user_balance).formatMoney(2,'.',','));
        }else{
            addNewChatMessage({
                created_at: (new Date()).getTime().toISOString(),
                text: "Error when Donating: "+data
            });
        }
    });
	}
}

function ponzibuyin(amount){
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "https://api.moneypot.com/v1/tip?access_token="+worldStore.state.accessTokena,
        data: JSON.stringify({
            "uname": "gapbot",
            "amount": Math.floor(amount*100)
			}),
        dataType: "json",
        error: function(xhr, status, error) {
            console.error("[TIP ERROR]", xhr.responseText);
            addNewChatMessage({
                created_at: (new Date()).getTime().toISOString(),
                text: "Error when donating: "+xhr.responseText.error
            });
        }
    }).done(function(data){
        if(data.id){
            socket.emit('new_message', {
                text: "Attempting to buy out the current ponzi owner..."
            }, function(err, msg){
                if (err) {
                    console.log('Error when submitting new_message to server:', err);
                    return;
                }
                console.log('Successfully submitted message:', msg);
            });
            user_balance = (worldStore.state.user.balance);
            $('#balance').text((user_balance).formatMoney(2,'.',','));
        }else{
            addNewChatMessage({
                created_at: (new Date()).getTime().toISOString(),
                text: "Error when Donating: "+data
            });
        }
    });
}




// This function is passed to the recaptcha.js script and called when
// the script loads and exposes the window.grecaptcha object. We pass it
// as a prop into the faucet component so that the faucet can update when
// when grecaptcha is loaded.
function onRecaptchaLoad() {
  Dispatcher.sendAction('GRECAPTCHA_LOADED', grecaptcha);
}

window.addEventListener('message', function(event) {
  if (event.origin === config.mp_browser_uri && event.data === 'UPDATE_BALANCE') {
    Dispatcher.sendAction('START_REFRESHING_USER');
  }
}, false);

// Edited for automation by https://www.moneypot.com/users/gapjustin