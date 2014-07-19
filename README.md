jquery-widget-heatmap
======================

heatmap widget for JQuery

A propos
--------------

This plugin is still in the early stage of his development.

You can find more advanced implementation there:
[Heatmap JS](http://www.patrick-wied.at/static/heatmapjs/)

The rendering is based on this source code:
[Heatmap with d3.js](http://bl.ocks.org/tjdecke/5558084)

Usage
--------------

```javascript
$('#wawax-widget-heatmap').heatmap({
  title : 'Analysis of office temperature',
  series : [{
      label : 'My office',
      serie : {
          fn : 'controlCSVHistorique',
          req : 'datas/data.csv'                            
      }
  }],
  colors : ["#aaffee", "#6EE6CE", "#2EC993", "#2EC99B", "#3EC92E", "#3EC92E", "#3EC92E", "#E0110D", "#A8100D"],                            
});
```

Online demo
--------------
[demo](http://apps.wawax.co/apps/heatmap/)


