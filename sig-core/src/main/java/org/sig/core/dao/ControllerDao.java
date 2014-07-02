package org.sig.core.dao;

import java.util.List;
import java.util.Map;

import org.sig.core.bo.PostClass;
import org.sig.core.bo.SrcWebsite;

/**
 * @desp     
 * @author  dhshuai@gmail.com
 * @version  2013-3-17
 * @since   
 */
public interface ControllerDao {
	
	/**
	 * 获取搜集目标网站
	 * @return
	 */
	public List<SrcWebsite> getSrcWebsite();
	
	/**
	 * 
	 */
	public List<PostClass> getPostClass();

}
