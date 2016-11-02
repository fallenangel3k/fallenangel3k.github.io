///////////////////////
// All trademarks,trade names,images,contents,snippets,codes,including text
// and graphics appearing on the site are intellectual property of their
// respective owners, including in some instances,"fallenangel3k.github.io".
// All rights reserved.
// Below is the list of owners/sites where elements of this site were based on.

// http://untitled-dice.github.io/,
// https://classic.plinkopot.com
// https://sat.oshi.xyz
// https://fallenangel3k.github.io
/////////////////////////////

var config = {
  app_id: 1471, 
  app_name: 'Angels Money Heaven',
  //recaptcha_sitekey: '6LevqigTAAAAAPSTvIbdlxhf1wDud851uD4dziFQ',
  recaptcha_sitekey: '6LevqigTAAAAADBZm6WL2HPEPAZT70aWGcng0Aml',
  redirect_uri: 'https://fallenangel3k.github.io',
  mp_browser_uri: 'https://www.moneypot.com',
  mp_api_uri: 'https://api.moneypot.com',
  be_api_uri: 'https://bit-exo.com/',
  chat_uri: '//socket.moneypot.com',
  be_uri: '//socket.moneypot.com',
  //app_id: 588, //Rockcino
  //redirect_uri: 'https://rockcino.localhost:3131/', //Rockcino
  //be_api_uri: 'https://rockcino.localhost:3131/', //Rockcino
  //be_uri: '//rockcino.localhost:3131', //Rockcino
  force_https_redirect: true,
  house_edge: 0.01,
  chat_buffer_size: 99,
  // - The amount of bets to show on screen in each tab
  bet_buffer_size: 50,
  debug: true
};

if (config.force_https_redirect && window.location.protocol !== "https:") {
  window.location.href = "https:" + window.location.href.substring(window.location.protocol.length);
}

// Generates UUID for uniquely tagging components
var genUuid = function() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
};
//////////////////////////////////
///helper functions
var helpers = {};
// For displaying HH:MM timestamp in chat
//
// String (Date JSON) -> String
helpers.formatDateToTime = function(dateJson) {
  var date = new Date(dateJson);
  return _.padLeft(date.getHours().toString(), 2, '0') +
    ':' +
    _.padLeft(date.getMinutes().toString(), 2, '0')+
      ':' +
      _.padLeft(date.getSeconds().toString(), 2, '0');
};

// Number -> Number in range (0, 1)
helpers.multiplierToWinProb = function(multiplier) {
  console.assert(typeof multiplier === 'number');
  console.assert(multiplier > 0);

  // For example, n is 0.99 when house edge is 1%
  var n = 1.0 - betStore.state.house_edge;//config.house_edge;

  return n / multiplier;
};

helpers.WinProbtoMultiplier = function(winProb) {
  console.assert(typeof winProb === 'number');
  console.assert(winProb > 0);

  // For example, n is 0.99 when house edge is 1%
  var n = 1.0 - betStore.state.house_edge;//config.house_edge;

  return n / winProb;
};

helpers.calcNumber = function(cond, winProb) {
  console.assert(cond === '<' || cond === '>');
  console.assert(typeof winProb === 'number');
  //((winProb * - 100)*-1).toFixed(4).toString() + '>n>' + (((winProb * -100) + 100 )-betStore.state.house_edge).toFixed(4).toString()
  if (cond === '<') {
    return winProb * 100;
  } else {
    return 99.9999 - (winProb * 100);
  }
};

helpers.convNumtoStr = function(num) {

switch(worldStore.state.coin_type){
  case 'BITS':
      return (num / 100).toFixed(2).toString();
    break;
  case 'BTC':
      return (num * 0.00000001).toFixed(8).toString();
    break;
  case 'USD':
      return (num * 0.00000001 * worldStore.state.btc_usd).toFixed(8).toString();;
    break;
  case 'EUR':
      return (num * 0.00000001 * worldStore.state.btc_eur).toFixed(8).toString();;
    break;
  default:
      return (num / 100).toFixed(2);
    break;
}

};

helpers.convSatstoCointype = function(num){
  switch(worldStore.state.coin_type){
    case 'BITS':
        return (num / 100).toFixed(2);
      break;
    case 'BTC':
        return (num * 0.00000001).toFixed(8);
      break;
    case 'USD':
        return (num * 0.00000001 * worldStore.state.btc_usd).toFixed(8);
      break;
    case 'EUR':
        return (num * 0.00000001 * worldStore.state.btc_eur).toFixed(8);
      break;
    default:
        return (num / 100).toFixed(2);
      break;
  }

};

helpers.convCoinTypetoSats = function (num){
  switch(worldStore.state.coin_type){
    case 'BITS':
        return (num * 100);
      break;
    case 'BTC':
        return (num / 0.00000001);
      break;
    case 'USD':
        return (num / 0.00000001 / worldStore.state.btc_usd);
      break;
    case 'EUR':
        return (num / 0.00000001 / worldStore.state.btc_eur);
      break;
    default:
        return (num * 100);
      break;
  }


};

helpers.wagertotal = function(num) {
  switch(worldStore.state.coin_type){
    case 'BITS':
        return (num).toFixed(2).toString();
      break;
    case 'BTC':
        return (num * 0.000001).toFixed(8).toString();
      break;
    case 'USD':
        return (num).toFixed(8).toString();
      break;
    case 'EUR':
        return (num).toFixed(8).toString();
      break;
    default:
        return (num).toFixed(2).toString();
      break;
  }

};

helpers.roleToLabelElement = function(user) {
  switch(user.role) {
    case 'ADMIN':
      return el.span({className: 'label label-danger'}, 'MP Staff');
    case 'MOD':
      if (user.uname == 'iisurge'){
        return el.span({className: 'label label-info'}, 'Bot Master');
      }else{
        return el.span({className: 'label label-info'}, 'Mod');
      }
    case 'OWNER':
      return el.span({className: 'label label-danger'}, 'Admin');
    case 'BOT':
      return el.span({className: 'label label-primary'}, 'Bot');
    case 'JACKPOT':
      return el.span({className: 'label label-success'},'JACKPOT');
    case 'PM':
      return el.span({className: 'label label-warning'},'PM');
    default:
      if ((user.uname == 'Chatbot')||(user.uname == 'chatbot'))
        {
        return el.span({className: 'label label-primary'}, 'Bot');
        }
      else {
          return '';
          }
  }
};

