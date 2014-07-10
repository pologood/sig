package org.atlantis.core.service;

import com.mongodb.BasicDBList;
import com.mongodb.DBObject;

/**
 * @copyright  www.sogou.com
 * @author       denghongshuai@sogou-inc.com
 * @time           2014-7-10   下午3:05:15
 * @version    
 *
 * @description 
 */
public interface GraphService {
	
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
