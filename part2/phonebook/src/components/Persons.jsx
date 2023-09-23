import PersonDetails from './PersonDetails'

const Persons = ({ personsToShow, removePerson }) => (
  <div>
    {personsToShow.map((person) => (
      <PersonDetails
        key={person.id}
        person={person}
        removePerson={() => removePerson(person)}
      />
    ))}
  </div>
)

export default Persons
