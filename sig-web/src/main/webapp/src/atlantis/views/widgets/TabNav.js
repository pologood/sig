/*
 * Agent View - TabNav
 * @author : liangxiao
 * @date   : 2013
 */

Agent.Views.TabNav = Backbone.View.extend({
    initialize: function() {},
    
    tpl: '<a href="{{url}}" class="{{className}}" tid="{{tid}}" hidefocus="true">{{name}}</a>',
    
    render: function(tree, index1, index2, index3) {
        var urlList = tree[index1]["sub"][index2]["sub"],
            html = [],
            me = this;
        $.each(urlList, function(index, value) {
            if (value.name != undefined) {
               var className = index3 == index ? "active" : "";
               html.push(Mustache.to_html(me.tpl, {
                   url: value.url,
                   className: className,
                   name: value.name,
                   tid: value.tid
               }));
            }
        });
        
        $("#Right .tab").html(html.join(""));
    }
});
