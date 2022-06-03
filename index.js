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

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({error: 'Unknown endpoint'})
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({error: 'Malformatted id'})
  }
  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
