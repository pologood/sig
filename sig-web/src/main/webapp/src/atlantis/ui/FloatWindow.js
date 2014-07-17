/*
 * 浮动窗口
 * @param id {String} 容器id
 * @param title {String} 标题
 * @param content {String} 内容
 */

function FloatWindow(id, title, content) {
    this.tpl = [
        '<div class="float-window" id="{{id}}" style="display:none">',
        '<div class="top"><span class="title">{{title}}</span><a class="close" href="javascript:void(0)">&nbsp;</a></div>',
        '<div class="content">{{{content}}}</div>',
        '</div>'
    ].join("");
    this.id = id;
    this.title = title;
    this.content = content;
    this.init();
}

FloatWindow.prototype = {
    init: function() {
        $("body").append(Mustache.to_html(this.tpl, {
            id: this.id,
            title: this.title,
            content: this.content
        }));
        
        this.win = $("#" + this.id);
        var me = this;
        this.win.delegate("a", "click", function() {
            me.destroy();
        });
        
        var showMe = T.cookie.get("show-safetip");
        if (showMe == null) {
            T.cookie.set("show-safetip", 1);
            this.win.show();
        }
    },
    
    destroy: function() {
        this.win.undelegate();
        this.win.remove();
    }
};
