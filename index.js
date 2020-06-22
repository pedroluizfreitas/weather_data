const express = require('express')
const Datastore = require('nedb')
const fetch = require('node-fetch')
require('dotenv').config()

const app = express()
const db = new Datastore('database.db')
db.loadDatabase()
const port = process.env.PORT || 3000

app.listen(port, () => console.log(`Starting the server at ${port}`))
app.use(express.static('public'))
app.use(express.json({
  limit: "1mb"
}))

app.get('/', function (request, response) {
  response.redirect('/api');
});

app.get('/api', (request, response) => {
  db.find({}, (err, data) => {
    if (err) {
      response.end()
      return
    }
    response.json(data)
  })
})

app.post('/api', (request, response) => {
  console.log('I got a request')

  const serverData = request.body
  console.log(serverData)
  const timestamp = Date.now()
  serverData.timestamp = timestamp

  db.insert(serverData)
  response.json(serverData)
})

app.get('/weatherapi/:latlon', async (request, response) => {
  const latlon = request.params.latlon.split(',')
  const latitude = latlon[0]
  const longitude = latlon[1]
  const api_key = process.env.API_KEY

  const weather_url = `https://api.climacell.co/v3/weather/realtime?lat=${latitude}&lon=${longitude}&fields%5B%5D=temp&fields%5B%5D=weather_code&fields%5B%5D=feels_like&fields%5B%5D=precipitation_type&apikey=${api_key}`
  const weather_response = await fetch(weather_url)
  const weather_data = await weather_response.json()

  const aq_url = `https://api.openaq.org/v1/latest?coordinates=${latitude},${longitude}`
  const aq_response = await fetch(aq_url)
  const aq_data = await aq_response.json()

  const data = {
    weather: weather_data,
    air_quality: aq_data
  }

  response.json(data)

})