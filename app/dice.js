// bit-exo.com V3.0.0
// Copyright 2016 bit-exo.com

///////////////////////
// All trademarks,trade names,images,contents,snippets,codes,including text
// and graphics appearing on the site are intellectual property of their
// respective owners, including in some instances,"bit-exo.com".
// All rights reserved.
//contact: admin@bit-exo.com
var BetBoxClientSeed = React.createClass({
  displayName: 'BetBoxClientSeed',
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
  _randomizeSeed: function(){
    console.log('clientSeed changed');
    var newseed = randomUint32();//Math.floor(Math.random()*(Math.pow(2,32)-1));
    var str = newseed.toString();
    console.log('New Random String ', str);
    Dispatcher.sendAction('UPDATE_CLIENT_SEED', { str: str });
  },
  _onclientSeedChange: function(e) {
  //  console.log('clientSeed changed');
    var str = e.target.value;
    console.log('You entered', str, 'as your clientSeed');
    Dispatcher.sendAction('UPDATE_CLIENT_SEED', { str: str });
  },
  _onRndSeedToggle: function(){
    Dispatcher.sendAction('TOGGLE_RND_SEED');
  },
  render: function() {
    return el.div(
      null,//{className: 'form-group'},
      //el.p(
      //  {className: 'lead', style: { fontWeight: 'bold',marginTop: '-15px' }},
      //  'Client Seed:'
      //),
      el.div({className: 'form-group'},
          el.div(
            {className: 'input-group'},
            el.span(
              {className: 'input-group-addon'},
              'Seed'
            ),
            el.input(
              {
                type: 'text',
                value: betStore.state.clientSeed.str,
                style : {fontWeight: 'bold'},
                className: 'form-control input-sm bot_seed',
                onChange: this._onclientSeedChange,
                onClick: this._onclientSeedChange
              }
            ),
            el.span({className:'input-group-btn'},
              el.button(
                {
                  type: 'button',
                  className: 'btn btn-primary btn-sm', style:{fontWeight: 'bold',paddingLeft: '5px', paddingRight:'5px'},
                  onClick: this._randomizeSeed
                },
                el.span(null,'RND')
              )
            )
        ),
        el.div(null,
          el.button({
             type:'button',
             className:'btn btn-sm btn-default',
             onClick: this._onRndSeedToggle
            },
            el.span(
              {className: betStore.state.randomseed ? 'label-success':'label-default'},
              betStore.state.randomseed ? 'Randomize Each Bet':'Keep Seed for Each'
            )
          )
        )
      )
    );
  }
});



var HouseEdgeDropdown = React.createClass({
  displayName:'HouseEdgeDropdown',
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
  _ActionClick: function(number){
    return function () {
      console.log('HE click' + number);
      Dispatcher.sendAction('SET_HOUSE_EDGE',(number/100)); }
  },
  _ListEdges: function(){
    var rtn;
    for(var x = 8; x < 50; x++){
       rtn.push (
         el.li(null, el.a({onClick: this._ActionClick('BTC')},(x/10).toFixed(1)))
      );
    }
    return rtn;
  },
  render: function(){
    var innerNode = this._ListEdges
    return el.div(
      null,
      el.div (
        {className: 'btn-group input-group'},
        el.div({ className:'input-group-addon', style:{fontWeight:'bold'}},'House Edge'),
        el.button(
          {
            type:'button',
            className:'btn btn-block btn-sm btn-primary dropdown-toggle bot_edge',
            "data-toggle":'dropdown',
            "aria-haspopup":'true',
            "aria-expanded":'false',
            onClick:this._onClick
          },
          (betStore.state.house_edge * 100).toFixed(2) + '% ', el.span({className:'caret'},'')
        ),
        el.ul({className:'dropdown-menu'},
          el.li(null, el.a({onClick: this._ActionClick(0.8)},'0.8')),
          el.li(null, el.a({onClick: this._ActionClick(0.9)},'0.9')),
          el.li(null, el.a({onClick: this._ActionClick(1.0)},'1.0')),
          el.li(null, el.a({onClick: this._ActionClick(1.1)},'1.1')),
          el.li(null, el.a({onClick: this._ActionClick(1.2)},'1.2')),
          el.li(null, el.a({onClick: this._ActionClick(1.3)},'1.3')),
          el.li(null, el.a({onClick: this._ActionClick(1.4)},'1.4')),
          el.li(null, el.a({onClick: this._ActionClick(1.5)},'1.5')),
          el.li(null, el.a({onClick: this._ActionClick(1.6)},'1.6')),
          el.li(null, el.a({onClick: this._ActionClick(1.7)},'1.7')),
          el.li(null, el.a({onClick: this._ActionClick(1.8)},'1.8')),
          el.li(null, el.a({onClick: this._ActionClick(1.9)},'1.9')),
          el.li(null, el.a({onClick: this._ActionClick(2.0)},'2.0')),
          el.li(null, el.a({onClick: this._ActionClick(2.1)},'2.1')),
          el.li(null, el.a({onClick: this._ActionClick(2.2)},'2.2')),
          el.li(null, el.a({onClick: this._ActionClick(2.3)},'2.3')),
          el.li(null, el.a({onClick: this._ActionClick(2.4)},'2.4')),
          el.li(null, el.a({onClick: this._ActionClick(2.5)},'2.5')),
          el.li(null, el.a({onClick: this._ActionClick(2.6)},'2.6')),
          el.li(null, el.a({onClick: this._ActionClick(2.7)},'2.7')),
          el.li(null, el.a({onClick: this._ActionClick(2.8)},'2.8')),
          el.li(null, el.a({onClick: this._ActionClick(2.9)},'2.9')),
          el.li(null, el.a({onClick: this._ActionClick(3.0)},'3.0')),
          el.li(null, el.a({onClick: this._ActionClick(3.1)},'3.1')),
          el.li(null, el.a({onClick: this._ActionClick(3.2)},'3.2')),
          el.li(null, el.a({onClick: this._ActionClick(3.3)},'3.3')),
          el.li(null, el.a({onClick: this._ActionClick(3.4)},'3.4')),
          el.li(null, el.a({onClick: this._ActionClick(3.5)},'3.5')),
          el.li(null, el.a({onClick: this._ActionClick(3.6)},'3.6')),
          el.li(null, el.a({onClick: this._ActionClick(3.7)},'3.7')),
          el.li(null, el.a({onClick: this._ActionClick(3.8)},'3.8')),
          el.li(null, el.a({onClick: this._ActionClick(3.9)},'3.9')),
          el.li(null, el.a({onClick: this._ActionClick(4.0)},'4.0')),
          el.li(null, el.a({onClick: this._ActionClick(4.1)},'4.1')),
          el.li(null, el.a({onClick: this._ActionClick(4.2)},'4.2')),
          el.li(null, el.a({onClick: this._ActionClick(4.3)},'4.3')),
          el.li(null, el.a({onClick: this._ActionClick(4.4)},'4.4')),
          el.li(null, el.a({onClick: this._ActionClick(4.5)},'4.5')),
          el.li(null, el.a({onClick: this._ActionClick(4.6)},'4.6')),
          el.li(null, el.a({onClick: this._ActionClick(4.7)},'4.7')),
          el.li(null, el.a({onClick: this._ActionClick(4.8)},'4.8')),
          el.li(null, el.a({onClick: this._ActionClick(4.9)},'4.9')),
          el.li(null, el.a({onClick: this._ActionClick(5.0)},'5.0'))
        )
      )
    );
  }
});


