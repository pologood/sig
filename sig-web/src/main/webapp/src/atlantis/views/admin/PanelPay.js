/*
 * 付款信息
 * @author : liangxiao
 * @date   : 2013
 */

Atlantis.Views.Panel.Pay = Atlantis.Views.Panel.Base.extend({
    events: {
        "click .save": "save",
        "click .cancel": "hidePanel",
        "click .close": "hidePanel",
        "click #AddPayee": "addPayee"
    },
    
    init: function(args) {
        this.parentView = args.parentView;
        this.pay = args.parentView.model.get("pay");
        
        //将滑动面板插入DOM
        this.$el.appendTo("body");
        this.$el.mustache("tpl-slide-panel", {
            id: "Pay",
            title: "设置付款信息",
            submit: "save"
        });
        this.$('.content').mustache("tpl-pay", {
            pay: this.pay
        });
        this.renderPayee();
        this.$(".hide").hide();
        this.mask = this.$("#PayMask");
        this.panel = this.$("#PayPanel");
        
        //初始化控件
        esui.init();
        if (!this.pay.openToCust) {
            esui.get("OpenType1").setChecked(true);
        } else {
            esui.get("OpenType2").setChecked(true);
        }
    },
    
    renderPayee: function() {
        if (this.pay.payBanks.length == 0) {
            this.$("#AddPayee").before($.Mustache.render("tpl-payee", {
                no: 0,
                name: "",
                bank: "",
                cardNo: ""
            }));
        } else {
            var view = this;
            $.each(this.pay.payBanks, function(index, val) {
                view.$("#AddPayee").before($.Mustache.render("tpl-payee", {
                    no: index,
                    name: val.name,
                    bank: val.bank,
                    cardNo: val.cardNo
                }));
            });
        }
        
        if (this.pay.payBanks.length < 3) {
            this.$("#AddPayee").show();
        }
    },
    
    addPayee: function() {
        var payee = this.$(".payee");
        if (payee.length == 1) {
            this.$("#AddPayee").before($.Mustache.render("tpl-payee", {
                no: 1,
                name: "",
                bank: "",
                cardNo: ""
            }));
            esui.init();
        }
        if (payee.length == 2) {
            this.$("#AddPayee").before($.Mustache.render("tpl-payee", {
                no: 2,
                name: "",
                bank: "",
                cardNo: ""
            }));
            esui.init();
            this.$("#AddPayee").remove();
        }
    },
    
    save: function() {
        var contactor = $.trim(esui.get("Contactor").getValue());
        if (contactor == "") {
            esui.get("Contactor").setValue("");
            esui.get("Contactor").select();
            this.showError("请填写联系人");
            return;
        }
        if (Util.getBytes(contactor) > 50) {
            esui.get("Contactor").select();
            this.showError("联系人过长");
            return;
        }
        
        var tel = $.trim(esui.get("Tel").getValue());
        if (tel == "") {
            esui.get("Tel").setValue("");
            esui.get("Tel").select();
            this.showError("请填写联系电话");
            return;
        }
        if (Util.getBytes(tel) > 50) {
            esui.get("Tel").select();
            this.showError("联系电话过长");
            return;
        }
        
        var gatherUnit = $.trim(esui.get("Unit").getValue());
        if (Util.getBytes(gatherUnit) > 100) {
            esui.get("Unit").select();
            this.showError("收款单位过长");
            return;
        }
        
        var gatherAddr = $.trim(esui.get("Addr").getValue());
        if (Util.getBytes(gatherAddr) > 50) {
            esui.get("Addr").select();
            this.showError("收款地址过长");
            return;
        }
        
        var zipp = $.trim(esui.get("Zip").getValue());
        if (Util.getBytes(zipp) > 10) {
            esui.get("Addr").select();
            this.showError("邮政编码过长");
            return;
        }
        
        var payee = [],
            view = this;
        for (var i = 0, len = this.$(".payee").length; i < len; i++) {
            var name = $.trim(esui.get("Payee" + i).getValue()),
                bank = $.trim(esui.get("Bank" + i).getValue()),
                cardNo = $.trim(esui.get("CardNo" + i).getValue());
            if (name != "" || bank != "" || cardNo != "") {
                if (Util.getBytes(name) > 100) {
                    esui.get("Payee" + i).select();
                    view.showError("收款人过长");
                    return;
                }
                if (Util.getBytes(bank) > 100) {
                    esui.get("Bank" + i).select();
                    view.showError("开户银行过长");
                    return;
                }
                if (Util.getBytes(cardNo) > 50) {
                    esui.get("CardNo" + i).select();
                    view.showError("银行卡号过长");
                    return;
                }
                payee.push({
                    name: name,
                    bank: bank,
                    cardNo: cardNo
                });
            }
        }
        if (payee.length == 0) {
            payee = null;
        }
        
        var args = {
            agentId: parseInt($("#AtlantisId").val(), 10),
            contactor: contactor,
            tel: tel,
            gatherUnit: gatherUnit,
            gatherAddr: gatherAddr,
            zipp: zipp,
            payBanks: payee,
            openToCust: esui.get("OpenType2").isChecked()
        };
        
        var view = this;
        dwr.request.run({
            context: "panel",
            method: "PaymentAction.addOrMotifyPayment",
            args: [args],
            success: function(response) {
                view.hidePanel();
                view.parentView.model.getPay({agentId: $("#AtlantisId").val()});
            },
            fail: function(response) {
                view.showError(response.errorMsg);
            }
        });
    }
});
