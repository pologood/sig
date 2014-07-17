/*
 * 常用工具
 * @author : liangxiao
 * @date   : 2012
 */

var Util = {};

/*
 * 阻止默认
 * @param {Event} e 事件
 */
Util.stopDefault = function(e) {
    var e = e || window.event;
    if (e.preventDefault) {
        e.preventDefault();
    } else {
        e.returnValue = false;
    }
};

/*
 * 阻止冒泡
 * @param {Event} e 事件
 */
Util.stopBubble = function(e) {
    var e = e || window.event;
    if (e.stopPropagation) {
        e.stopPropagation();
    } else {
        e.cancelBubble = true;
    }
};

/*
 * 验证
 */
Util.isInt = function(str) {
    return str === "" ? true : /^\d+$/.test(str);
};

Util.isNumber = function(str) {
    return str === "" ? true : /^\d+(\.\d+)?$/.test(str);
};

Util.isEmail = function(str) {
    return /^[0-9a-z][_.0-9a-z-]{0,31}@([0-9a-z][0-9a-z-]{0,30}[0-9a-z]\.){1,4}[a-z]{2,4}$/i.test(str);
};

Util.isPassword = function(str) {
    var number = /[0-9]+/,
        lowercase = /[A-Z]+/,
        uppercase = /[a-z]+/,
        chars = /[\`\~\!\@\#\$\%\^\&\*\(\)\-\_\=\+\{\}\[\]\<\>\;\:\'\"\,\.\?\/\|\\]+/,
        charset = /^[0-9a-z\`\~\!\@\#\$\%\^\&\*\(\)\-\_\=\+\{\}\[\]\<\>\;\:\'\"\,\.\?\/\|\\]+$/i,
        count = 0;
    
    if (number.test(str)) {
        count++;
    }
    if (lowercase.test(str)) {
        count++;
    }
    if (uppercase.test(str)) {
        count++;
    }
    if (chars.test(str)) {
        count++;
    }
    
    return count >= 3 && charset.test(str);
};

/*
 * 获取字符串字节数
 * \xXX - 由两位十六进制数XX指定的Latin-1字符(单字节字符)
 */
Util.getBytes = function(str) {
    return str.replace(/[^\x00-\xff]/gi, "--").length;
};

/*
 * 修复IE7表格高度bug
 */
Util.fixTable = function(table) {
    if (T.browser.ie < 8) {
        $(table).css({height: 'auto'});
        $(table).css({height: $(table)[0].offsetHeight + 17});
    }
};

/*
 * 打开客户情况列表
 */
Util.openCustPage = function(param) {
    window.open("#stat/cust/" + encodeURIComponent(param), "", "width=980,height=450,resizeable=yes,scrollbars=yes,top=100,left=100");
};

/*
 * 添加客户情况列表参数
 */
Util.toUrl = function(args, argsCustom, qFlag, clFlag) {
    var url = "";
    switch (qFlag) {
        case 1: //周月
            url = ['type=', args.time.type,
                   '&start=', args.time.start, '&end=', args.time.end,
                   '&year=', args.time.year, '&month=', args.time.month].join('');
            break;
        case 2: //日周月季
            switch(clFlag) {
                case 1: //本期
                    url = ['type=', args.time.type,
                           '&date=', args.time.date,
                           '&start=', args.time.start, '&end=', args.time.end,
                           '&year=', args.time.year, '&month=', args.time.month,
                           '&qYear=', args.time.qYear, '&q=', args.time.q].join('');
                    break;
                case 2: //上期
                    url = ['type=', args.lastTime.type,
                           '&date=', args.lastTime.date,
                           '&start=', args.lastTime.start, '&end=', args.lastTime.end,
                           '&year=', args.lastTime.year, '&month=', args.lastTime.month,
                           '&qYear=', args.lastTime.qYear, '&q=', args.lastTime.q].join('');
                    break;
                case 3: //特殊处理，客服存量，流失客户
                	url = ['type=', args.time.type,
                           '&date=', args.time.date,
                           '&start=', args.time.start, '&end=', args.time.end,
                           '&year=', args.time.year, '&month=', args.time.month,
                           '&qYear=', args.time.qYear, '&q=', args.time.q,
                           '&lastTime.type=', args.lastTime.type,
                           '&lastTime.date=',args.lastTime.date,
                           '&lastTime.start=', args.lastTime.start, '&lastTime.end=', args.lastTime.end,
                           '&lastTime.year=', args.lastTime.year, '&lastTime.month=', args.lastTime.month,
                           '&lastTime.qYear=', args.lastTime.qYear, '&lastTime.q=', args.lastTime.q].join('');
            }
            break;
        case 3: //周月,上期有消耗本期无消耗客户分析统计报告
            url = ['type=1',
                   '&start=', args.time.start, '&end=', args.time.end,
                   '&year=', args.time.year, '&month=', args.time.month].join('');
    }
    
    for (var i in argsCustom) {
        url += "&" + i + "=" + argsCustom[i];
    }
    
    return url;
};

/*
 * 维持心跳
 */
Util.live = function() {
    setInterval(function() {
        $.ajax({
            url: 'live.jsp?time=' + new Date().getTime()
        });
    }, 10 * 60 * 1000);
};

/*
 * 发送代管日志
 * @param {Number} type 代管类型
 */
Util.sendCustLog = function(type) {
    dwr.request.run({
        context: "noLoading",
        method: "DwrUtilAction.logCsHostedInfo",
        args: [{type: type}]
    });
};

/*
 * 发送点击日志
 * @param {Number} type 点击类型
 */
Util.sendClickLog = function(type) {
    dwr.request.run({
        context: "noLoading",
        method: "DwrUtilAction.logClickInfo",
        args: [{type: type}]
    });
};

Util.isSeCompatible = /se/i.test(navigator.userAgent) && /msie/i.test(navigator.userAgent);

if (T.ie == 6) { //使IE6缓存背景
    try {
        document.execCommand("BackgroundImageCache", false, true);
    } catch(e) {}
}
