/**
 * wawax.control.m2m.csv
 * -----------------------------
 * 
 * Last changed: $LastChangedDate$
 * 
 * @author Antoine Sauvage
 * @version 1.0
 * 
 * -----------------------------
 * 
 * M2M data paroxy for CSV files
 * 
 */
jQuery(function($) {

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