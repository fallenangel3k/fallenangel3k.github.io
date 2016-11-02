// bit-exo.com V3.0.0
// Copyright 2016 bit-exo.com

///////////////////////
// All trademarks,trade names,images,contents,snippets,codes,including text
// and graphics appearing on the site are intellectual property of their
// respective owners, including in some instances,"bit-exo.com".
// All rights reserved.
//contact: admin@bit-exo.com
//////////////////////////
var GameEle = document.getElementsByClassName('Game_Box')
var windowsize = 839;//GameEle[0].firstChild.clientWidth -8;
config.scale_plinko = windowsize / 839;

/// Plinko payout size
config.n = 17;  //MIN 3 MAX is betStore.state.pay_tables.ROW1.length
///////
config.hexColors = {
  dark: {
    'ROW1': '#424242',
    'ROW2': '#77b300',
    'ROW3': '#2a9fd6',
    'ROW4': '#9933cc',
    'ROW5': '#ff8800'
  }
};
config.puck_diameter = 45 * config.scale_plinko;
config.peg_diameter = 4 * config.scale_plinko;
config.top_margin = 50 * config.scale_plinko;
config.side_margin = 3 * config.scale_plinko;
config.payTableRowHeight = 30 * config.scale_plinko;
config.payTableFontSize = 14 * config.scale_plinko;

config.levels = config.n - 1;
config.table_height = config.top_margin + (config.levels * config.puck_diameter) + (config.levels * config.peg_diameter) - 120;
config.table_width =  config.side_margin*2 + (config.n * config.puck_diameter) + (config.n * config.peg_diameter);

