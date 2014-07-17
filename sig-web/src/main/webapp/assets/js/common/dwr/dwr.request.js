/*
 * DWR请求封装
 * @author : liangxiao
 * @date   : 2012
 */

dwr.request = (function() {
    var defaults = {
        timeout: 300000,    //30s超时
        httpMethod: 'POST', //请求方法
        mock: false,        //假数据
        
        //回调
        getCallback: function(success, fail, context) {
            return function(data) {
                if (!data || data.success == false) {
                    switch (context) {
                        case "noLoading": //不显示错误信息
                            break;
                        case "panel": //显示panel错误信息
                            fail && fail(data, context);
                            break;
                        case undefined: //显示默认错误信息
                            if (fail) {
                                fail(data, context);
                            } else {
                                clearTimeout(window.dwrErrorTimer);
                                Agent.Widgets.MessageBox.show(data.errorMsg);
                                window.dwrErrorTimer = setTimeout(function() {
                                    Agent.Widgets.MessageBox.hide();
                                }, 5000);
                            }
                    }
                } else {
                    success && success(data, context);
                }
            };
        },
        
        //回调异常
        getErrorHandler: function(method, context) {
            return function(message, ex) {
                if (ex.name == "dwr.engine.http.401") {
                    window.location.reload();
                } else {
                    throw new Error(method + ' error: ' + message);
                }
            };
        },
        
        //请求前执行
        getPreHook: function(httpMethod, context) {
            return function() {
                if (!context) { //未指定context, 显示默认loading
                    Agent.Widgets.MessageBox.show('加载中...');
                    Agent.Widgets.MessageBox.showMask();
                }
            };
        },
        
        //请求后执行
        getPostHook: function(httpMethod, context) {
            return function() {
                if (!context) { //未指定context, 隐藏默认loading
                    Agent.Widgets.MessageBox.hide();
                    Agent.Widgets.MessageBox.hideMask();
                }
            };
        }
    };
    
    var run = function(options) {
        if (!options) return;
        
        var methods = options.method.split('.'), //方法名
            args = options.args || [], //参数
            success = options.success, //成功回调
            fail = options.fail,
            context = options.context,
            
            timeout = options.timeout || defaults.timeout,
            httpMethod = options.httpMethod || defaults.httpMethod,
            callback = options.callback || defaults.getCallback(success, fail, context),
            errorHandler = options.errorHandler || defaults.getErrorHandler(options.method, context),
            preHook = options.preHook || defaults.getPreHook(httpMethod, context),
            postHook = options.postHook || defaults.getPostHook(httpMethod, context),
            mock = options.mock || defaults.mock;
        
        try {
            var method = window[methods[0]][methods[1]];
        } catch (e) {
            throw new Error('DWRAction does not exist: ' + methods[0] + '.' + methods[1]);
        }
        
        args.push({
            timeout: timeout,
            httpMethod: httpMethod,
            callback: callback,
            errorHandler: errorHandler,
            preHook: preHook,
            postHook: postHook
        });
        
        if (!mock) {
            method && method.apply(window, args);
        } else {
            //模拟
            preHook();
            setTimeout(function() {
                postHook();
                try {
                    callback(options.mockData);
                } catch (e) {
                    throw new Error(method + ' error: ' + e);
                }
            }, options.mockTime ? options.mockTime : 100);
        }
    };
    
    return {
        run: run
    };
})();
