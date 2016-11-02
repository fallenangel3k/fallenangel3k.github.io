// bit-exo.com V3.0.0
// Copyright 2016 bit-exo.com

///////////////////////
// All trademarks,trade names,images,contents,snippets,codes,including text
// and graphics appearing on the site are intellectual property of their
// respective owners, including in some instances,"bit-exo.com".
// All rights reserved.
//contact: admin@bit-exo.com
//////////////////////////

var BitSweepBombs = React.createClass({
displayName: 'BitSweepBombs',
_set_bombs: function(num){
   return function () {Dispatcher.sendAction('SET_BOMBSELECT', num);}
},
_validateBombs: function(newStr) {
  var num = parseInt(newStr, 10);

  // Ensure str is a number
  if (isNaN(num)) {
  }
  else if ((num > 0)&&(num < 25)){
    Dispatcher.sendAction('SET_BOMBSELECT', num);
  }

},

_onBombChange: function(e) {
  var str = e.target.value;
  //Dispatcher.sendAction('UPDATE_WAGER', { str: str });
  this._validateBombs(str);
},
render: function() {
  var style1 = { borderBottomLeftRadius: '0', borderBottomRightRadius: '0',fontWeight: 'bold' };
  var style2 = { borderTopLeftRadius: '0',fontWeight: 'bold' };
  var style3 = { borderTopRightRadius: '0',fontWeight: 'bold' };
return el.div(
        null,
        el.div({className: 'input-group',style: { marginTop: '-15px' }},
              el.input(
                {
                  value: betStore.state.BombSelect.toString(),
                  type: 'text',
                  className: 'form-control input-md',
                  style: style1,
                  onChange: this._onBombChange,
                   onClick: this._onBombChange,
                  disabled: ((!!worldStore.state.isLoading)||(betStore.state.BS_Game.state == 'RUNNING')),
                  placeholder: 'Bombs'
                }
              ),
              el.span(
                {className: 'input-group-addon'},
                'BOMBS'
              )
        ),
        el.div(
          {className:'btn-group btn-group-justified'},
          el.div(
            {className:'btn-group'},
            el.button(
                {
                  type: 'button',
                  className: 'btn btn-md ' + (betStore.state.BombSelect == 1 ? 'btn-warning' : 'btn-default'),
                  style:style2,
                  onClick: this._set_bombs(1),
                  disabled: (betStore.state.BS_Game.state == 'RUNNING')
                },
                el.span({className: 'glyphicon glyphicon-certificate'}),
                '1'
              )
          ),
          el.div(
            {className:'btn-group'},
            el.button(
                {
                  type: 'button',
                  className: 'btn btn-md ' + (betStore.state.BombSelect == 5 ? 'btn-warning' : 'btn-default'),
                  style:{fontWeight: 'bold'},
                  onClick: this._set_bombs(5),
                  disabled: (betStore.state.BS_Game.state == 'RUNNING')
                },
                el.span({className: 'glyphicon glyphicon-certificate'}),
                '5'
              )
          ),
          el.div(
            {className:'btn-group'},
            el.button(
                {
                  type: 'button',
                  className: 'btn btn-md ' + (betStore.state.BombSelect == 10 ? 'btn-warning' : 'btn-default'),
                  style:{fontWeight: 'bold'},
                  onClick: this._set_bombs(10),
                  disabled: (betStore.state.BS_Game.state == 'RUNNING')
                },
                el.span({className: 'glyphicon glyphicon-certificate'}),
                '10'
              )
          ),
          el.div(
            {className:'btn-group'},
            el.button(
                {
                  type: 'button',
                  className: 'btn btn-md ' + (betStore.state.BombSelect == 20 ? 'btn-warning' : 'btn-default'),
                  style:style3,
                  onClick: this._set_bombs(20),
                  disabled: (betStore.state.BS_Game.state == 'RUNNING')
                },
                el.span({className: 'glyphicon glyphicon-certificate'}),
                '20'
              )
          )
        )
    );
  }

});