var Puck = function(data) {
  this.id = generateId();

  this.bet = data.bet;
  this.isFair = data.isFair;
  this.row = -1;
  this.path = data.path;
  this.isTest = !!data.isTest;
  this.onComplete = data.onComplete || function() {};
  this.onSlot = data.onSlot || function() {};
  this.onPeg = data.onPeg || function() {};
  // isRevealed is set to true once it hits a slot and the user is made aware of
  // the outcome
  this.isRevealed = false;

  this.color = data.color || getRandomColor();
  switch(this.color) {
    case 'ROW5':
      var imgElement = document.getElementById('row5gear');
      break;
    case 'ROW4':
      var imgElement = document.getElementById('row4gear');
      break;
    case 'ROW3':
      var imgElement = document.getElementById('row3gear');
      break;
    case 'ROW2':
      var imgElement = document.getElementById('row2gear');
      break;
    case 'ROW1':
      var imgElement = document.getElementById('row1gear');
      break;
  }

  this._puck = new fabric.Image(imgElement, {
    top: 1,
    left: config.top_margin + Math.floor(config.n/2) * config.puck_diameter + Math.floor(config.n/2) * config.peg_diameter - (21 * config.scale_plinko),
    hasControls: false,
    hasRotatingPoint: false,
    selectable: false,
    originX: 'center',
    originY: 'center',
    scaleX: config.scale_plinko,
    scaleY: config.scale_plinko
  });

  var self = this;

  canvas.add(self._puck);

  this.move = function(dir, cb) {
    switch(dir) {
      case 'L':
        self._puck.animate('left', '-=' + (24.5 * config.scale_plinko).toString(), {
          easing: fabric.util.ease.easeOutExpo
        });
        self._puck.animate('angle', '-=90', {
          easing: fabric.util.ease.easeOutQuad
        });
        break;
      case 'R':
        self._puck.animate('left', '+=' + (24.5 * config.scale_plinko).toString(), {
          easing: fabric.util.ease.easeOutExpo
        });
        self._puck.animate('angle', '+=90', {
          easing: fabric.util.ease.easeOutQuad
        });
        break;
    }

    // TODO: Make this function less bouncy. Taken from fabricjs source.
    // Currently unmodified
    var customEaseOutBounce = function(t, b, c, d) {
      if ((t /= d) < (1 / 2.75)) {
        return c * (7.5625 * t * t) + b;
      } else if (t < (2/2.75)) {
        return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
      } else if (t < (2.5/2.75)) {
        return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
      } else {
        return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;
      }
    };

    self._puck.animate('top', '+=' + (31.5 * config.scale_plinko).toString(), {
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
      self._puck.animate('top', '+=' + (35 * config.scale_plinko).toString(), {
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
          case 'ROW1':
            return config.payTableRowHeight*1 + 20;
          case 'ROW2':
            return config.payTableRowHeight*2 + 20;
          case 'ROW3':
            return config.payTableRowHeight*3 + 20;
          case 'ROW4':
            return config.payTableRowHeight*4 + 20;
          case 'ROW5':
            return config.payTableRowHeight*5 + 20;
          default:
            alert('Unsupported puck color: ' + puckColor);
        }
      };

      var dropHeight = getDropHeight(self.color);
      self._puck.animate('top', '+=' + dropHeight, {
        onComplete: function() {

          // When puck lands in slot, call the onSlot callback
          self.isRevealed = true;
          self.onSlot(self);

          self._puck.animate('angle', '+=1080', {
            easing: fabric.util.ease.easeOutQuad,
            duration: 2000
          });

          // Enlarge the puck once it lands in its hole
          self._puck.animate('scaleX', '+=0.5', {
            duration: 2000,
            easing: fabric.util.ease.easeOutExpo
          });
          self._puck.animate('scaleY', '+=0.5', {
            duration: 2000,
            easing: fabric.util.ease.easeOutExpo
          });
        }
      });

      self._puck.animate('opacity', 0, {
        duration: 2000,
        //easing: fabric.util.ease.easeOutExpo,
        onComplete: function() {
          // When done fading out, remove it from active pucks map
          self.onComplete(self);

          // Remove it from the canvas
          canvas.remove(self._puck);
        }
      });
    }
  };
};

// :: String
var getRandomColor = function() {
  var colors = ['ROW1','ROW2', 'ROW3', 'ROW4', 'ROW5'];
  return colors[Math.floor(Math.random()*colors.length)];
};

// Generates a unique id, used for uniquely tagging object/elements
// :: Int
var generateId = (function() {
  var currentId = 0;
  return function _generateId() {
    return ++currentId;
  };
})();

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
      var pegcolor;

      switch (row % 4){
        case 0:
          pegcolor = 'rgba(255,179,0,1.0) 0px 8px 18px';
        break;
        case 1:
          pegcolor = 'rgba(119,179,0,1.0) 0px 8px 18px';
        break;
        case 2:
          pegcolor = 'rgba(42,159,214,1.0) 0px 8px 18px';
        break;
        case 3:
          pegcolor = 'rgba(153,51,204,1.0) 0px 8px 18px';
        break;
  /*      case 4:
          pegcolor = 'rgba(42,159,214,1.0) 0px 8px 18px';
        break;*/
        default:
          pegcolor = 'rgba(255,255,255,1.0) 0px 8px 18x';
        break;
      }

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
          shadow: pegcolor//'rgba(0,0,0,1.0) 0px 8px 20px'
        }));
      }
    }
  };

  var _drawHorizontalLine = function() {
    // Draw horizontal line
    var rowCount = config.n;
    var rect = new fabric.Rect({
      top: config.top_margin + (rowCount * config.puck_diameter * 0.65) + (rowCount * config.peg_diameter * 0.65) - (22 * config.scale_plinko),
      left: config.side_margin,
      height: 2,
      selectable: false,
      width: (rowCount * config.puck_diameter) + (rowCount * config.peg_diameter)
    });
    self.canvas.add(rect);
  };

  var _drawDividers = function() {
    // Draw divider marks in the line
    for (var idx = 0; idx < 17; ++idx) {
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

  var _drawBackground = function() {
    var rect = new fabric.Rect({
      top: 0,
      left: 0,
      height: config.table_height - (145 * config.scale_plinko),
      selectable: false,
      width: config.table_width,
      fill: '#424242'

    });
    self.canvas.add(rect);
  };

    var _drawPayout = function(row) {
      var offsets = {
        ROW1: 1,
        ROW2: 2,
        ROW3: 3,
        ROW4: 4,
        ROW5: 5
      };
      var thisrow;
      var thiscolor;
      switch(row){
        case 0:
          thisrow = betStore.state.pay_tables.ROW1;
          thiscolor = config.hexColors.dark.ROW1;
          break;
        case 1:
          thisrow = betStore.state.pay_tables.ROW2;
          thiscolor = config.hexColors.dark.ROW2;
          break;
        case 2:
          thisrow = betStore.state.pay_tables.ROW3;
          thiscolor = config.hexColors.dark.ROW3;
          break;
        case 3:
          thisrow = betStore.state.pay_tables.ROW4;
          thiscolor = config.hexColors.dark.ROW4;
          break;
        case 4:
          thisrow = betStore.state.pay_tables.ROW5;
          thiscolor = config.hexColors.dark.ROW5;
          break;

      }
      // Draw custom paytable pay_tables
      thisrow.forEach(function(multiplier, idx) {
        var rowCount = config.n - 1;
        var rect = new fabric.Rect({
          top: config.payTableRowHeight*(row+1) + config.top_margin + (rowCount * config.puck_diameter*0.65) + (rowCount * config.peg_diameter*0.65) - (17 * config.scale_plinko),
          left: config.side_margin + (config.puck_diameter + config.peg_diameter) * idx - 4,
          height: config.payTableRowHeight,
          selectable: false,
          width: 80,
          fill: thiscolor//config.hexColors.dark[row],
        });
        canvas.add(rect);
        var text = new fabric.Text((multiplier + String.fromCharCode(215) + '  ').slice(0, 4), {
          angle: 0,
          top: config.payTableRowHeight*(row+1) + config.top_margin + (rowCount * config.puck_diameter*0.65) + (rowCount * config.peg_diameter*0.65) - (12 * config.scale_plinko),
          left: config.side_margin + (config.puck_diameter + config.peg_diameter) * idx + 7,
          fontSize: config.payTableFontSize,
          stroke: '#ffffff',
          fill: thiscolor,//config.hexColors.dark[row],
          selectable: false,
          fontFamily: 'Courier New',
          fontWeight: 'normal',
          backgroundColor: thiscolor//config.hexColors.dark[row]
        });
        canvas.add(text);
      });
    };

  this.renderAll = function() {
    // Clear canvas and all event listeners on it
    self.canvas.dispose();
    self.canvas.renderOnAddRemove = false;
  //  _drawBackground();
    _drawPegs();
    _drawHorizontalLine();
    _drawPayout(0);
    _drawPayout(1);
    _drawPayout(2);
    _drawPayout(3);
    _drawPayout(4);
    self.canvas.renderOnAddRemove = true;
    _drawDividers();
  };

};

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

var ClassicBoard = React.createClass({
  displayName: 'ClassicBoard',
  shouldComponentUpdate: function() {
    return false;
  },
  componentDidMount: function() {
    console.log('Mounting ClassicBoard...');
    // prep canvas
    //initializeBoard();
    canvas = new fabric.Canvas('board');
    canvas.selection = false;

    var GameEle = document.getElementsByClassName('Game_Box')
    var windowsize = GameEle[0].firstChild.clientWidth -8;

    config.scale_plinko = windowsize / 839;
    if (config.scale_plinko > 1.0){
      config.scale_plinko = 1.0;
    }
    config.puck_diameter = 45 * config.scale_plinko;
    config.peg_diameter = 4 * config.scale_plinko;
    config.top_margin = 50 * config.scale_plinko;
    config.side_margin = 3 * config.scale_plinko;
    config.payTableRowHeight = 30 * config.scale_plinko;
    config.payTableFontSize = 14 * config.scale_plinko;

    config.table_height = config.top_margin + (config.levels * config.puck_diameter) + (config.levels * config.peg_diameter) -(120 * config.scale_plinko);
    config.table_width =  config.side_margin*2 + (config.n * config.puck_diameter) + (config.n * config.peg_diameter);

    canvas.setDimensions({
      width: config.table_width,
      //width: GameEle[0].clientWidth,
      height: config.table_height+ config.payTableRowHeight//10// - 50
    });

    // mutate global kanvas reference
    kanvas = new Kanvas(canvas);
    kanvas.renderAll();
    paint();
  },
  render: function() {
    return el.canvas(
      {
        id: 'board',
        style: {
           marginTop:'-15px',
           marginLeft: '-15px'
        }
      },
      null
    );
  }
});


var PlinkoBetButton = React.createClass({
  displayName: 'PlinkoBetButton',
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    worldStore.on('change', this._onStoreChange);
    betStore.on('change', this._onStoreChange);
    worldStore.on('plinko_game_change', this._onStoreChange);
  },
  componentWillUnmount: function() {
    worldStore.off('change', this._onStoreChange);
    betStore.off('change', this._onStoreChange);
    worldStore.on('plinko_game_change', this._onStoreChange);
  },
  getInitialState: function() {
    return { waitingForServer: false };
  },

  _onStartwager: function(n){
    var self = this;
    return function() {
      console.log('Placing plinko bet...');

      var pay_table = betStore.state.pay_tables[n];

      if (!pay_table) {
        alert('Unsupported pay table for row: ' + n);
        return;
      }

      var hash = betStore.state.nextHash;
      console.assert(typeof hash === 'string');

      var wagerSatoshis = helpers.convCoinTypetoSats(betStore.state.wager.num);// * 100;

      // Handle tests
      if (wagerSatoshis === 0) {
            Dispatcher.sendAction('SPAWN_PUCK', {
              color: n,
              path: generatePath(),
              wager_satoshis: 0,
              profit_satoshis: 0,
              isTest: true
            });
          return;
      }

      // Indicate that we are waiting for server response
      self.setState({ waitingForServer: true });

      var params = {
        hash: hash,
        client_seed: betStore.state.clientSeed.num, //set custom seed
        wager: wagerSatoshis,
        pay_table: pay_table
      };

      socket.emit('plinko_bet', params, function(err, bet) {
        if (err) {
          console.log('[socket] plinko_bet failure:', err);
          self.setState({ waitingForServer: false });
          console.log('auto bet stopped from error');
          Dispatcher.sendAction('STOP_RUN_AUTO');
          if(err.error == 'INVALID_HASH '){
            alert('Bet Stopped due to INVALID_HASH, Fetching new hash automatically');
            gethashfromsocket();
          }
          return;
        }
        console.log('[socket] plinko_bet success:', bet);
        // We don't get this info from the API, so assoc it for our use
          bet.meta = {
            cond: '>',
            number: 99.99,
            hash: hash,
            kind: 'PLINKO',
            isFair: CryptoJS.SHA256(bet.secret + '|' + bet.salt).toString() === hash
          };
          // Sync up with the bets we get from socket
          bet.wager = wagerSatoshis;
          bet.uname = worldStore.state.user.uname;

          var last_params = {
            hash: hash,
            salt: bet.salt,
            secret: bet.secret,
            seed: betStore.state.clientSeed.num,
            id: bet.id
          }
          Dispatcher.sendAction('SET_LAST_FAIR', last_params);

          // Update next bet hash
          Dispatcher.sendAction('SET_NEXT_HASH', bet.next_hash);
          // Update user balance
          Dispatcher.sendAction('SET_REVEALED_BALANCE');
          Dispatcher.sendAction('UPDATE_USER', {
            balance: worldStore.state.user.balance + bet.profit
          });

          // Dispatcher.sendAction('NEW_BET', bet);
          if (worldStore.state.animate_enable){
              Dispatcher.sendAction('SPAWN_PUCK', {
                color: n,
                path: bet.outcome.split(''),
                wager_satoshis: wagerSatoshis,
                profit_satoshis: bet.profit,
                bet: bet,
                isFair: bet.meta.isFair
              });

          }else{
            Dispatcher.sendAction('NEW_BET', bet);
            if (!worldStore.state.first_bet)
                  {Dispatcher.sendAction('SET_FIRST');}
          }
          self.setState({
            waitingForServer: false
          });

          if (betStore.state.randomseed){
              var newseed = randomUint32();//Math.floor(Math.random()*(Math.pow(2,32)-1));
              var str = newseed.toString();
              Dispatcher.sendAction('UPDATE_CLIENT_SEED', { str: str });
            }

          if (AutobetStore.state.Run_Autobet){
            if(config.debug){console.log('Auto_bet routine enabled');}
              Dispatcher.sendAction('AUTOBET_ROUTINE',bet);
            }else {
            // Force re-validation of wager
            if(config.debug){console.log('Auto_bet routine disabled');}
            Dispatcher.sendAction('UPDATE_WAGER', { str: betStore.state.wager.str});
          }
      });
    }
  },
  render: function() {
    var innerNode;
    var error = betStore.state.wager.error || betStore.state.clientSeed.error;

    if (worldStore.state.isLoading) {
      // If app is loading, then just disable button until state change
      innerNode = el.button(
        {type: 'button', disabled: true, className: 'btn btn-lg btn-block btn-default'},
        'Loading...'
      );
    } else if (error) {
      // If there's a betbox error, then render button in error state
      var errorTranslations = {
        'INVALID_SEED': 'Invalid Seed',
        'SEED_TOO_HIGH':'Seed too high',
        'CANNOT_AFFORD_WAGER': 'Balance too low',
        'INVALID_WAGER': 'Invalid wager',
        'WAGER_TOO_LOW': 'Wager too low',
        'WAGER_TOO_PRECISE': 'Wager too precise',
      };

      innerNode = el.button(
        {type: 'button',
         disabled: true,
         className: 'btn btn-lg btn-block btn-danger'},
        errorTranslations[error] || 'Invalid bet'
      );
    } else if (worldStore.state.user) {
      // If user is logged in, let them submit bet
      innerNode = el.div(null,
      el.div(
        {className: 'btn-group btn-group-justified'},
        el.div(
          {className: 'btn-group'},
          el.button(
            { id: 'bet-ROW1',
              type: 'button',
              className: 'btn btn-default btn-lg btn-block',
              style: { fontWeight: 'bold', background: '#424242'},
              onClick: this._onStartwager('ROW1'),
              disabled: !!this.state.waitingForServer || worldStore.state.plinko_running
             },
            'ROW 1', worldStore.state.hotkeysEnabled ? el.kbd(null, 'A') : ''
          )
        ),
        el.div(
          {className: 'btn-group'},
          el.button(
            { id: 'bet-ROW2',
              type: 'button',
              className: 'btn btn-success btn-lg btn-block',
              style: { fontWeight: 'bold', background: '#77b300'},
              onClick: this._onStartwager('ROW2'),
              disabled: !!this.state.waitingForServer || worldStore.state.plinko_running
             },
            'ROW 2', worldStore.state.hotkeysEnabled ? el.kbd(null, 'S') : ''
          )
        ),
        el.div(
          {className: 'btn-group'},
          el.button(
            { id: 'bet-ROW3',
              type: 'button',
              className: 'btn btn-primary btn-lg btn-block',
              style: { fontWeight: 'bold', background: '#2a9fd6'},
              onClick: this._onStartwager('ROW3'),
              disabled: !!this.state.waitingForServer || worldStore.state.plinko_running
             },
            'ROW 3', worldStore.state.hotkeysEnabled ? el.kbd(null, 'D') : ''
          )
        ),
        el.div(
          {className: 'btn-group'},
          el.button(
            { id: 'bet-ROW4',
              type: 'button',
              className: 'btn btn-info btn-lg btn-block',
              style: { fontWeight: 'bold', background: '#9933cc'},
              onClick: this._onStartwager('ROW4'),
              disabled: !!this.state.waitingForServer || worldStore.state.plinko_running
             },
            'ROW 4', worldStore.state.hotkeysEnabled ? el.kbd(null, 'F') : ''
          )
        ),
        el.div(
          {className: 'btn-group'},
          el.button(
            { id: 'bet-ROW5',
              type: 'button',
              className: 'btn btn-warning btn-lg btn-block',
              style: { fontWeight: 'bold', background: '#ff8800'},
              onClick: this._onStartwager('ROW5'),
              disabled: !!this.state.waitingForServer || worldStore.state.plinko_running
             },
            'ROW 5', worldStore.state.hotkeysEnabled ? el.kbd(null, 'G') : ''
          )
        )
      )
      );
    }else {
      // If user isn't logged in, give them link to /oauth/authorize
      innerNode = el.a(
        {
          href: config.mp_browser_uri + '/oauth/authorize' +
            '?app_id=' + config.app_id +
            '&redirect_uri=' + config.redirect_uri,
          className: 'btn btn-lg btn-block btn-success'
        },
        'Login with MoneyPot'
      );
    }

      return el.div(
        null,

        innerNode
      );
    }
});

