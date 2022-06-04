const mongoose = require('mongoose')

const url = process.env.MONGODB_URI
console.log('Connecting to', url)
mongoose.connect(url)
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    minlength: 3,
    required: true,
    type: String
  },
  number: {
    minlength: 8,
    required: true,
    type: String,
    validate: {
      validator: (number) => {
        return /^\d{2,3}-\d*$/.test(number)
      },
      message: 'Number format is not valid!'
    }
  }
})
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)
