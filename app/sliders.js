
var Sliders_Stats = React.createClass({
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
    el.div({className:'col-xs-4 col-sm-2'},'Bets: ' + worldStore.state.Slidersstats.bets.toString()),
    el.div({className:'col-xs-4 col-sm-2'},'Wins: ' + worldStore.state.Slidersstats.wins.toString()),
    el.div({className:'col-xs-4 col-sm-2'},'Losses: ' + worldStore.state.Slidersstats.loss.toString()),
    el.div({className:'col-xs-6 col-sm-3'},'Wagered: ' + helpers.convNumtoStr(worldStore.state.Slidersstats.wager) + worldStore.state.coin_type),
    el.div({className:'col-xs-6 col-sm-3'},'Profit: ' + helpers.convNumtoStr(worldStore.state.Slidersstats.profit) + worldStore.state.coin_type)//,
  //el.span({className:'glyphicon glyphicon-refresh'})
    )
  )
);
}
});


 var SlidersAdvancedSettings = React.createClass({
   displayName:'SlidersAdvancedSettings',

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

 var SliderTarget = React.createClass({
   displayName: 'SliderTarget',
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
     var winProb = helpers.multiplierToWinProb(betStore.state.multiplier.num);
     var isError = betStore.state.multiplier.error || betStore.state.wager.error;
     // Just show '--' if chance can't be calculated

     var range = ((winProb * - 100)*-1).toFixed(4);

     if (betStore.state.activesliders == 1){
       var rangesplit = range/2;
       var position = betStore.state.sliderPos;

       if (position < rangesplit){
         position = rangesplit;
       }else if (position > (100 - rangesplit)){
         position = 100 - rangesplit;
       }

       var Start = (position - rangesplit).toFixed(4);
       var End =  (position + rangesplit).toFixed(4);

     }else {
       var rangesplit = range/4;
       var position = [betStore.state.sliderPos,betStore.state.sliderPos2];

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

       var Start = (position[0] - rangesplit).toFixed(4);
       var End =  (position[0] + rangesplit).toFixed(4);
       var Start2 = (position[1] - rangesplit).toFixed(4);
       var End2 =  (position[1] + rangesplit).toFixed(4);

     }

     var innerNode;
     if (isError) {
       innerNode = el.span(
         {className: 'lead'},
         ' --'
       );
     } else if(betStore.state.activesliders == 1){
       innerNode = el.span(
         {className: 'text'},
         '<' + Start + '-' + End + '>'
       );
       Dispatcher.sendAction('UPDATE_SLIDER_POS',position);
       $("#ex1").slider('destroy');
       init_slider();
     } else {
       innerNode = el.span(
         {className: 'text'},
         '<' + Start + '-' + End + '> <' + Start2 + '-' + End2 + '>'
       );
       Dispatcher.sendAction('UPDATE_SLIDER_POS',position);
       $("#ex1").slider('destroy');
       init_slider();
     }

     return el.div(
       {},
       el.span(
         {className: 'lead', style: { fontWeight: 'bold',marginTop: '-25px' }},
         'Range: '
       ),
       innerNode
     );
   }
 });

 var Sliders_BetButton = React.createClass({
   displayName: 'Sliders_BetButton',
   _onStoreChange: function() {
     this.forceUpdate();
   },
   componentDidMount: function() {
     worldStore.on('change', this._onStoreChange);
     betStore.on('change', this._onStoreChange);
     AutobetStore.on('change', this._onStoreChange);
   },
   componentWillUnmount: function() {
     worldStore.off('change', this._onStoreChange);
     betStore.off('change', this._onStoreChange);
     AutobetStore.off('change', this._onStoreChange);
   },
   getInitialState: function() {
     return { waitingForServer: false };
   },
   // cond is '>' or '<'
   _makeBetHandler: function(cond) {
     var self = this;

     console.assert(cond === '<' || cond === '>');

     return function(e) {
       console.log('Placing bet...');
       // Indicate that we are waiting for server response
       self.setState({ waitingForServer: true });

       var hash = next_hash;

       console.assert(typeof hash === 'string');

       var wagerSatoshis = helpers.convCoinTypetoSats(betStore.state.wager.num);// * 100;
       var multiplier = betStore.state.multiplier.num;
       var payoutSatoshis = wagerSatoshis * multiplier;

       var number = helpers.calcNumber(
         cond, helpers.multiplierToWinProb(multiplier)
       );
       var params = {
         wager: wagerSatoshis,
         client_seed: betStore.state.clientSeed.num,
         hash: hash,
         cond: cond,
         target: betStore.state.activesliders == 1 ? {
                  start:betStore.state.sliderStart,
                  end:betStore.state.sliderEnd
                  } : { start:betStore.state.sliderStart,
                        end:betStore.state.sliderEnd,
                        start2:betStore.state.sliderStart2,
                        end2:betStore.state.sliderEnd2
                        },
         payout: payoutSatoshis
       };

     if(config.debug){  console.log('Emitting Socket for slider_bet');}
       socket.emit('slider_bet', params, function(err, bet) {
         if(config.debug){  console.log('Socket returned for dice');}
           self.setState({ waitingForServer: false });
         if (err) {
           console.log('[socket] slider_bet failure:', err);
           self.setState({ waitingForServer: false });
           console.log('auto bet stopped from error');
           Dispatcher.sendAction('STOP_RUN_AUTO');
           if(err.error == 'INVALID_HASH '){
             alert('Bet Stopped due to INVALID_HASH, Fetching new hash automatically');
             gethashfromsocket();
           }
           return;
         }
         if (bet == null){
           console.log('[socket] sliders Timedout');
           self.setState({ waitingForServer: false });
          /* if (cond === '>'){
             $('#bet-hi')[0].click();
           }else {
             $('#bet-lo')[0].click();
           }*/
           return;
         }
         //autowait = true;
         //setTimeout(function(){ autowait = false;}, 100);
         console.log('[socket] slider_bet success:', bet);
         bet.meta = {
           cond: cond,
           number: number,
           hash: hash,
           kind: 'SLIDERS',
           isFair: CryptoJS.SHA256(bet.secret + '|' + bet.salt).toString() === hash
         };

         // Sync up with the bets we get from socket
         bet.wager = wagerSatoshis;
         bet.uname = worldStore.state.user.uname;
         bet.target = params.target;
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

         self.setState({ waitingForServer: false });
         if (betStore.state.randomseed){
             var newseed = randomUint32();//Math.floor(Math.random()*(Math.pow(2,32)-1));
             var str = newseed.toString();
             Dispatcher.sendAction('UPDATE_CLIENT_SEED', { str: str });
           }

         if (AutobetStore.state.Run_Autobet){
           if(config.debug){console.log('Auto_bet routine enabled');}
           //while(autowait){};
           //setTimeout(function(){ Dispatcher.sendAction('AUTOBET_ROUTINE');}, 50);
           Dispatcher.sendAction('AUTOBET_ROUTINE',bet);
         }else {
           // Force re-validation of wager
           if(config.debug){console.log('Auto_bet routine disabled');}
           Dispatcher.sendAction('UPDATE_WAGER', { str: betStore.state.wager.str});
         }
       });

     };
   },
   render: function() {
     var innerNode;

     // TODO: Create error prop for each input
     var error = betStore.state.wager.error || betStore.state.multiplier.error || betStore.state.clientSeed.error || betStore.state.ChanceInput.error;

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
     } else if (worldStore.state.user) {
       // If user is logged in, let them submit bet
       innerNode =  el.button(
               {
                 id: 'sld-bet',
                 type: 'button',
                 className: 'btn btn-md btn-info btn-block',
                 onClick: this._makeBetHandler('<'),
                 disabled: !!this.state.waitingForServer
               },
               'Place Bet', worldStore.state.hotkeysEnabled ? el.kbd(null, 'SPC') : ''
         );
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

     return el.div(
       null,
       innerNode
     );
   }
 });


var slide_move = function(slideEvt){
  var winProb = helpers.multiplierToWinProb(betStore.state.multiplier.num);
  var range = ((winProb * - 100)*-1).toFixed(4);
  var rangesplit;
  var position = slideEvt.value;

  if (betStore.state.activesliders == 1){
  rangesplit = range/2;
  if (position < rangesplit){
    position = rangesplit;
    $("#ex1").slider('setValue', position);
  }else if (position > (100 - rangesplit)){
    position = 100 - rangesplit;
    $("#ex1").slider('setValue', position);
  }
  $("#ex1").slider('setAttribute','rangeHighlights', [{"start":(position - rangesplit),"end":(position + rangesplit)}]);
}else{
  rangesplit = range/4;
  if (betStore.state.sliderPos != position[0]){
    if (position[0] < rangesplit){ //CHECK MIN
      position[0] = rangesplit;
      $("#ex1").slider('setValue', position);
    }else if (position[0] > (100 - (rangesplit * 3))){ //CHECK MAX
      position[0] = 100 - (rangesplit * 3);
      position[1] = 100 - rangesplit;
      $("#ex1").slider('setValue', position);
    }else if((position[0] + rangesplit) > (position[1] - rangesplit)){ //CHECK INTERFERANCE
      if (position[1] >= (100 - rangesplit)){
        position[0] = 100 - (rangesplit * 3);
        position[1] = 100 - rangesplit;
        $("#ex1").slider('setValue', position);
      }else {
        position[1] = position[0] + (rangesplit * 2);
        if (position[1] > (100 - rangesplit)){
          position[1] = 100 - rangesplit;
          position[0] = 100 - (rangesplit * 3);
        }
        $("#ex1").slider('setValue', position);
      }
    }
  }else{
    if (position[1] < (rangesplit * 3)){ //CHECK MIN
      position[1] = rangesplit * 3;
      position[0] = rangesplit;
      $("#ex1").slider('setValue', position);
    }else if (position[1] > (100 - rangesplit)){ //CHECK MAX
      position[1] = 100 - rangesplit;
      $("#ex1").slider('setValue', position);
    }else if((position[0] + rangesplit) > (position[1] - rangesplit)){ //CHECK INTERFERANCE
      if (position[0] <= rangesplit){
        position[1] = rangesplit * 3;
        position[0] = rangesplit;
        $("#ex1").slider('setValue', position);
      }else {
        position[0] = position[1] - (rangesplit * 2);
        if (position[0] <= rangesplit){
          position[1] = rangesplit * 3;
          position[0] = rangesplit;
        }
        $("#ex1").slider('setValue', position);
      }
    }

  }

  $("#ex1").slider('setAttribute','rangeHighlights', [{"start":(position[0] - rangesplit),"end":(position[0] + rangesplit)},{"start":(position[1] - rangesplit),"end":(position[1] + rangesplit)}]);

}
  Dispatcher.sendAction('UPDATE_SLIDER_POS',position);
};

  var init_slider = function(){
    $('#ex1').slider({
     value: betStore.state.activesliders == 1 ? betStore.state.sliderPos : [betStore.state.sliderPos,betStore.state.sliderPos2] ,
     formatter: function(value) {
       var winProb = helpers.multiplierToWinProb(betStore.state.multiplier.num);
       var range = ((winProb * - 100)*-1).toFixed(4);
       var rangesplit = (range/2)/betStore.state.activesliders;

       if (betStore.state.activesliders == 1){
          return '<' + (value - rangesplit).toFixed(4) + '-' + (value + rangesplit).toFixed(4) + '>';//'Current value: ' + value;
       }else {
          return '<' + (value[0] - rangesplit).toFixed(4) + '-' + (value[0] + rangesplit).toFixed(4) + '>+<' + (value[1] - rangesplit).toFixed(4) + '-' + (value[1] + rangesplit).toFixed(4) + '>';
        }
     },
     rangeHighlights: betStore.state.activesliders == 1 ? [{ "start": betStore.state.sliderStart, "end": betStore.state.sliderEnd }] : [{ "start": betStore.state.sliderStart, "end": betStore.state.sliderEnd },{ "start": betStore.state.sliderStart2, "end": betStore.state.sliderEnd2 }]
    });

    $("#ex1").on("slide", function(slideEvt) {
      slide_move(slideEvt);
      //console.log('Slider slide: ' + slideEvt.value);
    });

    $("#ex1").on("slideStart", function(slideEvt) {
      slide_move(slideEvt);
      //console.log('Slider start: ' + slideEvt.value);
    });

    $("#ex1").on("slideStop", function(slideEvt) {
      slide_move(slideEvt);
      //console.log('Slider stop: ' + slideEvt.value);
    });


  };

 var Slider_Selector = React.createClass({
 displayName: 'Slider_Selector',
 _onStoreChange: function() {
   this.forceUpdate();
 },
 componentDidMount: function() {
   betStore.on('change', this._onStoreChange);
   betStore.on('slider_change', this._onStoreChange);
   worldStore.on('change', this._onStoreChange);

   init_slider();

 },
 componentWillUnmount: function() {
   betStore.off('change', this._onStoreChange);
   betStore.off('slider_change', this._onStoreChange);
   worldStore.off('change', this._onStoreChange);
 },
 render: function() {
 var innerNode;
 if (betStore.state.activesliders == 1){
   innerNode =  el.input({ id:"ex1", 'data-slider-id':'ex1Slider', 'type':"text", 'data-slider-min':"0.0000", 'data-slider-max':"100", 'data-slider-step':"0.00005", 'data-slider-value':betStore.state.sliderPos.toFixed(4),
             'data-slider-rangeHighlights':'[{ "start": 5, "end": 25 }]',
             style:{width:'100%', height:'35px'}
           },'');
 }else if (betStore.state.activesliders == 2){
   innerNode =  el.input({ id:"ex1", 'data-slider-id':'ex1Slider', 'type':"text", 'data-slider-min':"0.0000", 'data-slider-max':"100", 'data-slider-step':"0.00005", 'data-slider-value': '[' + betStore.state.sliderPos + ','+ betStore.state.sliderPos2 +']',
             'data-slider-rangeHighlights':'[{ "start": 5, "end": 25 }]',
             style:{width:'100%', height:'35px'}
           },'');
 }

 return el.div(
 null,
 el.div(
   {className:'well well-sm col-xs-12'},
   innerNode
   )
 );
 }
 });


 var Slider_Count = React.createClass({
 displayName: 'Slider_Count',
 _onStoreChange: function() {
   this.forceUpdate();
 },
 componentDidMount: function() {
   betStore.on('change', this._onStoreChange);
   betStore.on('slider_change', this._onStoreChange);
   worldStore.on('change', this._onStoreChange);
 },
 componentWillUnmount: function() {
   betStore.off('change', this._onStoreChange);
   betStore.off('slider_change', this._onStoreChange);
   worldStore.off('change', this._onStoreChange);
 },
 _onClick: function() {
  $('dropdown-toggle').dropdown();
 },
 _ActionClick: function(num){
   return function(){
     if(config.debug){console.log('click action: ' + num);}
     Dispatcher.sendAction('UPDATE_SLIDER_COUNT', num);
   };
 },
 render: function() {

 return el.div(null,
 el.button({    id: 'SLD_CNT',
                type:'button',
                className:'btn btn-md btn-primary dropdown-toggle',
                "data-toggle":'dropdown',
                "aria-haspopup":'true',
                "aria-expanded":'false',
                onClick:this._onClick
              },
              'Ranges: ' + betStore.state.activesliders, el.span({className:'caret'},'')
            ),
            el.ul({className:'dropdown-menu'},
            el.li(null, el.a({onClick: this._ActionClick(1)},'1')),
            el.li(null, el.a({onClick: this._ActionClick(2)},'2'))
          )
 );
 }
 });



var SlidersGameTabContent = React.createClass({
  displayName: 'SlidersGameTabContent',
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
        'SLIDERS',
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
                  'data-content': "<h6>How To Play:</h6><br><p>Adjust Wager, Adjust Chance or Multiplier, Set Slider to range you desire, Click Place Bet.</p>",
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
          React.createElement(SlidersAdvancedSettings, null)
        ):'',
        el.div({className:'row'},
          el.div(
            {className: 'col-xs-12 col-sm-8 col-md-8 col-lg-8 well well-sm', style: {marginTop: '-15'}},
            el.div(
              {className: 'col-xs-12 col-sm-6'},
              React.createElement(BetBoxMultiplier, null)
              ),
            el.div({className: 'col-xs-12 col-sm-1', style:{marginTop:'10px',color:'gray'}},
              el.span({className:'glyphicon glyphicon-transfer'})
            ),
            el.div(
              {className: 'col-xs-12 col-sm-5'},
              React.createElement(BetBoxChanceInput, null)
            ),
            el.div(
              {className: 'col-xs-12 col-sm-6'},//,style: {marginTop: '-15'}},
              React.createElement(SliderTarget, null)
            ),
            el.div(
              {className: 'col-xs-12 col-sm-6'},//,style: {marginTop: '-15'}},
              React.createElement(BetBoxProfit, null)
            )
          ),
          el.div(
            {className: 'col-xs-12 col-sm-4'},//col-xs-12
            React.createElement(BetBoxWager, null)
          ),
          el.div(
            {className: 'col-xs-12',style: {marginTop: '-25px'}},
            el.hr(null)
          ),

          el.div(
            {className: 'col-xs-12'},
            React.createElement(Slider_Selector, null)
          ),

          el.div(
            {className: 'col-xs-12 col-sm-4 text-center'},//col-xs-12
            React.createElement(Sliders_BetButton, null)
          ),
          (AutobetStore.state.ShowAutobet|| AutobetStore.state.Run_Autobet) ? el.div(
            {className: 'col-xs-12 col-sm-4 text-right'},
            React.createElement(AutobetStart, null)
          ):'',
          el.div(
            {className: 'col-xs-12 col-sm-2'},
           React.createElement(BetBoxBalance, null)
         ),
         el.div(
           {className: 'col-xs-12 col-sm-2'},
          React.createElement(Slider_Count, null)
        ),
          el.div(
            {className:'row'},
           el.div(
             {className: 'col-xs-12', style:{marginTop:'-2px'}},
             React.createElement(BetBoxLastBet,null),
             React.createElement(Sliders_Stats,null)
            )
          )
        )
      )
    );
  }
});

Dispatcher.sendAction('MARK_SLIDERS_LOADED');
