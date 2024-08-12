const mongoose = require('mongoose');
const {isEmail} = require('validator');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        Id: {
            type: Number
        },

        FirstName : {
            required : true,
            type : String
        },

        LastName : {
            required : true,
            type : String
        },

        email : {
            required : true,
            type: String,
            unique: true,
            lowercase: true,
            validate: [isEmail, 'please enter valid email'],
        },

        password : {
            required : true,
            type : String,
            minlength : [6,'minimum length of password should be 6']
        },

        transactions: {
            type: [],
        },

        register_date : {
            type : Date,
            default : Date.now
        }
    }
)

UserSchema.plugin(AutoIncrement, { inc_field: 'Id' });

module.exports = mongoose.model('user',UserSchema);