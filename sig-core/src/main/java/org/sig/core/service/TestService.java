package org.sig.core.service;


import org.atlantis.core.dao.TestDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *  @Copyright :    
 *  @CreateTime :  2012-9-26  上午10:24:31 
 *  @Author :          Deng Hongshuai
 *  @Description:  a SERVICE object for test
 *
 **/

@Service
public class TestService {
	
	@Autowired
	 private TestDao testDao;
	
	public String sayHello(){
		return "Hello, my dear friends !";
	}
	
	public String echo(String words){
		return testDao.echo(words);
	}

}
