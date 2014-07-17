package org.atlantis.core.dao.impl.base;

import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.InitializingBean;

import com.mongodb.DBCollection;
import com.mongodb.Mongo;
import com.mongodb.MongoOptions;
import com.mongodb.ServerAddress;

import lombok.Getter;
import lombok.Setter;

/**
 * @copyright  www.sogou.com
 * @author       denghongshuai@sogou-inc.com
 * @time           2014-7-10   下午5:36:15
 * @version    
 *
 * @description 
 */
public class MongodbTemplate implements InitializingBean{
	
	@Getter @Setter private String servers;
	
	@Getter @Setter private String user;
	
	@Getter @Setter private String password;
	
	@Getter @Setter private  MongoOptions mongoOptions;
	
	@Getter private static Mongo mongo;
	
	private static Map<String, DBCollection> cachedCollections = new HashMap<String, DBCollection>();
	
	public DBCollection getCollection(String dbName, String collectionName) {
		String composedName = dbName + "_" + collectionName;
		DBCollection target = null;
		
		if(null !=(target = cachedCollections.get(composedName)))
			return target;
		else {
			target = (DBCollection)mongo.getDB(dbName).getCollection(collectionName);
			if(null != target) {
				cachedCollections.put(composedName, target);
			}
			
           return target;
		}
	}

	@Override
	public void afterPropertiesSet() throws Exception {
		if(null == mongo) {
			 String[] serverSplits =new String[]{};
	    	 if(servers.contains(",")) {
	    		 serverSplits = servers.split(",");
	    	 }else {
	    		 serverSplits = new String[]{servers};
	    	 }
	    	 
	    	 List<ServerAddress> serverAddresses = new ArrayList<ServerAddress>();
	    	 for(String serverSplit : serverSplits) {
	    		 String[] hostPort = serverSplit.split(":");         
	    		 String host = hostPort[0];
	    		 int port = Integer.parseInt(hostPort[1]);
	    		 
	    		 ServerAddress serverAddressSub = null;
				try {
					serverAddressSub = new ServerAddress(host, port);    
					serverAddresses.add(serverAddressSub);
				} catch (UnknownHostException e) {

				}

	    	 }
			mongo = new Mongo(serverAddresses, mongoOptions);
			boolean auth = mongo.getDB("admin").authenticate(user, password.toCharArray());
			
			if(!auth) {
				System.exit(1);
			}
		}
		
	}

}