var PlinkoBetHistory = React.createClass({
  displayName: 'PlinkoBetHistory',
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    worldStore.on('new_user_bet', this._onStoreChange);
    worldStore.on('change', this._onStoreChange);
  },
  componentWillUnmount: function() {
    worldStore.off('new_user_bet', this._onStoreChange);
    worldStore.off('change', this._onStoreChange);
  },

  render: function(){
    var last_bet = '';
    var last_wager = helpers.convNumtoStr(100);
    var last_profit = helpers.convNumtoStr(100);
    last_bet = '';

    if (worldStore.state.first_bet){
     last_bet = (worldStore.state.bets.data[worldStore.state.bets.end].bet_id||worldStore.state.bets.data[worldStore.state.bets.end].id);
     last_wager = helpers.convNumtoStr(worldStore.state.bets.data[worldStore.state.bets.end].wager);
     last_profit = worldStore.state.bets.data[worldStore.state.bets.end].profit;
    }

    return el.div(
      null,
      el.div(
        {className:'well well-sm col-xs-12'},
        el.div(
          { className: 'col-xs-4'},
          el.div(
          {className: 'text'},
          'Last Bet: ',
          el.span(
              {className: 'text'},
              el.a(
                {
                  href: config.mp_browser_uri + '/bets/' + last_bet,
                  target: '_blank'
                },
                last_bet
              )
          )
         )
        ),
        el.div(
          { className: 'col-xs-4'},
          el.div(
            {className: 'text'},
            'Wager: ',
          el.span(
            {className: 'text'},
            last_wager,
            worldStore.state.coin_type
          )
         )
        ),
        el.div(
          { className: 'col-xs-4'},
          el.div(
          {className: 'text'},
          'Profit: ',
          el.span(
            {className: 'text', style: { color: last_profit > 0 ? 'green' : 'red'}},
           last_profit > 0 ? '+' + helpers.convNumtoStr(last_profit) : helpers.convNumtoStr(last_profit),
           worldStore.state.coin_type
          )
        )
        )
      )
    );
  }

});

