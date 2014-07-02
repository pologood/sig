package org.sig.core.service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import org.sig.common.Const;
import org.sig.core.bo.Post;
import org.sig.core.bo.PostClass;
import org.sig.core.dao.PostManageDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *  @Copyright :    All right reserved @ Sogou, Inc.
 *  @CreateTime :  2013-3-13  下午3:38:21 
 *  @Author :          Deng Hongshuai
 *  @Description: 
 *
 **/
@Service
public class PostManageService {
	
	@Autowired
	private PostManageDao postManageDao;
	
	private SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	
	/**
	 * Add a new post
	 * @param post
	 */
	public void addPost(Post post){
		
	    // Creating time
		post.setCreateTime(format.format(new Date()));
		postManageDao.addPost(post);
		
		if(Const.CREATIVE_POST!= post.getType()){
		    postManageDao.addPostSrcInfo(post);
		}
		
	}
	

}
