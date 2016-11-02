// bit-exo.com V3.0.0
// Copyright 2016 bit-exo.com

///////////////////////
// All trademarks,trade names,images,contents,snippets,codes,including text
// and graphics appearing on the site are intellectual property of their
// respective owners, including in some instances,"bit-exo.com".
// All rights reserved.
//contact: admin@bit-exo.com
//////////////////////////
config.hexColors = {
  dark: {
    'ROW1': '#424242',
    'ROW2': '#77b300',
    'ROW3': '#2a9fd6',
    'ROW4': '#9933cc',
    'ROW5': '#ff8800'
  }
};


var imgpick1 = 0;
var imgpick2 = 1;
var imgpick3 = 2;

var scanvas;
var skanvas;
// payouts is object of { green: [...], etc. }
var sKanvas = function(canvas) {
  //this.payouts = initPayouts;
  // The underlying Fabric Canvas instance
  this.canvas = scanvas;
  // The underlying Fabric objects on the Fabric canvas
  // for the purpose of mutating them and then rerendering
  // this.objects = {
  //   payouts: {}
  // };

  var self = this;

  var imgIDlist = [
    'bar',
    'bell',
    'chip',
    'club',
    'winbar',//'dice',
    'horse',
    'orange',
    'plum',
    'seven',
    'logosl'//,//'winbar',
    //'blank'
  ]
  var _drawplace_1 = function(num) {

  var imgElement = document.getElementById(imgIDlist[num]);
  var imgInstance = new fabric.Image(imgElement, {
    left: 160 * config.scale_slots,
    top: 230 * config.scale_slots,
    scaleX: config.scale_slots,
    scaleY: config.scale_slots
  });
  self.canvas.add(imgInstance);
  };

  var _drawplace_2 = function(num) {

    var imgElement = document.getElementById(imgIDlist[num]);
    var imgInstance = new fabric.Image(imgElement, {
      left: 345 * config.scale_slots,
      top: 230 * config.scale_slots,
      scaleX: config.scale_slots,
      scaleY: config.scale_slots
    });
    self.canvas.add(imgInstance);
  };

  var _drawplace_3 = function(num) {

    var imgElement = document.getElementById(imgIDlist[num]);
    var imgInstance = new fabric.Image(imgElement, {
      left: 530 * config.scale_slots,
      top: 230 * config.scale_slots,
      scaleX: config.scale_slots,
      scaleY: config.scale_slots
    });
    self.canvas.add(imgInstance);
  };

  var _drawBackground = function() {
    var rect = new fabric.Rect({
      top: -5,
      left: -5,
      height: 534 * config.scale_slots,
      selectable: false,
      width: 1050 * config.scale_slots,
      fill: '#000000'
    });

    self.canvas.add(rect);

    var imgElement = document.getElementById('frame');
    var imgInstance = new fabric.Image(imgElement, {
        scaleX: config.scale_slots,
        scaleY: config.scale_slots
    //  left: 530,
    //  top: 230
    });
    self.canvas.add(imgInstance);

  };

  var _drawPayouts = function() {
    var payt = 'paytable'
  /*  switch(worldStore.state.slots_table){
      case 1:
      //payt = 'paytable1.png'
      payt = 'paytable1';
        break;
      case 2:
      payt = 'paytable2';
        break;
      case 3:
      payt = 'paytable3';
        break;
      case 4:
      payt = 'paytable3';
        break;
    }*/

    var imgElement = document.getElementById(payt);
    var imgInstance = new fabric.Image(imgElement, {
      left: 820 * config.scale_slots,
      top: -3,
      scaleX: config.scale_slots,
      scaleY: config.scale_slots

    });
    self.canvas.add(imgInstance);
    var rect = new fabric.Rect({
      top: -3,
      left: 930 * config.scale_slots,
      height: 530 * config.scale_slots,
      selectable: false,
      width: 100 * config.scale_slots,
      fill: '#000000'
    });

    self.canvas.add(rect);
    //TODO
    //worldStore.state.slots_paytable
    thisrow = worldStore.state.slots_paytable;
    thisrow.forEach(function(multiplier, idx) {
      //var rowCount = config.n - 1;
      var text = new fabric.Text((multiplier + ' ' + String.fromCharCode(88) + '  ').slice(0, 5), {
        angle: 0,
        top: ((37 * idx)+13)* config.scale_slots,//config.payTableRowHeight*(row+1) + config.top_margin + (rowCount * config.puck_diameter*0.65) + (rowCount * config.peg_diameter*0.65) - (12 * config.scale_plinko),
        left: 934 * config.scale_slots,//config.side_margin + (config.puck_diameter + config.peg_diameter) * idx + 7,
        fontSize: 18 * config.scale_slots,
        stroke: '#ffffff',
        fill: '#0A0A00',//config.hexColors.dark[row],
        selectable: false,
        fontFamily: 'Courier New',
        fontWeight: 'normal',
        backgroundColor: '#0A0A00'//config.hexColors.dark[row]
      });
      canvas.add(text);
    });



  };

  this.renderAll = function() {
    // Clear canvas and all event listeners on it
    //  console.log('background render');
    self.canvas.dispose();
    self.canvas.renderOnAddRemove = false;
    _drawBackground();
    _drawPayouts();
    _drawplace_1(imgpick1);
    _drawplace_2(imgpick2);
    self.canvas.renderOnAddRemove = true;
    _drawplace_3(imgpick3);

  };

  this.renderWheels = function(){
    self.canvas.renderOnAddRemove = false;
    if(config.debug){console.log('wheel render s');}
    _drawplace_1(imgpick1);
    _drawplace_2(imgpick2);
    self.canvas.renderOnAddRemove = true;
    _drawplace_3(imgpick3);
  }

};


