/*
 * Atlantis View - TopNav
 * @author : aris
 * @date   : 2014
 */

Atlantis.Views.TopNav = Backbone.View.extend({
    el: $("#Nav"),
    
    events: {
        "click a": "navigate"
    },
    
    initialize: function() {},
    
    render: function(index) {
        //清除active类
        $.each(Atlantis.TopNav, function(index, value) {
            value.active = "";
        });
        Atlantis.TopNav[index].active = " active";
        
        //生成HTML
        this.$el.html(this.createHTML(Atlantis.TopNav));
    },
    
    tpl: '<a href="javascript:void(0)" hidefocus="true" index="{{index}}" tid="{{tid}}" logid="{{logid}}" class="nav{{active}}">{{name}}</a>',
    tplu: '<a href="javascript:void(0)" hidefocus="true" index="{{index}}" tid="{{tid}}" logid="{{logid}}" class="nav u">{{name}}</a>',
    externalTpl: '<a  class="external" index="{{index}}" tid="{{tid}}" logid="{{logid}}">{{name}}</a>',
    
    createHTML: function(data) {
        var html = [], me = this;
        $.each(data, function(index, value) {
            if (value.name != undefined) {
               if (value.index < 0) { //外部链接
                   html.push(Mustache.to_html(me.externalTpl, {
                        index: value.index,
                        name: value.name,
                        tid: value.tid,
                        logid: value.logid
                    }));
               } else if (value.index > 30) { //外部链接
                   html.push(Mustache.to_html(me.tplu, {
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
            tree = Atlantis.TopNav[index]["tree"],
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
            url = Atlantis.TopNav[index]["url"];
        }
        
        //改变hash
        var hash = url.split("#")[1];
        Atlantis.router.navigate(hash, {trigger: true});
    }
});
