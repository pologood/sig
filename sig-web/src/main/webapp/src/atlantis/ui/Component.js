/*
 * 通用控件
 * 
 * calendar.js为1.3版本之前所用，更改控件的同时修改请求参数
 * 此脚本改为mis的方式，即查询时通过控件获取请求参数
 * 
 * @author : liangxiao
 * @date   : 2012
 */

Atlantis.Component = {};

Atlantis.Component.initEsui = function(view, json) {
    if (json.monthData) {
        var monthData = []; //月的datasource
        $.each(json.monthData.split(","), function(index, val) {
            monthData.push({
                name: val,
                value: parseInt(val)
            });
        });
    }
    
    var logicData = [
        {name:'＞', value: 1},
        {name:'＜', value: 2},
        {name:'＝', value: 3},
        {name:'≥', value: 4},
        {name:'≤', value: 5}
    ];
    
    esui.init(view.el, {
        /*
         * 按日按月
         */
		DM: {
			datasource: [
                {name:'按日', value: 1},
                {name:'按月', value: 3}
            ],
			value: !json.type ? 3 : json.type
		},
		DayOfDM: {
			range: {
				begin: Util.date.BEGINING,
				end: Util.date.yesterday()
			},
			value: !json.date ? Util.date.yesterdayString() : json.date
		},
		YearOfDM: {
			datasource: Atlantis.Calendar.year,
			value: !json.year
                   ? Atlantis.Calendar.year[Atlantis.Calendar.year.length - 1].value //本月
                   : json.year
		},
		MonthOfDM: {
			datasource: !json.monthData ? Atlantis.Calendar.monthOfThisYear : monthData,
			value: !json.month
                   ? Atlantis.Calendar.monthOfThisYear[Atlantis.Calendar.monthOfThisYear.length - 1].value //本月
                   : json.month
		},
		//客户
		ClientOverView: {
			datasource: [
                {name:'客户ID', value: 1},
                {name:'客户名称', value: 2},
                {name:'客户账号', value: 5},
                {name:'关联客服', value: 3}
            ],
			value: 2
		},
		//达标
		StandardSelect: {
			datasource: [
                {name:'不限制', value: 0},
                {name:'达标 ', value: 1},
                {name:'不达标 ', value: -1}
            ],
			value: !json.std ? 0 : json.std
		},
		//撞线
		OutSelect: {
            datasource: [
                {name:'不限制', value: 0},
                {name:'是 ', value: -1},
                {name:'否 ', value: 1}
            ],
            value: 0
        },
        //逻辑符号
		LogicSelect1: {
			datasource: logicData,
			value: 1
		},
		LogicSelect2: {
			datasource: logicData,
			value: 1
		},
		LogicSelect3: {
			datasource: logicData,
			value: 1
		},
		LogicSelect4: {
			datasource: logicData,
			value: 1
		},
		LogicSelect5: {
			datasource: logicData,
			value: 1
		},
		//页码
		PageSize: {
            datasource: [
                {name:'20', value: 20},
                {name:'50', value: 50},
                {name:'100', value: 100}
            ],
            value: 20
        }
    });
};

Atlantis.Component.initElement = function(view, json) {
    /*
     * 按日按月
     */
    if (esui.get("DM")) {
        if (json.type) {
            view.setCtrl(json.type);
        }
    }
};

Atlantis.Component.bindEsui = function(view) {
    /*
     * 按日按月
     */
    if (esui.get("DM")) {
        esui.get("DM").onchange = function(value, item) {
            view.setCtrl(value);
        };
    	esui.get("DayOfDM").onchange = function(date) {
    		esui.get("DayOfDM").setValueAsDate(date);
    	};
    	esui.get("YearOfDM").onchange = function(value, item) {
    		var month = esui.get("MonthOfDM");
    		var list = Util.date.getMonthList(value);
    		month.datasource = list;
    		month.value = list[list.length - 1].value;
    		month.render();
    	};
	}
	
	//页码
	if (esui.get("PageSize")) {
    	esui.get("PageSize").onchange = function(value, item) {
            view.lastArgs.pageSize = value;
            view.lastArgs.pageNo = 1;
            view.pageRendered = false;
            view.query(view.lastArgs);
        };
        esui.get("PageNo").onchange = function(page) {
            view.lastArgs.pageNo = page + 1;
            view.query(view.lastArgs);
        };
    }
};

/*
 * 初始化控件
 * @param view {Object}  View的实例
 * @param query {String} 页面跳转参数
 */
Atlantis.Component.init = function(view, query) {
    var json = T.url.queryToJson(typeof query == "undefined" ? "" : decodeURIComponent(query));
    Atlantis.Component.initEsui(view, json);
    Atlantis.Component.initElement(view, json);
    Atlantis.Component.bindEsui(view);
};
