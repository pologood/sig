package org.atlantis.core.mongo.dao.impl;

import lombok.Getter;
import lombok.Setter;


import org.atlantis.core.dao.impl.base.MongodbTemplate;
import org.atlantis.core.mongo.dao.GraphDao;

import com.mongodb.BasicDBList;
import com.mongodb.DBObject;

/**
 * @copyright  www.sogou.com
 * @author       denghongshuai@sogou-inc.com
 * @time           2014-7-10   下午3:21:47
 * @version    
 *
 * @description 
 */
public class GraphDaoImpl implements GraphDao {

	@Getter @Setter private MongodbTemplate mongodbTemplate;
	
	@Override
	public BasicDBList queryGraphsByItemTitle(DBObject query) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public BasicDBList queryGraphsByItemId(DBObject query) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public BasicDBList queryGraphsByCategoryId(DBObject query) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public boolean addGraph(DBObject graph) {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public boolean delGraphByItemId(DBObject graph) {
		// TODO Auto-generated method stub
		return false;
	}

}
