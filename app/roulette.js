// bit-exo.com V3.0.0
// Copyright 2016 bit-exo.com

///////////////////////
// All trademarks,trade names,images,contents,snippets,codes,including text
// and graphics appearing on the site are intellectual property of their
// respective owners, including in some instances,"bit-exo.com".
// All rights reserved.
//contact: admin@bit-exo.com
//////////////////////////

var RouletteBoard = React.createClass({
  displayName: 'RouletteBoard',
  _onPopover: function() {
  // $('popover-btn').popover();
   $(function () {
     $('[data-toggle="popover"]').popover();
   });
   if(config.debug){console.log('hover POP');}
  },
  render: function (){
    var last_wager;
    var last_profit;
    var lastbetnode;
    var bet_table;

    if ((worldStore.state.first_bet) &&(worldStore.state.bets.data[worldStore.state.bets.end] != undefined)){
       last_wager = helpers.convNumtoStr(worldStore.state.bets.data[worldStore.state.bets.end].wager);
       last_profit = worldStore.state.bets.data[worldStore.state.bets.end].profit;
     }else {
       last_wager = '--';
       last_profit = 0.00;
     }

    lastbetnode = el.div(null,
            el.div({className: 'text',style:{marginTop:'20px'}},
            'Wager: ',
            el.span ({className:'text'}, last_wager + ' ' + worldStore.state.coin_type)
          ),
          el.div({className: 'lead'},
            'Profit: ',
            el.span(
              {className: 'text'},
             last_profit > 0 ? '+' + helpers.convNumtoStr(last_profit) : helpers.convNumtoStr(last_profit) + ' ',
             worldStore.state.coin_type
            )
        )
    );

    bet_table = el.div(null,
      el.table({className:'R_bet_table'},
        el.tbody(
          null,
          el.tr(null,
            el.td(
              {className:'rt-0 0', rowSpan:'3'},
              el.p(null,'0'),
              el.button ({className:'C_CHIP', type:'button',
              id:'popover-btn',
              //'data-html':'true',
              'data-container':'body',
              'data-trigger':'hover',
              'data-toggle':'popover',
              'data-placement':'bottom',
              'data-content': betStore.state.rt_stats[0] + '%',
               onMouseOver:this._onPopover},''),
        		  el.div ({className:'four-bet'},''),
              el.div ({className:'tri1-bet'},''),
              el.div ({className:'tri2-bet'},''),
              el.div ({className:'split03-bet'},''),
              el.div ({className:'split02-bet'},''),
              el.div ({className:'split01-bet'},'')
            ),
            el.td(
              {className:'rt-red ODD R1 D12 S18 3'},
              el.p(null,'3'),
              el.button ({className:'C_CHIP',type: 'button',
              id:'popover-btn',
              //'data-html':'true',
              'data-container':'body',
              'data-trigger':'hover',
              'data-toggle':'popover',
              'data-placement':'bottom',
              'data-content': betStore.state.rt_stats[3] + '%',
               onMouseOver:this._onPopover},''),
              el.div ({className:'SplitH-bet'},''),
              el.div ({className:'SplitV-bet'},''),
              el.div ({className:'Corner-bet'},'')
            ),
            el.td(
              {className:'rt-black EVEN R1 D12 S18 6'},
              el.p(null,'6'),
              el.button ({className:'C_CHIP',type: 'button',
              id:'popover-btn',
              //'data-html':'true',
              'data-container':'body',
              'data-trigger':'hover',
              'data-toggle':'popover',
              'data-placement':'bottom',
              'data-content': betStore.state.rt_stats[6] + '%',
               onMouseOver:this._onPopover},''),
              el.div ({className:'SplitH-bet'},''),
              el.div ({className:'SplitV-bet'},''),
              el.div ({className:'Corner-bet'},'')
            ),
            el.td(
              {className:'rt-red ODD R1 D12 S18 9'},
              el.p(null,'9'),
              el.button ({className:'C_CHIP',type: 'button',
              id:'popover-btn',
              //'data-html':'true',
              'data-container':'body',
              'data-trigger':'hover',
              'data-toggle':'popover',
              'data-placement':'bottom',
              'data-content': betStore.state.rt_stats[9] + '%',
               onMouseOver:this._onPopover},''),
              el.div ({className:'SplitH-bet'},''),
              el.div ({className:'SplitV-bet'},''),
              el.div ({className:'Corner-bet'},'')
            ),
            el.td(
              {className:'rt-red EVEN R1 D12 S18 12'},
              el.p(null,'12'),
              el.button ({className:'C_CHIP',type: 'button',
              id:'popover-btn',
              //'data-html':'true',
              'data-container':'body',
              'data-trigger':'hover',
              'data-toggle':'popover',
              'data-placement':'bottom',
              'data-content': betStore.state.rt_stats[12] + '%',
               onMouseOver:this._onPopover},''),
              el.div ({className:'SplitH-bet'},''),
              el.div ({className:'SplitV-bet'},''),
              el.div ({className:'Corner-bet'},'')
            ),
            el.td(
              {className:'rt-black ODD R1 D24 S18 15'},
              el.p(null,'15'),
              el.button ({className:'C_CHIP',type: 'button',
              id:'popover-btn',
              //'data-html':'true',
              'data-container':'body',
              'data-trigger':'hover',
              'data-toggle':'popover',
              'data-placement':'bottom',
              'data-content': betStore.state.rt_stats[15] + '%',
               onMouseOver:this._onPopover},''),
              el.div ({className:'SplitH-bet'},''),
              el.div ({className:'SplitV-bet'},''),
              el.div ({className:'Corner-bet'},'')
            ),
            el.td(
              {className:'rt-red EVEN R1 D24 S18 18'},
              el.p(null,'18'),
              el.button ({className:'C_CHIP',type: 'button',
              id:'popover-btn',
              //'data-html':'true',
              'data-container':'body',
              'data-trigger':'hover',
              'data-toggle':'popover',
              'data-placement':'bottom',
              'data-content': betStore.state.rt_stats[18] + '%',
               onMouseOver:this._onPopover},''),
              el.div ({className:'SplitH-bet'},''),
              el.div ({className:'SplitV-bet'},''),
              el.div ({className:'Corner-bet'},'')
            ),
            el.td(
              {className:'rt-red ODD R1 D24 S36 21'},
              el.p(null,'21'),
              el.button ({className:'C_CHIP',type: 'button',
              id:'popover-btn',
              //'data-html':'true',
              'data-container':'body',
              'data-trigger':'hover',
              'data-toggle':'popover',
              'data-placement':'bottom',
              'data-content': betStore.state.rt_stats[21] + '%',
               onMouseOver:this._onPopover},''),
              el.div ({className:'SplitH-bet'},''),
              el.div ({className:'SplitV-bet'},''),
              el.div ({className:'Corner-bet'},'')
            ),
            el.td(
              {className:'rt-black EVEN R1 D24 S36 24'},
              el.p(null,'24'),
              el.button ({className:'C_CHIP',type: 'button',
              id:'popover-btn',
              //'data-html':'true',
              'data-container':'body',
              'data-trigger':'hover',
              'data-toggle':'popover',
              'data-placement':'bottom',
              'data-content': betStore.state.rt_stats[24] + '%',
               onMouseOver:this._onPopover},''),
              el.div ({className:'SplitH-bet'},''),
              el.div ({className:'SplitV-bet'},''),
              el.div ({className:'Corner-bet'},'')
            ),
            el.td(
              {className:'rt-red ODD R1 D36 S36 27'},
              el.p(null,'27'),
              el.button ({className:'C_CHIP',type: 'button',
              id:'popover-btn',
              //'data-html':'true',
              'data-container':'body',
              'data-trigger':'hover',
              'data-toggle':'popover',
              'data-placement':'bottom',
              'data-content': betStore.state.rt_stats[27] + '%',
               onMouseOver:this._onPopover},''),
              el.div ({className:'SplitH-bet'},''),
              el.div ({className:'SplitV-bet'},''),
              el.div ({className:'Corner-bet'},'')
            ),
            el.td(
              {className:'rt-red EVEN R1 D36 S36 30'},
              el.p(null,'30'),
              el.button ({className:'C_CHIP',type: 'button',
              id:'popover-btn',
              //'data-html':'true',
              'data-container':'body',
              'data-trigger':'hover',
              'data-toggle':'popover',
              'data-placement':'bottom',
              'data-content': betStore.state.rt_stats[30] + '%',
               onMouseOver:this._onPopover},''),
              el.div ({className:'SplitH-bet'},''),
              el.div ({className:'SplitV-bet'},''),
              el.div ({className:'Corner-bet'},'')
            ),
            el.td(
              {className:'rt-black ODD R1 D36 S36 33'},
              el.p(null,'33'),
              el.button ({className:'C_CHIP',type: 'button',
              id:'popover-btn',
              //'data-html':'true',
              'data-container':'body',
              'data-trigger':'hover',
              'data-toggle':'popover',
              'data-placement':'bottom',
              'data-content': betStore.state.rt_stats[33] + '%',
               onMouseOver:this._onPopover},''),
              el.div ({className:'SplitH-bet'},''),
              el.div ({className:'SplitV-bet'},''),
              el.div ({className:'Corner-bet'},'')
            ),
            el.td(
              {className:'rt-red EVEN R1 D36 S36 36'},
              el.p(null,'36'),
              el.button ({className:'C_CHIP',type: 'button',
              id:'popover-btn',
              //'data-html':'true',
              'data-container':'body',
              'data-trigger':'hover',
              'data-toggle':'popover',
              'data-placement':'bottom',
              'data-content': betStore.state.rt_stats[36] + '%',
               onMouseOver:this._onPopover},''),
              el.div ({className:'SplitV-bet'},'')
            ),
            el.td({className: 'rt-green R1_SEL'},el.p(null,'R1'),el.button ({className:'R1_CHIP',type: 'button'},''))
          ),
        el.tr(null,
          el.td(
          {className:'rt-black EVEN R2 D12 S18 2'},
            el.p(null,'2'),
            el.button ({className:'C_CHIP',type: 'button',
            id:'popover-btn',
            //'data-html':'true',
            'data-container':'body',
            'data-trigger':'hover',
            'data-toggle':'popover',
            'data-placement':'bottom',
            'data-content': betStore.state.rt_stats[2] + '%',
             onMouseOver:this._onPopover},''),
            el.div ({className:'SplitH-bet'},''),
            el.div ({className:'SplitV-bet'},''),
            el.div ({className:'Corner-bet'},'')
          ),
          el.td(
            {className:'rt-red ODD R2 D12 S18 5'},
            el.p(null,'5'),
            el.button ({className:'C_CHIP',type: 'button',
            id:'popover-btn',
            //'data-html':'true',
            'data-container':'body',
            'data-trigger':'hover',
            'data-toggle':'popover',
            'data-placement':'bottom',
            'data-content': betStore.state.rt_stats[5] + '%',
             onMouseOver:this._onPopover},''),
            el.div ({className:'SplitH-bet'},''),
            el.div ({className:'SplitV-bet'},''),
            el.div ({className:'Corner-bet'},'')
          ),
          el.td(
            {className:'rt-black EVEN R2 D12 S18 8'},
            el.p(null,'8'),
            el.button ({className:'C_CHIP',type: 'button',
            id:'popover-btn',
            //'data-html':'true',
            'data-container':'body',
            'data-trigger':'hover',
            'data-toggle':'popover',
            'data-placement':'bottom',
            'data-content': betStore.state.rt_stats[8] + '%',
             onMouseOver:this._onPopover},''),
            el.div ({className:'SplitH-bet'},''),
            el.div ({className:'SplitV-bet'},''),
            el.div ({className:'Corner-bet'},'')
          ),
          el.td(
          {className:'rt-black ODD R2 D12 S18 11'},
            el.p(null,'11'),
            el.button ({className:'C_CHIP',type: 'button',
            id:'popover-btn',
            //'data-html':'true',
            'data-container':'body',
            'data-trigger':'hover',
            'data-toggle':'popover',
            'data-placement':'bottom',
            'data-content': betStore.state.rt_stats[11] + '%',
             onMouseOver:this._onPopover},''),
            el.div ({className:'SplitH-bet'},''),
            el.div ({className:'SplitV-bet'},''),
            el.div ({className:'Corner-bet'},'')
          ),
          el.td(
            {className:'rt-red EVEN R2 D24 S18 14'},
            el.p(null,'14'),
            el.button ({className:'C_CHIP',type: 'button',
            id:'popover-btn',
            //'data-html':'true',
            'data-container':'body',
            'data-trigger':'hover',
            'data-toggle':'popover',
            'data-placement':'bottom',
            'data-content': betStore.state.rt_stats[14] + '%',
             onMouseOver:this._onPopover},''),
            el.div ({className:'SplitH-bet'},''),
            el.div ({className:'SplitV-bet'},''),
            el.div ({className:'Corner-bet'},'')
          ),
          el.td(
            {className:'rt-black ODD R2 D24 S18 17'},
            el.p(null,'17'),
            el.button ({className:'C_CHIP',type: 'button',
            id:'popover-btn',
            //'data-html':'true',
            'data-container':'body',
            'data-trigger':'hover',
            'data-toggle':'popover',
            'data-placement':'bottom',
            'data-content': betStore.state.rt_stats[17] + '%',
             onMouseOver:this._onPopover},''),
            el.div ({className:'SplitH-bet'},''),
            el.div ({className:'SplitV-bet'},''),
            el.div ({className:'Corner-bet'},'')
          ),
          el.td(
          {className:'rt-black EVEN R2 D24 S36 20'},
            el.p(null,'20'),
            el.button ({className:'C_CHIP',type: 'button',
            id:'popover-btn',
            //'data-html':'true',
            'data-container':'body',
            'data-trigger':'hover',
            'data-toggle':'popover',
            'data-placement':'bottom',
            'data-content': betStore.state.rt_stats[20] + '%',
             onMouseOver:this._onPopover},''),
            el.div ({className:'SplitH-bet'},''),
            el.div ({className:'SplitV-bet'},''),
            el.div ({className:'Corner-bet'},'')
          ),
          el.td(
            {className:'rt-red ODD R2 D24 S36 23'},
            el.p(null,'23'),
            el.button ({className:'C_CHIP',type: 'button',
            id:'popover-btn',
            //'data-html':'true',
            'data-container':'body',
            'data-trigger':'hover',
            'data-toggle':'popover',
            'data-placement':'bottom',
            'data-content': betStore.state.rt_stats[23] + '%',
             onMouseOver:this._onPopover},''),
            el.div ({className:'SplitH-bet'},''),
            el.div ({className:'SplitV-bet'},''),
            el.div ({className:'Corner-bet'},'')
          ),
          el.td(
            {className:'rt-black EVEN R2 D36 S36 26'},
            el.p(null,'26'),
            el.button ({className:'C_CHIP',type: 'button',
            id:'popover-btn',
            //'data-html':'true',
            'data-container':'body',
            'data-trigger':'hover',
            'data-toggle':'popover',
            'data-placement':'bottom',
            'data-content': betStore.state.rt_stats[26] + '%',
             onMouseOver:this._onPopover},''),
            el.div ({className:'SplitH-bet'},''),
            el.div ({className:'SplitV-bet'},''),
            el.div ({className:'Corner-bet'},'')
          ),
          el.td(
          {className:'rt-black ODD R2 D36 S36 29'},
            el.p(null,'29'),
            el.button ({className:'C_CHIP',type: 'button',
            id:'popover-btn',
            //'data-html':'true',
            'data-container':'body',
            'data-trigger':'hover',
            'data-toggle':'popover',
            'data-placement':'bottom',
            'data-content': betStore.state.rt_stats[29] + '%',
             onMouseOver:this._onPopover},''),
            el.div ({className:'SplitH-bet'},''),
            el.div ({className:'SplitV-bet'},''),
            el.div ({className:'Corner-bet'},'')
          ),
          el.td(
            {className:'rt-red EVEN R2 D36 S36 32'},
            el.p(null,'32'),
            el.button ({className:'C_CHIP',type: 'button',
            id:'popover-btn',
            //'data-html':'true',
            'data-container':'body',
            'data-trigger':'hover',
            'data-toggle':'popover',
            'data-placement':'bottom',
            'data-content': betStore.state.rt_stats[32] + '%',
             onMouseOver:this._onPopover},''),
            el.div ({className:'SplitH-bet'},''),
            el.div ({className:'SplitV-bet'},''),
            el.div ({className:'Corner-bet'},'')
          ),
          el.td(
            {className:'rt-black ODD R2 D36 S36 35'},
            el.p(null,'35'),
            el.button ({className:'C_CHIP',type: 'button',
            id:'popover-btn',
            //'data-html':'true',
            'data-container':'body',
            'data-trigger':'hover',
            'data-toggle':'popover',
            'data-placement':'bottom',
            'data-content': betStore.state.rt_stats[35] + '%',
             onMouseOver:this._onPopover},''),
            el.div ({className:'SplitV-bet'},'')
          ),
          el.td({className: 'rt-green R2_SEL'},el.p(null,'R2'),el.button ({className:'R2_CHIP',type: 'button'},''))
        ),
        el.tr(null,
          el.td(
          {className:'rt-red ODD R3 D12 S18 1'},
            el.p(null,'1'),
            el.button ({className:'C_CHIP',type: 'button',
            id:'popover-btn',
            //'data-html':'true',
            'data-container':'body',
            'data-trigger':'hover',
            'data-toggle':'popover',
            'data-placement':'bottom',
            'data-content': betStore.state.rt_stats[1] + '%',
             onMouseOver:this._onPopover},''),
            el.div ({className:'SplitH-bet'},''),
            el.div ({className:'Street-bet'},''),
            el.div ({className:'StreetCorner-bet'},'')
          ),
          el.td(
            {className:'rt-black EVEN R3 D12 S18 4'},
            el.p(null,'4'),
            el.button ({className:'C_CHIP',type: 'button',
            id:'popover-btn',
            //'data-html':'true',
            'data-container':'body',
            'data-trigger':'hover',
            'data-toggle':'popover',
            'data-placement':'bottom',
            'data-content': betStore.state.rt_stats[4] + '%',
             onMouseOver:this._onPopover},''),
            el.div ({className:'SplitH-bet'},''),
            el.div ({className:'Street-bet'},''),
            el.div ({className:'StreetCorner-bet'},'')
          ),
          el.td(
            {className:'rt-red ODD R3 D12 S18 7'},
            el.p(null,'7'),
            el.button ({className:'C_CHIP',type: 'button',
            id:'popover-btn',
            //'data-html':'true',
            'data-container':'body',
            'data-trigger':'hover',
            'data-toggle':'popover',
            'data-placement':'bottom',
            'data-content': betStore.state.rt_stats[7] + '%',
             onMouseOver:this._onPopover},''),
            el.div ({className:'SplitH-bet'},''),
            el.div ({className:'Street-bet'},''),
            el.div ({className:'StreetCorner-bet'},'')
          ),
          el.td(
          {className:'rt-black EVEN R3 D12 S18 10'},
            el.p(null,'10'),
            el.button ({className:'C_CHIP',type: 'button',
            id:'popover-btn',
            //'data-html':'true',
            'data-container':'body',
            'data-trigger':'hover',
            'data-toggle':'popover',
            'data-placement':'bottom',
            'data-content': betStore.state.rt_stats[10] + '%',
             onMouseOver:this._onPopover},''),
            el.div ({className:'SplitH-bet'},''),
            el.div ({className:'Street-bet'},''),
            el.div ({className:'StreetCorner-bet'},'')
          ),
          el.td(
            {className:'rt-black ODD R3 D24 S18 13'},
            el.p(null,'13'),
            el.button ({className:'C_CHIP',type: 'button',
            id:'popover-btn',
            //'data-html':'true',
            'data-container':'body',
            'data-trigger':'hover',
            'data-toggle':'popover',
            'data-placement':'bottom',
            'data-content': betStore.state.rt_stats[13] + '%',
             onMouseOver:this._onPopover},''),
            el.div ({className:'SplitH-bet'},''),
            el.div ({className:'Street-bet'},''),
            el.div ({className:'StreetCorner-bet'},'')
          ),
          el.td(
            {className:'rt-red EVEN R3 D24 S18 16'},
            el.p(null,'16'),
            el.button ({className:'C_CHIP',type: 'button',
            id:'popover-btn',
            //'data-html':'true',
            'data-container':'body',
            'data-trigger':'hover',
            'data-toggle':'popover',
            'data-placement':'bottom',
            'data-content': betStore.state.rt_stats[16] + '%',
             onMouseOver:this._onPopover},''),
            el.div ({className:'SplitH-bet'},''),
            el.div ({className:'Street-bet'},''),
            el.div ({className:'StreetCorner-bet'},'')
          ),
          el.td(
          {className:'rt-red ODD R3 D24 S36 19'},
            el.p(null,'19'),
            el.button ({className:'C_CHIP',type: 'button',
            id:'popover-btn',
            //'data-html':'true',
            'data-container':'body',
            'data-trigger':'hover',
            'data-toggle':'popover',
            'data-placement':'bottom',
            'data-content': betStore.state.rt_stats[19] + '%',
             onMouseOver:this._onPopover},''),
            el.div ({className:'SplitH-bet'},''),
            el.div ({className:'Street-bet'},''),
            el.div ({className:'StreetCorner-bet'},'')
          ),
          el.td(
            {className:'rt-black EVEN R3 D24 S36 22'},
            el.p(null,'22'),
            el.button ({className:'C_CHIP',type: 'button',
            id:'popover-btn',
            //'data-html':'true',
            'data-container':'body',
            'data-trigger':'hover',
            'data-toggle':'popover',
            'data-placement':'bottom',
            'data-content': betStore.state.rt_stats[22] + '%',
             onMouseOver:this._onPopover},''),
            el.div ({className:'SplitH-bet'},''),
            el.div ({className:'Street-bet'},''),
            el.div ({className:'StreetCorner-bet'},'')
          ),
          el.td(
            {className:'rt-red ODD R3 D36 S36 25'},
            el.p(null,'25'),
            el.button ({className:'C_CHIP',type: 'button',
            id:'popover-btn',
            //'data-html':'true',
            'data-container':'body',
            'data-trigger':'hover',
            'data-toggle':'popover',
            'data-placement':'bottom',
            'data-content': betStore.state.rt_stats[25] + '%',
             onMouseOver:this._onPopover},''),
            el.div ({className:'SplitH-bet'},''),
            el.div ({className:'Street-bet'},''),
            el.div ({className:'StreetCorner-bet'},'')
          ),
          el.td(
          {className:'rt-black EVEN R3 D36 S36 28'},
            el.p(null,'28'),
            el.button ({className:'C_CHIP',type: 'button',
            id:'popover-btn',
            //'data-html':'true',
            'data-container':'body',
            'data-trigger':'hover',
            'data-toggle':'popover',
            'data-placement':'bottom',
            'data-content': betStore.state.rt_stats[28] + '%',
             onMouseOver:this._onPopover},''),
            el.div ({className:'SplitH-bet'},''),
            el.div ({className:'Street-bet'},''),
            el.div ({className:'StreetCorner-bet'},'')
          ),
          el.td(
            {className:'rt-black ODD R3 D36 S36 31'},
            el.p(null,'31'),
            el.button ({className:'C_CHIP',type: 'button',
            id:'popover-btn',
            //'data-html':'true',
            'data-container':'body',
            'data-trigger':'hover',
            'data-toggle':'popover',
            'data-placement':'bottom',
            'data-content': betStore.state.rt_stats[31] + '%',
             onMouseOver:this._onPopover},''),
            el.div ({className:'SplitH-bet'},''),
            el.div ({className:'Street-bet'},''),
            el.div ({className:'StreetCorner-bet'},'')
          ),
          el.td(
            {className:'rt-red EVEN R3 D36 S36 34'},
            el.p(null,'34'),
            el.button ({className:'C_CHIP',type: 'button',
            id:'popover-btn',
            //'data-html':'true',
            'data-container':'body',
            'data-trigger':'hover',
            'data-toggle':'popover',
            'data-placement':'bottom',
            'data-content': betStore.state.rt_stats[34] + '%',
             onMouseOver:this._onPopover},''),
            el.div ({className:'Street-bet'},'')
          ),
          el.td({className: 'rt-green R3_SEL'},el.p(null,'R3'),el.button ({className:'R3_CHIP',type: 'button'},''))
        ),
        el.tr(null,el.td({style:{border:'none',height:'40px'}, colSpan:'14'},'')),
        el.tr( {style:{borderRadius:'15px'}},
          el.td( {style:{border:'none'}, rowSpan:'3'},''),
          el.td ({className:'rt-green r1 D12', colSpan:'4'},el.p(null,'1-12'),el.button ({className:'D12_CHIP',type: 'button'},'')),
          el.td ({className:'rt-green r1 D24', colSpan:'4'},el.p(null,'13-24'),el.button ({className:'D24_CHIP',type: 'button'},'')),
          el.td ({className:'rt-green r1 D36', colSpan:'4'},el.p(null,'25-36'),el.button ({className:'D36_CHIP',type: 'button'},'')),
          el.td( {style:{border:'none'}, rowSpan:'3'},'')
        ),
        el.tr(null,
          el.td ({className:'rt-green r2 S18', colSpan:'6'},el.p(null,'1-18'),el.button ({className:'S18_CHIP',type: 'button'},'')),
          el.td ({className:'rt-green r2 S36', colSpan:'6'},el.p(null,'19-36'),el.button ({className:'S36_CHIP',type: 'button'},''))
        ),
        el.tr(null,
          el.td ({className:'rt-green r3 ODD_SEL', colSpan:'3'},el.p(null,'ODD'),el.button ({className:'O_CHIP',type: 'button'},'')),
          el.td ({className:'rt-red r3 RED_SEL', colSpan:'3'},el.p(null,'RED'),el.button ({className:'R_CHIP',type: 'button'},'')),
          el.td ({className:'rt-black r3 BLACK_SEL', colSpan:'3'},el.p(null,'BLACK'),el.button ({className:'B_CHIP',type: 'button'},'')),
          el.td ({className:'rt-green r3 EVEN_SEL', colSpan:'3'},el.p(null,'EVEN'),el.button ({className:'E_CHIP',type: 'button'},''))
        )
        )
      )
    );

    return el.div(
      null,
      el.div(
        {className: 'RouletteTable', id: 'R-Table'},
        el.div ({className: 'rt'},
          el.div ({className: 'rt-field'},
            //el.div ({className:'rt-mask'},''),
            bet_table
          ),
          el.div ({className: 'col-xs-4 rt-wheel'},
            el.div ({className: 'outcome', id: 'outcome', style:{background: betStore.state.rt_Outcome.background}},betStore.state.rt_Outcome.str),//, style:{background: betStore.state.rt_Outcome.background}
            lastbetnode
          )
        )

      )
    );
  }

});

