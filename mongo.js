const mongoose = require('mongoose')

const arguments = process.argv.length
if (arguments < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://admin:${password}@fullstack.dk1kpdn.mongodb.net/phonebook?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})
const Person = mongoose.model('Person', personSchema)

mongoose.connect(url)
if (arguments === 3) {
  Person
    .find({})
    .then(persons => {
      console.log('Phonebook:')
      persons.forEach(person => {
        console.log(`${person.name} [${person.number}]`)
      })
      mongoose.connection.close()
    })
} else if (arguments === 5) {
  const name = process.argv[3]
  const number = process.argv[4]
  const person = new Person({
    name: name,
    number: number
  })
  person
    .save()
    .then(() => {
      console.log(`Added person ${person.name} with the number ${person.number} to the phonebook!`)
      mongoose.connection.close()
    })
} else {
  console.log('Unexpected number of arguments!')
  mongoose.connection.close()
}
