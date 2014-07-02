<%@ page language="java" pageEncoding="UTF-8"%> 
 
<html> 
  <head> 
    <title>My JSP 'first_dwr.jsp' starting page</title> 
    <script type='text/javascript' src='dwr/util.js'></script> 
    <script type='text/javascript' src='dwr/engine.js'></script> 
    <script type='text/javascript' src='dwr/interface/TestAction.js'> </script> 
    <script type='text/javascript' src='assets/js/jquery.js'></script>
    <script type='text/javascript' src ='assets/js/jquery-ui.js'></script>
    <script type="text/javascript" src='src/js/my.js'> </script> 
    <link rel="stylesheet" type="text/css" href="assets/css/jquery-ui.css">
    <link rel="stylesheet" type="text/css" href="src/css/my.css">
  </head> 
   
  <body> 
          	
	<div id="tabs">
				<ul>
					<li><a href="#tabs-1">First</a></li>
					<li><a href="#tabs-2">Second</a></li>
					<li><a href="#tabs-3">Third</a></li>
				</ul>
				<div id="tabs-1">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</div>
				<div id="tabs-2">Phasellus mattis tincidunt nibh. Cras orci urna, blandit id, pretium vel, aliquet ornare, felis. Maecenas scelerisque sem non nisl. Fusce sed lorem in enim dictum bibendum.</div>
				<div id="tabs-3">Nam dui erat, auctor a, dignissim quis, sollicitudin eu, felis. Pellentesque nisi urna, interdum eget, sagittis et, consequat vestibulum, lacus. Mauris porttitor ullamcorper augue.</div>
   </div>
   
	 <h2 class="demoHeaders">Button</h2>
	<button id="button">A button element</button>
	<form style="margin-top: 1em;">
		<div id="radioset">
			<input type="radio" id="radio1" name="radio"><label for="radio1">Choice 1</label>
			<input type="radio" id="radio2" name="radio" checked="checked"><label for="radio2">Choice 2</label>
			<input type="radio" id="radio3" name="radio"><label for="radio3">Choice 3</label>
		</div>
	 </form>



    <input type="button" name="button" value="测试" onclick="firstDwr()"> 
			
  </body> 
</html> 