// -> Object
helpers.getHashParams = function() {
  var hashParams = {};
  var e,
      a = /\+/g,  // Regex for replacing addition symbol with a space
      r = /([^&;=]+)=?([^&;]*)/g,
      d = function (s) { return decodeURIComponent(s.replace(a, " ")); },
      q = window.location.search.substring(1);
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

// [String] -> [Float]
helpers.toFloats = function(arr) {
  console.assert(_.isArray(arr));
  return arr.map(function(str) {
    console.assert(_.isString(str));
    return parseFloat(str, 10);
  });
};

// Adds commas to a number, returns string
helpers.commafy = function(x) {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
};


helpers.payTableToEdge = (function() {
  var binom = function(n,k) {
    k = Math.min(k, n - k);
    console.assert(k >= 0);

    var r = 1;
    for (var i = 0; i < k; ++i)
      r = (r * (n - i)) / (i + 1);
    return r;
  };

  return function _payTableToEdge(table) {
    var possibilities = Math.pow(2, table.length-1);
    var ev = -1;
    table.forEach(function(payout, i) {
      var x = binom(table.length-1, i);
      // console.log('There is a: ' + x + ' in ' + possibilities + ' of it landing on ' + payout);
      var prob = x/possibilities;
      ev += prob * payout;
    });
    // console.log('House edge: ', -ev*100, '%');
    return -ev*100;
  };
})();

helpers.isValidPayout = (function() {
  var re = /^(\d\.\d{0,2})$|^(\d\d\.\d{0,1})$|^(\d{1,4})$/;
  return function _isValidPayout(str) {
    return re.test(str);
  };
})();

helpers.payTablEdgeSlots = (function() {

  var probs = [0.001, 0.001, 0.001, 0.001, 0.001, 0.001, 0.001, 0.001, 0.001, 0.001, 0.009, 0.009, 0.009, 0.09];

  return function _payTableToEdgeSlots(table) {
    var ev = 0;
    for (x = 0; x< table.length; x++){
      ev += (table[x]/(1/probs[x]));
    }

    var he = (ev -1)*-1;

    return he*100;
  };
})();
// A Moneypot API abstraction for faucet
//
// Moneypot's API docs: https://www.moneypot.com/api-docs
var MoneyPot = (function() {

  var o = {};

  o.apiVersion = 'v1';
  // method: 'GET' | 'POST' | ...
  // endpoint: '/tokens/abcd-efgh-...'
  var noop = function() {};
  var makeMPRequest = function(method, bodyParams, endpoint, callbacks, overrideOpts) {

    if (!worldStore.state.auth_id)
      throw new Error('Must have auth_id set to call MoneyPot API');

    var url = config.mp_api_uri + '/' + o.apiVersion + endpoint;

    if (worldStore.state.auth_id) {
      url = url + '?auth_id=' + worldStore.state.auth_id;
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
  // gRecaptchaResponse is string response from google server
  // `callbacks.success` signature	is fn({ claim_id: Int, amoutn: Satoshis })
  o.claimFaucet = function(gRecaptchaResponse, callbacks) {
    console.log('Hitting POST /claim-faucet');
    var endpoint = '/claim-faucet';
    var body = { response: gRecaptchaResponse };
    makeMPRequest('POST', body, endpoint, callbacks);
  };

  return o;
})();


////////////////////////////////////////////////
//document.body.appendChild(document.createElement('script')).src="../app/dice.js";
//requirejs(['app/dice'],function(dice){});
//console.log('loaded script');

var Dispatcher = new (function() {
  // Map of actionName -> [Callback]
  this.callbacks = {};

  var self = this;

  // Hook up a store's callback to receive dispatched actions from dispatcher
  this.registerCallback = function(actionName, cb) {
    //console.log('[Dispatcher] registering callback for:', actionName);

    if (!self.callbacks[actionName]) {
      self.callbacks[actionName] = [cb];
    } else {
      self.callbacks[actionName].push(cb);
    }
  };

  this.sendAction = function(actionName, payload) {
    //console.log('[Dispatcher] received action:', actionName, payload);

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

// Manage auth_id //////////////////////////////////////
//
// - If auth_id is in url, save it into localStorage.
//   `expires_in` (seconds until expiration) will also exist in url
//   so turn it into a date that we can compare

var auth_id, access_token, expires_in, expires_at;
var refer_name = helpers.getHashParams().ref;
if (refer_name){
  localStorage.setItem('refname', refer_name);
}
var confidential_token = helpers.getHashParams().confidential_token;
//if (helpers.getHashParams().confidential_token)
if(confidential_token) {
  if(config.debug){console.log('[token manager] access_token in hash params');}
  localStorage.auth_id = null;
  localStorage.access_token = null;
  localStorage.expires_at = null;
  //get_auth_id();
  access_token = confidential_token;
  confidential_token = null;
} else if (localStorage.auth_id) {
  if(config.debug){console.log('[token manager] auth_id in localStorage');}
//  auth_id = localStorage.auth_id;
//  access_token = localStorage.access_token;

  expires_at = localStorage.expires_at;
  // Only get access_token from localStorage if it expires
  // in a week or more. access_tokens are valid for two weeks
  if (expires_at && new Date(expires_at) > new Date(Date.now() + (1000 * 60 * 60 * 24 * 7))) {
    auth_id = localStorage.auth_id;
    access_token = localStorage.access_token;
      if(config.debug){console.log('[token manager] token not stale');}
  } else {
    if(config.debug){console.log('[token manager] token stale removing from local store');}
    localStorage.removeItem('expires_at');
    localStorage.removeItem('auth_id');
    localStorage.removeItem('access_token');
  }


} else {
  if(config.debug){console.log('[token manager] no auth_id');}
}

// Scrub fragment params from url.
if (window.history && window.history.replaceState) {
  window.history.replaceState({}, document.title, "/");
} else {
  // For browsers that don't support html5 history api, just do it the old
  // fashioned way that leaves a trailing '#' in the url
  window.location.hash = '#';
}



var linkmute = true;
var chatStore = new Store('chat', {
  messages: new CBuffer(config.chat_buffer_size),
  pm_messages:[],
  currTab: 'MAIN',
  waitingForServer: false,
  userList: {},
  showChat: true,
  showUserList: false,
  loadingInitialMessages: true,
  sent_to: 0,
  message_key: genUuid(),
//  input_string: {str:''},
  newmsg: false,
  chatinit: false,
  delete_tab: false,
  newmessages: 0,
  chat_room: 'ENGLISH_RM'
}, function() {
  var self = this;
  Dispatcher.registerCallback('CHANGE_CHAT_ROOM', function(room_name) {
    console.assert(typeof room_name === 'string');

    if (room_name == 'ENGLISH_RM'){
      socket.emit('join_CHAT_ROOM', room_name, function(err, messagedata) {
          if (err){
            console.log('socket_error join_CHAT_ROOM',err);
          }else {
            console.log('socket success join_CHAT_ROOM',room_name);
            var messages = messagedata.map(function(message) {
              message.id = genUuid();
              return message;
            });
            delete self.state.messages;
            self.state.messages = new CBuffer(config.chat_buffer_size);
            self.state.messages.push.apply(self.state.messages, messages);
            self.state.messages.toArray().map(function(m) { m.id = genUuid();});
          }
          self.state.chat_room = room_name;

          self.state.currTab = 'MAIN';
          console.log('CHANGED_CHAT_ROOM',room_name);
          self.emitter.emit('change', self.state);
          self.emitter.emit('init',self.state);
      });
    }else {
    if(self.state.pm_messages.length > 0){
    for (var x = 0; x <= self.state.pm_messages.length; x++){
      if (x < self.state.pm_messages.length){
        if(self.state.pm_messages[x].name == room_name){

          if (self.state.currTab != room_name){
            Dispatcher.sendAction('CHANGE_CHATTAB', room_name);
          }
          break;
        }
      }
        else if(x == self.state.pm_messages.length){
          //self.state.pm_messages[x].push(message);
          socket.emit('join_CHAT_ROOM', room_name, function(err, messagedata) {
              if (err){
                console.log('socket_error join_CHAT_ROOM',err);
              }else {
                console.log('socket success join_CHAT_ROOM',room_name);
                var messages = messagedata.map(function(message) {
                  message.id = genUuid();
                  return message;
                });
                delete self.state.pm_messages[x];
                self.state.pm_messages[x] = new CBuffer(config.chat_buffer_size);
                self.state.pm_messages[x].name = room_name;
                self.state.pm_messages[x].new_message = true;

                self.state.pm_messages[x].push.apply(self.state.pm_messages[x], messages);
                self.state.pm_messages[x].toArray().map(function(m) { m.id = genUuid();});
              }
              self.state.chat_room = room_name;
              Dispatcher.sendAction('CHANGE_CHATTAB', room_name);
              //self.state.currTab = 'MAIN';
              console.log('CHANGED_CHAT_ROOM',room_name);
            //  self.emitter.emit('change', self.state);
            //  self.emitter.emit('init',self.state);
          });
          break;
        }
      }
    }else{
      //self.state.pm_messages[0].push(message);
      socket.emit('join_CHAT_ROOM', room_name, function(err, messagedata) {
          if (err){
            console.log('socket_error join_CHAT_ROOM',err);
          }else {
            console.log('socket success join_CHAT_ROOM',room_name);
            var messages = messagedata.map(function(message) {
              message.id = genUuid();
              return message;
            });
            self.state.pm_messages[0] = new CBuffer(config.chat_buffer_size);
            self.state.pm_messages[0].name = room_name;
            self.state.pm_messages[0].new_message = true;

            self.state.pm_messages[0].push.apply(self.state.pm_messages[0], messages);
            self.state.pm_messages[0].toArray().map(function(m) { m.id = genUuid();});
          }
          self.state.chat_room = room_name;
          Dispatcher.sendAction('CHANGE_CHATTAB', room_name);
          //self.state.currTab = 'MAIN';
          console.log('CHANGED_CHAT_ROOM',room_name);
        //  self.emitter.emit('change', self.state);
        //  self.emitter.emit('init',self.state);
      });


    }
  }



  });


  Dispatcher.registerCallback('CHANGE_CHATTAB', function(tabName) {
    console.assert(typeof tabName === 'string');
    self.state.currTab = tabName;

    for(x = 0; x< self.state.pm_messages.length; x++){
      if (tabName == self.state.pm_messages[x].name){
        self.state.pm_messages[x].new_message = false;
      }
    }
    if (self.state.delete_tab)
      {
      self.state.currTab = 'MAIN';
      self.state.messages.new_message = false;
      self.state.delete_tab = false;
      }
    if ((self.state.currTab == 'MAIN')||(tabName == 'MAIN')){
      self.state.messages.new_message = false;
      self.state.newmessages = 0;
    }
    console.log('CHANGE_CHATTAB');
    self.emitter.emit('change', self.state);
    self.emitter.emit('init',self.state);
  });

  Dispatcher.registerCallback('REMOVE_CHATTAB', function(tabName) {
    console.assert(typeof tabName === 'string');
    self.state.delete_tab = true;
    self.state.currTab = 'MAIN';


    switch(tabName){
      case 'RUSSIAN_RM':
      case 'FRENCH_RM':
      case 'SPANISH_RM':
      case 'PORTUGUESE_RM':
      case 'DUTCH_RM':
      case 'GERMAN_RM':
      case 'HINDI_RM':
      case 'CHINESE_RM':
      case 'JAPANESE_RM':
      case 'KOREAN_RM':
      case 'FILIPINO_RM':
      case 'INDONESIAN_RM':
        socket.emit('leave_CHAT_ROOM', tabName);
        break;
      default:
        socket.emit('close_pm', tabName);
        break;
    }

    for(x = 0; x< self.state.pm_messages.length; x++){
      if (tabName == self.state.pm_messages[x].name){
        self.state.pm_messages.splice(x,1);
      }
    }
    console.log('REMOVE_CHATTAB');
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('UPDATE_INPUT_STRING', function(uname) {

    textinput.state.text += uname + ' ';
    self.emitter.emit('change', self.state);
  });
  Dispatcher.registerCallback('CLEAR_INPUT_STRING', function() {
    self.state.input_string = '';
    self.emitter.emit('inputchange', self.state);
  });

  Dispatcher.registerCallback('SET_NEWMSG', function() {
    self.state.newmsg = true;
    self.emitter.emit('change', self.state);
  });
  Dispatcher.registerCallback('CLEAR_NEWMSG', function() {
    self.state.newmsg = false;
    self.emitter.emit('change', self.state);
  });


  // `data` is object received from socket auth
  Dispatcher.registerCallback('INIT_CHAT', function(data) {
    if(config.debug){console.log('[ChatStore] received INIT_CHAT');}
    // Give each one unique id
      //self.state.message_key = genUuid();
    var messages = data.chat.messages.map(function(message) {
      message.id = genUuid();//self.state.message_key;
      //self.state.message_key = genUuid();
      return message;
    });

    // Reset the CBuffer since this event may fire multiple times,
    // e.g. upon every reconnection to chat-server.
    //self.state.messages.empty();
    delete self.state.messages;
    self.state.messages = new CBuffer(config.chat_buffer_size);
    self.state.messages.push.apply(self.state.messages, messages);
    self.state.messages.toArray().map(function(m) { m.id = genUuid();}); //console.log(m.id);});

    // Indicate that we're done with initial fetch
    self.state.loadingInitialMessages = false;

    // Load userList

    for (var x = 0; x < data.chat.userlist.length; x++){
      self.state.userList[data.chat.userlist[x].uname] = data.chat.userlist[x];
    }
    linkmute = true;
    setTimeout(function(){linkmute = false;},3000);

    self.emitter.emit('change', self.state);
    self.emitter.emit('init');
  });

  Dispatcher.registerCallback('NEW_MESSAGE', function(message) {
    if(config.debug){console.log('[ChatStore] received NEW_MESSAGE');}
    message.id = self.state.message_key;

    if (message.user.role == 'PM'){
      if (message.receiver == worldStore.state.user.uname){
        if(self.state.pm_messages.length > 0){
        for (var x = 0; x <= self.state.pm_messages.length; x++){
          if (x < self.state.pm_messages.length){
            if(self.state.pm_messages[x].name == message.user.uname){
              self.state.pm_messages[x].push(message);
              if (self.state.currTab != message.user.uname){
                self.state.pm_messages[x].new_message = true;
              }
              break;
            }
          }else if(x == self.state.pm_messages.length){
              self.state.pm_messages[x] = new CBuffer(config.chat_buffer_size);
              self.state.pm_messages[x].name = message.user.uname;
              self.state.pm_messages[x].new_message = true;
              self.state.pm_messages[x].push(message);
              break;
            }
          }
        }else{
          self.state.pm_messages[0] = new CBuffer(config.chat_buffer_size);
          self.state.pm_messages[0].name = message.user.uname;
          self.state.pm_messages[0].new_message = true;
          self.state.pm_messages[0].push(message);
        }

      }else {
        if(self.state.pm_messages.length > 0){
        for (var x = 0; x <= self.state.pm_messages.length; x++){
          if (x < self.state.pm_messages.length){
            if(self.state.pm_messages[x].name == message.receiver){
              self.state.pm_messages[x].push(message);
              if (self.state.currTab != message.receiver){
                self.state.pm_messages[x].new_message = true;
              }
              break;
            }
          }
            else if(x == self.state.pm_messages.length){
              self.state.pm_messages[x] = new CBuffer(config.chat_buffer_size);
              self.state.pm_messages[x].name = message.receiver;
              self.state.pm_messages[x].new_message = true;
              self.state.pm_messages[x].push(message);
              break;
            }
          }
        }else{
          self.state.pm_messages[0] = new CBuffer(config.chat_buffer_size);
          self.state.pm_messages[0].name = message.receiver;
          self.state.pm_messages[0].new_message = true;
          self.state.pm_messages[0].push(message);
        }
      }
    }else{
      //self.state.messages.push(message);
      if (message.room == undefined){
        self.state.messages.push(message);
        if (self.state.currTab != 'MAIN'){
          self.state.messages.new_message = true;
          self.state.newmessages++;
          switch(self.state.currTab){
            case 'RUSSIAN_RM':
            case 'FRENCH_RM':
            case 'SPANISH_RM':
            case 'PORTUGUESE_RM':
            case 'DUTCH_RM':
            case 'GERMAN_RM':
            case 'HINDI_RM':
            case 'CHINESE_RM':
            case 'JAPANESE_RM':
            case 'KOREAN_RM':
            case 'FILIPINO_RM':
            case 'INDONESIAN_RM':
              if(self.state.pm_messages.length > 0){
                for (var x = 0; x < self.state.pm_messages.length; x++){
                  if(self.state.pm_messages[x].name == self.state.currTab){
                    self.state.pm_messages[x].push(message);
                    break;
                    }
                  }
                }
              break;
          }
        }else {
          self.state.newmessages = 0;
        }
      }else if( (message.room != 'ENGLISH_RM')&&(message.room != 'GLOBAL_RM')){
        if(self.state.pm_messages.length > 0){
        for (var x = 0; x <= self.state.pm_messages.length; x++){
          if (x < self.state.pm_messages.length){
            if(self.state.pm_messages[x].name == message.room){
              self.state.pm_messages[x].push(message);
              if (self.state.currTab != message.room){
                self.state.pm_messages[x].new_message = true;
              }
              break;
            }
          }
            else if(x == self.state.pm_messages.length){
              self.state.pm_messages[x] = new CBuffer(config.chat_buffer_size);
              self.state.pm_messages[x].name = message.room;
              self.state.pm_messages[x].new_message = true;
              self.state.pm_messages[x].push(message);
              break;
            }
          }
        }else{
          self.state.pm_messages[0] = new CBuffer(config.chat_buffer_size);
          self.state.pm_messages[0].name = message.room;
          self.state.pm_messages[0].new_message = true;
          self.state.pm_messages[0].push(message);
        }
      }else if (message.room == 'GLOBAL_RM'){
        self.state.messages.push(message);

        if (self.state.currTab != 'MAIN'){
          self.state.messages.new_message = true
          self.state.newmessages++;
          switch(self.state.currTab){
            case 'RUSSIAN_RM':
            case 'FRENCH_RM':
            case 'SPANISH_RM':
            case 'PORTUGUESE_RM':
            case 'DUTCH_RM':
            case 'GERMAN_RM':
            case 'HINDI_RM':
            case 'CHINESE_RM':
            case 'JAPANESE_RM':
            case 'KOREAN_RM':
            case 'FILIPINO_RM':
            case 'INDONESIAN_RM':
              if(self.state.pm_messages.length > 0){
                for (var x = 0; x < self.state.pm_messages.length; x++){
                  if(self.state.pm_messages[x].name == self.state.currTab){
                    self.state.pm_messages[x].push(message);
                    break;
                    }
                  }
                }
              break;
          }
        }else{
          self.state.newmessages = 0;
        }
      }else {
        self.state.messages.push(message);
        if (self.state.currTab != 'MAIN'){
          self.state.messages.new_message = true
          self.state.newmessages++;
        }else {
          self.state.newmessages = 0;
        }
      }
    }

    if ((self.state.showChat == false)){
      self.state.newmessages++;
    }else {
      self.state.newmessages = 0;
    }

    self.state.message_key = genUuid();
    self.state.waitingForServer = false;

    self.emitter.emit('change', self.state);
    self.emitter.emit('new_message');

  });

  Dispatcher.registerCallback('TOGGLE_CHAT_USERLIST', function() {
    if(config.debug){console.log('[ChatStore] received TOGGLE_CHAT_USERLIST');}
    self.state.showUserList = !self.state.showUserList;
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('TOGGLE_CHAT', function() {
    console.log('[ChatStore] received TOGGLE_CHAT');
    self.state.showChat = !self.state.showChat;
    if (self.state.showChat){
      self.state.newmessages = 0;
      setTimeout(function(){self.emitter.emit('init');},250);
    }
    self.emitter.emit('toggle_chat', self.state);
  });

  // user is { id: Int, uname: String, role: 'admin' | 'mod' | 'owner' | 'member' }
  Dispatcher.registerCallback('USER_JOINED', function(user) {
    if(config.debug){console.log('[ChatStore] received USER_JOINED:', user);}
    var match = false;

    for (var x = 0; x < Object.keys(self.state.userList).length; x++)
      {
        if (self.state.userList[x] != undefined){
          if (self.state.userList[x].uname == user.uname){
                match = true;
              }
          }else if (self.state.userList[user.uname] != undefined){
            if (self.state.userList[user.uname].uname == user.uname){
              match = true;
            }
          }
      }
    if (match == false){
    self.state.userList[user.uname] = user;
    self.emitter.emit('change', self.state);
    }
  });

  // user is { id: Int, uname: String, role: 'admin' | 'mod' | 'owner' | 'member' }
  Dispatcher.registerCallback('USER_LEFT', function(user) {
    if(config.debug){console.log('[ChatStore] received USER_LEFT:', user);}

    for (var x = 0; x < Object.keys(self.state.userList).length; x++)
      {
        if (self.state.userList[x] != undefined){
          if (self.state.userList[x].uname == user.uname){
                delete self.state.userList[x];
              }
          }else if (self.state.userList[user.uname] != undefined){
            if (self.state.userList[user.uname].uname == user.uname){
              delete self.state.userList[user.uname];
            }
          }
      }


    self.emitter.emit('change', self.state);
  });

  // Message is { text: String }
  Dispatcher.registerCallback('SEND_MESSAGE', function(text) {
    if (text.substring(0, 1) == '/') {
      // TIP CODE HERE
    Dispatcher.sendAction('PARSE_COMMAND',text);
    }
    else{
      console.log('[ChatStore] received SEND_MESSAGE');
      self.state.waitingForServer = true;
      self.emitter.emit('change', self.state);
      var room_name = 'ENGLISH_RM';
      switch(self.state.currTab){
        case 'MAIN':
          room_name = 'ENGLISH_RM';
          break;
        case 'RUSSIAN_RM':
        case 'FRENCH_RM':
        case 'SPANISH_RM':
        case 'PORTUGUESE_RM':
        case 'DUTCH_RM':
        case 'GERMAN_RM':
        case 'HINDI_RM':
        case 'CHINESE_RM':
        case 'JAPANESE_RM':
        case 'KOREAN_RM':
        case 'FILIPINO_RM':
        case 'INDONESIAN_RM':
          room_name = self.state.currTab;
          break;
      }

      socket.emit('new_message', { text: text, room: room_name }, function(err) {
          if (err) { alert('Chat Error: ' + err); }
          });
      }
    });

    Dispatcher.registerCallback('SEND_TIP',function(text){
      var error = null;
      var send_private = false;
      var tipres = text.split(" ");
      var coin_type_send = tipres[3];
      var tipamount;
      var tipto = tipres[1];
      var d = new Date();

      if ((tipres[4] === 'PRIVATE')||(tipres[4] === 'private')){
      send_private = true;
      }

      if (coin_type_send != undefined){
        switch(coin_type_send){
          case 'BITS':
          case 'bits':
          case 'bit':
            coin_type_send = 'BITS';
            tipamount = Math.round((parseFloat(tipres[2]) * 100));
            break;
          case 'BTC':
          case 'btc':
            coin_type_send = 'BTC';
            tipamount = Math.round((parseFloat(tipres[2]) / 0.00000001));
            break;
          case 'EUR':
          case 'eur':
            coin_type_send = 'EUR';
            tipamount = Math.round((parseFloat(tipres[2]) / 0.00000001 / worldStore.state.btc_eur));
            break;
          case 'USD':
          case 'usd':
            coin_type_send = 'USD';
            //tipamount = Math.round(helpers.convCoinTypetoSats(parseFloat(tipres[2])));
            tipamount = Math.round((parseFloat(tipres[2]) / 0.00000001 / worldStore.state.btc_usd));
            break;
          default:
            error = "Invalid Coin Type use BITS,BTC,EUR or USD";
            break;
        }
      }else{
        error = "Invalid Coin Type use BITS,BTC,EUR or USD";
      }

      if (worldStore.state.user.balance < tipamount){
          error = "BALANCE TOO LOW";
        }
      else if ((tipamount < 100) || (tipamount == undefined)){
          switch(worldStore.state.coin_type){
            case 'BITS':
              error = "MUST SEND MORE THAN 1 BIT";
              break;
            case 'BTC':
              error = "MUST SEND MORE THAN 0.000001 BTC";
              break;
            case 'EUR':
              var min_bet = 1 * 0.000001 * worldStore.state.btc_eur;
              error = "MUST SEND MORE THAN " + min_bet.toFixed(8).toString() + " EUROS";
              break;
            case 'USD':
              var min_bet = 1 * 0.000001 * worldStore.state.btc_usd;
              error = "MUST SEND MORE THAN " + min_bet.toFixed(8).toString() + " DOLLARS";
              break;
          }
        }

      if (!error){
        var params = {
            uname: tipto,
            amount: tipamount,
            private: send_private,
            type: coin_type_send
          };
        socket.emit('send_tip', params, function(err, data) {
          if (err) {
            console.log('[socket] send_tip error:', err);
            return;
          }
          Dispatcher.sendAction('UPDATE_USER', { balance: worldStore.state.user.balance - tipamount});
          console.log('Successfully made tip: '+tipres[2]+' to '+tipto);

          text = "Sent: "+tipres[2] + " " + coin_type_send + " to " +tipto;
          if (send_private){
            Dispatcher.sendAction('NEW_MESSAGE', {channel: "lobby", text:text, created_at: d.toJSON(),user:{role: "BOT", uname: "PRIVATE"} });
          }else{ }
        });
      }else {
        Dispatcher.sendAction('NEW_MESSAGE', {channel: "lobby", text:error, created_at: d.toJSON(),user:{role: "BOT", uname: "ERROR"}});
      }
    });

    // /rain [amount] [coin]
    Dispatcher.registerCallback('SEND_RAIN',function(text){
      var error = null;
      var tipres = text.split(" ");
      var coin_type_send = tipres[2];
      var totalrain;  //in sats
      var tipamount;  //in sats
      var tipto;// = tipres[1];
      var tiplist = [];
      var d = new Date();

      if (coin_type_send != undefined){
        switch(coin_type_send){
          case 'BITS':
          case 'bits':
          case 'bit':
            coin_type_send  = 'BITS';
            totalrain = Math.round((parseFloat(tipres[1]) * 100));
            break;
          case 'BTC':
          case 'btc':
            coin_type_send = 'BTC';
            totalrain = Math.round((parseFloat(tipres[1]) / 0.00000001));
            break;
          case 'EUR':
          case 'eur':
            coin_type_send = 'EUR';
            totalrain = Math.round((parseFloat(tipres[1]) / 0.00000001 / worldStore.state.btc_eur));
            break;
          case 'USD':
          case 'usd':
            coin_type_send = 'USD';
            //tipamount = Math.round(helpers.convCoinTypetoSats(parseFloat(tipres[2])));
            totalrain = Math.round((parseFloat(tipres[1]) / 0.00000001 / worldStore.state.btc_usd));
            break;
          default:
            error = "Invalid Coin Type use BITS,BTC,EUR or USD";
            break;
        }
      }else{
        error = "Invalid Coin Type use BITS,BTC,EUR or USD";
      }

      if (Object.keys(chatStore.state.userList).length > 1){
        tipamount = totalrain / (Object.keys(chatStore.state.userList).length - 1);
        _.values(chatStore.state.userList).map(function(u) {
            if (u.uname != worldStore.state.user.uname)
              {
                tiplist.push(u.uname);
              }
        })

      }else {
        error = "NOT ENOUGH USERS TO RAIN";
        tipamount = 0;
      }
      if (worldStore.state.user.balance < totalrain){
        error = "BALANCE TOO LOW TO RAIN";
        tipamount = 0;
      }
      else if (worldStore.state.user.balance < tipamount){
          error = "BALANCE TOO LOW TO FINISH RAINING";
          tipamount = 0;
        }
      else if (tipamount < 100){
          error = worldStore.state.coin_type === 'BITS' ? "MUST SEND MORE THAN 1 BIT TO EACH USER" : "MUST SEND MORE THAN 0.000001 BTC TO EACH USER";
          tipamount = 0;
        }

      // send tip to moneypot
      if ((!error) && (tipamount > 99)){

        Dispatcher.sendAction('NEW_MESSAGE', {channel: "lobby", text: "Sending Rain to Users", created_at: d.toJSON(),user:{role: "BOT", uname: "RAINBOT"} });

        tipto = tiplist[self.state.sent_to];

        var params = {
            amount: totalrain,
            type: coin_type_send
          };
        socket.emit('send_rain', params, function(err, data) {
            if (err) {
              console.log('[socket] send_rain error:', err);
              Dispatcher.sendAction('NEW_MESSAGE', {channel: "lobby", text:err, created_at: d.toJSON(),user:{role: "BOT", uname: "ERROR"}});
              return;
            }
            Dispatcher.sendAction('UPDATE_USER', { balance: worldStore.state.user.balance - totalrain});
            console.log('Successfully sent rain:', data);

          });

      }else {
        Dispatcher.sendAction('NEW_MESSAGE', {channel: "lobby", text:error, created_at: d.toJSON(),user:{role: "BOT", uname: "ERROR"}});
      }

    });

    function changeCSS(cssFile, cssLinkIndex) {
      var oldlink = document.getElementsByTagName("link").item(cssLinkIndex);
      var newlink = document.createElement("link");
      newlink.setAttribute("rel", "stylesheet");
      newlink.setAttribute("type", "text/css");
      newlink.setAttribute("href", cssFile);
      document.getElementsByTagName("head").item(0).replaceChild(newlink, oldlink);
      }

    Dispatcher.registerCallback('PARSE_COMMAND',function(text){
      var error = null;
      var tipres = text.split(" ");
      var totalrain;
      var d = new Date();
      var coin_type_send = tipres[2];


      if (text.substring(0, 4) == "/tip") {
        Dispatcher.sendAction('SEND_TIP',text);
      }
      else if (text.substring(0, 5) == "/rain"){
        self.state.sent_to = 0;
        Dispatcher.sendAction('SEND_RAIN',text);
      }else if (text.substring(0, 6) == "/light"){
        changeCSS('https://bootswatch.com/sandstone/bootstrap.min.css', 0);
      }
      else if (text.substring(0, 5) == "/dark"){
        changeCSS('https://bootswatch.com/cyborg/bootstrap.min.css', 0);
      }
      else if (text.substring(0, 5) == "/help"){
        text = "Commands Available:";
        Dispatcher.sendAction('NEW_MESSAGE', {channel: "lobby", text:text, created_at: d.toJSON(),user:{role: "BOT", uname: "HELP"} });
        text = "/tip [user] [amount] [type]";
        Dispatcher.sendAction('NEW_MESSAGE', {channel: "lobby", text:text, created_at: d.toJSON(),user:{role: "BOT", uname: "HELP"} });
        text = "/rain [amount] [type]";
        Dispatcher.sendAction('NEW_MESSAGE', {channel: "lobby", text:text, created_at: d.toJSON(),user:{role: "BOT", uname: "HELP"} });
        text = "/light and /dark";
        Dispatcher.sendAction('NEW_MESSAGE', {channel: "lobby", text:text, created_at: d.toJSON(),user:{role: "BOT", uname: "HELP"} });
        text = "/pm [user] [message]";
        Dispatcher.sendAction('NEW_MESSAGE', {channel: "lobby", text:text, created_at: d.toJSON(),user:{role: "BOT", uname: "HELP"} });
      }
      else {  // SEND lINE MESSAGE IF COMMAND NOT RECOGNIZED
        console.log('Chat Command Not Recognized');
        self.state.waitingForServer = true;
        self.emitter.emit('change', self.state);
        socket.emit('new_message', { text: text }, function(err) {
          if (err) {
            alert('Chat Error: ' + err);
          }
        });
      }
    });

});


var firstseed = Math.floor(Math.random()*(Math.pow(2,32)-1));

if (localStorage.ROW1){
  var storedpaytables = {
  'ROW1': [],//localStorage.ROW1.split(","),
  'ROW2': [],//localStorage.ROW2.split(","),
  'ROW3': [],//localStorage.ROW3.split(","),
  'ROW4': [],//localStorage.ROW4.split(","),
  'ROW5': []//localStorage.ROW5.split(",")
  };

  var temphold = localStorage.ROW1.split(",");
  temphold.map(function(n){storedpaytables.ROW1.push(parseFloat(n));});
  temphold = localStorage.ROW2.split(",");
  temphold.map(function(n){storedpaytables.ROW2.push(parseFloat(n));});
  temphold = localStorage.ROW3.split(",");
  temphold.map(function(n){storedpaytables.ROW3.push(parseFloat(n));});
  temphold = localStorage.ROW4.split(",");
  temphold.map(function(n){storedpaytables.ROW4.push(parseFloat(n));});
  temphold = localStorage.ROW5.split(",");
  temphold.map(function(n){storedpaytables.ROW5.push(parseFloat(n));});

}else {
    var storedpaytables = {
    'ROW1': [2, 1.9, 1.8, 1.6, 1.45, 1.2, 1, 0.9, 0.8, 0.9, 1, 1.2, 1.45, 1.6, 1.8, 1.9, 2],
    'ROW2': [3, 1.5, 1.4, 1.3, 1.2, 0.2, 1.1, 1.1, 1.1, 1.1, 1.1, 0.2, 1.2, 1.3, 1.4, 1.5, 3],
    'ROW3': [23, 9, 3, 2, 1.5, 1.2, 1.1, 1, 0.4, 1, 1.1, 1.2, 1.5, 2, 3, 9, 23],
    'ROW4': [121, 47, 13, 5, 3, 1.4, 1, 0.5, 0.3, 0.5, 1, 1.4, 3, 5, 13, 47, 121],
    'ROW5': [999, 0, 50, 1, 1.2, 0, 1.1, 1.1, 0, 1.1, 1.1, 0, 1.2, 1, 50, 0, 999]
  };
}

if (localStorage.TABLE4){
  var storedpaytables_slots = {
    'TABLE1': [200, 100, 90, 75, 40, 25, 15, 15, 10, 10, 20, 10, 4, 1],
    'TABLE2': [50, 50, 40, 40, 40, 25, 25, 20, 10, 10, 30, 20, 4, 2],
    'TABLE3': [300, 60, 60, 50, 40, 25, 15, 15, 10, 5, 20, 10, 4, 1],
    'TABLE4': []//localStorage.ROW5.split(",")
  };

  var temphold = localStorage.TABLE4.split(",");
  temphold.map(function(n){storedpaytables_slots.TABLE4.push(parseFloat(n));});

}else {
    var storedpaytables_slots = {
      'TABLE1': [200, 100, 90, 75, 40, 25, 15, 15, 10, 10, 20, 10, 4, 1],
      'TABLE2': [50, 50, 40, 40, 40, 25, 25, 20, 10, 10, 30, 20, 4, 2],
      'TABLE3': [300, 60, 60, 50, 40, 25, 15, 15, 10, 5, 20, 10, 4, 1],
      'TABLE4': [200, 100, 90, 75, 40, 25, 15, 15, 10, 10, 20, 10, 4, 1]
  };
}

function randomUint32() {
  if (window && window.crypto && window.crypto.getRandomValues && Uint32Array) {
      var o = new Uint32Array(1);
      window.crypto.getRandomValues(o);
      return o[0];
  } else {
      console.warn('Falling back to pseudo-random client seed');
      return Math.floor(Math.random() * Math.pow(2, 32));
  }
}

var betStore = new Store('bet', {
  nextHash: undefined,
  lastHash: undefined,
  lastSalt: undefined,
  lastSecret: undefined,
  lastSeed: undefined,
  lastid: undefined,
  raw_outcome: undefined,
  wager: {
    str: '0.000001',
    num: 0.000001,
    error: undefined
  },
  ChanceInput: {
    str: '49.5000',
    num: 49.5000,
    error: undefined
  },
  multiplier: {
    str: '2.0000',
    num: 2.0000,
    error: undefined
  },
  clientSeed: {
    num: firstseed,
    str: firstseed.toString(),
    error:null
  },
  randomseed: false,
  pay_tables: storedpaytables,
  slots_tables: storedpaytables_slots,
  house_edge: config.house_edge,
  hotkeysEnabled: false,
  betVelocity: 150,
  rt_Outcome:{
    str: '14',
    num: 14,
    background: '#B50B32'
  },
  rt_TotalWager: 0,
  rt_ChipSize: 1,
  RollHistory:[3,21,1,26,16,0,8,23,7,10,0,16,5,24,13,18,3],
  rt_stats:[2.7,2.7,2.7,2.7,2.7,2.7,2.7,2.7,2.7,2.7,2.7,2.7,2.7,2.7,2.7,2.7,2.7,2.7,2.7,2.7,2.7,2.7,2.7,2.7,2.7,2.7,2.7,2.7,2.7,2.7,2.7,2.7,2.7,2.7,2.7,2.7,2.7],
  BombSelect: 5,
  BS_Game:{
    state: 'STOP',
    bombs: 5,
    cleared: 0,
    stake: 100, //in sats
    next: 100, //in sats
  },
  bc_start_multi: {
    str: '1.01',
    num: 1.01,
    error: undefined
  },
  bc_step_size: {
    str: '0.01',
    num: 0.01,
    error: undefined
  },
  bc_stop_multi: {
    str: '5.00',
    num: 5.00,
    error: undefined
  },
  bc_target_direction: '<',
  bc_game_running: false,
  bc_multi: 1.01,
  bc_wager: 1.00,
  bc_base: 1.00,
  bitclimber_delay:undefined,
  bc_game_runout_en:true,
  bc_game_runout:false,
  sliderPos: 75.0000,
  sliderStart:50.0000,
  sliderEnd: 100.0000,
  sliderPos2: 25.0000,
  sliderStart2: 0.0000,
  sliderEnd2: 50.0000,
  activesliders: 2
}, function() {
  var self = this;

  Dispatcher.registerCallback('UPDATE_SLIDER_POS', function(newPos) {
    //self.state.sliderPos = newPos;
    var position = newPos;
    var winProb = helpers.multiplierToWinProb(betStore.state.multiplier.num);
    var range = ((winProb * - 100)*-1).toFixed(4);
    var rangesplit;

    if(self.state.activesliders == 1){
    rangesplit = range/2;


    if (position < rangesplit){
      position = rangesplit;
    }else if (position > (100 - rangesplit)){
      position = 100 - rangesplit;
    }

    self.state.sliderStart = (position - rangesplit).toFixed(4);
    self.state.sliderEnd =  (position + rangesplit).toFixed(4);
    self.state.sliderPos = position;
  }else{
    rangesplit = range/4;

    if (position[0] < rangesplit){ //CHECK MIN
      position[0] = rangesplit;
    }else if (position[0] > (100 - (rangesplit * 3))){ //CHECK MAX
      position[0] = 100 - (rangesplit * 3);
      position[1] = 100 - rangesplit;
    }else if((position[0] + rangesplit) > (position[1] - rangesplit)){ //CHECK INTERFERANCE
      if (position[1] >= (100 - rangesplit)){
        position[0] = 100 - (rangesplit * 3);
        position[1] = 100 - rangesplit;
      }else {
        position[1] = position[0] + (rangesplit * 2);
        if (position[1] > (100 - rangesplit)){
          position[1] = 100 - rangesplit;
          position[0] = 100 - (rangesplit * 3);
        }
      }
    }

    if (position[1] > (100 - rangesplit)){
      position[1] = 100 - rangesplit;
    }


    self.state.sliderStart = (position[0] - rangesplit).toFixed(4);
    self.state.sliderEnd =  (position[0] + rangesplit).toFixed(4);
    self.state.sliderPos = position[0];
    self.state.sliderStart2 = (position[1] - rangesplit).toFixed(4);
    self.state.sliderEnd2 =  (position[1] + rangesplit).toFixed(4);
    self.state.sliderPos2 = position[1];

  }



    self.emitter.emit('slider_change', self.state);
  });

  Dispatcher.registerCallback('UPDATE_SLIDER_COUNT', function(new_count) {
    //self.state.sliderPos = newPos;
    self.state.activesliders = new_count;

    if (self.state.activesliders == 2){
      var position1 = 25;
      var position2 = 75;
      var winProb = helpers.multiplierToWinProb(betStore.state.multiplier.num);
      var range = ((winProb * - 100)*-1).toFixed(4);
      var rangesplit = range/4;

      if (position1 < rangesplit){
        position1 = rangesplit;
      }else if (position1 > (100 - rangesplit)){
        position1 = 100 - rangesplit;
      }

      if (position2 < rangesplit){
        position2 = rangesplit;
      }else if (position2 > (100 - rangesplit)){
        position2 = 100 - rangesplit;
      }

      self.state.sliderStart = (position1 - rangesplit).toFixed(4);
      self.state.sliderEnd =  (position1 + rangesplit).toFixed(4);
      self.state.sliderPos = position1;

      self.state.sliderStart2 = (position2 - rangesplit).toFixed(4);
      self.state.sliderEnd2 = (position2 + rangesplit).toFixed(4);
      self.state.sliderPos2 = position2;
    }else {
      self.state.activesliders = 1; //SANITY CHECK;
      var position = 50;
      var winProb = helpers.multiplierToWinProb(betStore.state.multiplier.num);
      var range = ((winProb * - 100)*-1).toFixed(4);
      var rangesplit = range/2;

      if (position < rangesplit){
        position = rangesplit;
      }else if (position > (100 - rangesplit)){
        position = 100 - rangesplit;
      }

      self.state.sliderStart = (position - rangesplit).toFixed(4);
      self.state.sliderEnd =  (position + rangesplit).toFixed(4);
      self.state.sliderPos = position;
    //  self.state.sliderStart2 = undefined;
    //  self.state.sliderEnd2 = undefined;
    //  self.state.sliderPos2 = undefined;
    }
    self.emitter.emit('change', self.state);
    self.emitter.emit('slider_change', self.state);
  });

  Dispatcher.registerCallback('UPDATE_BC_START_MULTI', function(newMult) {
    self.state.bc_start_multi = _.merge({}, self.state.bc_start_multi, newMult);
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('UPDATE_BC_STEP_SIZE', function(newMult) {
    self.state.bc_step_size = _.merge({}, self.state.bc_step_size, newMult);
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('UPDATE_BC_STOP_MULTI', function(newMult) {
    self.state.bc_stop_multi = _.merge({}, self.state.bc_stop_multi, newMult);
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('TOGGLE_BC_TARGET', function() {
    if (self.state.bc_target_direction == '<'){
      self.state.bc_target_direction = '>';
    }else {
      self.state.bc_target_direction = '<';
    }
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('START_BITCLIMBER', function() {
    self.state.bc_game_running = true;
    self.state.bc_multi = self.state.bc_start_multi.num;
    self.state.bc_wager = self.state.wager.num;
    self.state.bc_base = self.state.wager.num;
    self.state.bc_game_runout = false;
    data2 = undefined;

    data2 = {
        labels: labelfill(1),//labelfill(config.bet_buffer_size),//['a','b','c','d'],
        datasets: [ {
                label: "dataset1",
                fillColor: "rgba(220,220,220,0.2)",
                strokeColor: "rgba(119,179,0, 0.8)",//"rgba(220,220,220,1)",
                pointColor: "rgba(119,179,0, 0.8)",//"rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: bcbasefill2(1)//rand(-32, 1000, 50)
              } ]
    };

    //Place_BitClimber_Bet();
    self.state.bitclimber_delay = setTimeout(Place_BitClimber_Bet(), 250);
    self.emitter.emit('change', self.state);
    self.emitter.emit('BitClimber_change', self.state);
  });

  Dispatcher.registerCallback('STOP_BITCLIMBER', function() {
    self.state.bc_game_running = false;
    clearTimeout(self.state.bitclimber_delay);
    self.emitter.emit('change', self.state);
    self.emitter.emit('BitClimber_change', self.state);
  });

  Dispatcher.registerCallback('CASH_OUT_BITCLIMBER', function() {
    //self.state.bc_game_running = false;
    //clearTimeout(self.state.bitclimber_delay);
    self.state.bc_game_runout = true;

    self.emitter.emit('change', self.state);
    self.emitter.emit('BitClimber_change', self.state);
  });

  Dispatcher.registerCallback('NEW_BC_DATAPOINT', function(newnum) {
    data2.labels.push(' ');
    data2.datasets[0].data.push(newnum);
    self.emitter.emit('BitClimber_change', self.state);
  });

  Dispatcher.registerCallback('BITCLIMBER_FUNCTION', function(bet) {
/*
    var profit_x = (bet.profit/helpers.convCoinTypetoSats(self.state.bc_wager)).toFixed(2);
    var num = Number(self.state.bc_multi) + Number(profit_x);//self.state.bc_step_size.num;
    self.state.bc_multi = num.toFixed(2);//+= self.state.bc_step_size.num;
    */
    var num = Number(self.state.bc_multi) + Number(self.state.bc_start_multi.num - 1);//self.state.bc_step_size.num;
    self.state.bc_multi = num.toFixed(2);//+= self.state.bc_step_size.num;

    var wager = helpers.convCoinTypetoSats(self.state.bc_wager)
    wager += bet.profit;

    if ((self.state.bc_multi > self.state.bc_stop_multi.num)||(self.state.bc_game_running == false)){
      if (self.state.bc_game_runout_en){
        self.state.bc_game_runout = true;
        self.state.bc_wager = helpers.convSatstoCointype(1);
        if (self.state.bc_game_running == true){
          self.state.bitclimber_delay = setTimeout(Place_BitClimber_Bet(), 250);
        }else {
          Dispatcher.sendAction('STOP_BITCLIMBER');
        }
      }else{
      Dispatcher.sendAction('STOP_BITCLIMBER');
      if (AutobetStore.state.Run_Autobet){
        if(config.debug){console.log('Auto_bet routine enabled');}
        Dispatcher.sendAction('AUTOBET_ROUTINE',bet);
      }
      }

    }else {
      self.state.bc_wager = helpers.convSatstoCointype(wager);
      self.state.bitclimber_delay = setTimeout(Place_BitClimber_Bet(), 250);
    }
    self.emitter.emit('change', self.state);
    //self.emitter.emit('BitClimber_change', self.state);
  });

  Dispatcher.registerCallback('TOGGLE_BC_RUNOUT', function(){
    self.state.bc_game_runout_en = !self.state.bc_game_runout_en;
    if (self.state.bc_game_runout_en){
      console.log('runout_enabled');
    }else {
      console.log('runout_disabled');
    }
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('SET_BOMBSELECT', function(num){
    if ((num > 0)&&(num < 25))
      {self.state.BombSelect = num;
        if ((num == 1)&&(self.state.house_edge > 0.039)){
          Dispatcher.sendAction('INC_HOUSE_EDGE');
        }
    self.emitter.emit('change', self.state);}

  });

  Dispatcher.registerCallback('START_BITSWEEP', function(){
    if ((self.state.BombSelect == 1)&&(self.state.house_edge > 0.039)){
      Dispatcher.sendAction('INC_HOUSE_EDGE');
    }
    self.state.BS_Game.state = 'RUNNING';
    self.state.BS_Game.bombs = self.state.BombSelect;
    self.state.BS_Game.cleared = 0;
    var chance = (25-self.state.BS_Game.bombs-self.state.BS_Game.cleared)/(25-self.state.BS_Game.cleared);
    self.state.BS_Game.stake = helpers.convCoinTypetoSats(self.state.wager.num);
    self.state.BS_Game.next = (self.state.BS_Game.stake * helpers.WinProbtoMultiplier(chance)) - self.state.BS_Game.stake;
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('GET_NEXT_BITSWEEP', function(){
    self.state.BS_Game.cleared += 1;
    if (25-self.state.BS_Game.bombs-self.state.BS_Game.cleared <= 0){
      Dispatcher.sendAction('STOP_BITSWEEP');
    }
    else{
        var chance = (25-self.state.BS_Game.bombs-self.state.BS_Game.cleared)/(25-self.state.BS_Game.cleared);
        self.state.BS_Game.stake = self.state.BS_Game.stake + self.state.BS_Game.next;
        self.state.BS_Game.next = (self.state.BS_Game.stake * helpers.WinProbtoMultiplier(chance)) - self.state.BS_Game.stake;
    }
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('STOP_BITSWEEP', function(){
    self.state.BS_Game.state = 'STOP';
    self.state.BS_Game.stake = helpers.convCoinTypetoSats(self.state.wager.num);
    ShowAllBombs(self.state.BS_Game.cleared, self.state.BS_Game.bombs);
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('TOGGLE_RND_SEED', function(){
    self.state.randomseed = !self.state.randomseed;
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('UPDATE_PAY_TABLES', function(data) {
    self.state.pay_tables.ROW1 = data.ROW1;
    self.state.pay_tables.ROW2 = data.ROW2;
    self.state.pay_tables.ROW3 = data.ROW3;
    self.state.pay_tables.ROW4 = data.ROW4;
    self.state.pay_tables.ROW5 = data.ROW5;
    //localStorage.paytables = self.state.pay_tables;

    localStorage.ROW1 = data.ROW1;
    localStorage.ROW2 = data.ROW2;
    localStorage.ROW3 = data.ROW3;
    localStorage.ROW4 = data.ROW4;
    localStorage.ROW5 = data.ROW5;
    self.emitter.emit('change_plinko', self.state);
    Dispatcher.sendAction('UPDATE_PLINKO');
  });

  Dispatcher.registerCallback('UPDATE_PAY_TABLES_SLOTS', function(data) {

    self.state.slots_tables.TABLE4 = data.TABLE4;

    localStorage.TABLE4 = data.TABLE4;
    self.emitter.emit('change_plinko', self.state);
    Dispatcher.sendAction('UPDATE_PLINKO');
  });
  ////////////
  Dispatcher.registerCallback('UPDATE_ROLLHISTORY', function(newroll){
    var color;
    self.state.RollHistory.shift();
    self.state.RollHistory.push(newroll);
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('UPDATE_RT_STATS', function(stats){
    self.state.rt_stats = stats;
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('UPDATE_CHIPSIZE', function(newsize){
    self.state.rt_ChipSize = newsize;//_.merge({}, self.state.rt_ChipSize, newsize);
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('UPDATE_TOTALWAGER', function(newwager){
    self.state.rt_TotalWager = newwager;//_.merge({}, self.state.rt_TotalWager, newwager);
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('UPDATE_RT_OUTCOME', function(newOutcome) {
    self.state.rt_Outcome = _.merge({}, self.state.rt_Outcome, newOutcome);
    var n = parseInt(self.state.rt_Outcome.str, 10);
    if (isNaN(n)) {

    } else {
      self.state.rt_Outcome.str = n;
      self.state.rt_Outcome.num = n;
    }

    switch(self.state.rt_Outcome.num){
      case 0:
        self.state.rt_Outcome.background = '#009901';
        break;
      case 1:
      case 3:
      case 5:
      case 7:
      case 9:
      case 12:
      case 14:
      case 16:
      case 18:
      case 19:
      case 21:
      case 23:
      case 25:
      case 27:
      case 30:
      case 32:
      case 34:
      case 36:
        self.state.rt_Outcome.background = '#B50B32';
        break;
      default:
        self.state.rt_Outcome.background = 'black';
        break;
      }
    self.emitter.emit('change', self.state);
  });
  ////////////
  Dispatcher.registerCallback('SET_HOUSE_EDGE', function(new_edge){ //worldStore.state.currGameTab
    var he_limit = 0.05;
    if ((worldStore.state.currGameTab == 'BITSWEEP')&&(self.state.BombSelect == 1)){
      he_limit = 0.039;
    }else {
      he_limit = 0.05;
    }

    if (new_edge < he_limit){
      if(new_edge >= 0.008){
          self.state.house_edge = new_edge;
        }else{
          self.state.house_edge = 0.008;
        }
      }else{
          self.state.house_edge = he_limit;
      }

    var winProb = helpers.multiplierToWinProb(self.state.multiplier.num);
    Dispatcher.sendAction('UPDATE_CHANCE_IN', {
            num: (winProb*100).toFixed(4),
            str: (winProb*100).toFixed(4).toString(),
            error: null
          });

    Dispatcher.sendAction('UPDATE_BANKROLL');
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('UPDATE_CLIENT_SEED', function(newSeed) {
    self.state.clientSeed = _.merge({}, self.state.clientSeed, newSeed);

    var n = parseInt(self.state.clientSeed.str, 10);

    // If n is a number, ensure it's at least 1
    if (isFinite(n)) {
      n = Math.max(n, 0);
      self.state.clientSeed.str = n.toString();
    }

    // Ensure clientSeed is a number
    if (isNaN(n) || /[^\d]/.test(n.toString())) {
      self.state.clientSeed.error = 'INVALID_SEED';
    // Ensure clientSeed is less than max seed
  } else if (n > 4294967295) {
      self.state.clientSeed.error = 'SEED_TOO_HIGH';
      self.state.clientSeed.num = n;
    } else {
      // clientSeed is valid
      self.state.clientSeed.error = null;
      self.state.clientSeed.str = n.toString();
      self.state.clientSeed.num = n;
    }

    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('SET_NEXT_HASH', function(hexString) {
    self.state.nextHash = hexString;
    next_hash = hexString;
    self.emitter.emit('change', self.state);
    self.emitter.emit('lastfair_change', self.state);
  });

  Dispatcher.registerCallback('SET_LAST_FAIR', function(last_params) {
    self.state.lastHash = last_params.hash;
    self.state.lastSalt = last_params.salt;
    self.state.lastSecret = last_params.secret;
    self.state.lastSeed = last_params.seed;
    self.state.lastid = last_params.id;
    self.emitter.emit('lastfair_change', self.state);
  });

  Dispatcher.registerCallback('CALC_RAW_OUTCOME',function(){
  self.state.raw_outcome = ((self.state.lastSecret+self.state.lastSeed) % 4294967296);
  self.emitter.emit('lastfair_change', self.state);
  });

  Dispatcher.registerCallback('UPDATE_LAST_HASH', function(str){
  self.state.lastHash = str;
  self.emitter.emit('lastfair_change', self.state);
  });
  Dispatcher.registerCallback('UPDATE_LAST_SALT', function(str){
  self.state.lastSalt = str;
  self.emitter.emit('lastfair_change', self.state);
  });
  Dispatcher.registerCallback('UPDATE_LAST_SECRET', function(str){
  self.state.lastSecret = str;
  self.emitter.emit('lastfair_change', self.state);
  });
  Dispatcher.registerCallback('UPDATE_LAST_SEED', function(str){
  self.state.lastSeed = str;
  self.emitter.emit('lastfair_change', self.state);
  });

  Dispatcher.registerCallback('UPDATE_WAGER', function(newWager) {
    self.state.wager = _.merge({}, self.state.wager, newWager);
    //console.log('UPDATE_WAGER');
    var n = parseFloat(self.state.wager.str, 10);

    var isFloatRegexp = /^(\d*\.)?\d+$/;

    switch(worldStore.state.coin_type){
      case 'BITS':
        if (isNaN(n) || !isFloatRegexp.test(n.toString())) {
          self.state.wager.error = 'INVALID_WAGER';
        // Ensure user can afford balance
        } else if (n < 0.01){
          self.state.wager.error = 'INVALID_WAGER';
        } else if (helpers.getPrecision(n) > 2) {
          self.state.wager.error = 'INVALID_WAGER';
        } else if (n * 100 > worldStore.state.user.balance) {
          self.state.wager.error = 'CANNOT_AFFORD_WAGER';
          self.state.wager.num = n;
        } else {
          // wagerString is valid
          self.state.wager.error = null;
          self.state.wager.str = n.toFixed(2).toString();
          self.state.wager.num = n;
        }
        break;
      case 'BTC':
        if (isNaN(n)) {
          self.state.wager.error = 'INVALID_WAGER';
        // Ensure user can afford balance
        } else if (n < 0.00000001){
          self.state.wager.error = 'INVALID_WAGER';
        } else if (helpers.getPrecision(n) > 8) {
          self.state.wager.error = 'INVALID_WAGER';
        } else if (n / 0.00000001 > worldStore.state.user.balance) {
          self.state.wager.error = 'CANNOT_AFFORD_WAGER';
          self.state.wager.num = n;
        } else {
          // wagerString is valid
          self.state.wager.error = null;
          self.state.wager.str = n.toFixed(8).toString();
          self.state.wager.num = n;
        }
        break;
      case 'USD':
        var min_bet = 1 * 0.000001 * worldStore.state.btc_usd;
        if (isNaN(n)) {
          self.state.wager.error = 'INVALID_WAGER';
        // Ensure user can afford balance
        } else if (n < min_bet){
          self.state.wager.error = 'INVALID_WAGER';
        } else if (helpers.getPrecision(n) > 8) {
          self.state.wager.error = 'INVALID_WAGER';
        } else if (((n / 0.00000001)/worldStore.state.btc_usd) > worldStore.state.user.balance) {
          self.state.wager.error = 'CANNOT_AFFORD_WAGER';
          self.state.wager.num = n;
        } else {
          // wagerString is valid
          self.state.wager.error = null;
          self.state.wager.str = n.toFixed(8).toString();
          self.state.wager.num = n;
        }
        break;
      case 'EUR':
        var min_bet = 1 * 0.000001 * worldStore.state.btc_eur;
        if (isNaN(n)) {
          self.state.wager.error = 'INVALID_WAGER';
        // Ensure user can afford balance
      } else if (n < min_bet){
          self.state.wager.error = 'INVALID_WAGER';
        } else if (helpers.getPrecision(n) > 8) {
          self.state.wager.error = 'INVALID_WAGER';
        } else if (((n / 0.00000001)/worldStore.state.btc_eur) > worldStore.state.user.balance) {
          self.state.wager.error = 'CANNOT_AFFORD_WAGER';
          self.state.wager.num = n;
        } else {
          // wagerString is valid
          self.state.wager.error = null;
          self.state.wager.str = n.toFixed(8).toString();
          self.state.wager.num = n;
        }
        break;
    }
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('UPDATE_WAGER_SOFT', function(newWager) {
    self.state.wager = _.merge({}, self.state.wager, newWager);

    var n = parseFloat(self.state.wager.str, 10);

    var isFloatRegexp = /^(\d*\.)?\d+$/;

    switch(worldStore.state.coin_type){
      case 'BITS':
        if (isNaN(n) || !isFloatRegexp.test(n.toString())) {
          self.state.wager.error = 'INVALID_WAGER';
        // Ensure user can afford balance
        } else if (n < 0.01){
          self.state.wager.error = 'INVALID_WAGER';
        } else if (helpers.getPrecision(n) > 2) {
          self.state.wager.error = 'INVALID_WAGER';
        } else if (n * 100 > worldStore.state.user.balance) {
          self.state.wager.error = 'CANNOT_AFFORD_WAGER';
          self.state.wager.num = n;
        } else {
          // wagerString is valid
          self.state.wager.error = null;
          //self.state.wager.str = n.toFixed(2).toString();
          self.state.wager.num = n;
        }
        break;
      case 'BTC':
        if (isNaN(n)) {
          self.state.wager.error = 'INVALID_WAGER';
        // Ensure user can afford balance
        } else if (n < 0.00000001){
          self.state.wager.error = 'INVALID_WAGER';
        } else if (helpers.getPrecision(n) > 8) {
          self.state.wager.error = 'INVALID_WAGER';
        } else if (n / 0.00000001 > worldStore.state.user.balance) {
          self.state.wager.error = 'CANNOT_AFFORD_WAGER';
          self.state.wager.num = n;
        } else {
          // wagerString is valid
          self.state.wager.error = null;
          //self.state.wager.str = n.toFixed(8).toString();
          self.state.wager.num = n;
        }
        break;
      case 'USD':
        var min_bet = 1 * 0.000001 * worldStore.state.btc_usd;
        if (isNaN(n)) {
          self.state.wager.error = 'INVALID_WAGER';
        // Ensure user can afford balance
        } else if (n < min_bet){
          self.state.wager.error = 'INVALID_WAGER';
        } else if (helpers.getPrecision(n) > 8) {
          self.state.wager.error = 'INVALID_WAGER';
        } else if (((n / 0.00000001)/worldStore.state.btc_usd) > worldStore.state.user.balance) {
          self.state.wager.error = 'CANNOT_AFFORD_WAGER';
          self.state.wager.num = n;
        } else {
          // wagerString is valid
          self.state.wager.error = null;
          //self.state.wager.str = n.toFixed(8).toString();
          self.state.wager.num = n;
        }
        break;
      case 'EUR':
        var min_bet = 1 * 0.000001 * worldStore.state.btc_eur;
        if (isNaN(n)) {
          self.state.wager.error = 'INVALID_WAGER';
        // Ensure user can afford balance
      } else if (n < min_bet){
          self.state.wager.error = 'INVALID_WAGER';
        } else if (helpers.getPrecision(n) > 8) {
          self.state.wager.error = 'INVALID_WAGER';
        } else if (((n / 0.00000001)/worldStore.state.btc_eur) > worldStore.state.user.balance) {
          self.state.wager.error = 'CANNOT_AFFORD_WAGER';
          self.state.wager.num = n;
        } else {
          // wagerString is valid
          self.state.wager.error = null;
          //self.state.wager.str = n.toFixed(8).toString();
          self.state.wager.num = n;
        }
        break;
    }
    self.emitter.emit('change', self.state);
  });


  Dispatcher.registerCallback('UPDATE_MULTIPLIER', function(newMult) {
    self.state.multiplier = _.merge({}, self.state.multiplier, newMult);
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('UPDATE_CHANCE_IN', function(newChance) {
    self.state.ChanceInput = _.merge({}, self.state.ChanceInput, newChance);
    self.emitter.emit('change', self.state);
  });

});


//var access_token = localStorage.access_token;
// The general store that holds all things until they are separated
// into smaller stores for performance.
var worldStore = new Store('world', {
  news_info: 'Welcome to Bit-Exo',
  isLoading: true,
  user: undefined,
  auth_id:undefined,////////TODO CHECK
  accessToken: access_token,
  hotkeysEnabled: false,
  currTab: 'HELP',
  currGameTab: 'DICE',
  coin_type:'BTC',
  plinko_loaded: false,
  bitsweep_loaded: false,
  slots_loaded: false,
  roulette_loaded: false,
  bitclimber_loaded: false,
  sliders_loaded: false,
  ShowChart: false,
  btc_usd: 440.00,
  btc_eur: 395.00,
  first_bet: false,
  bets: new CBuffer(config.bet_buffer_size),
  allBets: new CBuffer(config.bet_buffer_size),
  LiveGraph: false,
  grecaptcha: undefined,
  bankrollbalance: 0.0,
  bankrollwagered: 0.0,
  bankrollinvested: 0.0,
  filterwager: {
    str: '0',
    num: 0.0,
    error: undefined
  },
  filterprofit: {
    str: '0',
    num: 0.0,
    error: undefined
  },
  filteruser: {
    str: 'User',
    error: undefined
  },
  filtergame: 'ALL GAMES',
  revealed_balance: 0,
  showPayoutEditor: false,
  showClassic: true,
  currentAppwager: 0,
  jackpotlist: {
    lowwins: new CBuffer(10),
    highwins: new CBuffer(10)
  },
  biggestwins: new CBuffer(10),
  biggestlosses: new CBuffer(10),
  biggestwagered: new CBuffer(10),
  biggestprofit: new CBuffer(10),
  biggestjackpots: new CBuffer(10),
  weeklydata: {},
  reftxdata: [{
               _id:'1',
               created_at:'NO DATA       ',
               amt:0,
               status:'PENDING'
             }],
  refwd: {
    str: '0',
    num: 0.0,
    error: undefined
  },
  referred_users:[],
  dicestats:{
    bets: 0,
    wins: 0,
    loss: 0,
    wager: 0,
    profit:0
  },
  plinkostats:{
    bets: 0,
    wins: 0,
    loss: 0,
    wager: 0,
    profit:0
  },
  Roulettestats:{
    bets: 0,
    wins: 0,
    loss: 0,
    wager: 0,
    profit:0
  },
  bitsweepstats:{
    bets: 0,
    wins: 0,
    loss: 0,
    wager: 0,
    profit:0
  },
  slotsstats:{
    bets: 0,
    wins: 0,
    loss: 0,
    wager: 0,
    profit:0
  },
  BitClimberstats:{
    bets: 0,
    wins: 0,
    loss: 0,
    wager: 0,
    profit:0
  },
  Slidersstats:{
    bets: 0,
    wins: 0,
    loss: 0,
    wager: 0,
    profit:0
  },
  activePucks: {},
  // Pucks to render
  // Remove from this when they're done animating
  renderedPucks: {},
  // Used to show the latest X bets in the My Bets tab
  pucks: new CBuffer(50),
  plinko_running: false,
  animate_enable: true,
  rt_spin_running: false,
  slots_table: 1,
  slots_paytable: [200,100,90,75,40,25,15,15,10,10,20,10,4,1]
}, function() {
  var self = this;

  Dispatcher.registerCallback('START_ROULETTE',function(){
    self.state.rt_spin_running = true;
  });

  Dispatcher.registerCallback('STOP_ROULETTE',function(){
    self.state.rt_spin_running = false;
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('UPDATE_NEWS_INFO', function(data) {

  self.state.news_info = data.text;
  self.emitter.emit('news_info_update', self.state);
  });

  Dispatcher.registerCallback('GET_NEWS_INFO', function() {

    if (socket){
      socket.emit('get_news_info', function(err, data) {
      if (err) {
        console.log('[socket] news info error:', err);
        return;
      }
      console.log('[socket] Successfully retrived news info', data);
      if (data[0]){
      self.state.news_info = data[0].text;
      }else{
      self.state.news_info = data.text;
      }
      self.emitter.emit('news_info_update', self.state);
      });
    }
  });

  Dispatcher.registerCallback('SET_REFER_NAME', function(refname) {
    //localStorage.refname = null;
    localStorage.removeItem('refname');
  socket.emit('set_ref_id',refname);
  });

  Dispatcher.registerCallback('GET_REF_TX',function(){

  if (socket){
    socket.emit('get_ref_tx', function(err, data) {
    if (err) {
      console.log('[socket] get_ref_tx error:', err);
      return;
    }
    console.log('[socket] get_ref_tx Successfully retrived data:', data);

    self.state.reftxdata = data;

    self.emitter.emit('change_ref_data', self.state);
    });
  }

  });

  Dispatcher.registerCallback('GET_REFERRED_USERS',function(){
  if (socket){
    socket.emit('get_user_refs',function(err,data){
      if (err) {
        console.log('[socket] get_user_refs error:', err);
        return;
      }
      console.log('[socket] get_user_refs Successfully retrived data:', data);

      self.state.referred_users = data;

      self.emitter.emit('change_ref_data', self.state);
    });
  }
  });

  Dispatcher.registerCallback('REQ_REF_WD',function(params){

  if (socket){

    console.log('[socket] sending withdraw request', params)

    socket.emit('request_ref_wd', params, function(err, data) {
    if (err) {
      console.log('[socket] request_ref_wd error:', err);
      return;
    }
    console.log('[socket] request_ref_wd Successfully sent request for wd: ', data);

    //self.state.reftxdata.push(data);
    Dispatcher.sendAction('GET_REF_TX', null);

    self.emitter.emit('change_ref_data', self.state);
    });
  }

  });

  Dispatcher.registerCallback('UPDATE_REF_WD', function(newamnt) {
  self.state.refwd = _.merge({}, self.state.refwd, newamnt);

  var balance = self.state.user.refprofit - self.state.user.refpaid;

  var n = parseFloat(self.state.refwd.str, 10);

  var isFloatRegexp = /^(\d*\.)?\d+$/;

  switch(worldStore.state.coin_type){
    case 'BITS':
      if (isNaN(n) || !isFloatRegexp.test(n.toString())) {
        self.state.refwd.error = 'INVALID_AMT';
      // Ensure user can afford balance
      } else if (n < 1000){
        self.state.refwd.error = 'INVALID_AMT';
      } else if (helpers.getPrecision(n) > 2) {
        self.state.refwd.error = 'INVALID_AMT';
      } else if (n * 100 > balance) {
        self.state.refwd.error = 'CANNOT_AFFORD';
        self.state.refwd.num = n;
      } else {
        // wagerString is valid
        self.state.refwd.error = null;
        //self.state.wager.str = n.toFixed(2).toString();
        self.state.refwd.num = n;
      }
      break;
    case 'BTC':
      if (isNaN(n)) {
        self.state.refwd.error = 'INVALID_AMT';
      // Ensure user can afford balance
      } else if (n < 0.001){
        self.state.refwd.error = 'INVALID_AMT';
      } else if (helpers.getPrecision(n) > 8) {
        self.state.refwd.error = 'INVALID_AMT';
      } else if (n / 0.00000001 > balance) {
        self.state.refwd.error = 'CANNOT_AFFORD_WAGER';
        self.state.refwd.num = n;
      } else {
        // wagerString is valid
        self.state.refwd.error = null;
        //self.state.wager.str = n.toFixed(8).toString();
        self.state.refwd.num = n;
      }
      break;
    case 'USD':
      var min_bet = 1 * 0.001 * worldStore.state.btc_usd;
      if (isNaN(n)) {
        self.state.refwd.error = 'INVALID_AMT';
      // Ensure user can afford balance
      } else if (n < min_bet){
        self.state.refwd.error = 'INVALID_AMT';
      } else if (helpers.getPrecision(n) > 8) {
        self.state.refwd.error = 'INVALID_AMT';
      } else if (((n / 0.00000001)/worldStore.state.btc_usd) > balance) {
        self.state.refwd.error = 'CANNOT_AFFORD_WAGER';
        self.state.refwd.num = n;
      } else {
        // wagerString is valid
        self.state.refwd.error = null;
        //self.state.wager.str = n.toFixed(8).toString();
        self.state.refwd.num = n;
      }
      break;
    case 'EUR':
      var min_bet = 1 * 0.001 * worldStore.state.btc_eur;
      if (isNaN(n)) {
        self.state.refwd.error = 'INVALID_AMT';
      // Ensure user can afford balance
    } else if (n < min_bet){
        self.state.refwd.error = 'INVALID_AMT';
      } else if (helpers.getPrecision(n) > 8) {
        self.state.refwd.error = 'INVALID_AMT';
      } else if (((n / 0.00000001)/worldStore.state.btc_eur) > balance) {
        self.state.refwd.error = 'CANNOT_AFFORD_WAGER';
        self.state.refwd.num = n;
      } else {
        // wagerString is valid
        self.state.refwd.error = null;
        //self.state.wager.str = n.toFixed(8).toString();
        self.state.refwd.num = n;
      }
      break;
  }
  self.emitter.emit('change_ref_data', self.state);
  });

  Dispatcher.registerCallback('TOGGLE_ANIMATION',function(){
    self.state.animate_enable = !self.state.animate_enable;
  });

  Dispatcher.registerCallback('SET_SLOTS_TABLE',function(table){
    self.state.slots_table = table;

    switch(self.state.slots_table){
      case 1:
        self.state.slots_paytable = betStore.state.slots_tables.TABLE1;
        break;
      case 2:
        self.state.slots_paytable = betStore.state.slots_tables.TABLE2;
        break;
      case 3:
        self.state.slots_paytable = betStore.state.slots_tables.TABLE3;
        break;
      case 4:
        self.state.slots_paytable = betStore.state.slots_tables.TABLE4;
        break;
      default:
        self.state.slots_table = 1;
        self.state.slots_paytable = betStore.state.slots_tables.TABLE1;
      break;
    }
    self.emitter.emit('change_slots', self.state);

    skanvas.renderAll();
    setTimeout(function(){
    skanvas.renderWheels();
    },50);

   });

  Dispatcher.registerCallback('TOGGLE_SLOTS_TABLE',function(){
    switch(self.state.slots_table){
      case 1:
        self.state.slots_table = 2;
        self.state.slots_paytable = betStore.state.slots_tables.TABLE2;
        break;
      case 2:
        self.state.slots_table = 3;
        self.state.slots_paytable = betStore.state.slots_tables.TABLE3;
        break;
      case 3:
        self.state.slots_table = 1;
        self.state.slots_paytable = betStore.state.slots_tables.TABLE1;
        break;
      default:
      self.state.slots_table = 1;
      break;
    }
    self.emitter.emit('change_slots', self.state);

    skanvas.renderAll();
    setTimeout(function(){
    skanvas.renderWheels();
    },50);

   });

   Dispatcher.registerCallback('TOGGLE_SLOTS_TABLE_DN',function(){
     switch(self.state.slots_table){
       case 3:
         self.state.slots_table = 2;
         self.state.slots_paytable = betStore.state.slots_tables.TABLE2;
         break;
       case 1:
         self.state.slots_table = 3;
         self.state.slots_paytable = betStore.state.slots_tables.TABLE3;
         break;
       case 2:
         self.state.slots_table = 1;
         self.state.slots_paytable = betStore.state.slots_tables.TABLE1;
         break;
       default:
       self.state.slots_table = 1;
       break;
     }
     self.emitter.emit('change_slots', self.state);

     skanvas.renderAll();
     setTimeout(function(){
     skanvas.renderWheels();
     },50);

    });

  Dispatcher.registerCallback('TOGGLE_CHART',function(){
    self.state.ShowChart = !self.state.ShowChart;
    if (self.state.ShowChart){
     if(worldStore.state.user != undefined){
      if (worldStore.state.bets.data[worldStore.state.bets.end] == null){
        var params = {
          uname: worldStore.state.user.uname
        };
        socket.emit('list_user_bets', params, function(err, bets) {
          if (err) {
            if(config.debug){console.log('[socket] list_user_bets failure:', err);}
            self.emitter.emit('show_chart', self.state);
            return;
          }
          if(config.debug){console.log('[socket] list_user_bets success:', bets);}
          data1.datasets[0].data = [];
          data1.labels = [];
          bets.map(function(bet){
            bet.meta = {
              cond: bet.kind == 'DICE' ? bet.cond : '<',
              number: bet.kind == 'DICE' ? bet.target : 99.99,
              hash: 0,//bet.hash,
              isFair: true//CryptoJS.SHA256(bet.secret + '|' + bet.salt).toString() === hash
            };

            if (bet.kind != 'DICE')
              {
              bet.outcome = '-';
              }
            bet.meta.kind = bet.kind;

            Dispatcher.sendAction('NEW_CHART_DATAPOINT_QUIET',bet.profit/100);

          //  console.log('DATA_POINT: ' + helpers.convSatstoCointype(bet.profit));
          });

        //  Dispatcher.sendAction('INIT_USER_BETS', bets);
          self.emitter.emit('show_chart', self.state);
          Dispatcher.sendAction('INIT_USER_BETS', bets);
        });

      }else{
        data1.datasets[0].data = [];
        data1.labels = [];
        worldStore.state.bets.toArray().map(function(bet){

          Dispatcher.sendAction('NEW_CHART_DATAPOINT_QUIET',bet.profit/100);

          console.log('DATA_POINT: ' + helpers.convSatstoCointype(bet.profit));
        });
        self.emitter.emit('show_chart', self.state);
      }
    }else{
      self.emitter.emit('show_chart', self.state);
    }
  }else {
    self.emitter.emit('show_chart', self.state);
  }

  });


  Dispatcher.registerCallback('NEW_CHART_DATAPOINT', function(newnum) {
    var n;
    if (data1.datasets[0].data.length > 0){
    n = (Number(data1.datasets[0].data[data1.datasets[0].data.length - 1]) + Number(newnum)).toFixed(8);
    }else {
    n = newnum;
    }
    if (data1.labels.length < 101){
      data1.labels.push(' ');
    }
    else{
      data1.datasets[0].data.shift();
    }
    data1.datasets[0].data.push(n);
    self.emitter.emit('chart_change', self.state);
    self.emitter.emit('bet_history_change', self.state);
  });


  Dispatcher.registerCallback('NEW_CHART_DATAPOINT_QUIET', function(newnum) {
    var n;
    if (data1.datasets[0].data.length > 0){
    n = (Number(data1.datasets[0].data[data1.datasets[0].data.length - 1]) + Number(newnum)).toFixed(8);
    }else {
    n = newnum;
    }
    if (data1.labels.length < 100){
      data1.labels.push(' ');
    }
    else{
      data1.datasets[0].data.shift();
    }
    data1.datasets[0].data.push(n);
    //self.emitter.emit('chart_change', self.state);
    //self.emitter.emit('bet_history_change', self.state);
  });


  Dispatcher.registerCallback('LOAD_CHART_DATA', function() {

  //  data1.datasets[0].data = getuserbets(config.bet_buffer_size);

    //self.emitter.emit('bet_history_change', self.state);

    if(worldStore.state.user != undefined){
     if (worldStore.state.bets.data[worldStore.state.bets.end] == null){
       var params = {
         uname: worldStore.state.user.uname
       };
       socket.emit('list_user_bets', params, function(err, bets) {
         if (err) {
           if(config.debug){console.log('[socket] list_user_bets failure:', err);}
           self.emitter.emit('show_chart', self.state);
           return;
         }
         if(config.debug){console.log('[socket] list_user_bets success:', bets);}
         data1.datasets[0].data = [];
         data1.labels = [];
         bets.map(function(bet){
           bet.meta = {
             cond: bet.kind == 'DICE' ? bet.cond : '<',
             number: bet.kind == 'DICE' ? bet.target : 99.99,
             hash: 0,//bet.hash,
             isFair: true//CryptoJS.SHA256(bet.secret + '|' + bet.salt).toString() === hash
           };

           if (bet.kind != 'DICE')
             {
             bet.outcome = '-';
             }
           bet.meta.kind = bet.kind;

           Dispatcher.sendAction('NEW_CHART_DATAPOINT_QUIET',bet.profit/100);

           console.log('DATA_POINT: ' + helpers.convSatstoCointype(bet.profit));
         });

       //  Dispatcher.sendAction('INIT_USER_BETS', bets);
         self.emitter.emit('bet_history_change', self.state);
         Dispatcher.sendAction('INIT_USER_BETS', bets);
       });

     }else{
       data1.datasets[0].data = [];
       data1.labels = [];
       worldStore.state.bets.toArray().map(function(bet){

         Dispatcher.sendAction('NEW_CHART_DATAPOINT_QUIET',bet.profit/100);

       });
       self.emitter.emit('bet_history_change', self.state);
     }
   }else{
     self.emitter.emit('bet_history_change', self.state);
   }


  });

  Dispatcher.registerCallback('UPDATE_HISTORY', function() { //worldStore.state.chartbusy
    self.emitter.emit('bet_history_change', self.state);
  });

  Dispatcher.registerCallback('TOGGLE_LIVE_CHART', function() {
    self.state.LiveGraph = !self.state.LiveGraph;
    self.emitter.emit('bet_history_change', self.state);
  });

  Dispatcher.registerCallback('TOGGLE_HOTKEYS', function() {
    self.state.hotkeysEnabled = !self.state.hotkeysEnabled;
    self.emitter.emit('hotkeys_change', self.state);
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('DISABLE_HOTKEYS', function() {
    self.state.hotkeysEnabled = false;
    self.emitter.emit('hotkeys_change', self.state);
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('INIT_USER', function(data) {
  self.state.user = data.user;
  self.emitter.emit('change', self.state);
  });

  // data is object, note, assumes user is already an object
  Dispatcher.registerCallback('UPDATE_USER', function(data) {
    self.state.user = _.merge({}, self.state.user, data);
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('USER_LOGOUT', function() {
    self.state.user = undefined;
    self.state.accessToken = undefined;
    localStorage.removeItem('expires_at');
    localStorage.removeItem('access_token');
    localStorage.removeItem('auth_id');
    //self.state.bets.empty();
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

  Dispatcher.registerCallback('GRECAPTCHA_LOADED', function(_grecaptcha) {
    self.state.grecaptcha = _grecaptcha;
    self.emitter.emit('grecaptcha_loaded');
  });

  Dispatcher.registerCallback('UPDATE_FILTER_WAGER', function(newfilter) {
    self.state.filterwager = _.merge({}, self.state.filterwager, newfilter);
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('UPDATE_FILTER_PROFIT', function(newfilter) {
    self.state.filterprofit= _.merge({}, self.state.filterprofit, newfilter);
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('UPDATE_FILTER_USER', function(newfilter) {
    self.state.filteruser= _.merge({}, self.state.filteruser, newfilter);
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('SET_GAME_FILTER',function(game){
    self.state.filtergame = game;
    self.emitter.emit('change', self.state);
  });

////////////////////////////////////////////////////////////////////////
Dispatcher.registerCallback('MARK_PLINKO_LOADED', function() {
  self.state.plinko_loaded = true;
  self.emitter.emit('change_game_tab', self.state);
});
Dispatcher.registerCallback('MARK_ROULETTE_LOADED', function() {
  self.state.roulette_loaded = true;
  self.emitter.emit('change_game_tab', self.state);
});
Dispatcher.registerCallback('MARK_BITSWEEP_LOADED', function() {
  self.state.bitsweep_loaded = true;
  self.emitter.emit('change_game_tab', self.state);
});
Dispatcher.registerCallback('MARK_SLOTS_LOADED', function() {
  self.state.slots_loaded = true;
  self.emitter.emit('change_game_tab', self.state);
});
Dispatcher.registerCallback('MARK_BITCLIMBER_LOADED', function() {
  self.state.bitclimber_loaded = true;
  self.emitter.emit('change_game_tab', self.state);
});
Dispatcher.registerCallback('MARK_SLIDERS_LOADED', function() {
  self.state.sliders_loaded = true;
  self.emitter.emit('change_game_tab', self.state);
});

Dispatcher.registerCallback('SET_FIRST', function(data) {
  self.state.first_bet = true;
  self.emitter.emit('change', self.state);
});

Dispatcher.registerCallback('CHANGE_TAB', function(tabName) {
  console.assert(typeof tabName === 'string');
  self.state.currTab = tabName;
  if (socket){
    if (tabName == 'ALL_BETS'){
      socket.emit('join_ALL_BETS');
    }else{
      socket.emit('leave_ALL_BETS');
    }
  }
  self.emitter.emit('change_tab', self.state);
});

Dispatcher.registerCallback('CHANGE_GAME_TAB', function(GametabName) {
  console.assert(typeof GametabName === 'string');
  self.state.currGameTab = GametabName;
//  clearAllChips();
  self.state.Stop_Autobet = true;
  self.emitter.emit('change_game_tab', self.state);
});

Dispatcher.registerCallback('CHANGE_COIN_TYPE', function(coin_type) {
  console.assert(typeof coin_type === 'string');


  var convertcoin = function(num, cur_type, chn_type){
    if(cur_type != chn_type){
      switch(cur_type){
        case 'BITS':
          switch(chn_type){
            case 'BTC':
              return  (num * 0.000001).toFixed(8);
              break;
            case 'EUR':
              return (num * self.state.btc_eur * 0.000001).toFixed(8);
              break;
            case 'USD':
              return (num * self.state.btc_usd * 0.000001).toFixed(8);
              break;
          }
        break;
        case 'BTC':
          switch(chn_type){
            case 'BITS':
              return  (num * 1000000).toFixed(2);
              break;
            case 'EUR':
              return (num * self.state.btc_eur).toFixed(8);
              break;
            case 'USD':
              return (num * self.state.btc_usd).toFixed(8);
              break;
          }
        break;
        case 'EUR':
          switch(chn_type){
            case 'BITS':
              return  ((num/self.state.btc_eur) * 1000000).toFixed(2);
              break;
            case 'BTC':
              return (num/self.state.btc_eur).toFixed(8);
              break;
            case 'USD':
              return (num * (self.state.btc_usd/self.state.btc_eur)).toFixed(8);
              break;
          }
        break;
        case 'USD':
          switch(chn_type){
            case 'BITS':
              return  ((num/self.state.btc_usd) * 1000000).toFixed(2);
              break;
            case 'EUR':
              return (num * (self.state.btc_eur/self.state.btc_usd)).toFixed(8);
              break;
            case 'BTC':
              return (num/self.state.btc_usd).toFixed(8);
              break;
          }
        break;
      }
    }else {
      return num;
    }
  };


  var temp = convertcoin(betStore.state.wager.num, self.state.coin_type, coin_type);
  var temp_ash = convertcoin(AutobetStore.state.stophigher.num, self.state.coin_type, coin_type);
  var temp_asl = convertcoin(AutobetStore.state.stoplower.num, self.state.coin_type, coin_type);
  var temp_fw = convertcoin(self.state.filterwager.num, self.state.coin_type, coin_type);
  var temp_fp = convertcoin(self.state.filterprofit.num, self.state.coin_type, coin_type);
  var temp_wd = convertcoin(self.state.refwd.num, self.state.coin_type, coin_type);

  self.state.coin_type = coin_type;

  if ((coin_type == 'USD')||(coin_type == 'EUR')){
    betStore.state.rt_ChipSize = 0.10;
  }else {
    betStore.state.rt_ChipSize = 1;
  }

  Dispatcher.sendAction('UPDATE_WAGER', { str: temp.toString() });


  Dispatcher.sendAction('UPDATE_AUTO_STOPHIGHER', { str: temp_ash.toString(),
                                                  num: temp_ash
                                                  });
  Dispatcher.sendAction('UPDATE_AUTO_STOPLOWER', { str: temp_asl.toString(),
                                                  num: temp_asl
                                                  });
  Dispatcher.sendAction('UPDATE_FILTER_WAGER', { str: temp_fw.toString(),
                                                  num: temp_fw
                                                  });
  Dispatcher.sendAction('UPDATE_FILTER_PROFIT', { str: temp_fp.toString(),
                                                  num: temp_fp
                                                  });
  Dispatcher.sendAction('UPDATE_REF_WD', { str: temp_wd.toString(),
                                                  num: temp_wd
                                                  });


  self.emitter.emit('change', self.state);
  self.emitter.emit('new_all_bet', self.state);
  self.emitter.emit('new_user_bet', self.state);
  self.emitter.emit('app_info_update', self.state);
  self.emitter.emit('biggest_info_update', self.state);
  self.emitter.emit('change_weekly_wager', self.state);
});

Dispatcher.registerCallback('START_REFRESHING_USER', function() {
  self.state.isRefreshingUser = true;
  self.emitter.emit('change', self.state);

  var Payload = {
    app_id: 588,
    access_token: worldStore.state.accessToken
  };
  socket.emit('access_token_data', Payload, function(err, data) {
    if (err) {
      console.log('Error access_token_data:', err);
      Dispatcher.sendAction('STOP_REFRESHING_USER');
      return;
    }
      if(config.debug){console.log('Successfully loaded user from access_token_data:', data);}
    if (data.auth != undefined){
    var user = data.auth.user;
    self.state.user = user;

    self.emitter.emit('change', self.state);
    self.emitter.emit('user_update');
    }
    Dispatcher.sendAction('STOP_REFRESHING_USER');
  });

});

Dispatcher.registerCallback('STOP_REFRESHING_USER', function() {
  self.state.isRefreshingUser = false;
  self.emitter.emit('change', self.state);
});

Dispatcher.registerCallback('GET_BTC_TICKER',function(){
  if(config.debug){console.log('getting btc info');}

  if (socket){
  socket.emit('exch_rates', function(err, data) {
    if (err) {
      console.log('[socket] ticker data error:', err);
      return;
    }
    if(config.debug){console.log('[socket] Successfully retrived ticker data', data);}
    self.state.btc_usd = data.btc_usd;
    self.state.btc_eur = data.btc_eur;
    self.emitter.emit('app_info_update', self.state);
    });
  }

});

Dispatcher.registerCallback('UPDATE_AUTH_ID', function(data) {
//auth_id = localStorage.auth_id;
auth_id = data.auth_id;
access_token = data.token;
expires_in = data.expires_in;
expires_at = new Date(Date.now() + (expires_in * 1000));

self.state.auth_id = auth_id;
self.state.accessToken = access_token;
//self.state.user = data.auth.user;
if(config.debug){console.log('auth_id_set', data);}
localStorage.setItem('auth_id', auth_id);
localStorage.setItem('access_token', access_token);
localStorage.setItem('expires_at', expires_at);
self.emitter.emit('change', self.state);

});

Dispatcher.registerCallback('UPDATE_APP_INFO', function() {

socket.emit('app_info', function(err, data) {
  if (err) {
    console.log('[socket] app_info error:', err);
    return;
  }
  if(config.debug){console.log('[socket] app_info success:', data);}
  self.state.currentAppwager = data.wagered;

  socket.emit('jackpot_data', function(err, data) {
    if (err) {
      console.log('[socket] jackpot_data error:', err);
      return;
    }
    if(config.debug){console.log('[socket] jackpot_data success:', data);}
    if(data != null){
    console.assert(_.isArray(data.lowwins));
    self.state.jackpotlist.lowwins.empty();
    self.state.jackpotlist.lowwins.push.apply(self.state.jackpotlist.lowwins, data.lowwins);
    self.state.jackpotlist.highwins.empty();
    self.state.jackpotlist.highwins.push.apply(self.state.jackpotlist.highwins, data.highwins);
    }
    self.emitter.emit('app_info_update', self.state);
    });

  });

});

Dispatcher.registerCallback('UPDATE_BIGGEST_INFO', function() {
socket.emit('biggestwin_info', function(err, data) {
if (err) {
  console.log('[socket] app_info erro:', err);
  return;
}
console.log('[socket] biggestwin_info success:', data);
self.state.biggestwins.empty();
self.state.biggestlosses.empty();
self.state.biggestwagered.empty();
self.state.biggestprofit.empty();
self.state.biggestjackpots.empty();
self.state.biggestwins.push.apply(self.state.biggestwins, data.biggestwins);
self.state.biggestlosses.push.apply(self.state.biggestlosses, data.biggestlosses);
self.state.biggestwagered.push.apply(self.state.biggestwagered, data.biggestwagered);
self.state.biggestprofit.push.apply(self.state.biggestprofit, data.biggestprofit);
self.state.biggestjackpots.push.apply(self.state.biggestjackpots, data.biggestjackpots);

self.emitter.emit('biggest_info_update', self.state);
});

});


Dispatcher.registerCallback('UPDATE_BANKROLL',function(){
    self.emitter.emit('change', self.state);
    if (socket){
      socket.emit('bankroll_data', function(err, bankroll) {
        if (err) {
          console.log('Error bankroll_data:', err);
          return;
        }
        if(config.debug){console.log('Successfully loaded bankroll_data:', bankroll);}
        self.state.bankrollbalance = bankroll.balance;
        self.state.bankrollwagered = bankroll.wagered;
        self.state.bankrollinvested = bankroll.invested;
        self.emitter.emit('change', self.state);
      });
    }
  });

  Dispatcher.registerCallback('NEW_BET', function(bet) {
    console.assert(typeof bet === 'object');
  //  self.state.bets.shift();
    self.state.bets.push(bet);
    if ((self.state.LiveGraph)||(self.state.ShowChart))
      {
      Dispatcher.sendAction('NEW_CHART_DATAPOINT',bet.profit/100);
      //Dispatcher.sendAction('UPDATE_USERSTATS');
      }
    switch(bet.meta.kind){
      case 'DICE':
        self.state.dicestats.bets++;
        if (bet.profit > 0){
          self.state.dicestats.wins++;
        }else {
          self.state.dicestats.loss++;
        }
        self.state.dicestats.wager += bet.wager;
        self.state.dicestats.profit += bet.profit;
        break;
      case 'PLINKO':
        self.state.plinkostats.bets++;
        if (bet.profit > 0){
          self.state.plinkostats.wins++;
        }else {
          self.state.plinkostats.loss++;
        }
        self.state.plinkostats.wager += bet.wager;
        self.state.plinkostats.profit += bet.profit;
        break;
      case 'ROULETTE':
      self.state.Roulettestats.bets++;
      if (bet.profit > 0){
        self.state.Roulettestats.wins++;
      }else {
        self.state.Roulettestats.loss++;
      }
      self.state.Roulettestats.wager += bet.wager;
      self.state.Roulettestats.profit += bet.profit;
      break;
      case 'BITSWEEP':
        self.state.bitsweepstats.bets++;
        if (bet.profit > 0){
          self.state.bitsweepstats.wins++;
        }else {
          self.state.bitsweepstats.loss++;
        }
        self.state.bitsweepstats.wager += bet.wager;
        self.state.bitsweepstats.profit += bet.profit;
      break;
      case 'SLOTS':
        self.state.slotsstats.bets++;
        if (bet.profit > 0){
          self.state.slotsstats.wins++;
        }else {
          self.state.slotsstats.loss++;
        }
        self.state.slotsstats.wager += bet.wager;
        self.state.slotsstats.profit += bet.profit;
      break;
      case 'BITCLIMBER':
        self.state.BitClimberstats.bets++;
        if (bet.profit > 0){
          self.state.BitClimberstats.wins++;
        }else {
          self.state.BitClimberstats.loss++;
        }
        self.state.BitClimberstats.wager += bet.wager;
        self.state.BitClimberstats.profit += bet.profit;
      break;
      case 'SLIDERS':
      self.state.Slidersstats.bets++;
      if (bet.profit > 0){
        self.state.Slidersstats.wins++;
      }else {
        self.state.Slidersstats.loss++;
      }
      self.state.Slidersstats.wager += bet.wager;
      self.state.Slidersstats.profit += bet.profit;
      default:
        break;
    }
    self.emitter.emit('new_user_bet', self.state);
  });

  Dispatcher.registerCallback('NEW_ALL_BET', function(betarray) {
    var wasnew = false;

    betarray.map(function(bet){
      self.state.currentAppwager += bet.wager;
      self.emitter.emit('app_info_update', self.state);
    if ((helpers.convSatstoCointype(bet.profit) <  worldStore.state.filterprofit.num) && (worldStore.state.filterprofit.num != 0) && (worldStore.state.filterprofit.num != null) && (!worldStore.state.filterprofit.error))
      {
      return;
      }
    else if ((helpers.convSatstoCointype(bet.wager) <  worldStore.state.filterwager.num) && (worldStore.state.filterwager.num != 0) && (worldStore.state.filterwager.num != null) && (!worldStore.state.filterwager.error))
        {
        return;
        }
    else if ((worldStore.state.filteruser.str != 'User')&&(worldStore.state.filteruser.str != ''))
        {
            var filtername = worldStore.state.filteruser.str.toLowerCase();
            var big = bet.uname.substring(0,filtername.length);
            var lowsub = big.toLowerCase();
            if (lowsub != filtername){
                return;
            }else {
              self.state.allBets.push(bet);
              wasnew = true;
            }
        }
    else if((worldStore.state.filtergame != 'ALL GAMES') && (worldStore.state.filtergame != bet.kind)){
      return;
      }
    else{
    //self.state.allBets.shift();
    self.state.allBets.push(bet);
    wasnew = true;
    //self.emitter.emit('new_all_bet', self.state);
    }
  });

  if (wasnew){
    self.emitter.emit('new_all_bet', self.state);
  }

});

Dispatcher.registerCallback('INIT_ALL_BETS', function(bets) {
  console.assert(_.isArray(bets));

  delete self.state.allBets;
  self.state.allBets = new CBuffer(config.bet_buffer_size);

  self.state.allBets.push.apply(self.state.allBets, bets);
  self.emitter.emit('change', self.state);
  self.emitter.emit('new_all_bet', self.state);
});

Dispatcher.registerCallback('INIT_USER_BETS', function(newbets) {
  console.assert(_.isArray(newbets));

  delete self.state.bets;
  self.state.bets = new CBuffer(config.bet_buffer_size);

  self.state.bets.push.apply(self.state.bets, newbets);
  self.emitter.emit('change', self.state);
  self.emitter.emit('new_user_bet', self.state);
});

Dispatcher.registerCallback('LOAD_BET_HISTORY', function(bets) {
  console.assert(_.isArray(bets));
  self.state.bethistory.push.apply(self.state.bethistory, bets);
  self.emitter.emit('change', self.state);
});

Dispatcher.registerCallback('GET_WEEKLY_WAGER',function(){

      socket.emit('get_weekly_wager', function(err, data) {
        if (err) {
          console.log('Error get_weekly_wager:', err);
          return;
        }
        if(config.debug){console.log('Successfully got weekly wager:' ,  data);}
      //  var user = data.user;
      //  self.state.user = user;
        self.state.weeklydata = data;
        self.emitter.emit('change_weekly_wager', self.state);
      });
    });
///////
Dispatcher.registerCallback('UPDATE_PLINKO', function() { //worldStore.state.chartbusy
self.emitter.emit('plinko_game_change', self.state);
});

Dispatcher.registerCallback('TOGGLE_PAYOUT_EDITOR', function() {
self.state.showPayoutEditor = !self.state.showPayoutEditor;
self.emitter.emit('plinko_payout_change', self.state);
self.emitter.emit('plinko_game_change', self.state);
self.emitter.emit('change', self.state);

if (self.state.showPayoutEditor){
  setTimeout(function(){
    location.href = "#";
    location.href = "#p_editor";
  },250);
}
});
// data.color: 'red' | 'green' | ...
// data.path: Array of 'L' and 'R'
// data.wager_satoshis: Int
// data.profit_satoshis: Int (satoshis)
// data.isTest: Bool - for 0 wager pucks that shouldn't hit the Moneypot
//   server. Intended to let unloggedin users play with the site.
// data.isFair: Bool
Dispatcher.registerCallback('SPAWN_PUCK', function(data) {

var path = data.path || generatePath();
var puck = new Puck({
  path: path,
  color: data.color,
  wager_satoshis: data.wager_satoshis,
  profit_satoshis: data.profit_satoshis,
  isTest: data.isTest,
  bet: data.bet,
  isFair: data.isFair,
  // When puck hits a peg
  onPeg: function(puck) {
  },
  // As soon as puck lands in a slot
  onSlot: function(puck) {

    delete worldStore.state.activePucks[puck.id];
    // ignore test pucks
    if (puck.isTest) {
      return;
    }
    Dispatcher.sendAction('UPDATE_REVEALED_BALANCE', data.profit_satoshis);
    // And also force wager validation now that balance is updated
    Dispatcher.sendAction('UPDATE_WAGER', {
      str: betStore.state.wager.str
    });
    Dispatcher.sendAction('NEW_BET', puck.bet);
  //  Dispatcher.sendAction('NEW_ALL_BET', puck.bet);
  },
  // When puck is finished animating and must be removed from board
  onComplete: function(puck) {
    delete worldStore.state.renderedPucks[puck.id];
    if (!worldStore.state.first_bet)
      {Dispatcher.sendAction('SET_FIRST');}
    self.emitter.emit('plinko_render_change', self.state);
    self.emitter.emit('change', self.state);
  }
});

// Don't add testpucks to history
if (!puck.isTest) {
  worldStore.state.pucks.push(puck);
}

worldStore.state.activePucks[puck.id] = puck;

worldStore.state.renderedPucks[puck.id] = puck;
self.emitter.emit('plinko_render_change', self.state);

puck.run();
self.emitter.emit('change', self.state);
});

Dispatcher.registerCallback('SET_REVEALED_BALANCE', function() {
var stillAnimatingPucks = _.keys(worldStore.state.renderedPucks).length > 0;
if (stillAnimatingPucks)
  {
  self.state.revealed_balance = self.state.revealed_balance;
}else{
  self.state.revealed_balance = self.state.user.balance;
}
});

Dispatcher.registerCallback('UPDATE_REVEALED_BALANCE', function(profit) {
  self.state.revealed_balance = self.state.revealed_balance + profit;
});

});//end worldStore

///Autobet code/////////////////////////////////////////////////////////////////
var AutobetStore = new Store('autobet', {
  ShowAutobet: false,  //FOR HIDING forms
  Run_Autobet: false,  //Enables Auto Wagering
  Stop_Autobet: false, //Flag to stop Before hititng wager
  AutobetBase: 0.00,
  Auto_cond:'<',
  stoplower: {
    str: ' ',
    num: 0,
    error:null
  },
  stophigher: {
    str: ' ',
    num: 0,
    error:null
  },
  autodelay: {
    str: '1',
    num: 1,
    error:null
  },
  dice_delay:undefined,
  P_rowsel: 1,
  lossmul:{
    str: '2.0000',
    num: 2.0000,
    error:null
  },
  losstarget:{
    str: '1',
    num: 1,
    error:null
  },
  lossmode: 'DO NOTHING',
  losscounter: 0,
  ///
  winmul:{
    str: '2.0000',
    num: 2.0000,
    error:null
  },
  wintarget:{
    str: '1',
    num: 1,
    error:null
  },
  winmode: 'RESET TO BASE',
  wincounter: 0,
  ///
  switch1: {
    str: '1',
    num: 1,
    wincount:0,
    losscount:0,
    betcount:0,
    cont_loss:0,
    cont_win:0,
    type:'WINS',
    mode:'CHANGE TARGET',
    enable:false,
    error: undefined
  },
  switch2: {
    str: '1',
    num: 1,
    wincount:0,
    losscount:0,
    betcount:0,
    cont_loss:0,
    cont_win:0,
    type:'LOSS',
    mode:'STOP AUTO',
    enable:false,
    error: undefined
  },
  switch3: {
    str: '1',
    num: 1,
    wincount:0,
    losscount:0,
    betcount:0,
    cont_loss:0,
    cont_win:0,
    type:'BETS',
    mode:'STOP AUTO',
    enable:false,
    error: undefined
  },
  Auto_betcount: 0,
  Auto_wincount: 0,
  Auto_losscount: 0,
  Auto_wagered: 0,
  Auto_profit: 0,
  /////////////////////

}, function() {
  var self = this;

  Dispatcher.registerCallback('CHANGE_P_ROW', function(row) {
    self.state.P_rowsel = row;
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('TOGGLE_SHOW_AUTO', function() {
    self.state.ShowAutobet = !self.state.ShowAutobet;
    self.emitter.emit('change', self.state);
    self.emitter.emit('chat_size',self.state);
  });

  Dispatcher.registerCallback('TOGGLE_AUTO_COND', function() {
    self.state.Auto_cond = self.state.Auto_cond === '<' ? '>':'<';
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('UPDATE_AUTO_STOPHIGHER', function(newstop) {
    self.state.stophigher = _.merge({}, self.state.stophigher, newstop);
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('UPDATE_AUTO_STOPLOWER', function(newstop) {
    self.state.stoplower = _.merge({}, self.state.stoplower, newstop);
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('UPDATE_AUTOBET_DELAY', function(newsize){
    self.state.autodelay.num = newsize;
    self.state.autodelay.str = newsize.toString();
    self.emitter.emit('change', self.state);
  });


  Dispatcher.registerCallback('SET_LOSS_MODE', function(mode) {
    self.state.lossmode = mode;
    self.emitter.emit('loss_change', self.state);
  });

  Dispatcher.registerCallback('SET_WIN_MODE', function(mode) {
    self.state.winmode = mode;
    self.emitter.emit('win_change', self.state);
  });

  Dispatcher.registerCallback('UPDATE_AUTO_MULTIPLIER_ONLOSS', function(newMult) {
    self.state.lossmul = _.merge({}, self.state.lossmul, newMult);
    self.emitter.emit('loss_change', self.state);
  });

  Dispatcher.registerCallback('UPDATE_AUTO_MULTIPLIER_ONWIN', function(newMult) {
    self.state.winmul = _.merge({}, self.state.winmul, newMult);
    self.emitter.emit('win_change', self.state);
  });

  Dispatcher.registerCallback('UPDATE_LOSS_TARGET', function(newsize){
    self.state.losstarget.num = newsize;
    self.state.losstarget.str = newsize.toString();
    self.emitter.emit('loss_change', self.state);
  });

  Dispatcher.registerCallback('UPDATE_WIN_TARGET', function(newsize){
    self.state.wintarget.num = newsize;
    self.state.wintarget.str = newsize.toString();
    self.emitter.emit('win_change', self.state);
  });

  Dispatcher.registerCallback('TOGGLE_DSWITCH1_ENABLE', function(){
    self.state.switch1.enable = !self.state.switch1.enable;
    self.state.switch1.betcount = 0;
    self.state.switch1.losscount = 0;
    self.state.switch1.wincount = 0;
    self.state.switch1.cont_loss = 0;
    self.state.switch1.cont_win = 0;
    self.emitter.emit('switch_change',self.state);
  });

  Dispatcher.registerCallback('TOGGLE_DSWITCH2_ENABLE', function(){
    self.state.switch2.enable = !self.state.switch2.enable;
    self.state.switch2.betcount = 0;
    self.state.switch2.losscount = 0;
    self.state.switch2.wincount = 0;
    self.state.switch2.cont_loss = 0;
    self.state.switch2.cont_win = 0;
    self.emitter.emit('switch_change',self.state);
  });

  Dispatcher.registerCallback('TOGGLE_DSWITCH3_ENABLE', function(){
    self.state.switch3.enable = !self.state.switch3.enable;
    self.state.switch3.betcount = 0;
    self.state.switch3.losscount = 0;
    self.state.switch3.wincount = 0;
    self.state.switch3.cont_loss = 0;
    self.state.switch3.cont_win = 0;
    self.emitter.emit('switch_change',self.state);
  });

  Dispatcher.registerCallback('SET_D_SW1_MODE', function(mode){
    self.state.switch1.mode = mode;
    self.state.switch1.betcount = 0;
    self.state.switch1.losscount = 0;
    self.state.switch1.wincount = 0;
    self.state.switch1.cont_loss = 0;
    self.state.switch1.cont_win = 0;
    self.emitter.emit('switch_change',self.state);
  });

  Dispatcher.registerCallback('SET_DSWITCH1_TYPE', function(type){
    self.state.switch1.type = type;
    self.state.switch1.betcount = 0;
    self.state.switch1.losscount = 0;
    self.state.switch1.wincount = 0;
    self.state.switch1.cont_loss = 0;
    self.state.switch1.cont_win = 0;
    self.emitter.emit('switch_change',self.state);
  });

  Dispatcher.registerCallback('SET_D_SW2_MODE', function(mode){
    self.state.switch2.mode = mode;
    self.state.switch2.betcount = 0;
    self.state.switch2.losscount = 0;
    self.state.switch2.wincount = 0;
    self.state.switch2.cont_loss = 0;
    self.state.switch2.cont_win = 0;
    self.emitter.emit('switch_change',self.state);
  });

  Dispatcher.registerCallback('SET_DSWITCH2_TYPE', function(type){
    self.state.switch2.type = type;
    self.state.switch2.betcount = 0;
    self.state.switch2.losscount = 0;
    self.state.switch2.wincount = 0;
    self.state.switch2.cont_loss = 0;
    self.state.switch2.cont_win = 0;
    self.emitter.emit('switch_change',self.state);
  });

  Dispatcher.registerCallback('SET_D_SW3_MODE', function(mode){
    self.state.switch3.mode = mode;
    self.state.switch3.betcount = 0;
    self.state.switch3.losscount = 0;
    self.state.switch3.wincount = 0;
    self.state.switch3.cont_loss = 0;
    self.state.switch3.cont_win = 0;
    self.emitter.emit('switch_change',self.state);
  });

  Dispatcher.registerCallback('SET_DSWITCH3_TYPE', function(type){
    self.state.switch3.type = type;
    self.state.switch3.betcount = 0;
    self.state.switch3.losscount = 0;
    self.state.switch3.wincount = 0;
    self.state.switch3.cont_loss = 0;
    self.state.switch3.cont_win = 0;
    self.emitter.emit('switch_change',self.state);
  });

  Dispatcher.registerCallback('UPDATE_SWITCH1_TARGET', function(newsize){
    self.state.switch1.num = newsize;
    self.state.switch1.str = newsize.toString();
    self.state.switch1.betcount = 0;
    self.state.switch1.losscount = 0;
    self.state.switch1.wincount = 0;
    self.state.switch1.cont_loss = 0;
    self.state.switch1.cont_win = 0;
    self.emitter.emit('switch_change', self.state);
  });

  Dispatcher.registerCallback('UPDATE_SWITCH2_TARGET', function(newsize){
    self.state.switch2.num = newsize;
    self.state.switch2.str = newsize.toString();
    self.state.switch2.betcount = 0;
    self.state.switch2.losscount = 0;
    self.state.switch2.wincount = 0;
    self.state.switch2.cont_loss = 0;
    self.state.switch2.cont_win = 0;
    self.emitter.emit('switch_change', self.state);
  });

  Dispatcher.registerCallback('UPDATE_SWITCH3_TARGET', function(newsize){
    self.state.switch3.num = newsize;
    self.state.switch3.str = newsize.toString();
    self.state.switch3.betcount = 0;
    self.state.switch3.losscount = 0;
    self.state.switch3.wincount = 0;
    self.state.switch3.cont_loss = 0;
    self.state.switch3.cont_win = 0;
    self.emitter.emit('switch_change', self.state);
  });


  Dispatcher.registerCallback('START_RUN_AUTO', function(){
    console.log('start auto bet');
    self.state.AutobetBase = betStore.state.wager.num;

    self.state.losscounter = 0;
    self.state.wincounter = 0;

    self.state.switch1.wincount = 0;
    self.state.switch1.losscount = 0;
    self.state.switch1.betcount = 0;
    self.state.switch1.cont_loss = 0;
    self.state.switch1.cont_win = 0;

    self.state.switch2.wincount = 0;
    self.state.switch2.losscount = 0;
    self.state.switch2.betcount = 0;
    self.state.switch2.cont_loss = 0;
    self.state.switch2.cont_win = 0;

    self.state.switch3.wincount = 0;
    self.state.switch3.losscount = 0;
    self.state.switch3.betcount = 0;
    self.state.switch3.cont_loss = 0;
    self.state.switch3.cont_win = 0;

    self.state.Auto_betcount = 0;
    self.state.Auto_wincount = 0;
    self.state.Auto_losscount = 0;
    self.state.Auto_wagered = 0;
    self.state.Auto_profit = 0;

    self.state.Run_Autobet = true;
    self.state.Stop_Autobet = false;
    if (worldStore.state.currGameTab == 'ROULETTE'){
      GetBaseWager();
    }
    self.emitter.emit('change', self.state);

  Dispatcher.sendAction('PLACE_AUTO_BET');

  });

  Dispatcher.registerCallback('STOP_RUN_AUTO', function(){
    console.log('Stop Dice Auto Bet');
    self.state.Run_Autobet = false;
    self.state.Stop_Autobet = true;
    clearTimeout(self.state.dice_delay);
    Dispatcher.sendAction('RETURN_AUTO_BASE');
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('RETURN_AUTO_BASE', function() {
    if (worldStore.state.currGameTab == 'ROULETTE'){
      ResetBaseWager();
    }else{
    var n = self.state.AutobetBase;
    Dispatcher.sendAction('UPDATE_WAGER', { str: n.toString() });
    }
    self.emitter.emit('change', self.state);
  });

  function dice_bet(){
    var balance = helpers.convSatstoCointype(worldStore.state.user.balance);

    if (self.state.Stop_Autobet){
        console.log('Stop Auto Bet Stop_Autobet set');
         Dispatcher.sendAction('STOP_RUN_AUTO');
       }
    else if (balance >= betStore.state.wager.num){
        switch(worldStore.state.currGameTab){
          case 'DICE':
            if (self.state.Auto_cond === '>'){
              $('#bet-hi')[0].click();
            }else {
              $('#bet-lo')[0].click();
            }
          break;
          case 'PLINKO':
            switch(self.state.P_rowsel){
              case 1:  // Bet ROW1
                $('#bet-ROW1').click();
                break;
              case 2:  // Bet ROW2
                $('#bet-ROW2').click();
                break;
              case 3:  // Bet ROW3
                $('#bet-ROW3').click();
                break;
              case 4:  // Bet ROW4
                $('#bet-ROW4').click();
                break;
              case 5:  // Bet ROW5
                $('#bet-ROW5').click();
                break;
              default:
                self.state.P_rowsel = 1;
                $('#bet-ROW1').click();
                break;
            }
          break;
          case 'ROULETTE':
            $('#RT-SPIN').click();
          break;
          case 'SLOTS':
            $('#SL-START').click();
          break;
          case 'BITCLIMBER':
            $('#BC-START').click();
          break;
          case 'SLIDERS':
            $('#sld-bet').click();
          break;

        }
    }else {
      console.log('Balance too Low to Cointinue');
       Dispatcher.sendAction('STOP_RUN_AUTO');
    }
  };

  Dispatcher.registerCallback('PLACE_AUTO_BET', function() {
    if (self.state.Stop_Autobet){
      console.log('Stop Auto Bet Stop_Autobet set');
      Dispatcher.sendAction('STOP_RUN_AUTO');
    }else if (self.state.Run_Autobet){
      self.state.dice_delay = setTimeout(dice_bet, self.state.autodelay.num);
    }else{
      console.log('Stop auto bet Stop_Autobet not set, Run_Autobet not set ERROR IN MODE');
      Dispatcher.sendAction('STOP_RUN_AUTO');
    }
  self.emitter.emit('change', self.state);
  });

  function switch_red(){
    console.log('Switch red');

    var Red_BetSize = 0;
    var Red_Wager = document.getElementsByClassName('R_CHIP');
    for (var x = 0; x < Red_Wager.length; x++){
      if (Red_Wager[0].children.length > 0){
        Red_BetSize = parseInt(Red_Wager[0].children[0].innerHTML);
        var numbers = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];
        removeChipSpecial(Red_Wager[0], numbers, 2, Red_BetSize);
      }
    }

    var Black_BetSize = 0;
    var Black_Wager = document.getElementsByClassName('B_CHIP');
    for (var x = 0; x < Black_Wager.length; x++){
      if (Black_Wager[0].children.length > 0){
        Black_BetSize = parseInt(Black_Wager[0].children[0].innerHTML);
        var numbers = [2,4,6,8,10,11,13,15,17,20,22,24,26,28,29,31,33,35];
        removeChipSpecial(Black_Wager[0], numbers, 2, Black_BetSize);
      }
    }

    if (Black_BetSize > 0){
      Red_Wager = document.getElementsByClassName('R_CHIP');
      for (var x = 0; x < Red_Wager.length; x++){
          var numbers = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];
          addChipSpecial(Red_Wager[0],"halfChip", numbers, 2, Black_BetSize);
      }
    }

    if (Red_BetSize > 0){
      Black_Wager = document.getElementsByClassName('B_CHIP');
      for (var x = 0; x < Black_Wager.length; x++){
          var numbers = [2,4,6,8,10,11,13,15,17,20,22,24,26,28,29,31,33,35];
          addChipSpecial(Black_Wager[0],"halfChip", numbers, 2, Red_BetSize);
      }
    }

  }

  function switch_odd(){
    console.log('Switch odd');
    var odd_BetSize = 0;
    var odd_Wager = document.getElementsByClassName('O_CHIP');
    for (var x = 0; x < odd_Wager.length; x++){
      if (odd_Wager[0].children.length > 0){
        odd_BetSize = parseInt(odd_Wager[0].children[0].innerHTML);
        var numbers = [1,3,5,7,9,11,13,15,17,19,21,23,25,27,29,31,33,35];
        removeChipSpecial(odd_Wager[0], numbers, 2, odd_BetSize);
      }
    }

    var even_BetSize = 0;
    var even_Wager = document.getElementsByClassName('E_CHIP');
    for (var x = 0; x < even_Wager.length; x++){
      if (even_Wager[0].children.length > 0){
        even_BetSize = parseInt(even_Wager[0].children[0].innerHTML);
        var numbers = [2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36];
        removeChipSpecial(even_Wager[0], numbers, 2, even_BetSize);
      }
    }

    if (even_BetSize > 0){
      odd_Wager = document.getElementsByClassName('O_CHIP');
      for (var x = 0; x < odd_Wager.length; x++){
          var numbers = [1,3,5,7,9,11,13,15,17,19,21,23,25,27,29,31,33,35];
          addChipSpecial(odd_Wager[0],"halfChip", numbers, 2, even_BetSize);
      }
    }

    if (odd_BetSize > 0){
      even_Wager = document.getElementsByClassName('E_CHIP');
      for (var x = 0; x < even_Wager.length; x++){
          var numbers = [2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36];
          addChipSpecial(even_Wager[0],"halfChip", numbers, 2, odd_BetSize);
      }
    }
  }

  function switch_S18(){
    console.log('Switch S18');
    var S18_BetSize = 0;
    var S18_Wager = document.getElementsByClassName('S18_CHIP');
    for (var x = 0; x < S18_Wager.length; x++){
      if (S18_Wager[0].children.length > 0){
        S18_BetSize = parseInt(S18_Wager[0].children[0].innerHTML);
        var numbers = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18];
        removeChipSpecial(S18_Wager[0], numbers, 2, S18_BetSize);
      }
    }

    var S36_BetSize = 0;
    var S36_Wager = document.getElementsByClassName('S36_CHIP');
    for (var x = 0; x < S36_Wager.length; x++){
      if (S36_Wager[0].children.length > 0){
        S36_BetSize = parseInt(S36_Wager[0].children[0].innerHTML);
        var numbers = [19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36];
        removeChipSpecial(S36_Wager[0], numbers, 2, S36_BetSize);
      }
    }

    if (S36_BetSize > 0){
      S18_Wager = document.getElementsByClassName('S18_CHIP');
      for (var x = 0; x < S18_Wager.length; x++){
          var numbers = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18];
          addChipSpecial(S18_Wager[0],"halfChip", numbers, 2, S36_BetSize);
      }
    }

    if (S18_BetSize > 0){
      S36_Wager = document.getElementsByClassName('S36_CHIP');
      for (var x = 0; x < S36_Wager.length; x++){
          var numbers = [19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36];
          addChipSpecial(S36_Wager[0],"halfChip", numbers, 2, S18_BetSize);
      }
    }
  }

  function switch_D12(){
    console.log('Switch D12');

    var D12_BetSize = 0;
    var D12_Wager = document.getElementsByClassName('D12_CHIP');
    for (var x = 0; x < D12_Wager.length; x++){
      if (D12_Wager[0].children.length > 0){
        D12_BetSize = parseInt(D12_Wager[0].children[0].innerHTML);
        var numbers = [1,2,3,4,5,6,7,8,9,10,11,12];
        removeChipSpecial(D12_Wager[0], numbers, 3, D12_BetSize);
      }
    }

    var D24_BetSize = 0;
    var D24_Wager = document.getElementsByClassName('D24_CHIP');
    for (var x = 0; x < D24_Wager.length; x++){
      if (D24_Wager[0].children.length > 0){
        D24_BetSize = parseInt(D24_Wager[0].children[0].innerHTML);
        var numbers = [13,14,15,16,17,18,19,20,21,22,23,24];
        removeChipSpecial(D24_Wager[0], numbers, 3, D24_BetSize);
      }
    }

    var D36_BetSize = 0;
    var D36_Wager = document.getElementsByClassName('D36_CHIP');
    for (var x = 0; x < D36_Wager.length; x++){
      if (D36_Wager[0].children.length > 0){
        D36_BetSize = parseInt(D36_Wager[0].children[0].innerHTML);
        var numbers = [25,26,27,28,29,30,31,32,33,34,35,36];
        removeChipSpecial(D36_Wager[0], numbers, 3, D36_BetSize);
      }
    }
  ////////////////////
  if (D36_BetSize > 0){
    D12_Wager = document.getElementsByClassName('D12_CHIP');
    for (var x = 0; x < D12_Wager.length; x++){
        var numbers = [1,2,3,4,5,6,7,8,9,10,11,12];
        addChipSpecial(D12_Wager[0],"dozenChip", numbers, 3, D36_BetSize);
    }
  }

  if (D24_BetSize > 0){
    D36_Wager = document.getElementsByClassName('D36_CHIP');
    for (var x = 0; x < D36_Wager.length; x++){
        var numbers = [25,26,27,28,29,30,31,32,33,34,35,36];
        addChipSpecial(D36_Wager[0],"dozenChip", numbers, 3, D24_BetSize);
    }
  }

  if (D12_BetSize > 0){
    D24_Wager = document.getElementsByClassName('D24_CHIP');
    for (var x = 0; x < D24_Wager.length; x++){
        var numbers = [13,14,15,16,17,18,19,20,21,22,23,24];
        addChipSpecial(D24_Wager[0],"dozenChip", numbers, 3, D12_BetSize);
    }
  }

  }

  function switch_row(){
    console.log('Switch row');

    var R1_BetSize = 0;
    var R1_Wager = document.getElementsByClassName('R1_CHIP');
    for (var x = 0; x < R1_Wager.length; x++){
      if (R1_Wager[0].children.length > 0){
        R1_BetSize = parseInt(R1_Wager[0].children[0].innerHTML);
        var numbers = [3,6,9,12,15,18,21,24,27,30,33,36];
        removeChipSpecial(R1_Wager[0], numbers, 3, R1_BetSize);
      }
    }

    var R2_BetSize = 0;
    var R2_Wager = document.getElementsByClassName('R2_CHIP');
    for (var x = 0; x < R2_Wager.length; x++){
      if (R2_Wager[0].children.length > 0){
        R2_BetSize = parseInt(R2_Wager[0].children[0].innerHTML);
        var numbers = [2,5,8,11,14,17,20,23,26,29,32,35];
        removeChipSpecial(R2_Wager[0], numbers, 3, R2_BetSize);
      }
    }

    var R3_BetSize = 0;
    var R3_Wager = document.getElementsByClassName('R3_CHIP');
    for (var x = 0; x < R3_Wager.length; x++){
      if (R3_Wager[0].children.length > 0){
        R3_BetSize = parseInt(R3_Wager[0].children[0].innerHTML);
        var numbers = [1,4,7,10,13,16,19,22,25,28,31,34];
        removeChipSpecial(R3_Wager[0], numbers, 3, R3_BetSize);
      }
    }
  ////////////////////
  if (R1_BetSize > 0){
    R2_Wager = document.getElementsByClassName('R2_CHIP');
    for (var x = 0; x < R2_Wager.length; x++){
        var numbers = [2,5,8,11,14,17,20,23,26,29,32,35];
        addChipSpecial(R2_Wager[0],"dozenChip", numbers, 3, R1_BetSize);
    }
  }

  if (R2_BetSize > 0){
    R3_Wager = document.getElementsByClassName('R3_CHIP');
    for (var x = 0; x < R3_Wager.length; x++){
        var numbers = [1,4,7,10,13,16,19,22,25,28,31,34];
        addChipSpecial(R3_Wager[0],"dozenChip", numbers, 3, R2_BetSize);
    }
  }

  if (R3_BetSize > 0){
    R1_Wager = document.getElementsByClassName('R1_CHIP');
    for (var x = 0; x < R1_Wager.length; x++){
        var numbers = [3,6,9,12,15,18,21,24,27,30,33,36];
        addChipSpecial(R1_Wager[0],"dozenChip", numbers, 3, R3_BetSize);
    }
  }


  }

  function switch1function(bet){
    console.log('Switch 1 function');
    var execute = false;

    self.state.switch1.betcount++;

    if (bet.profit < 0){
    self.state.switch1.losscount++;
    self.state.switch1.cont_loss++;
    self.state.switch1.cont_win = 0;
    }else {
    self.state.switch1.wincount++;
    self.state.switch1.cont_loss = 0;
    self.state.switch1.cont_win++;
    }

    switch(self.state.switch1.type){
      case 'WINS':
          if (self.state.switch1.wincount >= self.state.switch1.num){
            execute = true;
            self.state.switch1.betcount = 0;
            self.state.switch1.losscount = 0;
            self.state.switch1.wincount = 0;
          }
        break;
      case 'LOSS':
          if (self.state.switch1.losscount >= self.state.switch1.num){
            execute = true;
            self.state.switch1.betcount = 0;
            self.state.switch1.losscount = 0;
            self.state.switch1.wincount = 0;
          }
        break;
      case 'BETS':
          if (self.state.switch1.betcount >= self.state.switch1.num){
            execute = true;
            self.state.switch1.betcount = 0;
            self.state.switch1.losscount = 0;
            self.state.switch1.wincount = 0;
          }
        break;
      case 'C.LOSS':
        if (self.state.switch1.cont_loss >= self.state.switch1.num){
          execute = true;
          self.state.switch1.betcount = 0;
          self.state.switch1.losscount = 0;
          self.state.switch1.wincount = 0;
          self.state.switch1.cont_loss = 0;
          self.state.switch1.cont_win = 0;
        }
        break;
      case 'C.WINS':
        if (self.state.switch1.cont_win >= self.state.switch1.num){
          execute = true;
          self.state.switch1.betcount = 0;
          self.state.switch1.losscount = 0;
          self.state.switch1.wincount = 0;
          self.state.switch1.cont_loss = 0;
          self.state.switch1.cont_win = 0;
        }
        break;
    }

  /////////////////////////
    if (execute){
      switch (self.state.switch1.mode){
        case 'TABLE +':
           Dispatcher.sendAction('TOGGLE_SLOTS_TABLE');
           break;
        case 'TABLE -':
           Dispatcher.sendAction('TOGGLE_SLOTS_TABLE_DN');
           break;
        case 'RED/BLACK':
          switch_red();
          break;
        case 'ODD/EVEN':
          switch_odd();
          break;
        case '1-18/19-36':
          switch_S18();
          break;
        case '1-12/13-24/25-36':
          switch_D12();
          break;
        case 'ROW':
          switch_row();
          break;
        case 'ROW +':
          self.state.P_rowsel++;
          if(self.state.P_rowsel > 5){
            self.state.P_rowsel =  1;
          }
          break;
        case 'ROW -':
          self.state.P_rowsel--;
          if(self.state.P_rowsel < 1){
            self.state.P_rowsel =  5;
          }
          break;
        case 'STOP AUTO':
          self.state.Stop_Autobet = true;
          break;
        case 'CHANGE TARGET':
          Dispatcher.sendAction('TOGGLE_AUTO_COND');
          Dispatcher.sendAction( 'TOGGLE_BC_TARGET');
            if(worldStore.state.currGameTab == 'SLIDERS'){
              if (betStore.state.activesliders == 1){
              Dispatcher.sendAction('UPDATE_SLIDER_POS',Math.random()*(99.9999));
              }else {
              var positions = [(Math.random()*(99.9999)),(Math.random()*(99.9999))];
              Dispatcher.sendAction('UPDATE_SLIDER_POS',positions);
              }
              $("#ex1").slider('destroy');
              init_slider();
            }
          break;
        case 'RESET TO BASE':
          Dispatcher.sendAction('RETURN_AUTO_BASE');
          break;
        default:

          break;
        }
    }
    //////////////////

  }


  function switch2function(bet){
    console.log('Switch 2 function');
    var execute = false;

    self.state.switch2.betcount++;

    if (bet.profit < 0){
    self.state.switch2.losscount++;
    self.state.switch2.cont_loss++;
    self.state.switch2.cont_win = 0;
    }else {
    self.state.switch2.wincount++;
    self.state.switch2.cont_loss = 0;
    self.state.switch2.cont_win++;
    }

    switch(self.state.switch2.type){
      case 'WINS':
          if (self.state.switch2.wincount >= self.state.switch2.num){
            execute = true;
            self.state.switch2.betcount = 0;
            self.state.switch2.losscount = 0;
            self.state.switch2.wincount = 0;
          }
        break;
      case 'LOSS':
          if (self.state.switch2.losscount >= self.state.switch2.num){
            execute = true;
            self.state.switch2.betcount = 0;
            self.state.switch2.losscount = 0;
            self.state.switch2.wincount = 0;
          }
        break;
      case 'BETS':
          if (self.state.switch2.betcount >= self.state.switch2.num){
            execute = true;
            self.state.switch2.betcount = 0;
            self.state.switch2.losscount = 0;
            self.state.switch2.wincount = 0;
          }
        break;
      case 'C.LOSS':
        if (self.state.switch2.cont_loss >= self.state.switch2.num){
          execute = true;
          self.state.switch2.betcount = 0;
          self.state.switch2.losscount = 0;
          self.state.switch2.wincount = 0;
          self.state.switch2.cont_loss = 0;
          self.state.switch2.cont_win = 0;
        }
        break;
      case 'C.WINS':
        if (self.state.switch2.cont_win >= self.state.switch2.num){
          execute = true;
          self.state.switch2.betcount = 0;
          self.state.switch2.losscount = 0;
          self.state.switch2.wincount = 0;
          self.state.switch2.cont_loss = 0;
          self.state.switch2.cont_win = 0;
        }
        break;
    }

    if (execute){
      switch (self.state.switch2.mode){
        case 'TABLE +':
           Dispatcher.sendAction('TOGGLE_SLOTS_TABLE');
           break;
        case 'TABLE -':
           Dispatcher.sendAction('TOGGLE_SLOTS_TABLE_DN');
           break;
        case 'RED/BLACK':
          switch_red();
          break;
        case 'ODD/EVEN':
          switch_odd();
          break;
        case '1-18/19-36':
          switch_S18();
          break;
        case '1-12/13-24/25-36':
          switch_D12();
          break;
        case 'ROW':
          switch_row();
          break;
        case 'ROW +':
          self.state.P_rowsel++;
          if(self.state.P_rowsel > 5){
            self.state.P_rowsel =  1;
          }
          break;
        case 'ROW -':
          self.state.P_rowsel--;
          if(self.state.P_rowsel < 1){
            self.state.P_rowsel =  5;
          }
          break;
        case 'STOP AUTO':
          self.state.Stop_Autobet = true;
          break;
        case 'CHANGE TARGET':
          Dispatcher.sendAction('TOGGLE_AUTO_COND');
          Dispatcher.sendAction( 'TOGGLE_BC_TARGET');
          if(worldStore.state.currGameTab == 'SLIDERS'){
            if (betStore.state.activesliders == 1){
            Dispatcher.sendAction('UPDATE_SLIDER_POS',Math.random()*(99.9999));
            }else {
            var positions = [(Math.random()*(99.9999)),(Math.random()*(99.9999))];
            Dispatcher.sendAction('UPDATE_SLIDER_POS',positions);
            }
            $("#ex1").slider('destroy');
            init_slider();
          }
          break;
        case 'RESET TO BASE':
          Dispatcher.sendAction('RETURN_AUTO_BASE');
          break;
        default:

          break;
        }
    }

  }

  function switch3function(bet){
    console.log('Switch 3 function');
    var execute = false;

    self.state.switch3.betcount++;

    if (bet.profit < 0){
    self.state.switch3.losscount++;
    self.state.switch3.cont_loss++;
    self.state.switch3.cont_win = 0;
    }else {
    self.state.switch3.wincount++;
    self.state.switch3.cont_loss = 0;
    self.state.switch3.cont_win++;
    }

    switch(self.state.switch3.type){
      case 'WINS':
          if (self.state.switch3.wincount >= self.state.switch3.num){
            execute = true;
            self.state.switch3.betcount = 0;
            self.state.switch3.losscount = 0;
            self.state.switch3.wincount = 0;
          }
        break;
      case 'LOSS':
          if (self.state.switch3.losscount >= self.state.switch3.num){
            execute = true;
            self.state.switch3.betcount = 0;
            self.state.switch3.losscount = 0;
            self.state.switch3.wincount = 0;
          }
        break;
      case 'BETS':
          if (self.state.switch3.betcount >= self.state.switch3.num){
            execute = true;
            self.state.switch3.betcount = 0;
            self.state.switch3.losscount = 0;
            self.state.switch3.wincount = 0;
          }
        break;
      case 'C.LOSS':
        if (self.state.switch3.cont_loss >= self.state.switch3.num){
          execute = true;
          self.state.switch3.betcount = 0;
          self.state.switch3.losscount = 0;
          self.state.switch3.wincount = 0;
          self.state.switch3.cont_loss = 0;
          self.state.switch3.cont_win = 0;
        }
        break;
      case 'C.WINS':
        if (self.state.switch3.cont_win >= self.state.switch3.num){
          execute = true;
          self.state.switch3.betcount = 0;
          self.state.switch3.losscount = 0;
          self.state.switch3.wincount = 0;
          self.state.switch3.cont_loss = 0;
          self.state.switch3.cont_win = 0;
        }
        break;
    }

    if (execute){
      switch (self.state.switch3.mode){
        case 'TABLE +':
           Dispatcher.sendAction('TOGGLE_SLOTS_TABLE');
           break;
        case 'TABLE -':
           Dispatcher.sendAction('TOGGLE_SLOTS_TABLE_DN');
           break;
        case 'RED/BLACK':
          switch_red();
          break;
        case 'ODD/EVEN':
          switch_odd();
          break;
        case '1-18/19-36':
          switch_S18();
          break;
        case '1-12/13-24/25-36':
          switch_D12();
          break;
        case 'ROW':
          switch_row();
          break;
        case 'ROW +':
          self.state.P_rowsel++;
          if(self.state.P_rowsel > 5){
            self.state.P_rowsel =  1;
          }
          break;
        case 'ROW -':
          self.state.P_rowsel--;
          if(self.state.P_rowsel < 1){
            self.state.P_rowsel =  5;
          }
          break;
        case 'STOP AUTO':
          self.state.Stop_Autobet = true;
          break;
        case 'CHANGE TARGET':
          Dispatcher.sendAction('TOGGLE_AUTO_COND');
          Dispatcher.sendAction( 'TOGGLE_BC_TARGET');
          if(worldStore.state.currGameTab == 'SLIDERS'){
            if (betStore.state.activesliders == 1){
            Dispatcher.sendAction('UPDATE_SLIDER_POS',Math.random()*(99.9999));
            }else {
            var positions = [(Math.random()*(99.9999)),(Math.random()*(99.9999))];
            Dispatcher.sendAction('UPDATE_SLIDER_POS',positions);
            }
            $("#ex1").slider('destroy');
            init_slider();
          }
          break;
        case 'RESET TO BASE':
          Dispatcher.sendAction('RETURN_AUTO_BASE');
          break;
        default:

          break;
        }
    }

  }


  Dispatcher.registerCallback('AUTOBET_ROUTINE', function(bet) {
    self.state.Auto_betcount++;
    self.state.Auto_wagered += bet.wager;
    self.state.Auto_profit += bet.profit;

    var balance = helpers.convSatstoCointype(worldStore.state.user.balance);

    if (bet.profit > 0){//WIN STATE
      self.state.Auto_wincount++;
      self.state.wincounter++;
      if ((balance >= self.state.stophigher.num) && (self.state.stophigher.num != 0)){
          self.state.Stop_Autobet = true;
          console.log('STOP AUTO FROM WIN, BALANCE > STOP HIGHER');
        }
      if (self.state.wincounter >= self.state.wintarget.num){
        switch(self.state.winmode){
          case 'MULTIPLY':
            self.state.wincounter = 0;
            if(worldStore.state.currGameTab == 'ROULETTE'){
              MultiplyAllChips(self.state.R_winmul.num);
            }else{
              var n;
              if (worldStore.state.coin_type === 'BITS'){
                n = (betStore.state.wager.num * self.state.winmul.num).toFixed(2);
              }else {
                n = (betStore.state.wager.num * self.state.winmul.num).toFixed(8);
              }
        //      if (n > balance){
        //        console.log('BALANCE TOO LOW TO COVER NEXT BET Balance: ' + balance + ' Wager: ' + n);
        //        self.state.Stop_Autobet = true;
        //      }else{
                Dispatcher.sendAction('UPDATE_WAGER', { str: n.toString() });
        //      }
            }
            break;
          case 'RESET TO BASE':
            self.state.wincounter = 0;
            Dispatcher.sendAction('RETURN_AUTO_BASE');
            break;
          case 'STOP AUTO':
            self.state.wincounter = 0;
            self.state.Stop_Autobet = true;
            console.log('STOP AUTO FROM WIN');
            break;
          case 'DO NOTHING':
          default:
            break;
        }
      }
      if (self.state.lossmode == 'DO NOTHING'){
        self.state.losscounter = 0;
      }
      self.emitter.emit('win_change', self.state);
    }else{//LOSS STATE
      self.state.Auto_losscount++;
      self.state.losscounter++;
      if((balance <= self.state.stoplower.num) && (self.state.stoplower.num != 0)){
        self.state.Stop_Autobet = true;
        console.log('STOP AUTO FROM BALANCE < STOP LOWER');
      }
      if (self.state.losscounter >= self.state.losstarget.num){
        switch(self.state.lossmode){
          case 'MULTIPLY':
            self.state.losscounter = 0;
            if(worldStore.state.currGameTab == 'ROULETTE'){
              MultiplyAllChips(self.state.R_winmul.num);
            }else{
              var n;
              if (worldStore.state.coin_type === 'BITS'){
                n = (betStore.state.wager.num * self.state.lossmul.num).toFixed(2);
              }else {
                n = (betStore.state.wager.num * self.state.lossmul.num).toFixed(8);
              }
            //  if (n > balance){
            //    console.log('BALANCE TOO LOW TO COVER NEXT BET Balance: ' + balance.toString() + ' Wager: ' + n.toString());
            //    self.state.Stop_Autobet = true;
            //  }else{
                Dispatcher.sendAction('UPDATE_WAGER', { str: n.toString() });
            //  }
            }
            break;
          case 'RESET TO BASE':
            self.state.losscounter = 0;
            Dispatcher.sendAction('RETURN_AUTO_BASE');
            break;
          case 'STOP AUTO':
            self.state.losscounter = 0;
            self.state.Stop_Autobet = true;
            console.log('STOP AUTO FROM LOSS');
            break;
          case 'DO NOTHING':
          default:
            break;
        }
      }
      if (self.state.winmode == 'DO NOTHING'){
        self.state.wincounter = 0;
      }
    self.emitter.emit('loss_change', self.state);
    }


    if (self.state.switch1.enable){
      switch1function(bet);
    }

    if (self.state.switch2.enable){
      switch2function(bet);
    }

    if ((self.state.switch3.enable)&&(worldStore.state.currGameTab != 'DICE')){
      switch3function(bet);
    }

  Dispatcher.sendAction('PLACE_AUTO_BET');
  self.emitter.emit('change', self.state);
  });

});

var UserBox = React.createClass({
  displayName: 'UserBox',
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    worldStore.on('change', this._onStoreChange);
  },
  componentWillUnount: function() {
    worldStore.off('change', this._onStoreChange);
  },
  _onLogout: function() {
    Dispatcher.sendAction('USER_LOGOUT');
  },
  _onRefreshUser: function() {
    Dispatcher.sendAction('START_REFRESHING_USER');
  },
  _openWithdrawPopup: function() {
    var windowUrl = config.mp_browser_uri + '/dialog/withdraw?app_id=' + config.app_id;
    var windowName = 'manage-auth';
    var windowOpts = [
      'width=420',
      'height=550',
      'left=100',
      'top=100'
    ].join(',');
    var windowRef = window.open(windowUrl, windowName, windowOpts);
    windowRef.focus();
    return false;
  },
  _openDepositPopup: function() {
    var windowUrl = config.mp_browser_uri + '/dialog/deposit?app_id=' + config.app_id;
    var windowName = 'manage-auth';
    var windowOpts = [
      'width=420',
      'height=550',
      'left=100',
      'top=100'
    ].join(',');
    var windowRef = window.open(windowUrl, windowName, windowOpts);
    windowRef.focus();
    return false;
  },
  _onClick: function() {
   $('dropdown-toggle').dropdown();
  },
  _onPopover: function() {
  // $('popover-btn').popover();
   $(function () {
     $('[data-toggle="popover"]').popover();
   });

   //console.log('hover POP');
  },
  _onPophide: function() {
   $('popover-btn').popover('hide');
   //console.log('mouseout POP');
  },
  _ActionClick: function(type){
    return function(){
      console.log('click action ' + type);
    };

  },

  render: function() {

    var innerNode;
    var nav_balance;
    var nav_uncbalance;

    var stillAnimatingPucks = _.keys(worldStore.state.renderedPucks).length > 0;

    if (worldStore.state.isLoading) {
      innerNode = el.li(
        {className: 'navbar-text navbar-right'},
        'Loading...'
      );
    } else if (worldStore.state.user) {
      if (stillAnimatingPucks||worldStore.state.rt_spin_running||worldStore.state.plinko_running)
        {
        nav_balance = worldStore.state.revealed_balance;
      }else{
        nav_balance = worldStore.state.user.balance
      }
      innerNode =  //el.ul(
        //{className: 'nav navbar-nav'},
        el.li(
          {className:'dropdown navbar-right'},
          el.a(
              {
                role:'button',
                className:'dropdown-toggle',
                "data-toggle":'dropdown',
                "aria-haspopup":'true',
                "aria-expanded":'false',
                onClick:this._onClick,
                style:{fontWeight:'bold',color:'lightgray'}
              },
              worldStore.state.user.uname + ', ' + 'Bal: '+ helpers.convNumtoStr(nav_balance) + ' '+  worldStore.state.coin_type + ' ',

              !worldStore.state.user.unconfirmed_balance ?
               '' : el.span( {  //type:'button',
                          id:'popover-btn',
                          'data-container':'body',
                          'data-trigger':'hover',
                          'data-toggle':'popover',
                          'data-placement':'bottom',
                          'data-content':  helpers.convNumtoStr(worldStore.state.user.unconfirmed_balance) + ' ' + worldStore.state.coin_type +' pending',
                           onMouseOver:this._onPopover
                        //  onMouseOut:this._onPophide
                          },
                el.span({className: 'glyphicon glyphicon-plus', style: { color: '#e67e22'}})
              ),


              el.span({className: 'glyphicon glyphicon-collapse-down'})
            ),
            el.ul({className:'dropdown-menu'},
              el.li(null, el.a({onClick: this._openDepositPopup},'DEPOSIT ',el.span({className: 'glyphicon glyphicon-save'}))),
              el.li(null, el.a({onClick: this._openWithdrawPopup},'WITHDRAW ',el.span({className: 'glyphicon glyphicon-open'}))),
              el.li(null, el.a(
                 {
                  href: config.mp_browser_uri + '/apps/' + config.app_id,
                  target: '_blank'
                 },
                 'VIEW ON MONEYPOT ', el.span({className: 'glyphicon glyphicon-new-window'})
                 )
              ),
              el.li(null, el.a({onClick: this._onLogout},'LOGOUT ',el.span({className: 'glyphicon glyphicon-log-out'})))
            )
        //)
      )

    } else {
      // User needs to login
      innerNode = el.li({className: 'nav navbar-right'},
          el.a(
            {
              href: config.mp_browser_uri + '/oauth/authorize' +
                '?app_id=' + config.app_id +
                '&redirect_uri=' + config.redirect_uri,
            //  className: 'btn btn-success'
            },
            'Login with Moneypot ',el.span({className: 'glyphicon glyphicon-log-in'})
          )
      //  )
      );
    }

    return innerNode;
  }
});


var Navbar = React.createClass({
  displayName: 'Navbar',
  _onStoreChange: function() {
    //$('collapse').collapse('show');
    this.forceUpdate();
  },
  componentDidMount: function() {
    worldStore.on('change', this._onStoreChange);
    worldStore.on('change_game_tab', this._onStoreChange);
  },
  componentWillUnmount: function() {
    worldStore.off('change', this._onStoreChange);
    worldStore.off('change_game_tab', this._onStoreChange);
  },
  _onClick: function() {
   $('dropdown-toggle').dropdown();
  },
  _ActionClick: function(type){
    return function(){
      if(config.debug){console.log('click action ' + type);}
      Dispatcher.sendAction('CHANGE_GAME_TAB', type);
    };
  },
  _ActionClickCoin: function(type){
    return function(){
      if(config.debug){console.log('click action ' + type);}
      Dispatcher.sendAction('CHANGE_COIN_TYPE', type);
    };
  },
  _gotoJP: function(){

      console.log('CHANGE TO JP TAB');
      Dispatcher.sendAction('CHANGE_TAB', 'JACKPOT');
      setTimeout(function(){
        location.href = "#";
        location.href = "#jp_tab";
      },250);

  },
  render: function() {
    var jackpotsize1;
    var jackpotsize2;
     if (worldStore.state.jackpotlist.lowwins.data[worldStore.state.jackpotlist.lowwins.end] != null){
        jackpotsize1 = (worldStore.state.currentAppwager - worldStore.state.jackpotlist.highwins.data[worldStore.state.jackpotlist.highwins.end].sitewager) * 0.00045;
        jackpotsize2 = (worldStore.state.currentAppwager - worldStore.state.jackpotlist.lowwins.data[worldStore.state.jackpotlist.lowwins.end].sitewager) * 0.00045;
      }else{
        jackpotsize1 = (worldStore.state.currentAppwager - (worldStore.state.currentAppwager - 256929092)) * 0.0009;
        jackpotsize2 = jackpotsize1;
      }
    return el.div(
      {className: 'navbar'},
      el.div(
        {className: 'container-fluid'},

        el.ul(
          {className: 'nav navbar-nav visible-xs-block'},
          el.li(
             {className: 'navbar-left'},
             el.button({ className:'navbar-toggler btn-default',
                      type:'button',
                      'data-toggle':'collapse',
                      'data-target':'#exCollapsingNavbar2',
                      'aria-controls':'exCollapsingNavbar2',
                      'aria-expanded':'false',
                      'aria-label':'Toggle navigation'
                    },
              el.span({className:'glyphicon glyphicon-menu-hamburger'})
            ),
            el.div({className:'collapse', id:'exCollapsingNavbar2'},
            // Links
            el.ul(
             {className: 'nav navbar-nav'},
              el.li(
                {className:'dropdown navbar-left'},
                el.a(
                    {
                      role:'button',
                      className:'dropdown-toggle',
                      "data-toggle":'dropdown',
                      "aria-haspopup":'true',
                      "aria-expanded":'false',
                      onClick:this._onClick,
                      style:{fontWeight:'bold'}
                    },
                    'GAME: '+ worldStore.state.currGameTab + ' ', el.span({className:'caret'},'')
                  ),
                  el.ul({className:'dropdown-menu'},
                    el.li(null, el.a({onClick: this._ActionClick('DICE')},'DICE')),
                    el.li(null, el.a({onClick: this._ActionClick('PLINKO')},'PLINKO')),
                    el.li(null, el.a({onClick: this._ActionClick('ROULETTE')},'ROULETTE')),
                    el.li(null, el.a({onClick: this._ActionClick('BITSWEEP')},'BITSWEEP')),
                    el.li(null, el.a({onClick: this._ActionClick('SLOTS')},'SLOTS')),
                    el.li(null, el.a({onClick: this._ActionClick('BITCLIMBER')},'BITCLIMBER')),
                    el.li(null, el.a({onClick: this._ActionClick('SLIDERS')},'SLIDERS'))
                  )
              ),
              el.li(
                  {className:'dropdown navbar-right'},
                  el.a(
                      {
                        role:'button',
                        className:'dropdown-toggle',
                        "data-toggle":'dropdown',
                        "aria-haspopup":'true',
                        "aria-expanded":'false',
                        onClick:this._onClick,
                        style:{fontWeight:'bold'}
                      },
                      'Coin Type: ' + worldStore.state.coin_type + ' ', el.span({className:'caret'},'')
                    ),
                    el.ul({className:'dropdown-menu'},
                      el.li(null, el.a({onClick: this._ActionClickCoin('BTC')},'BTC')),
                      el.li(null, el.a({onClick: this._ActionClickCoin('BITS')},'BITS')),
                      el.li(null, el.a({onClick: this._ActionClickCoin('EUR')},'EUR')),
                      el.li(null, el.a({onClick: this._ActionClickCoin('USD')},'USD'))
                    )
                )
             )
           )
          ),
          //el.div({className:'collapse navbar-toggleable-xs', id:'exCollapsingNavbar2'},
        /*  el.div({className:'collapse', id:'exCollapsingNavbar2'},
          // Links
          el.ul(
           {className: 'nav navbar-nav'},
            el.li(
              {className:'dropdown navbar-left'},
              el.a(
                  {
                    role:'button',
                    className:'dropdown-toggle',
                    "data-toggle":'dropdown',
                    "aria-haspopup":'true',
                    "aria-expanded":'false',
                    onClick:this._onClick,
                    style:{fontWeight:'bold'}
                  },
                  'GAME: '+ worldStore.state.currGameTab + ' ', el.span({className:'caret'},'')
                ),
                el.ul({className:'dropdown-menu'},
                  el.li(null, el.a({onClick: this._ActionClick('DICE')},'DICE')),
                  el.li(null, el.a({onClick: this._ActionClick('PLINKO')},'PLINKO')),
                  el.li(null, el.a({onClick: this._ActionClick('ROULETTE')},'ROULETTE')),
                  el.li(null, el.a({onClick: this._ActionClick('BITSWEEP')},'BITSWEEP')),
                  el.li(null, el.a({onClick: this._ActionClick('SLOTS')},'SLOTS')),
                  el.li(null, el.a({onClick: this._ActionClick('BITCLIMBER')},'BITCLIMBER')),
                  el.li(null, el.a({onClick: this._ActionClick('SLIDERS')},'SLIDERS'))
                )
            ),
            el.li(
                {className:'dropdown navbar-right'},
                el.a(
                    {
                      role:'button',
                      className:'dropdown-toggle',
                      "data-toggle":'dropdown',
                      "aria-haspopup":'true',
                      "aria-expanded":'false',
                      onClick:this._onClick,
                      style:{fontWeight:'bold'}
                    },
                    'Coin Type: ' + worldStore.state.coin_type + ' ', el.span({className:'caret'},'')
                  ),
                  el.ul({className:'dropdown-menu'},
                    el.li(null, el.a({onClick: this._ActionClickCoin('BTC')},'BTC')),
                    el.li(null, el.a({onClick: this._ActionClickCoin('BITS')},'BITS')),
                    el.li(null, el.a({onClick: this._ActionClickCoin('EUR')},'EUR')),
                    el.li(null, el.a({onClick: this._ActionClickCoin('USD')},'USD'))
                  )
              )
           )
         ),//end hidden div*/
        React.createElement(UserBox, null)
      ),

     el.ul(
       {className: 'nav navbar-nav hidden-xs'},

       el.li(
          {className: 'navbar-left'},
         el.a({className: 'navbar-brand', href:'/'}, 'Welcome to ', el.span({style:{color:'red', fontWeight:'bold'}},config.app_name))
       ),
       el.li(
         {className:'dropdown navbar-left'},
         el.a(
             {
               role:'button',
               className:'dropdown-toggle',
               "data-toggle":'dropdown',
               "aria-haspopup":'true',
               "aria-expanded":'false',
               onClick:this._onClick,
               style:{fontWeight:'bold'}
             },
             'GAME: '+ worldStore.state.currGameTab + ' ', el.span({className:'caret'},'')
           ),
           el.ul({className:'dropdown-menu'},
             el.li(null, el.a({onClick: this._ActionClick('DICE')},'DICE')),
             el.li(null, el.a({onClick: this._ActionClick('PLINKO')},'PLINKO')),
             el.li(null, el.a({onClick: this._ActionClick('ROULETTE')},'ROULETTE')),
             el.li(null, el.a({onClick: this._ActionClick('BITSWEEP')},'BITSWEEP')),
             el.li(null, el.a({onClick: this._ActionClick('SLOTS')},'SLOTS')),
             el.li(null, el.a({onClick: this._ActionClick('BITCLIMBER')},'BITCLIMBER')),
             el.li(null, el.a({onClick: this._ActionClick('SLIDERS')},'SLIDERS'))
           )
       ),
         el.li(
           {className: 'hidden-sm'},
           el.a({
               role:'button',
               className:'btn btn-block btn-success',
               onClick: this._gotoJP//,
               //disabled:false
               },
            el.div({style:{marginTop:'-11px',fontWeight:'bold'}}, 'Jackpot 1: ' + helpers.commafy(helpers.convSatstoCointype(jackpotsize1).toString()) + ' ' + worldStore.state.coin_type),
            el.div({style:{marginBottom:'-11px',fontWeight:'bold'}}, 'Jackpot 2: ' + helpers.commafy(helpers.convSatstoCointype(jackpotsize2).toString()) + ' ' + worldStore.state.coin_type)
           )
         ),
         React.createElement(UserBox, null),
         el.li(
           {className:'dropdown navbar-right'},
           el.a(
               {
                 role:'button',
                 className:'dropdown-toggle',
                 "data-toggle":'dropdown',
                 "aria-haspopup":'true',
                 "aria-expanded":'false',
                 onClick:this._onClick,
                 style:{fontWeight:'bold'}
               },
               'Coin Type: ' + worldStore.state.coin_type + ' ', el.span({className:'caret'},'')
             ),
             el.ul({className:'dropdown-menu'},
               el.li(null, el.a({onClick: this._ActionClickCoin('BTC')},'BTC')),
               el.li(null, el.a({onClick: this._ActionClickCoin('BITS')},'BITS')),
               el.li(null, el.a({onClick: this._ActionClickCoin('EUR')},'EUR')),
               el.li(null, el.a({onClick: this._ActionClickCoin('USD')},'USD'))
             )
         )
    )
      )
    );
  }
});

var Newsbar = React.createClass({
  displayName: 'Newsbar',
  _onStoreChange: function() {
    this.forceUpdate();
    var self = this;
    setTimeout(function(){
      self.forceUpdate();
    },5000);
  },
  componentDidMount: function() {
    worldStore.on('news_info_update', this._onStoreChange);
    //chatStore.on('new_message', this._onStoreChange);
  },
  componentWillUnmount: function() {
    worldStore.off('news_info_update', this._onStoreChange);
    //chatStore.off('new_message', this._onStoreChange);
  },
   render: function() {
     return el.div(
       null,
       el.div({className:'panel panel-warning'},
        el.div({className:'panel-body'},
        el.div({className:'text-center'},
          el.span({style:{color:'lightgray',fontWeight:'bold'}},
             filteredmessage(worldStore.state.news_info, 10)
            )
          )
        )
       )
     );
   }
 });



 var GameBox = React.createClass({
   displayName: 'GameBox',
   _onStoreChange: function() {
     this.forceUpdate();
   },
   componentDidMount: function() {
     worldStore.on('change_game_tab', this._onStoreChange);
   },
   componentWillUnmount: function() {
     worldStore.off('change_game_tab', this._onStoreChange);
   },
    render: function() {
      var innerNode;

      switch(worldStore.state.currGameTab){
        case 'DICE':
          console.log('Loading Dice');
          innerNode = el.div(null,React.createElement(DiceGameTabContent, null));
          break;
        case 'PLINKO':
          if (worldStore.state.plinko_loaded){
            innerNode = el.div(null,React.createElement(PlinkoGameTabContent, null));
          }else {
            innerNode = el.div({className:'panel panel-primary'},el.span({className:'glyphicon glyphicon-refresh rotate'}));
            console.log('Loading Plinko');
            document.body.appendChild(document.createElement('script')).src="../app/plinko.js";
          }
          break;
        case 'ROULETTE':
          if (worldStore.state.roulette_loaded){
            innerNode = el.div(null,React.createElement(RouletteGameTabContent, null));
            clearAllChips();
            rt_buttongen = setInterval(buttongen, 100);
          }else {
            innerNode = el.div({className:'panel panel-primary'},el.span({className:'glyphicon glyphicon-refresh rotate'}));
            console.log('Loading Roulette');
            document.body.appendChild(document.createElement('script')).src="../app/roulette.js";
          }
          break;
        case 'BITSWEEP':
          if (worldStore.state.bitsweep_loaded){
            innerNode = el.div(null,React.createElement(BitsweepGameTabContent, null));
          }else {
            innerNode = el.div({className:'panel panel-primary'},el.span({className:'glyphicon glyphicon-refresh rotate'}));
            console.log('Loading Bitsweep');
            document.body.appendChild(document.createElement('script')).src="../app/bitsweep.js";
          }
          break;
        case 'SLOTS':
          if (worldStore.state.slots_loaded){
            innerNode = el.div(null,React.createElement(SlotsGameTabContent, null));
          }else {
            innerNode = el.div({className:'panel panel-primary'},el.span({className:'glyphicon glyphicon-refresh rotate'}));
            console.log('Loading Slots');
            document.body.appendChild(document.createElement('script')).src="../app/slots.js";
          }
          break;
        case 'BITCLIMBER':
          if (worldStore.state.bitclimber_loaded){
            innerNode = el.div(null,React.createElement(BitClimberGameTabContent, null));
          }else {
            innerNode = el.div({className:'panel panel-primary'},el.span({className:'glyphicon glyphicon-refresh rotate'}));
            console.log('Loading Bit Climber');
            document.body.appendChild(document.createElement('script')).src="../app/bitclimber.js";
          }
            break;
        case 'SLIDERS':
          if (worldStore.state.sliders_loaded){
            innerNode = el.div(null,React.createElement(SlidersGameTabContent, null));
          }else {
            innerNode = el.div({className:'panel panel-primary'},el.span({className:'glyphicon glyphicon-refresh rotate'}));
            console.log('Loading Sliders');
            document.body.appendChild(document.createElement('script')).src="../app/sliders.js";
          }
            break;
        case 'LOADING':
            innerNode = el.div({className:'panel panel-primary'},el.span({className:'glyphicon glyphicon-refresh rotate'}));
          break;
        default:
          innerNode = el.div(null,React.createElement(ChatBoxInput, null));
          break;
      }

      return el.div(
        null,
        //el.div({className:'panel panel-primary'},
          innerNode
        //)
      );
    }
  });


  var textinput;
  var ChatBoxInput = React.createClass({
    displayName: 'ChatBoxInput',
    Tag:'ChatBoxInput',
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
    _onChange: function(e) {
      this.setState({ text: e.target.value });
    },
    // When input contents are submitted to chat server
    _onSend: function() {
      var self = this;

      switch(chatStore.state.currTab){
        case 'MAIN':
        case 'RUSSIAN_RM':
        case 'FRENCH_RM':
        case 'SPANISH_RM':
        case 'PORTUGUESE_RM':
        case 'DUTCH_RM':
        case 'GERMAN_RM':
        case 'HINDI_RM':
        case 'CHINESE_RM':
        case 'JAPANESE_RM':
        case 'KOREAN_RM':
        case 'FILIPINO_RM':
        case 'INDONESIAN_RM':
          Dispatcher.sendAction('SEND_MESSAGE', this.state.text);
          this.setState({ text: '' });
          break;
        default:
          var loadtext = '/pm ' + chatStore.state.currTab + ' ' + this.state.text;
          console.log('sent on pm');
          Dispatcher.sendAction('SEND_MESSAGE', loadtext);
          this.setState({ text: '' });
          break;
      }


    },
    _onFocus: function() {
      // When users click the chat input, turn off bet hotkeys so they
      // don't accidentally bet
      if (worldStore.state.hotkeysEnabled) {
        Dispatcher.sendAction('DISABLE_HOTKEYS');
      }
    },
    _onKeyPress: function(e) {
      var ENTER = 13;
      if (e.which === ENTER) {
        if (this.state.text.trim().length > 0) {
          this._onSend();
        }
      }
    },
    _onClick: function() {
     $('dropdown-toggle').dropdown();
    },
    _ActionClick: function(type){
      return function(){
        console.log('click action ' + type);
        textinput.setState({ text: textinput.state.text + type });
      //  textinput.state.text += type;
      };
    },
    render: function() {
      textinput = this;
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
            el.div({className:'input-group'},
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
              ),
              el.span({className:'input-group-btn'},el.div(
                {className:'dropup'},
                el.div(
                    {
                      role:'button',
                      className:'dropdown-toggle h6',
                      "data-toggle":'dropdown',
                      'data-container':'body',
                      "aria-haspopup":'true',
                      "aria-expanded":'false',
                      onClick:this._onClick,
                      style:{fontWeight:'bold'}
                    },
                    '\u{1F601}'
                  ),
                  el.ul({className:'dropdown-menu'},
                    el.li(null,
                        el.ul({className:'list-inline'},
                          el.li({style:{fontWeight:'bold'}}, el.div({onClick: this._ActionClick('\u{1F601}')},'\u{1F601}')),
                          el.li({style:{fontWeight:'bold'}}, el.div({onClick: this._ActionClick('\u{1F602}')},'\u{1F602}')),
                          el.li({style:{fontWeight:'bold'}}, el.div({onClick: this._ActionClick('\u{1F603}')},'\u{1F603}')),
                          el.li({style:{fontWeight:'bold'}}, el.div({onClick: this._ActionClick('\u{1F604}')},'\u{1F604}')),
                          el.li({style:{fontWeight:'bold'}}, el.div({onClick: this._ActionClick('\u{1F605}')},'\u{1F605}')),
                          el.li({style:{fontWeight:'bold'}}, el.div({onClick: this._ActionClick('\u{1F606}')},'\u{1F606}'))
                        )
                    ),
                    el.li(null,
                      el.ul({className:'list-inline'},
                        el.li({style:{fontWeight:'bold'}}, el.div({onClick: this._ActionClick('\u{1F607}')},'\u{1F607}')),
                        el.li({style:{fontWeight:'bold'}}, el.div({onClick: this._ActionClick('\u{1F608}')},'\u{1F608}')),
                        el.li({style:{fontWeight:'bold'}}, el.div({onClick: this._ActionClick('\u{1F609}')},'\u{1F609}')),
                        el.li({style:{fontWeight:'bold'}}, el.div({onClick: this._ActionClick('\u{1F60A}')},'\u{1F60A}')),
                        el.li({style:{fontWeight:'bold'}}, el.div({onClick: this._ActionClick('\u{1F60B}')},'\u{1F60B}')),
                        el.li({style:{fontWeight:'bold'}}, el.div({onClick: this._ActionClick('\u{1F60C}')},'\u{1F60C}'))
                      )
                    ),
                    el.li(null,
                      el.ul({className:'list-inline'},
                        el.li({style:{fontWeight:'bold'}}, el.div({onClick: this._ActionClick('\u{1F60D}')},'\u{1F60D}')),
                        el.li({style:{fontWeight:'bold'}}, el.div({onClick: this._ActionClick('\u{1F60E}')},'\u{1F60E}')),
                        el.li({style:{fontWeight:'bold'}}, el.div({onClick: this._ActionClick('\u{1F60F}')},'\u{1F60F}')),
                        el.li({style:{fontWeight:'bold'}}, el.div({onClick: this._ActionClick('\u{1F610}')},'\u{1F610}')),
                        el.li({style:{fontWeight:'bold'}}, el.div({onClick: this._ActionClick('\u{1F611}')},'\u{1F611}')),
                        el.li({style:{fontWeight:'bold'}}, el.div({onClick: this._ActionClick('\u{1F612}')},'\u{1F612}'))
                      )
                    ),
                    el.li(null,
                      el.ul({className:'list-inline'},
                        el.li({style:{fontWeight:'bold'}}, el.div({onClick: this._ActionClick('\u{1F613}')},'\u{1F613}')),
                        el.li({style:{fontWeight:'bold'}}, el.div({onClick: this._ActionClick('\u{1F614}')},'\u{1F614}')),
                        el.li({style:{fontWeight:'bold'}}, el.div({onClick: this._ActionClick('\u{1F615}')},'\u{1F615}')),
                        el.li({style:{fontWeight:'bold'}}, el.div({onClick: this._ActionClick('\u{1F616}')},'\u{1F616}')),
                        el.li({style:{fontWeight:'bold'}}, el.div({onClick: this._ActionClick('\u{1F617}')},'\u{1F617}')),
                        el.li({style:{fontWeight:'bold'}}, el.div({onClick: this._ActionClick('\u{1F618}')},'\u{1F618}'))
                      )
                    ),
                    el.li(null,
                      el.ul({className:'list-inline'},
                        el.li({style:{fontWeight:'bold'}}, el.div({onClick: this._ActionClick('\u{1F619}')},'\u{1F619}')),
                        el.li({style:{fontWeight:'bold'}}, el.div({onClick: this._ActionClick('\u{1F61A}')},'\u{1F61A}')),
                        el.li({style:{fontWeight:'bold'}}, el.div({onClick: this._ActionClick('\u{1F61B}')},'\u{1F61B}')),
                        el.li({style:{fontWeight:'bold'}}, el.div({onClick: this._ActionClick('\u{1F61C}')},'\u{1F61C}')),
                        el.li({style:{fontWeight:'bold'}}, el.div({onClick: this._ActionClick('\u{1F61D}')},'\u{1F61D}')),
                        el.li({style:{fontWeight:'bold'}}, el.div({onClick: this._ActionClick('\u{1F61E}')},'\u{1F61E}'))
                      )
                    ),
                    el.li(null,
                      el.ul({className:'list-inline'},
                        el.li({style:{fontWeight:'bold'}}, el.div({onClick: this._ActionClick('\u{1F61F}')},'\u{1F61F}')),
                        el.li({style:{fontWeight:'bold'}}, el.div({onClick: this._ActionClick('\u{1F620}')},'\u{1F620}')),
                        el.li({style:{fontWeight:'bold'}}, el.div({onClick: this._ActionClick('\u{1F621}')},'\u{1F621}')),
                        el.li({style:{fontWeight:'bold'}}, el.div({onClick: this._ActionClick('\u{1F622}')},'\u{1F622}')),
                        el.li({style:{fontWeight:'bold'}}, el.div({onClick: this._ActionClick('\u{1F623}')},'\u{1F623}')),
                        el.li({style:{fontWeight:'bold'}}, el.div({onClick: this._ActionClick('\u{1F624}')},'\u{1F624}'))
                      )
                    ),
                    el.li(null,
                      el.ul({className:'list-inline'},
                        el.li({style:{fontWeight:'bold'}}, el.div({onClick: this._ActionClick('\u{1F625}')},'\u{1F625}')),
                        el.li({style:{fontWeight:'bold'}}, el.div({onClick: this._ActionClick('\u{1F626}')},'\u{1F626}')),
                        el.li({style:{fontWeight:'bold'}}, el.div({onClick: this._ActionClick('\u{1F627}')},'\u{1F627}')),
                        el.li({style:{fontWeight:'bold'}}, el.div({onClick: this._ActionClick('\u{1F628}')},'\u{1F628}')),
                        el.li({style:{fontWeight:'bold'}}, el.div({onClick: this._ActionClick('\u{1F629}')},'\u{1F629}')),
                        el.li({style:{fontWeight:'bold'}}, el.div({onClick: this._ActionClick('\u{1F62A}')},'\u{1F62A}'))
                      )
                    ),
                    el.li(null,
                      el.ul({className:'list-inline'},
                        el.li({style:{fontWeight:'bold'}}, el.div({onClick: this._ActionClick('\u{1F62B}')},'\u{1F62B}')),
                        el.li({style:{fontWeight:'bold'}}, el.div({onClick: this._ActionClick('\u{1F62C}')},'\u{1F62C}')),
                        el.li({style:{fontWeight:'bold'}}, el.div({onClick: this._ActionClick('\u{1F62D}')},'\u{1F62D}')),
                        el.li({style:{fontWeight:'bold'}}, el.div({onClick: this._ActionClick('\u{1F62E}')},'\u{1F62E}')),
                        el.li({style:{fontWeight:'bold'}}, el.div({onClick: this._ActionClick('\u{1F62F}')},'\u{1F62F}')),
                        el.li({style:{fontWeight:'bold'}}, el.div({onClick: this._ActionClick('\u{1F630}')},'\u{1F630}'))
                      )
                    ),
                    el.li(null,
                      el.ul({className:'list-inline'},
                        el.li({style:{fontWeight:'bold'}}, el.div({onClick: this._ActionClick('\u{1F631}')},'\u{1F631}')),
                        el.li({style:{fontWeight:'bold'}}, el.div({onClick: this._ActionClick('\u{1F631}')},'\u{1F632}')),
                        el.li({style:{fontWeight:'bold'}}, el.div({onClick: this._ActionClick('\u{1F633}')},'\u{1F633}')),
                        el.li({style:{fontWeight:'bold'}}, el.div({onClick: this._ActionClick('\u{1F634}')},'\u{1F634}')),
                        el.li({style:{fontWeight:'bold'}}, el.div({onClick: this._ActionClick('\u{1F635}')},'\u{1F635}')),
                        el.li({style:{fontWeight:'bold'}}, el.div({onClick: this._ActionClick('\u{1F636}')},'\u{1F636}'))
                      )
                    ),
                    el.li(null,
                      el.ul({className:'list-inline'},
                        el.li({style:{fontWeight:'bold'}}, el.div({onClick: this._ActionClick('\u{1F637}')},'\u{1F637}')),
                        el.li({style:{fontWeight:'bold'}}, el.div({onClick: this._ActionClick('\u{1F638}')},'\u{1F638}')),
                        el.li({style:{fontWeight:'bold'}}, el.div({onClick: this._ActionClick('\u{1F639}')},'\u{1F639}')),
                        el.li({style:{fontWeight:'bold'}}, el.div({onClick: this._ActionClick('\u{1F63A}')},'\u{1F63A}')),
                        el.li({style:{fontWeight:'bold'}}, el.div({onClick: this._ActionClick('\u{1F63B}')},'\u{1F63B}')),
                        el.li({style:{fontWeight:'bold'}}, el.div({onClick: this._ActionClick('\u{1F63C}')},'\u{1F63C}'))
                      )
                    ),
                    el.li(null,
                      el.ul({className:'list-inline'},
                        el.li({style:{fontWeight:'bold'}}, el.div({onClick: this._ActionClick('\u{1F63D}')},'\u{1F63D}')),
                        el.li({style:{fontWeight:'bold'}}, el.div({onClick: this._ActionClick('\u{1F63E}')},'\u{1F63E}')),
                        el.li({style:{fontWeight:'bold'}}, el.div({onClick: this._ActionClick('\u{1F63F}')},'\u{1F63F}')),
                        el.li({style:{fontWeight:'bold'}}, el.div({onClick: this._ActionClick('\u{1F640}')},'\u{1F640}')),
                        el.li({style:{fontWeight:'bold'}}, el.div({onClick: this._ActionClick('\u{1F641}')},'\u{1F641}')),
                        el.li({style:{fontWeight:'bold'}}, el.div({onClick: this._ActionClick('\u{1F642}')},'\u{1F642}'))
                      )
                    ),
                    el.li(null,
                      el.ul({className:'list-inline'},
                        el.li({style:{fontWeight:'bold'}}, el.div({onClick: this._ActionClick('\u{1F645}')},'\u{1F645}')),
                        el.li({style:{fontWeight:'bold'}}, el.div({onClick: this._ActionClick('\u{1F646}')},'\u{1F646}')),
                        el.li({style:{fontWeight:'bold'}}, el.div({onClick: this._ActionClick('\u{1F647}')},'\u{1F647}')),
                        el.li({style:{fontWeight:'bold'}}, el.div({onClick: this._ActionClick('\u{1F648}')},'\u{1F648}')),
                        el.li({style:{fontWeight:'bold'}}, el.div({onClick: this._ActionClick('\u{1F649}')},'\u{1F649}')),
                        el.li({style:{fontWeight:'bold'}}, el.div({onClick: this._ActionClick('\u{1F64A}')},'\u{1F64A}'))
                      )
                    ),
                    el.li(null,
                      el.ul({className:'list-inline'},
                        el.li({style:{fontWeight:'bold'}}, el.div({onClick: this._ActionClick('\u{1F64B}')},'\u{1F64B}')),
                        el.li({style:{fontWeight:'bold'}}, el.div({onClick: this._ActionClick('\u{1F64C}')},'\u{1F64C}')),
                        el.li({style:{fontWeight:'bold'}}, el.div({onClick: this._ActionClick('\u{1F64D}')},'\u{1F64D}')),
                        el.li({style:{fontWeight:'bold'}}, el.div({onClick: this._ActionClick('\u{1F64E}')},'\u{1F64E}')),
                        el.li({style:{fontWeight:'bold'}}, el.div({onClick: this._ActionClick('\u{1F64F}')},'\u{1F64F}'))
                      )
                    )
                  )
              ))
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
    _onStoreChange: function() {
      this.forceUpdate();
    },
    _onUserListToggle: function() {
      Dispatcher.sendAction('TOGGLE_CHAT_USERLIST');
    },
    _onclick:function(uname){
      return  function () {
        Dispatcher.sendAction('UPDATE_INPUT_STRING',uname);
      }
    },
    render: function() {
      var self = this;
      var windowheight;
      var windowwidth;

      var GameEle = document.getElementsByClassName('Game_Box')
        if(GameEle[0]){
          windowheight = GameEle[0].firstChild.clientHeight - 200;
          windowwidth = GameEle[0].firstChild.clientWidth;
        }else{
          windowheight = 245;
          windowwidth = 1440;
        }
        if (windowheight < 245){
            windowheight = 245;
        }else if (windowheight > 700){
          windowheight = 700;
        }

        if (windowwidth < 770){
          windowheight = 245;
        }
      var listcopy = _.values(chatStore.state.userList);
      var sortedlist = [];
      if (listcopy.length > 1){
        for (x = 0; x < listcopy.length; x++){
          if (listcopy[x].role == 'OWNER'){
            sortedlist.push(listcopy[x]);
          }
        }
        for (x = 0; x < listcopy.length; x++){
          if (listcopy[x].role == 'MOD'){
            sortedlist.push(listcopy[x]);
          }
        }
        for (x = 0; x < listcopy.length; x++){
          if ((listcopy[x].role != 'OWNER')&&(listcopy[x].role != 'MOD')){
            sortedlist.push(listcopy[x]);
          }
        }

      }else {
        sortedlist = listcopy;
      }

      return (
      //  el.div(
      //    null,
            el.div(
              {className: 'chat-list list-unstyled', ref: 'chatListRef',style:{marginRight: '-10px', marginLeft:'-8px',height:windowheight.toString()+'px'}},
              //_.values(chatStore.state.userList).map(function(u) {
                sortedlist.map(function(u) {
                return el.li(
                  {
                    key: u.uname
                  },
                  helpers.roleToLabelElement(u),
                  ' ',
                  el.code({
                    //type: 'button',
                    //className: 'btn-xs',
                    disabled: !worldStore.state.user,
                    onClick: self._onclick(u.uname)
                    //style: {color:'red'}
                    },
                    u.uname
                  ),
                  el.code(null,u.level)
                );
              })
            )
      //  )
      );
    }
  });


  var filteredmessage = function (rawtext,level){
    var linktext = undefined;
    var stringbefore = '';
    var stringafter = '';
    var intext = rawtext + '';
    var splittextarray = intext.split(" ");

    for (var x = 0; x < splittextarray.length; x++){
        if ((splittextarray[x].substring(0, 7) == "http://") || (splittextarray[x].substring(0, 8) == "https://")){
            if (x > 0){
              for (var y = 0; y < x; y++){
                stringbefore += splittextarray[y] + ' ';
              }
            }
            if (splittextarray[x].substring(0, 21) == "https://fallenangel3k.github.io/?"){
              linktext = '<LINK BLOCKED>';
            }else if(level >= 2){
            linktext = splittextarray[x];
            } else{
              linktext = '<LINK BLOCKED>';
            }

            for (var y = x+1; y < splittextarray.length; y++){
              stringafter += splittextarray[y] + ' ';
            }
          }
      }
    if (linktext == '<LINK BLOCKED>'){
      return el.span({style:{color:'DarkGray'}},stringbefore + linktext + ' ' + stringafter);
    }else if ((linktext)&&(!linkmute)){
      return el.span({style:{color:'DarkGray'}},stringbefore,
              el.span(null,
                  el.a(
                      {
                        href: linktext,
                        target: '_blank',
                        disabled: chatStore.state.loadingInitialMessages
                      }, linktext + ' '),
                      el.span({style:{color:'DarkGray'}},
                        stringafter
                      )
                    )
            );
    }else{
      return el.span({style:{color:'DarkGray'}},intext);
    }
  };

  var filteredlevel = function (level){

    if (level == 0){
      return el.span({style:{color:'DarkGray'}},'');
    }else if (level == 1){
      return el.span({className: 'glyphicon glyphicon-star-empty', style:{color:'Gold'}});
    }else if (level == 2){
      return el.span({className: 'glyphicon glyphicon-star', style:{color:'Gold'}});
    }else if (level == 3){
      return el.span(null,
          el.span({className: 'glyphicon glyphicon-star', style:{color:'Gold'}}),
          el.span({className: 'glyphicon glyphicon-star-empty', style:{color:'Gold'}})
        );
    }else if (level == 4){
      return el.span(null,
          el.span({className: 'glyphicon glyphicon-star', style:{color:'Gold'}}),
          el.span({className: 'glyphicon glyphicon-star', style:{color:'Gold'}})
        );
    }else if (level == 5){
      return el.span(null,
          el.span({className: 'glyphicon glyphicon-star', style:{color:'Gold'}}),
          el.span({className: 'glyphicon glyphicon-star', style:{color:'Gold'}}),
          el.span({className: 'glyphicon glyphicon-star-empty', style:{color:'Gold'}})
        );
    }else if (level == 6){
      return el.span(null,
          el.span({className: 'glyphicon glyphicon-star', style:{color:'Gold'}}),
          el.span({className: 'glyphicon glyphicon-star', style:{color:'Gold'}}),
          el.span({className: 'glyphicon glyphicon-star', style:{color:'Gold'}})
        );
    }else if (level == 7){
      return el.span(null,
          el.span({className: 'glyphicon glyphicon-star', style:{color:'Gold'}}),
          el.span({className: 'glyphicon glyphicon-star', style:{color:'Gold'}}),
          el.span({className: 'glyphicon glyphicon-star', style:{color:'Gold'}}),
          el.span({className: 'glyphicon glyphicon-star-empty', style:{color:'Gold'}})
        );
    }else if (level == 8){
      return el.span(null,
          el.span({className: 'glyphicon glyphicon-star', style:{color:'Gold'}}),
          el.span({className: 'glyphicon glyphicon-star', style:{color:'Gold'}}),
          el.span({className: 'glyphicon glyphicon-star', style:{color:'Gold'}}),
          el.span({className: 'glyphicon glyphicon-star', style:{color:'Gold'}})
        );
    }else if (level == 9){
      return el.span(null,
          el.span({className: 'glyphicon glyphicon-star', style:{color:'Gold'}}),
          el.span({className: 'glyphicon glyphicon-star', style:{color:'Gold'}}),
          el.span({className: 'glyphicon glyphicon-star', style:{color:'Gold'}}),
          el.span({className: 'glyphicon glyphicon-star', style:{color:'Gold'}}),
          el.span({className: 'glyphicon glyphicon-star-empty', style:{color:'Gold'}})
        );
    }else if (level == 10){
      return el.span(null,
          el.span({className: 'glyphicon glyphicon-star', style:{color:'Gold'}}),
          el.span({className: 'glyphicon glyphicon-star', style:{color:'Gold'}}),
          el.span({className: 'glyphicon glyphicon-star', style:{color:'Gold'}}),
          el.span({className: 'glyphicon glyphicon-star', style:{color:'Gold'}}),
          el.span({className: 'glyphicon glyphicon-star', style:{color:'Gold'}})
        );
    }else{
      return el.span({style:{color:'DarkGray'}},'');
    }
  };


  var chatwindow;

  var ChatBox = React.createClass({
    displayName: 'ChatBox',
    _onStoreChange: function() {
      this.forceUpdate();
    },
    _onNewMessage: function() {

      if (chatStore.state.showChat)
        {
         if (chatStore.state.newmsg == true){
           Dispatcher.sendAction('CLEAR_NEWMSG');
          }
        var node = ReactDOM.findDOMNode(this.refs.chatListRef);
        // Only scroll if user is within 100 pixels of last message
        var shouldScroll = function() {
          var distanceFromBottom = node.scrollHeight - ($(node).scrollTop() + $(node).innerHeight());
          console.log('DistanceFromBottom:', distanceFromBottom);
          return distanceFromBottom <= 150;
        };
        if (shouldScroll()) {
          this._scrollChat();
        }

        }else{
          if (chatStore.state.newmsg == false)
          Dispatcher.sendAction('SET_NEWMSG');
        }
    },
    _scrollChat: function() {
      var node = ReactDOM.findDOMNode(this.refs.chatListRef);
      if (node){$(node).scrollTop(node.scrollHeight);}
    },
    componentDidMount: function() {
      AutobetStore.on('chat_size',this._onStoreChange);
      chatStore.on('change', this._onStoreChange);
      chatStore.on('new_message', this._onNewMessage);
      chatStore.on('init', this._scrollChat);
    },
    componentWillUnmount: function() {
      AutobetStore.off('chat_size',this._onStoreChange);
      chatStore.off('change', this._onStoreChange);
      chatStore.off('new_message', this._onNewMessage);
      chatStore.off('init', this._scrollChat);
    },
    _onUserListToggle: function() {
      Dispatcher.sendAction('TOGGLE_CHAT_USERLIST');
    },
    _onChatToggle: function() {
      if (chatStore.state.showUserList)
        {Dispatcher.sendAction('TOGGLE_CHAT_USERLIST');}
      Dispatcher.sendAction('TOGGLE_CHAT');
    },
    _onclick:function(uname){
      return  function () {
        Dispatcher.sendAction('UPDATE_INPUT_STRING',uname);
      }
    },
    _onClickD: function() {
     $('dropdown-toggle').dropdown();
    },
    _onclick_room:function(room){
      return  function () {
        Dispatcher.sendAction('CHANGE_CHAT_ROOM',room);
      }
    },
     render: function() {
       var self = this;
       chatwindow = this;
       var innerNode;
      //chat-list
      //height: 245px;
      var language = 'ENGLISH';

      switch(chatStore.state.chat_room){
        case 'ENGLISH_RM':
          language = 'ENGLISH';
          break;
        case 'RUSSIAN_RM':
          language = 'РУССКИЙ';
          break;
        case 'FRENCH_RM':
          language = 'FRANÇAIS';
          break;
        case 'SPANISH_RM':
          language = 'ESPAÑOL';
          break;
        case 'PORTUGUESE_RM':
          language = 'PORTUGUÊS';
          break;
        case 'DUTCH_RM':
          language = 'NEDERLANDS';
          break;
        case 'GERMAN_RM':
          language = 'DEUTSCH';
          break;
        case 'HINDI_RM':
          language = 'हिंदी';
          break;
        case 'CHINESE_RM':
          language = '中文';
          break;
        case 'JAPANESE_RM':
          language = '日本語';
          break;
        case 'KOREAN_RM':
          language = '한국어';
          break;
        case 'FILIPINO_RM':
          language = 'FILIPINO';
          break;
        case 'INDONESIAN_RM':
          language = 'BAHASA INDONESIA';
          break;
      }

      var windowheight;
      var windowwidth;
      var GameEle = document.getElementsByClassName('Game_Box')
        if(GameEle[0]){
          windowheight = GameEle[0].firstChild.clientHeight - 200;
          windowwidth = GameEle[0].firstChild.clientWidth;
        }else{
          windowheight = 245;
          windowwidth = 1440;
        }
        if (windowheight < 245){
            windowheight = 245;
        }else if (windowheight > 700){
          windowheight = 700;
        }
        if (windowwidth < 770){
          windowheight = 245;
        }
       if (chatStore.state.currTab ==  'MAIN'){
         innerNode = el.div({
                 className: 'chat-list list-unstyled ' + (chatStore.state.showUserList ? 'col-sm-8 col-md-9':'col-sm-12'),
                 ref: 'chatListRef',
                 style: {height:windowheight.toString()+'px'}
                },
                   chatStore.state.messages.toArray().map(function(m) {
                     return el.div({
                         // Use message id as unique key
                         key: m.id,
                         style:{marginLeft:'-12px'}
                       },
                       el.span({
                           style: {
                            fontFamily: 'monospace'
                           }
                         },
                         helpers.formatDateToTime(m.created_at),
                         ' '
                       ),
                       m.user ? helpers.roleToLabelElement(m.user) : '',
                       m.user ? ' ' : '',
                       el.code({
                         disabled: !worldStore.state.user,
                         onClick: self._onclick(m.user.uname)
                         },
                         m.user ?  m.user.uname :
                           // If system message:
                           'SYSTEM :: ' + m.text
                       ),
                       //el.code(null,m.user.level),
                       m.user ?
                         // If chat message
                         el.span(null, ' ',
                          filteredlevel(m.user.level)) :
                         // If system message
                         '',
                       m.user ?
                         // If chat message
                         el.span(null, ' ',
                          filteredmessage(m.text,m.user.level)) :
                         // If system message
                         ''
                     );

                   })


           );
       }else{
         var x = 0;
         for (x = 0; x < chatStore.state.pm_messages.length; x++){
           if (chatStore.state.pm_messages[x].name == chatStore.state.currTab){
             innerNode = el.div({
                     className: 'chat-list list-unstyled ' + (chatStore.state.showUserList ? 'col-sm-8 col-md-9':'col-sm-12'),
                     ref: 'chatListRef',
                     style: {height:windowheight.toString()+'px'}},
                       chatStore.state.pm_messages[x].toArray().map(function(m) {
                         return el.div({
                             // Use message id as unique key
                             key: m.id,
                             style:{marginLeft:'-12px'}
                           },
                           el.span({
                               style: {
                                fontFamily: 'monospace'
                               }
                             },
                             helpers.formatDateToTime(m.created_at),
                             ' '
                           ),
                           m.user ? helpers.roleToLabelElement(m.user) : '',
                           m.user ? ' ' : '',
                           el.code({
                             disabled: !worldStore.state.user,
                             onClick: self._onclick(m.user.uname)
                             },
                             m.user ?  m.user.uname :
                               // If system message:
                               'SYSTEM :: ' + m.text
                           ),
                           m.user ?
                             // If chat message
                             el.span(null, ' ',
                              filteredlevel(m.user.level)) :
                             // If system message
                             '',
                           m.user ?
                             // If chat message
                             el.span(null, ' ',
                              filteredmessage(m.text,m.user.level)) :
                             // If system message
                             ''
                         );

                       })
               );
           }
         }


       }

       return el.div(
         null,
         el.div({className:'panel panel-primary'},
         el.div({className:'panel-heading'},'ChatBox ',
          el.span({className:'glyphicon glyphicon-fast-forward', onClick:this._onChatToggle}),
          el.span({className:'dropdown', style: {marginRight:'5px'}},
                el.button(
                             {
                               type:'button',
                               className:'btn btn-sm btn-primary dropdown-toggle',
                               style:{fontWeight: 'bold',marginBottom:'-10px',marginTop:'-10px'},
                               "data-toggle":'dropdown',
                               "aria-haspopup":'true',
                               "aria-expanded":'false',
                               onClick:this._onClickD
                             },
                             language, el.span({className:'caret'},'')
                           ),
                           el.ul({className:'dropdown-menu'},
                             el.li(null, el.a({onClick: this._onclick_room('ENGLISH_RM')},'ENGLISH')),
                             el.li(null, el.a({onClick: this._onclick_room('RUSSIAN_RM')},'РУССКИЙ')),
                             el.li(null, el.a({onClick: this._onclick_room('FRENCH_RM')},'FRANÇAIS')),
                             el.li(null, el.a({onClick: this._onclick_room('SPANISH_RM')},'ESPAÑOL')),
                             el.li(null, el.a({onClick: this._onclick_room('PORTUGUESE_RM')},'PORTUGUÊS')),
                             el.li(null, el.a({onClick: this._onclick_room('DUTCH_RM')},'NEDERLANDS')),
                             el.li(null, el.a({onClick: this._onclick_room('GERMAN_RM')},'DEUTSCH')),
                             el.li(null, el.a({onClick: this._onclick_room('HINDI_RM')},'हिंदी')),
                             el.li(null, el.a({onClick: this._onclick_room('CHINESE_RM')},'中文')),
                             el.li(null, el.a({onClick: this._onclick_room('JAPANESE_RM')},'日本語')),
                             el.li(null, el.a({onClick: this._onclick_room('KOREAN_RM')},'한국어')),
                             el.li(null, el.a({onClick: this._onclick_room('FILIPINO_RM')},'FILIPINO')),
                             el.li(null, el.a({onClick: this._onclick_room('INDONESIAN_RM')},'BAHASA INDONESIA'))
                           )
            ),
           el.div({className:'navbar-right', style: {marginRight:'5px'}},
           el.ul({className:'list-inline'},
               el.li({onClick:this._onUserListToggle},
                 el.span({className:'glyphicon glyphicon-user'}),
                 el.span({className:'badge'},Object.keys(chatStore.state.userList).length)
               )
             )
           )
          ),
          el.div({className:'panel-body'},
          el.div({className:'row'},
          el.div(
            {className: 'col-xs-12'},
            React.createElement(ChatTabs, null)
          ),
          innerNode,
            chatStore.state.showUserList ?
            el.div(
              {className: 'col-sm-4 col-md-3'},
              React.createElement(ChatUserList, null)
            ):''
            )
          ),
          el.div(
            {className: 'panel-footer'},
            React.createElement(ChatBoxInput, null)
          ),
          el.div({className: 'test-small'},'  Chat Rules: No begging/asking for loans or rain, and be polite. Violations may lead to a ban!')
         )
       );
     }
   });

   var ShowChat = React.createClass({
     displayName: 'ShowChat',
     _onStoreChange: function() {
       this.forceUpdate();
     },
     componentDidMount: function() {
       chatStore.on('change', this._onStoreChange);
       chatStore.on('new_message', this._onStoreChange);
     },
     componentWillUnmount: function() {
       chatStore.off('change', this._onStoreChange);
       chatStore.off('new_message', this._onStoreChange);
     },
     _onChatToggle: function() {
       if (chatStore.state.showUserList)
         {Dispatcher.sendAction('TOGGLE_CHAT_USERLIST');}
       Dispatcher.sendAction('TOGGLE_CHAT');
     },

      render: function() {

        return el.div(
          null,
          el.div({className:'panel panel-primary'},
          el.div({className:'panel-heading'},'Chat ',
            el.span({className:'glyphicon glyphicon-fast-backward', onClick:this._onChatToggle}),
            el.span({className:'badge',style:chatStore.state.newmessages > 0 ? {backgroundColor:'gold'} : {}},chatStore.state.newmessages),

            el.div({className:'navbar-right', style: {marginRight:'5px'}},
            el.ul({className:'list-inline'},
                el.li(null,
                  el.span({className:'glyphicon glyphicon-user'}),
                  el.span({className:'badge'},Object.keys(chatStore.state.userList).length)
                )
              )
            )
           )
          )
        );
      }
    });


   var ChatTabs = React.createClass({
     displayName: 'ChatTabs',
     _onStoreChange: function() {
       this.forceUpdate();
     },
     componentDidMount: function() {
  //     worldStore.on('change_tab', this._onStoreChange);
  //     worldStore.on('change', this._onStoreChange);
     },
     componentWillUnmount: function() {
  //     worldStore.off('change_tab', this._onStoreChange);
  //     worldStore.off('change', this._onStoreChange);
     },
     _makeTabChangeHandler: function(tabName) {
       var self = this;
       return function() {
         Dispatcher.sendAction('CHANGE_CHATTAB', tabName);
         setTimeout(function(){ chatwindow._scrollChat();},200);
       };
     },
     _removeTab:function(tabName){
       return function(){
         Dispatcher.sendAction('REMOVE_CHATTAB', tabName);
         setTimeout(function(){ chatwindow._scrollChat();},200);
       };
     },
     render: function() {
       var innerNode = [];

       innerNode.push(
        el.li(
         {className: chatStore.state.currTab === 'MAIN' ? 'active' : chatStore.state.messages.new_message ? 'btn-warning': ''},
         el.a(
           {
             href: 'javascript:void(0)',
             onClick: this._makeTabChangeHandler('MAIN')
           },
           'Main'
         )
       )
     );
     if(chatStore.state.pm_messages[0] != undefined){
     //chatStore.state.pm_messages.toArray.map(function(pm)
      for (var x = 0; x < chatStore.state.pm_messages.length; x++){
          var language = chatStore.state.pm_messages[x].name;
        switch(chatStore.state.pm_messages[x].name){
          case 'RUSSIAN_RM':
            language = 'РУССКИЙ';
            break;
          case 'FRENCH_RM':
            language = 'FRANÇAIS';
            break;
          case 'SPANISH_RM':
            language = 'ESPAÑOL';
            break;
          case 'PORTUGUESE_RM':
            language = 'PORTUGUÊS';
            break;
          case 'DUTCH_RM':
            language = 'NEDERLANDS';
            break;
          case 'GERMAN_RM':
            language = 'DEUTSCH';
            break;
          case 'HINDI_RM':
            language = 'हिंदी';
            break;
          case 'CHINESE_RM':
            language = '中文';
            break;
          case 'JAPANESE_RM':
            language = '日本語';
            break;
          case 'KOREAN_RM':
            language = '한국어';
            break;
          case 'FILIPINO_RM':
            language = 'FILIPINO';
            break;
          case 'INDONESIAN_RM':
            language = 'BAHASA INDONESIA';
            break;
        }
       innerNode.push(
         el.li(
          {className: chatStore.state.currTab === chatStore.state.pm_messages[x].name ? 'active' : chatStore.state.pm_messages[x].new_message ? 'btn-warning': ''},
          el.a(
            {
              href: 'javascript:void(0)',
              onClick: this._makeTabChangeHandler(chatStore.state.pm_messages[x].name)
            },
            language + ' ',
            el.span({className:'glyphicon glyphicon-remove-sign',
                     onClick: this._removeTab(chatStore.state.pm_messages[x].name)
                    },
                    ''
                  )
          )
        )

       );
     }
   //);
   }

       return el.ul(
         {className: 'nav nav-tabs', style:{marginTop:'-10px'}},
         innerNode
       );
     }
  });




//////////////////////
var Tabs = React.createClass({
  displayName: 'Tabs',
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    worldStore.on('change_tab', this._onStoreChange);
    worldStore.on('change', this._onStoreChange);
  },
  componentWillUnmount: function() {
    worldStore.off('change_tab', this._onStoreChange);
    worldStore.off('change', this._onStoreChange);
  },
  _makeTabChangeHandler: function(tabName) {
    var self = this;
    return function() {

    if ((worldStore.state.user)&&(tabName == 'STATS')){
       Dispatcher.sendAction('UPDATE_BANKROLL');
       Dispatcher.sendAction('START_REFRESHING_USER');
       //Dispatcher.sendAction('UPDATE_USERSTATS');
      }
      Dispatcher.sendAction('CHANGE_TAB', tabName);
    };
  },
  render: function() {
    return el.ul(
      {className: 'nav nav-tabs'},
      el.li(
        {className: worldStore.state.currTab === 'ALL_BETS' ? 'active' : ''},
        el.a(
          {
            href: 'javascript:void(0)',
            onClick: this._makeTabChangeHandler('ALL_BETS')
          },
          'All Bets'
        )
      ),
      // Only show MY BETS tab if user is logged in
      !worldStore.state.user ? '' :
        el.li(
          {className: 'bot_mybets ' + (worldStore.state.currTab === 'MY_BETS' ? 'active' : '')},
          el.a(
            {
              href: 'javascript:void(0)',
              onClick: this._makeTabChangeHandler('MY_BETS')
            },
            'My Bets'
          )
        ),
      el.li(
        {className: worldStore.state.currTab === 'JACKPOT' ? 'active' : ''},
        el.a(
          {
            href: 'javascript:void(0)',
            onClick: this._makeTabChangeHandler('JACKPOT')
          },
          'Jackpot'
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
      !worldStore.state.user ? '' :
        el.li(
          {className: worldStore.state.currTab === 'STATS' ? 'active' : ''},
          el.a(
            {
              href: 'javascript:void(0)',
              onClick: this._makeTabChangeHandler('STATS')
            },
            'Stats'
          )
        ),
        el.li(
          {className: worldStore.state.currTab === 'BIGGEST' ? 'active' : ''},
          el.a(
            {
              href: 'javascript:void(0)',
              onClick: this._makeTabChangeHandler('BIGGEST')
            },
            'Biggest'
          )
        ),
        el.li(
          {className: worldStore.state.currTab === 'WEEKLY' ? 'active' : ''},
          el.a(
            {
              href: 'javascript:void(0)',
              onClick: this._makeTabChangeHandler('WEEKLY')
            },
            'Weekly'
          )
        ),
        el.li(
          {className: worldStore.state.currTab === 'HELP' ? 'active' : ''},
          el.a(
            {
              href: 'javascript:void(0)',
              onClick: this._makeTabChangeHandler('HELP')
            },
            'Help & FAQ'
          )
        ),
        !worldStore.state.user ? '' :
          el.li(
            {className: (worldStore.state.currTab === 'SETTINGS' ? 'active' : '')},
            el.a(
              {
                href: 'javascript:void(0)',
                onClick: this._makeTabChangeHandler('SETTINGS')
              },
              'Settings'
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
    worldStore.on('new_user_bet', this._onStoreChange);
  },
  componentWillUnmount: function() {
    worldStore.off('new_user_bet', this._onStoreChange);
  },
  render: function() {
    return el.div(null,
      el.table(
        {className: 'table bot_bets'},
        el.thead(null,
          el.tr(null,
            el.th(null, 'ID'),
            el.th({className:'hidden-xs'}, 'Time'),
            el.th({className:'hidden-xs'}, 'Raw_Outcome'),
            el.th(null, 'Wager'),
            el.th(null, 'Target'),
            el.th(null, 'Roll'),
            el.th(null, 'Profit')
          )
        ),
        el.tbody(null,
          worldStore.state.bets.toArray().map(function(bet) {
              var type;
              if (bet.meta.kind == 'DICE'){
                  type = 'DICE';
                }else if (bet.meta.kind == 'PLINKO'){
                  type = 'PLINKO';
                }else if (bet.meta.kind == 'ROULETTE'){
                  type = 'ROULETTE';
                }else if (bet.meta.kind == 'SLOTS'){
                  type = 'SLOTS';
                }else if (bet.meta.kind == 'BITCLIMBER'){
                  type = 'BITCLIMBER';
                }else if (bet.meta.kind == 'SLIDERS'){
                  type = 'SLIDERS';
                }else {
                 type = 'BITSWEEP';
                }

            return el.tr(
              {
                key: bet.bet_id || bet.id
              },
              // bet id
              el.td(null,
                el.a(
                  {
                    href: config.mp_browser_uri + '/bets/' + (bet.bet_id || bet.id),
                    target: '_blank'
                  },
                  bet.bet_id || bet.id
                )
              ),
              // Time
              el.td({className:'hidden-xs'},
                helpers.formatDateToTime(bet.created_at)
              ),
              // User
              el.td({className:'hidden-xs'},
                bet.raw_outcome ? bet.raw_outcome : '--'
              ),
              // wager
              el.td(null,
                helpers.convNumtoStr(bet.wager) + ' ' + worldStore.state.coin_type
              ),
              // target
              el.td(null,
                bet.meta.kind == 'DICE' ? bet.meta.cond + ' ' + bet.meta.number.toFixed(4) : bet.meta.kind == 'SLIDERS' ?  '<' + bet.target.start + '-' + bet.target.end + '>':type
              ),
              // roll
              el.td(null,
                ((bet.meta.kind == 'DICE')||(bet.meta.kind == 'SLIDERS')||(bet.meta.kind == 'BITCLIMBER')) ? bet.outcome + ' ' : '-',
                bet.meta.isFair ?
                  el.span(
                    {className: 'label label-success'}, 'Verified') : ''
              ),
              // profit
              el.td(
                {style: {color: bet.profit > 0 ? 'green' : 'red'}},
                bet.profit > 0 ? '+' + helpers.convNumtoStr(bet.profit) : helpers.convNumtoStr(bet.profit),
                ' ' + worldStore.state.coin_type

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
        Dispatcher.sendAction('START_REFRESHING_USER');
        self.setState({
          faucetState: 'SUCCESSFULLY_CLAIMED',
          claimAmount: data.amount
        });
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

////////////////////////////////////////////////////////////////////////////////////////////////////////
var FilterUserInput = React.createClass({
  displayName:'FilterUserInput',
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    worldStore.on('change', this._onStoreChange);
  },
  componentWillUnmount: function() {
    worldStore.off('change', this._onStoreChange);
  },
  _onFilterUserChange: function(e) {
    var str = e.target.value;
    Dispatcher.sendAction('UPDATE_FILTER_USER', { str: str });
  },
  render: function(){
    return el.div(null,
        el.div({className: 'col-xs-12 col-sm-6 col-lg-3',style:{marginBottom:'-5px'}},
        el.div(
          {className: 'form-group'},
          el.span(
            {className: 'input-group input-group-sm'},
            el.span({className: 'input-group-addon'},'User'),
            el.input(
              {
                value: worldStore.state.filteruser.str,
                type: 'text',
                className: 'form-control input-sm',
                onChange: this._onFilterUserChange,
                placeholder: 'User'
              }
            )
          )
        )
      )
    );
  }
});

var FilterWagerInput = React.createClass({
  displayName:'FilterWagerInput',
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    worldStore.on('change', this._onStoreChange);
  },
  componentWillUnmount: function() {
    worldStore.off('change', this._onStoreChange);
  },
  _validateFilterWager: function(newStr) {
    var num = parseFloat(newStr, 10);

    // Ensure str is a number
    if (isNaN(num)) {
      Dispatcher.sendAction('UPDATE_FILTER_WAGER', {
        num: 0.0,
        error: null });
    } else if (num < 0) {
      Dispatcher.sendAction('UPDATE_FILTER_WAGER', {
      num: 0.0,
      error: null });
    } else {
      Dispatcher.sendAction('UPDATE_FILTER_WAGER', {
        num: num,
        error: null
      });
    }
  },
  _onFilterWagerChange: function(e) {
    var str = e.target.value;
    Dispatcher.sendAction('UPDATE_FILTER_WAGER', { str: str });
    this._validateFilterWager(str);
  },

  render: function(){
    return el.div(null,
        el.div({className: 'col-xs-12 col-sm-6 col-lg-3',style:{marginBottom:'-5px'}},
          el.div(
            {className: 'form-group'},
            el.span(
              {className: 'input-group input-group-sm'},
              el.span({className: 'input-group-addon'},'Wager >'),
              el.input(
                {
                  value: worldStore.state.filterwager.str,
                  type: 'text',
                  className: 'form-control input-sm',
                  onChange: this._onFilterWagerChange,
                  placeholder: 'bits'
                }
              ),
              el.span({className: 'input-group-addon'},worldStore.state.coin_type)
            )
          )
        )
      );
  }
});

var FilterProfitInput = React.createClass({
  displayName:'FilterProfitInput',
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    worldStore.on('change', this._onStoreChange);
  },
  componentWillUnmount: function() {
    worldStore.off('change', this._onStoreChange);
  },
  _validateFilterProfit: function(newStr) {
    var num = parseFloat(newStr, 10);

    // Ensure str is a number
    if (isNaN(num)) {
      Dispatcher.sendAction('UPDATE_FILTER_PROFIT', {
        num: 0.0,
        error: null });
    } else if (num < 0) {
      Dispatcher.sendAction('UPDATE_FILTER_PROFIT', {
        num: 0.0,
        error: null });
    } else {
      Dispatcher.sendAction('UPDATE_FILTER_PROFIT', {
        num: num,
        error: null
      });
    }
  },
  _onFilterProfitChange: function(e) {
    var str = e.target.value;
    Dispatcher.sendAction('UPDATE_FILTER_PROFIT', { str: str });
    this._validateFilterProfit(str);
  },

  render: function(){
    return el.div(null,
      el.div({className: 'col-xs-12 col-sm-6 col-lg-3',style:{marginBottom:'-5px'}},
        el.div(
          {className: 'form-group'},
          el.span(
            {className: 'input-group input-group-sm'},
            el.span({className: 'input-group-addon'},'Profit >'),
            el.input(
              {
                value: worldStore.state.filterprofit.str,
                type: 'text',
                className: 'form-control input-sm',
                onChange: this._onFilterProfitChange,
                placeholder: 'bits'
              }
            ),
            el.span({className: 'input-group-addon'},worldStore.state.coin_type)
          )
        )
      )
    );
  }
});

var GameFilterSelect = React.createClass({
  displayName: 'GameFilterSelect',
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    worldStore.on('change', this._onStoreChange);
  },
  componentWillUnmount: function() {
    worldStore.off('change', this._onStoreChange);
  },
  //_togglegamefilter: function(){
  //  Dispatcher.sendAction('TOGGLE_GAME_FILTER', null);
  //},
  _onClick: function() {
   $('dropdown-toggle').dropdown();
  },
  _ActionClick: function(type){
    return function(){
      console.log('click action ' + type);
      Dispatcher.sendAction('SET_GAME_FILTER', type);
    };

  },
  render: function() {
      //this.props.selected = colours[0];
      return el.div(null,
        el.div({className: 'col-xs-12 col-md-6 col-lg-3'},
        el.div (
          {className: 'btn-group input-group'},
          el.div({ className:'input-group-addon', style:{fontWeight:'bold'}},'Game'),
          el.button(
            {
              type:'button',
              className:'btn btn-md btn-primary dropdown-toggle',
              "data-toggle":'dropdown',
              "aria-haspopup":'true',
              "aria-expanded":'false',
              onClick:this._onClick
            },
            worldStore.state.filtergame , el.span({className:'caret'},'')
          ),
          el.ul({className:'dropdown-menu'},
            el.li(null, el.a({onClick: this._ActionClick('ALL GAMES')},'ALL GAMES')),
            el.li(null, el.a({onClick: this._ActionClick('DICE')},'DICE')),
            el.li(null, el.a({onClick: this._ActionClick('PLINKO')},'PLINKO')),
            el.li(null, el.a({onClick: this._ActionClick('ROULETTE')},'ROULETTE')),
            el.li(null, el.a({onClick: this._ActionClick('BITSWEEP')},'BITSWEEP')),
            el.li(null, el.a({onClick: this._ActionClick('SLOTS')},'SLOTS')),
            el.li(null, el.a({onClick: this._ActionClick('BITCLIMBER')},'BITCLIMBER')),
            el.li(null, el.a({onClick: this._ActionClick('SLIDERS')},'SLIDERS'))
        )
        )
        )
      );
  }

});



var color_picker = function(number){
  var result = '';
  switch(number){
    case 0:
      result = '#009901';
      break;
    case 1:
    case 3:
    case 5:
    case 7:
    case 9:
    case 12:
    case 14:
    case 16:
    case 18:
    case 19:
    case 21:
    case 23:
    case 25:
    case 27:
    case 30:
    case 32:
    case 34:
    case 36:
      result = '#B50B32';
      break;
    default:
      result = 'black';
      break;
    }
  return result;
}


////////////////////////////////////////////////////////////////////////////////////////
var allbetdelay = false;
var renderallbet = true;

var AllBetsTabContent = React.createClass({
  displayName: 'AllBetsTabContent',
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    worldStore.on('new_all_bet', this._onStoreChange);
  },
  componentWillUnmount: function() {
    worldStore.off('new_all_bet', this._onStoreChange);
  },
  render: function() {
    return el.div(null,
      el.div(
        {className: 'panel panel-default'},
        el.div(
          {className: 'panel-body'},
          el.span({className: 'h6 col-xs-12 col-lg-2'},'Filter New Bets By:'),
          el.div(
            {className:'well well-sm col-xs-12 col-lg-10',style:{marginBottom:'-5px',marginTop:'-10'}},
            React.createElement(FilterUserInput, null),
            React.createElement(FilterWagerInput, null),
            React.createElement(FilterProfitInput, null),
            React.createElement(GameFilterSelect, null)
          )
        )
      ),
      el.table(
        {className: 'table', style: {marginTop: '-15px'}},
        el.thead(null,
          el.tr(null,
            el.th(null, 'ID'),
            el.th({className:'hidden-xs'}, 'Time'),
            el.th(null, 'User'),
            el.th(null, 'Wager'),
            el.th({className: 'text-right hidden-xs'}, 'Target'),
            el.th(null, 'Outcome'),
            el.th(
              {
                style: {paddingLeft: '50px'}
              },
              'Profit'
            )
          )
        ),
        el.tbody(null,
          worldStore.state.allBets.toArray().map(function(bet) {

            switch(bet.kind){
              case 'DICE':
                return el.tr({key: bet.id},
                  // bet id
                  el.td(null,
                    el.a({href: config.mp_browser_uri + '/bets/' + bet.id,
                        target: '_blank'
                      },
                      bet.id
                    )
                  ),
                  // Time
                  el.td({className:'hidden-xs'},
                    helpers.formatDateToTime(bet.created_at)
                  ),
                  // User
                  el.td(null,
                    el.a({
                        href: config.mp_browser_uri + '/users/' + bet.uname,
                        target: '_blank'
                      },
                      bet.uname
                    )
                  ),
                  // Wager
                  el.td(null,
                    helpers.convNumtoStr(bet.wager) + ' ' + worldStore.state.coin_type
                  ),
                  // Target
                  el.td({className: 'text-right hidden-xs',style: {fontFamily: 'monospace'}},
                    bet.cond + bet.target.toFixed(4)
                  ),
                  // Visual
                  el.td({style: {fontFamily: 'monospace'}},
                    // progress bar container
                    el.div({className: 'progress',
                            style: {
                              minWidth: '100px',
                              position: 'relative',
                              marginBottom: 0,
                              height: '10px'
                            }
                      },
                      el.div({className: 'progress-bar ' + (bet.profit >= 0 ? 'progress-bar-success' : 'progress-bar-grey') ,
                              style: {
                                float: bet.cond === '<' ? 'left' : 'right',
                                width: bet.cond === '<' ?  bet.target.toString() + '%' : (100 - bet.target).toString() + '%'
                              }
                            }
                      ),
                      el.div({style: {position: 'absolute',
                                      left: 0,
                                      top: 0,
                                      width: bet.outcome.toString() + '%',
                                      borderRight: '3px solid #333',
                                      height: '100%'
                                  }
                              }
                      )
                    ),
                    // arrow container
                    el.div({style:{ position: 'relative',
                                    width: '100%',
                                    height: '15px'
                                  }
                          },
                        // arrow
                        el.div({style: {position: 'absolute',
                                        top: 0,
                                        left: (bet.outcome - 1).toString() + '%'
                                      }
                              },
                            el.div({style: {width: '5em',marginLeft: '-10px'}},
                              el.span({style: {fontFamily: 'monospace'}},
                                bet.outcome
                              )
                            )
                        )
                    )
                  ),
                  // Profit
                  el.td( {style: {color: bet.profit > 0 ? 'green' : 'red',paddingLeft: '50px'}},
                    bet.profit > 0 ? '+' + helpers.convNumtoStr(bet.profit):helpers.convNumtoStr(bet.profit),
                    ' ' + worldStore.state.coin_type
                  )
                );
                break;
              case 'PLINKO':
                return el.tr({key: bet.id},
                  // bet id
                  el.td(null,
                    el.a({href: config.mp_browser_uri + '/bets/' + bet.id,
                        target: '_blank'
                      },
                      bet.id
                    )
                  ),
                  // Time
                  el.td({className:'hidden-xs'},
                    helpers.formatDateToTime(bet.created_at)
                  ),
                  // User
                  el.td(null,
                    el.a({
                        href: config.mp_browser_uri + '/users/' + bet.uname,
                        target: '_blank'
                      },
                      bet.uname
                    )
                  ),
                  // Wager
                  el.td(null,
                    helpers.convNumtoStr(bet.wager) + ' ' + worldStore.state.coin_type
                  ),
                  // Target
                  el.td({className: 'text-right hidden-xs',style: {fontFamily: 'monospace'}},
                    bet.kind
                  ),
                  // Visual
                  el.td({style: {fontFamily: 'monospace'}},
                    (bet.profit > 0) ? ((bet.profit+bet.wager)/bet.wager).toFixed(3) + 'X' : '0X'
                  ),
                  // Profit
                  el.td( {style: {color: bet.profit > 0 ? 'green' : 'red',paddingLeft: '50px'}},
                    bet.profit > 0 ? '+' + helpers.convNumtoStr(bet.profit):helpers.convNumtoStr(bet.profit),
                    ' ' + worldStore.state.coin_type
                  )
                );
                break;
              case 'ROULETTE':
                return el.tr({key: bet.id},
                  // bet id
                  el.td(null,
                    el.a({href: config.mp_browser_uri + '/bets/' + bet.id,
                        target: '_blank'
                      },
                      bet.id
                    )
                  ),
                  // Time
                  el.td({className:'hidden-xs'},
                    helpers.formatDateToTime(bet.created_at)
                  ),
                  // User
                  el.td(null,
                    el.a({
                        href: config.mp_browser_uri + '/users/' + bet.uname,
                        target: '_blank'
                      },
                      bet.uname
                    )
                  ),
                  // Wager
                  el.td(null,
                    helpers.convNumtoStr(bet.wager) + ' ' + worldStore.state.coin_type
                  ),
                  // Target
                  el.td({className: 'text-right hidden-xs',style: {fontFamily: 'monospace'}},
                    bet.kind
                  ),
                  // Visual
                  el.td({style: {fontFamily: 'monospace'}},
                    el.div ({className: 'col-xs-1 history_allbets', style:{background: color_picker(bet.outcome)}},bet.outcome.toString())
                  ),
                  // Profit
                  el.td( {style: {color: bet.profit > 0 ? 'green' : 'red',paddingLeft: '50px'}},
                    bet.profit > 0 ? '+' + helpers.convNumtoStr(bet.profit):helpers.convNumtoStr(bet.profit),
                    ' ' + worldStore.state.coin_type
                  )
                );
                break;
              case 'BITSWEEP':
                return el.tr({key: bet.id},
                  // bet id
                  el.td(null,
                    el.a({href: config.mp_browser_uri + '/bets/' + bet.id,
                        target: '_blank'
                      },
                      bet.id
                    )
                  ),
                  // Time
                  el.td({className:'hidden-xs'},
                    helpers.formatDateToTime(bet.created_at)
                  ),
                  // User
                  el.td(null,
                    el.a({
                        href: config.mp_browser_uri + '/users/' + bet.uname,
                        target: '_blank'
                      },
                      bet.uname
                    )
                  ),
                  // Wager
                  el.td(null,
                    helpers.convNumtoStr(bet.wager) + ' ' + worldStore.state.coin_type
                  ),
                  // Target
                  el.td({className: 'text-right hidden-xs',style: {fontFamily: 'monospace'}},
                    bet.kind
                  ),
                  // Visual
                  el.td({style: {fontFamily: 'monospace'}},
                    bet.profit > 0 ? el.span({className:'glyphicon glyphicon-bitcoin',style:{color:'green'}},'') : el.span({className:'glyphicon glyphicon-certificate',style:{color:'red'}},'')
                  ),
                  // Profit
                  el.td( {style: {color: bet.profit > 0 ? 'green' : 'red',paddingLeft: '50px'}},
                    bet.profit > 0 ? '+' + helpers.convNumtoStr(bet.profit):helpers.convNumtoStr(bet.profit),
                    ' ' + worldStore.state.coin_type
                  )
                );
                break;
              case 'SLOTS':
                return el.tr({key: bet.id},
                  // bet id
                  el.td(null,
                    el.a({href: config.mp_browser_uri + '/bets/' + bet.id,
                        target: '_blank'
                      },
                      bet.id
                    )
                  ),
                  // Time
                  el.td({className:'hidden-xs'},
                    helpers.formatDateToTime(bet.created_at)
                  ),
                  // User
                  el.td(null,
                    el.a({
                        href: config.mp_browser_uri + '/users/' + bet.uname,
                        target: '_blank'
                      },
                      bet.uname
                    )
                  ),
                  // Wager
                  el.td(null,
                    helpers.convNumtoStr(bet.wager) + ' ' + worldStore.state.coin_type
                  ),
                  // Target
                  el.td({className: 'text-right hidden-xs',style: {fontFamily: 'monospace'}},
                    bet.kind
                  ),
                  // Visual
                  el.td({style: {fontFamily: 'monospace'}},
                    (bet.profit > 0) ? ((bet.profit+bet.wager)/bet.wager).toFixed(0) + 'X' : (bet.profit == 0) ? '1X' : '0X'
                  ),
                  // Profit
                  el.td( {style: {color: bet.profit > 0 ? 'green' : 'red',paddingLeft: '50px'}},
                    bet.profit > 0 ? '+' + helpers.convNumtoStr(bet.profit):helpers.convNumtoStr(bet.profit),
                    ' ' + worldStore.state.coin_type
                  )
                );
                break;
              case 'BITCLIMBER':
              return el.tr({key: bet.id},
                // bet id
                el.td(null,
                  el.a({href: config.mp_browser_uri + '/bets/' + bet.id,
                      target: '_blank'
                    },
                    bet.id
                  )
                ),
                // Time
                el.td({className:'hidden-xs'},
                  helpers.formatDateToTime(bet.created_at)
                ),
                // User
                el.td(null,
                  el.a({
                      href: config.mp_browser_uri + '/users/' + bet.uname,
                      target: '_blank'
                    },
                    bet.uname
                  )
                ),
                // Wager
                el.td(null,
                  helpers.convNumtoStr(bet.wager) + ' ' + worldStore.state.coin_type
                ),
                // Target
                el.td({className: 'text-right hidden-xs',style: {fontFamily: 'monospace'}},
                  bet.kind
                ),
                // Visual
                el.td({style: {fontFamily: 'monospace'}},
                  bet.outcome + 'X'
                ),
                // Profit
                el.td( {style: {color: bet.profit > 0 ? 'green' : 'red',paddingLeft: '50px'}},
                  bet.profit > 0 ? '+' + helpers.convNumtoStr(bet.profit):helpers.convNumtoStr(bet.profit),
                  ' ' + worldStore.state.coin_type
                )
              );
                break;
              case 'SLIDERS':
                return el.tr({key: bet.id},
                  // bet id
                  el.td(null,
                    el.a({href: config.mp_browser_uri + '/bets/' + bet.id,
                        target: '_blank'
                      },
                      bet.id
                    )
                  ),
                  // Time
                  el.td({className:'hidden-xs'},
                    helpers.formatDateToTime(bet.created_at)
                  ),
                  // User
                  el.td(null,
                    el.a({
                        href: config.mp_browser_uri + '/users/' + bet.uname,
                        target: '_blank'
                      },
                      bet.uname
                    )
                  ),
                  // Wager
                  el.td(null,
                    helpers.convNumtoStr(bet.wager) + ' ' + worldStore.state.coin_type
                  ),
                  // Target
                  el.td({className: 'text-right hidden-xs',style: {fontFamily: 'monospace'}},
                    bet.kind
                  ),
                  // Visual
                  el.td({style: {fontFamily: 'monospace'}},
                    // progress bar container
                    el.div({className: 'progress',
                            style: {
                              minWidth: '100px',
                              position: 'relative',
                              marginBottom: 0,
                              height: '10px'
                            }
                      },
                      el.div({className: 'progress-bar progress-bar-dark',
                              style: {
                                //float: 'left',
                                width: (bet.target.start).toString() + '%'
                              }
                            }
                      ),
                      el.div({className: 'progress-bar ' + (bet.profit >= 0 ? 'progress-bar-success' : 'progress-bar-grey') ,
                              style: {
                                //float: 'left',
                                width: (bet.target.end - bet.target.start).toString() + '%'
                              }
                            }
                      ),
                      el.div({className: 'progress-bar progress-bar-dark',
                              style: {
                                //float: 'left',
                                width: bet.target.start2 ? (bet.target.start2 - bet.target.end).toString() + '%' : (100- bet.target.end).toString() + '%'
                              }
                            }
                      ),
                      bet.target.start2 ? el.div({className: 'progress-bar ' + (bet.profit >= 0 ? 'progress-bar-success' : 'progress-bar-grey') ,
                              style: {
                                //float: 'left',
                                width: (bet.target.end2 - bet.target.start2).toString() + '%'
                              }
                            }
                      ) : '',
                     bet.target.start2 ?  el.div({className: 'progress-bar progress-bar-dark',
                              style: {
                                //float: 'left',
                                width: (100- bet.target.end2).toString() + '%'
                              }
                            }
                      ) : '',
                      el.div({style: {position: 'absolute',
                                      left: 0,
                                      top: 0,
                                      width: bet.outcome.toString() + '%',
                                      borderRight: '3px solid #333',
                                      height: '100%'
                                  }
                              }
                      )
                    ),
                    // arrow container
                    el.div({style:{ position: 'relative',
                                    width: '100%',
                                    height: '15px'
                                  }
                          },
                        // arrow
                        el.div({style: {position: 'absolute',
                                        top: 0,
                                        left: (bet.outcome - 1).toString() + '%'
                                      }
                              },
                            el.div({style: {width: '5em',marginLeft: '-10px'}},
                              el.span({style: {fontFamily: 'monospace'}},
                                bet.outcome
                              )
                            )
                        )
                    )
                  ),
                  // Profit
                  el.td( {style: {color: bet.profit > 0 ? 'green' : 'red',paddingLeft: '50px'}},
                    bet.profit > 0 ? '+' + helpers.convNumtoStr(bet.profit):helpers.convNumtoStr(bet.profit),
                    ' ' + worldStore.state.coin_type
                  )
                );
                break;
            }//END SWITCH

          }).reverse()
        )
      )
    );
  }
});

////////////////////////////////////////////////////////////////////////////////

function rand(min, max, num) {
          var rtn = [];
          while (rtn.length < num) {
            rtn.push((Math.random() * (max - min)) + min);
          }
          return rtn;
  }

function basefill(num) {
            var rtn = [];
            rtn.push(0);
            while (rtn.length < num) {
              rtn.push(100);
            }
            return rtn;
  }

function labelfill(num){
     var rtn = [];
     while (rtn.length < num){
       rtn.push(' ');
     }
     return rtn;
   }


function getuserbets(num){
  var runningprofit = worldStore.state.user.betted_profit;
  var add;
  var rtn = [];

  //list_user_bets
  var params = {
    uname: worldStore.state.user.uname
  }
  socket.emit('list_user_bets', params, function(err, bets) {
    if (err) {
      console.log('Error list_user_bets:', err);
      return;
    }
    console.log('Successfully loaded list_user_bets:', bets);
    var betsreversed = bets;
    console.log('[Loaded bets for chart]:', bets);
    for (add = 0; add < num; add++)
      {
        if (bets[add]){
          runningprofit = runningprofit - bets[add].profit;
        }else{break;}
      }
    for (add = 0; add < num; add++)
      {
        if (betsreversed[add]){
          runningprofit += betsreversed[add].profit;
          rtn.push(helpers.convSatstoCointype(runningprofit));
        }else{break;}
      }
    Dispatcher.sendAction('UPDATE_HISTORY');
  });

  return rtn;
  }

  var data1 = {
      labels: labelfill(50),//labelfill(config.bet_buffer_size),//['a','b','c','d'],
      datasets: [ {
              label: "dataset1",
              fillColor: "rgba(220,220,220,0.2)",
              strokeColor: "rgba(119,179,0, 0.8)",//"rgba(220,220,220,1)",
              pointColor: "rgba(119,179,0, 0.8)",//"rgba(220,220,220,1)",
              pointStrokeColor: "#fff",
              pointHighlightFill: "#fff",
              pointHighlightStroke: "rgba(220,220,220,1)",
              data: basefill(50)//rand(-32, 1000, 50)
            } ]
  };


var HistoryChart = React.createClass({
  displayName:'HistoryChart',
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    worldStore.on('bet_history_change', this._onStoreChange);
  },
  componentWillUnmount: function() {
    worldStore.off('bet_history_change', this._onStoreChange);
  },

  _onClick: function() {
    //Load profit history
    Dispatcher.sendAction('LOAD_CHART_DATA');
  },
  _onClickLiveToggle: function(){
    Dispatcher.sendAction('LOAD_CHART_DATA');
    Dispatcher.sendAction('TOGGLE_LIVE_CHART');//worldStore.state.LiveGraph
  },

  render: function() {
    console.log('[NewGraph]');
    //check if graph rising
    if (Number(data1.datasets[0].data[data1.datasets[0].data.length - 1]) > Number(data1.datasets[0].data[0]))
      {
      data1.datasets[0].strokeColor = "rgba(119,179,0, 0.8)";
      data1.datasets[0].pointColor = "rgba(119,179,0, 0.8)";
      }else{
        data1.datasets[0].strokeColor = "rgba(153,51,204, 0.8)";
        data1.datasets[0].pointColor = "rgba(153,51,204, 0.8)";
      }

    var props = { data: data1};
    var factory = React.createFactory(Chart.React['Line']);
    var options = {
        options:{
          animation: false,
          pointDot : false,
          pointHitDetectionRadius : 5,
          responsive: true,
          maintainAspectRatio: false,
          height: 75
          }
        };
    var _props = _.defaults({
      data: data1
    },options, props);
    var component = new factory(_props);

    return el.div(null,
              el.div({className:'col-xs-3'},
                el.button(
                    {
                      type: 'button',
                      className: 'btn btn-primary btn-md',
                      onClick: this._onClick
                    },
                    'Graph Last 50 Bets'
                  )
              ),
              el.div({className:'col-xs-3'},
                el.button(
                    {
                      type: 'button',
                      className: 'btn btn-info btn-md',
                      onClick: this._onClickLiveToggle
                    },
                    'Live Graph ',
                    worldStore.state.LiveGraph ?
                      el.span({className: 'label label-success'}, 'ENABLED') :
                      el.span({className: 'label label-default'}, 'DISABLED')
                  )
              ),
              el.div(null,
              component
              )
        );
    }

});


////////////////////////////////////////////////////////////////////////////////////

var MoneypotStats = React.createClass({
  displayName: 'MoneypotStats',
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
            null,
            el.span(
              {className: 'h6', style: { fontWeight: 'bold',marginTop: '-25px' }},
              'Moneypot'
            )
          ),
          el.div(
            {className: 'col-xs-9 well well-sm'},
            el.div(
              {className: 'col-xs-4'},
              el.span(
                {style: { fontWeight: 'bold',marginTop: '-25px' }},
                'Invested: ' + helpers.commafy(helpers.convSatstoCointype(worldStore.state.bankrollbalance).toString()) + ' ' + worldStore.state.coin_type
              )
            ),
            el.div(
              {className: 'col-xs-4'},
              el.span(
                {style: { fontWeight: 'bold',marginTop: '-25px' }},
                'Wagered: ' + helpers.commafy(helpers.convSatstoCointype(worldStore.state.bankrollwagered).toString()) + ' ' + worldStore.state.coin_type
              )
            ),
            el.div(
              {className: 'col-xs-4'},
              el.span(
                {style: { fontWeight: 'bold',marginTop: '-25px' }},
                'Profit: ' + helpers.commafy(helpers.convSatstoCointype((worldStore.state.bankrollbalance-worldStore.state.bankrollinvested)).toString()) + ' ' + worldStore.state.coin_type
              )
            )
          )
    );

  }
});

var UserStatsDisplay = React.createClass({
  displayName: 'UserStatsDisplay',
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    worldStore.on('change', this._onStoreChange);
    worldStore.on('new_user_bet', this._onStoreChange);
  },
  componentWillUnmount: function() {
    worldStore.off('change', this._onStoreChange);
    worldStore.off('new_user_bet', this._onStoreChange);
  },

  render: function() {

    return el.div(
          null,
          el.div(
            null,
            el.span(
              {className: 'h6', style: { fontWeight: 'bold',marginTop: '-25px' }},
              'Stats For: ',// + worldStore.state.user.uname
              el.span(null,
                  el.a(
                  {
                    href: config.mp_browser_uri + '/users/' + worldStore.state.user.uname,
                    target: '_blank'
                  },
                  worldStore.state.user.uname
                )
              )
            )
          ),
          el.div(
            {className: 'col-xs-9 well well-sm'},
            el.div({className: 'row'},
              el.div(
                {className: 'col-xs-4'},
                el.span(
                  {style: { fontWeight: 'bold',marginTop: '-25px' }},
                  'Bets: ' + worldStore.state.user.betted_count//worldStore.state.userbetcount//worldStore.state.user.betted_count
                )
              ),
              el.div(
                {className: 'col-xs-4'},
                el.span(
                  {style: { fontWeight: 'bold',marginTop: '-25px' }},
                  'Wagered: ' + helpers.commafy(helpers.convSatstoCointype(worldStore.state.user.betted_wager).toString()) + ' ' + worldStore.state.coin_type
                )
              ),
              el.div(
                {className: 'col-xs-4'},
                el.span(
                  {style: { fontWeight: 'bold',marginTop: '-25px' }},
                  'Profit: ' + helpers.commafy(helpers.convSatstoCointype(worldStore.state.user.betted_profit).toString()) + ' ' + worldStore.state.coin_type
                )
              )
            ),
            el.div({className:'row'},
              el.div({className:'col-xs-4'},
                el.span(
                  {style: { fontWeight: 'bold',marginTop: '-25px' }},
                  'Largest Win: ',
                  el.a(
                    {
                      href: config.mp_browser_uri + '/bets/' + worldStore.state.user.largestwin.id,
                      target: '_blank'
                    },
                    worldStore.state.user.largestwin.id
                  )
                )
              ),
              el.div({className:'col-xs-4'},
                el.span(
                  {style: { fontWeight: 'bold',marginTop: '-25px' }},
                  'Profit: ' + helpers.commafy(helpers.convSatstoCointype(worldStore.state.user.largestwin.amt).toString()) + ' ' + worldStore.state.coin_type//worldStore.state.userbetcount//worldStore.state.user.betted_count
                )
              ),
              el.div({className:'col-xs-4'},
                el.span(
                  {style: { fontWeight: 'bold',marginTop: '-25px' }},
                  'Game: ' + worldStore.state.user.largestwin.game
                )
              )
            ),
            el.div({className:'row'},
              el.div({className:'col-xs-4'},
                el.span(
                  {style: { fontWeight: 'bold',marginTop: '-25px' }},
                  'Largest Loss: ',
                  el.a(
                    {
                      href: config.mp_browser_uri + '/bets/' + worldStore.state.user.largestloss.id,
                      target: '_blank'
                    },
                    worldStore.state.user.largestloss.id
                  )
                )
              ),
              el.div({className:'col-xs-4'},
                el.span(
                  {style: { fontWeight: 'bold',marginTop: '-25px' }},
                  'Loss: ' + helpers.commafy(helpers.convSatstoCointype(worldStore.state.user.largestloss.amt).toString()) + ' ' + worldStore.state.coin_type//worldStore.state.userbetcount//worldStore.state.user.betted_count
                )
              ),
              el.div({className:'col-xs-4'},
                el.span(
                  {style: { fontWeight: 'bold',marginTop: '-25px' }},
                  'Game: ' + worldStore.state.user.largestloss.game
                )
              )
            ),
            el.div(null,
              el.div(
                {className:'well well-sm col-xs-12'},
                el.div({className:'row'},
                  el.div({className:'col-xs-4 col-sm-2'},'Dice Bets: ' + worldStore.state.dicestats.bets.toString()),
                  el.div({className:'col-xs-4 col-sm-2'},'Wins: ' + worldStore.state.dicestats.wins.toString()),
                  el.div({className:'col-xs-4 col-sm-2'},'Losses: ' + worldStore.state.dicestats.loss.toString()),
                  el.div({className:'col-xs-6 col-sm-3'},'Wagered: ' + helpers.convNumtoStr(worldStore.state.dicestats.wager) + worldStore.state.coin_type),
                  el.div({className:'col-xs-6 col-sm-3'},'Profit: ' + helpers.convNumtoStr(worldStore.state.dicestats.profit) + worldStore.state.coin_type)//,
                //el.span({className:'glyphicon glyphicon-refresh'})
                  )
              ),
              el.div(
                {className:'well well-sm col-xs-12', style:{marginTop:'-15px'}},
                el.div({className:'row'},
                  el.div({className:'col-xs-4 col-sm-2'},'Plinko Bets: ' + worldStore.state.plinkostats.bets.toString()),
                  el.div({className:'col-xs-4 col-sm-2'},'Wins: ' + worldStore.state.plinkostats.wins.toString()),
                  el.div({className:'col-xs-4 col-sm-2'},'Losses: ' + worldStore.state.plinkostats.loss.toString()),
                  el.div({className:'col-xs-6 col-sm-3'},'Wagered: ' + helpers.convNumtoStr(worldStore.state.plinkostats.wager) + worldStore.state.coin_type),
                  el.div({className:'col-xs-6 col-sm-3'},'Profit: ' + helpers.convNumtoStr(worldStore.state.plinkostats.profit) + worldStore.state.coin_type)//,
                //el.span({className:'glyphicon glyphicon-refresh'})
                  )
              ),
              el.div(
                {className:'well well-sm col-xs-12', style:{marginTop:'-15px'}},
                el.div({className:'row'},
                  el.div({className:'col-xs-4 col-sm-2'},'Roulette Bets: ' + worldStore.state.Roulettestats.bets.toString()),
                  el.div({className:'col-xs-4 col-sm-2'},'Wins: ' + worldStore.state.Roulettestats.wins.toString()),
                  el.div({className:'col-xs-4 col-sm-2'},'Losses: ' + worldStore.state.Roulettestats.loss.toString()),
                  el.div({className:'col-xs-6 col-sm-3'},'Wagered: ' + helpers.convNumtoStr(worldStore.state.Roulettestats.wager) + worldStore.state.coin_type),
                  el.div({className:'col-xs-6 col-sm-3'},'Profit: ' + helpers.convNumtoStr(worldStore.state.Roulettestats.profit) + worldStore.state.coin_type)//,
                //el.span({className:'glyphicon glyphicon-refresh'})
                  )
                ),
                el.div(
                  {className:'well well-sm col-xs-12', style:{marginTop:'-15px'}},
                  el.div({className:'row'},
                    el.div({className:'col-xs-4 col-sm-2'},'BitSweep Bets: ' + worldStore.state.bitsweepstats.bets.toString()),
                    el.div({className:'col-xs-4 col-sm-2'},'Wins: ' + worldStore.state.bitsweepstats.wins.toString()),
                    el.div({className:'col-xs-4 col-sm-2'},'Losses: ' + worldStore.state.bitsweepstats.loss.toString()),
                    el.div({className:'col-xs-6 col-sm-3'},'Wagered: ' + helpers.convNumtoStr(worldStore.state.bitsweepstats.wager) + worldStore.state.coin_type),
                    el.div({className:'col-xs-6 col-sm-3'},'Profit: ' + helpers.convNumtoStr(worldStore.state.bitsweepstats.profit) + worldStore.state.coin_type)//,
                  //el.span({className:'glyphicon glyphicon-refresh'})
                    )
                  ),
                  el.div(
                    {className:'well well-sm col-xs-12', style:{marginTop:'-15px'}},
                    el.div({className:'row'},
                      el.div({className:'col-xs-4 col-sm-2'},'Slots Bets: ' + worldStore.state.slotsstats.bets.toString()),
                      el.div({className:'col-xs-4 col-sm-2'},'Wins: ' + worldStore.state.slotsstats.wins.toString()),
                      el.div({className:'col-xs-4 col-sm-2'},'Losses: ' + worldStore.state.slotsstats.loss.toString()),
                      el.div({className:'col-xs-6 col-sm-3'},'Wagered: ' + helpers.convNumtoStr(worldStore.state.slotsstats.wager) + worldStore.state.coin_type),
                      el.div({className:'col-xs-6 col-sm-3'},'Profit: ' + helpers.convNumtoStr(worldStore.state.slotsstats.profit) + worldStore.state.coin_type)//,
                    //el.span({className:'glyphicon glyphicon-refresh'})
                      )
                  ),
                  el.div(
                    {className:'well well-sm col-xs-12', style:{marginTop:'-15px'}},
                    el.div({className:'row'},
                      el.div({className:'col-xs-4 col-sm-2'},'BitClimber Bets: ' + worldStore.state.BitClimberstats.bets.toString()),
                      el.div({className:'col-xs-4 col-sm-2'},'Wins: ' + worldStore.state.BitClimberstats.wins.toString()),
                      el.div({className:'col-xs-4 col-sm-2'},'Losses: ' + worldStore.state.BitClimberstats.loss.toString()),
                      el.div({className:'col-xs-6 col-sm-3'},'Wagered: ' + helpers.convNumtoStr(worldStore.state.BitClimberstats.wager) + worldStore.state.coin_type),
                      el.div({className:'col-xs-6 col-sm-3'},'Profit: ' + helpers.convNumtoStr(worldStore.state.BitClimberstats.profit) + worldStore.state.coin_type)//,
                    //el.span({className:'glyphicon glyphicon-refresh'})
                      )
                  ),
                  el.div(
                    {className:'well well-sm col-xs-12', style:{marginTop:'-15px'}},
                    el.div({className:'row'},
                      el.div({className:'col-xs-4 col-sm-2'},'Sliders Bets: ' + worldStore.state.Slidersstats.bets.toString()),
                      el.div({className:'col-xs-4 col-sm-2'},'Wins: ' + worldStore.state.Slidersstats.wins.toString()),
                      el.div({className:'col-xs-4 col-sm-2'},'Losses: ' + worldStore.state.Slidersstats.loss.toString()),
                      el.div({className:'col-xs-6 col-sm-3'},'Wagered: ' + helpers.convNumtoStr(worldStore.state.Slidersstats.wager) + worldStore.state.coin_type),
                      el.div({className:'col-xs-6 col-sm-3'},'Profit: ' + helpers.convNumtoStr(worldStore.state.Slidersstats.profit) + worldStore.state.coin_type)//,
                    //el.span({className:'glyphicon glyphicon-refresh'})
                      )
                  )
            )

          )
    );

  }
});

////////////////////////////////////////////////////////////////////////////////////
var StatsTabContent = React.createClass({
  displayName: 'StatsTabContent',
  _onRefreshStat: function() {
    Dispatcher.sendAction('UPDATE_BANKROLL');
    //Dispatcher.sendAction('UPDATE_USERSTATS');
    Dispatcher.sendAction('START_REFRESHING_USER');
    Dispatcher.sendAction('LOAD_CHART_DATA');
  },
  render: function() {
    return el.div(
      null,
      el.div(
      {className: 'panel panel-default'},
      el.div(
        {className:'panel-heading'},
        el.span(
          {className: 'h6'},
          'Statistics:'
        ),
        el.button(
          {
            className: 'btn btn-link',
            title: 'Refresh Stats',
            onClick: this._onRefreshStat
          },
          el.span(
            {className: 'glyphicon glyphicon-refresh'}
          )
        )
      ),
      el.div(
        {className: 'panel-body'},
        React.createElement(MoneypotStats, null),
        /////////////////////////////////////
        el.div(
          {className: 'row'},
          el.div(
            {className: 'col-xs-12',style: {marginTop: '-15px'}},
            el.hr(null)
          )
        ),
        /////////////////////////////////////
        React.createElement(UserStatsDisplay, null),
        /////////////////////////////////////////////////////
        el.div(
          {className: 'row'},
          el.div(
            {className: 'col-xs-12',style: {marginTop: '-15px'}},
            el.hr(null)
          )
        ),
        el.div( // FOR graph
          null, //{className: 'col-xs-12'},
          React.createElement(HistoryChart, null)
        )
        /////////////////////////////////////////////////////
      )
    )
  );
  }
});
//////////////////////////////////////////////////////
var provably_fair_box = React.createClass({
displayName: 'provably_fair_box',
_onStoreChange: function() {
  this.forceUpdate();
},
componentDidMount: function() {
  betStore.on('lastfair_change', this._onStoreChange);
},
componentWillUnmount: function() {
  betStore.off('lastfair_change', this._onStoreChange);
},

_onEnterHash: function(e) {
  var str = e.target.value;
  Dispatcher.sendAction('UPDATE_LAST_HASH', str);
},
_onEnterSalt: function(e) {
  var str = e.target.value;
  Dispatcher.sendAction('UPDATE_LAST_SALT', str);
},
_onEnterSecret: function(e) {
  var str = e.target.value;
  Dispatcher.sendAction('UPDATE_LAST_SECRET', str);
},
_onEnterSeed: function(e) {
  var str = e.target.value;
  Dispatcher.sendAction('UPDATE_LAST_SEED', str);
},

_CalcRawOut: function() {
  Dispatcher.sendAction('CALC_RAW_OUTCOME');
},
render: function() {
  return el.div(
    null,
    el.div({className:'h6'},'Provably Fair Calculator:'),
    el.div({className:'panel panel-default col-xs-12'},
      el.div({className: 'lead'},'Next Bet Hash: ',
        el.span({className: 'text', style:{fontWeight:'bold'}},betStore.state.nextHash ? betStore.state.nextHash : ' ')
        //betStore.state.lastid = id;
      ),
      el.div({className: 'lead',style:{ marginTop: '-10px'}},'Last Bet Hash: ',
        el.span(null, el.code(null,'SHA256(SECRET+SALT)'))
      ),
      el.div({className: 'form-group col-xs-12',style:{ marginTop: '-10px'}},
            el.span({className: 'input-group input-group-sm col-xs-12 col-md-8 col-lg-6'},
              el.input(
                {
                  value: betStore.state.lastHash,
                  type: 'text',
                  className: 'form-control input-sm',
                  style:{ fontWeight: 'bold'},
                  onChange: this._onEnterHash,
              //    disabled: !!worldStore.state.isLoading,
                  placeholder: 'hash'
                }
              ),
              betStore.state.lastHash ? el.span({className: 'input-group-addon'},
                CryptoJS.SHA256(betStore.state.lastSecret + '|' + betStore.state.lastSalt).toString() === betStore.state.lastHash ?
                  el.span({className: 'glyphicon glyphicon-ok',style: {color:'green'}}) : el.span({className: 'glyphicon glyphicon-remove',style: {color:'red'}})
                ) : ' '
            )
      ),
      el.div({className: 'lead',style:{ marginTop: '-10px'}},'Last Bet Salt:'),
      el.div({className: 'form-group col-xs-12',style:{ marginTop: '-10px'}},
            el.span({className: 'input-group input-group-sm col-xs-12 col-md-8 col-lg-6'},
              el.input(
                {
                  value: betStore.state.lastSalt,
                  type: 'text',
                  className: 'form-control input-sm',
                  style:{ fontWeight: 'bold'},
                  onChange: this._onEnterSalt,
              //    disabled: !!worldStore.state.isLoading,
                  placeholder: 'salt'
                }
              )
            )
      ),
      el.div({className: 'lead',style:{ marginTop: '-10px'}},'Last Bet Secret:'),
      el.div({className: 'form-group col-xs-12',style:{ marginTop: '-10px'}},
            el.span({className: 'input-group input-group-sm col-xs-12 col-md-8 col-lg-6'},
              el.input(
                {
                  value: betStore.state.lastSecret,
                  type: 'text',
                  className: 'form-control input-sm',
                  style:{ fontWeight: 'bold'},
                  onChange: this._onEnterSecret,
              //    disabled: !!worldStore.state.isLoading,
                  placeholder: 'secret'
                }
              )
            )
      ),
      el.div({className: 'lead',style:{ marginTop: '-10px'}},'Last Bet Client Seed:'),
      el.div({className: 'form-group col-xs-12',style:{ marginTop: '-10px'}},
            el.span({className: 'input-group input-group-sm col-xs-12 col-md-8 col-lg-6'},
              el.input(
                {
                  value: betStore.state.lastSeed,
                  type: 'text',
                  className: 'form-control input-sm',
                  style:{ fontWeight: 'bold'},
                  onChange: this._onEnterSeed,
              //    disabled: !!worldStore.state.isLoading,
                  placeholder: 'seed'
                }
              )
            )
      ),
      //final_outcome = (outcome + client_seed) % 4294967296
      el.div({className:'col-xs-12 col-md-8 col-lg-6'},
        el.button(
          { id: 'RT-CLEAR',
            type: 'button',
            className: 'btn btn-primary btn-md',
            style: { fontWeight: 'bold'},
            onClick: this._CalcRawOut
            //disabled: !!this.state.waitingForServer
           },
           'Calculate Raw Outcome'
        ),
        el.span(null,
          el.code(null,'(Secret + Client_Seed) % 2^32')
        )
      ),
      el.div({className: 'form-group col-xs-12'},
            el.span({className: 'input-group input-group-sm col-xs-12 col-md-8 col-lg-6'},
              el.input(
                {
                  value: betStore.state.raw_outcome,
                  type: 'text',
                  className: 'form-control input-sm',
                  style:{ fontWeight: 'bold'},
                  onChange: null,//this._onFilterUserChange,
              //    disabled: !!worldStore.state.isLoading,
                  placeholder: 'Raw Outcome'
                }
              )
            )
      )

    )
  );
}

});



var HelpTabContent = React.createClass({
  displayName: 'HelpTabContent',
   render: function() {

     return el.div(
       null,
       el.div(
         {className:'panel panel-primary'},
         el.div(
           {className:'panel-body'},
           el.div(
           {className: 'h4 text-center'},
           'Welcome To Bit-Exo'
           ),
            el.div(
              {className:'col-xs-12'},
              el.span({className: 'h6 text-left'},'Legal Disclaimer:'),
              el.div({className:'well well-sm col-xs-12'},
              el.p(null, 'Please ensure that gambling is legal in your jurisdiction, Bit-Exo is an Online Gaming site and may not be legal in all places. It is your responsibility to know your local laws.  By using this site you agree that it is legal to do so where you are.  Site bankrolls, user deposits/balances and bets are handled by the gaming company MoneyPot')
                )//end well
              ),
            el.div(
              {className:'col-xs-12'},
              el.span({className: 'h6 text-left'},'How do I play?'),
              el.div({className:'well well-sm col-xs-12'},
              el.p(null, 'After you have funded your Bit-Exo app you can then change the wager amount and the multiplier to an amount of your choosing.  By pressing Bet High or Bet Low you initiate the betting sequence.  The result is shown below under the All Bets tab and under the My Bets Tab.  If you wish you can change the seed to a custom number from 0-4294967295 or enable it to make a random seed for each bet.')
                )//end well
              ),
            el.div(
              {className:'col-xs-12'},
              el.span({className: 'h6 text-left'},'How do I fund my account?'),
              el.div({className:'well well-sm col-xs-12'},
              el.p(null, 'In order to play you will need a balance.  You can use the free faucet to try out some bets for free or you can fund your MoneyPot account.  You will need to sign-up for a free account with MoneyPot in order to play here.  After you have created an account you add the Bit-Exo casino app to you MoneyPot account.  There are two methods available to add funds at this point.  The more direct way is to deposit directly to your Bit-Exo account by clicking the deposit button at the top of the page and using the deposit address located there. The second is under your MoneyPot account page, you can find the deposit button to generate a new BTC deposit address.    Once your account is funded you can click on deposit from inside the app to bring coins over to play with.  Deposits are available to you after 1 confirmation.')
                )//end well
              ),
            el.div(
              {className:'col-xs-12'},
              el.span({className: 'h6 text-left'},'Can I play for free?'),
              el.div({className:'well well-sm col-xs-12'},
              el.p(null, 'Yes.  There is a free faucet available and can be used every 5 minutes to add a small amount of free coins to you account to play with.')
                )//end well
              ),
            el.div(
              {className:'col-xs-12'},
              el.span({className: 'h6 text-left'},'What if I can not stop?'),
              el.div({className:'well well-sm col-xs-12'},
              el.p(null, 'If you have a problem gambling there are various services available.  Please see ',
              el.span(null,
                  el.a(
                      {
                        href: 'http://www.gamblinghelp.org',
                        target: '_blank'
                      },'gamblinghelp.org'),
              el.span(null, ', ',
              el.span(null,
                  el.a(
                      {
                        href: 'http://www.ncpgambling.org',
                        target: '_blank'
                      },'ncpgambling.org'),
               el.span(null, ' and ',
               el.span(null,
                   el.a(
                       {
                         href: 'http://www.helpguide.org',
                         target: '_blank'
                       },'helpguide.org'),
               el.span(null, ' or search google for many more.  Remember you can lose when playing and only risk what you are willing to lose. Bit-Exo is not responsible for mistaken bets or funds lost with MoneyPot.'
             )))))))
                )//end well
              ),//LEVEL 0 < 0.01
                    //LEVEL 1 < 0.05
                    //LEVEL 2 < 0.1
                    //LEVEL 3 < 0.5
                    //LEVEL 4 < 1
                    //LEVEL 5 < 5
                    //LEVEL 6 < 50
                    //LEVEL 7 < 100
                    //LEVEL 8 < 500
                    //LEVEL 9 < 1000
            el.div(
              {className:'col-xs-12'},
              el.span({className: 'h6 text-left'},'Tipping users:'),
              el.div({className:'well well-sm col-xs-12'},
              el.p(null, 'If you wish to help someone out you can tip other users within Bit-Exo without having to withdraw your coins to Moneypot first.  Simply type /tip [username] [amount] [coin] (ex. /tip J_ROC 1000 BITS or /tip J_ROC 0.001 BTC) and the coins will be transferred instantly.  If the receiver wishes to see his balance update immediately they will have to click on the refresh balance button on top otherwise it will update automatically after 10 seconds. Optionally you may add "private" to the end of the tip and the tip will be sent silently in chat.  Please use caution when tipping users and do not loan coins to those you do not trust.'),
              el.p(null,'If you wish to help everyone out, you can Make it Rain!  Just type /rain amount type(eg. /rain 1000 bits) and the bot will tip all qualified users in chat with a share of the amount you sent.'),
              el.p(null,'Another option would be to /tip chatbot. Once this bot has received 1000 or more bits it will start a round of Chatlotto, picking active users at random for quizes with prizes'),
              el.p(null,'Rains are intended to reward active users on the site. In order to qualify for rain, you must be level 1 or higher, wager at least 1000 bits during the last 24 hours and must be active in chat during the last 300 chat messages.'),
              el.p(null,'User Levels are advanced by wagering.  The different levels are: '),
              el.p(null,'Level 0: 0 - 0.01 BTC'),
              el.p(null,'Level 1: 0.01 - 0.05 BTC'),
              el.p(null,'Level 2: 0.05 - 0.1 BTC'),
              el.p(null,'Level 3: 0.1 - 0.5 BTC'),
              el.p(null,'Level 4: 0.5 - 1.0 BTC'),
              el.p(null,'Level 5: 1.0 - 5.0 BTC'),
              el.p(null,'Level 6: 5.0 - 50.0 BTC'),
              el.p(null,'Level 7: 50.0 -100.0  BTC'),
              el.p(null,'Level 8: 100.0 - 500.0 BTC'),
              el.p(null,'Level 9: 500.0 - 1000.0 BTC'),
              el.p(null,'Level 10: Over 1000.0 BTC'),
              el.p(null,'Levels are shown in chat with stars. An empty star is equal to 1 level and a full star is equal to 2 levels. So for example a user of level 3 would show 1 full and 1 empty star'),
              el.p(null,'What are levels used for?'),
              el.p(null,'For catching rain you must be level 1 or higher'),
              el.p(null,'In order to post links on the site you must be level 2 or higher'),
              el.p(null,'Chatlotto will only pick active users of level 2 or higher')
              )//end well
            ),
            el.div(
              {className:'col-xs-12'},
              el.span({className: 'h6 text-left'},'Provable Fairness:'),
              el.div({className:'well well-sm col-xs-12'},
              el.p(null, 'Bets made are all provably fair.  How does this work? Before each bet is made a hash is generated by MoneyPot and is sent to the site, this is then combined with the bet+seed and sent back to the MoneyPot bet API and the result is then returned, win or lose to the casino.  A script on the casino verifies each bet to ensure that all bets are provably fair.'),
              React.createElement(provably_fair_box,null)
              ) //end well
            ),
            el.div(
              {className:'col-xs-12'},
              el.span({className: 'h6 text-left'},'Contact Info:'),
              el.div({className:'well well-sm col-xs-12'},
              el.p(null, 'If you need to get a hold of the site admins you can email us at:'),
              el.p(null, 'support@fallenangel3k.github.io or admin@fallenangel3k.github.io'),
              el.p(null, 'You can also leave us a message on our ',
                el.span(null,
                  el.a(
                      {
                        href: 'https://bitcointalk.org/index.php?topic=1359320.0',
                        target: '_blank'
                      },'thread'),
                      ' or joins us on ',
                      el.a(
                        {
                          href: 'https://discord.gg/011aeZCV0elmAnSOT',
                          target: '_blank'
                        },
                        'Discord'
                      )
                    ))
              ) //end well
            )
         )//end panel-body
       )
     );
   }
});

var JackpotTabContent = React.createClass({
  displayName: 'JackpotTabContent',
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    worldStore.on('app_info_update', this._onStoreChange);
  },
  componentWillUnmount: function() {
    worldStore.off('app_info_update', this._onStoreChange);
  },
   render: function() {
     var jackpotsize1;
     var jackpotsize2;
     if (worldStore.state.jackpotlist.lowwins.data[worldStore.state.jackpotlist.lowwins.end] != null){
        jackpotsize1 = (worldStore.state.currentAppwager - worldStore.state.jackpotlist.highwins.data[worldStore.state.jackpotlist.highwins.end].sitewager) * 0.00045;
        jackpotsize2 = (worldStore.state.currentAppwager - worldStore.state.jackpotlist.lowwins.data[worldStore.state.jackpotlist.lowwins.end].sitewager) * 0.00045;
      }else{
        jackpotsize1 = (worldStore.state.currentAppwager - (worldStore.state.currentAppwager - 2000000000)) * 0.00045;;
        jackpotsize2 = jackpotsize1;
      }
     return el.div(
       {id:'jp_tab'},
       el.div({className:'panel panel-default'},
        el.div({className:'panel-body'},
          el.div({className:'well well-sm col-xs-12'},
            el.div({className: 'text-center h6'},'Jackpot 1 Size: ',
              el.span(null,
                helpers.commafy(helpers.convSatstoCointype(jackpotsize1).toString()) + ' ' + worldStore.state.coin_type
              )
            ),
            el.div({className: 'text-center h6'},'Jackpot 2 Size: ',
              el.span(null,
                helpers.commafy(helpers.convSatstoCointype(jackpotsize2).toString()) + ' ' + worldStore.state.coin_type
              )
            )
          ),
          el.div({className:'well well-sm col-xs-12'},
            el.div({className: 'text-center'},
              el.span({className: 'text-center h5', style:{fontWeight:'bold'}}, 'Previous Winners Jackpot 1'),
              el.table(
                {className: 'table text-left text-small', style: {fontWeight:'normal',marginTop:'5px'}},
                el.thead(
                  null,
                  el.tr(
                    null,
                    el.th(null, 'Date'),
                    el.th(null, 'User'),
                    el.th(null, 'Game'),
                    el.th(null, 'Prize'),
                    el.th(null, 'ID')
                  )
                ),
                el.tbody(
                  null,
                  worldStore.state.jackpotlist.highwins.toArray().map(function(list) {
                    return el.tr(
                     { key: list.id},
                       // Time
                       el.td(
                         null,
                         list.created_at.substring(0,10)
                       ),
                       // User
                       el.td(
                         null,
                         el.a(
                           {
                             href: config.mp_browser_uri + '/users/' + list.uname,
                             target: '_blank'
                           },
                           list.uname
                         )
                       ),
                       // Game
                       el.td(
                         null,
                         list.kind
                       ),
                       // Prize
                       el.td(
                         null,
                         helpers.convNumtoStr(list.jprofit) + ' ' + worldStore.state.coin_type
                       ),
                      // bet id
                      el.td(
                        null,
                        el.a(
                          {
                            href: config.mp_browser_uri + '/bets/' + list.id,
                            target: '_blank'
                          },
                          list.id
                        )
                      )
                    );
                  }).reverse()
                )
              )

            ),
            el.div({className: 'text-center'},
              el.span({className: 'text-center h5', style:{fontWeight:'bold'}}, 'Previous Winners Jackpot 2'),
                el.table(
                  {className: 'table text-left text-small', style: {fontWeight:'normal',marginTop:'5px'}},
                  el.thead(
                    null,
                    el.tr(
                      null,
                      el.th(null, 'Date'),
                      el.th(null, 'User'),
                      el.th(null, 'Game'),
                      el.th(null, 'Prize'),
                      el.th(null, 'ID')
                    )
                  ),
                  el.tbody(
                    null,
                    worldStore.state.jackpotlist.lowwins.toArray().map(function(list) {
                      return el.tr(
                       { key: list.id},
                         // Time
                         el.td(
                           null,
                           list.created_at.substring(0,10)
                         ),
                         // User
                         el.td(
                           null,
                           el.a(
                             {
                               href: config.mp_browser_uri + '/users/' + list.uname,
                               target: '_blank'
                             },
                             list.uname
                           )
                         ),
                         // Game
                         el.td(
                           null,
                           list.kind
                         ),
                         // Prize
                         el.td(
                           null,
                           helpers.convNumtoStr(list.jprofit) + ' ' + worldStore.state.coin_type
                         ),
                        // bet id
                        el.td(
                          null,
                          el.a(
                            {
                              href: config.mp_browser_uri + '/bets/' + list.id,
                              target: '_blank'
                            },
                            list.id
                          )
                        )
                      );
                    }).reverse()
                  )
                )

              )

          ),
          el.div({className:'well well-sm col-xs-12'},
            el.div({className: 'text-center'},
              el.span({className: 'text-center h5', style:{fontWeight:'bold'}}, 'Jackpot Rules'),
              el.p({className:'text-left'},
                'The Jackpots are available to any user betting on our casino and can be won on any game so you can continue to play your favorite game. The Jackpot amounts are progressive based on the sites wager.'
                ),// end P
                el.p({className:'text-left'},
                  'In order to qualify for Jackpot 1 your bets wager must be at least ',
                  el.span(null,
                      helpers.convSatstoCointype(100).toString() + ' ' + worldStore.state.coin_type,
                      el.span(null,
                        '.  The winner is determined by the Raw_Outcome of the wager.  A winning bet is one that the Raw_Outcome is greater than 4294963000 for bets ',
                        el.span(null,
                          helpers.convSatstoCointype(100000).toString() + ' ' + worldStore.state.coin_type,
                          el.span(null,
                            ' and above.  This works out to a chance of 1 in 1 Million Bets.  Bets less than ',
                            el.span(null,
                              helpers.convSatstoCointype(100000).toString() + ' ' + worldStore.state.coin_type,
                              el.span(null,
                                ' and above ',
                                el.span(null,
                                  helpers.convSatstoCointype(100).toString() + ' ' + worldStore.state.coin_type,
                                  el.span(null,
                                    ' can still win the jackpot but the lower your wager the more challenging it becomes with ',
                                    el.span(null,
                                      helpers.convSatstoCointype(1000).toString() + ' ' + worldStore.state.coin_type,
                                      el.span(null,
                                        ' bets having 1% the chance a bet greater than or equal to ',
                                        el.span(null,
                                          helpers.convSatstoCointype(100000).toString() + ' ' + worldStore.state.coin_type,
                                          el.span(null,
                                              ' has. For example a bet of ',
                                              el.span(null,
                                                helpers.convSatstoCointype(1000).toString() + ' ' + worldStore.state.coin_type,
                                                el.span(null,' has to have a Raw_Outcome > 4294967252 in order to win.'
                                              )
                                            )
                                          )
                                        )
                                      )
                                    )
                                  )
                                )
                              )
                            )
                          )
                        )
                       )
                    )

                ),//end p
                el.p({className:'text-left'},
                  'In order to qualify for Jackpot 2 your bets wager must be at least ',
                  el.span(null,
                      helpers.convSatstoCointype(100).toString() + ' ' + worldStore.state.coin_type,
                      el.span(null,
                        '.  The winner is determined by the Raw_Outcome of the wager.  A winning bet is one that the Raw_Outcome is less than 4295 for bets ',
                        el.span(null,
                          helpers.convSatstoCointype(10000).toString() + ' ' + worldStore.state.coin_type,
                          el.span(null,
                            ' and above.  This works out to a chance of 1 in 1 Million Bets.  Bets less than ',
                            el.span(null,
                              helpers.convSatstoCointype(10000).toString() + ' ' + worldStore.state.coin_type,
                              el.span(null,
                                ' and above ',
                                el.span(null,
                                  helpers.convSatstoCointype(100).toString() + ' ' + worldStore.state.coin_type,
                                  el.span(null,
                                    ' can still win the jackpot but the lower your wager the more challenging it becomes with ',
                                    el.span(null,
                                      helpers.convSatstoCointype(100).toString() + ' ' + worldStore.state.coin_type,
                                      el.span(null,
                                        ' bets having 1% the chance a bet greater than or equal to ',
                                        el.span(null,
                                          helpers.convSatstoCointype(10000).toString() + ' ' + worldStore.state.coin_type,
                                          el.span(null,
                                              ' has. For example a bet of ',
                                              el.span(null,
                                                helpers.convSatstoCointype(100).toString() + ' ' + worldStore.state.coin_type,
                                                el.span(null,' has to have a Raw_Outcome < 42.9 in order to win.'
                                              )
                                            )
                                          )
                                        )
                                      )
                                    )
                                  )
                                )
                              )
                            )
                          )
                        )
                       )
                    )

                ),//end p
                el.p({className:'text-left'},
                  'To be fair to those who have wagered 90% of the Jackpot total will go to the winner and 10% will go to the highest wagered user for the day. The winner of each round will be announced in chat and the prizes will be manually transferred within 8 hours.'
                )
            )
          )
        )
       )
     );
   }
 });


 var BiggestTabContent = React.createClass({
   displayName: 'BiggestTabContent',
   _onStoreChange: function() {
     this.forceUpdate();
   },
   componentDidMount: function() {
     worldStore.on('biggest_info_update', this._onStoreChange);
   },
   componentWillUnmount: function() {
     worldStore.off('biggest_info_update', this._onStoreChange);
   },
    render: function() {
      return el.div(
        null,
        el.div({className:'panel panel-default'},
         el.div({className:'panel-body'},

           el.div({className:'well well-sm col-xs-12'},
             el.div({className: 'text-center'},
               el.span({className: 'text-center h5', style:{fontWeight:'bold'}}, 'Biggest Winning Bets'),
               el.table(
                 {className: 'table text-left text-small', style: {fontWeight:'normal',marginTop:'5px'}},
                 el.thead(
                   null,
                   el.tr(
                     null,
                     el.th(null, 'Time'),
                     el.th(null, 'User'),
                     el.th(null, 'Game'),
                     el.th(null, 'Wager'),
                     el.th(null, 'Profit'),
                     el.th(null, 'ID')
                   )
                 ),
                 el.tbody(
                   null,
                   worldStore.state.biggestwins.toArray().map(function(list) {
                     return el.tr(
                      { key: list.id},
                        // Time
                        el.td(
                          null,
                          helpers.formatDateToTime(list.created_at)//list.created_at.substring(0,10)
                        ),
                        // User
                        el.td(
                          null,
                          el.a(
                            {
                              href: config.mp_browser_uri + '/users/' + list.uname,
                              target: '_blank'
                            },
                            list.uname
                          )
                        ),
                        // Game
                        el.td(
                          null,
                          list.kind
                        ),
                        // Profit
                        el.td(
                          null,
                          helpers.convNumtoStr(list.wager) + ' ' + worldStore.state.coin_type
                        ),
                        // Profit
                        el.td(
                          null,
                          helpers.convNumtoStr(list.profit) + ' ' + worldStore.state.coin_type
                        ),
                       // bet id
                       el.td(
                         null,
                         el.a(
                           {
                             href: config.mp_browser_uri + '/bets/' + list.id,
                             target: '_blank'
                           },
                           list.id
                         )
                       )
                     );
                   }).reverse()
                 )
               )

             )
           ),
           el.div({className:'well well-sm col-xs-12'},
             el.div({className: 'text-center'},
               el.span({className: 'text-center h5', style:{fontWeight:'bold'}}, 'Biggest Losing Bets'),
               el.table(
                 {className: 'table text-left text-small', style: {fontWeight:'normal',marginTop:'5px'}},
                 el.thead(
                   null,
                   el.tr(
                     null,
                     el.th(null, 'Time'),
                     el.th(null, 'User'),
                     el.th(null, 'Game'),
                     el.th(null, 'Wager'),
                     el.th(null, 'Loss'),
                     el.th(null, 'ID')
                   )
                 ),
                 el.tbody(
                   null,
                   worldStore.state.biggestlosses.toArray().map(function(list) {
                     return el.tr(
                      { key: list.id},
                        // Time
                        el.td(
                          null,
                          helpers.formatDateToTime(list.created_at)//list.created_at.substring(0,10)
                        ),
                        // User
                        el.td(
                          null,
                          el.a(
                            {
                              href: config.mp_browser_uri + '/users/' + list.uname,
                              target: '_blank'
                            },
                            list.uname
                          )
                        ),
                        // Game
                        el.td(
                          null,
                          list.kind
                        ),
                        // Profit
                        el.td(
                          null,
                          helpers.convNumtoStr(list.wager) + ' ' + worldStore.state.coin_type
                        ),
                        // Profit
                        el.td(
                          null,
                          helpers.convNumtoStr(list.profit) + ' ' + worldStore.state.coin_type
                        ),
                       // bet id
                       el.td(
                         null,
                         el.a(
                           {
                             href: config.mp_browser_uri + '/bets/' + list.id,
                             target: '_blank'
                           },
                           list.id
                         )
                       )
                     );
                   }).reverse()
                 )
               )

             )
           ),
           el.div({className:'well well-sm col-xs-12'},
             el.div({className: 'text-center'},
               el.span({className: 'text-center h5', style:{fontWeight:'bold'}}, 'Biggest Wagered'),
               el.table(
                 {className: 'table text-left text-small', style: {fontWeight:'normal',marginTop:'5px'}},
                 el.thead(
                   null,
                   el.tr(
                     null,
                     el.th(null, 'User'),
                     el.th(null, 'Wagered'),
                     el.th(null, 'Profit')
                   )
                 ),
                 el.tbody(
                   null,
                   worldStore.state.biggestwagered.toArray().map(function(list) {
                     return el.tr(
                      { key: list.uname},
                        // User
                        el.td(
                          null,
                          el.a(
                            {
                              href: config.mp_browser_uri + '/users/' + list.uname,
                              target: '_blank'
                            },
                            list.uname
                          )
                        ),
                        // Wager
                        el.td(
                          null,
                          helpers.convNumtoStr(list.wager) + ' ' + worldStore.state.coin_type
                        ),
                        // Profit
                        el.td(
                          null,
                          helpers.convNumtoStr(list.profit) + ' ' + worldStore.state.coin_type
                        )
                     );
                   }).reverse()
                 )
               )

             )
           ),
           el.div({className:'well well-sm col-xs-12'},
             el.div({className: 'text-center'},
               el.span({className: 'text-center h5', style:{fontWeight:'bold'}}, 'Biggest Jackpot Wins'),
               el.table(
                 {className: 'table text-left text-small', style: {fontWeight:'normal',marginTop:'5px'}},
                 el.thead(
                   null,
                   el.tr(
                     null,
                     el.th(null, 'Date'),
                     el.th(null, 'User'),
                     el.th(null, 'Game'),
                     el.th(null, 'Prize'),
                     el.th(null, 'ID')
                   )
                 ),
                 el.tbody(
                   null,
                   worldStore.state.biggestjackpots.toArray().map(function(list) {
                     return el.tr(
                      { key: list.id},
                        // Time
                        el.td(
                          null,
                          list.created_at.substring(0,10)
                        ),
                        // User
                        el.td(
                          null,
                          el.a(
                            {
                              href: config.mp_browser_uri + '/users/' + list.uname,
                              target: '_blank'
                            },
                            list.uname
                          )
                        ),
                        // Game
                        el.td(
                          null,
                          list.kind
                        ),
                        // Prize
                        el.td(
                          null,
                          helpers.convNumtoStr(list.jprofit) + ' ' + worldStore.state.coin_type
                        ),
                       // bet id
                       el.td(
                         null,
                         el.a(
                           {
                             href: config.mp_browser_uri + '/bets/' + list.id,
                             target: '_blank'
                           },
                           list.id
                         )
                       )
                     );
                   }).reverse()
                 )
               )

             )
           ),
           el.div({className:'well well-sm col-xs-12'},
             el.div({className: 'text-center'},
               el.span({className: 'text-center h5', style:{fontWeight:'bold'}}, 'Biggest Profits All Time'),
               el.table(
                 {className: 'table text-left text-small', style: {fontWeight:'normal',marginTop:'5px'}},
                 el.thead(
                   null,
                   el.tr(
                     null,
                     el.th(null, 'User'),
                     el.th(null, 'Wagered'),
                     el.th(null, 'Profit')
                   )
                 ),
                 el.tbody(
                   null,
                   worldStore.state.biggestprofit.toArray().map(function(list) {
                     return el.tr(
                      { key: list.uname},
                        // User
                        el.td(
                          null,
                          el.a(
                            {
                              href: config.mp_browser_uri + '/users/' + list.uname,
                              target: '_blank'
                            },
                            list.uname
                          )
                        ),
                        // Wager
                        el.td(
                          null,
                          helpers.convNumtoStr(list.wager) + ' ' + worldStore.state.coin_type
                        ),
                        // Profit
                        el.td(
                          null,
                          helpers.convNumtoStr(list.profit) + ' ' + worldStore.state.coin_type
                        )
                     );
                   }).reverse()
                 )
               )

             )
           )
         )
        )
      );
    }
  });


var WeeklyWagerContent = React.createClass({
    displayName: 'BiggestTabContent',
    _onStoreChange: function() {
      this.forceUpdate();
    },
    componentDidMount: function() {
      worldStore.on('change_weekly_wager', this._onStoreChange);
    },
    componentWillUnmount: function() {
      worldStore.off('change_weekly_wager', this._onStoreChange);
    },
     render: function() {
       return el.div(
                null,
                el.div({className:'panel panel-default'},
                  el.div({className:'panel-body'},
                    //'worldStore.state.weeklydata',
                    worldStore.state.weeklydata.map(function(week){
                      var startdate = new Date(week.startdate);
                      var msofstart = startdate.getTime();
                      var enddate = (new Date(msofstart + 604800000)).toJSON();
                      var prizepool = week.totalwagered * 0.00075;
                      var place = 1;
                      return el.div({className:'well well-sm col-xs-12',
                                     key: week._id
                                    },
                                'Week Starting: ' + week.startdate.substring(0,10) + ' and Ending: ' + enddate.substring(0,10),
                                el.table(
                                  {className: 'table text-left text-small', style: {fontWeight:'normal',marginTop:'5px'}},
                                  el.thead(
                                    null,
                                    el.tr(
                                      null,
                                      el.th(null, 'User'),
                                      el.th(null, 'Wagered'),
                                      el.th(null, 'Profit'),
                                      el.th(null, 'Prize')
                                    )
                                  ),
                                  el.tbody(
                                    null,
                                    week.players.map(function(player) {
                                      switch(place){
                                        case 1:
                                          var multiplier = 0.5;
                                          break;
                                        case 2:
                                          var multiplier = 0.25;
                                          break;
                                        case 3:
                                          var multiplier = 0.1;
                                          break;
                                        default :
                                            var multiplier = 0.02;
                                          break;
                                      }
                                      place++;
                                      return el.tr(
                                       { key: player.uname},
                                         // User
                                         el.td(
                                           null,
                                           el.a(
                                             {
                                               href: config.mp_browser_uri + '/users/' + player.uname,
                                               target: '_blank'
                                             },
                                             player.uname
                                           )
                                         ),
                                         // Wager
                                         el.td(
                                           null,
                                           helpers.convNumtoStr(player.wager) + ' ' + worldStore.state.coin_type
                                         ),
                                         // Profit
                                         el.td(
                                           null,
                                           helpers.convNumtoStr(player.profit) + ' ' + worldStore.state.coin_type
                                         ),
                                         el.td(
                                           null,
                                           helpers.convNumtoStr(prizepool * multiplier) + ' ' + worldStore.state.coin_type
                                         )
                                      );
                                    })//.reverse()
                                  )
                                )
                             );
                    }).reverse()
                  )
                )
              );
            }
});


var Ref_Box = React.createClass({
    displayName: 'SettingsTabContent',
    _onStoreChange: function() {
      this.forceUpdate();
    },
    componentDidMount: function() {
      worldStore.on('change', this._onStoreChange);
      worldStore.on('change_ref_data', this._onStoreChange);
    },
    componentWillUnmount: function() {
      worldStore.off('change', this._onStoreChange);
      worldStore.off('change_ref_data', this._onStoreChange);
    },
    _onChange: function(e) {
      var str = e.target.value;
      Dispatcher.sendAction('UPDATE_REF_WD', { str: str });
      //this._validateFilterWager(str);
    },
    _onClick: function(){
      var params = {
        amt: helpers.convCoinTypetoSats(worldStore.state.refwd.num)
      }
      Dispatcher.sendAction('REQ_REF_WD', params);
    },
    _onclick_copy: function(){
      //console.log('CLICK');
      var copyTextarea = document.querySelector('.js-reflink');
      var range = document.createRange();
      range.selectNode(copyTextarea);
      window.getSelection().addRange(range);
      try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Copying text command was ' + msg);
      } catch (err) {
        console.log('Oops, unable to copy');
      }
    },
     render: function() {
       var refprofit = worldStore.state.user.refprofit||0;
       var refpaid = worldStore.state.user.refpaid||0;
       var balance = refprofit - refpaid;
       var referrer = worldStore.state.user.ref||'--';

       var innerNode;
       var UserList = '';

       // TODO: Create error prop for each input
       var error = worldStore.state.refwd.error;

       if (balance < 100000){
         error = 'BALANCE_TOO_LOW';
       }

       if (worldStore.state.isLoading) {
         // If app is loading, then just disable button until state change
         innerNode = el.button(
           {type: 'button', disabled: true, className: 'btn btn-lg btn-block btn-default'},
           'Loading...'
         );
       } else if (error) {
         // If there's a betbox error, then render button in error state
         var errorTranslations = {
           'BALANCE_TOO_LOW':'Balance Too Low',
           'INVALID_SEED': 'Invalid Seed',
           'SEED_TOO_HIGH':'Seed too high',
           'CANNOT_AFFORD_WAGER': 'Balance too low',
           'INVALID_AMT': 'Balance too low',
           'INVALID_WAGER': 'Invalid Input',
           'WAGER_TOO_LOW': 'Wager too low',
           'WAGER_TOO_PRECISE': 'Wager too precise',
           'INVALID_MULTIPLIER': 'Invalid multiplier',
           'MULTIPLIER_TOO_PRECISE': 'Multiplier too precise',
           'MULTIPLIER_TOO_HIGH': 'Multiplier too high',
           'MULTIPLIER_TOO_LOW': 'Multiplier too low',
           'CHANCE_INVALID_CHARS': 'Invalid Characters in Chance',
           'CHANCE_TOO_LOW': 'Chance too low',
           'CHANCE_TOO_HIGH': 'Chance too high',
           'CHANCE_TOO_PRECISE': 'Chance too Precise'
         };

         innerNode = el.button(
           {type: 'button',
            disabled: true,
            className: 'btn btn-md btn-block btn-danger'},
           errorTranslations[error] || 'Invalid bet'
         );
       }else {
         innerNode = el.button(
               {
                 //id: 'RT-CLEAR',
                   type: 'button',
                   className: 'btn btn-md btn-block btn-success',
                   style: { fontWeight: 'bold'},
                   onClick: this._onClick,
                   disabled: (worldStore.state.refwd.num == 0)
               },
              'Request Withdrawal'
             )
       }
       if (worldStore.state.referred_users){

         worldStore.state.referred_users.map(function(thisuser){
          UserList += ' ' + thisuser.uname + ',';
         });
       }else {
         UserList = ' ';
       }
       return el.div(
                null,
                el.div({className:'well well-sm'},
                  'Your Referral Link to Share:  ',
                  el.div({className:'text text-center js-reflink'},
                      'https://fallenangel3k.github.io/?ref=' + worldStore.state.user.uname + ' ',
                      el.button({
                                type: 'button',
                                className: 'btn btn-sm btn-default',
                                onClick: this._onclick_copy
                               //disabled:
                               },
                               el.span({className: 'glyphicon glyphicon-copy'})
                      )
                  ),

                  el.div(
                    {className: 'row'},
                    el.div(
                      {className: 'col-xs-12',style: {marginTop: '-15px'}},
                      el.hr(null)
                    )
                  ),
                  //worldStore.state.referred_users
                  el.div({className:'row'},
                    el.div({className:'col-xs-12 col-md-4'},
                      el.span(null,
                        'No. Users Referred: ' + (worldStore.state.referred_users ? worldStore.state.referred_users.length : '0')
                      )
                    ),
                    el.div(null, 'Users Referred: ' + UserList)

                  ),

                  el.div(
                    {className: 'row'},
                    el.div(
                      {className: 'col-xs-12',style: {marginTop: '-15px'}},
                      el.hr(null)
                    )
                  ),
                  el.div({className: 'row'},
                    el.span({className: 'col-xs-12 col-sm-4 col-md-3'},
                      'Profit: ' + helpers.convSatstoCointype(refprofit) + ' ' + worldStore.state.coin_type
                    ),
                    el.span({className: 'col-xs-12 col-sm-4 col-md-3'},
                      'Paid: ' + helpers.convSatstoCointype(refpaid) + ' ' + worldStore.state.coin_type
                    ),
                    el.span({className: 'col-xs-12 col-sm-4 col-md-3'},
                      'Balance: ' + helpers.convSatstoCointype(balance) + ' ' + worldStore.state.coin_type
                    ),
                    el.span({className: 'col-xs-12 col-sm-4 col-md-3'},
                     'Referred By: ' + referrer
                    )
                  ),
                  el.div(
                    {className: 'row'},
                    el.div(
                      {className: 'col-xs-12',style: {marginTop: '-10px'}},
                      el.hr(null)
                    )
                  ),
                  el.div(
                    {className: 'row'},
                    el.div(
                      {className: 'col-xs-12 col-sm-4 col-md-3',style: {marginTop: '-10px'}},
                      el.div(
                            {className: 'form-group'},
                            el.span({className: 'h6'},'Withdraw Amount'),
                            el.span(
                              {className: 'input-group input-group-sm'},
                            //  el.span({className: 'h6'},'Withdraw Amount'),//'input-group-addon'
                              el.input(
                                {
                                  value: worldStore.state.refwd.str,
                                  type: 'text',
                                  className: 'form-control input-sm',
                                  onChange: this._onChange,
                                  placeholder: 'Enter Amount'
                                }
                              ),
                              el.span({className: 'input-group-addon'},worldStore.state.coin_type)
                            )
                          )
                    ),
                    el.div(
                      {className: 'col-xs-12 col-sm-4 col-md-3'},//style: {marginTop: '-10px'}},
                      innerNode
                    )
                  ),
                  el.div(
                    {className: 'row'},
                    el.div(
                      {className: 'col-xs-12',style: {marginTop: '-10px'}},
                      el.hr(null)
                    )
                  ),


                  el.table(
                    {className: 'table text-left text-small', style: {fontWeight:'normal',marginTop:'5px'}},
                    el.thead(
                      null,
                      el.tr(
                        null,
                        el.th(null, 'Date'),
                        el.th(null, 'Amount'),
                        el.th(null, 'Status')
                      )
                    ),
                    el.tbody(
                      null,
                      worldStore.state.reftxdata.map(function(record) {
                        return el.tr(
                         { key: record._id},
                           // Date
                           el.td(
                             null,
                             record.created_at.substring(0,10)
                           ),
                           // Amount
                           el.td(
                             null,
                             helpers.convNumtoStr(record.amt) + ' ' + worldStore.state.coin_type
                           ),
                           // Status
                           el.td(
                             null,
                             el.span({className: 'label ' + (record.status == 'PAID' ? 'label-success':'label-warning')},record.status)
                           )
                        );
                      }).reverse()
                    )
                  )


                )
              );
          }
  });


  var ThemeSelect = React.createClass({
    displayName: 'ThemeSelect',
    _onStoreChange: function() {
      this.forceUpdate();
    },
    componentDidMount: function() {
      worldStore.on('change', this._onStoreChange);
    },
    componentWillUnmount: function() {
      worldStore.off('change', this._onStoreChange);
    },
    _onClick: function() {
     $('dropdown-toggle').dropdown();
    },
    _ActionClick: function(type){
      return function(){
        console.log('click action ' + type);
        changeCSS('https://bootswatch.com/' + type + '/bootstrap.min.css', 0);
      };

    },
    _ActionClick2: function(){
      console.log('click action 2');
    },
    _ActionClick3: function(){
      console.log('click action 3');
    },
    render: function() {
     return el.div(
         null,
         el.div (
           {className: 'btn-group input-group'},
           el.div({ className:'input-group-addon', style:{fontWeight:'bold'}},'Themes'),
           el.button(
             {
               type:'button',
               className:'btn btn-md btn-primary dropdown-toggle',
               "data-toggle":'dropdown',
               "aria-haspopup":'true',
               "aria-expanded":'false',
               onClick:this._onClick
             },
             'Select', el.span({className:'caret'},'')
           ),
           el.ul({className:'dropdown-menu'},
             el.li(null, el.a({onClick: this._ActionClick('cerulean')},'Cerulean')),
             el.li(null, el.a({onClick: this._ActionClick('cosmo')},'Cosmo')),
             el.li(null, el.a({onClick: this._ActionClick('cyborg')},'Cyborg')),
             el.li(null, el.a({onClick: this._ActionClick('darkly')},'Darkly')),
             el.li(null, el.a({onClick: this._ActionClick('flatly')},'Flatly')),
             el.li(null, el.a({onClick: this._ActionClick('journal')},'Journal')),
             el.li(null, el.a({onClick: this._ActionClick('lumen')},'Lumen')),
             el.li(null, el.a({onClick: this._ActionClick('paper')},'Paper')),
             el.li(null, el.a({onClick: this._ActionClick('readable')},'Readable')),
             el.li(null, el.a({onClick: this._ActionClick('sandstone')},'Sandstone')),
             el.li(null, el.a({onClick: this._ActionClick('simplex')},'Simplex')),
             el.li(null, el.a({onClick: this._ActionClick('slate')},'Slate')),
             el.li(null, el.a({onClick: this._ActionClick('spacelab')},'Spacelab')),
             el.li(null, el.a({onClick: this._ActionClick('superhero')},'Superhero')),
             el.li(null, el.a({onClick: this._ActionClick('united')},'United')),
             el.li(null, el.a({onClick: this._ActionClick('yeti')},'Yeti'))
           )
         )
       );
     }

   });


var SettingsTabContent = React.createClass({
    displayName: 'SettingsTabContent',
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
                el.div({className:'panel panel-default'},
                  el.div({className:'panel-body'},
                    el.span({className: 'H6', style:{fontWeight:'bold'}}, 'REFERRAL INFO'),
                    React.createElement(Ref_Box, null),
                    el.div({className:'col-xs-12'},el.hr()),
                    el.div({className:'col-xs-12 col-sm-4 col-md-3'},
                      React.createElement(ThemeSelect, null)
                    )

                )
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
    worldStore.on('change_tab', this._onStoreChange);
  },
  componentWillUnmount: function() {
    worldStore.off('change_tab', this._onStoreChange);
  },
  render: function() {
    switch(worldStore.state.currTab) {
      case 'FAUCET':
        return React.createElement(FaucetTabContent, null);
      case 'MY_BETS':
      ////////////
        if (worldStore.state.bets.data[worldStore.state.bets.end] == null){
          var params = {
            uname: worldStore.state.user.uname
          };
          socket.emit('list_user_bets', params, function(err, bets) {
            if (err) {
              console.log('[socket] list_user_bets failure:', err);
              return;
            }
            console.log('[socket] list_user_bets success:', bets);
            bets.map(function(bet){
              bet.meta = {
                cond: bet.kind == 'DICE' ? bet.cond : '<',
                number: bet.kind == 'DICE' ? bet.target : 99.99,
                hash: 0,//bet.hash,
                isFair: true//CryptoJS.SHA256(bet.secret + '|' + bet.salt).toString() === hash
              };

              if (bet.kind != 'DICE')
                {
                bet.outcome = '-';
                }
              bet.meta.kind = bet.kind;
            })
            Dispatcher.sendAction('INIT_USER_BETS', bets);
          });
          }
        //////////////////
        return React.createElement(MyBetsTabContent, null);
      case 'ALL_BETS':
        return React.createElement(AllBetsTabContent, null);
      case 'STATS':
        return React.createElement(StatsTabContent, null);
      case 'JACKPOT':
          Dispatcher.sendAction('UPDATE_APP_INFO');
        return React.createElement(JackpotTabContent, null);
      case 'HELP':
        return React.createElement(HelpTabContent,null);
      case 'BIGGEST':
          Dispatcher.sendAction('UPDATE_BIGGEST_INFO');
        return React.createElement(BiggestTabContent,null);
      case 'WEEKLY':
          Dispatcher.sendAction('GET_WEEKLY_WAGER');
        return React.createElement(WeeklyWagerContent,null);
      case 'SETTINGS':
          Dispatcher.sendAction('GET_REF_TX');
          Dispatcher.sendAction('GET_REFERRED_USERS');
        return React.createElement(SettingsTabContent,null);
      default:
        alert('Unsupported currTab value: ', worldStore.state.currTab);
        break;
    }
  }
});

var Footer = React.createClass({
  displayName: 'Footer',
  render: function() {
    //Dispatcher.sendAction('CHANGE_GAME_TAB', 'DICE_GAME');
    return el.div(
      {
        className: 'text-center text-muted',
        style: {
          marginTop: '200px'
        }
      },
      el.div({className:'link_list'},
          el.ul({className:'list-group'},
            el.li(null,
              el.a(
                {
                  href: 'https://bitcointalk.org/index.php?topic=1359320.0',
                  target: '_blank'
                },
                'Bitcointalk'
              )
            ),
            el.li(null,
              ' | ',
              el.a(
                {
                  href: 'https://discord.gg/011aeZCV0elmAnSOT',
                  target: '_blank'
                },
                'Discord'
              )
            ),
            el.li(null,
            ' | Powered by ',
            el.a(
              {
                href: 'https://www.moneypot.com',
                target: '_blank'
              },
              'Moneypot'
            )
          )
        )
      )
    );
  }
});

//////////////////////
  function changeCSS(cssFile, cssLinkIndex) {
    var oldlink = document.getElementsByTagName("link").item(cssLinkIndex);
    var newlink = document.createElement("link");
    newlink.setAttribute("rel", "stylesheet");
    newlink.setAttribute("type", "text/css");
    newlink.setAttribute("href", cssFile);
    document.getElementsByTagName("head").item(0).replaceChild(newlink, oldlink);
    }

   function basefill(num) {
               var rtn = [];
              // rtn.push(0);
               while (rtn.length < num) {
                 rtn.push(helpers.convSatstoCointype(0));
               }
               return rtn;
     }

   function labelfill(num){
        var rtn = [];
        while (rtn.length < num){
          rtn.push(' ');
        }
        return rtn;
      }

   var data1 = {
       labels: labelfill(100),//labelfill(config.bet_buffer_size),//['a','b','c','d'],
       datasets: [ {
               label: "dataset1",
               fillColor: "rgba(220,220,220,0.2)",
               strokeColor: "rgba(119,179,0, 0.8)",//"rgba(220,220,220,1)",
               pointColor: "rgba(119,179,0, 0.8)",//"rgba(220,220,220,1)",
               pointStrokeColor: "#fff",
               pointHighlightFill: "#fff",
               pointHighlightStroke: "rgba(220,220,220,1)",
               data: basefill(100)//rand(-32, 1000, 50)
             } ]
   };

   var GameChart = React.createClass({
     displayName: 'GameChart',
     _onStoreChange: function() {
       this.forceUpdate();
     },
     componentDidMount: function() {
       worldStore.on('chart_change', this._onStoreChange);
     },
     componentWillUnmount: function() {
       worldStore.off('chart_change', this._onStoreChange);
     },
      render: function() {
        if(config.debug){console.log('[NewGraph]', data1);}
        //check if graph rising
        if (Number(data1.datasets[0].data[data1.datasets[0].data.length - 1]) > Number(data1.datasets[0].data[0]))
          {
          data1.datasets[0].strokeColor = "rgba(119,179,0, 0.8)";
          data1.datasets[0].pointColor = "rgba(119,179,0, 0.8)";
          }else{
            data1.datasets[0].strokeColor = "rgba(153,51,204, 0.8)";
            data1.datasets[0].pointColor = "rgba(153,51,204, 0.8)";
          }

        var props = { data: data1};
        var factory = React.createFactory(Chart.React['Line']);
        var options = {
            options:{
              animation: false,
              pointDot : false,
              pointHitDetectionRadius : 5,
              responsive: true,
              maintainAspectRatio: false,
              height: 75
              }
            };
        var _props = _.defaults({
          data: data1
        },options, props);

        var component = new factory(_props);
        return el.div(
          null,
          el.div({className:'panel panel-primary'},
            el.div({className:'panel-body',style:{marginBottom:'-15px',marginTop:'-15px'}},
            el.div({style:{marginBottom:'-15px',marginTop:'-15px'}},

            component

            )
            )
          )
        );
      }
    });


var el = React.DOM;

var App = React.createClass({
  displayName: 'App',
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    worldStore.on('show_chart', this._onStoreChange);
    chatStore.on('toggle_chat', this._onStoreChange);
  },
  componentWillUnmount: function() {
    worldStore.off('show_chart', this._onStoreChange);
    chatStore.off('toggle_chat', this._onStoreChange);
  },

  render: function() {
    return el.div(
      {className: 'container-fluid'},
      // Navbar
      React.createElement(Navbar, null),
      React.createElement(Newsbar, null),
      worldStore.state.ShowChart ? React.createElement(GameChart, null):'',
      el.div({className:'row'},
        el.div({className:'col-xs-12 col-lg-7 Game_Box'},
          React.createElement(GameBox, null)
        ),
        chatStore.state.showChat ? el.div({className:'col-xs-12 col-lg-5'}, //chatStore.state.showChat
          React.createElement(ChatBox, null)
        ) : el.div({className:'col-xs-12 col-lg-2 col-lg-offset-3'}, //chatStore.state.showChat
          React.createElement(ShowChat, null)
        ) ,
        // Tabs
        el.div(
          {className:'col-xs-12', style: {marginTop: '10px'}},
          React.createElement(Tabs, null)
        ),
        // Tab Contents
        el.div(
        {className:'col-xs-12'},
        React.createElement(TabContent, null)
      ),
        // Footer
        React.createElement(Footer, null)
      )
      //'Hello Good Sir'
    );;
  }
});

ReactDOM.render(
  React.createElement(App, null),
  document.getElementById('app')
);

//Dispatcher.sendAction('GET_BTC_TICKER');

connectToChatServer();
connectToMPChatServer();
////////////////////
//GETHASH
function gethashfromsocket(){
  //var req_data = {
  //  auth_id: worldStore.state.auth_id
  //};
  console.log('[socket] getting hash for: ' + worldStore.state.user.uname);
  var req_data;
  socket.emit('get_hash', req_data, function(err, data) {
    if (err) {
      console.log('[socket] hash error:', err);
      return;
    }
    console.log('[socket] hash success:', data);
    Dispatcher.sendAction('SET_NEXT_HASH', data.hash);
  });
}
////////////////////////////////////////////////////////////
// Hook up to chat server
var lastbetID = 0;

function connectToChatServer() {
  if(config.debug){console.log('Connecting to chat server. AccessToken:',
              worldStore.state.accessToken);}

  socket = io(config.be_uri,{reconnectionAttempts:3});

  socket._connectTimer = setTimeout(function() {
    console.log('socket timedout stopping call for socket');
    socket.close();
    setTimeout(function(){connectToChatServer();},25000);
  }, 10000);

  socket.on('connect', function() {
    console.log('[socket] Connected');
    clearTimeout(socket._connectTimer);

    socket.on('disconnect', function() {
      console.log('[socket] Disconnected');
    });

    socket.on('reconnect_failed', function() {
      setTimeout(function(){connectToChatServer();},25000);
      console.log('[socket] reconnection failed');
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

    socket.on('new_window_info',function(data){
      console.log('[socket] new window info:', data);
    });

    // message is { text: String, user: { role: String, uname: String} }
    socket.on('new_message', function(message) {
      console.log('[socket] Received chat message:', message);
      Dispatcher.sendAction('NEW_MESSAGE', message);
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

    socket.on('new_all_bet', function(betarray) {
      if(config.debug){console.log('[socket] NEW_ALL_BET');}
        Dispatcher.sendAction('NEW_ALL_BET', betarray);
    });
    socket.on('new_news_info', function(data) {
      Dispatcher.sendAction('UPDATE_NEWS_INFO',data);
    });
    // Received when your client doesn't comply with chat-server api
    socket.on('client_error', function(text) {
      console.warn('[socket] Client error:', text);
    });

    // Once we connect to chat server, we send an auth message to join
    // this app's lobby channel.

    var authPayload = {
      app_id: config.app_id,
      access_token: worldStore.state.accessToken,
      subscriptions: ['CHAT', 'DEPOSITS', 'BETS'],
      room: chatStore.state.chat_room
    };

    if((confidential_token) && (!worldStore.state.accessToken)) {
      var authPayload = {
        app_id: config.app_id,
        confidential_token: confidential_token
      };
      console.log('getting auth id');
      socket.emit('get_auth_id', authPayload, function(err, data) {
        if (err) {
          console.log('[socket] Auth failure:', err);
          return;
        }
        if(config.debug){console.log('[socket] Auth success:', data);}
        Dispatcher.sendAction('UPDATE_AUTH_ID',data);
        //Dispatcher.sendAction('INIT_CHAT', data);
      });

    }


    socket.emit('chat_init', authPayload, function(err, data) {
      if (err) {
        console.log('[socket] chat_init failure:', err);
        return;
      }
      if(config.debug){console.log('[socket] chat_init success:', data);}

      if(worldStore.state.user == undefined){
      console.log('Intializing Chat');

      Dispatcher.sendAction('INIT_CHAT', data);
      if (data.user.uname)
        {
        Dispatcher.sendAction('UPDATE_AUTH_ID',data.user);
        Dispatcher.sendAction('INIT_USER', data);
        if (!betStore.state.nextHash){
          gethashfromsocket();
        }
        if(localStorage.refname){
          var ref = localStorage.refname;
          Dispatcher.sendAction('SET_REFER_NAME',ref);
        }
        socket.emit('get_user_pms', function(err, data) {
          if (err) {
            if(config.debug){console.log('[socket] get_user_pms failure:', err);}
            return;
          }
          if(config.debug){console.log('[socket] get_user_pms success:', data);}
          if(data != null){
              data.map(function(message){
                if (worldStore.state.user.open_pm){
                for (x = 0; x < worldStore.state.user.open_pm.length; x++){
                  if ((message.receiver == worldStore.state.user.open_pm[x])||(message.user.uname == worldStore.state.user.open_pm[x])){
                      Dispatcher.sendAction('NEW_MESSAGE', message);
                  }
                }
              }
                //Dispatcher.sendAction('NEW_MESSAGE', message);
              });
            }
        });
      }

      Dispatcher.sendAction('STOP_LOADING');
      Dispatcher.sendAction('UPDATE_APP_INFO');
      Dispatcher.sendAction('UPDATE_BANKROLL');
      Dispatcher.sendAction('GET_NEWS_INFO');
      Dispatcher.sendAction('GET_WEEKLY_WAGER');

      socket.emit('list_all_bets', function(err, data) {
        if (err) {
          if(config.debug){console.log('[socket] list_all_bets failure:', err);}
          return;
        }
        if(config.debug){console.log('[socket] list_all_bets success:', data);}
        if(data != null)
          {
            Dispatcher.sendAction('INIT_ALL_BETS', data);
          }
      });

    }else {
      console.log('recconected to chat');
    }
  });//END CHAT INIT


    if(worldStore.state.currTab == 'ALL_BETS'){
      socket.emit('join_ALL_BETS');
    }

  });
}



function connectToMPChatServer() {
  if(config.debug){console.log('Connecting to mp chat server');}

  mpsocket = io(config.chat_uri,{reconnectionAttempts:3});

  mpsocket._connectTimer = setTimeout(function() {
    console.log('mpsocket timedout stopping call for socket');
    mpsocket.close();
    setTimeout(function(){connectToMPChatServer();},60000);
  }, 10000);


  mpsocket.on('connect', function() {
    console.log('[mpsocket] Connected');
    clearTimeout(mpsocket._connectTimer);

    mpsocket.on('disconnect', function() {
      console.log('[mpsocket] Disconnected');
    });

    mpsocket.on('reconnect_failed', function() {
      setTimeout(function(){connectToMPChatServer();},60000);
      console.log('[mpsocket] reconnection failed');
    });

    // message is { text: String, user: { role: String, uname: String} }
    mpsocket.on('new_message', function(message) {
      console.log('[mpsocket] Received chat message:', message);
      Dispatcher.sendAction('NEW_MESSAGE', message);
    });


    // Received when your client doesn't comply with chat-server api
    mpsocket.on('client_error', function(text) {
      console.warn('[mpsocket] Client error:', text);
    });

    // Once we connect to chat server, we send an auth message to join
    // this app's lobby channel.

    var authPayload = {
      app_id: config.app_id,
      access_token: undefined,
      subscriptions: ['CHAT','DEPOSITS']
    };

    mpsocket.emit('auth', authPayload, function(err, data) {
      if (err) {
        console.log('[mpsocket] Auth failure:', err);
        return;
      }
      if(config.debug){console.log('[mpsocket] Auth success:', data);}
    //  Dispatcher.sendAction('INIT_CHAT', data);
    });
  });
}


$(function () {
  $('[data-toggle="popover"]').popover();
});

// This function is passed to the recaptcha.js script and called when
// the script loads and exposes the window.grecaptcha object. We pass it
// as a prop into the faucet component so that the faucet can update when
// when grecaptcha is loaded.
function onRecaptchaLoad() {
  Dispatcher.sendAction('GRECAPTCHA_LOADED', grecaptcha);
}

$(document).on('keydown', function(e) {
  var H = 72, L = 76, C = 67, X = 88, A = 65, S = 83, D = 68, F = 70, G = 71, SPACE = 32, keyCode = e.which;

  // Bail is hotkeys aren't currently enabled to prevent accidental bets
  if (!worldStore.state.hotkeysEnabled) {
    return;
  }

  // Bail if it's not a key we care about
  if (keyCode !== H && keyCode !== L && keyCode !== X && keyCode !== C && keyCode !== A && keyCode !== S && keyCode !== D && keyCode !== F && keyCode !== G && keyCode !== SPACE) {
    return;
  }

  // TODO: Remind self which one I need and what they do ^_^;;
  e.stopPropagation();
  e.preventDefault();

  switch(keyCode) {
    case C:  // Increase wager
      if (((worldStore.state.currGameTab == 'PLINKO')||(worldStore.state.currGameTab == 'DICE')||(worldStore.state.currGameTab == 'SLIDERS')||(worldStore.state.currGameTab == 'SLOTS')||(worldStore.state.currGameTab == 'BITSWEEP')||(worldStore.state.currGameTab == 'BITCLIMBER'))&&(betStore.state.BS_Game.state != 'RUNNING')){
      var n = worldStore.state.coin_type === 'BITS' ? (betStore.state.wager.num * 2).toFixed(2) : (betStore.state.wager.num * 2).toFixed(8);
      Dispatcher.sendAction('UPDATE_WAGER', { str: n.toString() });
      }else{
        $('#RT-DOUBLE').click();
      }
      break;
    case X:  // Decrease wager
      if (((worldStore.state.currGameTab == 'PLINKO')||(worldStore.state.currGameTab == 'DICE')||(worldStore.state.currGameTab == 'SLIDERS')||(worldStore.state.currGameTab == 'SLOTS')||(worldStore.state.currGameTab == 'BITSWEEP')||(worldStore.state.currGameTab == 'BITCLIMBER'))&&(betStore.state.BS_Game.state != 'RUNNING')){
      var newWager = worldStore.state.coin_type === 'BITS' ? (betStore.state.wager.num / 2).toFixed(2) : (betStore.state.wager.num / 2).toFixed(8);
      Dispatcher.sendAction('UPDATE_WAGER', { str: newWager.toString() });
      }else{
        $('#RT-HALF').click();
      }
      break;
    case L:  // Bet lo
      $('#bet-lo').click();
      break;
    case H:  // Bet hi
      $('#bet-hi').click();
      break;
    case A:  // Bet ROW1
      $('#bet-ROW1').click();
      break;
    case S:  // Bet ROW2
      $('#bet-ROW2').click();
      break;
    case D:  // Bet ROW3
      $('#bet-ROW3').click();
      break;
    case F:  // Bet ROW4
      $('#bet-ROW4').click();
      break;
    case G:  // Bet ROW5
      $('#bet-ROW5').click();
      break;
    case SPACE: //SPIN ROULETTE
      if (worldStore.state.currGameTab == 'ROULETTE'){
      $('#RT-SPIN').click();
      }else if (worldStore.state.currGameTab == 'BITSWEEP'){
      $('#BS-START').click();
    }else if (worldStore.state.currGameTab == 'SLOTS'){
      $('#SL-START').click();
    }else if (worldStore.state.currGameTab == 'BITCLIMBER'){
      $('#BC-START').click();
    }else if (worldStore.state.currGameTab == 'SLIDERS'){
      $('#sld-bet').click();
    }
      break;
    default:
      return;
  }
});

window.addEventListener('message', function(event) {
  if (event.origin === config.mp_browser_uri && event.data === 'UPDATE_BALANCE') {
    Dispatcher.sendAction('START_REFRESHING_USER');
  }
}, false);
window.setInterval(function(){
    if ((worldStore.state.user) && (!AutobetStore.state.Run_Autobet)){
    Dispatcher.sendAction('START_REFRESHING_USER');
    if (!betStore.state.nextHash){
        gethashfromsocket();
      }
    }
 }, 15000);

 window.setInterval(function(){
   Dispatcher.sendAction('UPDATE_APP_INFO');
   Dispatcher.sendAction('GET_BTC_TICKER');
},60000);


(function($) {
    $.fn.goTo = function() {
        $('html, body').animate({
            scrollTop: $(this).offset().top + 'px'
        }, 'fast');
        return this; // for chaining...
    }
})(jQuery);
