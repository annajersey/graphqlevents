const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const {buildSchema} = require('graphql');
const app = express();
const events = [];
const mongoose = require('mongoose');
app.use(bodyParser.json());
app.use('/graphql', graphqlHttp({
    schema: buildSchema(`
    type Event {
        _id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
    }
    input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
    }
    type RootQuery{
        events: [Event!]!
    }
    
    type RootMutation{
         createEvent(eventInput: EventInput!): Event
    }
        schema {
        query: RootQuery
        mutation: RootMutation
        }
    `),
    rootValue: {
        createEvent: (args) => {
            const event = {
                _id: Math.random().toString(),
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: args.eventInput.date,
            };
            events.push(event);
            return event;
        },
        events: () => {
            return events;
        }
    },
    graphiql: true
}))

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${
    process.env.MONGO_PASSWORD
}@cluster0-7gjs9.mongodb.net/test?retryWrites=true`).then(()=>{
    app.listen(3000);
}).catch(err => console.log(err))
