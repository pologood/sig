<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE HTML>
<html>
<head>
<meta charset="utf-8" />
<title>异常</title>
<style type="text/css">
body{background:#fefefe; margin:20px; font-family:Georgia}
span{font-size:40px; font-weight:bold; font-family:"微软雅黑"; color:#f0c36d}
p{margin:20px 0; font-size:30px; font-weight:bold; font-family:"微软雅黑"; color:#ccc}
p a{color:#333}
div{height:80px; line-height:25px; color:#333; font-size:12px}
div a{color:#333}
</style>
</head>

<body>
<span>异常</span>
<p>
<% 
    String errorType = (String) request.getSession().getAttribute("errorType");
    if ("1".equals(errorType)) {
        out.print("对不起，您在本系统中还没有登陆，请重新登录：<a href=\"http://bo.sogou.com\">http://bo.sogou.com</a>");
    } else if ("2".equals(errorType)) {
        out.print("对不起，您没有权限访问指定的页面！");
    } else if ("3".equals(errorType)) {
        out.print("对不起，您的账号没有权限使用本系统，请与管理员联系");
    } else if("4".equals(errorType)){
    	out.print((String) request.getSession().getAttribute("delegateFailMsg"));
    }
%>
</p>
<div><a href="http://www.sogou.com/" target="_blank">搜狗首页</a> - 
<a href="http://fuwu.sogou.com/buy.html" target="_blank">与我们联系</a> - 
<a href="http://fuwu.sogou.com/help.html" target="_blank">帮助</a><br />
&copy; SOGOU.COM 京ICP证050897号</div>
</body>
</html>