var BitSweepBetButton = React.createClass({
displayName: 'BitSweepBetButton',
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
_start_game: function(){
  clearAllTiles();
  Dispatcher.sendAction('START_BITSWEEP');
},
_stop_game: function(){
  Dispatcher.sendAction('STOP_BITSWEEP');
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
    if (betStore.state.BS_Game.state == 'RUNNING')
      {
        Dispatcher.sendAction('STOP_BITSWEEP');
      }
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
          id: 'BS-START',
          type: 'button',
          className: 'btn btn-lg btn-success btn-block',
          style:{fontWeight: 'bold'},
          onClick: betStore.state.BS_Game.state == 'RUNNING' ? this._stop_game : this._start_game
        },
        betStore.state.BS_Game.state == 'RUNNING' ? 'CASH OUT' : 'START GAME',
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
      innerNode
    );
  }

});

var BitSweepStakeWell = React.createClass({
displayName: 'BitSweepStakeWell',
render: function() {
return el.div(
      null,
      el.div(
        {className: 'col-xs-12 well well-sm'},
        el.div(
          {className:'col-xs-12 col-md-6 text text-left'},
          'Next: ',
          el.span(
            {className: 'text', style: { color: 'green'}},
            betStore.state.BS_Game.state == 'RUNNING' ? helpers.convNumtoStr(betStore.state.BS_Game.next) : '--'//'0.25'
          )
        ),
        el.div(
          {className:'col-xs-12 col-md-6 text text-left'},
          'Stake: ',
          el.span(
            {className: 'text', style: { color: 'orange'}},
            betStore.state.BS_Game.state == 'RUNNING' ? helpers.convNumtoStr(betStore.state.BS_Game.stake) : '--'//'1.00'
          )
        )
      )
    );
  }
});

var BitSweepLastBet = React.createClass({
displayName: 'BitSweepLastBet',
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
  //var last_wager = helpers.convNumtoStr(100);
  var last_profit = 100;
  last_bet = '';

  if (worldStore.state.first_bet){
   last_bet = (worldStore.state.bets.data[worldStore.state.bets.end].bet_id||worldStore.state.bets.data[worldStore.state.bets.end].id);
   //last_wager = helpers.convNumtoStr(worldStore.state.bets.data[worldStore.state.bets.end].wager);
   last_profit = worldStore.state.bets.data[worldStore.state.bets.end].profit;
  }

  return el.div(
    null,
    el.div(
      {className:'well well-sm col-xs-12'},
      el.div(
        { className: 'col-xs-12 col-md-6'},
        el.div(
        {className: 'text'},
        'Last: ',
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
        { className: 'col-xs-12 col-md-6'},
        el.div(
        {className: 'text'},
        'Profit: ',
        el.span(
          {className: 'text', style: { color: last_profit > 0 ? 'green' : 'red'}},
         last_profit > 0 ? '+' + helpers.convNumtoStr(last_profit) : helpers.convNumtoStr(last_profit)
        )
      )
      )
    )
  );
}
});


var BitSweepBetBox = React.createClass({
displayName: 'BitSweepBetBox',
_onStoreChange: function() {
this.forceUpdate();
},
componentDidMount: function() {
worldStore.on('new_user_bet', this._onStoreChange);
betStore.on('change', this._onStoreChange);
},
componentWillUnmount: function() {
worldStore.off('new_user_bet', this._onStoreChange);
betStore.off('change', this._onStoreChange);
},
render: function() {
return el.div(
      null,
      el.div(
        {className: 'col-xs-12'},
        React.createElement(BetBoxWager, null)
      ),
      el.div(
        {className: 'col-xs-12',style: {marginTop:'10px'}},
        React.createElement(BitSweepBombs, null)
      ),
      el.div(
        {className: 'row'},
        el.div(
          {className: 'col-xs-12',style: {marginTop: '-15px'}},
          el.hr(null)
        )
      ),
      el.div(
        {className: 'col-xs-12 text-center'},
        React.createElement(BitSweepBetButton, null)
      ),
      el.div(
        {className: 'row'},
        el.div(
          {className: 'col-xs-12',style: {marginTop: '10px'}},
          React.createElement(BitSweepStakeWell, null)
        )
      ),
      el.div(
        {className: 'row'},
        el.div(
          {className: 'col-xs-12'},
          React.createElement(BitSweepLastBet, null)
        )
      )
    );
  }

});


