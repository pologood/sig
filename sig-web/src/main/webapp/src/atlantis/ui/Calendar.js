/*
 * 日历的初始化
 * @author : liangxiao
 * @date   : 2012
 */

Agent.Calendar = {
    thisMonth: (new Date()).getMonth(),
    year: Util.date.getYearList(),
    yearWithout2011: Util.date.getYearList(),
    monthOfThisYear: Util.date.getMonthList((new Date()).getFullYear()),
    monthOfLastYear: Util.date.getMonthList((new Date()).getFullYear() - 1),
    quarterOfThisYear: Util.date.getQuarterList((new Date()).getFullYear()),
    quarterOfLastYear: Util.date.getQuarterList((new Date()).getFullYear() - 1)
};
Agent.Calendar.yearWithout2011.shift(); //2011年波动本期不可选第四季度
Agent.Calendar.lastYearOfMonthSelect = Agent.Calendar.thisMonth == 0
? Agent.Calendar.year[Agent.Calendar.year.length - 2].value   //1月选去年
: Agent.Calendar.year[Agent.Calendar.year.length - 1].value; //否则选本年
Agent.Calendar.lastMonthOfMonthSelect = Agent.Calendar.thisMonth == 0 ? 12 //1月选12月
: Agent.Calendar.monthOfThisYear[Agent.Calendar.monthOfThisYear.length - 2].value; //否则选上月
Agent.Calendar.lastYearOfQSelect = (Agent.Calendar.thisMonth == 0 || Agent.Calendar.thisMonth == 1 || Agent.Calendar.thisMonth == 2)
? Agent.Calendar.yearWithout2011[Agent.Calendar.yearWithout2011.length - 2].value //1-3月选去年
: Agent.Calendar.yearWithout2011[Agent.Calendar.yearWithout2011.length - 1].value;//否则选本年
Agent.Calendar.lastQOfQSelect = (Agent.Calendar.thisMonth == 0 || Agent.Calendar.thisMonth == 1 || Agent.Calendar.thisMonth == 2) ? 4 //1-3月选第四季度
: Agent.Calendar.quarterOfThisYear[Agent.Calendar.quarterOfThisYear.length - 2].value; //否则选上季度

/*
 * 初始化周/月参数(整体)
 */
Agent.Calendar.initOverviewOfWM = function(view, start) {
    view.overviewArgsOfWM = {
        time: {
            type: 2, //周
            start: start == "current"
                   ? Util.date.curWeek(Util.date.yesterday())[0] //本周一
                   : Util.date.curWeek(Util.date.lastWeek())[0], //上周一
            end: start == "current"
                 ? Util.date.curWeek(Util.date.yesterday())[1]   //本周日
                 : Util.date.curWeek(Util.date.lastWeek())[1],   //上周日
            year: start == "current"
                  ? Agent.Calendar.year[Agent.Calendar.year.length - 1].value //本年
                  : Agent.Calendar.lastYearOfMonthSelect,
            month: start == "current"
                   ? Agent.Calendar.monthOfThisYear[Agent.Calendar.monthOfThisYear.length - 1].value //本月
                   : Agent.Calendar.lastMonthOfMonthSelect
        },
        curAddExistDate: null,
        lastAddExistDate: null,
        product: 1,
        pageSize: 20,
        pageNo: 1
    };
    if ($("#ctrlcalThisDuration1")) {
        view.overviewArgsOfWM.curAddExistDate = Util.date.firstDayOfQuarterByMonth(view.overviewArgsOfWM.time.year, view.overviewArgsOfWM.time.month);
    }
    
    return view;
};

/*
 * 初始化日/周/月/季参数(整体)
 */
