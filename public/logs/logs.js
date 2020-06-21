const mymap = L.map('checkinMap').setView([0, 0], 1);
const attribution =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
//const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tileUrl = 'https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png';
const tiles = L.tileLayer(tileUrl, {
  attribution
});
tiles.addTo(mymap);

getAllData()

async function getAllData() {
  const response = await fetch('/api')
  const data = await response.json()
  console.log(data)

  const pointList = []


  data.map(item => {
    pointList.push([item.latitude, item.longitude])
    console.log(item)

    const marker = L.marker([item.latitude, item.longitude]).addTo(mymap);
    let txt = `I'm sitting out here at ${item.latitude}&deg;,  ${item.longitude}&deg;, on
    this ${item.weather.weather_code.value} day and it feels like ${item.weather.temp.value}&deg; outside.`;

    if (item.air.value < 0) {
      txt += '  No air quality reading.';
    } else {
      txt += `  
      The concentration of small carcinogenic particles (${item.air.measurements[0].parameter}) I'm
        breathing in is  ${item.air.measurements[0].value} ${
        item.air.measurements[0].unit
      } measured from
       ${item.air.city} at ${item.air.location} on ${item.air.measurements[0].lastUpdated}.`;
    }
    //Leaflet.js binPopup
    marker.bindPopup(txt);
  })

  const polyLine = new L.Polyline(pointList, {
    color: 'green',
    weight: 2,
    opacity: 1,
    smoothFactor: 1
  });
  polyLine.addTo(mymap);
}