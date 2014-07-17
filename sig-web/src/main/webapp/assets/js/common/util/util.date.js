/*
 * 日期计算
 * @author : liangxiao
 * @date   : 2012
 */

var Util = Util || {};

Util.date = {};

Util.date.BEGINING = new Date(2011, 9, 1); //最早开始日期: 2011-10-1
Util.date.BEGINING_DAY_CONTRAST = new Date(2011, 9, 2);  //按日波动最早开始日期: 2011-10-2
Util.date.BEGINING_WEEK_CONTRAST = new Date(2011, 9, 3); //按周波动最早开始日期: 2011-10-3
Util.date.CONSUME_REALTIME_WEEK_CONTRAST_OPEN = new Date(2012, 10, 16); //实时消耗周同比打开日期: 2012-11-16
Util.date.KA_BEGINING = new Date(2005, 0, 1); //KA最早开始日期: 2005-1-1

Util.date.toString = function(date) {
    return T.date.format(date, "yyyy-MM-dd");
};

Util.date.getNDaysBefore = function(n) {
    return new Date(new Date() - n * 86400000);
};

Util.date.yesterday = function() {
    return Util.date.getNDaysBefore(1);
};

Util.date.yesterdayString = function() {
    return Util.date.toString(Util.date.yesterday(), "yyyy-MM-dd");
};

Util.date.lastWeek = function() {
    return Util.date.getNDaysBefore(7);
};

Util.date.lastWeekString = function() {
    return Util.date.toString(Util.date.lastWeek(), "yyyy-MM-dd");
};

Util.date.prevDay = function(date) {
    return new Date(date.getTime() - 86400000);
};

Util.date.prevDayString = function(date) {
    return Util.date.toString(Util.date.prevDay(date), "yyyy-MM-dd");
};

Util.date.prevNDays = function(date, n) {
    return new Date(date.getTime() - n * 86400000);
};

Util.date.prevNDaysString = function(date, n) {
    return Util.date.toString(Util.date.prevNDays(date, n));
};

Util.date.curWeek = function(date) {
    var dayOfWeek = date.getDay();
    var oDate = Date.today().set({
        day: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear()
    });
    var duration;
    switch (dayOfWeek) {
        case 0:
            duration = [oDate.clone().addDays(-6), oDate];
            break;
        case 1:
            duration = [oDate, oDate.clone().addDays(6)];
            break;
        case 2:
            duration = [oDate.clone().addDays(-1), oDate.clone().addDays(5)];
            break;
        case 3:
            duration = [oDate.clone().addDays(-2), oDate.clone().addDays(4)];
            break;
        case 4:
            duration = [oDate.clone().addDays(-3), oDate.clone().addDays(3)];
            break;
        case 5:
            duration = [oDate.clone().addDays(-4), oDate.clone().addDays(2)];
            break;
        case 6:
            duration = [oDate.clone().addDays(-5), oDate.clone().addDays(1)];
    }
    return [duration[0].toString("yyyy-MM-dd"), duration[1].toString("yyyy-MM-dd")];
};

Util.date.curWeekString = function(date) {
    var a = Util.date.curWeek(date);
    return a[0] + " / " + a[1];
};

Util.date.firstDayOfQuarterByMonth = function(year, month) {
    var firstMonthOfQuarter;
    if (month < 4) {
        firstMonthOfQuarter = "01";
    } else if (month < 7) {
        firstMonthOfQuarter = "04";
    } else if (month < 10) {
        firstMonthOfQuarter = "07";
    } else {
        firstMonthOfQuarter = "10";
    }
    return year + "-" + firstMonthOfQuarter + "-01";
};

Util.date.firstDayOfQuarterByQ = function(year, q) {
    var firstMonthOfQuarter;
    if (q == 1) {
        firstMonthOfQuarter = "01";
    } else if (q == 2) {
        firstMonthOfQuarter = "04";
    } else if (q == 3) {
        firstMonthOfQuarter = "07";
    } else {
        firstMonthOfQuarter = "10";
    }
    return year + "-" + firstMonthOfQuarter + "-01";
};

Util.date.getYearList = function() {
    var thisYear = (new Date()).getFullYear();
    var begin = 2011, list = [];
    list.push({name: begin, value: begin});
    while (begin < thisYear) {
        begin++;
        list.push({name: begin, value: begin});
    }
    return list;
};

