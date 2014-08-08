/**
 * WAWAX control M2M
 * -----------------------------
 *
 * Last changed: $LastChangedDate$
 * @author $Author$
 * @version $Revision$
 *
 * Copyright (c) 2013-2014 WAWAX
 * -----------------------------
 *
 * Proxy M2M BAJASCRIPT
 * 
 */
jQuery(function($) {


 /**
  * ========================================================================
  *
  * PROXY M2M BAJASCRIPT
  *
  * Lecture : controlBajaReadDataPoint (tous formats)
  * Ecriture : controlBajaWriteDataPoint (à préciser le type de données en paramètre)
  * Requetage des historiques : controlBajaHistorique (à préciser la requete en paramètre et la taille max.)
  *
  * ========================================================================
  */

 /**
  * Read datapoint value from Niagara station element
  * @param {Object} path : adresse du point
  * @param {Object} option : type d'affichage en sortie (gestion de la facet)
  */
 $.fn.controlBajaReadDataPoint = function(path, option) {
  var control = this;
  var sub = new baja.Subscriber();
  var update = function() {
   var value = null;
   if (option == 1) {
    value = this.getOutDisplay();
    control.trigger('ReadDataPointUpdate', value.toFixed(1) + '');
   } else {
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
  * Ecrit sur une variable baja
  * Spécifier le niveau de priorité dans options par exemple ... !
  * De même préciser le type de données (num, bool, enum, string)
  * @param {Object} path : adresse du point
  * @param {Object} myValue : valeur à écrire
  * @param {Object} options : liste des options {type, priority}
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
  * Lecture des historiques bajascript
  * @param {Object} req
  * @param {Object} option
  */
 $.fn.controlBajaHistory = function(req, option) {
  var control = this;
  var myTable = new Array();
  var i = 0;

  baja.Ord.make(req).get({
   ok : function(result) {
    baja.iterate(result.getColumns(), function(c) {
    });
   },
   cursor : {
    before : function() {
    },
    after : function() {
     control.trigger('wxHistoDataSetLoaded', myTable);
     console.log(myTable);
    },
    each : function() {
     myTable[i]= new Object({
      timestamp : this.get("timestamp").getJsDate().getTime(),
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
