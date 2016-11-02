// colors: http://flatuicolors.com/

var helpers = {};

// Preload audio
new buzz.sound('/sounds/hit', {formats: ['mp3', 'ogg']});
new buzz.sound('/sounds/knock', {formats: ['mp3', 'ogg']});
var sounds = {
  playHit: function() {
    var sound = new buzz.sound('/sounds/hit', {
      formats: ['mp3', 'ogg'],
      volume: 10
    });
    sound.play();
  },
  playMiss: function() {
    var sound = new buzz.sound('/sounds/knock', {
      formats: ['mp3', 'ogg'],
      volume: 10
    });
    sound.play();
  }
};


// Hoist it. It's impl'd at bottom of page.
var socket;


// Generates a unique id, used for uniquely tagging object/elements
// :: Int
var generateId = (function() {
  var currentId = 0;
  return function _generateId() {
    return ++currentId;
  };
})();

var config = {
  pay_table: [22, 5, 3, 2, 1.4, 1.2, 1.1, 1.0, 0.4, 1,  1.1, 1.2, 1.4, 2, 3, 5, 22],
  // 17
  puck_diameter: 35,
  peg_diameter: 4,
  top_margin: 50,
  bottom_margin: 275,
  side_margin: 0,
  // payTableFontSize: 20,
  // payTableFontSize: 16,
  payTableFontSize: 15,
  // payTableRowHeight: 60,
  payTableRowHeight: 20,
  //
  app_id: 1471,
  mp_api_uri: 'https://api.moneypot.com',
  mp_browser_uri: 'https://www.moneypot.com',
  redirect_uri: 'https://fallenangel3k.github.io',
  recaptcha_sitekey: '6LevqigTAAAAAPSTvIbdlxhf1wDud851uD4dziFQ',
  chat_uri: '//socket.moneypot.com',
  hexColors: {
    fade: {
      'green': '#a8ebc4',
      'yellow': '#f9e8a0',
      'red': '#f8c9c4'
    },
    light: {
      'green': '#2ecc71',
      'yellow': '#f1c40f',
      'red': '#e74c3c'
    },
    dark: {
      'green': '#27ae60',
      'yellow': '#f39c12',
      'red': '#c0392b'
    }
  },
  // TODO Replace with hexColors.light[color]
  puckColors: {
    'green': '#2ecc71',
    'yellow': '#f1c40f',
    'red': '#e74c3c'
  },
  n: 17,
  pay_tables: {
    'green': [3, 1.5, 1.4, 1.3, 1.2, 0.2, 1.1, 1.1, 1.1, 1.1, 1.1, 0.2, 1.2, 1.3, 1.4, 1.5, 3],
    'yellow': [23, 9, 3, 2, 1.5, 1.2, 1.1, 1, 0.4, 1, 1.1, 1.2, 1.5, 2, 3, 9, 23],
    'red': [121, 47, 13, 5, 3, 1.4, 1, 0.5, 0.3, 0.5, 1, 1.4, 3, 5, 13, 47, 121]
  }
};
config.levels = config.n - 1;
config.table_height = config.top_margin + (config.levels * config.puck_diameter) + (config.levels * config.peg_diameter) - 120;
config.table_width = config.side_margin*2 + (config.n * config.puck_diameter) + (config.n * config.peg_diameter);

// PRODUCTION
   config.mp_api_uri = 'https://api.moneypot.com';
   config.mp_browser_uri = 'https://www.moneypot.com';
   config.app_id = 1471;
   config.redirect_uri = 'https://fallenangel3k.github.io/plinko.html';
   config.chat_uri = '//socket.moneypot.com';

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////

helpers.isValidPayout = (function() {
  var re = /^(\d\.\d{0,2})$|^(\d\d\.\d{0,1})$|^(\d{1,3})$/;
  return function _isValidPayout(str) {
    return re.test(str);
  };
})();

// Ensure this runs before URL is cleaned

// This will be a validated map of color->[Num], but each color will
// only be set if it's valid
var payoutQuery = (function() {
  var queryMap = URI(window.location.href).query(true);

  var out = {};

  ['green', 'yellow', 'red'].forEach(function(color) {

    // Ensure it exists
    if (!queryMap[color]) {
      console.log('[queryMap] missing color:', color);
      return;
    }

    // Ensure it's a string
    if (!_.isString(queryMap[color])) {
      console.log('[queryMap] is not a string:', color);
      return;
    }

    // Ensure it splits into 17 payouts
    if (queryMap[color].split(' ').length !== 17) {
      console.log('[queryMap] does not contain 17 items:', color);
      return;
    }

    // Ensure all of the payouts validate
    if (_.some(queryMap[color].split(' '), _.negate(helpers.isValidPayout))) {
      console.log('[queryMap] contains invalid payouts:', color);
      return;
    }

    // It made it this far, so it must be valid

    // :: [Number]
    var nums = queryMap[color].split(' ').map(function(s) {
      return parseFloat(s, 10);
    });

    out[color] = nums;

  });

  return out;
})();

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////

// Global canvas object. TODO: move to store
var canvas;
var kanvas;

// payouts is object of { green: [...], etc. }
var Kanvas = function(canvas) {
  //this.payouts = initPayouts;
  // The underlying Fabric Canvas instance
  this.canvas = canvas;
  // The underlying Fabric objects on the Fabric canvas
  // for the purpose of mutating them and then rerendering
  // this.objects = {
  //   payouts: {}
  // };

  var self = this;

  var _drawPegs = function() {
    var n = config.n;
    var puck_diameter = config.puck_diameter;
    var peg_diameter = config.peg_diameter;
    var top_margin = config.top_margin;
    var side_margin = config.side_margin;

    for (var row = 0; row < n-1; row++) {
      var pegCount = row + 1;
      var leftMargin = (n - row) * puck_diameter/2 + (n - row) * peg_diameter/2;
      var top = top_margin + (puck_diameter*0.65 * row) + (peg_diameter*0.65 * row);
      for (var col = 0; col < pegCount; col++) {
        self.canvas.add(new fabric.Circle({
          left: side_margin + leftMargin + (puck_diameter * col) + (peg_diameter * col) - 4,
          top: top,
          radius: peg_diameter,
          selectable: false,
          fill: 'white',
          stroke: 'black',
          shadow: 'rgba(0,0,0,1.0) 0px 4px 0px'
        }));
      }
    }
  };

  var _drawHorizontalLine = function() {
    // Draw horizontal line
    var rowCount = config.n;
    var rect = new fabric.Rect({
      top: config.top_margin + (rowCount * config.puck_diameter * 0.65) + (rowCount * config.peg_diameter * 0.65) - 22,
      left: config.side_margin,
      height: 2,
      selectable: false,
      width: (rowCount * config.puck_diameter) + (rowCount * config.peg_diameter)
    });
    self.canvas.add(rect);
  };

  var _drawDividers = function() {
    // Draw divider marks in the line
    for (var idx = 0; idx <= 17; ++idx) {
      var rowCount = config.n - 1;
      var divider = new fabric.Rect({
        top: config.top_margin + (rowCount * config.puck_diameter*0.65) + (rowCount * config.peg_diameter*0.65),
        left: (config.puck_diameter + config.peg_diameter) * idx,
        height: 10,
        selectable: false,
        width: 2
      });
      if (idx !== 0) {
        canvas.add(divider);
      }
    }
  };

  var _drawPayout = function(color) {
    var offsets = {
      green: 1,
      yellow: 2,
      red: 3
    };
    // Draw custom paytable
    console.log('[_drawPayout] color:', color);
    console.log('-- [KANVAS ...]', worldStore.state.pay_tables[color]);
    worldStore.state.pay_tables[color].forEach(function(multiplier, idx) {
      var rowCount = config.n - 1;
      var text = new fabric.Text((multiplier + String.fromCharCode(215) + '  ').slice(0, 4), {
        angle: 0,
        top: config.payTableRowHeight*offsets[color] + config.top_margin + (rowCount * config.puck_diameter*0.65) + (rowCount * config.peg_diameter*0.65),
        left: config.side_margin + (config.puck_diameter + config.peg_diameter) * idx + 2,
        fontSize: config.payTableFontSize,
        stroke: parseFloat(multiplier) >= 1 ?
          config.hexColors.dark[color] : config.hexColors.light[color],
        fill: parseFloat(multiplier) >= 1 ?
          config.hexColors.dark[color] : config.hexColors.light[color],
        selectable: false,
        fontFamily: 'Courier New',
        fontWeight: parseFloat(multiplier) >= 1 ? 'bold' : 'normal',
        backgroundColor: parseFloat(multiplier) >= 1 ?
          config.hexColors.fade[color] : ''
      });
      canvas.add(text);
    });
  };

  this.renderAll = function() {
    // Clear canvas and all event listeners on it
    //console.log(self.canvas.getObjects().length);
    self.canvas.dispose();
    self.canvas.renderOnAddRemove = false;
    _drawPegs();
    _drawHorizontalLine();
    _drawDividers();
    _drawPayout('green');
    _drawPayout('yellow');
    self.canvas.renderOnAddRemove = true;
    _drawPayout('red');
    //console.log(self.canvas.getObjects().length);
  };

};

var generatePath = function() {
  var rowCount = config.n-1;
  var out = [];
  var outcomes = ['L', 'R'];
  for (var i = 0; i < rowCount; i++) {
    var outcome = outcomes[Math.floor(Math.random() * 2)];
    out.push(outcome);
  }
  return out;
};