Util.date.getMonthList = function(year) {
    var thisYear = (new Date()).getFullYear();
    if (year < 2011 || year > thisYear) return [];
    if (year == 2011) return [{name: 10, value: 10}, {name: 11, value: 11}, {name: 12, value: 12}];
    if (year < thisYear) {
        return [
            {name: 1, value: 1}, {name: 2, value: 2}, {name: 3, value: 3},
            {name: 4, value: 4}, {name: 5, value: 5}, {name: 6, value: 6},
            {name: 7, value: 7}, {name: 8, value: 8}, {name: 9, value: 9},
            {name: 10, value: 10}, {name: 11, value: 11}, {name: 12, value: 12}
        ];
    }
    var thisMonth = (new Date()).getMonth() + 1, begin = 1, list = [];
    list.push({name: begin, value: begin});
    while (begin < thisMonth) {
        begin++;
        list.push({name: begin, value: begin});
    }
    return list;
};

Util.date.getQuarterList = function(year) {
    var thisYear = (new Date()).getFullYear();
    var thisMonth = (new Date()).getMonth() + 1;
    var all = [
        {name: "第一季度", value: 1}, {name: "第二季度", value: 2},
        {name: "第三季度", value: 3}, {name: "第四季度", value: 4}
    ];
    if (year < 2011 || year > thisYear) return [];
    if (year == 2011) return [{name: "第四季度", value: 4}];
    if (year < thisYear) return all;
    if (thisMonth < 4) return [{name: "第一季度", value: 1}];
    if (thisMonth < 7) return [{name: "第一季度", value: 1}, {name: "第二季度", value: 2}];
    if (thisMonth < 10) return [{name: "第一季度", value: 1}, {name: "第二季度", value: 2}, {name: "第三季度", value: 3}];
    return all;
};

Util.getReportDuration = function(args) {
    var duration = "";
    switch (args.time.type) {
        case 1: //日
            duration = "(" + args.time.date + ")";
            break;
        case 2: //周
            duration = "(" + args.time.start + " — " + args.time.end + ")";
            break;
        case 3: //月
            var formatMonth = (args.time.month + "").replace(/^(\d)$/, "0$1");
            duration = "(" + args.time.year + "-" + formatMonth + ")";
            break;
        case 5: //季
            var formatQ = "一二三四".charAt(args.time.q - 1);
            duration = "(" + args.time.qYear + "年第" + formatQ + "季度)";
    }
    return duration;
};

Util.getCompareReportDuration = function(args) {
    var duration = "";
    switch (args.time.type) {
        case 1: //日
            duration = "(" + args.time.date + "[本期] 与 " + args.lastTime.date + "[上期])";
            break;
        case 2: //周
            duration = "(" + args.time.start + " — " + args.time.end + "[本期] 与 "
                     + args.lastTime.start + " — " + args.lastTime.end + "[上期])";
            break;
        case 3: //月
            var formatMonth1 = (args.time.month + "").replace(/^(\d)$/, "0$1");
            var formatMonth2 = (args.lastTime.month + "").replace(/^(\d)$/, "0$1");
            duration = "(" + args.time.year + "-" + formatMonth1 + "[本期] 与 "
                     + args.lastTime.year + "-" + formatMonth2 + "[上期])";
            break;
        case 5: //季
            var formatQ1 = "一二三四".charAt(args.time.q - 1);
            var formatQ2 = "一二三四".charAt(args.lastTime.q - 1);
            duration = "(" + args.time.qYear + "年第" + formatQ1 + "季度[本期] 与 "
                     + args.lastTime.qYear + "年第" + formatQ2 + "季度[上期])";
    }
    return duration;
};

Util.date.getGreedings = function() {
    var hour = (new Date()).getHours();
    if (hour < 6) {return {text: "凌晨好！你起得真早~", icon: "g1"}}
    else if (hour < 9) {return {text: "早上好！昨晚休息得好吗？", icon: "g2"}}
    else if (hour < 12) {return {text: "上午好！又是一个阳光灿烂的日子。", icon: "g3"}}
    else if (hour < 14) {return {text: "中午好！吃过午饭了吗？", icon: "g4"}}
    else if (hour < 17) {return {text: "下午好！可别打瞌睡噢~", icon: "g5"}}
    else if (hour < 19) {return {text: "傍晚好！今天的工作完成了吗？", icon: "g6"}}
    else if (hour < 22) {return {text: "晚上好！现在的效率还行吧？", icon: "g7"}}
    else {return {text: "在加班啊！辛苦啦，别太晚了~", icon: "g8"}}
};
