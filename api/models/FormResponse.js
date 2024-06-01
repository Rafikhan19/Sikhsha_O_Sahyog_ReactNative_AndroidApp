const mongoose = require('mongoose');

const formResponseSchema = new mongoose.Schema({
    classroomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Classroom',
        required: true
    },
    formId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FormStructure',
        required: true
    },
    registrationNumber: [{
        type: Number,
        required: true
}],
    responses: [{
        registrationNumber:{type:Number,required:true},
        question: { type: String, required: true },
        answer: { type: String, required: true }
    }],
    submittedAt: {
        type: Date,
        default: Date.now
    }
});

const FormResponse = mongoose.model('FormResponse', formResponseSchema);

module.exports = FormResponse;



// const mongoose = require('mongoose');

// const formResponseSchema = new mongoose.Schema({
//     classroomId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Classroom',
//         required: true
//     },
//     formId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'FormStructure',
//         required: true
//     },
//     registrationNumber: [{
//         type: Number,
//         required: true
// }],
//     responses: [{
//         registrationNumber:{type:Number,required:true},
//         question: { type: String, required: true },
//         answer: { type: String, required: true }
//     }],
//     submittedAt: {
//         type: Date,
//         default: Date.now
//     }
// });

// const FormResponse = mongoose.model('FormResponse', formResponseSchema);

// module.exports = FormResponse;
