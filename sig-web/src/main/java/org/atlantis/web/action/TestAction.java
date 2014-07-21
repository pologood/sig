package org.atlantis.web.action;

import org.atlantis.core.service.impl.TestServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 *  @Copyright :    
 *  @CreateTime :  2012-9-26  上午10:29:32 
 *  @Author :          Deng Hongshuai
 *  @Description: 
 *
 **/

@Component("TestAction")
public class TestAction {
	
	@Autowired
	private TestServiceImpl service;
	
	public String sayHello(){
		return service.sayHello();
	}
	
	public String echo(String words){
		return service.echo(words);
	}

}