var rt_buttongen = setInterval(buttongen, 100);

function buttongen(){
  var singleBet = document.getElementsByClassName('C_CHIP');
  for(var y = 0; y < singleBet.length; y++){
    singleBet[y].onclick = function(){
      //console.log('left click');  //ADD CHIP
      if(disableSingleBet != true){
        var numbers = [parseInt(this.parentElement.getElementsByTagName('P')[0].innerHTML)]
        addChips(this, "chip", numbers, 36);
      }
    }
    singleBet[y].oncontextmenu = function(){
      //console.log('right click'); //REMOVE CHIP
      window.event.returnValue = false;
      if(disableSingleBet != true){
         var numbers = [parseInt(this.parentElement.getElementsByTagName('P')[0].innerHTML)]
         removeChips(this, numbers, 36);
         }
      }
    }
///////////////////////////////////////////////////////////////////////////////////////
//Outside Bets
  var Odd_Wager = document.getElementsByClassName('O_CHIP');
  for (var x = 0; x < Odd_Wager.length; x++){
      Odd_Wager[0].onclick = function(){
        if(disableSingleBet != true){
          var numbers = [1,3,5,7,9,11,13,15,17,19,21,23,25,27,29,31,33,35];
          addChips(this,"halfChip", numbers, 2);
        }
      }
      Odd_Wager[0].oncontextmenu = function(){
        window.event.returnValue = false;
        if(disableSingleBet != true){
          var numbers = [1,3,5,7,9,11,13,15,17,19,21,23,25,27,29,31,33,35];
          removeChips(this, numbers, 2);
        }
      }
  }

  var Red_Wager = document.getElementsByClassName('R_CHIP');
  for (var x = 0; x < Red_Wager.length; x++){
      Red_Wager[0].onclick = function(){
        if(disableSingleBet != true){
          var numbers = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];
          addChips(this,"halfChip", numbers, 2);
        }
      }
      Red_Wager[0].oncontextmenu = function(){
        window.event.returnValue = false;
        if(disableSingleBet != true){
          var numbers = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];
          removeChips(this, numbers, 2);
        }
      }
  }

  var Black_Wager = document.getElementsByClassName('B_CHIP');
  for (var x = 0; x < Black_Wager.length; x++){
      Black_Wager[0].onclick = function(){
        if(disableSingleBet != true){
          var numbers = [2,4,6,8,10,11,13,15,17,20,22,24,26,28,29,31,33,35];
          addChips(this,"halfChip", numbers, 2);
        }
      }
      Black_Wager[0].oncontextmenu = function(){
        window.event.returnValue = false;
        if(disableSingleBet != true){
          var numbers = [2,4,6,8,10,11,13,15,17,20,22,24,26,28,29,31,33,35];
          removeChips(this, numbers, 2);
        }
      }
  }

  var Eve_Wager = document.getElementsByClassName('E_CHIP');
  for (var x = 0; x < Eve_Wager.length; x++){
      Eve_Wager[0].onclick = function(){
        if(disableSingleBet != true){
        var numbers = [2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36];
        addChips(this,"halfChip", numbers, 2);
        }
      }
      Eve_Wager[0].oncontextmenu = function(){
        window.event.returnValue = false;
        if(disableSingleBet != true){
          var numbers = [2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36];
          removeChips(this, numbers, 2);
        }
      }
  }

  var S18_Wager = document.getElementsByClassName('S18_CHIP');
  for (var x = 0; x < S18_Wager.length; x++){
      S18_Wager[0].onclick = function(){
        if(disableSingleBet != true){
        var numbers = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18];
        addChips(this,"halfChip", numbers, 2);
        }
      }
      S18_Wager[0].oncontextmenu = function(){
        window.event.returnValue = false;
        if(disableSingleBet != true){
          var numbers = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18];
          removeChips(this, numbers, 2);
        }
      }
  }

  var S36_Wager = document.getElementsByClassName('S36_CHIP');
  for (var x = 0; x < S36_Wager.length; x++){
      S36_Wager[0].onclick = function(){
        if(disableSingleBet != true){
        var numbers = [19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36];
        addChips(this,"halfChip", numbers, 2);
        }
      }
      S36_Wager[0].oncontextmenu = function(){
        window.event.returnValue = false;
        if(disableSingleBet != true){
          var numbers = [19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36];
          removeChips(this, numbers, 2);
        }
      }
  }

  var D12_Wager = document.getElementsByClassName('D12_CHIP');
  for (var x = 0; x < D12_Wager.length; x++){
      D12_Wager[0].onclick = function(){
        if(disableSingleBet != true){
          var numbers = [1,2,3,4,5,6,7,8,9,10,11,12];
          addChips(this, "dozenChip", numbers, 3);
        }
      }
      D12_Wager[0].oncontextmenu = function(){
        window.event.returnValue = false;
        if(disableSingleBet != true){
          var numbers = [1,2,3,4,5,6,7,8,9,10,11,12];
          removeChips(this, numbers, 3);
        }
      }
  }

  var D24_Wager = document.getElementsByClassName('D24_CHIP');
  for (var x = 0; x < D24_Wager.length; x++){
      D24_Wager[0].onclick = function(){
        if(disableSingleBet != true){
          var numbers = [13,14,15,16,17,18,19,20,21,22,23,24];
          addChips(this, "dozenChip", numbers, 3);
        }
      }
      D24_Wager[0].oncontextmenu = function(){
        window.event.returnValue = false;
        if(disableSingleBet != true){
          var numbers = [13,14,15,16,17,18,19,20,21,22,23,24];
          removeChips(this, numbers, 3);
        }
      }
  }

  var D36_Wager = document.getElementsByClassName('D36_CHIP');
  for (var x = 0; x < D36_Wager.length; x++){
      D36_Wager[0].onclick = function(){
        if(disableSingleBet != true){
          var numbers = [25,26,27,28,29,30,31,32,33,34,35,36];
          addChips(this, "dozenChip", numbers, 3);
        }
      }
      D36_Wager[0].oncontextmenu = function(){
        window.event.returnValue = false;
        if(disableSingleBet != true){
          var numbers = [25,26,27,28,29,30,31,32,33,34,35,36];
          removeChips(this, numbers, 3);
        }
      }
  }

  var R1_Wager = document.getElementsByClassName('R1_CHIP');
  for (var x = 0; x < R1_Wager.length; x++){
      R1_Wager[0].onclick = function(){
        if(disableSingleBet != true){
          var numbers = [3,6,9,12,15,18,21,24,27,30,33,36];
          addChips(this, "dozenChip", numbers, 3);
        }
      }
      R1_Wager[0].oncontextmenu = function(){
        window.event.returnValue = false;
        if(disableSingleBet != true){
          var numbers = [3,6,9,12,15,18,21,24,27,30,33,36];
          removeChips(this, numbers, 3);
        }
      }
  }

  var R2_Wager = document.getElementsByClassName('R2_CHIP');
  for (var x = 0; x < R2_Wager.length; x++){
      R2_Wager[0].onclick = function(){
        if(disableSingleBet != true){
          var numbers = [2,5,8,11,14,17,20,23,26,29,32,35];
          addChips(this, "dozenChip", numbers, 3);
        }
      }
      R2_Wager[0].oncontextmenu = function(){
        window.event.returnValue = false;
        if(disableSingleBet != true){
          var numbers = [2,5,8,11,14,17,20,23,26,29,32,35];
          removeChips(this, numbers, 3);
        }
      }
  }

  var R3_Wager = document.getElementsByClassName('R3_CHIP');
  for (var x = 0; x < R3_Wager.length; x++){
      R3_Wager[0].onclick = function(){
        if(disableSingleBet != true){
          var numbers = [1,4,7,10,13,16,19,22,25,28,31,34];
          addChips(this, "dozenChip", numbers, 3);
        }
      }
      R3_Wager[0].oncontextmenu = function(){
        window.event.returnValue = false;
        if(disableSingleBet != true){
          var numbers = [1,4,7,10,13,16,19,22,25,28,31,34];
          removeChips(this, numbers, 3);
        }
      }
  }
