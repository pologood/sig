<%@ page language="java" pageEncoding="UTF-8"%> 

<!DOCTYPE html>
<html lang="en">
  <head>
		    <meta charset="utf-8">
		    <title>喵喵, 每个人的经典...</title>
		    <meta name="viewport" content="width=device-width, initial-scale=1.0">
		    <meta name="description" content="">
		    <meta name="author" content="">
		
		    <!-- Le styles -->
		    <link href="assets/css/bootstrap.css" rel="stylesheet">
		    <link href="assets/css/datetimepicker.css" rel="stylesheet">
		    <link href="src/css/my.css" rel="stylesheet">
		    <link href="assets/css/bootstrap-responsive.css" rel="stylesheet">
		
		    <!-- HTML5 shim, for IE6-8 support of HTML5 elements -->
		    <!--[if lt IE 9]>
		      <script src="../assets/js/html5shiv.js"></script>
		    <![endif]-->
		         <script type='text/javascript' src='dwr/util.js'></script> 
			    <script type='text/javascript' src='dwr/engine.js'></script> 
			    <script type="text/javascript" src="src/js/my.js"></script>
			    <script type='text/javascript' src='dwr/interface/TestAction.js'> </script> 
			     <script type='text/javascript' src='dwr/interface/PostManageAction.js'> </script>
			     <script type='text/javascript' src='dwr/interface/ControllerAction.js'> </script>  
		
		    <!-- Fav and touch icons -->
		    <link rel="apple-touch-icon-precomposed" sizes="144x144" href="assets/ico/apple-touch-icon-144-precomposed.png">
		    <link rel="apple-touch-icon-precomposed" sizes="114x114" href="assets/ico/apple-touch-icon-114-precomposed.png">
		    <link rel="apple-touch-icon-precomposed" sizes="72x72" href="assets/ico/apple-touch-icon-72-precomposed.png">
		    <link rel="apple-touch-icon-precomposed" href="assets/ico/apple-touch-icon-57-precomposed.png">
		    <link rel="shortcut icon" href="assets/ico/favicon.png">
  </head>

  <body onload="initIndexJSP()">
       
    <div class="navbar navbar-inverse navbar-fixed-top">
      <div class="navbar-inner">
        <div class="container-fluid">
          <button type="button" class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
            <ul class="nav">
                  <li><a class="brand" href="#">拾  贝</a></li>
                  <li>    </li>
            </ul>
            <ul class="nav">
	              <li class="active"><a href="#">主页</a></li>
	              <li><a href="#about">关于</a></li>
	              <li><a href="#contact">联系</a></li>
	         </ul>
            <form class="navbar-form pull-right"  method="post" action="index.jsp">
                <button type="submit" class="btn">登出</button>
            </form>        
        </div>
      </div>
    </div>

    <div class="container-fluid">
      <div class="row-fluid">
        <div class="span3">
          <div class="well sidebar-nav">
            <ul class="nav nav-list">
              <li class="nav-header">栏目</li>
              <li class="active"><a href="#">论坛</a></li>
              <li><a href="#">购物</a></li>
              <li><a href="#">美食</a></li>
              <li><a href="#">学习</a></li>
              <li><a href="#">旅行</a></li>
            </ul>
          </div><!--/.well -->
        </div><!--/span-->
        <div class="span9">
          <div class="hero-unit">
                <form class="form-horizontal"  >  
                        <fieldset>  
                                <legend>我的推荐</legend>
                                  <div class="control-group">  
							            <label class="control-label" for="title">标       题</label>  
							            <div class="controls">  
							              <input type="text"  name="title" class="input-xlarge" id="title">  
							            </div>
							            <label class="control-label" for="postClass">帖子栏目</label>  
							             <div class="controls">  
									              <select id="postClass"  name="postClass">  
									              </select>  
                                           </div>
							             <label class="control-label" for="srcWebsiteId">来源网站</label>  
							              <div class="controls">  
									              <select id="srcWebsiteId"  name="srcWebsiteId">  
									              </select>  
                                           </div>
                                          <label class="control-label" for="datetimepicker">创建时间</label> 
											<div class="controls  date form_datetime">
											    <input id ="srcCreateTime"  size="16" type="text" value=""  >
											    <span class="add-on"><i class="icon-th"></i></span>
											</div>
                                         <label class="control-label" for="type">帖子类型</label>  
							             <div class="controls">  
									              <select id="type"  name="type">  
									                    <option value="1">索引帖子</option>
									                    <option value="2">转载帖子</option>
									                    <option value="3">原创帖子</option>
									              </select>  
                                          </div> 
							             <label class="control-label" for="srcWebsiteUrl">帖子URL</label>  
							            <div class="controls">  
 		                                     <input type="text"  name="srcWebsiteUrl" class="input-xlarge" id="srcWebsiteUrl">  
							            </div>
							            <label class="control-label" for="srcAuthor">作       者</label>  
							            <div class="controls">  
							              <input type="text"  name="srcAuthor" class="input-xlarge" id="srcAuthor">  
							            </div>
							              <label class="control-label" for="srcClick">点击数</label>  
                                           <div class="controls">  
                                                  <input type="text"  class="input-xlarge" id="srcClick">  
                                           </div>
                                           <label class="control-label" for="srcClick">回帖数</label>  
                                           <div class="controls">  
                                                  <input type="text"  class="input-xlarge" id="srcReplay">  
                                           </div>
							             <label class="control-label" for="brief">热帖简介</label>  
                                         <div class="controls">  
                                               <textarea class="input-xlarge"  name="brief" id="brief" rows="3"></textarea>  
                                         </div>        
							       </div>
							       
                                    <div class="form-actions">  
									            <input type="button"  class="btn" name="button" value="保存" onclick="addPost()">
									            <button class="btn">重置</button>  
							        </div>
                       </fieldset>
                  </form>       
          </div>
 
        </div><!--/span-->
      </div><!--/row-->

      <hr>

      <footer>
        <p>&copy; Company 2013</p>
      </footer>

    </div><!--/.fluid-container-->

    <!-- Le javascript
    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->
    <script type='text/javascript'  src='assets/js/jquery.js'></script>
    <scrip type='text/javascript'  src='assets/js/bootstrap.js'></scrip>
   <script type="text/javascript" src="assets/js/bootstrap-datetimepicker.js" charset="UTF-8"></script>
   <script type="text/javascript" src="assets/js/locales/bootstrap-datetimepicker.zh-CN.js" charset="UTF-8"></script>
   	<script type="text/javascript">
	    $(".form_datetime").datetimepicker({
	    	   pickDate: true,
 	           pickTime: true,
 	           hourStep: 1,
 	           minuteStep: 15,
 	           secondStep: 30,
 	           inputMask: true,
		       format: "yyyy-mm-dd hh:ii:ss",
		       pickerPosition: "bottom-left"
	    });
	</script>    
  </body>
</html>