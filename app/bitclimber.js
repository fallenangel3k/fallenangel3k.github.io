var BitClimberBetHistory = React.createClass({
  displayName: 'BitClimberBetHistory',
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

var BitClimber_Stats = React.createClass({
displayName: 'BitClimber_Stats',
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
    el.div({className:'col-xs-4 col-sm-2'},'Bets: ' + worldStore.state.BitClimberstats.bets.toString()),
    el.div({className:'col-xs-4 col-sm-2'},'Wins: ' + worldStore.state.BitClimberstats.wins.toString()),
    el.div({className:'col-xs-4 col-sm-2'},'Losses: ' + worldStore.state.BitClimberstats.loss.toString()),
    el.div({className:'col-xs-6 col-sm-3'},'Wagered: ' + helpers.convNumtoStr(worldStore.state.BitClimberstats.wager) + worldStore.state.coin_type),
    el.div({className:'col-xs-6 col-sm-3'},'Profit: ' + helpers.convNumtoStr(worldStore.state.BitClimberstats.profit) + worldStore.state.coin_type)//,
  //el.span({className:'glyphicon glyphicon-refresh'})
    )
  )
);
}
});


function Place_BitClimber_Bet(){
console.log('Placing bet...');

var hash = next_hash;
console.assert(typeof hash === 'string');
var cond = betStore.state.bc_target_direction;
var wagerSatoshis = helpers.convCoinTypetoSats(betStore.state.bc_wager);// * 100;
//var multiplier = betStore.state.bc_start_multi.num;//betStore.state.bc_multi;
if(betStore.state.bc_game_runout){
var multiplier = 1.001;
wagerSatoshis = 1;
}else{
var multiplier = (((betStore.state.bc_base * betStore.state.bc_start_multi.num) - betStore.state.bc_base)/betStore.state.bc_wager) + 1;
}
var payoutSatoshis = wagerSatoshis * multiplier;

var number = helpers.calcNumber(
  cond, helpers.multiplierToWinProb(multiplier)
);

var params = {
  wager: wagerSatoshis,
  client_seed: betStore.state.clientSeed.num,
  hash: hash,
  cond: cond,
  target: helpers.round10(number, -4),
  multi: betStore.state.bc_multi,
  payout: payoutSatoshis
};

if(config.debug){  console.log('Emitting Socket for bitclimber');}
socket.emit('bitclimber_bet', params, function(err, bet) {
  if(config.debug){  console.log('Socket returned for bitclimber');}
    //self.setState({ waitingForServer: false });
  if (err) {
    console.log('[socket] bitclimber_bet failure:', err);
  //  self.setState({ waitingForServer: false });
    console.log('auto bet stopped from error');
    Dispatcher.sendAction('STOP_RUN_AUTO');
    Dispatcher.sendAction('STOP_BITCLIMBER', null);
    if(err.error == 'INVALID_HASH '){
      alert('Bet Stopped due to INVALID_HASH, Fetching new hash automatically');
      gethashfromsocket();
    }
    return;
  }

  console.log('[socket] bitclimber success:', bet);
  bet.meta = {
    cond: cond,
    number: number,
    hash: hash,
    kind: 'BITCLIMBER',
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

  Dispatcher.sendAction('NEW_BET', bet);

  if (!worldStore.state.first_bet)
    {Dispatcher.sendAction('SET_FIRST');}
  // Update next bet hash
  //prev_hash = hash;
  next_hash = bet.next_hash;
  Dispatcher.sendAction('SET_NEXT_HASH', bet.next_hash);
  // Update user balance
  Dispatcher.sendAction('UPDATE_USER', {
    balance: worldStore.state.user.balance + bet.profit
  });

  if (betStore.state.randomseed){
      var newseed = randomUint32();//Math.floor(Math.random()*(Math.pow(2,32)-1));
      var str = newseed.toString();
      Dispatcher.sendAction('UPDATE_CLIENT_SEED', { str: str });
    }

  if (bet.profit >= 0){
    Dispatcher.sendAction('NEW_BC_DATAPOINT', betStore.state.bc_multi);
    Dispatcher.sendAction('BITCLIMBER_FUNCTION',bet);
  }else {
    Dispatcher.sendAction('NEW_BC_DATAPOINT', 0.00);
    Dispatcher.sendAction('STOP_BITCLIMBER', null);
    if (AutobetStore.state.Run_Autobet){
      if(config.debug){console.log('Auto_bet routine enabled');}
      Dispatcher.sendAction('AUTOBET_ROUTINE',bet);
    }
  }
});

};



function bcbasefill(num) {
            var rtn = [];
            var start = 0.01;
            rtn.push(0.00);
            while (rtn.length < num) {
              rtn.push(start);
              start += 0.01;
            }
            return rtn;
  }

function bcbasefill2(num) {
            var rtn = [];
            while (rtn.length < num) {
              rtn.push(1.00);
            }
            return rtn;
  }

var data2 = {
    labels: labelfill(2),//labelfill(config.bet_buffer_size),//['a','b','c','d'],
    datasets: [ {
            label: "dataset1",
            fillColor: "rgba(220,220,220,0.2)",
            strokeColor: "rgba(119,179,0, 0.8)",//"rgba(220,220,220,1)",
            pointColor: "rgba(119,179,0, 0.8)",//"rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: bcbasefill(2)//rand(-32, 1000, 50)
          } ]
};

var BitClimberChart = React.createClass({
  displayName: 'BitClimberChart',
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    betStore.on('BitClimber_change', this._onStoreChange);
  },
  componentWillUnmount: function() {
    betStore.off('BitClimber_change', this._onStoreChange);
  },
   render: function() {
     if(config.debug){console.log('[NewBitClimberChart]', data2);}
     if (data2.datasets[0].data.length >= 2){
       if (Number(data2.datasets[0].data[data2.datasets[0].data.length - 1]) > Number(data2.datasets[0].data[data2.datasets[0].data.length - 2]))
         {
         data2.datasets[0].strokeColor = "rgba(119,179,0, 0.8)";
         data2.datasets[0].pointColor = "rgba(119,179,0, 0.8)";
         }else{
           data2.datasets[0].strokeColor = "rgba(153,51,204, 0.8)";
           data2.datasets[0].pointColor = "rgba(153,51,204, 0.8)";
         }
     }
     var props = { data: data2};
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
       data: data2
     },options, props);

     var component = new factory(_props);
     return el.div(
       null,
       el.div({style:{marginBottom:'-15px',marginTop:'-15px'}},
       component
      )
     );
   }
 });


 var BitClimberAdvancedSettings = React.createClass({
   displayName:'DiceAdvancedSettings',

   render: function(){
     return el.div(
       null,
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
           React.createElement(DiceAutoToggles, null)
         ),
       //  el.div({className:'col-xs-12',style:{marginTop:'-15px'}},
         React.createElement(Auto_Stats,null)
     );
   }

 });

 var BitClimber_StartMulti = React.createClass({
   displayName:'BitClimber_StartMulti',
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
   _validateMultiplier: function(newStr) {
     var num = parseFloat(newStr, 10);
     var isFloatRegexp = /^(\d*\.)?\d+$/;
     var winProb = helpers.multiplierToWinProb(num);
     // Ensure str is a number
     if (isNaN(num) || !isFloatRegexp.test(newStr)) {
       Dispatcher.sendAction('UPDATE_BC_START_MULTI', { error: 'INVALID_MULTIPLIER' });
       // Ensure multiplier is >= 1.00x
     } else if (num < 1.01) {
       Dispatcher.sendAction('UPDATE_BC_START_MULTI', { error: 'START_TOO_LOW' });
       // Ensure multiplier is <= max allowed multiplier (100x for now)
     } else if (num > 990000) {
       Dispatcher.sendAction('UPDATE_BC_START_MULTI', { error: 'START_TOO_HIGH' });
       // Ensure no more than 2 decimal places of precision
     } else if (helpers.getPrecision(num) > 2) {
       Dispatcher.sendAction('UPDATE_BC_START_MULTI', { error: 'START_TOO_PRECISE' });
       // multiplier str is valid
     } else {
       Dispatcher.sendAction('UPDATE_BC_START_MULTI', {
         num: num,
         error: null
       });

     }
   },
   _onMultiplierChange: function(e) {
     var str = e.target.value;
     console.log('You entered', str, 'as your multiplier');
     Dispatcher.sendAction('UPDATE_BC_START_MULTI', { str: str });
     this._validateMultiplier(str);
   },

   render: function(){
     return el.div(null,
         el.div(
           {className: 'form-group'},
           el.span(
             {className: 'input-group input-group-sm'},
             el.span({className: 'input-group-addon',
                      style: betStore.state.bc_start_multi.error ? { color: 'red' } : {fontWeight:'bold'}
                        },'Start Multi'),
             el.input(
               {
                 value: betStore.state.bc_start_multi.str,
                 type: 'text',
                 className: 'form-control input-sm',
                 onChange: this._onMultiplierChange,
                 style:{fontWeight:'bold'},
                 placeholder: 'multi'
               }
             ),
             el.span({className: 'input-group-addon',
                      style: betStore.state.bc_start_multi.error ? { color: 'red' } : {fontWeight:'bold'}
                    },'X')
           )
         )

     );
   }
 });


 var BitClimber_Runout = React.createClass({
   displayName:'BitClimber_Runout',
   _onStoreChange: function() {
     this.forceUpdate();
   },
   componentDidMount: function() {
     betStore.on('change', this._onStoreChange);
   },
   componentWillUnmount: function() {
     betStore.off('change', this._onStoreChange);
   },
   _oncheck: function() {
     //console.log('Clicked Check');
     Dispatcher.sendAction('TOGGLE_BC_RUNOUT');
   },
   render: function(){
     return el.div(null,
               el.input(
                   {
                   type: 'checkbox',
                   defaultChecked: betStore.state.bc_game_runout_en ? 'checked':'',
                   onChange: this._oncheck,
                   value: 'true'
                   }
                 ),
               el.span({style:{fontWeight:'bold'}},'Enable 1 Sat Runout')
            );
   }
 });