function spinswheels2(WH1,WH2,WH3, bet){
//  console.log('Slots start spinswheels2');
  var loop1 = 0;
  var loop2 = 0;
  var loop3 = 0;

  var SpinInterval = setInterval(function(){
    loop1++;
    countups();
    if ((loop1 >= 10) && (imgpick1 == WH1)){
      clearInterval(SpinInterval);

      var Spin2Interval = setInterval(function(){
        loop2++;
        countups2();
        if ((loop2 >= 6)&& (imgpick2 == WH2)){
          clearInterval(Spin2Interval);

          var Spin3Interval = setInterval(function(){
            loop3++;
            countups3();
            if ((loop3 >= 3)&& (imgpick3 == WH3)){
              clearInterval(Spin3Interval);

              Dispatcher.sendAction('STOP_ROULETTE');
              Dispatcher.sendAction('NEW_BET', bet);
              if (!worldStore.state.first_bet)
                {Dispatcher.sendAction('SET_FIRST');}
            //  Dispatcher.sendAction('NEW_BET', bet);

              skanvas.renderAll();

              if (AutobetStore.state.Run_Autobet)
                {
                setTimeout(function(){
                  Dispatcher.sendAction('AUTOBET_ROUTINE', bet);
                },AutobetStore.state.autodelay.num);
              }

            }
          },50);
        }
      },50);
    }
  },50);

}


function countups(){
  imgpick1++;
  if (imgpick1 > 9){
    imgpick1 = 0;
  }
  imgpick2++;
  if (imgpick2 > 9){
    imgpick2 = 0;
  }
  imgpick3++;
  if (imgpick3 > 9){
    imgpick3 = 0;
  }
  skanvas.renderWheels();
};

function countups2(){
  imgpick2++;
  if (imgpick2 > 9){
    imgpick2 = 0;
  }
  imgpick3++;
  if (imgpick3 > 9){
    imgpick3 = 0;
  }
  skanvas.renderWheels();
};

function countups3(){
  imgpick3++;
  if (imgpick3 > 9){
    imgpick3 = 0;
  }
  skanvas.renderWheels();
};


var SlotsBackground = React.createClass({
  displayName: 'SlotsBackground',
  shouldComponentUpdate: function() {
    return false;
  },
  componentDidMount: function() {
    console.log('Mounting SlotsBackground..');

    scanvas = new fabric.Canvas('board');
    scanvas.selection = false;

    var GameEle = document.getElementsByClassName('Game_Box')
    var windowsize = GameEle[0].firstChild.clientWidth -8;

    config.scale_slots = windowsize / 1050;
    if (config.scale_slots > 1.0){
      config.scale_slots = 1.0;
    }


    scanvas.setDimensions({
      width: 1050 * config.scale_slots,
      height: 530 * config.scale_slots
    });

    // mutate global kanvas reference
    skanvas = new sKanvas(scanvas);
    skanvas.renderAll();
    setTimeout(function(){
    skanvas.renderWheels();
    },50);

  },
  render: function() {
    return el.canvas(
      {
        id: 'board',
        style: {marginTop:'-10px'}
      },
      null
    );
  }
});