/////////////////////////////////////////////////////////////////////////////////
// FOR HIGHLIGHTING BUTTONS
  var tagOddElms = document.getElementsByClassName('ODD');
  var tagOddBet = document.getElementsByClassName('rt-green ODD_SEL');

  for (var x = 0; x < tagOddBet.length; x++){
      tagOddBet[0].onmouseover = function() {
        for (var y = 0; y < tagOddElms.length; y++) {
          tagOddElms[y].classList.add('select');
        }
      }
      tagOddBet[0].onmouseout = function() {
        for (var y = 0; y < tagOddElms.length; y++) {
          tagOddElms[y].classList.remove('select');
        }
      }
    }

  var tagEvenElms = document.getElementsByClassName('EVEN');
  var tagEvenBet = document.getElementsByClassName('rt-green EVEN_SEL');
  for (var x = 0; x < tagEvenBet.length; x++){
    tagEvenBet[0].onmouseover = function() {
      for (var y = 0; y < tagEvenElms.length; y++) {
        tagEvenElms[y].classList.add('select');
      }
    }
    tagEvenBet[0].onmouseout = function() {
      for (var y = 0; y < tagEvenElms.length; y++) {
        tagEvenElms[y].classList.remove('select');
      }
    }
  }

  var tagRedElms = document.getElementsByClassName('rt-red');
  var tagRedBet = document.getElementsByClassName('rt-red RED_SEL');
  for (var x = 0; x < tagRedBet.length; x++){
    tagRedBet[0].onmouseover = function() {
      for (var y = 0; y < tagRedElms.length; y++) {
        tagRedElms[y].classList.add('select');
      }
    }
    tagRedBet[0].onmouseout = function() {
      for (var y = 0; y < tagRedElms.length; y++) {
        tagRedElms[y].classList.remove('select');
      }
    }
  }

  var tagBlackElms = document.getElementsByClassName('rt-black');
  var tagBlackBet = document.getElementsByClassName('rt-black BLACK_SEL');
  for (var x = 0; x < tagBlackBet.length; x++){
    tagBlackBet[0].onmouseover = function() {
      for (var y = 0; y < tagBlackElms.length; y++) {
        tagBlackElms[y].classList.add('select');
      }
    }
    tagBlackBet[0].onmouseout = function() {
      for (var y = 0; y < tagBlackElms.length; y++) {
        tagBlackElms[y].classList.remove('select');
      }
    }
  }

  var tagRow1Elms = document.getElementsByClassName('R1');
  var tagRow1Bet = document.getElementsByClassName('rt-green R1_SEL');
  for (var x = 0; x < tagRow1Bet.length; x++){
    tagRow1Bet[0].onmouseover = function() {
      for (var y = 0; y < tagRow1Elms.length; y++) {
        tagRow1Elms[y].classList.add('select');
      }
    }
    tagRow1Bet[0].onmouseout = function() {
      for (var y = 0; y < tagRow1Elms.length; y++) {
        tagRow1Elms[y].classList.remove('select');
      }
    }
  }

  var tagRow2Elms = document.getElementsByClassName('R2');
  var tagRow2Bet = document.getElementsByClassName('rt-green R2_SEL');
  for (var x = 0; x < tagRow2Bet.length; x++){
    tagRow2Bet[0].onmouseover = function() {
      for (var y = 0; y < tagRow2Elms.length; y++) {
        tagRow2Elms[y].classList.add('select');
      }
    }
    tagRow2Bet[0].onmouseout = function() {
      for (var y = 0; y < tagRow2Elms.length; y++) {
        tagRow2Elms[y].classList.remove('select');
      }
    }
  }

  var tagRow3Elms = document.getElementsByClassName('R3');
  var tagRow3Bet = document.getElementsByClassName('rt-green R3_SEL');
  for (var x = 0; x < tagRow3Bet.length; x++){
    tagRow3Bet[0].onmouseover = function() {
      for (var y = 0; y < tagRow3Elms.length; y++) {
        tagRow3Elms[y].classList.add('select');
      }
    }
    tagRow3Bet[0].onmouseout = function() {
      for (var y = 0; y < tagRow3Elms.length; y++) {
        tagRow3Elms[y].classList.remove('select');
      }
    }
  }

  //1-12  D12
  var tagD12Elms = document.getElementsByClassName('D12');
  var tagD12Bet = document.getElementsByClassName('rt-green D12');
  for (var x = 0; x < tagD12Bet.length; x++){
    tagD12Bet[0].onmouseover = function() {
      for (var y = 0; y < tagD12Elms.length; y++) {
        tagD12Elms[y].classList.add('select');
      }
    }
    tagD12Bet[0].onmouseout = function() {
      for (var y = 0; y < tagD12Elms.length; y++) {
        tagD12Elms[y].classList.remove('select');
      }
    }
  }
  //13-24 D24
  var tagD24Elms = document.getElementsByClassName('D24');
  var tagD24Bet = document.getElementsByClassName('rt-green D24');
  for (var x = 0; x < tagD24Bet.length; x++){
    tagD24Bet[0].onmouseover = function() {
      for (var y = 0; y < tagD24Elms.length; y++) {
        tagD24Elms[y].classList.add('select');
      }
    }
    tagD24Bet[0].onmouseout = function() {
      for (var y = 0; y < tagD24Elms.length; y++) {
        tagD24Elms[y].classList.remove('select');
      }
    }
  }
  //25-36 D36
  var tagD36Elms = document.getElementsByClassName('D36');
  var tagD36Bet = document.getElementsByClassName('rt-green D36');
  for (var x = 0; x < tagD36Bet.length; x++){
    tagD36Bet[0].onmouseover = function() {
      for (var y = 0; y < tagD36Elms.length; y++) {
        tagD36Elms[y].classList.add('select');
      }
    }
    tagD36Bet[0].onmouseout = function() {
      for (var y = 0; y < tagD36Elms.length; y++) {
        tagD36Elms[y].classList.remove('select');
      }
    }
  }
  //1-18  S18
  var tagS18Elms = document.getElementsByClassName('S18');
  var tagS18Bet = document.getElementsByClassName('rt-green S18');
  for (var x = 0; x < tagS18Bet.length; x++){
    tagS18Bet[0].onmouseover = function() {
      for (var y = 0; y < tagS18Elms.length; y++) {
        tagS18Elms[y].classList.add('select');
      }
    }
    tagS18Bet[0].onmouseout = function() {
      for (var y = 0; y < tagS18Elms.length; y++) {
        tagS18Elms[y].classList.remove('select');
      }
    }
  }
  //19-36 S36
  var tagS36Elms = document.getElementsByClassName('S36');
  var tagS36Bet = document.getElementsByClassName('rt-green S36');
  for (var x = 0; x < tagS36Bet.length; x++){
    tagS36Bet[0].onmouseover = function() {
      for (var y = 0; y < tagS36Elms.length; y++) {
        tagS36Elms[y].classList.add('select');
      }
    }
    tagS36Bet[0].onmouseout = function() {
      for (var y = 0; y < tagS36Elms.length; y++) {
        tagS36Elms[y].classList.remove('select');
      }
    }
  }
