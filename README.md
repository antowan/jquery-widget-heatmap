jquery-widget-heatmap
======================

heatmap widget for JQuery

A propos
--------------

My primaraly goal was develop a widget as much as possible idependant from his own data source.
Todo so I had choosen to develop this widget with the widget factory provided by JQuery UI and I had my own logic to get binded with a proxy in charge to notify the widget with the dataset.
The proxy is passed in parameter of the widget. In this version I used d3.js to proxy csv data files.

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
[demo on my website](http://apps.wawax.co/apps/heatmap/)


Contact
--------------
Please feel free to contact me if you want to improve this open source development.