var SlotsSettings = React.createClass({
  displayName: 'SlotsSettings',
  _onStoreChange: function() {
    this.forceUpdate();
  },
  _oncheck: function(){
  Dispatcher.sendAction('TOGGLE_ANIMATION', null);
  },
  render: function(){

    return el.div(
      null,
      el.div(
        {className:'well well-sm col-xs-12'},
        el.div(
          {className: 'col-xs-12 col-sm-4 col-md-4 col-lg-4'},//col-xs-12
          React.createElement(BetBoxWager, null)
        ),
        el.div(
          {className: 'col-xs-12 col-sm-4'},// col-md-4 col-lg-3'},
          React.createElement(SlotsButtons, null)
        ),
        AutobetStore.state.ShowAutobet ?  el.div(
          {className: 'col-xs-12 col-sm-4'},// col-md-4 col-lg-3'},
          React.createElement(S_AutoBetButton, null)
        ) : '',
        el.div(
          {className: 'col-xs-12 col-sm-4'},// col-md-4 col-lg-3'},
          React.createElement(SlotsTableButton,null)
        ),
        el.div(
          {className: 'col-xs-6 col-sm-4 col-md-4 col-lg-3'},
          el.input(
                  {
                  //id: 'checkboxStyle',
                  //name: 'numberOfBet',
                  type: 'checkbox',
                  defaultChecked: worldStore.state.animate_enable ? 'checked':'',
                  onChange: this._oncheck,
                  value: 'false'
                  }//,
                //
                ),
              el.span({style:{fontWeight:'bold'}},'Enable Animation')
          )
      )
    );
  }

});

var SlotsLast = React.createClass({
  displayName: 'SlotsLast',
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    worldStore.on('new_user_bet', this._onStoreChange);
    //worldStore.on('change', this._onStoreChange);
  },
  componentWillUnmount: function() {
    worldStore.off('new_user_bet', this._onStoreChange);
    //worldStore.off('change', this._onStoreChange);
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


  var rangeParamSlots = [];
  var payoutSlots = [];

  function setRangeParamSlots(){
    if(config.debug){console.log('setting params');}
  rangeParamSlots =[];
  var lower;
  var upper;
  var point = Math.floor((Math.pow(2,32)*(0.001)));
  for(var x = 0; x < 14; x++){
      if (x < 10){
        lower = x * point;
        upper = (x+1) * point;
      }else if (x == 10){
        lower = 42949670;
        upper = 81604376;
      }else if (x == 11){
        lower = 81604376;
        upper = 120259082;
      }
      else if (x == 12){
        lower = 120259082;
        upper = 158913788;
      }else {
        lower = 158913788;
        upper = 545460844;
      }
      rangeParamSlots.push(
          {
              from: lower,
              to: upper,
              value: payoutSlots[x]
          }
      );
  }
}


var SlotsButtons = React.createClass({
  displayName: 'SlotsButtons',
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    worldStore.on('new_user_bet', this._onStoreChange);
    betStore.on('change', this._onStoreChange);
    worldStore.on('change', this._onStoreChange);
  },
  componentWillUnmount: function() {
    worldStore.off('new_user_bet', this._onStoreChange);
    betStore.off('change', this._onStoreChange);
    worldStore.off('change', this._onStoreChange);
  },
  _spin_slots: function(){
    var wagerSatoshis = helpers.convCoinTypetoSats(betStore.state.wager.num);
    payoutSlots = [];
    for (var n = 0; n < 14; n++){
      payoutSlots[n] = wagerSatoshis * worldStore.state.slots_paytable[n];
    };
    setRangeParamSlots();
    var payouts = rangeParamSlots;
    var hash = betStore.state.nextHash;
    var bodyParams = {
    client_seed: betStore.state.clientSeed.num,
    hash: hash,
    payouts: payouts,
    wager: wagerSatoshis,
    max_subsidy:0
	  }

    socket.emit('slots_bet', bodyParams, function(err, bet) {
      if (err) {
        console.log('[socket] slots_bet failure:', err);
        if(err.error == 'INVALID_HASH '){
          alert('Bet Stopped due to INVALID_HASH, Fetching new hash automatically');
          gethashfromsocket();
        }
        return;
      }
      console.log('[socket] slots_bet success:', bet);
      bet.meta = {
        cond: '>',
        number: 99.99,
        hash: hash,
        kind: 'SLOTS',
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

      Dispatcher.sendAction('SET_NEXT_HASH', bet.next_hash);

      if (betStore.state.randomseed){
          var newseed = randomUint32();//Math.floor(Math.random()*(Math.pow(2,32)-1));
          var str = newseed.toString();
          Dispatcher.sendAction('UPDATE_CLIENT_SEED', { str: str });
        }

      Dispatcher.sendAction('SET_REVEALED_BALANCE');
      Dispatcher.sendAction('START_ROULETTE');
      Dispatcher.sendAction('UPDATE_USER', {
        balance: worldStore.state.user.balance + bet.profit
      });

    wheel1 = bet.wheel1;
    wheel2 = bet.wheel2;
    wheel3 = bet.wheel3;

    if (worldStore.state.animate_enable){
      spinswheels2(wheel1,wheel2,wheel3,bet);
    }else{
      imgpick1 = bet.wheel1;
      imgpick2 = bet.wheel2;
      imgpick3 = bet.wheel3;
      skanvas.renderAll();
      if (!worldStore.state.first_bet)
        {Dispatcher.sendAction('SET_FIRST');}
      Dispatcher.sendAction('STOP_ROULETTE');
      Dispatcher.sendAction('NEW_BET', bet);

      if (AutobetStore.state.Run_Autobet)
        {
          Dispatcher.sendAction('AUTOBET_ROUTINE', bet);
      }
    }
    });
  },
  render: function() {
  var innerNode;
  // TODO: Create error prop for each input
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
      'WAGER_TOO_PRECISE': 'Wager too precise'
    };
    innerNode = el.button(
      {type: 'button',
       disabled: true,
       className: 'btn btn-lg btn-block btn-danger'},
      errorTranslations[error] || 'Invalid bet'
    );
  } else if (worldStore.state.user) {
    // If user is logged in, let them submit bet
    innerNode = el.button(
        {
          id: 'SL-START',
          type: 'button',
          className: 'btn btn-lg btn-success btn-block',
          style:{fontWeight: 'bold'},
          onClick: this._spin_slots
        },
        'SPIN',
        worldStore.state.hotkeysEnabled ? el.kbd(null, 'SPC') : ''
      );
  } else {
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
      el.div(
        null,
      innerNode
     )
    );
  }

});