// end highlights
///STREETBETS
var disableSingleBet = false;
var streetBet = document.getElementsByClassName('Street-bet');
for(var x = 0; x<streetBet.length;x++){
    streetBet[x].onmouseover = function(){
        var cur = parseInt(this.parentElement.getElementsByTagName('p')[0].innerHTML);
        disableSingleBet = true;
        this.parentElement.classList.add('select');
        document.getElementsByClassName(cur+1)[0].classList.add('select');
        document.getElementsByClassName(cur+2)[0].classList.add('select');
        }
    streetBet[x].onmouseout = function(){
        var cur = parseInt(this.parentElement.getElementsByTagName('p')[0].innerHTML);
        disableSingleBet = false;
        this.parentElement.classList.remove('select');
        document.getElementsByClassName(cur+1)[0].classList.remove('select');
        document.getElementsByClassName(cur+2)[0].classList.remove('select');
        }
    streetBet[x].onclick = function(){
        var num1 = parseInt(this.parentElement.getElementsByTagName('P')[0].innerHTML);
        var num2 = num1 +1;
        var num3 = num1 +2;
        var numbers = [num1, num2, num3];
        addChips(this, "streetChip", numbers,12);
        }
    streetBet[x].oncontextmenu = function(){
      window.event.returnValue = false;
        var num1 = parseInt(this.parentElement.getElementsByTagName('P')[0].innerHTML);
        var num2 = num1 +1;
        var num3 = num1 +2;
        var numbers = [num1, num2,num3];
        removeChips(this,numbers,12);
        }
    }
    ///STREETCORNERBETS
    var SCBet = document.getElementsByClassName('StreetCorner-bet');
    for(var x = 0; x<SCBet.length;x++){
        SCBet[x].onmouseover = function(){
          var cur = parseInt(this.parentElement.getElementsByTagName('p')[0].innerHTML);
          disableSingleBet = true;
          this.parentElement.classList.add('select');
          document.getElementsByClassName(cur+1)[0].classList.add('select');
          document.getElementsByClassName(cur+2)[0].classList.add('select');
          document.getElementsByClassName(cur+3)[0].classList.add('select');
          document.getElementsByClassName(cur+4)[0].classList.add('select');
          document.getElementsByClassName(cur+5)[0].classList.add('select');
          }
        SCBet[x].onmouseout = function(){
          var cur = parseInt(this.parentElement.getElementsByTagName('p')[0].innerHTML);
          disableSingleBet = false;
          this.parentElement.classList.remove('select');
          document.getElementsByClassName(cur+1)[0].classList.remove('select');
          document.getElementsByClassName(cur+2)[0].classList.remove('select');
          document.getElementsByClassName(cur+3)[0].classList.remove('select');
          document.getElementsByClassName(cur+4)[0].classList.remove('select');
          document.getElementsByClassName(cur+5)[0].classList.remove('select');
          }
        SCBet[x].onclick = function(){
          var num1 = parseInt(this.parentElement.getElementsByTagName('P')[0].innerHTML);
          var num2 = num1 +1;
          var num3 = num1 +2;
          var num4 = num1 +3;
          var num5 = num1 +4;
          var num6 = num1 +5;
          var numbers = [num1, num2, num3, num4, num5, num6];
          addChips(this, "dsChip", numbers,6);
          }
        SCBet[x].oncontextmenu = function(){
          window.event.returnValue = false;
          var num1 = parseInt(this.parentElement.getElementsByTagName('P')[0].innerHTML);
          var num2 = num1 +1;
          var num3 = num1 +2;
          var num4 = num1 +3;
          var num5 = num1 +4;
          var num6 = num1 +5;
          var numbers = [num1, num2, num3, num4, num5, num6];
          removeChips(this,numbers,6);
          }
    }
    //FOURBET
    var fourBet = document.getElementsByClassName('four-bet');
    for(var x = 0; x<fourBet.length;x++){
        fourBet[x].onmouseover = function(){
          var cur = parseInt(this.parentElement.getElementsByTagName('p')[0].innerHTML);
          disableSingleBet = true;
          this.parentElement.classList.add('select');
          document.getElementsByClassName(cur+1)[0].classList.add('select');
          document.getElementsByClassName(cur+2)[0].classList.add('select');
          document.getElementsByClassName(cur+3)[0].classList.add('select');
          }
        fourBet[x].onmouseout = function(){
          var cur = parseInt(this.parentElement.getElementsByTagName('p')[0].innerHTML);
          disableSingleBet = false;
          this.parentElement.classList.remove('select');
          document.getElementsByClassName(cur+1)[0].classList.remove('select');
          document.getElementsByClassName(cur+2)[0].classList.remove('select');
          document.getElementsByClassName(cur+3)[0].classList.remove('select');
          }
        fourBet[x].onclick = function(){
          var num1 = parseInt(this.parentElement.getElementsByTagName('P')[0].innerHTML);
          var num2 = num1 +1;
          var num3 = num1 +2;
          var num4 = num1 +3;
          var numbers = [num1, num2, num3, num4];
          addChips(this, "fourChip", numbers,9);
          }
        fourBet[x].oncontextmenu = function(){
          window.event.returnValue = false;
          var num1 = parseInt(this.parentElement.getElementsByTagName('P')[0].innerHTML);
          var num2 = num1 +1;
          var num3 = num1 +2;
          var num4 = num1 +3;
          var numbers = [num1, num2, num3, num4];
          removeChips(this,numbers,9);
          }
    }
    /////////////////
    var s03Bet = document.getElementsByClassName('split03-bet');
    for(var x = 0; x<s03Bet.length;x++){
        s03Bet[x].onmouseover = function(){
          var cur = parseInt(this.parentElement.getElementsByTagName('p')[0].innerHTML);
          disableSingleBet = true;
          this.parentElement.classList.add('select');
          document.getElementsByClassName(cur+3)[0].classList.add('select');
          }
        s03Bet[x].onmouseout = function(){
          var cur = parseInt(this.parentElement.getElementsByTagName('p')[0].innerHTML);
          disableSingleBet = false;
          this.parentElement.classList.remove('select');
          document.getElementsByClassName(cur+3)[0].classList.remove('select');
          }
        s03Bet[x].onclick = function(){
          var num1 = parseInt(this.parentElement.getElementsByTagName('P')[0].innerHTML);
          var num4 = num1 +3;
          var numbers = [num1, num4];
          addChips(this, "s3Chip", numbers,18);
          }
        s03Bet[x].oncontextmenu = function(){
          window.event.returnValue = false;
          var num1 = parseInt(this.parentElement.getElementsByTagName('P')[0].innerHTML);
          var num4 = num1 +3;
          var numbers = [num1,num4];
          removeChips(this,numbers,18);
          }
    }

    var s02Bet = document.getElementsByClassName('split02-bet');
    for(var x = 0; x<s02Bet.length;x++){
        s02Bet[x].onmouseover = function(){
          var cur = parseInt(this.parentElement.getElementsByTagName('p')[0].innerHTML);
          disableSingleBet = true;
          this.parentElement.classList.add('select');
          document.getElementsByClassName(cur+2)[0].classList.add('select');
          }
        s02Bet[x].onmouseout = function(){
          var cur = parseInt(this.parentElement.getElementsByTagName('p')[0].innerHTML);
          disableSingleBet = false;
          this.parentElement.classList.remove('select');
          document.getElementsByClassName(cur+2)[0].classList.remove('select');
          }
        s02Bet[x].onclick = function(){
          var num1 = parseInt(this.parentElement.getElementsByTagName('P')[0].innerHTML);
          var num2 = num1 +2;
          var numbers = [num1, num2];
          addChips(this, "s2Chip", numbers,18);
          }
        s02Bet[x].oncontextmenu = function(){
          window.event.returnValue = false;
          var num1 = parseInt(this.parentElement.getElementsByTagName('P')[0].innerHTML);
          var num2 = num1 +2;
          var numbers = [num1,num2];
          removeChips(this,numbers,18);
          }
    }

    var s01Bet = document.getElementsByClassName('split01-bet');
    for(var x = 0; x<s01Bet.length;x++){
        s01Bet[x].onmouseover = function(){
          var cur = parseInt(this.parentElement.getElementsByTagName('p')[0].innerHTML);
          disableSingleBet = true;
          this.parentElement.classList.add('select');
          document.getElementsByClassName(cur+1)[0].classList.add('select');
          }
        s01Bet[x].onmouseout = function(){
          var cur = parseInt(this.parentElement.getElementsByTagName('p')[0].innerHTML);
          disableSingleBet = false;
          this.parentElement.classList.remove('select');
          document.getElementsByClassName(cur+1)[0].classList.remove('select');
          }
        s01Bet[x].onclick = function(){
          var num1 = parseInt(this.parentElement.getElementsByTagName('P')[0].innerHTML);
          var num2 = num1 +1;
          var numbers = [num1, num2];
          addChips(this, "s1Chip", numbers,18);
          }
        s01Bet[x].oncontextmenu = function(){
          window.event.returnValue = false;
          var num1 = parseInt(this.parentElement.getElementsByTagName('P')[0].innerHTML);
          var num2 = num1 +1;
          var numbers = [num1,num2];
          removeChips(this,numbers,18);
          }
    }


    var tri1Bet = document.getElementsByClassName('tri1-bet');
    for(var x = 0; x<tri1Bet.length;x++){
        tri1Bet[x].onmouseover = function(){
          var cur = parseInt(this.parentElement.getElementsByTagName('p')[0].innerHTML);
          disableSingleBet = true;
          this.parentElement.classList.add('select');
          document.getElementsByClassName(cur+2)[0].classList.add('select');
          document.getElementsByClassName(cur+3)[0].classList.add('select');
          }
        tri1Bet[x].onmouseout = function(){
          var cur = parseInt(this.parentElement.getElementsByTagName('p')[0].innerHTML);
          disableSingleBet = false;
          this.parentElement.classList.remove('select');
          document.getElementsByClassName(cur+2)[0].classList.remove('select');
          document.getElementsByClassName(cur+3)[0].classList.remove('select');
          }
        tri1Bet[x].onclick = function(){
          var numbers = [0,2,3];
          addChips(this, "tri1Chip", numbers,12);
          }
        tri1Bet[x].oncontextmenu = function(){
          window.event.returnValue = false;
          var numbers = [0,2,3];
          removeChips(this,numbers,12);
          }
    }

    var tri2Bet = document.getElementsByClassName('tri2-bet');
    for(var x = 0; x<tri2Bet.length;x++){
        tri2Bet[x].onmouseover = function(){
          var cur = parseInt(this.parentElement.getElementsByTagName('p')[0].innerHTML);
          disableSingleBet = true;
          this.parentElement.classList.add('select');
          document.getElementsByClassName(cur+1)[0].classList.add('select');
          document.getElementsByClassName(cur+2)[0].classList.add('select');
          }
        tri2Bet[x].onmouseout = function(){
          var cur = parseInt(this.parentElement.getElementsByTagName('p')[0].innerHTML);
          disableSingleBet = false;
          this.parentElement.classList.remove('select');
          document.getElementsByClassName(cur+1)[0].classList.remove('select');
          document.getElementsByClassName(cur+2)[0].classList.remove('select');
          }
        tri2Bet[x].onclick = function(){
          var numbers = [0,2,1];
          addChips(this, "tri2Chip", numbers,12);
          }
        tri2Bet[x].oncontextmenu = function(){
          window.event.returnValue = false;
          var numbers = [0,2,1];
          removeChips(this,numbers,12);
        }
    }

    var SBH = document.getElementsByClassName('SplitH-bet');
    for(var b = 0; b < SBH.length; b++){
        SBH[b].onmouseover = function(){
          disableSingleBet = true;
          this.parentElement.classList.add('select');
          this.parentElement.nextElementSibling.classList.add('select');
          }
        SBH[b].onmouseout = function(){
          disableSingleBet = false;
          this.parentElement.classList.remove('select');
          this.parentElement.nextElementSibling.classList.remove('select');
          }
        SBH[b].onclick = function(){
          var num1 = parseInt(this.parentElement.getElementsByTagName('P')[0].innerHTML);
          var num2 = num1 +3;
          var numbers = [num1, num2];
          addChips(this, "SVchip", numbers,18);
          }
        SBH[b].oncontextmenu = function(){
          window.event.returnValue = false;
          var num1 = parseInt(this.parentElement.getElementsByTagName('P')[0].innerHTML);
          var num2 = num1 +3;
          var numbers = [num1, num2];
          removeChips(this,numbers,18);
          }
    }

    var SBV = document.getElementsByClassName('SplitV-bet');
    for(var b = 0; b < SBV.length; b++){
        SBV[b].onmouseover = function(){
          disableSingleBet = true;
          this.parentElement.classList.add('select');
          for(var u = 0; u < this.parentElement.classList.length; u++){
            switch(this.parentElement.classList[u]){
              case '3':
              case '6':
              case '9':
              case '12':
              case '15':
              case '18':
              case '21':
              case '24':
              case '27':
              case '30':
              case '33':
              case '36':
              case '2':
              case '5':
              case '8':
              case '11':
              case '14':
              case '17':
              case '20':
              case '23':
              case '26':
              case '29':
              case '32':
              case '35':
                var tmpIndex = parseInt(this.parentElement.classList[u]) - 1;
                document.getElementsByClassName(tmpIndex)[0].classList.add('select');
                break;
              }
            }
        }
        SBV[b].onmouseout = function(){
            disableSingleBet = false;
            this.parentElement.classList.remove('select');
            for(var u = 0; u < this.parentElement.classList.length; u++){
              switch(this.parentElement.classList[u]){
                case '3':
                case '6':
                case '9':
                case '12':
                case '15':
                case '18':
                case '21':
                case '24':
                case '27':
                case '30':
                case '33':
                case '36':
                case '2':
                case '5':
                case '8':
                case '11':
                case '14':
                case '17':
                case '20':
                case '23':
                case '26':
                case '29':
                case '32':
                case '35':
                  var tmpIndex = parseInt(this.parentElement.classList[u]) - 1;
                  document.getElementsByClassName(tmpIndex)[0].classList.remove('select');
                  break;
                }
            }
          }
          SBV[b].onclick = function(){
            var num1 = parseInt(this.parentElement.getElementsByTagName('P')[0].innerHTML);
            var num2 = num1 -1;
            var numbers = [num1, num2];
            addChips(this, "SHchip", numbers,18);
            }
          SBV[b].oncontextmenu = function(){
            window.event.returnValue = false;
            var num1 = parseInt(this.parentElement.getElementsByTagName('P')[0].innerHTML);
            var num2 = num1 -1;
            var numbers = [num1, num2];
            removeChips(this, numbers,18);
            }
        }

        var CB = document.getElementsByClassName('Corner-bet');
        for(var t = 0; t < CB.length; t++){
            CB[t].onmouseover = function(){
              disableSingleBet = true;
              this.parentElement.classList.add('select');
              for(var u = 0; u < this.parentElement.classList.length; u++){
                switch(this.parentElement.classList[u]){
                  case '3':
                  case '6':
                  case '9':
                  case '12':
                  case '15':
                  case '18':
                  case '21':
                  case '24':
                  case '27':
                  case '30':
                  case '33':
                  case '2':
                  case '5':
                  case '8':
                  case '11':
                  case '14':
                  case '17':
                  case '20':
                  case '23':
                  case '26':
                  case '29':
                  case '32':
                    var tmpIndex1 = parseInt(this.parentElement.classList[u]) -1;
                    var tmpIndex2 = parseInt(this.parentElement.classList[u]) +2;
                    var tmpIndex3 = parseInt(this.parentElement.classList[u]) +3;
                    document.getElementsByClassName(tmpIndex1)[0].classList.add('select');
                    document.getElementsByClassName(tmpIndex2)[0].classList.add('select');
                    document.getElementsByClassName(tmpIndex3)[0].classList.add('select');
                    break;
                  }
                }
        }
        CB[t].onmouseout = function(){
            disableSingleBet = false;
            this.parentElement.classList.remove('select');
            for(var u = 0; u < this.parentElement.classList.length; u++){
              switch(this.parentElement.classList[u]){
                case '3':
                case '6':
                case '9':
                case '12':
                case '15':
                case '18':
                case '21':
                case '24':
                case '27':
                case '30':
                case '33':
                case '2':
                case '5':
                case '8':
                case '11':
                case '14':
                case '17':
                case '20':
                case '23':
                case '26':
                case '29':
                case '32':
                  var tmpIndex1 = parseInt(this.parentElement.classList[u]) - 1;
                  var tmpIndex2 = parseInt(this.parentElement.classList[u]) +2;
                  var tmpIndex3 = parseInt(this.parentElement.classList[u]) +3;
                  document.getElementsByClassName(tmpIndex1)[0].classList.remove('select');
                  document.getElementsByClassName(tmpIndex2)[0].classList.remove('select');
                  document.getElementsByClassName(tmpIndex3)[0].classList.remove('select');
                  break;
                }
              }
          }
        CB[t].onclick = function(){
          var num1 = parseInt(this.parentElement.getElementsByTagName('P')[0].innerHTML);
          var num2 = num1 +3;
          var num3 = num1 -1;
          var num4 = num1 +2;
          var numbers = [num1, num2,num3, num4];
          addChips(this, "cnChip", numbers,9);
          }
        CB[t].oncontextmenu = function(){
          window.event.returnValue = false;
          var num1 = parseInt(this.parentElement.getElementsByTagName('P')[0].innerHTML);
          var num2 = num1 +3;
          var num3 = num1 -1;
          var num4 = num1 +2;
          var numbers = [num1, num2,num3, num4];
          removeChips(this, numbers,9);
          }
  }
