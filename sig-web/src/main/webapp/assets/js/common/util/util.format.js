/*
 * 格式化
 * @author : liangxiao
 * @date   : 2012
 */

var Util = Util || {};

//修复 toFixed bug
Util.toFixed2 = function(number) {
    var number = number + "";
    var isNegative = /^-/.test(number);
    
    //保证为正数
    var str = Math.round(parseFloat(number.replace(/-/, "")) * 10 * 10) / 100 + "";
    
    //添加小数点
    var point = str.indexOf('.');
    if (point < 0) {
        point = str.length;
        str += '.';
    }
    //补0
    while (str.length <= point + 2) {
        str += '0';
    }
    
    return isNegative ? "-" + str : str;
};

Util.format = {};

Util.format.string = function(src) {
    if (src === null) return "--";
    return src;
};

Util.format.thousand = function(num) {
    if (num === null) return "--";
    num = num + "";
    var re = /(-?\d+)(\d{3})/;
    while (re.test(num)) {
        num = num.replace(re, "$1,$2");
    }
    return num;
};

Util.format.number = function(num) {
    if (num === null) return "--";
    return Util.format.thousand(num);
};

Util.format.money = function(num) {
    if (num === null) return "--";
    return Util.format.thousand(Util.toFixed2(num));
};

Util.format.percent = function(num) {
    if (num === null) return "--";
    return Util.toFixed2(num * 100) + "%";
};

Util.format.toRed = function(src) {
    return src.replace(/<td>-([^-<\/td>]+)<\/td>/gi, '<td><span style="color:#c13832">-$1</span></td>');
};

Util.format.toRedDiv = function(src) {
    return src.replace(/(<div[^<]+>)-([^-<\/div>]+)(<\/div>)/gi, '$1<span style="color:#c13832">-$2</span>$3');
};