/*
 var BitClimber_StepSize = React.createClass({
   displayName:'BitClimber_StepSize',
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
   _validateMultiplier: function(newStr) {
     var num = parseFloat(newStr, 10);
     var isFloatRegexp = /^(\d*\.)?\d+$/;
     // Ensure str is a number
     if (isNaN(num) || !isFloatRegexp.test(newStr)) {
       Dispatcher.sendAction('UPDATE_BC_STEP_SIZE', { error: 'INVALID_STEP' });
       // Ensure multiplier is >= 1.00x
     } else if (num < 0.01) {
       Dispatcher.sendAction('UPDATE_BC_STEP_SIZE', { error: 'STEP_TOO_LOW' });
       // Ensure multiplier is <= max allowed multiplier (100x for now)
     } else if (num > 2) {
       Dispatcher.sendAction('UPDATE_BC_STEP_SIZE', { error: 'STEP_TOO_HIGH' });
       // Ensure no more than 2 decimal places of precision
     } else if (helpers.getPrecision(num) > 2) {
       Dispatcher.sendAction('UPDATE_BC_STEP_SIZE', { error: 'STEP_TOO_PRECISE' });
       // multiplier str is valid
     } else {
       Dispatcher.sendAction('UPDATE_BC_STEP_SIZE', {
         num: num,
         error: null
       });

     }
   },
   _onMultiplierChange: function(e) {
   //  console.log('Multiplier changed');
     var str = e.target.value;
     console.log('You entered', str, 'as your multiplier');
     Dispatcher.sendAction('UPDATE_BC_STEP_SIZE', { str: str });
     this._validateMultiplier(str);
   },

   render: function(){
     return el.div(null,
         el.div(
           {className: 'form-group'},
           el.span(
             {className: 'input-group input-group-sm'},
             el.span({className: 'input-group-addon',
                      style: betStore.state.bc_step_size.error ? { color: 'red' } : {}
                    },'Step Size'),
             el.input(
               {
                 value: betStore.state.bc_step_size.str,
                 type: 'text',
                 className: 'form-control input-sm',
                 onChange: this._onMultiplierChange,
                 style:{fontWeight:'bold'},
                 placeholder: 'multi'
               }
             )
           )
         )
     );
   }
 });
*/

 var BitClimber_StopMulti = React.createClass({
   displayName:'BitClimber_StopMulti',
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
   _validateMultiplier: function(newStr) {
     var num = parseFloat(newStr, 10);
     var isFloatRegexp = /^(\d*\.)?\d+$/;
     var winProb = helpers.multiplierToWinProb(num);
     // Ensure str is a number
     if (isNaN(num) || !isFloatRegexp.test(newStr)) {
       Dispatcher.sendAction('UPDATE_BC_STOP_MULTI', { error: 'INVALID_MULTIPLIER' });
       // Ensure multiplier is >= 1.00x
     } else if (num < 1.02) {
       Dispatcher.sendAction('UPDATE_BC_STOP_MULTI', { error: 'STOP_TOO_LOW' });
       // Ensure multiplier is <= max allowed multiplier (100x for now)
     } else if (num > 20000) {
       Dispatcher.sendAction('UPDATE_BC_STOP_MULTI', { error: 'STOP_TOO_HIGH' });
       // Ensure no more than 2 decimal places of precision
     } else if (helpers.getPrecision(num) > 2) {
       Dispatcher.sendAction('UPDATE_BC_STOP_MULTI', { error: 'STOP_TOO_PRECISE' });
       // multiplier str is valid
     } else {
       Dispatcher.sendAction('UPDATE_BC_STOP_MULTI', {
         num: num,
         error: null
       });

     }
   },
   _onMultiplierChange: function(e) {
   //  console.log('Multiplier changed');
     var str = e.target.value;
     console.log('You entered', str, 'as your multiplier');
     Dispatcher.sendAction('UPDATE_BC_STOP_MULTI', { str: str });
     this._validateMultiplier(str);
   },

   render: function(){
     return el.div(null,
         el.div(
           {className: 'form-group'},
           el.span(
             {className: 'input-group input-group-sm'},
             el.span({className: 'input-group-addon',
                      style: betStore.state.bc_stop_multi.error ? { color: 'red' } : {fontWeight:'bold'}
                    },'Auto Cashout'),
             el.input(
               {
                 value: betStore.state.bc_stop_multi.str,
                 type: 'text',
                 className: 'form-control input-sm',
                 onChange: this._onMultiplierChange,
                 style:{fontWeight:'bold'},
                 placeholder: 'multi'
               }
             ),
             el.span({className: 'input-group-addon',
                      style: betStore.state.bc_stop_multi.error ? { color: 'red' } : {fontWeight:'bold'}
                    },'X')
           )
         )
     );
   }
 });

 var BitClimber_Target = React.createClass({
   displayName:'BitClimber_StopMulti',
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
   _onClick: function() {
     Dispatcher.sendAction( 'TOGGLE_BC_TARGET', null);
   },

   render: function(){
     return el.div(null,
         el.div(
           {className: 'button'},

             el.button(
               {
                 className: 'btn btn-sm btn-block btn-primary',
                 onClick: this._onClick,
                 style:{fontWeight:'bold'}
               },
               'Bet Direction: ' + betStore.state.bc_target_direction
             )
          )
     );
   }
 });

 var BitClimber_StartButton = React.createClass({
   displayName:'BitClimber_StartButton',
   _onStoreChange: function() {
     this.forceUpdate();
   },
   componentDidMount: function() {
     betStore.on('change', this._onStoreChange);
     worldStore.on('change', this._onStoreChange);
     worldStore.on('hotkeys_change',this._onStoreChange);
   },
   componentWillUnmount: function() {
     betStore.off('change', this._onStoreChange);
     worldStore.off('change', this._onStoreChange);
     worldStore.off('hotkeys_change',this._onStoreChange);
   },
   _onClick: function() {
     Dispatcher.sendAction('START_BITCLIMBER',null);
   },
   _onClickStop: function() {
     Dispatcher.sendAction('STOP_BITCLIMBER',null);
   },
   _onClickCashOut: function() {
     if (betStore.state.bc_game_runout_en){
       Dispatcher.sendAction('CASH_OUT_BITCLIMBER',null);
     }else{
       Dispatcher.sendAction('STOP_BITCLIMBER',null);
     }
   },
   render: function(){
     var innerNode;
     var error = betStore.state.wager.error || betStore.state.bc_start_multi.error || betStore.state.bc_step_size.error || betStore.state.clientSeed.error || betStore.state.bc_stop_multi.error;

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
         'INVALID_MULTIPLIER': 'Invalid multiplier',
         'START_TOO_LOW':'Start Multi too low',
         'START_TOO_HIGH':'Start Multi too high',
         'START_TOO_PRECISE':'Start Multi too precise',
         'INVALID_STEP':'Invalid Step Size',
         'STEP_TOO_LOW':'Step Size too low',
         'STEP_TOO_HIGH':'Step Size too high',
         'STEP_TOO_PRECISE':'Step Size too precise',
         'STOP_TOO_LOW':'Stop Multi too low',
         'STOP_TOO_HIGH':'Stop Multi too high',
         'STOP_TOO_PRECISE':'Stop Multi too precise'
       };

       innerNode = el.button(
         {type: 'button',
          disabled: true,
          className: 'btn btn-md btn-block btn-danger'},
         errorTranslations[error] || 'Invalid bet'
       );
     } else if (worldStore.state.user) {
       // If user is logged in, let them submit bet
       if (betStore.state.bc_game_running){
         if (betStore.state.bc_game_runout){
           innerNode = el.button({
               id: 'BC-START',
               type: 'button',
               className: 'btn btn-md btn-block btn-danger',
               onClick: this._onClickStop,
               style:{fontWeight:'bold'}
             },
             'CASHED OUT: ' + betStore.state.bc_multi + 'x', worldStore.state.hotkeysEnabled ? el.kbd(null, 'SPC') : ''
           );
         }else{
         innerNode = el.button({
             id: 'BC-START',
             type: 'button',
             className: 'btn btn-md btn-block btn-danger',
             onClick: this._onClickCashOut,
             style:{fontWeight:'bold'}
           },
           'CASH OUT: ' + betStore.state.bc_multi + 'x', worldStore.state.hotkeysEnabled ? el.kbd(null, 'SPC') : ''
         );
        }
       }else{
       innerNode = el.button({
          id: 'BC-START',
          type: 'button',
           className: 'btn btn-md btn-block btn-success',
           onClick: this._onClick,
           style:{fontWeight:'bold'}
         },
         'START GAME', worldStore.state.hotkeysEnabled ? el.kbd(null, 'SPC') : ''
       );
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
           {className: 'button'},
           innerNode

          )
     );
   }
 });


