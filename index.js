require('dotenv').config()

const express = require('express')
const app = express()
app.use(express.json())
app.use(express.static('build'))

const morgan = require('morgan')
morgan.token('json', (request, response) => JSON.stringify(request.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :json'))

const cors = require('cors')
app.use(cors())

const Person = require('./models/person')

app.get('/info', (request, response) => {
  date = new Date()
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p>
     ${date}`
  )
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

const checkValidity = (request, response) => {
  let valid = true
  let error = ''

  const noName = !request.body.name
  const noNumber = !request.body.number

  if (noName) {
    valid = false
    error = 'Name Missing!'
  } else if (noNumber) {
    valid = false
    error = 'Number missing!' 
  }

  if (!valid) {
    return response.status(400).json({ 
      error: `${error}` 
    })
  }
}

app.post('/api/persons', (request, response) => {
  if (checkValidity(request, response)) {
    return
  }

  const person = new Person({
    name: request.body.name,
    number: request.body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
