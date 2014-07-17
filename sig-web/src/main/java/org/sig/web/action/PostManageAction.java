package org.sig.web.action;

import java.util.List;

import org.sig.common.DwrResult;
import org.sig.core.bo.Post;
import org.sig.core.bo.PostClass;
import org.sig.core.service.impl.PostManageService;
import org.sig.web.Form.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 *  @Copyright :    All right reserved @ Sogou, Inc.
 *  @CreateTime :  2013-3-13  下午3:38:01 
 *  @Author :          Deng Hongshuai
 *  @Description:   
 *
 **/
@Component("PostManageAction")
public class PostManageAction {
	
	@Autowired
	private PostManageService postManageService;
	
	/**
	 * Add a new Post
	 * @param post
	 * @return
	 */
	public  DwrResult addPost(Post post){
		DwrResult result = new DwrResult();
		
	   try {
		   postManageService.addPost(post);
		   
		   result.setSuccess(true);
		   result.setMessage("Add a post successfully");
	   } catch (Exception e){
		   result.setSuccess(false);
		   result.setMessage(e.getMessage());
		   e.printStackTrace();
	   } 
		   
	return  result;
	
	}
	
	
	/**
	 * Update a post
	 * @param post
	 * @return
	 */
	public DwrResult updatePost(Query query){
		return null;
	}
	
	/**
	 * Delete a post
	 * @param postId
	 * @return
	 */
	public DwrResult delPost(Query query){
		return null;
	}
	
	/**
	 * Query posts
	 * @param query
	 * @return
	 */
	public DwrResult getPost(Query query){
		return null;
	}
	

}