var BitSweepBoard = React.createClass({
  displayName: 'BitSweepBoard',

  render: function (){
    var bet_table;
    bet_table = el.div(null,
      el.table({className:'B_bet_table'},
        el.tbody(
          null,
          el.tr(null,
            el.td(
              {className:'bs-hide 1'},
              el.p(null,''),
              el.button ({className:'BS_BTN',type: 'button'},'')
            ),
            el.td(
              {className:'bs-hide 2'},
              el.p(null,''),
              el.button ({className:'BS_BTN',type: 'button'},'')
            ),
            el.td(
              {className:'bs-hide 3'},
              el.p(null,''),
              el.button ({className:'BS_BTN',type: 'button'},'')
            ),
            el.td(
              {className:'bs-hide 4'},
              el.p(null,''),
              el.button ({className:'BS_BTN',type: 'button'},'')
            ),
            el.td(
              {className:'bs-hide 5'},
              el.p(null,''),
              el.button ({className:'BS_BTN',type: 'button'},'')
            )
          ),
          el.tr(null,
            el.td(
              {className:'bs-hide 6'},
              el.p(null,''),
              el.button ({className:'BS_BTN',type: 'button'},'')
            ),
            el.td(
              {className:'bs-hide 7'},
              el.p(null,''),
              el.button ({className:'BS_BTN',type: 'button'},'')
            ),
            el.td(
              {className:'bs-hide 8'},
              el.p(null,''),
              el.button ({className:'BS_BTN',type: 'button'},'')
            ),
            el.td(
              {className:'bs-hide 9'},
              el.p(null,''),
              el.button ({className:'BS_BTN',type: 'button'},'')
            ),
            el.td(
              {className:'bs-hide 10'},
              el.p(null,''),
              el.button ({className:'BS_BTN',type: 'button'},'')
            )
          ),
          el.tr(null,
            el.td(
              {className:'bs-hide 11'},
              el.p(null,''),
              el.button ({className:'BS_BTN',type: 'button'},'')
            ),
            el.td(
              {className:'bs-hide 12'},
              el.p(null,''),
              el.button ({className:'BS_BTN',type: 'button'},'')
            ),
            el.td(
              {className:'bs-hide 13'},
              el.p(null,''),
              el.button ({className:'BS_BTN',type: 'button'},'')
            ),
            el.td(
              {className:'bs-hide 14'},
              el.p(null,''),
              el.button ({className:'BS_BTN',type: 'button'},'')
            ),
            el.td(
              {className:'bs-hide 15'},
              el.p(null,''),
              el.button ({className:'BS_BTN',type: 'button'},'')
            )
          ),
          el.tr(null,
            el.td(
              {className:'bs-hide 16'},
              el.p(null,''),
              el.button ({className:'BS_BTN',type: 'button'},'')
            ),
            el.td(
              {className:'bs-hide 17'},
              el.p(null,''),
              el.button ({className:'BS_BTN',type: 'button'},'')
            ),
            el.td(
              {className:'bs-hide 18'},
              el.p(null,''),
              el.button ({className:'BS_BTN',type: 'button'},'')
            ),
            el.td(
              {className:'bs-hide 19'},
              el.p(null,''),
              el.button ({className:'BS_BTN',type: 'button'},'')
            ),
            el.td(
              {className:'bs-hide 20'},
              el.p(null,''),
              el.button ({className:'BS_BTN',type: 'button'},'')
            )
          ),
          el.tr(null,
            el.td(
              {className:'bs-hide 21'},
              el.p(null,''),
              el.button ({className:'BS_BTN',type: 'button'},'')
            ),
            el.td(
              {className:'bs-hide 22'},
              el.p(null,''),
              el.button ({className:'BS_BTN',type: 'button'},'')
            ),
            el.td(
              {className:'bs-hide 23'},
              el.p(null,''),
              el.button ({className:'BS_BTN',type: 'button'},'')
            ),
            el.td(
              {className:'bs-hide 24'},
              el.p(null,''),
              el.button ({className:'BS_BTN',type: 'button'},'')
            ),
            el.td(
              {className:'bs-hide 25'},
              el.p(null,''),
              el.button ({className:'BS_BTN',type: 'button'},'')
            )
          )
        )
      )
    );

    return el.div(
      null,
      el.div(
        {className: 'BitSweepTable', id: 'B-Table'},
        el.div ({className: 'bs'},
            el.div({className:'row'},
            el.div ({className:'col-xs-12 col-sm-8 col-md-5 col-lg-4 text-left', style:{marginTop:'15px'}},
              React.createElement(BitSweepBetBox, null)
            ),
            el.div ({className: 'bs-field col-xs-12 col-md-6 col-lg-5'},
              bet_table
            )/*,
            el.span ({className:'col-xs-12 col-md-6 col-lg-3 text-left', style:{marginTop:'15px'}},
              React.createElement(BitSweepSettingsBox, null)
            )*/
          )
        )

      )
    );
  }

});