Agent.Calendar.initOverviewOfDWMQ = function(view, start) {
    view.overviewArgsOfDWMQ = {
        time: {
            type: 1, //日
            date: Util.date.yesterdayString(), //昨天
            start: start == "current"
                   ? Util.date.curWeek(Util.date.yesterday())[0] //本周一
                   : Util.date.curWeek(Util.date.lastWeek())[0], //上周一
            end: start == "current"
                 ? Util.date.curWeek(Util.date.yesterday())[1]   //本周日
                 : Util.date.curWeek(Util.date.lastWeek())[1],   //上周日
            year: start == "current"
                  ? Agent.Calendar.year[Agent.Calendar.year.length - 1].value //本年
                  : Agent.Calendar.lastYearOfMonthSelect,
            month: start == "current"
                   ? Agent.Calendar.monthOfThisYear[Agent.Calendar.monthOfThisYear.length - 1].value //本月
                   : Agent.Calendar.lastMonthOfMonthSelect,
            qYear: Agent.Calendar.lastYearOfQSelect,
            q: Agent.Calendar.lastQOfQSelect
        },
        curAddExistDate: null,
        lastAddExistDate: null,
        product: 1,
        pageSize: 20,
        pageNo: 1
    };
    if ($("#ctrlcalThisDuration1")) {
        view.overviewArgsOfDWMQ.curAddExistDate = Util.date.firstDayOfQuarterByMonth(view.overviewArgsOfDWMQ.time.year, view.overviewArgsOfDWMQ.time.month);
    }
    
    return view;
};

/*
 * 初始化日/周/月/季参数(波动)
 */
Agent.Calendar.initContrastOfDWMQ = function(view) {
    view.contrastArgsOfDWMQ = {
        time: {
            type: 1, //日
            date: Util.date.yesterdayString(), //昨天
            start: Util.date.curWeek(Util.date.lastWeek())[0], //上周一
            end: Util.date.curWeek(Util.date.lastWeek())[1],   //上周日
            year: null,  //稍后赋值
            month: null, //稍后赋值
            qYear: null, //稍后赋值
            q: null      //稍后赋值
        },
        lastTime: {
            type: 1, //日
            date: Util.date.yesterday().getDay() == 1
                  ? Util.date.prevNDaysString(Util.date.yesterday(), 3) //周一的环比是周五
                  : Util.date.prevDayString(Util.date.yesterday()),
            start: Util.date.curWeek(Util.date.prevNDays(Util.date.lastWeek(), 7))[0], //上上周一
            end: Util.date.curWeek(Util.date.prevNDays(Util.date.lastWeek(), 7))[1],   //上上周日
            year: null,  //稍后赋值
            month: null, //稍后赋值
            qYear: null, //稍后赋值
            q: null      //稍后赋值
        },
        curAddExistDate: null,  //稍后赋值
        lastAddExistDate: null, //稍后赋值
        product: 1,
        pageSize: 20,
        pageNo: 1
    };
    
    return view;
};

/*
 * 初始化ESUI
 */