////////
  if (singleBet.length > 0)
  {
    clearInterval(rt_buttongen);
  }

};


function createChips(chipType, numbers, multiplier) {
  var baseBet = betStore.state.rt_ChipSize;
  for(s = 0; s < numbers.length; s++){
      payout[numbers[s]] += baseBet*multiplier;
    }
  var div = document.createElement('div');
  var wagered = betStore.state.rt_TotalWager + baseBet;
  Dispatcher.sendAction('UPDATE_TOTALWAGER', wagered);
  div.className = chipType;
  div.style.background = "#57C3FD";
  div.innerHTML = baseBet;
  return div;
}

function addChips(parent, chipType, numbers, multiplier) {
    if((disableChips == false)&&(AutobetStore.state.Run_Autobet == false)){
      var conv = worldStore.state.coin_type == 'BTC' ? (100):helpers.convCoinTypetoSats(1);
      multiplier = multiplier *conv;//100;
        var baseBet = betStore.state.rt_ChipSize;
        if (parent.children.length == 0) {
          parent.appendChild(createChips(chipType, numbers, multiplier));
        } else {
            for(s = 0; s < numbers.length; s++){
              payout[numbers[s]] += baseBet*multiplier;
            }
        var newVal = parseFloat(parent.children[0].innerHTML) + baseBet;
        var wagered = betStore.state.rt_TotalWager + baseBet;
        Dispatcher.sendAction('UPDATE_TOTALWAGER', wagered);
        if ((worldStore.state.coin_type == 'BTC')||(worldStore.state.coin_type == 'BITS')){
        parent.children[0].innerHTML = newVal.toString();
        }else {
          parent.children[0].innerHTML = newVal.toFixed(2).toString();
        }
        parent.children[0].style.background = "#57C3FD";
      }
    }
}

