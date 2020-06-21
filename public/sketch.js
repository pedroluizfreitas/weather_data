let latitude, longitude
if ('geolocation' in navigator) {
  console.log("geolocation is available")
  navigator.geolocation.getCurrentPosition(async position => {
    let latitude, longitude, air, weather
    try {

      latitude = position.coords.latitude
      longitude = position.coords.longitude
      document.getElementById('lat').textContent = latitude.toFixed(3)
      document.getElementById('lon').textContent = longitude.toFixed(3)

      const api_url = `weatherapi/${latitude},${longitude}`
      const response = await fetch(api_url)
      const json = await response.json()
      // console.log(json) 

      weather = json.weather

      document.getElementById('summary').textContent = weather.weather_code.value
      document.getElementById('temp').textContent = weather.temp.value

      air = json.air_quality.results[0]

      document.getElementById('aq_city').textContent = air.city
      document.getElementById('aq_location').textContent = air.location
      document.getElementById('aq_parameter').textContent = air.measurements[0].parameter
      document.getElementById('aq_value').textContent = air.measurements[0].value
      document.getElementById('aq_units').textContent = air.measurements[0].unit
      document.getElementById('aq_date').textContent = air.measurements[0].lastUpdated

    } catch (error) {
      console.error(error)
      air = {
        value: -1
      }
      document.getElementById('air').textContent = "No air quality reading was found"
    }

    const positions = {
      latitude,
      longitude,
      weather,
      air
    }

    const options = {
      method: "POST",
      body: JSON.stringify(positions),
      headers: {
        'Content-Type': 'application/json'
      },
    }

    const db_response = await fetch('/api', options)
    const jsondata = await db_response.json()
    console.log(jsondata)
  })

} else {
  console.log("gelocation IS NOT available")
}