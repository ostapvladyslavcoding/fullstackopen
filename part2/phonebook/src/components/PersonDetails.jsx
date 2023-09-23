const PersonDetails = ({ person, removePerson }) => (
  <p>
    {person.name} {person.number}
    <button onClick={removePerson}>delete</button>
  </p>
)

export default PersonDetails