Agent.Calendar.initEsui = function(view, start) {
    esui.init(view.el, {
        /*
         * *********************
         * 初始化：日/周/月/季(整体)
         * *********************
         */
        //时间范围
        DateRage11: {
            datasource: [
                {name:'按周', value: 2},
                {name:'按月', value: 3}
            ],
            value: 2
        },
        DateRage12: {
            datasource: [
                {name:'按日', value: 1},
                {name:'按周', value: 2},
                {name:'按月', value: 3},
                {name:'按季度', value: 5}
            ],
            value: 1
        },
        
        //按日
        DayOverView: {
            range: {
                begin: Util.date.BEGINING,
                end: Util.date.yesterday()
            },
            value: Util.date.yesterdayString()
        },
        
        //按周
        WeekOverView1: {
            range: {
                begin: Util.date.BEGINING,
                end: Util.date.yesterday()
            },
            value: start == "current" ? Util.date.yesterdayString() : Util.date.lastWeekString()
        },
        WeekOverView2: {
            range: {
                begin: Util.date.BEGINING,
                end: Util.date.yesterday()
            },
            value: start == "current" ? Util.date.yesterdayString() : Util.date.lastWeekString()
        },
        
        //按月-年
        MonthOverViewY1: {
            datasource: Agent.Calendar.year,
            value: view.overviewArgsOfWM.time.year
        },
        MonthOverViewY2: {
            datasource: Agent.Calendar.year,
            value: view.overviewArgsOfWM.time.year
        },
        
        //按月-月
        MonthOverViewM1: {
            datasource: start == "current" ? Agent.Calendar.monthOfThisYear
                        : (Agent.Calendar.thisMonth == 0
                        ? Agent.Calendar.monthOfLastYear : Agent.Calendar.monthOfThisYear),
            value: view.overviewArgsOfWM.time.month
        },
        MonthOverViewM2: {
            datasource: start == "current" ? Agent.Calendar.monthOfThisYear
                        : (Agent.Calendar.thisMonth == 0
                        ? Agent.Calendar.monthOfLastYear : Agent.Calendar.monthOfThisYear),
            value: view.overviewArgsOfWM.time.month
        },
        
        //按季度-年
        QuarterOverViewY: {
            datasource: Agent.Calendar.year,
            value: Agent.Calendar.lastYearOfQSelect
        },
        
        //按季度-季度
        QuarterOverViewQ: {
            datasource: (Agent.Calendar.thisMonth == 0 || Agent.Calendar.thisMonth == 1 || Agent.Calendar.thisMonth == 2)
                        ? Agent.Calendar.quarterOfLastYear : Agent.Calendar.quarterOfThisYear,
            value: Agent.Calendar.lastQOfQSelect
        },
        
        //客户
        ClientOverView: {
            datasource: [
                {name:'客户ID', value: 1},
                {name:'客户名称', value: 2},
                {name:'客户账号', value: 5},
                {name:'关联客服', value: 3},
                {name:'关联销售', value: 4}
            ],
            value: 2
        },
        
        //增存量界定时间
        ThisDuration1: {
            range: {
                begin: Util.date.BEGINING,
                end: Util.date.yesterday()
            }
        },
        
        /*
         * *********************
         * 初始化：日/周/月/季(波动)
         * *********************
         */
        //时间范围
        DateRage2: {
            datasource: [
                {name:'按日', value: 1},
                {name:'按周', value: 2},
                {name:'按月', value: 3},
                {name:'按季度', value: 5}
            ],
            value: 1
        },
        
        //按日
        DayContrast: {
            range: {
                begin: Util.date.BEGINING_DAY_CONTRAST,
                end: Util.date.yesterday()
            },
            value: Util.date.yesterdayString()
        },
        
        //按周
        WeekContrast: {
            range: {
                begin: Util.date.BEGINING_WEEK_CONTRAST,
                end: Util.date.yesterday()
            },
            value: Util.date.lastWeekString()
        },
        
        //按月-年
        MonthContrastY: {
            datasource: Agent.Calendar.year,
            value: Agent.Calendar.lastYearOfMonthSelect
        },
        
        //按月-月
        MonthContrastM: {
            datasource: Agent.Calendar.thisMonth == 0
                      ? Agent.Calendar.monthOfLastYear : Agent.Calendar.monthOfThisYear,
            value: Agent.Calendar.lastMonthOfMonthSelect
        },
        
        //按季度-年
        QuarterContrastY: {
            datasource: Agent.Calendar.yearWithout2011,
            value: Agent.Calendar.lastYearOfQSelect
        },
        
        //按季度-季度
        QuarterContrastQ: {
            datasource: (Agent.Calendar.thisMonth == 0 || Agent.Calendar.thisMonth == 1 || Agent.Calendar.thisMonth == 2)
                        ? Agent.Calendar.quarterOfLastYear : Agent.Calendar.quarterOfThisYear,
            value: Agent.Calendar.lastQOfQSelect
        },
        
        //客户
        ClientContrast: {
            datasource: [
                {name:'客户ID', value: 1},
                {name:'客户名称', value: 2},
                {name:'客户账号', value: 5},
                {name:'关联客服', value: 3},
                {name:'关联销售', value: 4}
            ],
            value: 2
        },
        
        //增存量界定时间
        ThisDuration2: {
            range: {
                begin: Util.date.BEGINING,
                end: Util.date.yesterday()
            }
        },
        PrevDuration: {
            range: {
                begin: Util.date.BEGINING,
                end: Util.date.yesterday()
            }
        },
        
        /*
         * *********************
         * 初始化：公共
         * *********************
         */
        //每页条数
        PageSize: {
            datasource: [
                {name:'20', value: 20},
                {name:'50', value: 50},
                {name:'100', value: 100}
            ],
            value: 20
        },
        Product: {
            datasource: [
                {name:'竞价服务(旭日+晨星)', value: 1},
                {name:'旭日 ', value: 2},
                {name:'晨星 ', value: 3}
            ],
            value: 1
        }
    });
    
    /*
     * 初始化其他的元素
     */
    //周日历title(整体)
    var weekTitle = start == "current" ? Util.date.curWeekString(Util.date.yesterday())
                    : Util.date.curWeekString(Util.date.lastWeek());
    $("#ctrlcalWeekOverView1 .ui-cal-text").html(weekTitle);
    $("#ctrlcalWeekOverView2 .ui-cal-text").html(weekTitle);
    //增存量界定日期
    if (esui.get("ThisDuration1")) {
        esui.get("ThisDuration1").setValue(view.overviewArgsOfWM.curAddExistDate);
    }
    //选中环比
    esui.get("Contrast1").setChecked(true);
    //周日历title(波动)
    $("#ctrlcalWeekContrast .ui-cal-text").html(Util.date.curWeekString(Util.date.lastWeek()));
    //上期日
    view.$(".day-contrast-prev").html(view.contrastArgsOfDWMQ.lastTime.date);
    //上期周 
    view.$(".week-contrast-prev").html(Util.date.curWeekString(Util.date.prevNDays(Util.date.lastWeek(), 7)));
    //上期月
    updatePrevMonth();
    //上期季度
    updatePrevQuarter();
    
    function updatePrevMonth() {
        var prevYear = esui.get("MonthContrastY").value,
            prevMonth = esui.get("MonthContrastM").value;
        
        view.contrastArgsOfDWMQ.time.year = prevYear;
        view.contrastArgsOfDWMQ.time.month = prevMonth;
        if (esui.get("ThisDuration2")) {
            view.contrastArgsOfDWMQ.curAddExistDate = Util.date.firstDayOfQuarterByMonth(prevYear, prevMonth);
            esui.get("ThisDuration2").setValue(view.contrastArgsOfDWMQ.curAddExistDate);
        }
        
        if (prevMonth == 1) {
            prevYear--;
            prevMonth = 12;
        } else {
            prevMonth--;
        }
        
        view.contrastArgsOfDWMQ.lastTime.year = prevYear;
        view.contrastArgsOfDWMQ.lastTime.month = prevMonth;
        if (esui.get("PrevDuration")) {
            view.contrastArgsOfDWMQ.lastAddExistDate = Util.date.firstDayOfQuarterByMonth(prevYear, prevMonth);
            esui.get("PrevDuration").setValue(view.contrastArgsOfDWMQ.lastAddExistDate);
        }
        
        prevMonth = (prevMonth + "").replace(/^(\d)$/, "0$1");
        view.$(".month-contrast-prev").html(prevYear + "-" + prevMonth);
    }
    
    function updatePrevQuarter() {
        var prevYear = esui.get("QuarterContrastY").value,
            prevQuarter = esui.get("QuarterContrastQ").value;
        
        view.contrastArgsOfDWMQ.time.qYear = prevYear;
        view.contrastArgsOfDWMQ.time.q = prevQuarter;
        
        if (prevQuarter == 1) {
            prevYear--;
            prevQuarter = 4;
        } else {
            prevQuarter--;
        }
        
        view.contrastArgsOfDWMQ.lastTime.qYear = prevYear;
        view.contrastArgsOfDWMQ.lastTime.q = prevQuarter;
        
        prevQuarter = "第" + "一二三四".charAt(prevQuarter - 1) + "季度";
        view.$(".quarter-contrast-prev").html(prevYear + "年" + prevQuarter);
    }
    
    function hideDuration1() {
        if ($("#DurationCal1")) {
            $("#DurationCal1").hide();
            $("#ToggleDate1").removeClass("toggle-date-show");
        }
    }
    
    function hideDuration2() {
        if ($("#DurationCal2")) {
            $("#DurationCal2").hide();
            $("#ToggleDate2").removeClass("toggle-date-show");
        }
    }
    
    /*
     * *********************
     * 绑定事件：日/周/月季(整体)
     * *********************
     */
    //时间范围
    if (esui.get("DateRage11")) {
        esui.get("DateRage11").onchange = function(value, item) {
            var times = $(this.main).parent().children("div.time");
            times.each(function(index, elem) {
                $(elem).hide();
            });
            switch (value) {
                case 2:
                    $(times[0]).show();
                    hideDuration1();
                    break;
                case 3:
                    $(times[1]).show();
            }
            
            view.overviewArgsOfWM.time.type = value;
        };
    }
    if (esui.get("DateRage12")) {
        esui.get("DateRage12").onchange = function(value, item) {
            var times = $(this.main).parent().children("div.time");
            times.each(function(index, elem) {
                $(elem).hide();
            });
            switch (value) {
                case 1:
                    $(times[0]).show();
                    hideDuration1();
                    break;
                case 2:
                    $(times[1]).show();
                    hideDuration1();
                    break;
                case 3:
                    $(times[2]).show();
                    break;
                case 5:
                    $(times[3]).show();
                    hideDuration1();
            }
            
            view.overviewArgsOfDWMQ.time.type = value;
        };
    }
    
    //按日
    if (esui.get("DayOverView")) {
        esui.get("DayOverView").onchange = function(date) {
            view.overviewArgsOfDWMQ.time.date = Util.date.toString(date);
        };
    }
    
    //按周
    if (esui.get("WeekOverView1")) {
        esui.get("WeekOverView1").onchange = function(date) {
            var main = $(this.main);
            setTimeout(function() {
                main.children(".ui-cal-text").html(Util.date.curWeekString(date));
            }, 50); //待esui自动修改后再修改
            
            view.overviewArgsOfWM.time.start = Util.date.curWeek(date)[0];
            view.overviewArgsOfWM.time.end = Util.date.curWeek(date)[1];
        };
    }
    if (esui.get("WeekOverView2")) {
        esui.get("WeekOverView2").onchange = function(date) {
            var main = $(this.main);
            setTimeout(function() {
                main.children(".ui-cal-text").html(Util.date.curWeekString(date));
            }, 50); //待esui自动修改后再修改
            
            view.overviewArgsOfDWMQ.time.start = Util.date.curWeek(date)[0];
            view.overviewArgsOfDWMQ.time.end = Util.date.curWeek(date)[1];
        };
    }
    
    //年
    if (esui.get("MonthOverViewY1")) {
        esui.get("MonthOverViewY1").onchange = function(value, item) {
            var month = esui.get("MonthOverViewM1");
            var list = Util.date.getMonthList(value);
            month.datasource = list;
            month.value = list[list.length - 1].value;
            month.render();
            
            view.overviewArgsOfWM.time.year = value;
            view.overviewArgsOfWM.time.month = month.value;
            
            if (esui.get("ThisDuration1")) {
                var curAddExistDate = Util.date.firstDayOfQuarterByMonth(value, month.value);
                view.overviewArgsOfWM.curAddExistDate = curAddExistDate;
                esui.get("ThisDuration1").setValue(curAddExistDate);
            }
        };
    }
    if (esui.get("MonthOverViewY2")) {
        esui.get("MonthOverViewY2").onchange = function(value, item) {
            var month = esui.get("MonthOverViewM2");
            var list = Util.date.getMonthList(value);
            month.datasource = list;
            month.value = list[list.length - 1].value;
            month.render();
            
            view.overviewArgsOfDWMQ.time.year = value;
            view.overviewArgsOfDWMQ.time.month = month.value;
            
            if (esui.get("ThisDuration1")) {
                var curAddExistDate = Util.date.firstDayOfQuarterByMonth(value, month.value);
                view.overviewArgsOfDWMQ.curAddExistDate = curAddExistDate;
                esui.get("ThisDuration1").setValue(curAddExistDate);
            }
        };
    }
    if (esui.get("QuarterOverViewY")) {
        esui.get("QuarterOverViewY").onchange = function(value, item) {
            var quarter = esui.get("QuarterOverViewQ");
            var list = Util.date.getQuarterList(value);
            quarter.datasource = list;
            quarter.value = list[list.length - 1].value;
            quarter.render();
            
            view.overviewArgsOfDWMQ.time.qYear = value;
            view.overviewArgsOfDWMQ.time.q = quarter.value;
        };
    }
    
    //月
    if (esui.get("MonthOverViewM1")) {
        esui.get("MonthOverViewM1").onchange = function(value, item) {
            view.overviewArgsOfWM.time.month = value;
            
            if (esui.get("ThisDuration1")) {
                var curAddExistDate = Util.date.firstDayOfQuarterByMonth(esui.get("MonthOverViewY1").value, value);
                view.overviewArgsOfWM.curAddExistDate = curAddExistDate;
                esui.get("ThisDuration1").setValue(curAddExistDate);
            }
        };
    }
    if (esui.get("MonthOverViewM2")) {
        esui.get("MonthOverViewM2").onchange = function(value, item) {
            view.overviewArgsOfDWMQ.time.month = value;
            
            if (esui.get("ThisDuration1")) {
                var curAddExistDate = Util.date.firstDayOfQuarterByMonth(esui.get("MonthOverViewY2").value, value);
                view.overviewArgsOfDWMQ.curAddExistDate = curAddExistDate;
                esui.get("ThisDuration1").setValue(curAddExistDate);
            }
        };
    }
    
    //季度
    if (esui.get("QuarterOverViewQ")) {
        esui.get("QuarterOverViewQ").onchange = function(value, item) {
            view.overviewArgsOfDWMQ.time.q = value;
        };
    }
    
    //增存量界定时间
    if (esui.get("ThisDuration1")) {
        esui.get("ThisDuration1").onchange = function(date) {
            if (esui.get("DateRage11")) {
                view.overviewArgsOfWM.curAddExistDate = Util.date.toString(date);
            } else if (esui.get("DateRage12")) {
                view.overviewArgsOfDWMQ.curAddExistDate = Util.date.toString(date);
            }
        };
    }
    
    /*
     * *********************
     * 绑定事件：日/周/月/季(波动)
     * *********************
     */
    //时间范围
    esui.get("DateRage2").onchange = function(value, item) {
        var times = $(this.main).parent().children("div.time");
        times.each(function(index, elem) {
            $(elem).hide();
        });
        switch (value) {
            case 1:
                $(times[0]).show();
                hideDuration2();
                break;
            case 2:
                $(times[1]).show();
                hideDuration2();
                break;
            case 3:
                $(times[2]).show();
                break;
            case 5:
                $(times[3]).show();
                hideDuration2();
        }
        
        view.contrastArgsOfDWMQ.time.type = value;
        view.contrastArgsOfDWMQ.lastTime.type = value;
    };
    
    //按日
    esui.get("DayContrast").onchange = function(date) {
        view.contrastArgsOfDWMQ.time.date = Util.date.toString(date);
        var prev = $(this.main).next().children("strong"), prevString;
        if (esui.get("Contrast1").isChecked()) { //环比
            if (date.getDay() == 1) { //周一的环比是周五
                prevString = Util.date.prevNDaysString(date, 3);
            } else {
                prevString = Util.date.prevDayString(date);
            }
        } else { //同比,上周
            prevString = Util.date.prevNDaysString(date, 7);
        }
        view.contrastArgsOfDWMQ.lastTime.date = prevString;
        prev.html(prevString);
        
        esui.get("DayContrast").setValueAsDate(date); //esui没有自动改变
    };
    
    //环比/周同比
    esui.get("Contrast1").onclick = function(e) {
        var prev = view.$(".day-contrast-prev");
        var date = esui.get("DayContrast").getValueAsDate(), prevString;
        if (date.getDay() == 1) { //周一的环比是周五
            prevString = Util.date.prevNDaysString(date, 3);
        } else {
            prevString = Util.date.prevDayString(date);
        }
        view.contrastArgsOfDWMQ.lastTime.date = prevString;
        prev.html(prevString);
    };
    esui.get("Contrast2").onclick = function(e) {
        var prev = view.$(".day-contrast-prev");
        var date = esui.get("DayContrast").getValueAsDate();
        var prevString = Util.date.prevNDaysString(date, 7);
        view.contrastArgsOfDWMQ.lastTime.date = prevString;
        prev.html(prevString);
    };
    
    //按周
    esui.get("WeekContrast").onchange = function(date) {
        var main = $(this.main);
        main.next().children("strong").html(Util.date.curWeekString(Util.date.prevNDays(date, 7)));
        setTimeout(function() {
            main.children(".ui-cal-text").html(Util.date.curWeekString(date));
        }, 50); //待esui自动修改后再修改
        
        view.contrastArgsOfDWMQ.time.start = Util.date.curWeek(date)[0];
        view.contrastArgsOfDWMQ.time.end = Util.date.curWeek(date)[1];
        view.contrastArgsOfDWMQ.lastTime.start = Util.date.curWeek(Util.date.prevNDays(date, 7))[0];
        view.contrastArgsOfDWMQ.lastTime.end = Util.date.curWeek(Util.date.prevNDays(date, 7))[1];
    };
    
    //年
    esui.get("MonthContrastY").onchange = function(value, item) {
        var month = esui.get("MonthContrastM");
        var list = Util.date.getMonthList(value);
        if (value == 2011) { //2011年波动本期不可选10月
            list.shift();
        }
        month.datasource = list;
        month.value = list[list.length - 1].value;
        month.render();
        updatePrevMonth();
    };
    esui.get("QuarterContrastY").onchange = function(value, item) {
        var quarter = esui.get("QuarterContrastQ");
        var list = Util.date.getQuarterList(value);
        quarter.datasource = list;
        quarter.value = list[list.length - 1].value;
        quarter.render();
        updatePrevQuarter();
    };
    
    //月
    esui.get("MonthContrastM").onchange = function(value, item) {
        updatePrevMonth();
    };
    
    //季度
    esui.get("QuarterContrastQ").onchange = function(value, item) {
        updatePrevQuarter();
    };
    
    //增存量界定时间
    if (esui.get("ThisDuration2")) {
        esui.get("ThisDuration2").onchange = function(date) {
            view.contrastArgsOfDWMQ.curAddExistDate = Util.date.toString(date);
        };
    }
    if (esui.get("PrevDuration")) {
        esui.get("PrevDuration").onchange = function(date) {
            view.contrastArgsOfDWMQ.lastAddExistDate = Util.date.toString(date);
        };
    }
    
    /*
     * *********************
     * 绑定事件：公共
     * *********************
     */
    //每页条数
    esui.get("PageSize").onchange = function(value, item) {
        view.overviewArgsOfWM.pageSize = value;
        view.overviewArgsOfDWMQ.pageSize = value;
        view.contrastArgsOfDWMQ.pageSize = value;
        //重新渲染页码
        view.lastAction.args.pageNo = 1;
        view.pageRendered = false;
        //按上次查询条件查询
        view.query(view.lastAction);
    };
    
    //翻页
    esui.get("PageNo").onchange = function(page) {
        view.lastAction.args.pageNo = page + 1;
        //按上次查询条件查询
        view.query(view.lastAction);
    };
    
    //产品
    if (esui.get("Product")) {
        esui.get("Product").onchange = function(value, item) {
            view.overviewArgsOfWM.product = value;
            view.overviewArgsOfDWMQ.product = value;
            view.contrastArgsOfDWMQ.product = value;
        };
    }
};

Agent.Calendar.init = function(view, start) {
    Agent.Calendar.initOverviewOfWM(view, start);
    Agent.Calendar.initOverviewOfDWMQ(view, start);
    Agent.Calendar.initContrastOfDWMQ(view);
    Agent.Calendar.initEsui(view, start);
};
