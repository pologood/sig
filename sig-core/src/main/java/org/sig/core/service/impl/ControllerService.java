package org.sig.core.service.impl;

import java.util.List;

import org.sig.core.bo.PostClass;
import org.sig.core.bo.SrcWebsite;
import org.sig.core.dao.ControllerDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * @desp   
 * @author  dhshuai@gmail.com
 * @version  2013-3-17
 * @since   
 */
@Service
public class ControllerService {
	
   @Autowired
   private ControllerDao controllerDao;
   
   public  List<SrcWebsite> getSrcWebsite(){
	   List<SrcWebsite> srcWebsite = controllerDao.getSrcWebsite();
	   return srcWebsite;
   }
   
	public List<PostClass> getPostClass(){
		return controllerDao.getPostClass();
	}

}