var SiteEdgeSelect = React.createClass({
  displayName: 'SiteEdgeSelect',
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    betStore.on('change', this._onStoreChange);
  },
  componentWillUnmount: function() {
    betStore.off('change', this._onStoreChange);
  },
  _onClickDEC: function() {
    Dispatcher.sendAction('DEC_HOUSE_EDGE');
  },
  _onClickINC: function() {
    Dispatcher.sendAction('INC_HOUSE_EDGE');
  },
  _SETMIN: function(){
  //  Dispatcher.sendAction('MIN_HOUSE_EDGE');
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
               className: 'btn btn-primary btn-md',
              style: { fontWeight: 'bold', borderTopRightRadius: '0',borderBottomRightRadius: '0'},
              onClick: this._onClickDEC },
             '-'
           )
         ),
         el.div(
           {className: 'btn-group'},
          el.button(
            {className: 'btn btn-default btn-md bot_edge',
              onClick: this._SETMIN},
            (betStore.state.house_edge * 100).toFixed(1).toString() + '%'
            )
          ),
          el.div(
            {className: 'btn-group'},
            el.button(
              {
                type: 'button',
                className: 'btn btn-primary btn-md', style:{fontWeight: 'bold'},
                onClick: this._onClickINC},
              '+'
            )
          )
        )
      )
    );
  }
});

var BetBoxMaxProfit = React.createClass({
  displayName: 'BetBoxMaxProfit',
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

  render: function() {
  /*  var innerNode;
      innerNode = el.span(
        {
          className: 'text'
        },
      helpers.convSatstoCointype(worldStore.state.bankrollbalance * betStore.state.house_edge).toString() + worldStore.state.coin_type
    );*/
    return el.div(
      null,
      el.span(
        {className: 'lead'},
        'MaxProfit: '
      ),
      el.span({className: 'text'},
        helpers.convSatstoCointype(worldStore.state.bankrollbalance * betStore.state.house_edge).toString() + worldStore.state.coin_type
      )
      //innerNode
    );
  }
});

var AutobetStopLow = React.createClass({
  displayName: 'AutobetStopLow',
  // Hookup to stores
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    AutobetStore.on('change', this._onStoreChange);
  },
  componentWillUnmount: function() {
    AutobetStore.off('change', this._onStoreChange);
  },
  //
  _validateStopLower: function(newStr) {
    var num = parseFloat(newStr, 10);

    // Ensure str is a number
    if (isNaN(num)) {
      Dispatcher.sendAction('UPDATE_AUTO_STOPLOWER', { error: 'INVALID_NUMBER' });
    } else if (num < 0) {
      Dispatcher.sendAction('UPDATE_AUTO_STOPLOWER', { error: 'NUMBER_TOO_LOW' });
    } else {
      Dispatcher.sendAction('UPDATE_AUTO_STOPLOWER', {
        num: num,
        error: null
      });
    }
  },
  _onStopLowChange: function(e) {
    var str = e.target.value;
    Dispatcher.sendAction('UPDATE_AUTO_STOPLOWER', { str: str });
    this._validateStopLower(str);
  },
  render: function() {
    return el.div(null,
        el.div(
        {className: 'form-group'},
        el.p(
          {className: 'h6', style: AutobetStore.state.stoplower.error ? { color: 'red' } : {fontWeight: 'bold'}},
          'Stop if Balance <'
        ),
        el.div(
          {className: 'input-group'},
          el.input(
            {
              type: 'text',
              value: AutobetStore.state.stoplower.str,
              className: 'form-control input-sm',
              style: {fontWeight: 'bold'},
              onChange: this._onStopLowChange
            }
          ),
          el.span(
            {className: 'input-group-addon'},
            worldStore.state.coin_type
          )
        )
      )
    );
  }
});

var AutobetStopHigh = React.createClass({
  displayName: 'AutobetStopHigh',
  // Hookup to stores
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    AutobetStore.on('change', this._onStoreChange);
  },
  componentWillUnmount: function() {
    AutobetStore.off('change', this._onStoreChange);
  },
  //
  _validateStopHigher: function(newStr) {
    var num = parseFloat(newStr, 10);

    // Ensure str is a number
    if (isNaN(num)) {
      Dispatcher.sendAction('UPDATE_AUTO_STOPHIGHER', { error: 'INVALID_NUMBER' });
    } else if (num < 0) {
      Dispatcher.sendAction('UPDATE_AUTO_STOPHIGHER', { error: 'NUMBER_TOO_LOW' });
    } else {
      Dispatcher.sendAction('UPDATE_AUTO_STOPHIGHER', {
        num: num,
        error: null
      });
    }
  },
  _onStopHighChange: function(e) {
    var str = e.target.value;
    Dispatcher.sendAction('UPDATE_AUTO_STOPHIGHER', { str: str });
    this._validateStopHigher(str);
  },
  render: function() {
    return el.div(null,
      el.div(
      {className: 'form-group'},
      el.p(
        {className: 'h6', style: AutobetStore.state.stophigher.error ? { color: 'red' } : {fontWeight: 'bold'}},
        'Stop if Balance >'
      ),
      el.div(
        {className: 'input-group'},
        el.input(
          {
            type: 'text',
            value: AutobetStore.state.stophigher.str,
            className: 'form-control input-sm',
            style: {fontWeight: 'bold'},
            onChange: this._onStopHighChange
          }
        ),
        el.span(
          {className: 'input-group-addon'},
          worldStore.state.coin_type
        )
      )
      )
    );
  }
});

var Auto_Delay = React.createClass({
displayName: 'Auto_Delay',
_onStoreChange: function() {
this.forceUpdate();
},
componentDidMount: function() {
AutobetStore.on('change', this._onStoreChange);
},
componentWillUnmount: function() {
AutobetStore.off('change', this._onStoreChange);
},

_ondelaychange: function(e){
  var str = e.target.value;
  var num = parseInt(str, 10);
  if (isNaN(num)){

  }else if (num < 1){

  }else if (num > 10000){

  }else {
      Dispatcher.sendAction('UPDATE_AUTOBET_DELAY', num);
  }

},

render: function() {
return el.div(
          null,
          el.div(
            {className: 'form-group'},
            el.p(
              {className:'h6',
              style: { fontWeight: 'bold'}
              },
              'Delay: ',
              el.span({className:'text-small', style:{color:'gray'}},' 1-10000 ms')
            ),
            el.div({className: 'input-group'},
              el.input(
                  {
                    type: 'text',
                    value: AutobetStore.state.autodelay.str,
                    className: 'form-control input-sm',
                    style: {fontWeight: 'bold'},
                    onChange: this._ondelaychange
                  }
                ),
              el.div({className:'input-group-addon',style:{fontWeight:'bold'}},'ms')
              )
          )
        );
  }
});


