/*
 * Agent View - TreeNavSimple
 * @author : liangxiao
 * @date   : 2012
 */

Agent.Views.TreeNavSimple = Backbone.View.extend({
    el: $("#Left"),
    
    events: {
        "click a.node": "toggle",
        "click a.leaf": "navigate",
        "click a.external": "sendClickLog",
        "click #Slider": "slide"
    },
    
    initialize: function() {
        this.config = null;
        this.render(arguments[0], arguments[1], arguments[2]);
    },
    
    destroy: function() {
        this.$el.unbind();
        this.$el.html("");
    },
    
    /*
     * 清除active类
     */
    removeActive: function(tree) {
        $.each(tree, function(index1, val1) {
            if (val1["sub"]) {
                $.each(val1["sub"], function(index2, val2) {
                    val2["active"] = "";
                });
            }
        });
    },
    
    /*
     * 渲染
     * @param {Array} tree 菜单结构
     * @param {Number} nodeIndex 一级菜单序号
     * @param {Number} leafIndex 二级菜单序号
     */
    render: function(tree, nodeIndex, leafIndex) {
        this.removeActive(tree);
        tree[nodeIndex]["sub"][leafIndex]["active"] = " active";
        
        this.config = tree;
        
        this.$el.html(this.leftTpl);
        this.$("#TreeNav").html(this.createHTML(tree));
        this.$el.removeClass("left-hide");
        $("#Right").removeClass("right-expand");
    },
    
    leftTpl: '<div id="TreeNav"></div><div id="Slider" class="slide-left"></div>',
    nodeTpl: '<a href="javascript:void(0)" hidefocus="true" class="node" index="{{index}}" tid="{{tid}}">{{name}}</a>',
    leafTpl: '<a href="javascript:void(0)" hidefocus="true" class="leaf{{active}}" index="{{index}}" tid="{{tid}}">{{name}}</a>',
    externalTpl: '<a href="{{url}}" target="{{target}}" hidefocus="true" class="external" index="{{index}}" tid="{{tid}}" logid="{{logid}}">{{name}}</a>',
    
    createHTML: function(tree) {
        var html = [],
            me = this;
        $.each(tree, function(index1, value1) {
            if (value1.name != undefined) { //有一级菜单权限
                html.push(Mustache.to_html(me.nodeTpl, {
                    index: value1.index,
                    name: value1.name,
                    tid: value1.tid
                }));
                html.push('<div>');
                $.each(value1.sub, function(index2, value2) {
                    if (value2.name != undefined) { //有二级菜单权限
                        if (value2.url && !/^#/.test(value2.url)) { //外部链接
                            html.push(Mustache.to_html(me.externalTpl, {
                                url: value2.url,
                                target: value2.target,
                                index: value2.index,
                                name: value2.name,
                                tid: value2.tid,
                                logid: value2.logid
                            }));
                        } else { //内部链接
                            html.push(Mustache.to_html(me.leafTpl, {
                                active: value2.active,
                                index: value2.index,
                                name: value2.name,
                                tid: value2.tid
                            }));
                        }
                    }
                });
                html.push('</div>');
            }
        });
        
        return html.join("");
    },
    
    toggle: function(e) {
        var me = $(e.target);
        me.toggleClass("fold");
        if (me.hasClass("fold")) {
            me.next().slideUp(160);
        } else {
            me.next().slideDown(160);
        }
    },
    
    sendClickLog: function(e) {
        var logid = $(e.target).attr("logid");
        Util.sendClickLog(logid);
    },
    
    navigate: function(e) {
        var me = $(e.target);
        
        var index1 = me.parent().prev().attr("index"),  //一级菜单序号
            index2 = me.attr("index"),                  //二级菜单序号
            leaf = this.config[index1]["sub"][index2],
            url;
        
        if (!leaf.sub) {
            url = leaf.url;
        } else {
            var urlList = leaf.sub;
            for (var i = 0, n = urlList.length; i < n; i++) {
                if (urlList[i].name != undefined) {
                    url = urlList[i].url;
                    break;
                }
            }
        }
        
        //改变hash
        var hash = url.split("#")[1];
        Agent.router.navigate(hash, {trigger: true});
    },
    
    slide: function(e) {
        $(e.target).toggleClass("slide-right");
        
        $("#TreeNav").toggle();
        
        $("#Left").toggleClass("left-hide", 200);
        $("#Right").toggleClass("right-expand", 200);
    }
});
