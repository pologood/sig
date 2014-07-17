/*
 * Ajax请求封装
 * @author : liangxiao
 * @date   : 2012
 */

var Util = Util || {};

Util.ajax = {
    showMsg: function(msg) {
        Agent.Widgets.MessageBox.show(msg);
    },
    
    hideMsg: function() {
        Agent.Widgets.MessageBox.hide();
    },
    
    run: function(option) {
        $.ajax({
            type: "POST",
            dataType: "json",
            url: option.url,
            data : option.data,
            
            beforeSend: function(jqXHR, settings) {
                Util.ajax.showMsg("加载中...");
            },
            
            complete: function(jqXHR, textStatus) {
                Util.ajax.hideMsg();
            },
            
            error: function(jqXHR, textStatus, errorThrown) {
                Util.ajax.showMsg(textStatus + ": " + errorThrown);
            },
            
            success: function(data, textStatus, jqXHR) {
                if (data.success) {
                    option.success && option.success(data);
                } else {
                    Util.ajax.showMsg(data.errorMsg);
                }
            }
        });
    }
};