var SlotsTableButton = React.createClass({
  displayName: 'SlotsTableButton',
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {

  },
  componentWillUnmount: function() {

  },
  _onClick: function() {
   $('dropdown-toggle').dropdown();
 },
 _ActionClick: function(num){
   return function(){
     if(config.debug){console.log('click action: ' + num);}
     Dispatcher.sendAction('SET_SLOTS_TABLE', num);
   };
 },
 /*
  _toggletable: function(){
      Dispatcher.sendAction('TOGGLE_SLOTS_TABLE');
  },*/
  render: function() {
  /*  return el.div(
      null,
      el.div(
        null,//{className: 'col-xs-12 col-md-2'},
        el.button(
            {
              type: 'button',
              className: 'btn btn-md btn-primary btn-block',
              style:{fontWeight: 'bold'},
              onClick: this._toggletable
            },
            'TABLE ' + worldStore.state.slots_table
          )
      )
    );*/
    return el.div(null,
    el.button({    id: 'SL_TABLE',
                   type:'button',
                   className:'btn btn-md btn-primary dropdown-toggle',
                   "data-toggle":'dropdown',
                   "aria-haspopup":'true',
                   "aria-expanded":'false',
                   onClick:this._onClick
                 },
                 'Table: ' + worldStore.state.slots_table, el.span({className:'caret'},'')
               ),
               el.ul({className:'dropdown-menu'},
               el.li(null, el.a({onClick: this._ActionClick(1)},'1')),
               el.li(null, el.a({onClick: this._ActionClick(2)},'2')),
               el.li(null, el.a({onClick: this._ActionClick(3)},'3')),
               el.li(null, el.a({onClick: this._ActionClick(4)},'CUSTOM'))
             )
    );

  }

});






