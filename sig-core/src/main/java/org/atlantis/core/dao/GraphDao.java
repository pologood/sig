package org.atlantis.core.dao;

import com.mongodb.BasicDBList;
import com.mongodb.DBObject;

/**
 * @copyright  www.sogou.com
 * @author       denghongshuai@sogou-inc.com
 * @time           2014-7-10   下午3:20:56
 * @version    
 *
 * @description 
 */
public interface GraphDao {
	
	/**
	 * 
	 * @param query
	 * @return
	 */
	public BasicDBList queryGraphsByItemTitle(DBObject query);
	
	/**
	 * 
	 * @param query
	 * @return
	 */
	public BasicDBList queryGraphsByItemId(DBObject query);
	
	/**
	 * 
	 * @param query
	 * @return
	 */
	public BasicDBList queryGraphsByCategoryId(DBObject query);
	
	
	/**
	 * 
	 * @param graph
	 * @return
	 */
	public boolean addGraph(DBObject graph);
	
	/**
	 * 
	 * @return
	 */
	public boolean delGraphByItemId(DBObject graph);

}
