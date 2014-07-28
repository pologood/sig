package org.atlantis.core.service.impl;


import org.atlantis.core.mongo.dao.TestDao;
import org.atlantis.core.service.TestService;
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
public class TestServiceImpl implements TestService{
	
	@Autowired
	 private TestDao testDao;
	
	@Override
	public String sayHello(){
		return "Hello, my dear friends ! ";
	}
	
	@Override
	public String echo(String words){
		return testDao.echo(words);
	}

}
