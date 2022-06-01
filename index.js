const express = require('express')
const app = express()
app.use(express.json())

const morgan = require('morgan')
morgan.token('json', (request, response) => JSON.stringify(request.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :json'))

const cors = require('cors')
app.use(cors())

let persons = [
  { 
    "name": "Arto Hellas", 
    "number": "040-123456",
    "id": 1
  },
  { 
    "name": "Ada Lovelace", 
    "number": "39-44-5323523",
    "id": 2
  },
  { 
    "name": "Dan Abramov", 
    "number": "12-43-234345",
    "id": 3
  },
  { 
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122",
    "id": 4
  }
]

app.get('/', (request, response) => {
  response.redirect('/api/persons')
})

app.get('/info', (request, response) => {
  date = new Date()
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p>
     ${date}`
  )
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

const generateId = () => {
  return Math.floor(Math.random() * 999999)
}

const checkValidity = (request, response) => {
  let valid = true
  let error = ''

  const noName = !request.body.name
  const noNumber = !request.body.number
  const exists = persons.find(person => person.name === request.body.name)

  if (noName) {
    valid = false
    error = 'Name Missing!'
  } else if (noNumber) {
    valid = false
    error = 'Number missing!' 
  } else if (exists) {
    valid = false
    error = 'Person already exists!' 
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

  const person = {
    name: request.body.name,
    number: request.body.number,
    id: generateId()
  }

  persons = persons.concat(person)
  response.json(person)
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
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
