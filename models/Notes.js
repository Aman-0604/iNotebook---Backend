const mongoose = require('mongoose');
const { Schema } = mongoose;

const NotesSchema = new Schema({
    user:{// this will link user module to notes module so as to make notes visible to "only" the user of that notes not someone else. This is like a foriegn key in SQL.
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    tag: {
        type: String,
        default: "General"
    },
    date: {
        type: Date,
        default: Date.now
    },
})

module.exports = mongoose.model('Notes', NotesSchema);