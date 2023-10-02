import { useEffect, useState } from 'react'

import Filter from './components/Filter'
import Notification from './components/Notification'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [info, setInfo] = useState({ message: null })

  useEffect(() => {
    personService
      .getAll()
      .then((initialPersons) => {
        setPersons(initialPersons)
      })
      .catch((error) => {
        console.error(error.response.data.error)
      })
  }, [])

  const clearFields = () => {
    setNewName('')
    setNewNumber('')
  }

  const infoMessage = (message, type = 'info') => {
    setInfo({
      message,
      type,
    })

    setTimeout(() => {
      setInfo({ message: null })
    }, 5000)
  }

  const updatePerson = (person) => {
    const ok = window.confirm(
      `${newName} is already added to phonebook, replace the old number with a new one?`
    )

    if (ok) {
      personService
        .update(person.id, { ...person, number: newNumber })
        .then((updatedPerson) => {
          setPersons(
            persons.map((p) => (p.id !== person.id ? p : updatedPerson))
          )
          clearFields()
          infoMessage(`Updated ${updatedPerson.name}`)
        })
        .catch((error) => {
          console.error(error)
          setPersons(persons.filter((p) => p.id !== person.id))
          clearFields()
          infoMessage(error.response.data.error, 'error')
        })
    }
  }

  const addPerson = (event) => {
    event.preventDefault()
    const person = persons.find(
      (p) => p.name.toLowerCase() === newName.toLowerCase()
    )
    if (person) {
      updatePerson(person)
      return
    }

    const newPersonObject = {
      name: newName,
      number: newNumber,
    }
    personService
      .create(newPersonObject)
      .then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson))
        clearFields()
        infoMessage(`Added ${returnedPerson.name}`)
      })
      .catch((error) => {
        console.error(error)
        clearFields()
        infoMessage(error.response.data.error, 'error')
      })
  }

  const removePerson = (person) => {
    const ok = window.confirm(`Delete ${person.name} ?`)

    if (ok) {
      personService
        .remove(person.id)
        .then(() => {
          setPersons(persons.filter((p) => p.id !== person.id))
          infoMessage(`Deleted ${person.name}`)
        })
        .catch((error) => {
          console.error(error)
          setPersons(persons.filter((p) => p.id !== person.id))
          infoMessage(error.response.data.error, 'error')
        })
    }
  }

  const filterRule = (p) => p.name.toLowerCase().includes(filter.toLowerCase())
  const personsToShow = filter ? persons.filter(filterRule) : persons

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification info={info} />

      <Filter
        filter={filter}
        setFilter={setFilter}
      />

      <h3>add a new</h3>

      <PersonForm
        addPerson={addPerson}
        newName={newName}
        setNewName={setNewName}
        newNumber={newNumber}
        setNewNumber={setNewNumber}
      />

      <h3>Numbers</h3>

      <Persons
        personsToShow={personsToShow}
        removePerson={removePerson}
      />
    </div>
  )
}

export default App
