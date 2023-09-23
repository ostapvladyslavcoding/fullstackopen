const PersonDetails = ({ person, removePerson }) => (
  <div>
    {person.name} {person.number}
    <button onClick={removePerson}>delete</button>
  </div>
)

export default PersonDetails
