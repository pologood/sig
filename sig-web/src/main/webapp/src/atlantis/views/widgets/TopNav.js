/*
 * Agent View - TopNav
 * @author : liangxiao
 * @date   : 2012
 */

Agent.Views.TopNav = Backbone.View.extend({
    el: $("#Nav"),
    
    events: {
        "click a": "navigate"
    },
    
    initialize: function() {},
    
    render: function(index) {
        //清除active类
        $.each(Agent.TopNav, function(index, value) {
            value.active = "";
        });
        Agent.TopNav[index].active = " active";
        
        //生成HTML
        this.$el.html(this.createHTML(Agent.TopNav));
    },
    
    tpl: '<a href="javascript:void(0)" hidefocus="true" index="{{index}}" tid="{{tid}}" logid="{{logid}}" class="nav{{active}}">{{name}}</a>',
    externalTpl: '<a href="{{url}}" target="{{target}}" hidefocus="true" class="external" index="{{index}}" tid="{{tid}}" logid="{{logid}}">{{name}}</a>',
    
    createHTML: function(data) {
        var html = [],
            me = this;
        $.each(data, function(index, value) {
            if (value.name != undefined) {
               if (value.url && !/^#/.test(value.url)) { //外部链接
                   html.push(Mustache.to_html(me.externalTpl, {
                        url: value.url,
                        target: value.target,
                        index: value.index,
                        name: value.name,
                        tid: value.tid,
                        logid: value.logid
                    }));
               } else { //内部链接
                   html.push(Mustache.to_html(me.tpl, {
                       index: value.index,
                       active: value.active,
                       name: value.name,
                       tid: value.tid,
                       logid: value.logid
                   }));
               }
            }
        });
        
        return html.join("");
    },
    
    /*
     * 点击导航
     */
    navigate: function(e) {
        var logid = $(e.target).attr("logid");
        Util.sendClickLog(logid);
        
        if (!$(e.target).hasClass("nav")) return;
        
        var index = $(e.target).attr("index"),
            tree = Agent.TopNav[index]["tree"],
            url;
        
        if (tree != null) {
            //获取第一个有权限的url
            var leaves, urlList;
            for (var i = 0, n = tree.length; i < n; i++) {
                if (tree[i]["name"] != undefined) {
                    leaves = tree[i]["sub"];
                    break;
                }
            }
            for (i = 0, n = leaves.length; i < n; i++) {
                if (leaves[i]["name"] != undefined) {
                    urlList = leaves[i]["sub"] ? leaves[i]["sub"] : leaves[i]["url"];
                    break;
                }
            }
            if (typeof urlList == "string") { //无右侧tab
                url = urlList;
            } else {
                for (i = 0, n = urlList.length; i < n; i++) {
                    if (urlList[i]["name"] != undefined) {
                        url = urlList[i]["url"];
                        break;
                    }
                }
            }
        } else {
            url = Agent.TopNav[index]["url"];
        }
        
        //改变hash
        var hash = url.split("#")[1];
        Agent.router.navigate(hash, {trigger: true});
    }
});