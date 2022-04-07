const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const mongoose_delete = require('mongoose-delete')

const userSchema = new mongoose.Schema({
    socialId: {
        type: String,
    },
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
    },
    avatar: {
        type: String,
    },
    role: {
        type: Number,
        required: true,
        default: 0
    },
}, {
    timestamps: true,
})

userSchema.plugin(mongoose_delete,  {
    deletedAt: true,
    overrideMethods: 'all',
})

userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.pre('save', async function (next) {
    if(!this.isModified('password')) {
        next()
    }

    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
})

module.exports = mongoose.model('User', userSchema)
