import PersonDetails from './PersonDetails'

const Persons = ({ personsToShow, removePerson }) =>
  personsToShow.map((person) => (
    <PersonDetails
      key={person.name}
      person={person}
      removePerson={() => removePerson(person.id)}
    />
  ))

export default Persons
