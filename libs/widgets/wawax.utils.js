/**
 * WAWAX Utils
 * -----------------------------
 *
 * Last changed: $LastChangedDate$
 * @author Antoine SAUVAGE
 * @version $Revision$
 *
 * Copyright (c) 2013-2014 WAWAX
 * -----------------------------
 *
 * - Manage the data persistance with the local storage of the browser (Load / Save / Clean)
 *
 */
jQuery(function($) {
   
    var lsn = 'wx-widget-ui-backup'; //change to provide genericity 
    
    /**
	 * Save the settings on the local storage
	 */
	$.fn.uiSaveWidgetState = function(options) {
		var self = this;
		var datas = {};
		var keyID = lsn;
		if (!localStorage) {
			return false;
		}
		localStorage.setItem(keyID, JSON.stringify(options));
	};
    
	/**
	 * Load the settings from the local storage
	 */
	$.fn.uiLoadWidgetState = function() {
		var self = this;
		var options = new Object();
		var keyID = lsn;
		var options = localStorage.getItem(keyID);
		if (options != null) {
            self.heatmap('setOptions', JSON.parse(options)); //TODO - change to provide genericity
			return JSON.parse(options);
		}
		return null;
	};
    
	/**
	 * Delete the local storage
	 */
	$.fn.uiDeleteWidgetState = function(options) {
		var self = this;
		var keyID = lsn;
		if (!localStorage) {
			return false;
		}
		if(keyID != null)
			localStorage.removeItem(keyID);
	};

});