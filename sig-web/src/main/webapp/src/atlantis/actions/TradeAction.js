if (dwr == null) var dwr = {};
if (dwr.engine == null) dwr.engine = {};
if (DWREngine == null) var DWREngine = dwr.engine;

if (TradeAction == null) var TradeAction = {};
TradeAction._path = '../../dwr';

//Cust
TradeAction.getTrades = function(callback) {
  dwr.engine._execute(TradeAction._path, 'TradeAction', 'getTrades', callback);
};
