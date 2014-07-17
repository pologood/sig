/*
 * Atlantis View - Foot
 * @author : liangxiao
 * @date   : 2012
 */

Atlantis.Views.Foot = Backbone.View.extend({
    el: $("#Foot"),
    
    initialize: function() {
        this.render();
    },
    
    render: function() {
        this.$el.mustache("tpl-foot", {
            year: (new Date()).getFullYear()
        });
    }
});