var AutoOnLoss = React.createClass({
displayName: 'AutoOnLoss',
_onStoreChange: function() {
this.forceUpdate();
},
componentDidMount: function() {
//  worldStore.on('new_user_bet', this._onStoreChange);
AutobetStore.on('loss_change', this._onStoreChange);
},
componentWillUnmount: function() {
//  worldStore.off('new_user_bet', this._onStoreChange);
AutobetStore.off('loss_change', this._onStoreChange);
},
/*_togglemode: function(){
Dispatcher.sendAction('TOGGLE_LOSS_MODE', null); //TODO change to set mode move to action click
},*/
_validatenum: function(newStr) {
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
Dispatcher.sendAction('UPDATE_LOSS_TARGET', num);
}
},
_ontargetChange: function(e){
var str = e.target.value;
this._validatenum(str);
},
_validateMultiplier: function(newStr) {
var num = parseFloat(newStr, 10);
// Ensure str is a number
if (isNaN(num)) {
Dispatcher.sendAction('UPDATE_AUTO_MULTIPLIER_ONLOSS', { error: 'INVALID_MULTIPLIER' });
// Ensure multiplier is >= -999x
} else if (num < 0.0001) {
Dispatcher.sendAction('UPDATE_AUTO_MULTIPLIER_ONLOSS', { error: 'MULTIPLIER_TOO_LOW' });
// Ensure multiplier is <= max allowed multiplier (999x for now)
} else if (num > 999) {
Dispatcher.sendAction('UPDATE_AUTO_MULTIPLIER_ONLOSS', { error: 'MULTIPLIER_TOO_HIGH' });
// Ensure no more than 2 decimal places of precision
} else if (helpers.getPrecision(num) > 4) {
Dispatcher.sendAction('UPDATE_AUTO_MULTIPLIER_ONLOSS', { error: 'MULTIPLIER_TOO_PRECISE' });
// multiplier str is valid
} else {
Dispatcher.sendAction('UPDATE_AUTO_MULTIPLIER_ONLOSS', {
  num: num,
  error: null
});
}
},
_onMultiplierChange: function(e) {
//console.log('Auto Multiplier changed');
var str = e.target.value;
//console.log('You entered', str, 'as your multiplier');
Dispatcher.sendAction('UPDATE_AUTO_MULTIPLIER_ONLOSS', { str: str });
this._validateMultiplier(str);
},
_onClick: function() {
 $('dropdown-toggle').dropdown();
},
_ActionClick: function(type){
  return function(){
    console.log('click action ' + type);
   Dispatcher.sendAction('SET_LOSS_MODE', type);

  };

},
render: function() {
  switch(AutobetStore.state.lossmode){
    case 'MULTIPLY':
    case 'RESET TO BASE':
    case 'STOP AUTO':
    case 'DO NOTHING':
    break;
    default:
    Dispatcher.sendAction('SET_LOSS_MODE', 'MULTIPLY');
    break;
  }
return el.div(
    null,
    el.div({className:'row'},
      el.div(
        {className: 'well well-sm col-xs-12'},
        el.div(
          {className:'row'},
          el.div(
            {className: 'form-group col-xs-10'},
            el.div({className: 'input-group'},
              el.div({className:'input-group-addon',style:{fontWeight:'bold'}},'Every'),
              el.input(
                  {
                    type: 'text',
                    value: AutobetStore.state.losstarget.str,
                    className: 'form-control input-sm',
                    style: {fontWeight: 'bold'},
                    onChange: this._ontargetChange
                  }
                ),
              el.div({
                      className:'input-group-addon',
                      style: AutobetStore.state.lossmul.error ? { fontWeight: 'bold',color: 'red' } : { fontWeight: 'bold'}
                      },
                      'Loss'
                    )
              )
          ),
          el.div({className:'col-xs-2',style:{marginLeft: '-12px'}},
            'Loss: ' + AutobetStore.state.losscounter.toString()
          ),
          el.div(
            {className:'button col-xs-12 col-sm-6'},
            el.button(
                         {
                           type:'button',
                           className:'btn btn-sm btn-primary btn-group-justified dropdown-toggle',
                           "data-toggle":'dropdown',
                           "aria-haspopup":'true',
                           "aria-expanded":'false',
                           onClick:this._onClick
                         },
                         AutobetStore.state.lossmode, el.span({className:'caret'},'')
                       ),
                       el.ul({className:'dropdown-menu'},
                         el.li(null, el.a({onClick: this._ActionClick('MULTIPLY')},'MULTIPLY')),
                         el.li(null, el.a({onClick: this._ActionClick('DO NOTHING')},'DO NOTHING')),
                         el.li(null, el.a({onClick: this._ActionClick('RESET TO BASE')},'RESET TO BASE')),
                         el.li(null, el.a({onClick: this._ActionClick('STOP AUTO')},'STOP AUTO'))
                       )
          ),
          el.div(
            {className: 'form-group col-xs-12 col-sm-6'},
            el.div({className: 'input-group'},
              el.input(
                  {
                    type: 'text',
                    value: AutobetStore.state.lossmul.str,
                    className: 'form-control input-sm',
                    style: {fontWeight: 'bold', border: '3px solid #2a9fd6'},
                    onChange: this._onMultiplierChange
                  }
                ),
              el.div({className:'input-group-addon',style:{fontWeight:'bold'}},'X')
              )
          )
        )
      )
    )
  );
}
});

