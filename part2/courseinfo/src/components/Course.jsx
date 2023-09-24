const Header = ({ course }) => <h2>{course}</h2>

const Part = ({ part }) => (
  <p>
    {part.name} {part.exercises}
  </p>
)

const Content = ({ parts }) => (
  <>
    {parts.map((part) => (
      <Part key={part.id} part={part} />
    ))}
  </>
)

const Total = ({ total }) => (
  <p>
    <strong>total of {total} exercises</strong>
  </p>
)

const Course = ({ course }) => {
  const total = course.parts
    .map((part) => part.exercises)
    .reduce((sum, cur) => sum + cur, 0)

  return (
    <div>
      <h1>Web development curriculum</h1>

      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total total={total} />
    </div>
  )
}

export default Course
