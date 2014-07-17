/*
 * 夏洛克UserAgent统计
 * @author : kaka, liangxiao
 * @date   : 2012
 */

(function() {
    //判断Sherlock是否定义
    if (typeof Sherlock == "undefined" || !( Sherlock instanceof Object)) {
        return "Sherlock is undefined";
    }
    
    //计算采样率
    if (Math.random() * 100 > Sherlock["rate"]) {
        return "wash wash and sleep";
    }
    
    //初始化将会用到的变量
    var win = window, doc = document, scr = screen, nav = navigator;
    var body = document.body, el = doc.documentElement;
    
    /*
     * 发送日志
     */
    function log(url) {
        var n = "log_" + (new Date()).getTime();
        var c = window[n] = new Image();
        c.src = url;
        c = null;
    }
    
    /*
     * 检测flash，并取出版本信息
     */
    function flashVersion() {
        var f = "ShockwaveFlash.ShockwaveFlash";
        var fla;
        if (nav.plugins && nav.mimeTypes.length) {
            fla = nav.plugins["Shockwave Flash"];
            if (fla && fla.description) {
                return fla.description.match(/\d+/g).join(".");
            }
        } else {
            var A = ActiveXObject;
            try {
                fla = new A(f + ".7");
            } catch (e) {
                try {
                    fla = new A(f + ".6");
                    fla.AllowScriptAccess = "always";
                    return 6;
                } catch (e) {}
                try {
                    fla = new A(f);
                } catch (e) {}
            }
            if (fla != null) {
                try {
                    return fla.GetVariable("$version").match(/\d+/g).join(".");
                } catch (e) {}
            }
        }
        return [0];
    };
    
    /*
     * 用户可视区域尺寸
     */
    function userScreen() {
        var w, h;
        
        if (win.innerHeight) {
            w = win.innerWidth;
            h = win.innerHeight;
        } else if(el && el.clientHeight) {
            w = el.clientWidth;
            h = el.clientHeight;
        } else if(body) {
            w = body.clientWidth;
            h = body.clientHeight;
        }
        
        return [w, h];
    }
    
    /*
     * 封装String.toLowerCase()
     */
    function low(str) {
        return str.toLowerCase();
    }
    
    /*
     * 封装new RegExp()
     */
    function exp(str) {
        /*
         * 加\b用来避免匹配到 ser的情况
         * se,r
         */
        return new RegExp(str + "\\b[ \\/]?([\\w\\.]*)", "i");
    }
    
    /*
     * 封装ua匹配函数
     */
    function uaMatch(str) {
        if (result = nav.userAgent.match(exp(str))) {
            return result.slice(1);
        } else {
            return ["", ""];
        }
    }
    
    /*
     * 分析useragent
     */
    function userAgent() {
        var ua = nav.userAgent,
            shell = ["", ""],
            ie = "msie",
            sf = "safari",
            browserReg = "(" + ie + "|" + sf + "|firefox|chrome|opera)",
            shellReg = "(maxthon|360se|theworld|se|theworld|greenbrowser)",
            ttReg = "(tencenttraveler)",
            osReg = "(windows nt|macintosh|solaris|linux)";
        
        /*
         * 分析浏览器
         */
        var browser = uaMatch(browserReg);
        
        if (low(browser[0]) == ie) {
            /*
             * 如果没有匹配到其他外壳
             * 则尝试匹配tt
             *
             * 当打开tt时，不论原生ie或者其他外壳，都很流氓的加上TencentTraveler 4.0
             *
             * for example
             * tt's ua: Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; Trident/4.0; TencentTraveler 4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; CIBA)
             * ie's ua: Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/4.0; TencentTraveler 4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; CIBA)
             * mt's ua: Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; Trident/4.0; TencentTraveler 4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; CIBA; Maxthon 2.0)
             * 360's ua: Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/4.0; TencentTraveler 4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; CIBA; 360SE)
             */
            if ((shell = uaMatch(shellReg)) == ",") {
                shell = uaMatch(ttReg);
            }
        } else if (low(browser[0]) == sf) {
            /*
             * safari取version
             * Mozilla/5.0 (Windows; U; Windows NT 6.1; zh-CN) AppleWebKit/533.16 (KHTML, like Gecko) Version/5.0 Safari/533.16
             */
            browser[1] = uaMatch("version") + "." + browser[1];
        }
        
        var os = uaMatch(osReg);
        
        return [browser.join(","), shell.join(","), os.join(",")];
    }
    
    //main逻辑
    (function() {
        //获取flash版本号
        var fv = flashVersion();
        
        //获取浏览器和OS
        var ua = userAgent();
        
        //获取用户可视区域尺寸
        var us = userScreen();
        
        //读取用户信息
        var pool = [
            ua[0], //浏览器
            ua[1], //外壳
            ua[2], //操作系统
            nav.platform,
            
            //OS适用的默认语言
            nav.systemLanguage || nav.language,
            
            //屏幕宽度
            scr.width,
            
            //屏幕高度
            scr.height,
            
            //用户可视屏幕宽度
            us[0],
            
            //用户可视屏幕高度
            us[1],
            
            //屏幕色深
            scr.colorDepth,
            
            //cookie支持
            nav.cookieEnabled ? 1 : 0,
            
            //flash版本号
            flashVersion()
        ];
        
        var b = low(pool.join(";"));
        
        log(Sherlock.action + "log.gif?i=" + Sherlock.id + "&p=" + b + "&r=" + Math.random());
    })();
})(Sherlock);
