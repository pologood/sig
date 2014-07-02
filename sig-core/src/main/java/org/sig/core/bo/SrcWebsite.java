package org.sig.core.bo;

import java.io.Serializable;

import lombok.Getter;
import lombok.Setter;

/**
 * @desp   
 * @author  dhshuai@gmail.com
 * @version  2013-3-17
 * @since   
 */
public class SrcWebsite implements Serializable {
	
	@Getter @Setter private Integer websiteId;
	
	@Getter @Setter private String websiteName;

}