var BS_buttongen = setInterval(bsbuttongen, 100);

function bsbuttongen(){
  var singleBet = document.getElementsByClassName('BS_BTN');
  for(var y = 0; y < singleBet.length; y++){
    singleBet[y].onclick = function(){
    //  console.log('left click');  //ADD CHIP
        RevealTile(this);
    }
    }

  if (singleBet.length > 0)
  {
    clearInterval(BS_buttongen);
  }

};


function createTile(tileType, numbers) {
  var profit = numbers;
  var div = document.createElement('div');
  div.className = tileType;
  if (tileType == 'BOMB_TILE'){
      div.innerHTML = '';
  }else if (profit){
    div.innerHTML = '+' + profit;
  }

  return div;
}


var bs_rangeParam =[];

function set_BS_RangeParam(){
bs_rangeParam =[];

var chance = (25-betStore.state.BS_Game.bombs-betStore.state.BS_Game.cleared)/(25-betStore.state.BS_Game.cleared);
var range = Math.floor(Math.pow(2,32)*(chance))

    bs_rangeParam.push(
        {
        from: 0,
        to: range,
        value: betStore.state.BS_Game.stake+betStore.state.BS_Game.next
        }
    );
    bs_rangeParam.push(
        {
        from: range+1,
        to: Math.pow(2,32)-1,
        value: 0
        }
    );

}

var tile_wait = false;
function RevealTile(parent) {

  if (betStore.state.BS_Game.state == 'RUNNING'){
        if ((parent.children.length == 0) && (tile_wait == false)) {

          set_BS_RangeParam();
          var payouts = bs_rangeParam;

          var wager = betStore.state.BS_Game.stake;
          var hash = betStore.state.nextHash;

          var bodyParams = {
          client_seed: betStore.state.clientSeed.num,
          hash: hash,
          payouts: payouts,
          wager: wager,
          max_subsidy:0
          }
          tile_wait = true;
          socket.emit('bitsweep_bet', bodyParams, function(err, bet) {
            if (err) {
              tile_wait = false;
              console.log('[socket] bitsweep_bet failure:', err);
              Dispatcher.sendAction('STOP_BITSWEEP');
              if(err.error == 'INVALID_HASH '){
                alert('Bet Stopped due to INVALID_HASH, Fetching new hash automatically');
                gethashfromsocket();
              }
              return;
            }
            console.log('[socket] bitsweep_bet success:', bet);
            bet.meta = {
              cond: '>',
              number: 99.99,
              hash: hash,
              kind: 'BITSWEEP',
              isFair: CryptoJS.SHA256(bet.secret + '|' + bet.salt).toString() === hash
            };
            // Sync up with the bets we get from socket
            bet.wager = wager;
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

            Dispatcher.sendAction('SET_NEXT_HASH', bet.next_hash);

            Dispatcher.sendAction('UPDATE_USER', {
              balance: worldStore.state.user.balance + bet.profit
            });

            if (betStore.state.randomseed){
                var newseed = randomUint32();//Math.floor(Math.random()*(Math.pow(2,32)-1));
                var str = newseed.toString();
                Dispatcher.sendAction('UPDATE_CLIENT_SEED', { str: str });
              }

            if (bet.profit > 0){
              parent.appendChild(createTile("WIN_TILE", helpers.convSatstoCointype(betStore.state.BS_Game.next)));
              Dispatcher.sendAction('GET_NEXT_BITSWEEP');
            }else{
              betStore.state.BS_Game.cleared++;
              parent.appendChild(createTile("BOMB_TILE", ''));
              Dispatcher.sendAction('STOP_BITSWEEP');
            }
            tile_wait = false;
          });

        } else {
            if (tile_wait){
              setTimeout(function(){ tile_wait = false;},500);
            }
        }
      }

}


