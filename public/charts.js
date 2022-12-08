import * as ChartGeo from "chartjs-chart-geo";
import Chart from 'chart.js/auto';
import { BubbleMapController, ChoroplethController,ColorLogarithmicScale, GeoFeature, ColorScale, SizeScale, ProjectionScale } from 'chartjs-chart-geo';
Chart.register(BubbleMapController, ChoroplethController, ColorLogarithmicScale, GeoFeature, ColorScale, SizeScale, ProjectionScale);

//grafico barras
var years_all = JSON.parse(document.getElementById('data-years').dataset.test)
var years = []
var vals = []
for (const [key, value] of Object.entries(years_all)) {
  years.push(key)
  vals.push(value)
}

var data = {
    labels: years,
    datasets: [{
        label: "Contagem",
        backgroundColor: "rgba(255,99,132,0.2)",
        borderColor: "rgba(255,99,132,1)",
        borderWidth: 2,
        hoverBackgroundColor: "rgba(255,99,132,0.4)",
        hoverBorderColor: "rgba(255,99,132,1)",
        data: vals,
    }]
    };
    var options = {
    maintainAspectRatio: false,
    scales: {
        y: {
        stacked: true,
        grid: {
            display: true,
            color: "rgba(255,99,132,0.2)"
        }
        },
        x: {
        grid: {
            display: false
        }
        }
    }
    };
    new Chart('chart', {
    type: 'bar',
    options: options,
    data: data
    });

  //grafico geo
  var comperc = JSON.parse(document.getElementById('data-geo').dataset.test)
  
  fetch('https://unpkg.com/world-atlas/countries-50m.json').then((r) => r.json()).then((data) => {
      const countries = ChartGeo.topojson.feature(data, data.objects.countries).features;

  const chart = new Chart(document.getElementById("canvas").getContext("2d"), {
    type: 'choropleth',
    data: {
      labels: countries.map((d) => d.properties.name),
      datasets: [{
        label: 'Countries',
        data: countries.map((d) => ({
          feature: d,
          value: comperc[d.properties.name.toLowerCase().replace(/ /g, '').slice(0, 10)] == null ? 0 : comperc[d.properties.name.toLowerCase().replace(/ /g, '').slice(0, 10)]
        })),
      }]
    },
    options: {
      showOutline: true,
      showGraticule: true,
      plugins: {
        legend: {
          display: false
        },
      },
      scales: {
        xy: {
          projection: 'equalEarth'
        },color: {
          type: 'colorLogarithmic',
        }
      }
    }
  });
});