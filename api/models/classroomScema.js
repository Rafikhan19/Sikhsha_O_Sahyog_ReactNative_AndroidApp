const mongoose = require('mongoose');

const classroomSchema = new mongoose.Schema({
    createdby: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
        required: true
    },
    branch: {
        type: String,
        required: true
    },
    section: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    students: [{
        serialNo: {
            type: Number,
            required: true
        },
        registrationNumber: {
            type: String,
            required: true
        },
        dueAssignments: {
            type: Number,
            required: true
        },
        submittedAssignments: {
            type: Number,
            required: true
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Classroom = mongoose.model('Classroom', classroomSchema);

module.exports = Classroom;