function createChipSpecial(chipType, numbers, multiplier, betsize) {
  //var baseBet = betStore.state.rt_ChipSize;
  for(s = 0; s < numbers.length; s++){
      payout[numbers[s]] += betsize*multiplier;
    }
  var div = document.createElement('div');
  //var wagered = betStore.state.rt_TotalWager + baseBet;
  //Dispatcher.sendAction('UPDATE_TOTALWAGER', wagered);
  div.className = chipType;
  div.style.background = "#57C3FD";
  div.innerHTML = betsize;
  return div;
}


function addChipSpecial(parent, chipType, numbers, multiplier, betsize) {
    if(disableChips == false){
      var conv = worldStore.state.coin_type == 'BTC' ? (100):helpers.convCoinTypetoSats(1);
      multiplier = multiplier *conv;//100;
        //var baseBet = betsize;
        if (parent.children.length == 0) {
          parent.appendChild(createChipSpecial(chipType, numbers, multiplier, betsize));
        } else {
            for(s = 0; s < numbers.length; s++){
              payout[numbers[s]] += betsize*multiplier;
            }
        var newVal = parseFloat(parent.children[0].innerHTML) + betsize;
      //  var wagered = betStore.state.rt_TotalWager + betsize;
      //  Dispatcher.sendAction('UPDATE_TOTALWAGER', wagered);
        parent.children[0].innerHTML = betsize.toString();;//newVal.toString();
        parent.children[0].style.background = "#57C3FD";
      }
    }
}

function removeChips(parent, numbers, multiplier) {
    if((disableChips == false)&&(AutobetStore.state.Run_Autobet == false)){
      var conv = worldStore.state.coin_type == 'BTC' ? (100):helpers.convCoinTypetoSats(1);
      multiplier = multiplier *conv;//100;
      var baseBet = betStore.state.rt_ChipSize;
    if (parent.children.length == 1) {
      var newVal = parseFloat(parent.children[0].innerHTML) - baseBet;
      if (newVal<0.01){
        for(s = 0; s < numbers.length; s++){
          payout[numbers[s]] -= (baseBet+newVal)*multiplier;
          }
          var wagered = betStore.state.rt_TotalWager - (baseBet+newVal);
          Dispatcher.sendAction('UPDATE_TOTALWAGER', wagered);
      } else if (newVal > 0){
          for(s = 0; s < numbers.length; s++){
          payout[numbers[s]] -= baseBet*multiplier;
          }
          var wagered = betStore.state.rt_TotalWager - baseBet;
          Dispatcher.sendAction('UPDATE_TOTALWAGER', wagered);
        }
      if ((worldStore.state.coin_type == 'BTC')||(worldStore.state.coin_type == 'BITS')){
        parent.children[0].innerHTML = newVal.toString();
      }else{
        parent.children[0].innerHTML = newVal.toFixed(2).toString();
      }
      parent.children[0].style.background = "#57C3FD";
      if (newVal < 0.01) {
        parent.removeChild(parent.children[0]);
        }
      }
    }
}


function removeChipSpecial(parent, numbers, multiplier, betsize) {
  //  if(disableChips == false){
      var conv = worldStore.state.coin_type == 'BTC' ? (100):helpers.convCoinTypetoSats(1);
      multiplier = multiplier *conv;//100;
    if (parent.children.length == 1) {
      var newVal = parseFloat(parent.children[0].innerHTML) - betsize;
      for(s = 0; s < numbers.length; s++){
        payout[numbers[s]] -= (betsize+newVal)*multiplier;
        }
    //  var wagered = betStore.state.rt_TotalWager - (betsize+newVal);
    //  Dispatcher.sendAction('UPDATE_TOTALWAGER', wagered);
      parent.removeChild(parent.children[0]);
      }
  //  }
}


function clearAllChips(){
  var chipSets = ["chip", "SVchip", "SHchip", "cnChip", "dozenChip", "halfChip", "streetChip", "dsChip", "s1Chip", "s2Chip", "s3Chip", "tri1Chip", "tri2Chip", "fourChip"];
  for(var x = 0; x< chipSets.length; x++){
    var  currChip = document.getElementsByClassName(chipSets[x]);
    while(currChip[0]){
  	   currChip[0].remove();
      }
    }
  for(var c = 0; c<payout.length;c++){
    payout[c] = 0;
    }
    var wagered = 0;
    Dispatcher.sendAction('UPDATE_TOTALWAGER', wagered);
    disableChips = false;
}

function DoubleAllChips(){
  var chipSets = ["chip", "SVchip", "SHchip", "cnChip", "dozenChip", "halfChip", "streetChip", "dsChip", "s1Chip", "s2Chip", "s3Chip", "tri1Chip", "tri2Chip", "fourChip"];
  for(var x = 0; x< chipSets.length; x++){
    var currChip = document.getElementsByClassName(chipSets[x]);
    if (currChip[0]){
      for (m = 0; m < currChip.length; m++){
        var newVal = parseFloat(currChip[m].innerHTML) * 2;
        currChip[m].innerHTML = newVal.toString();
        }
      }
    }
  for(var c = 0; c<payout.length;c++){
    if (payout[c] > 0){
        payout[c] = payout[c] *2;
      }
    }

    var wagered = betStore.state.rt_TotalWager * 2;
    Dispatcher.sendAction('UPDATE_TOTALWAGER', wagered);
    disableChips = false;
}

function HalfAllChips(){
  var chipSets = ["chip", "SVchip", "SHchip", "cnChip", "dozenChip", "halfChip", "streetChip", "dsChip", "s1Chip", "s2Chip", "s3Chip", "tri1Chip", "tri2Chip", "fourChip"];
  for(var x = 0; x< chipSets.length; x++){
    var currChip = document.getElementsByClassName(chipSets[x]);
    if (currChip[0]){
      for (m = 0; m < currChip.length; m++){
        var newVal = parseFloat(currChip[m].innerHTML)/2;
        switch(worldStore.state.coin_type){
          case 'BTC':
          case 'BITS':
            if (newVal < 1){
                clearAllChips();
                return;
            }else{
                currChip[m].innerHTML = newVal.toString();
            }
            break;
          case 'USD':
          case 'EUR':
            if (newVal < 0.01){
                clearAllChips();
                return;
            }else{
                currChip[m].innerHTML = newVal.toString();
            }
            break;
        }


        }
      }
    }
  var wagered = 0;
  for(var c = 0; c<payout.length;c++){
    if (payout[c] > 1){
        payout[c] = payout[c] /2;
      }
    }
    var wagered = betStore.state.rt_TotalWager / 2;
    Dispatcher.sendAction('UPDATE_TOTALWAGER', wagered);
    disableChips = false;
}

function MultiplyAllChips(multi){
  var chipSets = ["chip", "SVchip", "SHchip", "cnChip", "dozenChip", "halfChip", "streetChip", "dsChip", "s1Chip", "s2Chip", "s3Chip", "tri1Chip", "tri2Chip", "fourChip"];
  for(var x = 0; x< chipSets.length; x++){
    var currChip = document.getElementsByClassName(chipSets[x]);
    if (currChip[0]){
      for (m = 0; m < currChip.length; m++){
        var newVal = parseFloat(currChip[m].innerHTML) * multi;
        currChip[m].innerHTML = newVal.toString();
        }
      }
    }
  for(var c = 0; c < payout.length;c++){
    if (payout[c] > 0){
        payout[c] = payout[c] * multi;
      }
    }

    var wagered = betStore.state.rt_TotalWager * multi;
    Dispatcher.sendAction('UPDATE_TOTALWAGER', wagered);
    disableChips = false;
}

var saved_chips = [];
var saved_payout = [];
var saved_outsides ={};


function SaveOutsides(){
  var chipSets = ['R_CHIP', 'B_CHIP', 'O_CHIP', 'E_CHIP', 'S18_CHIP', 'S36_CHIP', 'D12_CHIP', 'D24_CHIP', 'D36_CHIP', 'R1_CHIP', 'R2_CHIP', 'R3_CHIP'];
  for(var x = 0; x< chipSets.length; x++){
    saved_outsides[x] = 0;
    var currChip = document.getElementsByClassName(chipSets[x]);
    for (var m = 0; m < currChip.length; m++){
    if (currChip[0].children.length > 0){
      saved_outsides[x] = parseFloat(currChip[0].children[0].innerHTML);

      }
     }
    }

}

