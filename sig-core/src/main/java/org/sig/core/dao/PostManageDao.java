package org.sig.core.dao;

import java.util.List;

import org.sig.core.bo.Post;
import org.sig.core.bo.PostClass;

/**
 *  @Copyright :    All right reserved @ Sogou, Inc.
 *  @CreateTime :  2013-3-13  下午3:38:49 
 *  @Author :          Deng Hongshuai
 *  @Description: 
 *
 **/
public interface PostManageDao {
	
	/**
	 * 添加新的帖子
	 * @param post
	 */
	public void addPost(Post post);
	
	
	/**
	 * 添加引用帖子额外西西呢
	 * @param post
	 */
	public void addPostSrcInfo(Post post);

}
