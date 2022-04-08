const mongoose = require('mongoose')
const mongoose_delete = require('mongoose-delete')

const documentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    description: {
        type: String,
    },
    url: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
})

documentSchema.plugin(mongoose_delete,  {
    deletedAt: true,
})

module.exports = mongoose.model('Document', documentSchema)
