const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const cors = require('cors');


//set the app to express 
const app = express(); 

//allow cross origin requests from graphical, react and others 
app.use(cors());


//setting up mongoDB con
mongoose.connect('mongodb://alisherktest:alisherktest1@ds051833.mlab.com:51833/alisherktest', {useNewUrlParser:true}); 


//listening to open con
mongoose.connection.once('open', () => {
    console.log('connected to db');
})


//set up api with graphqlHTTP function that takes an object containing our graphQL schema
app.use('/graphql', graphqlHTTP({
    schema, 
    graphiql: true
}));

//setting a port 
const port = process.env.port || 4000; 

//starting and listening to open server
app.listen(port, () => {
    console.log(`listening on port ${port}`); 
});