function clearAllTiles(){
  var chipSets = ["WIN_TILE", "BOMB_TILE"];
  for(var x = 0; x< chipSets.length; x++){
    var  currChip = document.getElementsByClassName(chipSets[x]);
    while(currChip[0]){
  	   currChip[0].remove();
      }
    }
}

function ShowAllBombs(revealed,bombs){
  var shownbombs;
  var last_profit = -1;
  if (worldStore.state.bets.data[worldStore.state.bets.end] != undefined){
      last_profit = worldStore.state.bets.data[worldStore.state.bets.end].profit;
      }
  var hidden = 25-revealed-1;
  if ((last_profit > 0)||(betStore.state.BS_Game.cleared == 0)){
    shownbombs = 0;
  }else {
    shownbombs = 1;
  }

  var toggle = !!Math.floor(Math.random() * 2);
  var singleTile = document.getElementsByClassName('BS_BTN');
  for(var y = 0; y < singleTile.length; y++){
    if (singleTile[y].children.length == 0) {
      if ((hidden > bombs)&&(shownbombs < bombs)){
          toggle = !!Math.floor(Math.random() * 2);
          if (toggle){
            singleTile[y].appendChild(createTile("BOMB_TILE", ''));
            shownbombs++;
          }else{
            singleTile[y].appendChild(createTile("WIN_TILE", ''));
          }
      }else if (shownbombs < bombs){
        singleTile[y].appendChild(createTile("BOMB_TILE", ''));
        shownbombs++;
      }else{
        singleTile[y].appendChild(createTile("WIN_TILE", ''));
      }
      hidden--;
    }
  }
}


var Bitsweep_Stats = React.createClass({
displayName: 'Bitsweep_Stats',
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
  {className:'well well-sm',style:{marginBottom:'-15px'}},
  el.div({className:'row'},
    el.div({className:'col-xs-4 col-sm-2'},'Bets: ' + worldStore.state.bitsweepstats.bets.toString()),
    el.div({className:'col-xs-4 col-sm-2'},'Wins: ' + worldStore.state.bitsweepstats.wins.toString()),
    el.div({className:'col-xs-4 col-sm-2'},'Losses: ' + worldStore.state.bitsweepstats.loss.toString()),
    el.div({className:'col-xs-6 col-sm-3'},'Wagered: ' + helpers.convNumtoStr(worldStore.state.bitsweepstats.wager) + worldStore.state.coin_type),
    el.div({className:'col-xs-6 col-sm-3'},'Profit: ' + helpers.convNumtoStr(worldStore.state.bitsweepstats.profit) + worldStore.state.coin_type)//,
  //el.span({className:'glyphicon glyphicon-refresh'})
    )
  )
);
}
});


var BitsweepAdvancedSettings = React.createClass({
  displayName:'BitsweepAdvancedSettings',

  render: function(){
    return el.div(
       {className: 'well well-sm row'},
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
        )

    );
  }

});



var BitsweepGameTabContent = React.createClass({
  displayName: 'BitsweepGameTabContent',
  _onStoreChange: function() {
  this.forceUpdate();
  },
  componentDidMount: function() {
  worldStore.on('change',this._onStoreChange)
  AutobetStore.on('change', this._onStoreChange);
  },
  componentWillUnmount: function() {
  worldStore.off('change', this._onStoreChange);
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
    return el.div(
      {className:'panel panel-primary'},
    //  React.createElement(BetBox, null)
      el.div({className:'panel-heading'},
        el.span(null,
        'BITSWEEP',
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
                  'data-content': "<h6>How To Play:</h6><br><p>Select No of Bombs, Adjust Wager, Click Start, Click tiles on the field, Click Cashout to save your winnings before hitting a Bomb</p>",
                   onMouseOver:this._onPopover
                  },
                el.span({className:'glyphicon glyphicon-info-sign'})
            )
          )
         )
        )
      ),
      el.div({className:'panel-body'},
        React.createElement(BitSweepBoard, null),
        (AutobetStore.state.ShowAutobet|| AutobetStore.state.Run_Autobet) ? el.div(
          null,//{className:'row'},
          React.createElement(BitsweepAdvancedSettings, null)
        ):'',
        el.div(
          {className: 'row'},
          React.createElement(Bitsweep_Stats,null)
         )
      )
    );
  }
});


Dispatcher.sendAction('MARK_BITSWEEP_LOADED');