// data.path (Required) is array of ['L', 'R', 'R', ...]
// data.onComplete (Optional) function called when puck is done animating
//   - the puck instance is passed into the fn
// data.onSlot (Optional) function called when puck lands in slot
//   - the puck instance is passed into the fn
// data.color (Optional) is 'red' | 'blue' | ...
// data.wager_satoshis
// data.profit_satoshis: Not to be revealed until puck lands in a slot
// data.isTest: Bool (optional)
// data.bet: Bet
// data.isFair: Bool
var Puck = function(data) {
  this.id = generateId();
  // console.log('Initializing puck. path=' + path + '. id=' + this.id);

  this.bet = data.bet;
  this.isFair = data.isFair;
  this.row = -1;
  this.path = data.path;
  this.wager_satoshis = data.wager_satoshis;
  this.profit_satoshis = data.profit_satoshis;
  this.isTest = !!data.isTest;
  this.onComplete = data.onComplete || function() {};
  this.onSlot = data.onSlot || function() {};
  this.onPeg = data.onPeg || function() {};
  // isRevealed is set to true once it hits a slot and the user is made aware of
  // the outcome
  this.isRevealed = false;

  this.color = data.color || getRandomColor();
  switch(this.color) {
    case 'red':
      this.fill = '#e74c3c';
      this.stroke = '#c0392b';
      break;
    case 'green':
      this.fill = '#2ecc71';
      this.stroke = '#27ae60';
      break;
    case 'yellow':
      this.fill = '#f1c40f';
      this.stroke = '#f39c12';
      break;
    case 'purple':
      this.fill = '#9b59b6';
      this.stroke = '#8e44ad';
      break;
    case 'blue':
      this.fill = '#3498db';
      this.stroke = '#2980b9';
      break;
    case 'dark':
      this.fill = '#34495e';
      this.stroke = '#2c3e50';
      break;
  }

  this._circle = new fabric.Circle({
    top: 1,
    left: 1,
    radius: config.puck_diameter/2 - 3,
    hasControls: false,
    hasRotatingPoint: false,
    stroke: this.stroke,
    strokeWidth: 3,
    fill: this.fill
  });

  this._text = new fabric.Text('B', {
    top: 5,
    left: 10.5,
    fontSize: 20,
    stroke: this.stroke,
    fontFamily: 'Courier New'
  });

  this._group = new fabric.Group([this._circle, this._text], {
    // top: 38,
    top: 11,
    left: config.top_margin + Math.floor(config.n/2) * config.puck_diameter + Math.floor(config.n/2) * config.peg_diameter - 30,
    hasControls: false,
    hasRotatingPoint: false,
    selectable: false,
    originX: 'center',
    originY: 'center'
  });

  var self = this;

  canvas.add(self._group);

  this.move = function(dir, cb) {
    switch(dir) {
      case 'L':
        self._group.animate('left', '-=19.5', {
          easing: fabric.util.ease.easeOutExpo
        });
        self._group.animate('angle', '-=90', {
          easing: fabric.util.ease.easeOutQuad
        });
        break;
      case 'R':
        self._group.animate('left', '+=19.5', {
          easing: fabric.util.ease.easeOutExpo
        });
        self._group.animate('angle', '+=90', {
          easing: fabric.util.ease.easeOutQuad
        });
        break;
    }

    var madeSound = false;

    // TODO: Make this function less bouncy. Taken from fabricjs source.
    // Currently unmodified
    var customEaseOutBounce = function(t, b, c, d) {
      if ((t /= d) < (1 / 2.75)) {
        return c * (7.5625 * t * t) + b;
      } else if (t < (2/2.75)) {
        if (!madeSound) {
          //self.onPeg(self);
          //sounds.playPeg();
          madeSound = true;
        }
        return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
      } else if (t < (2.5/2.75)) {
        return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
      } else {
        return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;
      }
    };

    self._group.animate('top', '+=25.5', {
      easing: customEaseOutBounce,
      onComplete: function() {
        //self.onPeg(self);
        cb();
      }
    });
  };
  this.run = function() {

    var currRow = self.row++;

    if (currRow === -1) {
      self._group.animate('top', '+=24', {
        easing: fabric.util.ease.easeOutBounce,
        onComplete: self.run
      });
    } else if (currRow < self.path.length) {
      // Puck has not yet reached end of table
      self.move(self.path[currRow], self.run);
    } else {
      // Puck has reached end of table, so fade it out and remove from table
      // But first, move it into its cubbyhole

      var getDropHeight = function(puckColor) {
        switch(puckColor) {
          case 'green':
            return config.payTableRowHeight*1 + 20;
          case 'yellow':
            return config.payTableRowHeight*2 + 20;
          case 'red':
            return config.payTableRowHeight*3 + 20;
          default:
            alert('Unsupported puck color: ' + puckColor);
        }
      };

      var dropHeight = getDropHeight(self.color);
      self._group.animate('top', '+=' + dropHeight, {
        onComplete: function() {

          // When puck lands in slot, call the onSlot callback
          self.isRevealed = true;
          self.onSlot(self);

          self._group.animate('angle', '+=1080', {
            easing: fabric.util.ease.easeOutQuad,
            duration: 2000
          });

          // Enlarge the puck once it lands in its hole
          self._group.animate('scaleX', '+=0.5', {
            duration: 2000,
            easing: fabric.util.ease.easeOutExpo
          });
          self._group.animate('scaleY', '+=0.5', {
            duration: 2000,
            easing: fabric.util.ease.easeOutExpo
          });
        }
      });

      self._group.animate('opacity', 0, {
        duration: 2000,
        //easing: fabric.util.ease.easeOutExpo,
        onComplete: function() {
          // When done fading out, remove it from active pucks map
          self.onComplete(self);

          // Remove it from the canvas
          canvas.remove(self._group);
        }
      });
    }
  };
};

// :: String
var getRandomColor = function() {
  var colors = ['green', 'yellow', 'red'];
  return colors[Math.floor(Math.random()*colors.length)];
};

////////////////////////////////////////////////////////////
// A weak MoneyPot API abstraction
var MoneyPot = (function() {

  var o = {};

  o.apiVersion = 'v1';

  // method: 'GET' | 'POST' | ...
  // endpoint: '/tokens/abcd-efgh-...'
  var noop = function() {};
  var makeMPRequest = function(method, bodyParams, endpoint, callbacks) {

    if (!worldStore.state.accessToken)
      throw new Error('Must have accessToken set to call MoneyPot API');

    var url = config.mp_api_uri + '/' + o.apiVersion + endpoint +
              '?access_token=' + worldStore.state.accessToken;
    $.ajax({
      url:      url,
      dataType: 'json', // data type of response
      method:   method,
      data:     bodyParams ? JSON.stringify(bodyParams) : undefined,
      headers: {
        'Content-Type': 'text/plain'
      },
      // Callbacks
      success:  callbacks.success  || noop,
      error:    callbacks.error    || noop,
      complete: callbacks.complete || noop
    });
  };

  o.getBankroll = function(callbacks) {
    var endpoint = '/bankroll';
    makeMPRequest('GET', undefined, endpoint, callbacks);
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
    var endpoint = '/bets/simple-dice';
    makeMPRequest('POST', bodyParams, endpoint, callbacks);
  };

  // bodyParams is an object:
  // - client_seed: Int in range [0, 0^32]
  // - hash: BetHash
  // - wager: Int in satoshis
  // - pay_table: Example [22, 5, 3, 2, 1.4, 1.2, 1.1, 1.0, 0.4, 1, 1.1, 1.2, 1.4, 2, 3, 5, 22]
  o.placePlinkoBet = function(bodyParams, callbacks) {
    var endpoint = '/bets/plinko';
    makeMPRequest('POST', bodyParams, endpoint, callbacks);
  };

  return o;
})();

///////////////////////////////////////////////////////////////////////
// Flux stuff

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

// opts is an object: {
//   state: Object of store's initial state
//   events: Object that contains all the events the store will emit
// }
var Store = function(opts, initCallback) {

  this.state = opts.state;
  this.events = opts.events || {};
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

// Str -> Str
helpers.autolink = (function() {

  // Helper function
  var _escapeHTML = (function() {
    var entityMap = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': '&quot;',
      "'": '&#39;'
    };

    return function(str) {
      return String(str).replace(/[&<>"']/g, function (s) {
        return entityMap[s];
      });
    };
  })();

  // Overrides Autolinker.js' @username handler to instead link to
  // user profile page.
  var _replaceUnameMentions = function(autolinker, match) {
    // Use default handler for non-twitter links
    if (match.getType() !== 'twitter') return true;

    var username = match.getTwitterHandle();
    return '<a href="https://www.moneypot.com/users/' + username +'" target="_blank">@' + username + '</a>';
  };

  return function _autolink(str) {
    return Autolinker.link(
      _escapeHTML(str),
      {
        truncate: 50,
        replaceFn: _replaceUnameMentions
      }
    );
  };
})();

helpers.randomUint32 = function () {
  if (window.crypto && window.crypto.getRandomValues && Uint32Array) {
    var o = new Uint32Array(1);
    window.crypto.getRandomValues(o);
    return o[0];
  } else {
    console.warn('Falling back to pseudo-random client seed');
    return Math.floor(Math.random() * Math.pow(2, 32));
  }
},

helpers.roleToLabelElement = function(role) {
  switch(role) {
    case 'mod':
      return el.span({className: 'label label-info'}, 'Mod');
    case 'owner':
      return el.span({className: 'label label-primary'}, 'Owner');
    default:
      return '';
  }
};


// Ex: colorPathToOutcome([100, 50, ..., 50, 100], [L R R L ...]) -> Number
helpers.colorPathToOutcome = function(table, path) {
  var idx = table.length-1;
  path.forEach(function(dir) {
    // dir is 'L' or 'R'
    if (dir === 'L') {
      --idx;
    }
  });

  return table[idx];
};

// Converts error constants into user-friendly error messages
var errorConstantToMessage = function(errorConstant) {
  var clientSeedErrors = {
    'NOT_INTEGER': 'ClientSeed must be an integer',
    'TOO_LOW': 'ClientSeed must be >= 0',
    'TOO_HIGH': 'ClientSeed must be < 4,294,967,296'
  };

  var wagerErrors = {
    'CANNOT_AFFORD_WAGER': 'You cannot afford wager',
    'INVALID_WAGER': 'Invalid wager'
  };

  return clientSeedErrors[errorConstant] || wagerErrors[errorConstant];
};

// Converts a paytable to a house edge
// arg: `table` is Array of numbers
//   Ex: [22, 5, 3, 2, 1.4, 1.2, 1.1, 1, 0.4, 1, 1.1, 1.2, 1.4, 2, 3, 5, 22]
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

