/**
 * WAWAX Widget Heatmap
 * -----------------------------
 *
 * Last changed: $LastChangedDate$
 * @author Antoine Sauvage
 * @version $Revision$
 *
 * -----------------------------
 *
 * Heatmap cartography. 
 * x axis are hours and y axis are days. Intersection is mean value.
 *
 */
(function($) {

	$.widget("wawax.heatmap", {

		/**
		 * ========================================================================
		 *
		 * Options
		 *
		 * ========================================================================
		 */
		options : {
			title : 'Cartographie',
			series : null,
			colors : ["#aaffee", "#00aa88", "#87de87", "#55ff55", "#d4ff2a", "#ffd42a", "#ff6600", "#ff5555", "#ff0000"],
			timesync : 0, //pour recaler les horloges
            filters : {
				maxdatas : {
					max: 1000
				}
			}
		},

		/**
		 * ========================================================================
		 *
		 * Properties
		 *
		 * ========================================================================
		 */
        widgetID : null,
		mySeries : new Array(),
        
		uiContent : null,
		uiWidgetWidth : 700,
		uiWidgetHeight : 410,
		uiTitle : null,		
		uiChart : null,
		uiSVG : null,
		
        days : ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
		times : ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"],
		startdate : null,
		enddate : null,
		midval : null,

		/**
		 * ========================================================================
		 *
		 * Create widget shell
		 *
		 * ========================================================================
		 */
		_create : function() {
			var self = this, el = self.element;
			el.addClass('wx-ui-bloc');
			self.widgetID = el.attr('id');
		},
		
		
		/**
		 * ========================================================================
		 *
		 * Init the widget
		 *
		 * ========================================================================
		 */
		_init : function() {
			var self = this, o = self.options, el = self.element;
                
            //Title div
            self.uiTitle = $('<div id="wx-ui-bloc-title-' + self.widgetID + '">' + o.title + '</div>').appendTo(el).addClass('ui-bar-a  wx-ui-bloc-title');
            
			//Content div and Chart div
			self.uiContent = $('<div id="wx-ui-bloc-content-' + self.widgetID + '"></div>').appendTo(el).addClass('wx-ui-bloc-content');
			self.uiChart = $('<div id="wx-ui-chart-' + self.widgetID + '" style="width:100%;"></div>').appendTo(self.uiContent);
            
            //Set widget size
            self.uiWidgetWidth = self.uiChart.width();
            self.uiWidgetHeight = self.uiWidgetWidth * 0.4;
           
			//Call M2M proxy to get the datas
            //Pass in argument filters to apply before loading the dataset to inscrease responsivness
			if (o.series != null) {
				for (var i = 0; i < o.series.length; i++) {
					var tb = o.series[i];

					var labelName = tb.label;
					var fn = tb.serie.fn;
					var req = tb.serie.req;
					
					//Call m2m proxy ps: fn is the name of the javascript function to call 
					(self.uiContent[fn])(req, o.filters.maxdatas.max);

					//Once the data are loaded by the M2M proxy delegate the event through a jquery proxy to pass the index of the getted serie
					self.uiContent.bind('wxHistoDataSetLoaded', $.proxy(self, '_updateGraphic', i));
				}
			}
            
            //redraw
            $(window).bind('resize', function(e)
            {
              //console.log('window resized ...');
              self._updateGraphic();
            });
		},

        /**
		 * ========================================================================
		 *
		 * Built the graphical component
		 *
		 * ========================================================================
		 */
        _updateGraphic : function(index) {//index is ignored in this code should only be used with one dataset
            var self = this, o = self.options, el = self.element;
            
            //If the call is made with an empty array so just refresh the graphical part
            var dataSet = Array.prototype.slice.call(arguments, 2);
            if(dataSet != [] && index != null){
                self.mySeries = dataSet;
                self.mySeries = self._buildMatrix(dataSet);
            }
            
            //reset widget size and clean container
            $('#wx-ui-chart-' + self.widgetID).empty();
            self.uiWidgetWidth = self.uiChart.width();
            self.uiWidgetHeight = self.uiWidgetWidth * 0.4;
                      
            try{
                /** Start of imported code to build the graphical view */
                var minimum = d3.min(self.mySeries, function(d) {
                    if (d != null){
                        return parseInt(d.min);
                    }
                });
                var maximum = d3.max(self.mySeries, function(d) {
                    if (d != null){
                        return parseInt(d.max);
                    }
                });
                self.midval = (maximum + minimum) / 2;

                // legend positioning
                var margin = {
                        top : 50,
                        right : 0,
                        bottom : 100,
                        left : 30
                    }, 
                    //width = self.uiWidgetWidth - margin.left - margin.right, 
                    //height = self.uiWidgetHeight - margin.top - margin.bottom, 
                    width = self.uiWidgetWidth - margin.left - margin.right, 
                    height = self.uiWidgetHeight + margin.top - margin.bottom, 
                    gridSize = Math.floor(width / 24), 
                    legendElementWidth = gridSize * 2, 
                    buckets = 9;
                
                var colorScale = d3.scale.quantile()
                    .domain([self.midval, buckets - 1, d3.max(self.mySeries, function(d) {
                        if (d != null)
                            return parseInt(d.mean);
                    })])
                    .range(o.colors);

                self.uiSVG = d3.select('#wx-ui-chart-' + self.widgetID).append("svg").attr("id", 'svg_render_' + self.widgetID)
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                var dayLabels = self.uiSVG.selectAll(".wx-ui-widget-heatmap-dayLabel")
                    .data(self.days).enter().append("text")
                    .text(function(d) {
                        if (d != null)
                        return d;
                    })
                    .attr("x", 0).attr("y", function(d, i) {
                        if (d != null)
                            return i * gridSize;
                    })
                    .style("text-anchor", "end")
                    .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
                    .attr("class", function(d, i) {
                        if (d != null)
                            return ((i >= 1 && i <= 5) ? "wx-ui-widget-heatmap-dayLabel wx-ui-widget-heatmap-text-mono wx-ui-widget-heatmap-text-axis wx-ui-widget-heatmap-text-axis-workweek" : "wx-ui-widget-heatmap-dayLabel wx-ui-widget-heatmap-text-mono wx-ui-widget-heatmap-text-axis");
                    });

                var timeLabels = self.uiSVG.selectAll(".wx-ui-widget-heatmap-text-timeLabel")
                    .data(self.times).enter().append("text").text(function(d) {
                        if (d != null)
                            return d;
                    })
                    .attr("x", function(d, i) {
                        if (d != null)
                            return i * gridSize;
                    })
                    .attr("y", 0)
                    .style("text-anchor", "middle")
                    .attr("transform", "translate(" + gridSize / 2 + ", -6)")
                    .attr("class", function(d, i) {
                        if (d != null)
                        return ((i >= 7 && i <= 18) ? "wx-ui-widget-heatmap-text-timeLabel wx-ui-widget-heatmap-text-mono wx-ui-widget-heatmap-text-axis wx-ui-widget-heatmap-text-axis-worktime" : "wx-ui-widget-heatmap-text-timeLabel wx-ui-widget-heatmap-text-mono wx-ui-widget-heatmap-text-axis");
                });

                var heatMap = self.uiSVG.selectAll(".hour")
                    .data(self.mySeries)
                    .enter()
                    .append("rect")
                    .attr("x", function(d) {
                        if (d != null){
                            return (d.hour) * gridSize;
                        }
                    })
                    .attr("y", function(d) {
                        if (d != null)
                            return (d.day) * gridSize;
                    })
                    .attr("rx", 4).attr("ry", 4)
                    .attr("class", "wx-ui-widget-heatmap-text-hour wx-ui-widget-heatmap-rect-bordered")
                    .attr("width", gridSize)
                    .attr("height", gridSize)
                    .style("fill", o.colors[0]);

                heatMap.transition()
                    .duration(500)
                    .style("fill", function(d) {
                        if (d != null && d.mean != null)
                            return colorScale(d.mean);
                        else return "#fff";
                    });

                heatMap.append("title").text(function(d) {
                    if (d != null)
                        return d.mean;
                });

                var legend = self.uiSVG.selectAll(".wx-ui-widget-heatmap-text-legend")
                    .data([0].concat(colorScale.quantiles()), function(d) {
                        if (d != null)
                            return d;
                    })
                    .enter()
                    .append("g").attr("class", "wx-ui-widget-heatmap-text-legend");

                legend.append("rect").attr("x", function(d, i) {
                    if (d != null)
                        return legendElementWidth * i;
                }).attr("y", height).attr("width", legendElementWidth).attr("height", gridSize / 2).style("fill", function(d, i) {
                    if (d != null)
                        return o.colors[i];
                });

                //CSS customization
                legend.append("text").attr("class", "wx-ui-widget-heatmap-text.mono").text(function(d) {
                    if (d != null)
                        return "≥ " + Math.round(d);
                }).attr("x", function(d, i) {
                    if (d != null)
                        return legendElementWidth * i;
                }).attr("y", height + gridSize);
                /** End of imported code to build a svg matrix */
            }
            catch(err){
                console.log(err);
            }
        },
        
       
        /**
		 * ========================================================================
		 *
		 * Built a matrix representation of the source datas
         * matrix[days][hours]
		 *
		 * ========================================================================
		 */
        _buildMatrix : function(datasrc) {

            var matrice = new Array();
			
            //create an empty matrix [Day][Hour] containing an Object representing the analysed data
            for (var i = 0; i <= 6; i++) {
                for (var j = 0; j <= 23; j++) {
                    if (!matrice[i])
                        matrice[i] = new Array();
                    var tmpObj = new Object({
                        day : null,
                        hour : null,
                        sum : null,
                        nbValue : null,
                        min : null,
                        max : null,
                        mean : null
                    });
                    matrice[i][j] = tmpObj;
                }
            }

            var tmpValue = null;

            //datas are inline we want to construct a matrix to aggregate the values
            for (var i = 0; i < datasrc.length; i++) {

                try {
                    var date = new Date((datasrc[i]).timestamp);
                    var valeur = parseFloat((datasrc[i]).value);

                    var indexJ = parseInt(date.getDay());
                    var indexH = parseInt(date.getHours());

                    tmpValue = matrice[indexJ][indexH];
                    if (tmpValue.sum != null) {
                        if(valeur != null){
                            tmpValue.sum += valeur;
                            tmpValue.nbValue += 1;
                        }

                        var tmpObj = new Object({
                            day : indexJ,
                            hour : indexH,
                            sum : tmpValue.sum,
                            nbValue : tmpValue.nbValue,
                            min : tmpValue.min,
                            max : tmpValue.max,
                            mean : null
                        });
                        if(valeur != null){
                            if (valeur > tmpObj.max) {
                                tmpObj.max = valeur;
                            }
                            if (valeur < tmpObj.min) {
                                tmpObj.min = valeur;
                            }
                        }
                        matrice[indexJ][indexH] = tmpObj;
                    } else {//first time
                        var jsonMel = new Object({
                            day : indexJ,
                            hour : indexH,
                            sum : valeur,
                            nbValue : 1,
                            min : valeur,
                            max : valeur,
                            mean : null
                        });
                        matrice[indexJ][indexH] = jsonMel;
                    }
                }
                catch(err) {
                    console.log("No data could be accessed at this index. "+err);
                }
                
            }
            
            //flatten the matrix and calculate the desired value (here mean value)
            var k = 0;
            var dataJ = new Array();

            try {
                for (var i = 0; i < matrice.length; i++) {
                    for (var j = 0; j < matrice[i].length; j++) {
                        var obj = matrice[i][j];

                        try {
                            var jsonMel = new Object({
                                day : obj.day,
                                hour : obj.hour,
                                sum : (obj.sum).toFixed(1),
                                mean : (obj.sum / obj.nbValue).toFixed(1),
                                min : (obj.min).toFixed(1),
                                max : (obj.max).toFixed(1)
                            });
                        } catch(err) {
                            jsonMel = new Object({
                                day : obj.day,
                                hour : obj.hour,
                                sum : null,
                                mean : null,
                                min : null,
                                max : null
                            });
                        }
                        dataJ[k] = jsonMel;
                        k++;
                    }
                }
            }
            catch(err) {
                console.log("An error occured during flattering the dataset. "+err);
            }

            return dataJ;
        },
        
        /**
		 * ========================================================================
		 *
		 * Manipulate the options after loading and refresh
		 *
		 * ========================================================================
		 */
        _setOption: function( key, value ) {
        if ( key === "value" ) {
            value = this._constrain( value );
        }
        this._super( key, value );
        },
        _setOptions: function( options ) {
            this._super( options );
            this.refresh();
        },
        refresh: function() {
            //TODO
        }
        
	});

})(jQuery);
