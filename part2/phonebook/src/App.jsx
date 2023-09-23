import { useEffect, useState } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    personService
      .getAll()
      .then((initialPersons) => {
        setPersons(initialPersons)
      })
      .catch((error) => {
        console.error(error)
      })
  }, [])

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
        })
        .catch((error) => {
          console.error(error)
        })
      setNewName('')
      setNewNumber('')
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
        setNewName('')
        setNewNumber('')
      })
      .catch((error) => {
        console.error(error)
      })
  }

  const removePerson = (person) => {
    const ok = window.confirm(`Delete ${person.name} ?`)

    if (ok) {
      personService
        .remove(person.id)
        .then(setPersons(persons.filter((p) => p.id !== person.id)))
        .catch((error) => {
          console.error(error)
        })
    }
  }

  const filterRule = (p) => p.name.toLowerCase().includes(filter.toLowerCase())
  const personsToShow = filter ? persons.filter(filterRule) : persons

  return (
    <div>
      <h2>Phonebook</h2>

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