var Plinko_Stats = React.createClass({
displayName: 'Plinko_Stats',
_onStoreChange: function() {
this.forceUpdate();
},
componentDidMount: function() {
worldStore.on('new_user_bet', this._onStoreChange);
//betStore.on('change', this._onStoreChange);
},
componentWillUnmount: function() {
worldStore.off('new_user_bet', this._onStoreChange);
//betStore.off('change', this._onStoreChange);
},
render: function() {
return el.div(
null,
el.div(
  {className:'well well-sm col-xs-12',style:{marginBottom:'-15px'}},
  el.div({className:'row'},
    el.div({className:'col-xs-4 col-sm-2'},'Bets: ' + worldStore.state.plinkostats.bets.toString()),
    el.div({className:'col-xs-4 col-sm-2'},'Wins: ' + worldStore.state.plinkostats.wins.toString()),
    el.div({className:'col-xs-4 col-sm-2'},'Losses: ' + worldStore.state.plinkostats.loss.toString()),
    el.div({className:'col-xs-6 col-sm-3'},'Wagered: ' + helpers.convNumtoStr(worldStore.state.plinkostats.wager) + worldStore.state.coin_type),
    el.div({className:'col-xs-6 col-sm-3'},'Profit: ' + helpers.convNumtoStr(worldStore.state.plinkostats.profit) + worldStore.state.coin_type)//,
  //el.span({className:'glyphicon glyphicon-refresh'})
    )
  )
);
}
});