var S_AutoBetButton = React.createClass({
displayName: 'S_AutoBetButton',
_onStoreChange: function() {
this.forceUpdate();
},
componentDidMount: function() {
worldStore.on('change', this._onStoreChange);
AutobetStore.on('loss_change', this._onStoreChange);
AutobetStore.on('win_change', this._onStoreChange);
AutobetStore.on('change', this._onStoreChange);
},
componentWillUnmount: function() {
worldStore.off('change', this._onStoreChange);
AutobetStore.off('loss_change', this._onStoreChange);
AutobetStore.off('win_change', this._onStoreChange);
AutobetStore.off('change', this._onStoreChange);
},
_onClickStart: function(){
Dispatcher.sendAction('START_RUN_AUTO', null);
},
_onClickStop: function(){
AutobetStore.state.Stop_Autobet = true;
setTimeout(function(){Dispatcher.sendAction('STOP_RUN_AUTO', null);},3000);
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
        id: 'start_auto_roullette',
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
el.div(
  null,
  innerNode
)
);
}

});


var Slots_Stats = React.createClass({
displayName: 'Roulette_Stats',
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
  {className:'well well-sm row',style:{marginBottom:'-15px'}},
  el.div({className:'row'},
    el.div({className:'col-xs-4 col-sm-2'},'Bets: ' + worldStore.state.slotsstats.bets.toString()),
    el.div({className:'col-xs-4 col-sm-2'},'Wins: ' + worldStore.state.slotsstats.wins.toString()),
    el.div({className:'col-xs-4 col-sm-2'},'Losses: ' + worldStore.state.slotsstats.loss.toString()),
    el.div({className:'col-xs-6 col-sm-3'},'Wagered: ' + helpers.convNumtoStr(worldStore.state.slotsstats.wager) + worldStore.state.coin_type),
    el.div({className:'col-xs-6 col-sm-3'},'Profit: ' + helpers.convNumtoStr(worldStore.state.slotsstats.profit) + worldStore.state.coin_type)//,
  //el.span({className:'glyphicon glyphicon-refresh'})
    )
  )
);
}
});

