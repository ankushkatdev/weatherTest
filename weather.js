const GOOGLE_API_KEY = 'AIzaSyCxhHULsqibUfHdQgeL4K9mJIjM3HNDFY0'
const WEATHER_API_KEY = 'b97fee70edd9cf03ef482ca6aefade98'
const ADDRESSES = ["New York", "Tokyo", "São Paulo"]

const getGeocodeApiURL = address => {
  return `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${GOOGLE_API_KEY}`
}

const getWeatherApiURL = (lat, lng) => {
  return `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&APPID=${WEATHER_API_KEY}`
}

const getGeoCoordinates = (address, callback) => {
  const request = new XMLHttpRequest()
  request.open('GET', getGeocodeApiURL(address), true)
  request.onreadystatechange = function () {
    if (request.readyState === XMLHttpRequest.DONE) {
      const data = JSON.parse(request.response)
      if (request.status >= 200 && request.status < 400 && data.status === 'OK') {
        const coordinates = data.results[0].geometry.location
        callback.apply(this, [address, coordinates])
      } else {
        console.log('Error: Invalid Address.')
      }
    }
  }
  request.send()
}

const displayWeatherDetails = address => {
  getGeoCoordinates(address, getWeatherDetails)
}

function getWeatherDetails(address, coordinates) {
  const { lat, lng } = coordinates
  const request = new XMLHttpRequest()
  request.open('GET', getWeatherApiURL(lat, lng), true)
  request.onreadystatechange = () => {
    if (request.readyState === XMLHttpRequest.DONE) {
      if (request.status >= 200 && request.status < 400) {
        const data = JSON.parse(request.response)
        const city = address
        const weatherInfo = data.weather.map((w) => w.description).join(', ')
        const temperature = `${data.main.temp} Kelvin`
        const minTemperature = `${data.main.temp_min} Kelvin`
        const maxTemperature = `${data.main.temp_max}Kelvin`
        const humidity = `${data.main.humidity}%`
        const targetDate = new Date()
        const timestamp = targetDate.getTime() / 1000 + targetDate.getTimezoneOffset() * 60
        const offset = data.timezone * 1000
        const localdate = new Date(timestamp * 1000 + offset)
        const currentTime = localdate.toLocaleString()
        const windSpeed = `${data.wind.speed} meter/sec`
        const jsonData = {
          city,
          currentTime,
          weatherInfo,
          temperature,
          minTemperature,
          maxTemperature,
          humidity,
          windSpeed
        }
        console.log(jsonData)
      } else {
        console.log('Error: Weather Info not found.')
      }
    }
  }
  request.send()
}

ADDRESSES.forEach(address => {
  displayWeatherDetails(address)
})