var PlinkoAutoToggles = React.createClass({
displayName: 'DiceAutoToggles',
_onStoreChange: function() {
this.forceUpdate();
},
componentDidMount: function() {
AutobetStore.on('switch_change', this._onStoreChange);
},
componentWillUnmount: function() {
AutobetStore.off('switch_change', this._onStoreChange);
},
_validatenum: function(newStr,sw) {
var num = parseInt(newStr, 10);
// If num is a number, ensure it's at least 1 bit
if (isFinite(num)) {
num = Math.max(num, 1);
}
// Ensure str is a number
if (isNaN(num) || /[^\d]/.test(num.toString())) {
return;
}else if (num < 1) {
return;
}else if (num > 10000) {
return;
}else {
switch(sw){
  case 1:
    return Dispatcher.sendAction('UPDATE_SWITCH1_TARGET', num);
    break;
  case 2:
    return Dispatcher.sendAction('UPDATE_SWITCH2_TARGET', num);
    break;
  case 3:
    return Dispatcher.sendAction('UPDATE_SWITCH3_TARGET', num);
    break;
}
}
},
_ontargetChange1: function(e){
var str = e.target.value;
this._validatenum(str,1);
},
_ontargetChange2: function(e){
var str = e.target.value;
this._validatenum(str,2);
},
_ontargetChange3: function(e){
var str = e.target.value;
this._validatenum(str,3);
},
_oncheck1: function(){
Dispatcher.sendAction('TOGGLE_DSWITCH1_ENABLE', null);
},
_oncheck2: function(){
Dispatcher.sendAction('TOGGLE_DSWITCH2_ENABLE', null);
},
_oncheck3: function(){
Dispatcher.sendAction('TOGGLE_DSWITCH3_ENABLE', null);
},
_onClick: function() {
 $('dropdown-toggle').dropdown();
},
_ActionClick1: function(type){
  return function(){
    if(config.debug){console.log('click action 1: ' + type);}
    Dispatcher.sendAction('SET_D_SW1_MODE', type);
  };
},
_ModeClick1: function(type){
  return function(){
    if(config.debug){console.log('click mode 1: ' + type);}
    Dispatcher.sendAction('SET_DSWITCH1_TYPE', type);
  };
},
_ActionClick2: function(type){
  return function(){
    if(config.debug){console.log('click action 2: ' + type);}
    Dispatcher.sendAction('SET_D_SW2_MODE', type);
  };
},
_ModeClick2: function(type){
  return function(){
    if(config.debug){console.log('click mode 2: ' + type);}
    Dispatcher.sendAction('SET_DSWITCH2_TYPE', type);
  };
},
_ActionClick3: function(type){
  return function(){
    if(config.debug){console.log('click action 3: ' + type);}
    Dispatcher.sendAction('SET_D_SW3_MODE', type);
  };
},
_ModeClick3: function(type){
  return function(){
    if(config.debug){console.log('click mode 3: ' + type);}
    Dispatcher.sendAction('SET_DSWITCH3_TYPE', type);
  };
},
render: function() {
  switch (AutobetStore.state.switch1.mode){
    case 'ROW +':
    case 'ROW -':
    case 'STOP AUTO':
    case 'RESET TO BASE':
    break;
    default:
      Dispatcher.sendAction('SET_D_SW1_MODE', 'ROW +');
    break;
  }
  switch (AutobetStore.state.switch2.mode){
    case 'ROW +':
    case 'ROW -':
    case 'STOP AUTO':
    case 'RESET TO BASE':
    break;
    default:
      Dispatcher.sendAction('SET_D_SW2_MODE', 'ROW -');
    break;
  }
  switch (AutobetStore.state.switch3.mode){
    case 'ROW +':
    case 'ROW -':
    case 'STOP AUTO':
    case 'RESET TO BASE':
    break;
    default:
      Dispatcher.sendAction('SET_D_SW3_MODE', 'STOP AUTO');
    break;
  }
return el.div(
null,
el.div({className:'row'},
el.div(
  {className: 'well well-sm col-xs-12'},
  el.div(
    null,//{className:'row'},
    el.div({className:'col-xs-1'},
      el.input(
          {
          //id: 'checkboxStyle',
          //name: 'numberOfBet',
          type: 'checkbox',
          defaultChecked: AutobetStore.state.switch1.enable ? 'checked':'',
          onChange: this._oncheck1,
          value: 'false'
          }
        )
    ),
    el.div(
      {className: 'form-group col-xs-10' },
      el.div({className: 'input-group'},
        el.div({className:'input-group-addon',style: {fontWeight: 'bold'}},'If'),
        el.input({
              type: 'text',
              value: AutobetStore.state.switch1.str,
              className: 'form-control input-sm',
              style: {fontWeight: 'bold'},
              onChange: this._ontargetChange1
            }
          ),
        //el.div({className:'input-group-addon'},'Wins')
        el.span(
            {className: 'input-group-btn'},
            el.button(
                         {
                           type:'button',
                           className:'btn btn-sm btn-primary btn-group-justified dropdown-toggle',
                           style:{fontWeight: 'bold'},
                           "data-toggle":'dropdown',
                           "aria-haspopup":'true',
                           "aria-expanded":'false',
                           onClick:this._onClick
                         },
                         AutobetStore.state.switch1.type, el.span({className:'caret'},'')
                       ),
                       el.ul({className:'dropdown-menu'},
                         el.li(null, el.a({onClick: this._ModeClick1('WINS')},'WINS')),
                         el.li(null, el.a({onClick: this._ModeClick1('LOSS')},'LOSS')),
                         el.li(null, el.a({onClick: this._ModeClick1('BETS')},'BETS')),
                         el.li(null, el.a({onClick: this._ModeClick1('C.WINS')},'C.WINS')),
                         el.li(null, el.a({onClick: this._ModeClick1('C.LOSS')},'C.LOSS'))
                       )
            )
        ),
        el.div(null,
        el.button(
                     {
                      id: 'D-sw1_mode',
                       type:'button',
                       className:'btn btn-sm btn-primary btn-group-justified dropdown-toggle',
                       "data-toggle":'dropdown',
                       "aria-haspopup":'true',
                       "aria-expanded":'false',
                       onClick:this._onClick
                     },
                     AutobetStore.state.switch1.mode, el.span({className:'caret'},'')
                   ),
                   el.ul({className:'dropdown-menu'},
                   el.li(null, el.a({onClick: this._ActionClick1('ROW +')},'ROW +')),
                   el.li(null, el.a({onClick: this._ActionClick1('ROW -')},'ROW -')),
                   el.li(null, el.a({onClick: this._ActionClick1('STOP AUTO')},'STOP AUTO')),
                   el.li(null, el.a({onClick: this._ActionClick1('RESET TO BASE')},'RESET TO BASE'))
                   )
        )
    ),
    el.div(
      {className: 'col-xs-12',style: { marginTop: '-25px', marginBottom: '-10px' }},
      el.hr(null)
    ),
    el.div({className:'col-xs-1'},
      el.input(
          {
          type: 'checkbox',
          defaultChecked: AutobetStore.state.switch2.enable ? 'checked':'',
          onChange: this._oncheck2,
          value: 'false'
          }
        )
    ),
    el.div(
      {className: 'form-group col-xs-10', style:{marginBottom:'-8px'} },
      el.div({className: 'input-group'},
        el.div({className:'input-group-addon',style: {fontWeight: 'bold'}},'If'),
        el.input(
            {
              type: 'text',
              value: AutobetStore.state.switch2.str,
              className: 'form-control input-sm',
              style: {fontWeight: 'bold'},
              onChange: this._ontargetChange2
            }
          ),
        el.span(
            {className: 'input-group-btn'},
              el.button(
                           {
                             type:'button',
                             className:'btn btn-sm btn-primary btn-group-justified dropdown-toggle',
                             style:{fontWeight: 'bold'},
                             "data-toggle":'dropdown',
                             "aria-haspopup":'true',
                             "aria-expanded":'false',
                             onClick:this._onClick
                           },
                           AutobetStore.state.switch2.type, el.span({className:'caret'},'')
                         ),
                         el.ul({className:'dropdown-menu'},
                           el.li(null, el.a({onClick: this._ModeClick2('WINS')},'WINS')),
                           el.li(null, el.a({onClick: this._ModeClick2('LOSS')},'LOSS')),
                           el.li(null, el.a({onClick: this._ModeClick2('BETS')},'BETS')),
                           el.li(null, el.a({onClick: this._ModeClick2('C.WINS')},'C.WINS')),
                           el.li(null, el.a({onClick: this._ModeClick2('C.LOSS')},'C.LOSS'))
                         )
            )
        ),
        el.div(null,
        el.button(
                     {
                      id: 'D-sw2_mode',
                       type:'button',
                       className:'btn btn-sm btn-primary btn-group-justified dropdown-toggle',
                       "data-toggle":'dropdown',
                       "aria-haspopup":'true',
                       "aria-expanded":'false',
                       onClick:this._onClick
                     },
                     AutobetStore.state.switch2.mode, el.span({className:'caret'},'')
                   ),
                   el.ul({className:'dropdown-menu'},
                   el.li(null, el.a({onClick: this._ActionClick2('ROW +')},'ROW +')),
                   el.li(null, el.a({onClick: this._ActionClick2('ROW -')},'ROW -')),
                   el.li(null, el.a({onClick: this._ActionClick2('STOP AUTO')},'STOP AUTO')),
                   el.li(null, el.a({onClick: this._ActionClick2('RESET TO BASE')},'RESET TO BASE'))
                 )
        )
    ),
    el.div(
      {className: 'col-xs-12',style: { marginBottom: '-10px' }},
      el.hr(null)
    ),
    el.div({className:'col-xs-1'},
      el.input(
          {
          type: 'checkbox',
          defaultChecked: AutobetStore.state.switch3.enable ? 'checked':'',
          onChange: this._oncheck3,
          value: 'false'
          }
        )
    ),
    el.div(
      {className: 'form-group col-xs-10', style:{marginBottom:'-8px'} },
      el.div({className: 'input-group'},
        el.div({className:'input-group-addon',style: {fontWeight: 'bold'}},'If'),
        el.input(
            {
              type: 'text',
              value: AutobetStore.state.switch3.str,
              className: 'form-control input-sm',
              style: {fontWeight: 'bold'},
              onChange: this._ontargetChange3
            }
          ),
        el.span(
            {className: 'input-group-btn'},
              el.button(
                           {
                             type:'button',
                             className:'btn btn-sm btn-primary btn-group-justified dropdown-toggle',
                             style:{fontWeight: 'bold'},
                             "data-toggle":'dropdown',
                             "aria-haspopup":'true',
                             "aria-expanded":'false',
                             onClick:this._onClick
                           },
                           AutobetStore.state.switch3.type, el.span({className:'caret'},'')
                         ),
                         el.ul({className:'dropdown-menu'},
                           el.li(null, el.a({onClick: this._ModeClick3('WINS')},'WINS')),
                           el.li(null, el.a({onClick: this._ModeClick3('LOSS')},'LOSS')),
                           el.li(null, el.a({onClick: this._ModeClick3('BETS')},'BETS')),
                           el.li(null, el.a({onClick: this._ModeClick3('C.WINS')},'C.WINS')),
                           el.li(null, el.a({onClick: this._ModeClick3('C.LOSS')},'C.LOSS'))
                         )
            )
        ),
        el.div(null,
        el.button(
                     {
                      id: 'D-sw3_mode',
                       type:'button',
                       className:'btn btn-sm btn-primary btn-group-justified dropdown-toggle',
                       "data-toggle":'dropdown',
                       "aria-haspopup":'true',
                       "aria-expanded":'false',
                       onClick:this._onClick
                     },
                     AutobetStore.state.switch3.mode, el.span({className:'caret'},'')
                   ),
                   el.ul({className:'dropdown-menu'},
                   el.li(null, el.a({onClick: this._ActionClick3('ROW +')},'ROW +')),
                   el.li(null, el.a({onClick: this._ActionClick3('ROW -')},'ROW -')),
                   el.li(null, el.a({onClick: this._ActionClick3('STOP AUTO')},'STOP AUTO')),
                   el.li(null, el.a({onClick: this._ActionClick3('RESET TO BASE')},'RESET TO BASE'))
                 )
        )
    )
  )
)
)
);
}
});

