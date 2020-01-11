const mongodb = require('mongodb')

const connectionString = 'mongodb+srv://toDoAppUser:87654321@cluster0-sojjx.mongodb.net/facemash?retryWrites=true&w=majority'

mongodb.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, client) {
    module.exports = client.db()
    const app = require('./app')
    app.listen(3000)
}) 