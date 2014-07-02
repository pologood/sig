	  
// 初始化首页
     function initIndexJSP(){
    	 getSrcWebsite();
    	 getPostClass();
     }


// Add a new Post
	  function addPost(){
		  var title = document.getElementById("title").value;
		  var srcWebsiteUrl = document.getElementById("srcWebsiteUrl").value;
		  var postClass = document.getElementById("postClass").value;
		  var srcCreateTime = document.getElementById("srcCreateTime").value;
		  var srcAuthor = document.getElementById("srcAuthor").value;
		  var brief = document.getElementById("brief").value;
		  var type = document.getElementById("type").value;
		  var srcClick =  document.getElementById("srcClick").value;
		  var srcReplay =  document.getElementById("srcReplay").value;
		  var srcWebsiteId = document.getElementById("srcWebsiteId").value;
		  
		  var post = new Object();
		  post.title = title;
		  post.postClass = postClass;
		  post.srcCreateTime = srcCreateTime;
		  post.srcWebsiteUrl = srcWebsiteUrl;
		  post.srcAuthor = srcAuthor;
		  post.brief = brief;
		  post.type = type;
		  post.srcWebsiteId = srcWebsiteId;
		  post.srcClick = srcClick;
		  post.srcReplay = srcReplay;
		  
		  PostManageAction.addPost(post);
		  
	  }
	  
// 添加帖子栏目
	  function addPostClass(data){
		  DWRUtil.removeAllOptions("postClass");
		  DWRUtil.addOptions("postClass",data,"classID","className");   
	  }
	  
// 添加来源网站
	  function addSrcWebsiteOption(data){
		  
		  DWRUtil.removeAllOptions("srcWebsiteId");
		  DWRUtil.addOptions("srcWebsiteId",data,"websiteId","websiteName");   
	  }
	  
// 获取内容来源网站
	  function getSrcWebsite(){
		  ControllerAction.getSrcWebsite(addSrcWebsiteOption);
	  }
	  
// 获取Post栏目
	  function getPostClass(){
		  ControllerAction.getPostClass(addPostClass);
	  }
	  
	  
// 练习
	  function callBackHello(data){ 
	        alert(data); 
	  } 
	  
	   function firstDwr(){ 
		    TestAction.echo("Arum",callBackHello); 
       } 
	   
	 
	  