/**
 * wawax.control.m2m.csv
 * -----------------------------
 * 
 * Last changed: $LastChangedDate$
 * 
 * @author Antoine Sauvage
 * @version $Revision$
 * 
 * -----------------------------
 * 
 * M2M data paroxy for CSV files
 * 
 */
jQuery(function($) {

	/**
	 * ========================================================================
	 * 
	 * PROXY M2M CSV
	 * 
	 * + TODO
	 * 		Check timezone area to shift with the good local time
	 * 
	 * ========================================================================
	 */

	/**
	 * CSV historian
	 * 
	 * @param {file_path}
	 *            path of a csv file well formated
	 * @param {int}
	 *            option maximum data to load
	 */
	$.fn.controlCSV = function(path, option) {
		var control = this;
		d3.csv(path, function(d) {
			return {
				timestamp : new Date(d.Timestamp).getTime(),
				value : d.Value
			};
		}, function(error, rows) {
			control.trigger('wxHistoDataSetLoaded', rows);
		});
	};
});