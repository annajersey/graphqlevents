const Event = require('../../models/event');
const User = require('../../models/user');
const bcrypt = require('bcryptjs')
const events = async eventIds => {
    try {
        const events = await Event.find({_id: {$in: eventIds}})
        return events.map(event => {
            return {
                ...event._doc,
                _id: event.id,
                date: new Date(event._doc.date).toString(),
                creator: user.bind(this, event.creator)
            }
        })
    } catch (err) {
        throw err;
    }
};

const user = async userId => {
    try {
        const user = await User.findById(userId)
        return {
            ...user._doc,
            _id: user.id,
            createdEvents: events.bind(this, user._doc.createdEvents)
        }
    } catch (e) {
        throw(e)
    }
}

module.exports = {
    createEvent: async args => {
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: "5ce8ff06101c631b5ca6c998"
        });
        let createdEvent;
        try {
            const result = await event.save()
            createdEvent = {
                ...result._doc,
                _id: result._doc._id.toString(),
                date: new Date(event._doc.date).toString(),
                creator: user.bind(this, result._doc.creator)
            }
            const creator = await User.findById('5ce8ff06101c631b5ca6c998')
            if (!creator) {
                throw new Error('User does not exists');
            }
            creator.createdEvents.push(event);
            await creator.save();
            return createdEvent
        } catch (err) {
            throw(err);
        }

    },
    createUser: async args => {
        try {
            const existingUser = await User.findOne({email: args.userInput.email})
            if (existingUser) {
                throw new Error('User exists already')
            }
            const hashedPassword = bcrypt.hash(args.userInput.password, 12)
            const user = new User({
                email: args.userInput.email,
                password: args.userInput.password
            });
            const result = await user.save()

            return {...result._doc, password: null, _id: result.id}
        } catch (err) {
           throw(err)
        }
    },
    events: async () => {
        try {
            const events = await Event.find()
            return events.map(event => {
                return {
                    ...event._doc,
                    _id: event.id,
                    date: new Date(event._doc.date).toString(),
                    creator: user.bind(this, event._doc.creator)
                }
            });
        } catch (err) {
            console.log(err)
        }

    }
};