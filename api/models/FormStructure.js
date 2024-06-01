const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define FormStructure schema
const FormStructureSchema = new Schema({
  createdBy: { type: String, required: true }, 
  formName:{ type: String, required: true },// Assuming createdBy is a string, adjust as needed
  formStructure: {
    // Define the structure of the form
    questions: [{
      question: { type: String, required: true },
      answerType: { type: String, enum: ['text', 'multipleChoice'], required: true },
      options: [String] // Array of options, only applicable for 'multipleChoice' answer type
    }]
  },
  registrationNumber: [{
    type: Number,
    required: true
}],
responses: [{
      emailId: { type: String, required: true },
      registrationNumber: { type: String, required: true },
      serialNumber: { type:  String, required: true },
      section: { type: String, required: true },
      answers: [{
        questionNo: { type: Number, required: true },
        value: { type: String, required: true }
      }]
    }]

});

// Create FormStructure model
const FormStructure = mongoose.model('FormStructure', FormStructureSchema);

module.exports = FormStructure;



