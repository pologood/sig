<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib uri="/WEB-INF/auth.tld" prefix="authcheck" %>
<%response.setContentType("application/javascript");%>
Atlantis.TreeNav = {};
Atlantis.TreeNav.Stat ={};

Atlantis.TopNav = [
    {name: "首页", index: 1, tid: 5000, logid: 300, tree: null, url: "null", target: "_self"},
    {name: "教育", index: 2, tid: 5000, logid: 400, tree: null, url: "null", target: "_self"},
    {name: "生活", index: 3, tid: 6000, logid: 500, tree: null, url: "null", target: "_self"},
    {name: "工作", index: 5, tid: 7000, logid: 600, tree: null, url: "null", target: "_self"},
    {name: "数据", index: 6, tid: 8000, logid: 700, tree: null, url: "null", target: "_self"},
    {name: "经典", index: 7, tid: 3000, logid: 800, tree: null, url: "null", target: "_self"},
    {<authcheck:auth authid="400000001">name: "用户管理", index: 11, tid: 1000, logid: 2000, tree: null, url: "#cust/"</authcheck:auth>},
    {<authcheck:auth authid="400000002">name: "图谱管理", index: 12, tid: 1000, logid: 3000, tree: null, url: "#content/"</authcheck:auth>}
    
];

Atlantis.Auth = {};
