package org.atlantis.core.dao.impl;

import lombok.Getter;
import lombok.Setter;

import org.atlantis.core.dao.TestDao;
import org.atlantis.core.dao.impl.base.MongodbTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.mongodb.BasicDBObject;
import com.mongodb.DBCollection;
import com.mongodb.DBObject;

/**
 * @copyright  www.sogou.com
 * @author       denghongshuai@sogou-inc.com
 * @time           2014-7-17   下午2:52:22
 * @version    
 *
 * @description 
 */
@Component
public class TestDaoImpl implements TestDao {
	
	@Autowired
	private MongodbTemplate mongodbTemplate;

	@Override
	public String echo(String words) {
		
		DBCollection collection = mongodbTemplate.getCollection("Test", "Test");
		if(null != collection) {
			collection.save(new BasicDBObject("test", words));
		}
		
		DBObject query = new BasicDBObject();
		query.put("test", words);
		
		DBObject obj = collection.findOne(query);
		return (String)obj.get("test") + "  mongodb";
	}

}