var P_AutoBetButton = React.createClass({
displayName: 'P_AutoBetButton',
_onStoreChange: function() {
this.forceUpdate();
},
componentDidMount: function() {
//  worldStore.on('new_user_bet', this._onStoreChange);
AutobetStore.on('p_loss_change', this._onStoreChange);
AutobetStore.on('p_win_change', this._onStoreChange);
AutobetStore.on('change', this._onStoreChange);
},
componentWillUnmount: function() {
//  worldStore.off('new_user_bet', this._onStoreChange);
AutobetStore.off('p_loss_change', this._onStoreChange);
AutobetStore.off('p_win_change', this._onStoreChange);
AutobetStore.off('change', this._onStoreChange);
},
_onClickStart: function(){
Dispatcher.sendAction('START_RUN_AUTO', null);
},
_onClickStop: function(){
//Dispatcher.sendAction('STOP_R_AUTO_BET', null);
AutobetStore.state.Stop_Autobet = true;
setTimeout(function(){Dispatcher.sendAction('STOP_RUN_AUTO', null);},3000);
},
//_onClickToggle: function(){
//  Dispatcher.sendAction('CHANGE_P_ROW', null);
//},
_oncheck: function(){
  Dispatcher.sendAction('TOGGLE_ANIMATION', null);
},
_onClick: function() {
 $('dropdown-toggle').dropdown();
},
_ActionClick: function(row){
  return function(){
    if(config.debug){console.log('Change Row: ' + row);}
    Dispatcher.sendAction('CHANGE_P_ROW', row);
  };
},
render: function(){
var innerNode;
var error = AutobetStore.state.lossmul.error || AutobetStore.state.winmul.error || betStore.state.clientSeed.error
if (error) {
// If there's anerror, then render button in error state
var errorTranslations = {
  'INVALID_SEED': 'Invalid Seed',
  'SEED_TOO_HIGH':'Seed too high',
  'CANNOT_AFFORD_WAGER': 'Balance too low',
  'INVALID_WAGER': 'Invalid wager',
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
}else if (worldStore.state.user) {
// If user is logged in, let them submit bet
  if (AutobetStore.state.Run_Autobet){
    innerNode =
    el.button(
          {
            id: 'Stop-Auto-Bet',
            type: 'button',
            className: 'btn btn-md btn-danger btn-block',
            onClick: this._onClickStop
          },
          'STOP AUTOBET'
        );
  }else{
    innerNode = el.button(
      {
        id: 'start_auto_plinko',
        type: 'button',
        className:'btn btn-md btn-block btn-info',
        onClick: this._onClickStart,
        disabled: helpers.convCoinTypetoSats(betStore.state.wager.num) > worldStore.state.user.balance
      },
      el.span({style:{fontWeight:'bold'}}, 'START AUTOBET')
    )
    }
} else {
// If user isn't logged in, give them link to /oauth/authorize
innerNode = el.a(
  {
    href: config.mp_browser_uri + '/oauth/authorize' +
      '?app_id=' + config.app_id +
      '&redirect_uri=' + config.redirect_uri,
    className: 'btn btn-md btn-block btn-success'
  },
  'Login with MoneyPot'
);
}

return el.div(null,
el.div({className:'row'},
  el.div(
    {className:'button col-xs-12 col-sm-6 col-md-4 col-lg-3'},
    innerNode
  ),//AutobetStore.state.P_rowsel
  el.div(
    {className:'col-xs-12 col-sm-6 col-md-3 col-lg-2'},
    el.div(null,
    el.button(
                 {
                  id: 'D-sw2_mode',
                   type:'button',
                   className:'btn btn-sm btn-primary btn-group-justified dropdown-toggle',
                   "data-toggle":'dropdown',
                   "aria-haspopup":'true',
                   "aria-expanded":'false',
                   onClick:this._onClick
                 },
                 'ROW ' + AutobetStore.state.P_rowsel, el.span({className:'caret'},'')
               ),
               el.ul({className:'dropdown-menu'},
               el.li(null, el.a({onClick: this._ActionClick(1)},'ROW 1')),
               el.li(null, el.a({onClick: this._ActionClick(2)},'ROW 2')),
               el.li(null, el.a({onClick: this._ActionClick(3)},'ROW 3')),
               el.li(null, el.a({onClick: this._ActionClick(4)},'ROW 4')),
               el.li(null, el.a({onClick: this._ActionClick(5)},'ROW 5'))
             )
    )
  ),
  el.div({className: 'col-xs-6 col-sm-4 col-md-4 col-lg-2'},
    el.input({
            type: 'checkbox',
            defaultChecked: worldStore.state.animate_enable ? 'checked':'',
            onChange: this._oncheck,
            value: 'false'
            }
        ),
        el.span({style:{fontWeight:'bold'}},'Enable Animation')
  )
)

);
}

});


var PlinkoAdvancedSettings = React.createClass({
  displayName:'PlinkoAdvancedSettings',

  render: function(){
    return el.div(
      {className: 'col-xs-12'},
        el.div(
          {className: 'col-xs-12 col-sm-6 col-md-4'},
          React.createElement(BetBoxClientSeed, null)
        ),
        el.div(
          {className:'col-xs-12 col-sm-6 col-md-4'},
          React.createElement(HouseEdgeDropdown, null)
        ),
        el.div(
          {className: 'col-xs-12 col-sm-6 col-md-4'},
          React.createElement(BetBoxMaxProfit, null)
        ),
        el.div(
          {className: 'col-xs-12',style: {marginTop: '-25px'}},
          el.hr(null)
        ),
        el.div({className:'well well-sm col-xs-12',style: {marginTop: '-15px'}},
          el.div(
            {className: 'col-xs-12 col-sm-6 col-md-4',style: {marginTop: '-15px',marginBottom:'-10px'}},
            React.createElement(AutobetStopHigh, null)
          ),
          el.div(
            {className: 'col-xs-12 col-sm-6 col-md-4',style: {marginTop: '-15px',marginBottom:'-10px'}},
            React.createElement(AutobetStopLow, null)
          ),
          el.div(
            {className: 'col-xs-12 col-sm-6 col-md-4',style: {marginTop: '-15px',marginBottom:'-10px'}},
            React.createElement(Auto_Delay, null)
          )
        ),
        el.div({className:'col-xs-12 col-sm-6 col-md-4',style: {marginTop: '-15px'}},
          React.createElement(AutoOnLoss, null)
        ),
        el.div({className:'col-xs-12 col-sm-6 col-md-4',style: {marginTop: '-15px'}},
          React.createElement(AutoOnWin, null)
        ),
        el.div({className:'col-xs-12 col-sm-6 col-md-4',style: {marginTop: '-15px'}},
          React.createElement(PlinkoAutoToggles, null)
        ),
      //  el.div({className:'col-xs-12',style:{marginTop:'-15px'}},
        React.createElement(Auto_Stats,null)
      //  )

    );
  }

});

var PayoutEditor = React.createClass({
  displayName: 'PayoutEditor',
  _onStoreChange: function() {
    this.forceUpdate();
    canvas.renderAll();
    //paint();
  },
  componentDidMount: function() {
    worldStore.on('change', this._onStoreChange);
    betStore.on('change_plinko',this._onStoreChange);
    worldStore.on('plinko_game_change', this._onStoreChange);
    worldStore.on('plinko_render_change',this._onStoreChange);
  },
  componentWillUnmount: function() {
    worldStore.off('change', this._onStoreChange);
    betStore.off('change_plinko',this._onStoreChange);
    worldStore.off('plinko_game_change', this._onStoreChange);
    worldStore.off('plinko_render_change',this._onStoreChange);
  },
  _toStrings: function(array) {
    return array.map(function(n) { return n.toString(); });
  },

  getInitialState: function() {
    // User-editable payout strings that must validate before they are
    // transformed into numbers and updated in worldStore
    return {
      ROW1: {
        error: undefined,
        strings: this._toStrings(betStore.state.pay_tables.ROW1),
      },
      ROW2: {
        error: undefined,
        strings: this._toStrings(betStore.state.pay_tables.ROW2),
      },
      ROW3: {
        error: undefined,
        strings: this._toStrings(betStore.state.pay_tables.ROW3)
      },
      ROW4: {
        error: undefined,
        strings: this._toStrings(betStore.state.pay_tables.ROW4)
      },
      ROW5: {
        error: undefined,
        strings: this._toStrings(betStore.state.pay_tables.ROW5)
      }
    };
  },
  _onReset: function() {
    // Reset state back to how it is in the store
    var originalState =  {
      ROW1: {
        error: undefined,
        strings: this._toStrings(betStore.state.pay_tables.ROW1),
      },
      ROW2: {
        error: undefined,
        strings: this._toStrings(betStore.state.pay_tables.ROW2),
      },
      ROW3: {
        error: undefined,
        strings: this._toStrings(betStore.state.pay_tables.ROW3)
      },
      ROW4: {
        error: undefined,
        strings: this._toStrings(betStore.state.pay_tables.ROW4)
      },
      ROW5: {
        error: undefined,
        strings: this._toStrings(betStore.state.pay_tables.ROW5),
      }
    };

    this.replaceState(originalState);
  },
  // Validates current state and sets errors if necessary
  _validateState: function() {
    // House edge must be >= 0.80
    var self = this;
    var _state = _.clone(this.state);
    ['ROW1', 'ROW2', 'ROW3', 'ROW4', 'ROW5'].forEach(function(row) {
      var edge = helpers.payTableToEdge(helpers.toFloats(_state[row].strings));
      //console.log(row + ' edge:', edge);

      // Will be first invalid payout in this row or undefined if valid
      var invalidPayout = _.some(
        _state[row].strings,
        _.negate(helpers.isValidPayout)
      );

      if (invalidPayout) {
        _state[row].error = 'INVALID_PAYOUT';
      } else if (edge < 0.80) {
        _state[row].error = 'EDGE_TOO_SMALL';
      } else {
        // Valid
        _state[row].error = null;
      }

    });

    // Now update state
    this.setState(_state);
  },
  _onSave: function() {
    console.log('saving...', this.state.ROW5);
    Dispatcher.sendAction('UPDATE_PAY_TABLES', {
      ROW1: helpers.toFloats(this.state.ROW1.strings),
      ROW2: helpers.toFloats(this.state.ROW2.strings),
      ROW3: helpers.toFloats(this.state.ROW3.strings),
      ROW4: helpers.toFloats(this.state.ROW4.strings),
      ROW5: helpers.toFloats(this.state.ROW5.strings)
    });
    Dispatcher.sendAction('CHANGE_GAME_TAB', 'LOADING');
    setTimeout(function(){
      Dispatcher.sendAction('CHANGE_GAME_TAB', 'PLINKO');
    },200);
  },
  _makeChangeHandler: function(row, idx) {
    var self = this;
    return function _changeHandler(e) {
      // TODO: Validate that it's legit float

      var oldState = _.clone(self.state);
      oldState[row].strings[idx] = e.target.value.slice(0, 4);
      self.setState(oldState);
      self._validateState();
    };
  },
  // takes row string, returns number
  _calcHouseEdge: function(row) {
    var n = helpers.round10(
      helpers.payTableToEdge(
        helpers.toFloats(this.state[row].strings)
      ),
      -2
    );
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

  _onHideEditor: function() {
    Dispatcher.sendAction('TOGGLE_PAYOUT_EDITOR');
  },
  // This is a super approximation
  // Returns number (bits) or undefined if it cannot be calculated from
  // current payout state due to error
  _calcMaxBet: function(row) {
    // Short-circuit on error
    if (this.state[row].error) {
      return;
    }
    var maxPayout = _.max(helpers.toFloats(this.state[row].strings));

    // Don't divide by zero
    if (maxPayout === 0) {
      return;
    }
    //'Invested: ' + helpers.convSatstoCointype(worldStore.state.bankrollbalance).toString() + ' ' + worldStore.state.coin_type
    var edge = this._calcHouseEdge(row);
    var maxBet = worldStore.state.bankrollbalance / (maxPayout-1) * (edge/100);
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

    var isError = _.some(['ROW1', 'ROW2', 'ROW3', 'ROW4', 'ROW5'], function(row) {
      return self.state[row].error;
    });

    // True if pucks are still on the board
    var stillAnimatingPucks = _.keys(worldStore.state.renderedPucks).length > 0;

    return (
      el.div(
        {
          id: 'p_editor',
          className: 'panel panel-default'},
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
            'Custum Payout Requirements:',
            el.ul(
              null,
              el.li(
                null,
                'House edge must be at least ',
                 el.span({style:{color: '#ffffff',backgroundColor: config.hexColors.dark['ROW2']}}, '0.80%')
              ),
              el.li(
                null,
                'Payouts can be in the range of ',
                el.span({style:{color: '#ffffff',backgroundColor: config.hexColors.dark['ROW2']}}, '0.00 to 9999')
              ),
              el.li(
                null,
                'The max bet allowed on a row is determined by the row\'s highest payout and house edge',
              el.li(
                null,
                'The max bets below are approximate and based off the ',
                el.a({
                        href: 'https://www.moneypot.com/investment',
                        target: '_blank'
                      },
                      'Moneypot bankroll'
                    ),
                    ' of ',
                    el.span({style:{color: '#ffffff',backgroundColor: config.hexColors.dark['ROW2']}},
                      helpers.commafy(helpers.convSatstoCointype(worldStore.state.bankrollbalance).toString())
                    ),
                    ' ' + worldStore.state.coin_type//' bits'
                  )

              )
            )
          ),
          el.hr(),
          ['ROW1', 'ROW2', 'ROW3', 'ROW4', 'ROW5'].map(function(row) {
            return el.div(
              {
                key: row
              },
              el.div({className:'well well-sm'},
              el.p(
                null,
                el.span(
                  {
                    style: {
                      color: '#ffffff',
                      backgroundColor: config.hexColors.dark[row],
                      padding: '2px 3px',
                      width: '100px',
                      display: 'inline-block',
                      textAlign: 'center'
                    }
                  },
                  _.capitalize(row)
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
                        borderColor: (self.state[row].error === 'EDGE_TOO_SMALL' || _.isNaN(self._calcHouseEdge(row))) ?
                          'red' : '#333',
                        color: (self.state[row].error === 'EDGE_TOO_SMALL' || _.isNaN(self._calcHouseEdge(row))) ?
                          'red' : '#ffffff'
                      }
                    },
                    (self.state[row].error && self.state[row].error !== 'EDGE_TOO_SMALL') ?
                      'XXX' :
                      self._calcHouseEdge(row).toFixed(2) + '%'
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
                    var maxBet = self._calcMaxBet(row);

                    return el.span(
                      {
                        style: {borderBottom: '1px solid #333'}
                      },
                      maxBet ? helpers.commafy(helpers.convSatstoCointype(maxBet * 100).toString()) :
                        'XXX'
                    );
                  })(),
                  ' ' + worldStore.state.coin_type + ' Max Bet'
                ),
                // Display error if there is one
                ' ',
                self.state[row].error ?
                  el.span(
                    {
                      style: {
                        color: 'red'
                      }
                    },
                    self._translateErrorConstant(self.state[row].error)
                  ) :
                  ''

              ),
              self.state[row].strings.map(function(payoutStr, idx) {
                return el.span(
                  { key: row + '-' + idx },
                  el.input(
                    {
                      key: row + '-' + idx,
                      type: 'text',
                      className: 'form-control input-sm payout-control',
                      value: payoutStr,
                      style: {
                        fontFamily: 'Courier New',
                        width: '55px',
                        display: 'inline-block',
                        marginLeft: '5px',
                        marginBottom: '10px',
                        fontWeight: 'bold',
                        borderColor: (self.state[row].error === 'INVALID_PAYOUT' && !helpers.isValidPayout(payoutStr)) ?
                          'red' : '#ccc',
                        color: (self.state[row].error === 'INVALID_PAYOUT' && !helpers.isValidPayout(payoutStr)) ?
                          'red' : '#333'
                      },
                      onChange: self._makeChangeHandler(row, idx),
                      onFocus: self._onInputFocus
                    }
                  )

                );
              })
            )
            );
          })
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
              'Clicking save will update the current payouts below the game'
        )
      )
    );
  }
});