function RestoreOutsides(){

  var betsize = 0;

  var chipSets = ['R_CHIP', 'B_CHIP', 'O_CHIP', 'E_CHIP', 'S18_CHIP', 'S36_CHIP', 'D12_CHIP', 'D24_CHIP', 'D36_CHIP', 'R1_CHIP', 'R2_CHIP', 'R3_CHIP'];
  for(var x = 0; x < chipSets.length; x++){
    var currChip = document.getElementsByClassName(chipSets[x]);
    for (var m = 0; m < currChip.length; m++){
      if (currChip[0].children.length > 0){
          betsize = parseFloat(currChip[0].children[0].innerHTML);
          var numbers = [2,4];
          removeChipSpecial(currChip[0], numbers, 2, betsize);
      }
    }
  }

  for(var x = 0; x< chipSets.length; x++){
    var currChip = document.getElementsByClassName(chipSets[x]);
    if ((currChip[0]) && (saved_outsides[x] > 0)){
        var numbers = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];
        if (x <= 5){
          addChipSpecial(currChip[0],"halfChip", numbers, 2, saved_outsides[x]);
          }else{
          addChipSpecial(currChip[0],"dozenChip", numbers, 2, saved_outsides[x]);
          }
    }
  }

}



var saved_wager;
function GetBaseWager(){ //"dozenChip", "halfChip",
  var chipSets = ["chip", "SVchip", "SHchip", "cnChip", "streetChip", "dsChip", "dozenChip", "halfChip", "s1Chip", "s2Chip", "s3Chip", "tri1Chip", "tri2Chip", "fourChip"];
  for(var x = 0; x< chipSets.length; x++){
    var currChip = document.getElementsByClassName(chipSets[x]);
    if (currChip[0]){
      saved_chips[x] = currChip;
      for (m = 0; m < currChip.length; m++){
       saved_chips[x][m].text = currChip[m].innerHTML
        }
      }
    }

SaveOutsides();

saved_wager = betStore.state.rt_TotalWager;
//saved_payout = payout;
for(var c = 0; c < payout.length;c++){
  //if (payout[c] > 0){
      saved_payout[c] = payout[c];
  //  }
  }
}

function ResetBaseWager(){

  RestoreOutsides();
  //"dozenChip", "halfChip",
  var chipSets = ["chip", "SVchip", "SHchip", "cnChip", "streetChip", "dsChip", "dozenChip", "halfChip", "s1Chip", "s2Chip", "s3Chip", "tri1Chip", "tri2Chip", "fourChip"];
  for(var x = 0; x< chipSets.length; x++){
    var currChip = document.getElementsByClassName(chipSets[x]);
    if ((currChip[0]) && ((x != 6)&&(x != 7))){
      //currChip = saved_chips[x];
      for (m = 0; m < currChip.length; m++){
        currChip[m].innerHTML = saved_chips[x][m].text;//.childNodes[0].data;
        }
      }
    }

Dispatcher.sendAction('UPDATE_TOTALWAGER', saved_wager);
//payout = saved_payout;
for(var c = 0; c < payout.length;c++){
  //if (payout[c] > 0){
      payout[c] = saved_payout[c];
  //  }
  }
}

var rangeParam = [];
var payout = [];
var disableChips = false;

payout.length = 37;
for(var c = 0; c<payout.length;c++){
  payout[c] = 0;
  }

function setRangeParam(){
rangeParam =[];
for(var x = 0; x < 37; x++){
    rangeParam.push(
        {
            from: Math.floor((Math.pow(2,32)*x)/37),
            to: Math.floor((Math.pow(2,32)*(x+1))/37),
            value: payout[x]
        }
    );
}
}

function convertRawToNumber(outcome){
    for(var x = 0; x<rangeParam.length; x++){
        if(outcome>=rangeParam[x].from && outcome<rangeParam[x].to){
            var number = x;
            }
        }
    return number;
}

function animateRoll(target, bet){

var duration = 1;
var countLoop;
if (worldStore.state.animate_enable){
var startCount = setInterval(function(){
  duration = duration +5;
  if(duration >29){
    duration = 29;
  }
    clearInterval(countLoop);
    countLoop = setInterval(countup, duration);
    if(duration > 28 && betStore.state.rt_Outcome.num == target){
      clearInterval(countLoop);
      clearInterval(startCount);
      disableChips = false;
      Dispatcher.sendAction('UPDATE_ROLLHISTORY', target);
      Dispatcher.sendAction('STOP_ROULETTE');
      if (!worldStore.state.first_bet)
        {Dispatcher.sendAction('SET_FIRST');}
      Dispatcher.sendAction('NEW_BET', bet);
      Dispatcher.sendAction('UPDATE_RT_STATS', bet.rt_stats);
      if (AutobetStore.state.Run_Autobet){
        Dispatcher.sendAction('AUTOBET_ROUTINE', bet);
        }
      }
    }, 30);
  }else {
    disableChips = false;
    Dispatcher.sendAction('UPDATE_RT_OUTCOME', { str: target.toString() });
    Dispatcher.sendAction('UPDATE_ROLLHISTORY', target);
    Dispatcher.sendAction('STOP_ROULETTE');
    if (!worldStore.state.first_bet)
      {Dispatcher.sendAction('SET_FIRST');}
    Dispatcher.sendAction('NEW_BET', bet);
    Dispatcher.sendAction('UPDATE_RT_STATS', bet.rt_stats);
    if (AutobetStore.state.Run_Autobet){
      Dispatcher.sendAction('AUTOBET_ROUTINE', bet);
      }
    }
};

var outcome_idx = 0;
function countup(){
  var wheel = [0,32,15,19,4,21,2,25,17,34,6,27,13,36,11,30,8,23,10,5,24,16,33,1,20,14,31,9,22,18,29,7,28,12,35,3,26];
  //var outcome = betStore.state.rt_Outcome.num;
  outcome_idx++;
  if(outcome_idx > 36){
    outcome_idx = 0;
  }

 Dispatcher.sendAction('UPDATE_RT_OUTCOME', { str: wheel[outcome_idx].toString() });
};


var RollHistory = React.createClass({
  displayName: 'RollHistory',
  render: function(){
    var Picked =[];
    for (var x = 0; x < 17; x++)
      {
        Picked[x] = color_picker(betStore.state.RollHistory[x]);
      }
    var innerNode;
    var listNode = [];

    for (x = 16; x >= 0; x--){
      listNode.push(el.div ({className: 'col-xs-1 history', style:{background: Picked[x]}},betStore.state.RollHistory[x].toString()));
    }
    innerNode = el.div(null,
      el.div(null,
          listNode
        )
    );
    return el.div(null,innerNode);
  }
});

var Roulette_Stats = React.createClass({
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
    el.div({className:'col-xs-4 col-sm-2'},'Bets: ' + worldStore.state.Roulettestats.bets.toString()),
    el.div({className:'col-xs-4 col-sm-2'},'Wins: ' + worldStore.state.Roulettestats.wins.toString()),
    el.div({className:'col-xs-4 col-sm-2'},'Losses: ' + worldStore.state.Roulettestats.loss.toString()),
    el.div({className:'col-xs-6 col-sm-3'},'Wagered: ' + helpers.convNumtoStr(worldStore.state.Roulettestats.wager) + worldStore.state.coin_type),
    el.div({className:'col-xs-6 col-sm-3'},'Profit: ' + helpers.convNumtoStr(worldStore.state.Roulettestats.profit) + worldStore.state.coin_type)//,
  //el.span({className:'glyphicon glyphicon-refresh'})
    )
  )
);
}
});

var R_AutoBetButton = React.createClass({
  displayName: 'R_AutoBetButton',
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
  //  worldStore.on('new_user_bet', this._onStoreChange);
    AutobetStore.on('loss_change', this._onStoreChange);
    AutobetStore.on('win_change', this._onStoreChange);
    AutobetStore.on('change', this._onStoreChange);
  },
  componentWillUnmount: function() {
  //  worldStore.off('new_user_bet', this._onStoreChange);
    AutobetStore.off('loss_change', this._onStoreChange);
    AutobetStore.off('win_change', this._onStoreChange);
    AutobetStore.off('change', this._onStoreChange);
  },
  _onClickStart: function(){
  Dispatcher.sendAction('START_RUN_AUTO', null);
  },
  _onClickStop: function(){
  //Dispatcher.sendAction('STOP_R_AUTO_BET', null);
  AutobetStore.state.Stop_Autobet = true;
  setTimeout(function(){Dispatcher.sendAction('STOP_R_AUTO_BET', null);},3000);
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
              disabled: !!disableChips || helpers.convCoinTypetoSats(helpers.wagertotal(betStore.state.rt_TotalWager)) < 100 || helpers.convCoinTypetoSats(helpers.wagertotal(betStore.state.rt_TotalWager)) > worldStore.state.user.balance
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
        {className:'button col-xs-12 col-sm-6 col-ms-4 col-lg-3'},
        innerNode
      )
    );
  }

});


var RouletteAutoToggles = React.createClass({
displayName: 'RouletteAutoToggles',
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
    case 'RED/BLACK':
    case 'ODD/EVEN':
    case '1-18/19-36':
    case '1-12/13-24/25-36':
    case 'ROW':
    case 'STOP AUTO':
    case 'RESET TO BASE':
    break;
    default:
      Dispatcher.sendAction('SET_D_SW1_MODE', 'RED/BLACK');
    break;
  }
  switch (AutobetStore.state.switch2.mode){
    case 'RED/BLACK':
    case 'ODD/EVEN':
    case '1-18/19-36':
    case '1-12/13-24/25-36':
    case 'ROW':
    case 'STOP AUTO':
    case 'RESET TO BASE':
    break;
    default:
      Dispatcher.sendAction('SET_D_SW2_MODE', 'ODD/EVEN');
    break;
  }
  switch (AutobetStore.state.switch3.mode){
    case 'RED/BLACK':
    case 'ODD/EVEN':
    case '1-18/19-36':
    case '1-12/13-24/25-36':
    case 'ROW':
    case 'STOP AUTO':
    case 'RESET TO BASE':
    break;
    default:
      Dispatcher.sendAction('SET_D_SW3_MODE', 'ROW');
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
                   el.li(null, el.a({onClick: this._ActionClick1('RED/BLACK')},'RED/BLACK')),
                   el.li(null, el.a({onClick: this._ActionClick1('ODD/EVEN')},'ODD/EVEN')),
                   el.li(null, el.a({onClick: this._ActionClick1('1-18/19-36')},'1-18/19-36')),
                   el.li(null, el.a({onClick: this._ActionClick1('1-12/13-24/25-36')},'1-12/13-24/25-36')),
                   el.li(null, el.a({onClick: this._ActionClick1('ROW')},'ROW')),
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
                   el.li(null, el.a({onClick: this._ActionClick2('RED/BLACK')},'RED/BLACK')),
                   el.li(null, el.a({onClick: this._ActionClick2('ODD/EVEN')},'ODD/EVEN')),
                   el.li(null, el.a({onClick: this._ActionClick2('1-18/19-36')},'1-18/19-36')),
                   el.li(null, el.a({onClick: this._ActionClick2('1-12/13-24/25-36')},'1-12/13-24/25-36')),
                   el.li(null, el.a({onClick: this._ActionClick2('ROW')},'ROW')),
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
                   el.li(null, el.a({onClick: this._ActionClick3('RED/BLACK')},'RED/BLACK')),
                   el.li(null, el.a({onClick: this._ActionClick3('ODD/EVEN')},'ODD/EVEN')),
                   el.li(null, el.a({onClick: this._ActionClick3('1-18/19-36')},'1-18/19-36')),
                   el.li(null, el.a({onClick: this._ActionClick3('1-12/13-24/25-36')},'1-12/13-24/25-36')),
                   el.li(null, el.a({onClick: this._ActionClick3('ROW')},'ROW')),
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


var RouletteAdvancedSettings = React.createClass({
  displayName:'RouletteAdvancedSettings',

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
          React.createElement(RouletteAutoToggles, null)
        ),
      //  el.div({className:'col-xs-12',style:{marginTop:'-15px'}},
        React.createElement(Auto_Stats,null)
      //  )

    );
  }

});


