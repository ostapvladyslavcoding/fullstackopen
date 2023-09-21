import PersonDetails from './PersonDetails'

const Persons = ({ personsToShow }) =>
  personsToShow.map((person) => (
    <PersonDetails
      key={person.name}
      person={person}
    />
  ))

export default Persons
