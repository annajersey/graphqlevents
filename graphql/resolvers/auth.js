const User = require('../../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


module.exports = {
    login: async ({email, password}) => {
        const user = await User.findOne({email});
        if (!user) {
            throw new Error('User does not exist!');
        }
        console.log(password,user.password)
        const isEqual =  bcrypt.compare(password, user.password);
        if (!isEqual) {
            throw new Error('Password is incorrect!');
        }
        const token = jwt.sign(
            {userId: user.id, email: user.email},
            'mysecretkey',
             {expiresIn: '1h'}
            );
        return {
            userId: user.id,
            token,
            tokenExpiration: 1
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
                password: args.userInput.password
            });
            const result = await user.save()

            return {...result._doc, password: null, _id: result.id}
        } catch (err) {
            throw(err)
        }
    }
}
;