var SlotsAutoToggles = React.createClass({
displayName: 'SlotsAutoToggles',
_onStoreChange: function() {
this.forceUpdate();
},
componentDidMount: function() {
//  worldStore.on('new_user_bet', this._onStoreChange);
AutobetStore.on('switch_change', this._onStoreChange);
},
componentWillUnmount: function() {
//  worldStore.off('new_user_bet', this._onStoreChange);
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
    case 'TABLE +':
    case 'TABLE -':
    case 'STOP AUTO':
    case 'RESET TO BASE':
    break;
    default:
      Dispatcher.sendAction('SET_D_SW1_MODE', 'TABLE +');
    break;
  }
  switch (AutobetStore.state.switch2.mode){
    case 'TABLE +':
    case 'TABLE -':
    case 'STOP AUTO':
    case 'RESET TO BASE':
    break;
    default:
      Dispatcher.sendAction('SET_D_SW2_MODE', 'TABLE -');
    break;
  }
  switch (AutobetStore.state.switch3.mode){
    case 'TABLE +':
    case 'TABLE -':
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
    null,
    el.div({className:'col-xs-1'},
      el.input({
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
        el.span(
            {className: 'input-group-btn'},
            el.button({
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
        el.button({
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
                   el.li(null, el.a({onClick: this._ActionClick1('TABLE +')},'TABLE +')),
                   el.li(null, el.a({onClick: this._ActionClick1('TABLE -')},'TABLE -')),
                   el.li(null, el.a({onClick: this._ActionClick1('STOP AUTO')},'STOP AUTO')),
                   el.li(null, el.a({onClick: this._ActionClick1('RESET TO BASE')},'RESET TO BASE'))
                   )
        )
    ),
    el.div({className: 'col-xs-12',style: { marginTop: '-25px', marginBottom: '-10px' }},
      el.hr(null)
    ),
    el.div({className:'col-xs-1'},
      el.input({
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
        el.input({
              type: 'text',
              value: AutobetStore.state.switch2.str,
              className: 'form-control input-sm',
              style: {fontWeight: 'bold'},
              onChange: this._ontargetChange2
            }
          ),
        el.span(
            {className: 'input-group-btn'},
              el.button({
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
        el.button({
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
                   el.li(null, el.a({onClick: this._ActionClick2('TABLE +')},'TABLE +')),
                   el.li(null, el.a({onClick: this._ActionClick2('TABLE -')},'TABLE -')),
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
      el.input({
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
        el.input({
              type: 'text',
              value: AutobetStore.state.switch3.str,
              className: 'form-control input-sm',
              style: {fontWeight: 'bold'},
              onChange: this._ontargetChange3
            }
          ),
        el.span(
            {className: 'input-group-btn'},
              el.button({
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
        el.button({
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
                   el.li(null, el.a({onClick: this._ActionClick3('TABLE +')},'TABLE +')),
                   el.li(null, el.a({onClick: this._ActionClick3('TABLE -')},'TABLE -')),
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



var SlotsAdvancedSettings = React.createClass({
  displayName:'SlotsAdvancedSettings',

  render: function(){
    return el.div(
      null,//{className: 'col-xs-12'},
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
          React.createElement(SlotsAutoToggles, null)
        ),
        React.createElement(Auto_Stats,null)

    );
  }

});


var secanvas;
var sekanvas;
// payouts is object of { green: [...], etc. }
var seKanvas = function(canvas) {
  //this.payouts = initPayouts;
  // The underlying Fabric Canvas instance
  this.canvas = secanvas;
  // The underlying Fabric objects on the Fabric canvas
  // for the purpose of mutating them and then rerendering
  // this.objects = {
  //   payouts: {}
  // };

  var self = this;

  var _drawBackground = function() {
    var rect = new fabric.Rect({
      top: -5,
      left: -5,
      height: 534,
      selectable: false,
      width: 1050,
      fill: '#000000'
    });

    self.canvas.add(rect);

  };

  var _drawPayouts = function() {
    var payt = 'paytable'
    var imgElement = document.getElementById(payt);
    var imgInstance = new fabric.Image(imgElement, {
      left: 0,//820 * config.scale_slots,
      top: -3,
      scaleX: 1.08,//config.scale_slots,
      scaleY: 1.08//config.scale_slots

    });
    self.canvas.add(imgInstance);
  };

  this.renderAll = function() {
    // Clear canvas and all event listeners on it
    //  console.log('background render');
    self.canvas.dispose();
    self.canvas.renderOnAddRemove = false;
    _drawBackground();
    self.canvas.renderOnAddRemove = true;
    _drawPayouts();

  };


};
var SlotsEditorBackground = React.createClass({
  displayName: 'SlotsEditorBackground',
  shouldComponentUpdate: function() {
    return false;
  },
  componentDidMount: function() {
    console.log('Mounting SlotsBackground..');

    secanvas = new fabric.Canvas('eboard');
    secanvas.selection = false;


    secanvas.setDimensions({
      width: 109,
      height: 560
    });

    // mutate global kanvas reference
    sekanvas = new seKanvas(secanvas);
    sekanvas.renderAll();

  },
  render: function() {
    return el.canvas(
      {
        id: 'eboard',
        style: {marginTop:'-10px'}
      },
      null
    );
  }
});


var TableEditor = React.createClass({
  displayName: 'TableEditor',
  _onStoreChange: function() {
    this.forceUpdate();
  //  canvas.renderAll();
    //paint();
  },
  componentDidMount: function() {
    worldStore.on('change', this._onStoreChange);
    betStore.on('change_slots',this._onStoreChange);
    //worldStore.on('plinko_game_change', this._onStoreChange);
    //worldStore.on('plinko_render_change',this._onStoreChange);
  },
  componentWillUnmount: function() {
    worldStore.off('change', this._onStoreChange);
    betStore.off('change_slots',this._onStoreChange);
    //worldStore.off('plinko_game_change', this._onStoreChange);
    //worldStore.off('plinko_render_change',this._onStoreChange);
  },
  _toStrings: function(array) {
    return array.map(function(n) { return n.toString(); });
  },

  getInitialState: function() {
    // User-editable payout strings that must validate before they are
    // transformed into numbers and updated in worldStore
    return {
      TABLE4: {
        error: undefined,
        strings: this._toStrings(betStore.state.slots_tables.TABLE4),
      }
    };
  },
  _onReset: function() {
    // Reset state back to how it is in the store
    var originalState =  {
      TABLE4: {
        error: undefined,
        strings: this._toStrings(betStore.state.slots_tables.TABLE1),
      }
    };

    this.replaceState(originalState);
  },
  // Validates current state and sets errors if necessary
  _validateState: function() {
    // House edge must be >= 0.80
    var self = this;
    var _state = _.clone(this.state);
    ['TABLE4'].forEach(function(row) {
      var edge = helpers.payTablEdgeSlots(helpers.toFloats(_state[row].strings));
      console.log(row + ' edge:', edge);

      // Will be first invalid payout in this row or undefined if valid
      var invalidPayout = _.some(
        _state[row].strings,
        _.negate(helpers.isValidPayout)
      );

      if (invalidPayout) {
        _state[row].error = 'INVALID_PAYOUT';
      } else if (edge < 2.40) {
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
    console.log('saving...', this.state.TABLE4);
    Dispatcher.sendAction('UPDATE_PAY_TABLES_SLOTS', {
      TABLE4: helpers.toFloats(this.state.TABLE4.strings)
    });
    Dispatcher.sendAction('SET_SLOTS_TABLE', 4);
    Dispatcher.sendAction('CHANGE_GAME_TAB', 'LOADING');
    setTimeout(function(){
      Dispatcher.sendAction('CHANGE_GAME_TAB', 'SLOTS');
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
      helpers.payTablEdgeSlots(
        helpers.toFloats(this.state[row].strings)
      ),
      -2
    );
    return n;
  },
  _translateErrorConstant: (function() {
    var constants = {
      'EDGE_TOO_SMALL': 'House edge must be at least 0.80%',
      'INVALID_PAYOUT': 'At least one payout in this table is invalid'
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

    var isError = _.some(['TABLE4'], function(row) {
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
            'Table Editor'
          )
        ),
        el.div(
          {className: 'panel-body'},
          el.p(
            {},
            'Custum Table Requirements:',
            el.ul(
              null,
              el.li(
                null,
                'House edge must be at least ',
                 el.span({style:{color: '#ffffff',backgroundColor: config.hexColors.dark['ROW2']}}, '2.40%')
              ),
              el.li(
                null,
                'Payouts can be in the range of ',
                el.span({style:{color: '#ffffff',backgroundColor: config.hexColors.dark['ROW2']}}, '0.00 to 976')
              ),
              el.li(
                null,
                'The max bet allowed on a table is determined by the tables\'s highest payout and house edge',
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
          ['TABLE4'].map(function(row) {
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
                  'CUSTOM'//_.capitalize(row)
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
              el.div({className:'col-xs-2'},
                React.createElement(SlotsEditorBackground,null)
              ),
              el.div(null,
              self.state[row].strings.map(function(payoutStr, idx) {
                return el.div(
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
              'Clicking save will update the custom payouts beside the game'
        )
      )
    );
  }
});


var SlotsGameTabContent = React.createClass({
  displayName: 'SlotsGameTabContent',
  _onStoreChange: function() {
  this.forceUpdate();
  },
  componentDidMount: function() {
  worldStore.on('change',this._onStoreChange)
  AutobetStore.on('change', this._onStoreChange);
  betStore.on('change', this._onStoreChange);
  worldStore.on('change_slots', this._onStoreChange);
  },
  componentWillUnmount: function() {
  worldStore.off('change', this._onStoreChange);
  AutobetStore.off('change', this._onStoreChange);
  betStore.off('change', this._onStoreChange);
  worldStore.off('change_slots', this._onStoreChange);
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
        'SLOTS',
        el.div({className:'navbar-right', style: {marginRight:'5px'}},
          el.ul({className:'list-inline'},
            el.li({
                  id:'popover-btn',
                  //'data-html':'true',
                  'data-container':'body',
                  'data-trigger':'hover',
                  'data-toggle':'popover',
                  'data-placement':'bottom',
                  'data-content': 'TABLE EDITOR',
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
                  'data-content': "<h6>How To Play:</h6><br><p>Adjust Wager, Click Spin</p>",
                   onMouseOver:this._onPopover
                  },
                el.span({className:'glyphicon glyphicon-info-sign'})
            )
          )
         )
        )
      ),
      el.div({className:'panel-body'},
       el.div({className:'row'},
        React.createElement(SlotsBackground, null),
        React.createElement(SlotsLast, null),
        React.createElement(SlotsSettings, null),
        (AutobetStore.state.ShowAutobet|| AutobetStore.state.Run_Autobet) ? el.div(
          null,//{className:'row'},
          React.createElement(SlotsAdvancedSettings, null)
        ):'',
        el.div(
          {className: 'col-xs-12', style:{marginTop:'-10px'}},
          React.createElement(Slots_Stats,null)
         )
      )
    ),
    worldStore.state.showPayoutEditor ? React.createElement(TableEditor,null) : ''
    );
  }
});


Dispatcher.sendAction('MARK_SLOTS_LOADED');