var BitClimberGameTabContent = React.createClass({
  displayName: 'BitClimberGameTabContent',
  _onStoreChange: function() {
  this.forceUpdate();
  },
  componentDidMount: function() {
  worldStore.on('hotkeys_change',this._onStoreChange);
  AutobetStore.on('change', this._onStoreChange);
  },
  componentWillUnmount: function() {
  worldStore.off('hotkeys_change', this._onStoreChange);
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
  render: function() {
    if(config.debug){console.log('BC PANEL REFRESH');}
    return el.div(
      {className:'panel panel-primary'},
    //  React.createElement(BetBox, null)
      el.div({className:'panel-heading'},
        el.span(null,
        'BITCLIMBER',
        el.div({className:'navbar-right', style: {marginRight:'5px'}},
          el.ul({className:'list-inline'},
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
                  'data-content': "<h6>How To Play:</h6><br><p>Adjust Wager, Optionally adjust start multi and stop multi. Click Start Game.</p>",
                   onMouseOver:this._onPopover
                  },
                el.span({className:'glyphicon glyphicon-info-sign'})
            )
          )
         )
        )
      ),
      el.div({className:'panel-body'},
        (AutobetStore.state.ShowAutobet|| AutobetStore.state.Run_Autobet) ? el.div(
          {className:'row'},
          React.createElement(BitClimberAdvancedSettings, null)
        ):'',
        el.div({className:'row'},
          el.div(
            {className: 'col-xs-12 col-sm-4'},//col-xs-12
            React.createElement(BetBoxWager, null)
          ),
          el.div(
            {className: 'col-xs-12 col-sm-4'},//col-xs-12
            React.createElement(BitClimber_StartMulti, null),
            React.createElement(BitClimber_Runout, null)
          ),
          el.div(
            {className: 'col-xs-12 col-sm-4'},//col-xs-12
            React.createElement(BitClimber_StopMulti, null),
            React.createElement(BitClimber_Target, null)
          ),
          el.div(
            {className: 'col-xs-12',style: {marginTop: '-25px'}},
            el.hr(null)
          ),
          el.div(
            {className: 'col-xs-12 col-sm-6 text-center'},//col-xs-12
            React.createElement(BitClimber_StartButton, null)
          ),
          (AutobetStore.state.ShowAutobet|| AutobetStore.state.Run_Autobet) ? el.div(
            {className: 'col-xs-12 col-sm-5 text-right'},
            React.createElement(AutobetStart, null)
          ):'',
          el.div(
            {className:'row'},
            el.div(
              {className: 'col-xs-12 col-sm-8'},
             React.createElement(BitClimberBetHistory,null)
            ),
            el.div(
              {className: 'col-xs-12 col-sm-4'},
             React.createElement(BetBoxBalance, null)
           ),
           el.div({className:'col-xs-12'},
            React.createElement(BitClimberChart,null)
            ),
           el.div(
             {className: 'col-xs-12', style:{marginTop:'-10px'}},
             React.createElement(BitClimber_Stats,null)
            )
          )
        )
      )
    );
  }
});

Dispatcher.sendAction('MARK_BITCLIMBER_LOADED');