var PlinkoGameTabContent = React.createClass({
  displayName: 'PlinkoGameTabContent',
  _onStoreChange: function() {
  this.forceUpdate();
  },
  componentDidMount: function() {
  worldStore.on('change',this._onStoreChange);
  betStore.on('change_plinko',this._onStoreChange);
  AutobetStore.on('change', this._onStoreChange);
  },
  componentWillUnmount: function() {
  worldStore.off('change', this._onStoreChange);
  betStore.off('change_plinko',this._onStoreChange);
  AutobetStore.off('change', this._onStoreChange);
  },
  _onPopover: function() {
  // $('popover-btn').popover();
   $(function () {
     $('[data-toggle="popover"]').popover();
   });
   if(config.debug){console.log('hover POP');}
  },
  _togglehotkey: function() {
    Dispatcher.sendAction('TOGGLE_HOTKEYS');
  },
  _toggleAuto:function(){
    Dispatcher.sendAction('TOGGLE_SHOW_AUTO');
  },
  _toggleChart:function(){
    Dispatcher.sendAction('TOGGLE_CHART');
  },
  _togglePayout:function(){
    Dispatcher.sendAction('TOGGLE_PAYOUT_EDITOR');
  },
  render: function() {
    return el.div(
      {className:'panel panel-primary'},
    //  React.createElement(BetBox, null)
      el.div({className:'panel-heading'},
        el.span(null,
        'PLINKO',
        el.div({className:'navbar-right', style: {marginRight:'5px'}},
          el.ul({className:'list-inline'},


            el.li({
                  id:'popover-btn',
                  //'data-html':'true',
                  'data-container':'body',
                  'data-trigger':'hover',
                  'data-toggle':'popover',
                  'data-placement':'bottom',
                  'data-content': 'PAYOUT EDITOR',
                   onMouseOver:this._onPopover,
                   onClick: this._togglePayout,
                   style: {color: worldStore.state.showPayoutEditor ? 'orange' : ''}
                  },
              el.span({className:'glyphicon glyphicon-menu-hamburger'}) //Payout Editor
            ),
            el.li({
                  id:'popover-btn',
                  //'data-html':'true',
                  'data-container':'body',
                  'data-trigger':'hover',
                  'data-toggle':'popover',
                  'data-placement':'bottom',
                  'data-content': 'ADVANCED SETTINGS',
                   onMouseOver:this._onPopover,
                   onClick: this._toggleAuto,
                  },
              el.span({className:'glyphicon glyphicon-cog'}) //AUTOBET
            ),
            el.li({
                  id:'popover-btn',
                  //'data-html':'true',
                  'data-container':'body',
                  'data-trigger':'hover',
                  'data-toggle':'popover',
                  'data-placement':'bottom',
                  'data-content': 'CHART',
                  onMouseOver:this._onPopover,
                  onClick: this._toggleChart,
                  },
              el.span({className:'glyphicon glyphicon-stats'}) //GRAPH
            ),
            el.li({
                  id:'popover-btn',
                  //'data-html':'true',
                  'data-container':'body',
                  'data-trigger':'hover',
                  'data-toggle':'popover',
                  'data-placement':'bottom',
                  'data-content': 'HOTKEYS',
                   onMouseOver:this._onPopover,
                  onClick: this._togglehotkey,
                  style: {color: worldStore.state.hotkeysEnabled ? 'orange' : ''}
                  },
              el.span({className:'glyphicon glyphicon-fire'}) //HOTKEYS
            ),
            el.li(
                  {  //type:'button',
                  id:'popover-btn',
                  'data-html':'true',
                  'data-container':'body',
                  'data-trigger':'hover',
                  'data-toggle':'popover',
                  'data-placement':'bottom',
                  'data-content': "<h6>How To Play:</h6><br><p>Adjust Wager, Click Row to drop a puck on the selected row</p>",
                   onMouseOver:this._onPopover
                  },
                el.span({className:'glyphicon glyphicon-info-sign'})
            )
          )
         )
        )
      ),
      el.div({className:'panel-body'},
      //React.createElement(ClassicBoard, null),
        el.div({className:'row'},
         el.div({className:'col-xs-12'},
          React.createElement(ClassicBoard, null)
          ),
          el.div(
            {className:'well well-sm col-xs-12 col-sm-7',style:{marginBottom:'-5px', marginLeft:'5px'}},
            el.div(
              {className: 'col-xs-12'},
              React.createElement(PlinkoBetButton, null)
            )
          ),
          el.div(
            {className: 'col-xs-12 col-sm-4'},//col-xs-12
            React.createElement(BetBoxWager, null)
          ),
          AutobetStore.state.ShowAutobet ? React.createElement(P_AutoBetButton,null) : '',
          el.div(
            {className:'row'},
            el.div(
              {className: 'col-xs-12 col-sm-8'},
             React.createElement(PlinkoBetHistory,null)
            ),
            el.div(
              {className: 'col-xs-12 col-sm-4'},
             React.createElement(BetBoxBalance, null)
           ),
           (AutobetStore.state.ShowAutobet|| AutobetStore.state.Run_Autobet) ? el.div(
             null,//{className:'row'},
             React.createElement(PlinkoAdvancedSettings, null)
           ):'',
           el.div(
             {className: 'col-xs-12', style:{marginTop:'-10px'}},
             React.createElement(Plinko_Stats,null)
            )
          )
        )
      ),
      worldStore.state.showPayoutEditor ? React.createElement(PayoutEditor,null) : ''
    );
  }
});

Dispatcher.sendAction('MARK_PLINKO_LOADED');