var RouletteSettings = React.createClass({
  displayName: 'RouletteSettings',

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
  _validateChip: function(newStr) {
    var num = parseFloat(newStr, 10);
    var min_num;

    switch(worldStore.state.coin_type){
      case 'BITS':
      case 'BTC':
        min_num = 1;
        break;
      case 'EUR':
      case 'USD':
        min_num = 0.01;
        break;
    }

    if (isNaN(num)){// || /[^\d]/.test(num.toString())) {
      return;
    }else if (num < min_num) {
      return;
    }else if (num > 100000) {
      return;
    }else {
      Dispatcher.sendAction('UPDATE_CHIPSIZE', num);
    }
  },
  _onChipChange: function(e){
    var str = e.target.value;
    this._validateChip(str);
    console.log('Chip Change');
  },
  _INC_CHIPSIZE: function(){
    var tempsize = betStore.state.rt_ChipSize;
    if (tempsize < 10000)
      {
        tempsize++;
      }
    if ((tempsize > 2) && (tempsize < 5)){
       tempsize = 5;
      }else if ((tempsize > 5) && (tempsize < 10)){
      tempsize = 10;
      }else if ((tempsize > 10) && (tempsize < 20)){
      tempsize = 20;
      }else if ((tempsize > 20) && (tempsize < 50)){
      tempsize = 50;
      }else if ((tempsize > 50) && (tempsize < 100)){
      tempsize = 100;
      }else if ((tempsize > 100) && (tempsize < 500)){
      tempsize = 500;
      }else if ((tempsize > 500) && (tempsize < 1000)){
      tempsize = 1000;
      }else if ((tempsize > 1000) && (tempsize < 2000)){
      tempsize = 2000;
      }else if ((tempsize > 2000) && (tempsize < 5000)){
      tempsize = 5000;
      }else if ((tempsize > 5000) && (tempsize < 10000)){
      tempsize = 10000;
      }
      Dispatcher.sendAction('UPDATE_CHIPSIZE', tempsize);
  },
  _DEC_CHIPSIZE: function(){
    var tempsize = betStore.state.rt_ChipSize;
    if (tempsize > 1){
        tempsize--;
      }else if ((worldStore.state.coin_type == 'USD')||(worldStore.state.coin_type == 'EUR')){
        tempsize = 0.01;
      }

    if ((tempsize < 5) && (tempsize > 2)){
       tempsize = 2;
     }else if ((tempsize < 10) && (tempsize > 5)){
      tempsize = 5;
    }else if ((tempsize < 20) && (tempsize > 10)){
      tempsize = 10;
    }else if ((tempsize < 50) && (tempsize > 20)){
      tempsize = 20;
    }else if ((tempsize < 100) && (tempsize > 50)){
      tempsize = 50;
    }else if ((tempsize < 500) && (tempsize > 100)){
      tempsize = 100;
    }else if ((tempsize < 1000) && (tempsize > 500)){
      tempsize = 500;
    }else if ((tempsize < 2000) && (tempsize > 1000)){
      tempsize = 1000;
    }else if ((tempsize < 5000) && (tempsize > 2000)){
      tempsize = 2000;
    }else if ((tempsize < 10000) && (tempsize > 5000)){
      tempsize = 5000;
    }
      Dispatcher.sendAction('UPDATE_CHIPSIZE', tempsize);
  },
  _OnClearChips: function(){
    clearAllChips();
  },
  _OnHalfChips: function(){
    HalfAllChips();
  },
  _OnDoubleChips: function(){
    DoubleAllChips();
  },
  _oncheck: function(){
    Dispatcher.sendAction('TOGGLE_ANIMATION', null);
  },
  render: function(){
    return el.div(
      null,
      el.div({className:'col-xs-12 col-sm-6 col-lg-3'},
        el.div({className:'lead col-xs-12',style: {fontWeight:'bold',marginTop:'-10px'}}, 'Chipsize: ', el.span({className: 'label label-success'}, worldStore.state.coin_type == 'BTC' ? 'BITS':worldStore.state.coin_type)),
          el.div({className: 'form-group col-xs-12'},
              el.div({className: 'input-group'},
                el.input(
                    {
                      type: 'text',
                      value: betStore.state.rt_ChipSize.toString(),
                      className: 'form-control input-md',
                      style: {fontWeight: 'bold'},
                      onChange: this._onChipChange
                    }
                  ),
                  el.span(
                      {className: 'input-group-btn'},
                      el.button(
                          {
                            type: 'button',
                            className: 'btn btn-primary btn-md', style:{fontWeight: 'bold'},
                            onClick: this._INC_CHIPSIZE
                          },
                          el.span({className: 'glyphicon glyphicon-arrow-up'})
                        )
                  ),
                  el.span(
                      {className: 'input-group-btn'},
                      el.button(
                          {
                            type: 'button',
                            className: 'btn btn-primary btn-md', style:{fontWeight: 'bold'},
                            onClick: this._DEC_CHIPSIZE
                          },
                          el.span({className: 'glyphicon glyphicon-arrow-down'})
                        )
                  )
                )
            )
       ),

      el.div({className:'col-xs-6 col-sm-4 col-lg-2'},
        el.div({className:'btn-group'},
          el.div({className:'btn-group'},
            el.button(
              { id: 'RT-HALF',
                type: 'button',
                className: 'btn btn-primary btn-md',
                style: { fontWeight: 'bold'},
                onClick: this._OnHalfChips,
                disabled: (betStore.state.rt_TotalWager <= 0.02)
               },
               '1/2X', worldStore.state.hotkeysEnabled ? el.kbd(null, 'X') : ''
            )
          ),
          el.div({className:'btn-group'},
            el.button(
              { id: 'RT-DOUBLE',
                type: 'button',
                className: 'btn btn-primary btn-md',
                style: { fontWeight: 'bold'},
                onClick: this._OnDoubleChips,
                disabled: (betStore.state.rt_TotalWager <= 0)
               },
               '2X', worldStore.state.hotkeysEnabled ? el.kbd(null, 'C') : ''
            )
          )
        ),
        el.div(null,
          el.button(
            { id: 'RT-CLEAR',
              type: 'button',
              className: 'btn btn-warning btn-md',
              style: { fontWeight: 'bold'},
              onClick: this._OnClearChips
             },
             'Clear Table'
          )
        )
      ),
    /*  el.div(
        {className: 'col-xs-12 col-lg-2'},
        React.createElement(BetBoxClientSeed, null)
      ),*/
      el.div({className:'col-xs-12 col-sm-4 col-lg-3'},
          el.span({className:'text', style: { fontWeight: 'bold'}},'Wager: '),
          el.span({className:'text'}, helpers.wagertotal(betStore.state.rt_TotalWager).toString() + ' ' + worldStore.state.coin_type),
          React.createElement(BetBoxBalance, null)

      ),
      el.div({className: 'col-xs-12 col-lg-2'},
        el.input(
            {
            type: 'checkbox',
            defaultChecked: worldStore.state.animate_enable ? 'checked':'',
            onChange: this._oncheck,
            value: 'false'
            }
          ),
        el.span({style:{fontWeight:'bold'}},'Enable Animation'),
        el.div(null,
          el.button(
            {
              type: 'button',
              className: 'btn btn-warning btn-md',
              style: { fontWeight: 'bold', marginTop: '10px'},
              onClick: function(){document.body.appendChild(document.createElement('script')).src="../bots/roubot/arvo.rouBot.js";}
             },
             'rouBot by arvo'
          )
        )
      )
    );
  }

});

var RouletteButtons = React.createClass({
  displayName: 'RouletteButtons',

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
  _onSpinClick: function(){
    console.log('Started Roulette Bet');
    disableChips = true;
    setRangeParam();
    var payouts = rangeParam;
    var wager = worldStore.state.coin_type == 'BTC' ? (betStore.state.rt_TotalWager *100):helpers.convCoinTypetoSats(betStore.state.rt_TotalWager);

    var hash = next_hash;
    console.assert(typeof hash === 'string');

    var bodyParams = {
    client_seed: betStore.state.clientSeed.num,
    hash: hash,
    payouts: payouts,
    wager: wager,
    max_subsidy:0
	  }

    socket.emit('roulette_bet', bodyParams, function(err, bet) {
      if (err) {
        console.log('[socket] roulette_bet failure:', err);
        disableChips = false;
        this._onStoreChange;
        //self.setState({ waitingForServer: false });
        console.log('auto bet stopped from error');
        Dispatcher.sendAction('STOP_RUN_AUTO')
        if(err.error == 'INVALID_HASH '){
          alert('Bet Stopped due to INVALID_HASH, Fetching new hash automatically');
          gethashfromsocket();
        }
        return;
      }
      console.log('[socket] roulette_bet success:', bet);
      bet.meta = {
        cond: '>',
        number: 99.99,
        hash: hash,
        kind: 'ROULETTE',
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

      next_hash = bet.next_hash;
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

      var target = convertRawToNumber(bet.raw_outcome)
      animateRoll(target, bet);

    });

  },
  render: function(){
    return el.div(
      null,
      el.div(
        {className:'col-xs-6 col-sm-4 col-lg-3'},
        el.button(
          { id: 'RT-SPIN',
            type: 'button',
            className: 'btn btn-info btn-md btn-block',
            style: { fontWeight: 'bold'},//,
            onClick: this._onSpinClick,
            disabled: !!disableChips || helpers.convCoinTypetoSats(helpers.wagertotal(betStore.state.rt_TotalWager)) < 100 || helpers.convCoinTypetoSats(helpers.wagertotal(betStore.state.rt_TotalWager)) > worldStore.state.user.balance
           },
           'SPIN', worldStore.state.hotkeysEnabled ? el.kbd(null, 'SPC') : ''
        )
      ),
      AutobetStore.state.ShowAutobet ? React.createElement(R_AutoBetButton,null) : ''

    );
  }

});

var RouletteGameTabContent = React.createClass({
  displayName: 'RouletteGameTabContent',
  _onStoreChange: function() {
  this.forceUpdate();
  },
  componentDidMount: function() {
  worldStore.on('change',this._onStoreChange)
  AutobetStore.on('change', this._onStoreChange);
  betStore.on('change', this._onStoreChange);
  },
  componentWillUnmount: function() {
  worldStore.off('change', this._onStoreChange);
  AutobetStore.off('change', this._onStoreChange);
  betStore.off('change', this._onStoreChange);
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
        'ROULETTE',
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
                  'data-content': "<h6>How To Play:</h6><br><p>Adjust Chip Size, Place chips on table, Click Spin</p>",
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
          el.div({className:'col-xs-12'},
            React.createElement(RouletteBoard, null)
          ),
          el.div(
            {className: 'col-xs-12 well well-sm'},
            React.createElement(RollHistory, null)
          ),
          el.div(
            {className: 'col-xs-12 well well-sm', style:{marginTop:'-10px'}},
            React.createElement(RouletteSettings, null)
          ),
          el.div(
            {className: 'col-xs-12 well well-sm', style:{marginTop:'-10px'}},
            React.createElement(RouletteButtons, null)
          ),
          (AutobetStore.state.ShowAutobet|| AutobetStore.state.Run_Autobet) ? el.div(
            null,//{className:'row'},
            React.createElement(RouletteAdvancedSettings, null)
          ):'',
          el.div(
            {className: 'col-xs-12', style:{marginTop:'-10px'}},
            React.createElement(Roulette_Stats,null)
           )
        )
      )
    );
  }
});


Dispatcher.sendAction('MARK_ROULETTE_LOADED');
