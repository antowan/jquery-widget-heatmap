/**
 * wawax.control.m2m.bajascript
 * -----------------------------
 * 
 * Last changed: $LastChangedDate$
 * 
 * @author Antoine SAUVAGE
 * @version 1.0
 * 
 * Copyright (c) 2013-2014 WAWAX 
 * -----------------------------
 * 
 * Proxy M2M BAJASCRIPT
 * 
 */
jQuery(function($) {

	/**
	 * Read datapoint value from Niagara station
	 * 
	 * @param {Object}
	 *            path : ord
	 * @param {Object}
	 *            option : facet //TODO
	 */
	$.fn.controlBajaReadDataPoint = function(path, option) {
		var control = this;
		var sub = new baja.Subscriber();
		var update = function() {
			var value = null;
			if (option == 1) {//full string display
				value = this.getOutDisplay();
				control.trigger('ReadDataPointUpdate', value.toFixed(1) + '');
			} else {//just the value
				value = this.getOut().getValue();
				control.trigger('ReadDataPointUpdate', value.toFixed(1) + '');
			}
		};
		sub.attach("changed", update);
		baja.Ord.make(path).get({
			subscriber : sub
		});
	};
	
	/**
	 * Write datapoint on the station
	 * 
	 * @param {Object}
	 *            path : ord
	 * @param {Object}
	 *            myValue : numeric value //TODO precise type
	 * @param {Object}
	 *            options : null //TODO {type, priority, ...}
	 */
	$.fn.controlBajaWriteDataPoint = function(path, myValue, options) {
		var control = this;
		var writeVal = myValue;
		baja.Ord.make(path).get({
			ok : function(point) {
				point.setFallback(baja.$("baja:StatusNumeric", {
					value : writeVal
				}));
				control.trigger('WriteDataPointUpdate', writeVal);
			}
		});
	};
	
	/**
	 * Read Niagara historian
	 * 
	 * @param {Object}
	 *            req : ord to an historian
	 * @param {Object}
	 *            option : null //TODO
	 */
	$.fn.controlBajaHistory = function(req, option) {
		var control = this;
		var myTable = new Array();
		var i = 0;

		baja.Ord.make(req).get(
		{
			ok : function(result) {
				baja.iterate(result.getColumns(), function(c) {
				});
			},
			cursor : {
				before : function() {
				},
				after : function() {
					control.trigger('HistoDataSetLoaded', myTable);
					console.log(myTable);
				},
				each : function() {
					myTable[i] = new Object({
						timestamp : this.get("timestamp").getJsDate()
								.getTime(),
						value : this.get("value")
					});
					i++;
				},
				limit : option,
				offset : 0
			}
		});
	};
});
