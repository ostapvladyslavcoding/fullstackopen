import { useState, useEffect } from 'react'
import axios from 'axios'

const Country = ({ country }) => {
  const [weather, setWeather] = useState(null)
  const capital = country.capital[0]
  const area = country.area
  const languages = Object.values(country.languages)
  const flag = country.flags.png

  useEffect(() => {
    const API_KEY = import.meta.env.VITE_SOME_KEY
    const lat = country.capitalInfo.latlng[0]
    const lon = country.capitalInfo.latlng[1]
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    axios.get(url).then((response) => {
      setWeather(response.data)
    })
  }, [])

  if (!weather) {
    return null
  }

  const icon = weather.weather[0].icon
  const weatherIcon = `http://openweathermap.org/img/wn/${icon}@2x.png`

  return (
    <div>
      <h2>{country.name.common}</h2>

      <p>capital {capital}</p>
      <p>area {area}</p>

      <strong>languages:</strong>
      <ul>
        {languages.map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <img
        src={flag}
        width='200'
      />

      <p>
        <strong>Weather in {capital}</strong>
      </p>

      <p>temperature {weather.main.temp} Celsius</p>

      <img src={weatherIcon} />

      <p>wind {weather.wind.speed} m/s</p>
    </div>
  )
}

const CountryList = ({ countries, handleShowCountry }) => {
  if (countries.length > 10) {
    return <div>Too many matches, specify another filter</div>
  }
  if (countries.length === 1) {
    return <Country country={countries[0]} />
  } else {
    return (
      <div>
        {countries.map((country) => (
          <p key={country.name.official}>
            {country.name.common}
            <button onClick={() => handleShowCountry(country.name.common)}>
              Show
            </button>
          </p>
        ))}
      </div>
    )
  }
}

const App = () => {
  const [search, setSearch] = useState('')
  const [countries, setCountries] = useState(null)

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then((response) => {
        setCountries(response.data)
      })
  }, [])

  if (!countries) return null

  const searchedCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div>
        find countries
        <input
          value={search}
          onChange={({ target }) => setSearch(target.value)}
        />
      </div>
      <CountryList
        countries={searchedCountries}
        handleShowCountry={setSearch}
      />
    </div>
  )
}

export default App
