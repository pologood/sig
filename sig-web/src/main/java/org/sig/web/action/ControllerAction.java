/**
 * 
 */
package org.sig.web.action;

import java.util.List;
import java.util.Map;

import org.sig.core.bo.PostClass;
import org.sig.core.bo.SrcWebsite;
import org.sig.core.service.ControllerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * @desp   
 * @author  dhshuai@gmail.com
 * @version  2013-3-17
 * @since   
 */
@Component("ControllerAction")
public class ControllerAction {
	
	@Autowired
	private ControllerService controllerService;
	
	public List<SrcWebsite> getSrcWebsite(){
		return controllerService.getSrcWebsite();
	}
	
	public List<PostClass>  getPostClass(){
		return controllerService.getPostClass();
	}

}