var AutoOnWin = React.createClass({
displayName: 'AutoOnWin',
_onStoreChange: function() {
this.forceUpdate();
},
componentDidMount: function() {
//  worldStore.on('new_user_bet', this._onStoreChange);
AutobetStore.on('win_change', this._onStoreChange);
},
componentWillUnmount: function() {
//  worldStore.off('new_user_bet', this._onStoreChange);
AutobetStore.off('win_change', this._onStoreChange);
},
//_togglemode: function(){
//Dispatcher.sendAction('TOGGLE_WIN_MODE', null);
//},
_validatenum: function(newStr) {
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
Dispatcher.sendAction('UPDATE_WIN_TARGET', num);
}
},
_ontargetChange: function(e){
var str = e.target.value;
this._validatenum(str);
},
_validateMultiplier: function(newStr) {
var num = parseFloat(newStr, 10);
// Ensure str is a number
if (isNaN(num)) {
Dispatcher.sendAction('UPDATE_AUTO_MULTIPLIER_ONWIN', { error: 'INVALID_MULTIPLIER' });
// Ensure multiplier is >= -999x
} else if (num < 0.0001) {
Dispatcher.sendAction('UPDATE_AUTO_MULTIPLIER_ONWIN', { error: 'MULTIPLIER_TOO_LOW' });
// Ensure multiplier is <= max allowed multiplier (999x for now)
} else if (num > 999) {
Dispatcher.sendAction('UPDATE_AUTO_MULTIPLIER_ONWIN', { error: 'MULTIPLIER_TOO_HIGH' });
// Ensure no more than 2 decimal places of precision
} else if (helpers.getPrecision(num) > 4) {
Dispatcher.sendAction('UPDATE_AUTO_MULTIPLIER_ONWIN', { error: 'MULTIPLIER_TOO_PRECISE' });
// multiplier str is valid
} else {
Dispatcher.sendAction('UPDATE_AUTO_MULTIPLIER_ONWIN', {
  num: num,
  error: null
});
}
},
_onMultiplierChange: function(e) {
//console.log('Auto Multiplier changed');
var str = e.target.value;
//console.log('You entered', str, 'as your multiplier');
Dispatcher.sendAction('UPDATE_AUTO_MULTIPLIER_ONWIN', { str: str });
this._validateMultiplier(str);
},
_onClick: function() {
 $('dropdown-toggle').dropdown();
},
_ActionClick: function(type){
  return function(){
    console.log('click action ' + type);
    Dispatcher.sendAction('SET_WIN_MODE', type);
  };

},
render: function() {

switch(AutobetStore.state.winmode){
  case 'MULTIPLY':
  case 'RESET TO BASE':
  case 'STOP AUTO':
  case 'DO NOTHING':
  break;
  default:
  Dispatcher.sendAction('SET_WIN_MODE', 'RESET TO BASE');
  break;
}

return el.div(
null,
el.div({className:'row'},
    el.div(
      {className: 'well well-sm col-xs-12'},
      el.div(
          {className:'row'},
          el.div(
            {className: 'form-group col-xs-10'},
            el.div({className: 'input-group'},
              el.div({className:'input-group-addon',style: {fontWeight: 'bold'}},'Every'),
              el.input(
                  {
                    type: 'text',
                    value: AutobetStore.state.wintarget.str,
                    className: 'form-control input-sm',
                    style: {fontWeight: 'bold'},
                    onChange: this._ontargetChange
                  }
                ),
              el.div({className:'input-group-addon',style: {fontWeight: 'bold'}},'Wins')
              )
          ),
          el.div({className:'col-xs-2',style:{marginLeft: '-12px'}},
            'Win: ' + AutobetStore.state.wincounter.toString()
          ),
          el.div(
            {className:'button col-xs-12 col-sm-6'},
            el.button(
                         {
                           type:'button',
                           className:'btn btn-sm btn-primary btn-block btn-group-justified dropdown-toggle',
                           "data-toggle":'dropdown',
                           "aria-haspopup":'true',
                           "aria-expanded":'false',
                           onClick:this._onClick
                         },
                         AutobetStore.state.winmode, el.span({className:'caret'},'')
                       ),
                       el.ul({className:'dropdown-menu'},
                         el.li(null, el.a({onClick: this._ActionClick('MULTIPLY')},'MULTIPLY')),
                         el.li(null, el.a({onClick: this._ActionClick('DO NOTHING')},'DO NOTHING')),
                         el.li(null, el.a({onClick: this._ActionClick('RESET TO BASE')},'RESET TO BASE')),
                         el.li(null, el.a({onClick: this._ActionClick('STOP AUTO')},'STOP AUTO'))
                       )
          ),
          el.div(
            {className: 'form-group col-xs-12 col-sm-6'},
            el.div({className: 'input-group'},
              el.input(
                {
                  type: 'text',
                  value: AutobetStore.state.winmul.str,
                  className: 'form-control input-sm',
                  style: {fontWeight: 'bold', border: '3px solid #2a9fd6'},
                  onChange: this._onMultiplierChange
                }
              ),
            el.div({className:'input-group-addon',style: {fontWeight: 'bold'}},'X')
            )
          )

        )
      )
    )
  );
}
});


var DiceAutoToggles = React.createClass({
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
_oncheck1: function(){
Dispatcher.sendAction('TOGGLE_DSWITCH1_ENABLE', null);
},
_oncheck2: function(){
Dispatcher.sendAction('TOGGLE_DSWITCH2_ENABLE', null);
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
render: function() {
  if (AutobetStore.state.switch3.enable){
    AutobetStore.state.switch3.enable = false;
  }
  switch (AutobetStore.state.switch1.mode){
    case 'CHANGE TARGET':
    case 'STOP AUTO':
    case 'RESET TO BASE':
    break;
    default:
      Dispatcher.sendAction('SET_D_SW1_MODE', 'CHANGE TARGET');
    break;
  }
  switch (AutobetStore.state.switch2.mode){
    case 'CHANGE TARGET':
    case 'STOP AUTO':
    case 'RESET TO BASE':
    break;
    default:
      Dispatcher.sendAction('SET_D_SW2_MODE', 'CHANGE TARGET');
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
                     el.li(null, el.a({onClick: this._ActionClick1('CHANGE TARGET')},'CHANGE TARGET')),
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
          //id: 'checkboxStyle',
          //name: 'numberOfBet',
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
                   el.li(null, el.a({onClick: this._ActionClick2('CHANGE TARGET')},'CHANGE TARGET')),
                   el.li(null, el.a({onClick: this._ActionClick2('STOP AUTO')},'STOP AUTO')),
                   el.li(null, el.a({onClick: this._ActionClick2('RESET TO BASE')},'RESET TO BASE'))
                 )
        )
    )
  )
)
)
);
}
});

var Auto_Stats = React.createClass({
displayName: 'Auto_Stats',
_onStoreChange: function() {
this.forceUpdate();
},
componentDidMount: function() {
AutobetStore.on('change', this._onStoreChange);
},
componentWillUnmount: function() {
AutobetStore.off('change', this._onStoreChange);
},
render: function() {
return el.div(
null,
el.div(
  {className:'well well-sm col-xs-12',style:{marginTop:'-15px'}},
  el.div({className:'row'},
    el.div({className:'col-xs-4 col-sm-2'},'Auto Bets: ' + AutobetStore.state.Auto_betcount.toString()),
    el.div({className:'col-xs-4 col-sm-2'},'Wins: ' + AutobetStore.state.Auto_wincount.toString()),
    el.div({className:'col-xs-4 col-sm-2'},'Losses: ' + AutobetStore.state.Auto_losscount.toString()),
    el.div({className:'col-xs-6 col-sm-3'},'Wagered: ' + helpers.convNumtoStr(AutobetStore.state.Auto_wagered) + worldStore.state.coin_type),
    el.div({className:'col-xs-6 col-sm-3'},'Profit: ' + helpers.convNumtoStr(AutobetStore.state.Auto_profit) + worldStore.state.coin_type)//,
    )
  )
);
}
});


var DiceAdvancedSettings = React.createClass({
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
      //  )

    );
  }

});