helpers.calcMultiplier = function(wager, profit) {
  return helpers.round10((profit + wager) / wager, -2);
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

// Manage access token
// - If access_token is in url, save it into localStorage.
//   `expires_in` (seconds until expiration) will also exist in url
//   so turn it into a date that we can compare
var access_token, expires_in, expires_at;

if (helpers.getHashParams().access_token) {
  console.log('[token manager] access_token in hash params');
  access_token = helpers.getHashParams().access_token;
  expires_in = helpers.getHashParams().expires_in;
  expires_at = new Date(Date.now() + (expires_in * 1000));

  localStorage.setItem('access_token', access_token);
  localStorage.setItem('expires_at', expires_at);
} else if (localStorage.access_token) {
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
  console.log('[token manager] no access token');
}

//// Scrub fragment params from url.
if (window.history && window.history.replaceState) {
  // Preserve query (search) string though since I use that for custom payouts
  // e.g ?green=100+50+...+50+100
  window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
} else {
  // For browsers that don't support html5 history api, just do it the old
  // fashioned way that leaves a trailing '#' in the url
  window.location.hash = '#';
}

////////////////////////////////////////////////////////////

var initClientSeedNum = helpers.randomUint32();

// Load wager from localStorage if possible
var initWagerNum;
if (/^\d+$/.test(localStorage.getItem('wager_str') || '')) {
  initWagerNum = parseInt(localStorage.getItem('wager_str'), 10);
} else {
  initWagerNum = 0;
}

// The general store that holds all things until they are separated
// into smaller stores for performance.
var worldStore = new Store({
  // These are events that worldStore will emit
  // TODO: Finish and actually use this
  events: {
    'SESSION_STATS_UPDATE': 'SESSION_STATS_UPDATE',
    'HOTKEYS_CHANGED': 'HOTKEYS_CHANGED',
    'PAYOUT_EDITOR_TOGGLED': 'PAYOUT_EDITOR_TOGGLED',
    'RENDERED_PUCKS_CHANGED': 'RENDERED_PUCKS_CHANGED',
    'BANKROLL_CHANGED': 'BANKROLL_CHANGED'
  },
  state: {
    pay_tables: {
      'green': payoutQuery.green || [3, 1.5, 1.4, 1.3, 1.2, 0.2, 1.1, 1.1, 1.1, 1.1, 1.1, 0.2, 1.2, 1.3, 1.4, 1.5, 3],
      'yellow': payoutQuery.yellow || [23, 9, 3, 2, 1.5, 1.2, 1.1, 1, 0.4, 1, 1.1, 1.2, 1.5, 2, 3, 9, 23],
      'red': payoutQuery.red || [121, 47, 13, 5, 3, 1.4, 1, 0.5, 0.3, 0.5, 1, 1.4, 3, 5, 13, 47, 121]
    },
    // Used to toggle the payout editor that lets user edit/save the payouts and
    // see the house edge of each one
    showPayoutEditor: false,
    // Default the Moneypot bankroll to 150 BTC, though it will update
    // when app loads and a user is logged in (access token available)
    // This way, guests can still see max-bet approximations in the
    // payout editor
    bankroll: 150000000,
    wager: {
      str: initWagerNum.toString(),
      num: initWagerNum,
      error: undefined
    },
    sessionStats: {
      revealedBetCount: 0,
      totalBetCount: 0,
      // satoshis
      profit: 0
    },
    isLoading: true,
    user: undefined,
    accessToken: access_token,
    isRefreshingUser: false,
    hotkeysEnabled: false,
    // MY_BETS | PROVABLY_FAIR | FAUCET
    currTab: 'MY_BETS',
    //grecaptcha: undefined

    // Pucks that have not yet been revealed
    // Remove from this when they hit a slot
    activePucks: {},
    // Pucks to render
    // Remove from this when they're done animating
    renderedPucks: {},

    canvas: undefined,
    nextHash: undefined,
    // Used to show the latest X bets in the My Bets tab
    pucks: new CBuffer(50),
    clientSeed: {
      str: initClientSeedNum.toString(),
      num: initClientSeedNum,
      // NOT_INTEGER | TOO_LOW | TOO_HIGH
      error: undefined
    }
  }
}, function() {
  var self = this;

  // Helpers/getters
  self.getRevealedBalance = function() {
    // Ensure user is logged in
    if (!self.state.user) {
      alert('Called worldStore.getRevealedBalance when no user is logged in');
      return;
    }

    var wagerInFlight = 0;
    var profitInFlight = 0;
    _.values(self.state.activePucks).forEach(function(puck) {
      profitInFlight += puck.bet.profit;
      wagerInFlight += puck.wager_satoshis;
    });

    // We only want to show the user's balance minus the wagers of in-flight pucks
    // so that we don't spoil the surprise
    var revealedBalance = self.state.user.balance - (wagerInFlight + profitInFlight);

    console.log(revealedBalance);

    return revealedBalance;
  };

  // data obj should be map of Color -> [Float]
  // { green: [...], yellow: [...], red: [...] }
  Dispatcher.registerCallback('UPDATE_PAY_TABLES', function(data) {
    // TODO: console.asserts

    self.state.pay_tables.green = data.green;
    self.state.pay_tables.yellow = data.yellow;
    self.state.pay_tables.red = data.red;
    kanvas.renderAll();
  });

  Dispatcher.registerCallback('UPDATE_BANKROLL', function(satoshis) {
    self.state.bankroll = satoshis;
    self.emitter.emit(self.events.BANKROLL_CHANGED, self.state);
  });

  Dispatcher.registerCallback('TOGGLE_PAYOUT_EDITOR', function() {
    self.state.showPayoutEditor = !self.state.showPayoutEditor;
    self.emitter.emit(self.events.PAYOUT_EDITOR_TOGGLED, self.state);
  });

  Dispatcher.registerCallback('GRECAPTCHA_LOADED', function(_grecaptcha) {
    self.state.grecaptcha = _grecaptcha;
    self.emitter.emit('grecaptcha_loaded');
  });

  Dispatcher.registerCallback('TOGGLE_HOTKEYS', function() {
    self.state.hotkeysEnabled = !self.state.hotkeysEnabled;
    self.emitter.emit(self.events.HOTKEYS_CHANGED, self.state);
  });

  Dispatcher.registerCallback('DISABLE_HOTKEYS', function() {
    self.state.hotkeysEnabled = false;
    self.emitter.emit('change', self.state);
  });

  // seed as an object { str: String, num: Number, error: String }
  Dispatcher.registerCallback('UPDATE_CLIENT_SEED', function(seed) {
    self.state.clientSeed = _.merge({}, self.state.clientSeed, seed);

    var str = self.state.clientSeed.str;
    var num = parseInt(self.state.clientSeed.str, 10);

    // str must be an integer
    if (isNaN(num) || /[^\d]/.test(str.toString())) {
      self.state.clientSeed.error = 'NOT_INTEGER';
      // num must be [0, 2^32]
    } else if (num < 0) {
      self.state.clientSeed.error = 'TOO_LOW';
    } else if (num > Math.pow(2, 32) - 1) {
      self.state.clientSeed.error = 'TOO_HIGH';
    } else {
      // it's valid
      self.state.clientSeed.error = undefined;
      self.state.clientSeed.str = num.toString();
      self.state.clientSeed.num = num;
    }

    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('USER_LOGOUT', function() {
    self.state.user = undefined;
    self.state.accessToken = undefined;
    localStorage.clear();
    self.state.pucks.empty();
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('REFRESH_USER', function() {
    self.state.isRefreshingUser = true;
    self.emitter.emit('change', self.state);

    MoneyPot.getTokenInfo({
      success: function(data) {
        console.log('Successfully loaded user from tokens endpoint', data);
        var user = data.auth.user;
        self.state.user = user;
        self.emitter.emit('user_change', user);
      },
      error: function(err) {
        // TODO: Handle
        console.log('Error: ', err);
      },
      complete: function() {
        self.state.isRefreshingUser = false;
        self.emitter.emit('change', self.state);
      }
    });
  });

  Dispatcher.registerCallback('CHANGE_TAB', function(tabName) {
    self.state.currTab = tabName;
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('SET_NEXT_HASH', function(hexString) {
    self.state.nextHash = hexString;
    self.emitter.emit(self.events.NEXT_HASH_CHANGED, hexString);
  });

  Dispatcher.registerCallback('STOP_LOADING', function() {
    self.state.isLoading = false;
    self.emitter.emit('change', self.state);
  });

  // Allows merge into user. If self.user is undefined, it sets it to an object.
  Dispatcher.registerCallback('UPDATE_USER', function(data) {
    self._updateUser(data);
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('UPDATE_SESSION_STATS', function(data) {
    self._updateSessionStats(data);
    self.emitter.emit(self.events.SESSION_STATS_UPDATE, self.state.sessionStats);
  });

  // newWager is an object
  Dispatcher.registerCallback('UPDATE_WAGER', function(newWager) {
    self.state.wager = _.merge({}, self.state.wager, newWager);

    var n = parseInt(self.state.wager.str, 10);

    // If n is a number, ensure it's >= 0 bits
    // if (isFinite(n)) {
    //   n = Math.max(n, 0);
    //   self.state.wager.str = n.toString();
    // }

    // Ensure wager str is a number
    if (isNaN(n) || /[^\d]/.test(n.toString())) {
      self.state.wager.error = 'INVALID_WAGER';
      // Ensure user can afford balance
      // But validate against the revealed balance, not against
      // the true balance
    } else if (n * 100 > worldStore.getRevealedBalance()) {
      self.state.wager.error = 'CANNOT_AFFORD_WAGER';
      self.state.wager.num = n;
    } else {
      // wager str is valid
      self.state.wager.error = null;
      self.state.wager.str = n.toString();
      self.state.wager.num = n;
      // Remember wager in localStorage
      localStorage.setItem('wager_str', n.toString());
    }

    self.emitter.emit('change', self.state);
  });

  self._updateUser = function(data) {
    self.state.user = _.merge({}, self.state.user || {}, data);
  };

  self._updateSessionStats = function(data) {
    self.state.sessionStats = _.merge({}, self.state.sessionStats, data);
  };

  // data.color: 'red' | 'green' | ...
  // data.path: Array of 'L' and 'R'
  // data.wager_satoshis: Int
  // data.profit_satoshis: Int (satoshis)
  // data.isTest: Bool - for 0 wager pucks that shouldn't hit the Moneypot
  //   server. Intended to let unloggedin users play with the site.
  // data.isFair: Bool
  Dispatcher.registerCallback('SPAWN_PUCK', function(data) {

    if (!data.isTest) {
      self._updateSessionStats({
        totalBetCount: worldStore.state.sessionStats.totalBetCount + 1,
      });
    }

    //console.log('Spawning', data.color, 'puck...');
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

        // Play sound
        if (helpers.colorPathToOutcome(worldStore.state.pay_tables[puck.color], puck.path) < 1) {
          sounds.playMiss();
        } else {
          sounds.playHit();
        }

        delete worldStore.state.activePucks[puck.id];

        // ignore test pucks
        if (puck.isTest) {
          return;
        }

        // And also force wager validation now that balance is updated
        Dispatcher.sendAction('UPDATE_WAGER', {
          str: worldStore.state.wager.str
        });

        self._updateSessionStats({
          revealedBetCount: worldStore.state.sessionStats.revealedBetCount + 1,
          profit: worldStore.state.sessionStats.profit + puck.profit_satoshis
        });
        self.emitter.emit(self.events.SESSION_STATS_UPDATE, self.state.sessionStats);

      },
      // When puck is finished animating and must be removed from board
      onComplete: function(puck) {
        delete worldStore.state.renderedPucks[puck.id];
        self.emitter.emit(self.events.RENDERED_PUCKS_CHANGED);
        self.emitter.emit('change', self.state);
      }
    });
    //worldStore.state.pucks[puck.id] = puck;

    // Don't add testpucks to history
    if (!puck.isTest) {
      worldStore.state.pucks.push(puck);
    }

    worldStore.state.activePucks[puck.id] = puck;

    worldStore.state.renderedPucks[puck.id] = puck;
    self.emitter.emit(self.events.RENDERED_PUCKS_CHANGED);

    puck.run();
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('SPAWN_PUCKS', function(n) {

    console.log('Spawning', n, 'pucks...');

    // left (Required Int) is the number of pucks left to spawn
    // timeout (Optional Int) is milliseconds to wait between spawns (default: 200)
    var spawnManyPucks = function(left, timeout) {
      Dispatcher.sendAction('SPAWN_PUCK', { color: getRandomColor() });
      if (left > 0) {
        setTimeout(function() {
          spawnManyPucks(left - 1);
        }, timeout || 200);
      }
    };

    spawnManyPucks(10);
  });

});

var chatStore = new Store({
  state: {
    messages: new CBuffer(250),
    userList: {},
    showUserList: false,
    loadingInitialMessages: true,
    waitingForServer: false
  }
}, function() {
  var self = this;

  self.events = {
    'INITIALIZED': 'INITIALIZED',
    'NEW_CHAT_MESSAGE': 'NEW_CHAT_MESSAGE',
    'NEW_SYSTEM_MESSAGE': 'NEW_SYSTEM_MESSAGE',
    'USER_JOINED': 'USER_JOINED',
    'USER_LEFT': 'USER_LEFT',
  };

  // `data` is object received from socket auth
  Dispatcher.registerCallback('INIT_CHAT', function(data) {
    console.log('[ChatStore] received INIT_CHAT');
    // Give each one unique id
    var messages = data.room.history.map(function(message) {
      message.id = generateId();
      return message;
    });

    self.state.messages.push.apply(self.state.messages, messages);

    // Indicate that we're done with initial fetch
    self.state.loadingInitialMessages = false;

    // Load userList
    self.state.userList = data.room.users;
    self.emitter.emit('change', self.state);
    self.emitter.emit(self.events.INITIALIZED, self.state);
  });

  Dispatcher.registerCallback('NEW_CHAT_MESSAGE', function(message) {
    console.log('[ChatStore] received NEW_CHAT_MESSAGE');
    message.id = generateId();
    self.state.messages.push(message);

    self.emitter.emit('change', self.state);
    self.emitter.emit(self.events.NEW_CHAT_MESSAGE, self.state);
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
    self.emitter.emit(self.events.USER_JOINED, self.state);
  });

  // user is { id: Int, uname: String, role: 'admin' | 'mod' | 'owner' | 'member' }
  Dispatcher.registerCallback('USER_LEFT', function(user) {
    console.log('[ChatStore] received USER_LEFT:', user);
    delete self.state.userList[user.uname];

    self.emitter.emit('change', self.state);
    self.emitter.emit(self.events.USER_LEFT, self.state);
  });

  Dispatcher.registerCallback('NEW_SYSTEM_MESSAGE', function(text) {
    console.log('[ChatStore] received NEW_SYSTEM_MESSAGE');
    self.state.messages.push({
      id: generateId(),
      text: text,
      user: { uname: '[SYSTEM]' }
    });

    self.emitter.emit('change', self.state);
    self.emitter.emit(self.events.NEW_SYSTEM_MESSAGE, self.state);
  });

  Dispatcher.registerCallback('SEND_MESSAGE', function(text) {
    console.log('[ChatStore] received SEND_MESSAGE');
    // self.state.waitingForServer = true;
    self.emitter.emit('change', self.state);
    socket.emit('new_message', text);
  });

});

function initializeBoard() {
  // Global canvas object. TODO: Move to worldStore
  canvas = new fabric.Canvas('board');
  canvas.selection = false;

  // containerWidth / canvasWidth
  var adjustment = $('.board-container').width() / config.table_width;
  console.log('adjustment:', adjustment);
  if (adjustment > 1) {
    canvas.setDimensions({
      width: config.table_width,
      height: config.table_height
    });
  } else {
    var newWidth = config.table_width * adjustment;
    var newHeight = config.table_height * adjustment;
    canvas.setDimensions({
      width: newWidth,
      height: newHeight
    });
    canvas.setZoom(adjustment);
  }

  window.addEventListener('resize', function() {
    var adjustment = $('.board-container').width() / config.table_width;
    console.log('adjustment:', adjustment);
    if (adjustment > 1) {
      canvas.setDimensions({
        width: config.table_width,
        height: config.table_height
      });
      canvas.setZoom(1.0);
    } else {
      var newWidth = config.table_width * adjustment;
      var newHeight = config.table_height * adjustment;
      canvas.setDimensions({
        width: newWidth,
        height: newHeight
      });
      canvas.setZoom(adjustment);
    }
  }, true);

  // console.log('========================');
  // console.log('========================');
  // console.log($('.board-container').width());
  // console.log(config.table_width);
  // console.log($('.board-container').width()/config.table_width);
  // console.log('========================');
  // console.log('========================');

  // Draw pegs
  for (var row = 0; row < config.n-1; row++) {
    var pegCount = row + 1;
    var leftMargin = (config.n - row) * config.puck_diameter/2 + (config.n - row) * config.peg_diameter/2;
    for (var col = 0; col < pegCount; col++) {
      var peg = new fabric.Circle({
        left: config.side_margin + leftMargin + (config.puck_diameter * col) + (config.peg_diameter * col) - 4,
        top: config.top_margin + (config.puck_diameter*0.65 * row) + (config.peg_diameter*0.65 * row),
        radius: config.peg_diameter,
        selectable: false,
        fill: 'white',
        stroke: 'black',
        shadow: 'rgba(0,0,0,1.0) 0px 4px 0px'
      });
      canvas.add(peg);
    }
  }

  // Draw horizontal line
  var rowCount = config.n;
  var rect = new fabric.Rect({
      top: config.top_margin + (rowCount * config.puck_diameter * 0.65) + (rowCount * config.peg_diameter * 0.65) - 22,
      left: config.side_margin,
      height: 2,
      selectable: false,
      width: (rowCount * config.puck_diameter) + (rowCount * config.peg_diameter)
  });
  canvas.add(rect);

  // Draw divider marks in the line
  for (var idx = 0; idx <= 17; ++idx) {
    var rowCount = config.n - 1;
    var divider = new fabric.Rect({
      top: config.top_margin + (rowCount * config.puck_diameter*0.65) + (rowCount * config.peg_diameter*0.65),
      left: (config.puck_diameter + config.peg_diameter) * idx,
      height: 10,
      selectable: false,
      width: 2
    });
    if (idx !== 0) {
      canvas.add(divider);
    }
  }

  // Draw green paytable
  config.pay_tables.green.forEach(function(multiplier, idx) {
    var fadeGreen = '#a8ebc4';
    var lightGreen = '#2ecc71';
    var darkGreen = '#27ae60';
    var rowCount = config.n - 1;
    var text = new fabric.IText((multiplier + String.fromCharCode(215) + '  ').slice(0, 4), {
      angle: 0,
      top: config.payTableRowHeight*1 + config.top_margin + (rowCount * config.puck_diameter*0.65) + (rowCount * config.peg_diameter*0.65),
      left: config.side_margin + (config.puck_diameter + config.peg_diameter) * idx + 2,
      fontSize: config.payTableFontSize,
      stroke: parseFloat(multiplier) > 1 ? darkGreen : lightGreen,
      fill: parseFloat(multiplier) > 1 ? darkGreen : lightGreen,
      fontFamily: 'Courier New',
      fontWeight: parseFloat(multiplier) > 1 ? 'bold' : 'normal',
      selectable: false,
      backgroundColor: parseFloat(multiplier) > 1 ? fadeGreen : ''
    });
    canvas.add(text);
  });

  // Draw yellow paytable
  config.pay_tables.yellow.forEach(function(multiplier, idx) {
    var fadeYellow = '#f9e8a0';
    var lightYellow = '#f1c40f';
    var darkYellow = '#f39c12';
    var rowCount = config.n - 1;
    var text = new fabric.Text((multiplier + String.fromCharCode(215) + '  ').slice(0, 4), {
      angle: 0,
      top: config.payTableRowHeight*2 + config.top_margin + (rowCount * config.puck_diameter*0.65) + (rowCount * config.peg_diameter*0.65),
      left: config.side_margin + (config.puck_diameter + config.peg_diameter) * idx + 2,
      selectable: false,
      fontSize: config.payTableFontSize,
      stroke: parseFloat(multiplier) >= 1 ? darkYellow : lightYellow,
      fill: parseFloat(multiplier) >= 1 ? darkYellow : lightYellow,
      fontFamily: 'Courier New',
      fontWeight: parseFloat(multiplier) >= 1 ? 'bold' : 'normal',
      backgroundColor: parseFloat(multiplier) >= 1 ? fadeYellow : ''
    });
    canvas.add(text);
  });

  // Draw red paytable
  config.pay_tables.red.forEach(function(multiplier, idx) {
    var fadeRed = '#f8c9c4';
    var lightRed = '#e74c3c';
    var darkRed = '#c0392b';
    var rowCount = config.n - 1;
    var text = new fabric.Text((multiplier + String.fromCharCode(215) + '  ').slice(0, 4), {
      angle: 0,
      top: config.payTableRowHeight*3 + config.top_margin + (rowCount * config.puck_diameter*0.65) + (rowCount * config.peg_diameter*0.65),
      left: config.side_margin + (config.puck_diameter + config.peg_diameter) * idx + 2,
      fontSize: config.payTableFontSize,
      stroke: parseFloat(multiplier) >= 1 ? darkRed : lightRed,
      fill: parseFloat(multiplier) >= 1 ? darkRed : lightRed,
      selectable: false,
      fontFamily: 'Courier New',
      fontWeight: parseFloat(multiplier) >= 1 ? 'bold' : 'normal',
      backgroundColor: parseFloat(multiplier) >= 1 ? fadeRed : ''
    });
    canvas.add(text);
  });


  // Draw custom paytable
  worldStore.state.pay_tables.dark.forEach(function(multiplier, idx) {
    var color = 'green';
    var rowCount = config.n - 1;
    var text = new fabric.Text((multiplier + String.fromCharCode(215) + '  ').slice(0, 4), {
      angle: 0,
      top: config.payTableRowHeight*4 + config.top_margin + (rowCount * config.puck_diameter*0.65) + (rowCount * config.peg_diameter*0.65),
      left: config.side_margin + (config.puck_diameter + config.peg_diameter) * idx + 2,
      fontSize: config.payTableFontSize,
      stroke: parseFloat(multiplier) >= 1 ?
        config.hexColors.dark[color] : config.hexColors.light[color],
      fill: parseFloat(multiplier) >= 1 ?
        config.hexColors.dark[color] : config.hexColors.light[color],
      selectable: false,
      fontFamily: 'Courier New',
      fontWeight: parseFloat(multiplier) >= 1 ? 'bold' : 'normal',
      backgroundColor: parseFloat(multiplier) >= 1 ?
        config.hexColors.fade[color] : ''
    });
    canvas.add(text);
  });

}


// Repaint at 60fps

var fps = 60;
function paint() {
  setTimeout(function() {
    requestAnimationFrame(paint);
    if (Object.keys(worldStore.state.renderedPucks).length > 0) {
      canvas.renderAll();
    }
  }, 1000/fps);
}

paint();

////////////////////////////////////////////////////////////

var el = React.DOM;

var Board = React.createClass({
  displayName: 'Board',
  shouldComponentUpdate: function() {
    return false;
  },
  componentDidMount: function() {
    console.log('Mounting board...');
    //initializeBoard();

    // prep canvas

    canvas = new fabric.Canvas('board');
    canvas.selection = false;

    canvas.setDimensions({
      width: config.table_width,
      height: config.table_height
    });

    // mutate global kanvas reference
    kanvas = new Kanvas(canvas);
    kanvas.renderAll();

  },
  render: function() {
    return el.canvas(
      {
        id: 'board',
        style: {
          // border: '1px solid black'
        }
      },
      null
    );
  }
});

var BetBoxButton = React.createClass({
  displayName: 'BetBoxButton',
  _onStoreChange: function() {
    this.forceUpdate();
  },
  _onBalanceChange: function() {
    Dispatcher.sendAction('UPDATE_WAGER', {});
  },
  componentDidMount: function() {
    worldStore.on('change', this._onStoreChange);
    worldStore.on('user_change', this._onBalanceChange);
    worldStore.on(worldStore.events.HOTKEYS_CHANGED, this._onStoreChange);
  },
  componentWillUnmount: function() {
    worldStore.off('change', this._onStoreChange);
    worldStore.off('user_change', this._onBalanceChange);
    worldStore.off(worldStore.events.HOTKEYS_CHANGED, this._onStoreChange);
  },
  getInitialState: function() {
    return {
      waitingForServer: false,
      latestColorClick: undefined
    };
  },
  _makeBetHandler: function(color) {
    var self = this;
    return function() {

      // - client_seed: Int in range [0, 0^32]
      // - hash: BetHash
      // - wager: Int in satoshis
      // - pay_table: Example [22, 5, 3, 2, 1.4, 1.2, 1.1, 1.0, 0.4, 1, 1.1, 1.2, 1.4, 2, 3, 5, 22]
      var pay_table = worldStore.state.pay_tables[color];

      if (!pay_table) {
        alert('Unsupported pay table for color: ' + color);
        return;
      }

      // In bits
      var currWagerBits = worldStore.state.wager.num;
      var currHash = worldStore.state.nextHash;

      // Handle test pucks
      if (currWagerBits === 0) {
        Dispatcher.sendAction('SPAWN_PUCK', {
          color: color,
          path: generatePath(),
          wager_satoshis: 0,
          profit_satoshis: 0,
          isTest: true
        });
        return;
      }

      self.setState({
        waitingForServer: true,
        latestColorClick: color
      });

      MoneyPot.placePlinkoBet({
        hash: currHash,
        client_seed: worldStore.state.clientSeed.num,
        // Convert into satoshis
        wager: currWagerBits * 100,
        pay_table: pay_table
      }, {
        success: function(bet) {
          console.log('Placed bet: ', bet);
          Dispatcher.sendAction('SET_NEXT_HASH', bet.next_hash);

          // Always keep balance updated to the true balance.
          // But when balance is rendered, just always deduct
          // the wager of all activePucks
          Dispatcher.sendAction('UPDATE_USER', {
            balance: worldStore.state.user.balance + bet.profit
          });

          var isFair = true;
          // Ensure outcome hash is correct
          if (CryptoJS.SHA256(bet.secret + '|' + bet.salt).toString() !== currHash) {
            isFair = false;
          }
          // Ensure they gave us the right outcome
          if (helpers.calcMultiplier(currWagerBits*100, bet.profit) !== helpers.colorPathToOutcome(worldStore.state.pay_tables[color], bet.outcome.split(''))) {
            isFair = false;
          }

          // Dispatcher.sendAction('NEW_BET', bet);
          Dispatcher.sendAction('SPAWN_PUCK', {
            color: color,
            path: bet.outcome.split(''),
            wager_satoshis: currWagerBits * 100,
            profit_satoshis: bet.profit,
            bet: bet,
            isFair: isFair
          });
        },
        error: function(xhr) {
          console.error('Error placing bet:');
          if (xhr.responseJSON) {
            alert(xhr.responseJSON.error);
          } else {
            alert('Internal error');
          }
        },
        complete: function() {
          self.setState({
            waitingForServer: false
          });
          // Force re-validation of wager
          Dispatcher.sendAction('UPDATE_WAGER', {
            str: worldStore.state.wager.str
          });
        }
      });

      // Randomize clientseed
      var seedNum = helpers.randomUint32();
      Dispatcher.sendAction('UPDATE_CLIENT_SEED', {
        num: seedNum,
        str: seedNum.toString()
      });

    };
  },
  render: function() {
    var innerNode;

    var errorConstant = worldStore.state.wager.error || worldStore.state.clientSeed.error;

    if (worldStore.state.isLoading) {
      // If app is loading, then just diabled button until state change
      innerNode = el.button(
        {
          type: 'button',
          disabled: 'true',
          className: 'btn btn-lg btn-block btn-default'
        },
        'Loading...'
      );
    } else if (errorConstant) {
      // If there's a betbox error, render the button in an error state

      var errorMessage = errorConstantToMessage(errorConstant);

      innerNode = el.button(
        {
          type: 'button',
          disabled: true,
          className: 'btn btn-lg btn-block btn-danger'
        },
        errorMessage
      );
    } else {
      innerNode = el.div(
          {},
          el.div(
            {className: 'btn-group btn-group-justified'},
            el.div(
              {className: 'btn-group'},
              el.button(
                {
                  type: 'button',
                  className: 'btn btn-default bet-btn',
                  id: 'green-btn',
                  onClick: this._makeBetHandler('green'),
                  disabled: this.state.waitingForServer
                },
                (this.state.waitingForServer && this.state.latestColorClick === 'green') ?
                  el.span(
                    {className: 'glyphicon glyphicon-refresh rotate'}
                  ) :
                  'Green ',
                worldStore.state.hotkeysEnabled ? el.kbd(null, 'J') : ''
              )
            ),
            el.div(
              {className: 'btn-group'},
              el.button(
                {
                  type: 'button',
                  className: 'btn btn-default bet-btn',
                  id: 'yellow-btn',
                  onClick: this._makeBetHandler('yellow'),
                  disabled: this.state.waitingForServer
                },
                (this.state.waitingForServer && this.state.latestColorClick === 'yellow') ?
                  el.span(
                    {className: 'glyphicon glyphicon-refresh rotate'}
                  ) :
                  'Yellow ',
                worldStore.state.hotkeysEnabled ? el.kbd(null, 'K') : ''
              )
            ),
            el.div(
              {className: 'btn-group'},
              el.button(
                {
                  type: 'button',
                  className: 'btn btn-default bet-btn',
                  id: 'red-btn',
                  onClick: this._makeBetHandler('red'),
                  disabled: this.state.waitingForServer
                },
                (this.state.waitingForServer && this.state.latestColorClick === 'red') ?
                  el.span(
                    {className: 'glyphicon glyphicon-refresh rotate'}
                  ) :
                  'Red ',
                worldStore.state.hotkeysEnabled ? el.kbd(null, 'L') : ''
              )
            )
          )
        );
    }

    return innerNode;
  }
});

var BetBox = React.createClass({
  displayName: 'BetBox',
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    worldStore.on('change', this._onStoreChange);
    worldStore.on(worldStore.events.HOTKEYS_CHANGED, this._onStoreChange);
  },
  componentWillUnmount: function() {
    worldStore.off('change', this._onStoreChange);
    worldStore.off(worldStore.events.HOTKEYS_CHANGED, this._onStoreChange);
  },
  _onWagerChange: function(e) {
    var str = e.target.value;
    Dispatcher.sendAction('UPDATE_WAGER', { str: str });
  },
  _onHalveWager: function() {
    var newWager = Math.max(1, Math.round(worldStore.state.wager.num / 2));
    Dispatcher.sendAction('UPDATE_WAGER', { str: newWager.toString() });
  },
  _onDoubleWager: function() {
    var n = Math.max(1, worldStore.state.wager.num * 2);
    Dispatcher.sendAction('UPDATE_WAGER', { str: n.toString() });
  },
  _onMaxWager: function() {
    // If user is logged in, use their balance as max wager
    var balanceBits;
    if (worldStore.state.user) {
      balanceBits = Math.floor(worldStore.getRevealedBalance() / 100);
    } else {
      balanceBits = 42000;
    }
    Dispatcher.sendAction('UPDATE_WAGER', { str: balanceBits.toString() });
  },
  render: function() {
    return el.div(
      {
        className: 'panel panel-default no-select'
      },
      el.div(
        {className: 'panel-body'},
        el.form(
          {className: 'form-horizontal'},
          el.div(
            {className: 'form-group'},
            el.div(
              {className: 'col-md-3 text-center'},
              el.label(
                {
                  htmlFor: 'wager',
                  className: 'lead control-label',
                  style: {
                    color: worldStore.state.wager.error ? 'red' : 'black'
                  }
                },
                el.strong(
                  null,
                  'Wager: '
                )
              )
            ),
            el.div(
              {className: 'col-md-9'},
              el.div(
                {className: 'input-group'},
                el.input(
                  {
                    className: 'input-md form-control',
                    type: 'text',
                    placeholder: 'bits',
                    // Set wager to 0 if user is not logged in
                    value: worldStore.state.user ? worldStore.state.wager.str : 0,
                    disabled: !worldStore.state.user,
                    onChange: this._onWagerChange
                  }
                ),
                // el.span(
                //   {className: 'input-group-addon'},
                //   'Bits'
                // ),
                el.span(
                  {className: 'input-group-btn'},
                  el.button(
                    {
                      className: 'btn btn-default btn-md', type: 'button',
                      onClick: this._onHalveWager,
                      style: {
                        borderRadius: '0'
                      }
                    },
                    '1/2x ',
                    worldStore.state.hotkeysEnabled ?
                      el.kbd(null, 'X') : ''
                  )
                ),
                el.span(
                  {className: 'input-group-btn'},
                  el.button(
                    {
                      className: 'btn btn-default btn-md', type: 'button',
                      onClick: this._onDoubleWager,
                      style: {
                        borderRadius: '0'
                      }
                    },
                    '2x ',
                    worldStore.state.hotkeysEnabled ?
                      el.kbd(null, 'C') : ''
                  )
                ),
                el.span(
                  {className: 'input-group-btn'},
                  el.button(
                    {
                      className: 'btn btn-default btn-md', type: 'button',
                      onClick: this._onMaxWager
                    },
                    'Max'
                  )
                )
              )
            )
          ),
          React.createElement(BetBoxButton, null),
          worldStore.state.user ? el.hr() : null,
          React.createElement(SessionStats, null)
        )
      )
    );
  }
});

var UserBox = React.createClass({
  displayName: 'UserBox',
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    worldStore.on('change', this._onStoreChange);
  },
  componentWillUnmount: function() {
    worldStore.off('change', this._onStoreChange);
  },
  _onLogout: function() {
    Dispatcher.sendAction('USER_LOGOUT');
  },
  _onRefreshUser: function() {
    Dispatcher.sendAction('REFRESH_USER');
  },
  _openWithdrawPopup: function() {
    var windowUrl = config.mp_browser_uri + '/dialog/withdraw?app_id=' + config.app_id;
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
    var windowUrl = config.mp_browser_uri + '/dialog/deposit?app_id=' + config.app_id;
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
              className: 'btn navbar-btn btn-xs ' + (worldStore.state.wager.error === 'CANNOT_AFFORD_WAGER' ? 'btn-success' : 'btn-default'),
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
          helpers.floor10(worldStore.getRevealedBalance()/100, -2) + ' bits'
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
              '?app_id=' + config.app_id +
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
          el.a(
            {
              className: 'navbar-brand',
              href:'/'
            },
            el.span(
              {className: 'label label-default'},
              'Beta'
            ),
            ' Plinkopot')
        ),
        // Links
        el.ul(
          {className: 'nav navbar-nav'},
          // View on Moneypot
          el.li(
            null,
            el.a(
              {
                href: config.mp_browser_uri + '/apps/' + config.app_id,
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
                ' ',
                el.a(
                  {
                    href: config.mp_browser_uri + '/users/' + u.uname.toLowerCase(),
                    target: '__blank'
                  },
                  u.uname
                )
              );
            })
          )
        )
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
  getInitialState: function() {
    return {
      text: '',
      error: undefined
    };
  },
  // Whenever input changes
  _onChange: function(e) {
    var error;
    if (e.target.value.length > 350) {
      error = 'TEXT_TOO_LONG';
    }

    this.setState({
      text: e.target.value,
      error: error
    });
  },
  // When input contents are submitted to chat server
  _onSend: function() {
    var self = this;
    Dispatcher.sendAction('SEND_MESSAGE', this.state.text);
    this.setState({
      text: '',
      error: undefined
    });
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
      if (this.state.text.trim().length > 0 && !this.state.error) {
        this._onSend();
      }
    }
  },
  render: function() {
    return (
      el.div(
        null,
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
                  this.state.text.trim().length === 0 ||
                  this.state.error,
                onClick: this._onSend
              },
              'Send'
            )
          )
        ),
        // Error message displays here
        el.span(
          {
            style: {
              color: this.state.text.length > 350 ? 'red' : '#777'
            }
          },
          this.state.text.length,
          '/350 chars'
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
  componentDidMount: function() {
    chatStore.on('change', this._onStoreChange);
    chatStore.on(chatStore.events.INITIALIZED, this._scrollChat);
    chatStore.on(chatStore.events.NEW_CHAT_MESSAGE, this._onNewMessage);
    chatStore.on(chatStore.events.NEW_SYSTEM_MESSAGE, this._onNewMessage);
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
    console.log('_scrollChat');
    var node = this.refs.chatListRef.getDOMNode();
    console.log('_scrollChat node.scrollHeight: ', node.scrollHeight);
    $(node).scrollTop(node.scrollHeight);
  },
  _onUserListToggle: function() {
    Dispatcher.sendAction('TOGGLE_CHAT_USERLIST');
  },
  render: function() {
    return el.div(
      {
        id: 'chat-box',
        className: ''
        // style: {
        //   height: '300px'
        // }
      },
      el.div(
        {className: 'panel panel-default'},
        el.div(
          {className: 'panel-body'},
          el.ul(
            {className: 'chat-list list-unstyled', ref: 'chatListRef'},
            chatStore.state.messages.toArray().map(function(m) {
              return el.li(
                {
                  key: m.id
                },
                helpers.roleToLabelElement(m.user.role),
                ' ',
                el.code(null, m.user.uname + ':'),
                el.span({
                  dangerouslySetInnerHTML: {
                    __html: ' ' + helpers.autolink(m.text)
                  }
                })
              );
            })
          )
        ),
        // panel footer
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

// If user is not logged in, display "Try Me" to encourage them
// to click the buttons
var TryMe = React.createClass({
  displayName: 'TryMe',
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
        {className: 'no-select'},
        (worldStore.state.user || worldStore.state.isLoading) ?
         '' :
          el.div(
            {className: 'text-center'},
            el.img(
              {
                src: 'try-me.png',
                style: {
                  maxWidth: '300px',
                  width: '100%'
                }
              }
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

        // Force wager re-validation
        Dispatcher.sendAction('UPDATE_WAGER', {});

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

var ProvablyFairTabContent = React.createClass({
  displayName: 'ProvablyFairTabContent',
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    worldStore.on(worldStore.events.NEXT_HASH_CHANGED, this._onStoreChange);
  },
  componentWillUnmount: function() {
    worldStore.off(worldStore.events.NEXT_HASH_CHANGED, this._onStoreChange);
  },
  _onClientSeedChange: function(e) {
    Dispatcher.sendAction('UPDATE_CLIENT_SEED', { str: e.target.value });
  },
  _onRefreshClientSeed: function() {
    var seed = helpers.randomUint32();
    Dispatcher.sendAction('UPDATE_CLIENT_SEED', {
      num: seed,
      str: seed.toString()
    });
  },
  // Prevent accidental bets when editing input fields when hotkeys
  // are enabled
  _onInputFocus: function() {
    if (worldStore.state.hotkeysEnabled) {
      Dispatcher.sendAction('DISABLE_HOTKEYS');
    }
  },
  render: function() {
    return (
      el.div(
        {className: 'panel panel-default'},
        el.div(
          {className: 'panel-body'},
          el.p(
            null,
            'Read more: ',
            el.a(
              {href: 'https://www.moneypot.com/provably-fair'},
              'https://www.moneypot.com/provably-fair'
            )
          ),
          el.p(
            {},
            'Next Bet Hash: ',
            el.code(
              null,
              worldStore.state.nextHash
            )
          ),
          el.p(
            {},
            'Your Client Seed: ',
            el.span(
              {
                style: worldStore.state.clientSeed.error ?
                  { color: 'red' } : {}
              },
              worldStore.state.clientSeed.error ?
                errorConstantToMessage(worldStore.state.clientSeed.error) : ''
            ),
            el.input(
              {
                className: 'form-control',
                value: worldStore.state.clientSeed.str,
                onChange: this._onClientSeedChange,
                onFocus: this._onInputFocus
              }
            ),
            el.span(
              {className: 'help-block'},
              el.a(
                {
                  href:'javascript:void(0)',
                  onClick: this._onRefreshClientSeed
                },
                'Refresh'
              ),
              ' Seed must be a number. Minimum: 0, Maximum: 2',
              el.sup(null, 32),
              '-1'
            )
          )
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
        {className: 'table table-condensed'},
        el.thead(
          null,
          el.tr(
            null,
            el.th(null, 'ID'),
            el.th(null, 'Wager'),
            el.th(null, 'Profit'),
            el.th(null, 'Table'),
            el.th(null, 'Provably Fair?')
            //config.debug ? el.th(null, 'Dump') : ''
          )
        ),
        el.tbody(
          null,
          worldStore.state.pucks.toArray().map(function(puck) {
            return el.tr(
              {
                key: puck.id,
              },
              // bet id
              el.td(
                null,
                puck.isRevealed ?
                  el.a(
                    {
                      href: config.mp_browser_uri + '/bets/' + puck.bet.bet_id
                    },
                    puck.bet.bet_id
                  ) :
                  '?'
              ),
              // wager
              el.td(
                null,
                puck.wager_satoshis/100 + ' bits'
              ),
              // profit
              puck.isRevealed ?
                // revealed
                el.td(
                  {style: {color: puck.profit_satoshis >= 0 ? 'green' : 'red'}},
                  (puck.profit_satoshis >= 0 ?
                    '+' + helpers.floor10(puck.profit_satoshis/100, -2) :
                    helpers.floor10(puck.profit_satoshis/100, -2)) + ' bits'
                ) :
                // not revealed
                el.td(
                  null,
                  '?'
                ),
              // table
              el.td(
                null,
                el.div(
                  {
                    style: {
                      backgroundColor: config.hexColors.fade[puck.color],
                      width: '200px',
                      borderRadius: '5px',
                      display: 'inline-block',
                      textAlign: 'center',
                      fontWeight: 'bold',
                      color: config.hexColors.dark[puck.color]
                    }
                  },
                  el.span(
                    {
                      style: {
                        fontFamily: 'Courier New'
                      }
                    },
                    puck.isRevealed ?
                      helpers.calcMultiplier(
                        puck.wager_satoshis, puck.profit_satoshis
                      ).toString() + 'x' :
                      '?'
                  )
                )
              ),
              // verified?
              !puck.isRevealed ?
                el.td(null, '?') :
                el.td(
                  null,
                  puck.isFair ?
                    el.span(
                      {
                        className: 'glyphicon glyphicon-ok',
                        style: {
                          color: 'green'
                        }
                      }
                    ) :
                  el.span(
                    {
                      className: 'glyphicon glyphicon-remove',
                      style: {
                        color: 'red'
                      }
                    }
                  )
                )
            );
          }).reverse()
        )
      )
    );
  }
});

var EdgeLegend = React.createClass({
  displayName: 'EdgeLegend',
  shouldComponentUpdate: function() {
    return false;
  },
  render: function() {
    var edges = {};
    _.pairs(config.pay_tables).forEach(function(pair) {
      var color = pair[0];
      var table = pair[1];
      edges[color] = helpers.round10(helpers.payTableToEdge(table), -2);
    });
    return el.div(
      {},
      el.span(
        {
          className: 'text-muted'
        },
        'House Edges: '),
      el.ul(
        {
          className: 'list-inline',
          style: {
            display: 'inline-block'
          }
        },
        _.pairs(edges).map(function(pair) {
          var color = pair[0];
          var edge = pair[1];
          return el.li(
            {
              key: color
            },
            el.div(
              {
                style: {
                  backgroundColor: config.hexColors.fade[color],
                  width: '50px',
                  height: '20px',
                  borderRadius: '5px',
                  textAlign: 'center',
                  color: config.hexColors.dark[color],
                  fontWeight: 'bold',
                  fontFamily: 'Courier New'
                }
              },
              //color
              edge + '%'
            )
          );
        })
      )
    )
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
      {
        className: 'nav nav-tabs',
        style: {
          marginBottom: '15px'
        }
      },
      el.li(
        {className: worldStore.state.currTab === 'MY_BETS' ? 'active' : ''},
        el.a(
          {
            href: 'javascript:void(0)',
            onClick: this._makeTabChangeHandler('MY_BETS')
          },
          'My Bets'
        )
      ),
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
      !worldStore.state.user ?
        null :
        el.li(
          {
            className: worldStore.state.currTab === 'PROVABLY_FAIR' ? 'active' : ''
          },
          el.a(
            {
              href: 'javascript:void(0)',
              onClick: this._makeTabChangeHandler('PROVABLY_FAIR')
            },
            el.span(
              {
                style: worldStore.state.clientSeed.error ?
                  {color: 'red'} : {}
              },
              'Provably Fair ')
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
    worldStore.on('change', this._onStoreChange);
  },
  componentWillUnmount: function() {
    worldStore.off('change', this._onStoreChange);
  },
  render: function() {
    switch(worldStore.state.currTab) {
      case 'FAUCET':
        return React.createElement(FaucetTabContent, null);
      case 'MY_BETS':
        return React.createElement(MyBetsTabContent, null);
      case 'PROVABLY_FAIR':
        return React.createElement(ProvablyFairTabContent, null);
      default:
        alert('Unsupported currTab value: ', worldStore.state.currTab);
        break;
    }
  }
});

var SessionStats = React.createClass({
  displayName: 'SessionStats',
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    worldStore.on(worldStore.events.SESSION_STATS_UPDATE, this._onStoreChange);
  },
  componentWillUnmount: function() {
    worldStore.off(worldStore.events.SESSION_STATS_UPDATE, this._onStoreChange);
  },
  _onResetSessionStats: function() {
    Dispatcher.sendAction('UPDATE_SESSION_STATS', {
      revealedBetCount: 0,
      // If use resets while pucks are active, then include the
      // currently active pucks in the totalBetCount so it
      // doesn't get out of sync
      totalBetCount: _.keys(worldStore.state.activePucks).length,
      profit: 0
    });
  },
  render: function() {
    if (!worldStore.state.user) {
      return el.div();
    }

    return el.div(
      {
        className: 'text-right text-muted'
      },
      el.ul(
        {
          className: 'list-inline',
          style: {
            display: 'inline-block'
          }
        },
        el.li(
          null,
          worldStore.state.sessionStats.revealedBetCount,
          '/',
          worldStore.state.sessionStats.totalBetCount,
          ' bets '
        ),
        el.li(
          {},
          worldStore.state.sessionStats.profit >= 0 ?
            el.span(
              {
                style: {
                  color: config.hexColors.dark.green,
                  backgroundColor: config.hexColors.fade.green,
                  padding: '3px',
                  borderRadius: '5px'
                }
              },
              '+' + helpers.floor10(worldStore.state.sessionStats.profit/100, -2)
            ) :
            el.span(
              {
                style: {
                  color: config.hexColors.dark.red,
                  backgroundColor: config.hexColors.fade.red,
                  padding: '3px',
                  borderRadius: '5px'
                }
              },
              helpers.floor10(worldStore.state.sessionStats.profit/100, -2)
            ),
          ' bits profit'

        )
      ),
      // Reset stats button
      el.button(
        {
          type: 'button',
          className: 'btn-link',
          onClick: this._onResetSessionStats
        },
        'Reset Stats'
      )
    );
  }
});

var HotkeyToggle = React.createClass({
  displayName: 'HotkeyToggle',
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    worldStore.on(worldStore.events.HOTKEYS_CHANGED, this._onStoreChange);
    worldStore.on('change', this._onStoreChange);
  },
  componentWillUnmount: function() {
    worldStore.off(worldStore.events.HOTKEYS_CHANGED, this._onStoreChange);
    worldStore.off('change', this._onStoreChange);
  },
  _onClick: function() {
    Dispatcher.sendAction('TOGGLE_HOTKEYS');
  },
  render: function() {
    // Don't display to guests
    if (!worldStore.state.user) {
      return el.div();
    }

    return (
      el.div(
        {
          className: 'text-center',
          style: {
            marginBottom: '10px'
          }
        },
        el.button(
          {
            type: 'button',
            className: 'btn btn-default btn-sm',
            onClick: this._onClick,
            style: { marginTop: '-15px' }
          },
          'Hotkeys: ',
          worldStore.state.hotkeysEnabled ?
            el.span(
              {
                className: 'label label-success',
                style: { textShadow: 'none' }
              },
              'ON') :
          el.span(
            {
              className: 'label label-default',
              style: { textShadow: 'none' }
            },
            'OFF')
        )
      )
    );
  }
});

var PremadePayouts = React.createClass({
  displayName: 'PremadePayouts',
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    worldStore.on(worldStore.events.PAYOUT_EDITOR_TOGGLED, this._onStoreChange);
    worldStore.on(worldStore.events.RENDERED_PUCKS_CHANGED, this._onStoreChange);
  },
  componentWillUnmount: function() {
    worldStore.off(worldStore.events.PAYOUT_EDITOR_TOGGLED, this._onStoreChange);
    worldStore.off(worldStore.events.RENDERED_PUCKS_CHANGED, this._onStoreChange);
  },
  _onPayoutEditorToggle: function() {
    console.log('test');
    Dispatcher.sendAction('TOGGLE_PAYOUT_EDITOR');
  },
  ////////////////////////////////////////////////////////////
  _premadeUrls: (function() {
    var premadeQueryStrings = {
      'Traditional':
      '?green=3+1.5+1.4+1.3+1.2+0.2+1.1+1.1+1.1+1.1+1.1+0.2+1.2+1.3+1.4+1.5+3&yellow=23+9+3+2+1.5+1.2+1.1+1+0.4+1+1.1+1.2+1.5+2+3+9+23&red=121+47+13+5+3+1.4+1+0.5+0.3+0.5+1+1.4+3+5+13+47+121',
      'Center Snipe':
      '?green=2+2+1+0.2+0+0+1.1+1.2+1.5+1.2+1.1+0+0+0.2+1+2+2&yellow=2+2+1+0.7+0+0+0+1.1+3+1.1+0+0+0+0.7+1+2+2&red=2+2+1+0+0+0+0.1+0.5+4+0.5+0.1+0+0+0+1+2+2',
	 'Jackpot Board':
      '?green=3+1.5+1.4+1.3+1.2+0.2+1.1+1.1+1.1+1.1+1.1+0.2+1.2+1.3+1.4+1.5+3&yellow=23+9+3+2+1.5+1.2+1.1+1+0.4+1+1.1+1.2+1.5+2+3+9+23&red=999+47+13+5+3+2+0.8+0.5+0.0+0.5+0.8+2+3+5+13+47+999',
      'Pick-A-Side':
      '?green=12+5+5+5+4.9+4+1.2+1.1+1+0+0+0+0+0+0+0+0&yellow=0+0+0+0+0+0+0+0+1+1.1+1.2+4+4.9+5+5+5+12&red=0+0+0+0+0+1+1.1+1.1+1+1.1+1.1+1.1+0+0+0+0+0',
      '@cowbay\'s Board':
      '?green=32+7.5+3.5+2.89+2+1.5+1.08+1+0+1+1.08+1.5+2+2.89+3.5+7.5+32&yellow=0+0+0+0+0+0+0.0+1.38+2.59+1.38+0+0+0+0+0+0+0&red=0+0+0+0+1.1+2+1.1+1+0.23+1+1.1+2+1.1+0+0+0+0'
    };

    // ex: 'http://localhost:5000' + '/index-dev.html'
    // Does not end in trailing slash
    var baseUrl = window.location.origin + window.location.pathname;

    var out = {};

    _.pairs(premadeQueryStrings).forEach(function(pair) {
      out[pair[0]] = baseUrl + pair[1];
    });

    // Map of PayoutName -> Url w/ query string
    return out;

  })(),
  ////////////////////////////////////////////////////////////
  render: function() {

    var stillAnimatingPucks = _.keys(worldStore.state.renderedPucks).length > 0;

    return (
      el.ul(
        {className: 'list-unstyled list-inline'},
        el.li(
          null,
          'Try these boards:'
        ),
        _.pairs(this._premadeUrls).map(function(pair) {
          var payoutName = pair[0];
          var payoutUrl = pair[1];

          return el.li(
            {
              key: payoutName
            },
            el.a(
              {
                className: 'btn btn-default',
                href: payoutUrl,
                disabled: stillAnimatingPucks
              },
              payoutName
            )
          )
        }),
        el.li(
          null,
          el.button(
            {
              className: 'btn btn-link',
              type: 'button',
              onClick: this._onPayoutEditorToggle
            },
            worldStore.state.showPayoutEditor ?
              'Hide Payout Editor' : 'Show Payout Editor'
          )
        )
      )
    );
  }
});

// Only display if worldStore.state.showPayoutEditor
var PayoutEditor = React.createClass({
  displayName: 'PayoutEditor',
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    worldStore.on(worldStore.events.PAYOUT_EDITOR_TOGGLED, this._onStoreChange);
    worldStore.on(worldStore.events.RENDERED_PUCKS_CHANGED, this._onStoreChange);
    worldStore.on(worldStore.events.BANKROLL_CHANGED, this._onStoreChange);
  },
  componentWillUnmount: function() {
    worldStore.off(worldStore.events.PAYOUT_EDITOR_TOGGLED, this._onStoreChange);
    worldStore.off(worldStore.events.RENDERED_PUCKS_CHANGED, this._onStoreChange);
    worldStore.off(worldStore.events.BANKROLL_CHANGED, this._onStoreChange);
  },
  _toStrings: function(array) {
    return array.map(function(n) { return n.toString(); });
  },
  getInitialState: function() {
    // User-editable payout strings that must validate before they are
    // transformed into numbers and updated in worldStore
    return {
      green: {
        error: undefined,
        strings: this._toStrings(worldStore.state.pay_tables.green),
      },
      yellow: {
        error: undefined,
        strings: this._toStrings(worldStore.state.pay_tables.yellow)
      },
      red: {
        error: undefined,
        strings: this._toStrings(worldStore.state.pay_tables.red)
      }
    };
  },
  _onReset: function() {
    // Reset state back to how it is in the store
    var originalState =  {
      green: {
        error: undefined,
        strings: this._toStrings(worldStore.state.pay_tables.green),
      },
      yellow: {
        error: undefined,
        strings: this._toStrings(worldStore.state.pay_tables.yellow)
      },
      red: {
        error: undefined,
        strings: this._toStrings(worldStore.state.pay_tables.red)
      }
    };

    this.replaceState(originalState);
  },
  // Validates current state and sets errors if necessary
  _validateState: function() {
    // House edge must be >= 0.80
    var self = this;
    var _state = _.clone(this.state);
    ['green', 'yellow', 'red'].forEach(function(color) {
      var edge = helpers.payTableToEdge(helpers.toFloats(_state[color].strings));
      console.log(color + ' edge:', edge);

      // Will be first invalid payout in this row or undefined if valid
      var invalidPayout = _.some(
        _state[color].strings,
        _.negate(helpers.isValidPayout)
      );

      if (invalidPayout) {
        _state[color].error = 'INVALID_PAYOUT';
      } else if (edge < 0.80) {
        _state[color].error = 'EDGE_TOO_SMALL';
      } else {
        // Valid
        _state[color].error = null;
      }

    });

    // Now update state
    this.setState(_state);
  },
  _onSave: function() {
    //worldStore.state.pay_tables.dark = this.state.payoutNums;
    //rerenderPayTable('dark');
    console.log('saving...', this.state.red);
    // kanvas.updatePayout('dark', this.state.payoutNums);
    // kanvas.renderAll();
    Dispatcher.sendAction('UPDATE_PAY_TABLES', {
      green: helpers.toFloats(this.state.green.strings),
      yellow: helpers.toFloats(this.state.yellow.strings),
      red: helpers.toFloats(this.state.red.strings)
    });
  },
  _makeChangeHandler: function(color, idx) {
    var self = this;
    return function _changeHandler(e) {
      // TODO: Validate that it's legit float

      var oldState = _.clone(self.state);
      oldState[color].strings[idx] = e.target.value.slice(0, 4);
      self.setState(oldState);
      self._validateState();
    };
  },
  // takes color string, returns number
  _calcHouseEdge: function(color) {
    var n = helpers.round10(
      helpers.payTableToEdge(
        helpers.toFloats(this.state[color].strings)
      ),
      -2
    );

    // return n.toFixed(2).toString() + '%';
    return n;
  },
  _translateErrorConstant: (function() {
    var constants = {
      'EDGE_TOO_SMALL': 'House edge must be at least 0.80%',
      'INVALID_PAYOUT': 'At least one payout in this row is invalid'
    };
    return function(constant) {
      return constants[constant];
    };
  })(),
  // :: String
  _generateShareUrl: function() {

    var shareUrl = window.location.origin + window.location.pathname +
      '?green=' + this.state.green.strings.join('+') +
      '&yellow=' + this.state.yellow.strings.join('+') +
      '&red=' + this.state.red.strings.join('+');

    return shareUrl;
  },
  // When user clicks "Select All" above the share textarea
  _onSelectAllClick: function(e) {
    var node = this.refs.shareUrlRef.getDOMNode();
    node.focus();
    node.select();
  },
  _onHideEditor: function() {
    Dispatcher.sendAction('TOGGLE_PAYOUT_EDITOR');
  },
  // This is a super approximation
  // Returns number (bits) or undefined if it cannot be calculated from
  // current payout state due to error
  _calcMaxBet: function(color) {
    // Short-circuit on error
    if (this.state[color].error) {
      return;
    }
    var maxPayout = _.max(helpers.toFloats(this.state[color].strings));

    // Don't divide by zero
    if (maxPayout === 0) {
      return;
    }

    var edge = this._calcHouseEdge(color);
    var maxBet = worldStore.state.bankroll / (maxPayout-1) * (edge/100);
    return helpers.floor10(maxBet/100, -2);
  },
  // Prevent accidental bets when editing input fields when hotkeys
  // are enabled
  _onInputFocus: function() {
    if (worldStore.state.hotkeysEnabled) {
      Dispatcher.sendAction('DISABLE_HOTKEYS');
    }
  },
  render: function() {
    var self = this;

    if (!worldStore.state.showPayoutEditor) {
      return el.div();
    }

    var isError = _.some(['green', 'yellow', 'red'], function(color) {
      return self.state[color].error;
    });

    // True if pucks are still on the board
    var stillAnimatingPucks = _.keys(worldStore.state.renderedPucks).length > 0;

    return (
      el.div(
        {className: 'panel panel-default'},
        el.div(
          {className: 'panel-heading'},
          el.button(
            {
              className: 'btn btn-link pull-right',
              type: 'button',
              onClick: this._onHideEditor
            },
            'Hide'
          ),
          el.h5(
            null,
            'Payout Editor'
          )
        ),
        el.div(
          {className: 'panel-body'},
          el.p(
            {},
            'You can set your own payouts (the colored rows beneath the pyramid), but here are some tips:',
            el.ul(
              null,
              el.li(
                null,
                'House edge must be at least ',
                 el.code(null, '0.80%')
              ),
              el.li(
                null,
                'Payouts can have up to three significant digits, i.e. ',
                el.code(null, 'XXX'),
                ' or ',
                el.code(null, 'XX.X'),
                ' or ',
                el.code(null, 'X.XX')
              ),
              el.li(
                null,
                'The max bet allowed on a row is determined by the row\'s highest payout and house edge',
                el.ul(
                  null,
                  el.li(
                    null,
                    'The max bets below are highly approximated and based off a ',
                    el.a(
                      {
                        href: 'https://www.moneypot.com/investment',
                        target: '_blank'
                      },
                      'Moneypot bankroll'
                    ),
                    ' of ',
                    el.code(
                      null,
                      helpers.commafy(helpers.floor10(worldStore.state.bankroll/100, -2))
                    ),
                    ' bits'
                  )
                )
                // ,
                // el.ul(
                //   null,
                //   el.li(
                //     null,
                //     'You can approximate the max bet of a row with: ',
                //     el.code(null, 'moneypotBankroll / maxRowPayout * houseEdge')
                //   ),
                //   el.li(
                //     null,
                //     ' For example, if a row contains ',
                //     el.code(null, '999x'),
                //     ' and ',
                //     el.a(
                //       {href: 'https://www.moneypot.com/investment'},
                //       'Moneypot\'s current bankroll'
                //     ),
                //     ' is 150 BTC, then the max bet for that row is approximately: ',
                //     el.br(),
                //     el.code(null, '150,000,000 / 999 * 0.009 = ~1351 bits'
                //     )
                //   )
                // )
              )
            )
          ),
          el.hr(),
          ['green', 'yellow', 'red'].map(function(color) {
            return el.div(
              {
                key: color
              },
              el.p(
                {
                  style: {
                    //border: '1px solid ' + config.hexColors.dark[color]
                  }
                },
                el.span(
                  {
                    style: {
                      color: config.hexColors.dark[color],
                      backgroundColor: config.hexColors.fade[color],
                      padding: '2px 3px',
                      width: '100px',
                      display: 'inline-block',
                      textAlign: 'center'
                    }
                  },
                  _.capitalize(color)
                ),
                ' ',
                el.span(
                  {
                    style: {
                      fontFamily: 'Courier New'
                    }
                  },
                  el.span(
                    {
                      style: {
                        borderBottom: '1px solid #333',
                        borderColor: (self.state[color].error === 'EDGE_TOO_SMALL' || _.isNaN(self._calcHouseEdge(color))) ?
                          'red' : '#333',
                        color: (self.state[color].error === 'EDGE_TOO_SMALL' || _.isNaN(self._calcHouseEdge(color))) ?
                          'red' : '#333'
                      }
                    },
                    (self.state[color].error && self.state[color].error !== 'EDGE_TOO_SMALL') ?
                      'XXX' :
                      self._calcHouseEdge(color).toFixed(2) + '%'
                  ),
                  ' house edge, '
                ),
                // Max bet approximation
                el.span(
                  {
                    style: {
                      fontFamily: 'Courier New'
                    }
                  },
                  '~',
                  (function() {
                    // Number (bits) or undefined (error)
                    var maxBet = self._calcMaxBet(color);

                    return el.span(
                      {
                        style: {
                          borderBottom: '1px solid #333'
                        }
                      },
                      maxBet ?
                        helpers.commafy(helpers.round10(maxBet, 3)) :
                        //helpers.commafy(maxBet) :
                        'XXX'
                    );
                  })(),
                  ' bits max bet'
                ),
                // Display error if there is one
                ' ',
                self.state[color].error ?
                  el.span(
                    {
                      style: {
                        color: 'red'
                      }
                    },
                    self._translateErrorConstant(self.state[color].error)
                  ) :
                  ''

              ),
              self.state[color].strings.map(function(payoutStr, idx) {
                return el.span(
                  { key: color + '-' + idx },
                  el.input(
                    {
                      key: color + '-' + idx,
                      type: 'text',
                      className: 'form-control input-sm payout-control',
                      value: payoutStr,
                      style: {
                        fontFamily: 'Courier New',
                        width: '55px',
                        display: 'inline-block',
                        marginLeft: '5px',
                        marginBottom: '10px',
                        borderColor: (self.state[color].error === 'INVALID_PAYOUT' && !helpers.isValidPayout(payoutStr)) ?
                          'red' : '#ccc',
                        color: (self.state[color].error === 'INVALID_PAYOUT' && !helpers.isValidPayout(payoutStr)) ?
                          'red' : '#333'
                      },
                      onChange: self._makeChangeHandler(color, idx),
                      onFocus: self._onInputFocus
                    }
                  ),
                  // show divider after idx 3, 7, 8, 12
                  _.contains([3, 7, 8, 12], idx) ?
                    el.span({
                      dangerouslySetInnerHTML: {
                        __html: ' &mdash;'
                      }
                    })
                    : ''
                );
              })
            );
          }),
          //
          // Share payouts
          //
          el.div(
            {},
            'Share these payouts:',
            isError ?
              '' :
              el.button(
                {
                  onClick: this._onSelectAllClick,
                  className: 'btn btn-default btn-xs'
                },
                'Select'
              ),
            isError ?
              ' --' :
              el.textarea(
                {
                  ref: 'shareUrlRef',
                  className: 'form-control',
                  //disabled: true,
                  readOnly: true,
                  value: this._generateShareUrl()

                }
              )
          )
        ),
        el.div(
          {className: 'panel-footer'},
          el.button(
            {
              type: 'button',
              className: 'btn btn-default',
              onClick: this._onReset
            },
            'Reset'
          ),
          ' ',
          el.button(
            {
              type: 'button',
              className: 'btn btn-primary',
              onClick: this._onSave,
              // Disable if there's any validation error
              // Also disable until pucks are finished animating, wait til they are removed
              disabled: isError || stillAnimatingPucks
            },
            'Save'
          ),
          ' ',
          isError ?
            el.span(
              {
                style: {
                  color: 'red'
                }
              },
              'You must fix the errors before you can save'
            ) :
            stillAnimatingPucks ?
              el.span(
                {
                  style: {
                    color: 'red'
                  }
                },
                'Wait until pucks are finished animating'
              ) :
              'Clicking save will update the current payouts below the pyramid'
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
      React.createElement(Navbar, null),
      el.div(
        {className: 'row'},
        el.div(
          {className: 'col-sm-7 board-container'},
          React.createElement(Board, null)
        ),
        el.div(
          {className: 'col-sm-5'},
          //React.createElement(EdgeLegend, null),
          React.createElement(BetBox, null),
          React.createElement(HotkeyToggle, null),
          React.createElement(TryMe, null),
          React.createElement(ChatBox, null)
        )
      ),
      React.createElement(PremadePayouts, null),
      React.createElement(PayoutEditor, null),
      el.div(
        {style: {marginTop: '15px'}},
        React.createElement(Tabs, null)
      ),
      React.createElement(TabContent, null)
    );
  }
});

////////////////////////////////////////////////////////////
// Mount the app component

React.render(
  React.createElement(App, null),
  document.getElementById('app')
);

////////////////////////////////////////////////////////////

if (!worldStore.state.accessToken) {
  Dispatcher.sendAction('STOP_LOADING');
  connectToChatServer();
} else {
  // Load user from accessToken
  MoneyPot.getTokenInfo({
    success: function(data) {
      console.log('Successfully loaded user from tokens endpoint', data);
      var user = data.auth.user;
      Dispatcher.sendAction('UPDATE_USER', user);
      // Validate wager on load
      Dispatcher.sendAction('UPDATE_WAGER', {});
    },
    error: function(err) {
      console.log('Error hitting token endpoint:', err);
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
    },
    error: function(err) {
      console.log('Error fetching next bet hash:', err);
    }
  });
  // Get Moneypot's current bankroll
  MoneyPot.getBankroll({
    success: function(data) {
      Dispatcher.sendAction('UPDATE_BANKROLL', data.balance);
    },
    error: function(err) {
      console.log('Error fetching Moneypot\'s bankroll:', err);
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

$(document).on('keydown', function(e) {
  var J = 74, K = 75, L = 76, C = 67, X = 88, keyCode = e.which;

  // Bail is hotkeys aren't currently enabled to prevent accidental bets
  if (!worldStore.state.hotkeysEnabled) {
    return;
  }

  // Bail if user has a modifier key pressed down
  if (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey) {
    return;
  }

  // Bail if it's not a key we care about
  if (!_.contains([J, K, L, C, X], keyCode)) {
    return;
  }

  // TODO: Remind self which one I need and what they do ^_^;;
  e.stopPropagation();
  e.preventDefault();

  switch(keyCode) {
    case C:  // Increase wager
      var upWager = Math.max(1, worldStore.state.wager.num * 2);
      Dispatcher.sendAction('UPDATE_WAGER', {
        num: upWager,
        str: upWager.toString()
      });
      break;
    case X:  // Decrease wager
      var downWager = Math.max(1, Math.floor(worldStore.state.wager.num / 2));
      Dispatcher.sendAction('UPDATE_WAGER', {
        num: downWager,
        str: downWager.toString()
      });
      break;
    case J:
      $('#green-btn').click();
      break;
    case K:
      $('#yellow-btn').click();
      break;
    case L:
      $('#red-btn').click();
      break;
    default:
      return;
  }
});

window.addEventListener('message', function(event) {
  if (event.origin === config.mp_browser_uri && event.data === 'UPDATE_BALANCE') {
    Dispatcher.sendAction('REFRESH_USER');
  }
}, false);

function connectToChatServer() {
  console.log('Connecting to chat server. AccessToken:',
              worldStore.state.accessToken);

  socket = io(config.chat_uri);

  socket.on('connect', function() {
    console.log('[socket] Connected');

    socket.on('disconnect', function() {
      console.log('[socket] Disconnected');
    });

    socket.on('system_message', function(text) {
      console.log('[socket] Received system message:', text);
      Dispatcher.sendAction('NEW_SYSTEM_MESSAGE', text);
    });

    // message is { text: String, user: { role: String, uname: String} }
    socket.on('new_message', function(message) {
      console.log('[socket] Received chat message:', message);
      Dispatcher.sendAction('NEW_CHAT_MESSAGE', message);
    });

    socket.on('user_muted', function(data) {
      console.log('[socket] User muted:', data);
    });

    socket.on('user_unmuted', function(data) {
      console.log('[socket] User unmuted:', data);
    });

    socket.on('user_joined', function(user) {
      console.log('[socket] User joined:', user);
      Dispatcher.sendAction('USER_JOINED', user);
    });

    socket.on('user_left', function(user) {
      console.log('[socket] User left:', user);
      Dispatcher.sendAction('USER_LEFT', user);
    });

    // Received when your client doesn't comply with chat-server api
    socket.on('client_error', function(text) {
      console.warn('[socket] Client error:', text);
    });

    // Once we connect to chat server, we send an auth message to join
    // this app's lobby channel.

    // A hash of the current user's accessToken is only sent if you have one
    var hashedToken;
    if (worldStore.state.accessToken) {
      hashedToken =  CryptoJS.SHA256(worldStore.state.accessToken).toString();
    }
    var authPayload = { app_id: config.app_id, hashed_token: hashedToken};
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
