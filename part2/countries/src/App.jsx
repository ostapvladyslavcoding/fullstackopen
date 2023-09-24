import { useState, useEffect } from 'react'
import axios from 'axios'

const Country = ({ country }) => {
  const capital = country.capital[0]
  const area = country.area
  const languages = Object.values(country.languages)
  const flag = country.flags.png

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
    </div>
  )
}

const CountryList = ({ countries }) => {
  if (countries.length > 10) {
    return <div>Too many matches, specify another filter</div>
  }
  if (countries.length === 1) {
    return <Country country={countries[0]} />
  } else {
    return (
      <div>
        {countries.map((country) => (
          <p key={country.name.official}>{country.name.common}</p>
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
      <CountryList countries={searchedCountries} />
    </div>
  )
}

export default App