var BetBoxTarget = React.createClass({
  displayName: 'BetBoxTarget',
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
    var innerNode;
    if (isError) {
      innerNode = el.span(
        {className: 'lead'},
        ' --'
      );
    } else {
      innerNode = el.span(
        {className: 'text'},
        //((winProb * - 100)*-1).toFixed(4).toString() + '>n>' + (((winProb * -100) + 100 )-betStore.state.house_edge).toFixed(4).toString()
        ((winProb * - 100)*-1).toFixed(4).toString() + ' > n > ' + (99.9999 - (winProb * 100)).toFixed(4).toString()
      );
    }
    return el.div(
      {},
      el.span(
        {className: 'lead', style: { fontWeight: 'bold',marginTop: '-25px' }},
        'Target: '
      ),
      innerNode
    );
  }
});

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
    var profit;
    if (worldStore.state.coin_type === 'BITS'){
      profit = (betStore.state.wager.num * (betStore.state.multiplier.num - 1)).toFixed(2).toString();
    }
    else {
      profit = (betStore.state.wager.num * (betStore.state.multiplier.num - 1)).toFixed(8).toString();
    }
    var innerNode;
    if (betStore.state.multiplier.error || betStore.state.wager.error) {
      innerNode = el.span(
        {className: 'lead'},
        '--'
      );
    } else {
      innerNode = el.span(
        {
          className: 'text',
          style: { color: '#39b54a' }
        },
        '+' + profit + ' ' + worldStore.state.coin_type
      );
    }

    return el.div(
      null,
      el.span(
        {className: 'lead', style: { fontWeight: 'bold',marginTop: '-25px' }},
        'Profit: '
      ),
      innerNode
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
  _validateMultiplier: function(newStr) {
    var num = parseFloat(newStr, 10);
    var isFloatRegexp = /^(\d*\.)?\d+$/;
    var winProb = helpers.multiplierToWinProb(num);
    // Ensure str is a number
    if (isNaN(num) || !isFloatRegexp.test(newStr)) {
      Dispatcher.sendAction('UPDATE_MULTIPLIER', { error: 'INVALID_MULTIPLIER' });
      // Ensure multiplier is >= 1.00x
    } else if (num < 1.001) {
      Dispatcher.sendAction('UPDATE_MULTIPLIER', { error: 'MULTIPLIER_TOO_LOW' });
      // Ensure multiplier is <= max allowed multiplier (100x for now)
    } else if (num > 990000) {
      Dispatcher.sendAction('UPDATE_MULTIPLIER', { error: 'MULTIPLIER_TOO_HIGH' });
      // Ensure no more than 2 decimal places of precision
    } else if (helpers.getPrecision(num) > 4) {
      Dispatcher.sendAction('UPDATE_MULTIPLIER', { error: 'MULTIPLIER_TOO_PRECISE' });
      // multiplier str is valid
    } else {
      Dispatcher.sendAction('UPDATE_MULTIPLIER', {
        num: num,
        error: null
      });

      Dispatcher.sendAction('UPDATE_CHANCE_IN', {
        num: (winProb*100).toFixed(4),
        str: (winProb*100).toFixed(4).toString(),
        error: null
      });

    }
  },
  _onMultiplierChange: function(e) {
  //  console.log('Multiplier changed');
    var str = e.target.value;
    console.log('You entered', str, 'as your multiplier');
    Dispatcher.sendAction('UPDATE_MULTIPLIER', { str: str });
    this._validateMultiplier(str);
  },
  render: function() {
    return el.div(
      {className: 'form-group'},
      el.div(
        {className: 'input-group'},//style: { marginTop: '-15px' }},
        el.span(
          {className: 'input-group-addon'},
          'Multiplier'
        ),
        el.input(
          {
            type: 'text',
            value: betStore.state.multiplier.str,
            className: 'form-control input-md bot_multi',
            style: {fontWeight: 'bold'},
            onChange: this._onMultiplierChange,
             onClick: this._onMultiplierChange,
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

var BetBoxChanceInput = React.createClass({
  displayName: 'BetBoxChanceInput',
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
  _validateChance: function(newStr) {
    var num = parseFloat(newStr, 10);

    var isFloatRegexp = /^(\d*\.)?\d+$/;

    // Ensure str is a number
    if (isNaN(num) || !isFloatRegexp.test(newStr)) {
      Dispatcher.sendAction('UPDATE_CHANCE_IN', { error: 'CHANCE_INVALID_CHARS' });
      // Ensure multiplier is >= 1.00x
    } else if (num < 0.0001) {
      Dispatcher.sendAction('UPDATE_CHANCE_IN', { error: 'CHANCE_TOO_LOW' });
      // Ensure multiplier is <= max allowed multiplier (100x for now)
    } else if (num > (100 - (betStore.state.house_edge * 100))) {  //(99.92)
      Dispatcher.sendAction('UPDATE_CHANCE_IN', { error: 'CHANCE_TOO_HIGH' });
      // Ensure no more than 2 decimal places of precision
    } else if (helpers.getPrecision(num) > 4) {
      Dispatcher.sendAction('UPDATE_CHANCE_IN', { error: 'CHANCE_TOO_PRECISE' });
      // multiplier str is valid
    } else {
      Dispatcher.sendAction('UPDATE_CHANCE_IN', {
        num: num,
        error: null
      });
      //update multiplier
      //
      if (helpers.WinProbtoMultiplier(num/100) < 1.001){
        Dispatcher.sendAction('UPDATE_MULTIPLIER', {
          num: helpers.WinProbtoMultiplier(num/100),
          str: helpers.WinProbtoMultiplier(num/100).toFixed(4).toString(),
          error: 'MULTIPLIER_TOO_LOW'
        });
      }else{
      Dispatcher.sendAction('UPDATE_MULTIPLIER', {
        num: helpers.WinProbtoMultiplier(num/100),
        str: helpers.WinProbtoMultiplier(num/100).toFixed(4).toString(),
        error: null
      });
      }
    }
  },
  _onChanceInChange: function(e) {
    console.log('Chance input changed');
    var str = e.target.value;
    console.log('You entered', str, 'as your chance');
    Dispatcher.sendAction('UPDATE_CHANCE_IN', { str: str });
    this._validateChance(str);
  },
  render: function() {
    return el.div(
      {className: 'form-group'},
      el.div(
        {className: 'input-group'},//style: { marginTop: '-15px' }},
        el.span(
          {className: 'input-group-addon'},
          'Chance'
        ),
        el.input(
          {
            type: 'text',
            value: betStore.state.ChanceInput.str,
            className: 'form-control input-md',
            style: {fontWeight: 'bold'},
            onChange: this._onChanceInChange,
            disabled: !!worldStore.state.isLoading
          }
        ),
        el.span(
          {className: 'input-group-addon'},
          '%'
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
  _validateWager: function(newStr) {
    var num = parseFloat(newStr, 10);

    var isFloatRegexp = /^(\d*\.)?\d+$/;

    // Ensure str is a number
    if (worldStore.state.coin_type === 'BITS'){
    if (isNaN(num) || !isFloatRegexp.test(newStr)) {
      Dispatcher.sendAction('UPDATE_WAGER', { error: 'INVALID_WAGER' });
      // Ensure wager is greater than 0.01
    } else if (num < 0.01) {
      Dispatcher.sendAction('UPDATE_WAGER', { error: 'WAGER_TOO_LOW' });
      // Ensure balance is enough
    } else if (num * 100 > worldStore.state.user.balance) {
      Dispatcher.sendAction('UPDATE_WAGER', { error: 'CANNOT_AFFORD_WAGER' });
    } else if (helpers.getPrecision(num) > 2) {
      Dispatcher.sendAction('UPDATE_WAGER', { error: 'WAGER_TOO_PRECISE' });
      // multiplier str is valid
    } else {
      Dispatcher.sendAction('UPDATE_WAGER', {
        num: num,
        error: null
      });
    }
  }else {
    if (isNaN(num)) {
      Dispatcher.sendAction('UPDATE_WAGER', { error: 'INVALID_WAGER' });
      // Ensure wager is greater than 0.01
    } else if (num < 0.00000001) {
      Dispatcher.sendAction('UPDATE_WAGER', { error: 'WAGER_TOO_LOW' });
      // Ensure balance is enough
    } else if (num / 0.00000001 > worldStore.state.user.balance) {
      Dispatcher.sendAction('UPDATE_WAGER', { error: 'CANNOT_AFFORD_WAGER' });
    } else if (helpers.getPrecision(num) > 8) {
      Dispatcher.sendAction('UPDATE_WAGER', { error: 'WAGER_TOO_PRECISE' });
      // multiplier str is valid
    } else {
      Dispatcher.sendAction('UPDATE_WAGER', {
        num: num,
        error: null
      });
    }

  }

  },

  _onWagerChange: function(e) {
    var str = e.target.value;
    //Dispatcher.sendAction('UPDATE_WAGER', { str: str });
    Dispatcher.sendAction('UPDATE_WAGER_SOFT',{str: str});
    //this._validateWager(str);
  },
  _onHalveWager: function() {
    var newWager = worldStore.state.coin_type === 'BITS' ? (betStore.state.wager.num / 2).toFixed(2) : (betStore.state.wager.num / 2).toFixed(8);

    Dispatcher.sendAction('UPDATE_WAGER', { str: newWager.toString() });
  },
  _onDoubleWager: function() {
    var n = worldStore.state.coin_type === 'BITS' ? (betStore.state.wager.num * 2).toFixed(2) : (betStore.state.wager.num * 2).toFixed(8);
    Dispatcher.sendAction('UPDATE_WAGER', { str: n.toString() });

  },
  _onMaxWager: function() {
    // If user is logged in, use their balance as max wager
    var balanceBits;
    if (worldStore.state.user) {
      balanceBits = worldStore.state.user.balance / 100;//Math.floor(helpers.convSatstoCointype(worldStore.state.user.balance));//  worldStore.state.user.balance / 100);
    } else {
      balanceBits = 42000;
    }
    Dispatcher.sendAction('UPDATE_WAGER', { str: helpers.convNumtoStr(worldStore.state.user.balance - 1) });
  },
  //
  render: function() {
    var style1 = { borderBottomLeftRadius: '0', borderBottomRightRadius: '0',fontWeight: 'bold' };
    var style2 = { borderTopLeftRadius: '0' };
    var style3 = { borderTopRightRadius: '0' };
    return el.div(
      {className: 'form-group'},
      el.div({className: 'input-group'},//style: { marginTop: '-15px' }},
        el.span(
          {className: 'input-group-addon'},
          'Wager'
        ),
        el.input(
          {
            value: betStore.state.wager.str,
            type: 'text',
            className: 'form-control input-md bot_wager',
            style: style1,
            onChange: this._onWagerChange,
             onClick: this._onWagerChange,
            disabled: ((!!worldStore.state.isLoading)||(betStore.state.BS_Game.state == 'RUNNING')),
            placeholder: 'Bits'
          }
        ),
        el.span(
          {className: 'input-group-addon'},
          worldStore.state.coin_type
        )
      ),
      el.div(
        {className: 'btn-group btn-group-justified'},
        el.div(
          {className: 'btn-group'},
          el.button(
            {
              className: 'btn btn-default btn-sm',
              type: 'button',
              style: style2,
              onClick: this._onHalveWager,
              disabled: ((!!worldStore.state.isLoading)||(betStore.state.BS_Game.state == 'RUNNING'))
            },
            '1/2x ', worldStore.state.hotkeysEnabled ? el.kbd(null, 'X') : ''
          )
        ),
        el.div(
          {className: 'btn-group'},
          el.button(
            {
              className: 'btn btn-default btn-sm',
              type: 'button',
              onClick: this._onDoubleWager,
              disabled: ((!!worldStore.state.isLoading)||(betStore.state.BS_Game.state == 'RUNNING'))
            },
            '2x ', worldStore.state.hotkeysEnabled ? el.kbd(null, 'C') : ''
          )
        ),
        el.div(
          {className: 'btn-group'},
          el.button(
            {
              className: 'btn btn-default btn-sm',
              type: 'button',
              style: style3,
              onClick: this._onMaxWager,
              disabled: ((!!worldStore.state.isLoading)||(betStore.state.BS_Game.state == 'RUNNING'))
            },
            'Max'
          )
        )
      )
    );
  }
});


var BetBoxLastBet = React.createClass({
  displayName: 'BetBoxLastBet',
  // Hookup to stores
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
 var last_bet = '';
 var last_wager = helpers.convNumtoStr(100);
 var last_cond = '>';
 var last_target = 49.5000;
 var last_outcome = 50.0000;
 var last_profit = 100;
 last_bet = '';
 var target_start = 0;
 var target_end = 0;
 var target_text = '-';

 if (worldStore.state.first_bet){
   last_bet = worldStore.state.bets.data[worldStore.state.bets.end].id;
   last_wager = helpers.convNumtoStr(worldStore.state.bets.data[worldStore.state.bets.end].wager);
   last_cond = worldStore.state.bets.data[worldStore.state.bets.end].meta.cond;
   if (worldStore.state.bets.data[worldStore.state.bets.end].meta.kind == 'DICE'){
     last_target = worldStore.state.bets.data[worldStore.state.bets.end].meta.number.toFixed(4);
     target_text = last_target;
     last_outcome = worldStore.state.bets.data[worldStore.state.bets.end].outcome;
   }else if (worldStore.state.bets.data[worldStore.state.bets.end].meta.kind == 'SLIDERS'){
     target_start = worldStore.state.bets.data[worldStore.state.bets.end].target.start;
     target_end = worldStore.state.bets.data[worldStore.state.bets.end].target.end;
     var target_start2 = worldStore.state.bets.data[worldStore.state.bets.end].target.start2;
     var target_end2 = worldStore.state.bets.data[worldStore.state.bets.end].target.end2;
     last_target = target_end - target_start;

     var target_text = target_start.toString() + '-' + target_end.toString() + '>';
     last_outcome = worldStore.state.bets.data[worldStore.state.bets.end].outcome;
   }else {
     target_text = '-'
     last_target = '-'
     last_outcome = '-'
   }
   last_profit = worldStore.state.bets.data[worldStore.state.bets.end].profit;
  }
  return el.div(
      null,
        el.div(
          { className: 'col-xs-12 well well-sm',style:{marginBottom:'5px'}},
          el.div(
            { className: 'col-xs-12 col-sm-4 col-md-4 col-lg-2'},
            el.span(
            {style:{fontWeight:'bold'}},
            'Last Bet:'
            ),
            el.div(
                null,
                el.a(
                  {
                    href: config.mp_browser_uri + '/bets/' + last_bet,
                    target: '_blank'
                  },
                  last_bet
                )
            )
          ),
          el.div(
             { className: 'col-xs-12 col-sm-4 col-md-4 col-lg-2'},
            el.span(
              {style:{fontWeight:'bold'}},
              'Wager:'
            ),
            el.div(
              null,
              last_wager,
              worldStore.state.coin_type
            )
          ),
          el.div(
            { className: 'col-xs-12 col-sm-4 col-md-4 col-lg-2'},
            el.span(
              {style:{fontWeight:'bold'}},
              'Target:'
            ),
            // target
            el.div(
              null,
              last_cond + target_text
            )
          ),
          el.div( //field for progress-bar
          { className: 'col-xs-12 col-sm-4 col-md-4 col-lg-3'},
          // progress bar container
          el.div(
            {
              className: 'progress',
              style: {
                minWidth: '100px',
                position: 'relative',
                marginBottom: 0,
                // make it thinner than default prog bar
                height: '10px'
              }
            },
            el.div(
              {
                className: 'progress-bar progress-bar-dark',
                style: {

                  width: target_start.toString() + '%'
                }
              }
            ),
            el.div(
              {
                className: 'progress-bar ' +
                  (last_profit >= 0 ?
                   'progress-bar-success' : 'progress-bar-grey') ,
                style: {
                  float: last_cond === '<' ? 'left' : 'right',
                  width: last_cond === '<' ?
                    last_target.toString() + '%' :
                    (100 - last_target).toString() + '%'
                }
              }
            ),
            el.div(
              {
                className: 'progress-bar progress-bar-dark',
                style: {

                  width: target_start2 ? (target_start2 - target_end).toString() + '%' : (100 - target_end).toString() + '%'
                }
              }
            ),
            target_start2 ? el.div({className: 'progress-bar ' + (last_profit >= 0 ? 'progress-bar-success' : 'progress-bar-grey') ,
                    style: {
                      //float: 'left',
                      width: (target_end2 - target_start2).toString() + '%'
                    }
                  }
            ) : '',
            target_start2 ? el.div({className: 'progress-bar progress-bar-dark',
                    style: {
                      //float: 'left',
                      width: (100- target_end2).toString() + '%'
                    }
                  }
            ) : '',
            el.div(
              {
                style: {
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: last_outcome.toString() + '%',
                  borderRight: '3px solid #333',
                  height: '100%'
                }
              }
            )
          ),//end progressbar
          // arrow container
          el.div(
            {
              style: {
                position: 'relative',
                width: '100%',
                height: '15px'
              }
            },
            // arrow
            el.div(
              {
                style: {
                  position: 'absolute',
                  top: 0,
                  left: (last_outcome - 1).toString() + '%'
                }
              },
              el.div(
                {
                  style: {
                    width: '5em',
                    marginLeft: '-10px'
                  }
                },

                el.span(
                  {style: {fontFamily: 'monospace'}},
                  '' + last_outcome
                )
              )
            )
          )


        ),
        el.div(
          { className: 'col-xs-12 col-sm-4 col-md-4 col-lg-2'},
          el.span(
          {style:{fontWeight:'bold'}},
          'Profit:'
          ),
          el.div(
            {style: { color: last_profit > 0 ? 'green' : 'red'}},
           last_profit > 0 ? '+' + helpers.convNumtoStr(last_profit) : helpers.convNumtoStr(last_profit),
           worldStore.state.coin_type
          )
        )
      )
      );
  }

});

var BetBoxBalance = React.createClass({
  displayName: 'BetBoxBalance',
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

    var innerNode;
    var b_balance;
    var stillAnimatingPucks = _.keys(worldStore.state.renderedPucks).length > 0;

    if (worldStore.state.user) {
      if (stillAnimatingPucks||worldStore.state.rt_spin_running||worldStore.state.plinko_running)
        {
        b_balance = worldStore.state.revealed_balance;
      }else{
        b_balance = worldStore.state.user.balance;
      }
      innerNode = el.span(
        null,//{className: 'bot_bal'},
        //helpers.commafy(helpers.convNumtoStr(b_balance)) + worldStore.state.coin_type
        helpers.convNumtoStr(b_balance) + worldStore.state.coin_type
      );
    } else {
      innerNode = el.span(
        null,//{className: 'lead'},
        '--'
      );
    }
    // /{className: 'col-xs-12 col-sm-6 col-md-2 col-lg-2'},
    return el.div(
      {className:'row'},
      el.div(
        {style: { fontWeight: 'bold'}},
        'Balance: '
      ),
      el.div({className: 'bot_bal'},
      innerNode
      )
    );
  }
});

var prev_hash = '';
var next_hash = '';
var BetBoxButton = React.createClass({
  displayName: 'BetBoxButton',
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
        target: helpers.round10(number, -4),
        payout: payoutSatoshis
      };

    if(config.debug){  console.log('Emitting Socket for dice');}
      socket.emit('dice_bet', params, function(err, bet) {
        if(config.debug){  console.log('Socket returned for dice');}
          self.setState({ waitingForServer: false });
        if (err) {
          console.log('[socket] dice_bet failure:', err);
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
          console.log('[socket] dice_bet Timedout');
          self.setState({ waitingForServer: false });
          if (cond === '>'){
            $('#bet-hi')[0].click();
          }else {
            $('#bet-lo')[0].click();
          }
          return;
        }
        //autowait = true;
        //setTimeout(function(){ autowait = false;}, 100);
        console.log('[socket] dice_bet success:', bet);
        bet.meta = {
          cond: cond,
          number: number,
          hash: hash,
          kind: 'DICE',
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
      innerNode =
        el.div(
          {className: 'row'},
          // bet hi
          el.div(
            {className: 'col-xs-6'},
            el.button(
              {
                id: 'bet-hi',
                type: 'button',
                className: 'btn btn-md btn-info btn-block',
                onClick: this._makeBetHandler('>'),
                disabled: !!this.state.waitingForServer
              },
              'Bet Hi ', worldStore.state.hotkeysEnabled ? el.kbd(null, 'H') : ''
            )
          ),
          // bet lo
          el.div(
            {className: 'col-xs-6'},
            el.button(
              {
                id: 'bet-lo',
                type: 'button',
                className: 'btn btn-md btn-info btn-block',
                onClick: this._makeBetHandler('<'),
                disabled: !!this.state.waitingForServer
              },
              'Bet Lo ', worldStore.state.hotkeysEnabled ? el.kbd(null, 'L') : ''
            )
          )
        // Add start autobet
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
      el.div(
        (AutobetStore.state.ShowAutobet|| AutobetStore.state.Run_Autobet) ? {className: 'col-xs-12 col-md-5'}:{className: 'col-xs-12 col-md-8'},
        innerNode
      )
    );
  }
});

var AutobetButtons= React.createClass({
  displayName: 'AutobetButtons',
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    AutobetStore.on('change', this._onStoreChange);
  },
  componentWillUnmount: function() {
    AutobetStore.off('change', this._onStoreChange);
  },
  _onClickCond: function() {
    Dispatcher.sendAction('TOGGLE_AUTO_COND');
    this.forceUpdate();
  },
  render: function() {
    var winProb = helpers.multiplierToWinProb(betStore.state.multiplier.num);

    return el.div(
      {className: 'col-xs-12 col-md-4'},
      el.div({className:'row'},
        el.div(
          {className: 'col-xs-12 col-sm-8 col-md-8'},
          React.createElement(AutobetStart, null)
        ),
        el.div(
          {className: 'col-xs-12 col-sm-4 col-md-4'},
          el.button(
            {
              type: 'button',
              className: 'btn btn-primary btn-md',
              onClick: this._onClickCond
            },
            'Target',
            AutobetStore.state.Auto_cond === '>' ? el.span({className: 'label label-default'}, '>', + (((winProb * -100) + 100 )-betStore.state.house_edge).toFixed(2).toString())
              :el.span({className: 'label label-default'}, '<', + ((winProb * - 100)*-1).toFixed(2).toString())
          )
        )
        )
      );
  }
});


var AutobetStart = React.createClass({
 displayName: 'AutobetStart',
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
 _onClickStart: function() {
   console.log('autobet start button click');
   Dispatcher.sendAction('START_RUN_AUTO');
 },
 _onClickStop: function() {
   console.log('autobet stop button click');
     Dispatcher.sendAction('STOP_RUN_AUTO');
 },
render: function(){
  var innerNode;

  // TODO: Create error prop for each input
  var error = betStore.state.wager.error || betStore.state.multiplier.error || betStore.state.clientSeed.error || AutobetStore.state.stoplower.error || AutobetStore.state.stophigher.error;

  if (worldStore.state.isLoading) {
    // If app is loading, then just disable button until state change
    innerNode = el.button(
      {type: 'button', disabled: true, className: 'btn btn-lg btn-block btn-default'},
      'Loading...'
    );
  } else if (error) {
    // If there's a Autobet setting error, then render button in error state

    var errorTranslations = {
      'INVALID_SEED': 'Invalid Seed',
      'SEED_TOO_HIGH':'Seed too high',
      'CANNOT_AFFORD_WAGER': 'Balance too low',
      'INVALID_WAGER': 'Invalid wager',
      'WAGER_TOO_LOW': 'Wager too low',
      'WAGER_TOO_PRECISE': 'Wager too precise',
      'INVALID_MULTIPLIER': 'Invalid multiplier',
      'MULTIPLIER_TOO_PRECISE': 'Multi too precise',
      'MULTIPLIER_TOO_HIGH': 'Multi too high',
      'MULTIPLIER_TOO_LOW': 'Multi too low'
    };

    innerNode = el.button(
      {type: 'button',
       disabled: true,
       className: 'btn btn-md btn-block btn-danger'},
      errorTranslations[error] || 'Setting Error'
    );
  //  Dispatcher.sendAction('STOP_RUN_AUTO');
  } else if (worldStore.state.user) {
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
              'Stop Auto'
            );
      }else{
        innerNode =
        el.button(
              {
                id: 'Start-Auto-Bet',
                type: 'button',
                className: 'btn btn-md btn-success btn-block',
                onClick: this._onClickStart
              },
              'Start Auto'
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

  return el.div(
      null,
      innerNode
  );

}

});

////END Autobet////////////////////////////////////////////////////////////////////////

var Dice_Stats = React.createClass({
displayName: 'Dice_Stats',
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
    el.div({className:'col-xs-4 col-sm-2'},'Bets: ' + worldStore.state.dicestats.bets.toString()),
    el.div({className:'col-xs-4 col-sm-2'},'Wins: ' + worldStore.state.dicestats.wins.toString()),
    el.div({className:'col-xs-4 col-sm-2'},'Losses: ' + worldStore.state.dicestats.loss.toString()),
    el.div({className:'col-xs-6 col-sm-3'},'Wagered: ' + helpers.convNumtoStr(worldStore.state.dicestats.wager) + worldStore.state.coin_type),
    el.div({className:'col-xs-6 col-sm-3'},'Profit: ' + helpers.convNumtoStr(worldStore.state.dicestats.profit) + worldStore.state.coin_type)//,
  //el.span({className:'glyphicon glyphicon-refresh'})
    )
  )
);
}
});

var DiceGameTabContent = React.createClass({
  displayName: 'DiceGameTabContent',
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
        'DICE',
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
                  'data-content': "<h6>How To Play:</h6><br><p>Select Multiplier, Adjust Wager, Click Bet-HI or Bet-LO</p>",
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
        React.createElement(DiceAdvancedSettings, null)
      ):'',
        el.div(
          {className: 'col-xs-6 col-sm-4 col-md-4 col-lg-2 hidden'},
          React.createElement(SiteEdgeSelect, null)
        ),
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
            React.createElement(BetBoxTarget, null)
          ),
          el.div(
            {className: 'col-xs-12 col-sm-6'},//,style: {marginTop: '-15'}},
            React.createElement(BetBoxProfit, null)
          )
        ),
        el.div(
          {className: 'col-xs-12 col-sm-4 col-md-4 col-lg-4'},//col-xs-12
          React.createElement(BetBoxWager, null)
          )
        ),
        el.div({className:'row'},
        el.div(null,
          React.createElement(BetBoxButton, null),
          (AutobetStore.state.ShowAutobet|| AutobetStore.state.Run_Autobet) ? el.div(
            null,
            React.createElement(AutobetButtons, null)
          ):''
        ),
        el.div({className:'col-xs-1'}),
        el.div(
          {className: 'col-xs-12 col-sm-6 col-md-2 col-lg-2 hidden-xs'},//,style: {marginTop: '-15'}},
          React.createElement(BetBoxBalance, null)
        )
        ),
        el.div(
          {className:'row'},
          React.createElement(BetBoxLastBet,null),
          React.createElement(Dice_Stats,null)
        )
      )
    );
  }
});
