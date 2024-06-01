const mongoose=require("mongoose");

const userSchema=new mongoose.Schema({
    name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      registraionNumber:{
        type:Number,
        default:0,
        required:true,
        unique:true
      },
      password: {
        type: String,
        required: true,
      },
  
          verified: {
        type: Boolean,
        default: false,
      },


      verificationToken: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },

})
const User = mongoose.model("User",userSchema);

module.exports = User




  {/* <TextInput
        placeholder="Registration Number"
        value={registrationNumber}
        onChangeText={text => setRegistrationNumber(text)}
      />
      <TextInput
        placeholder="emailId"
        value={email}
        onChangeText={text => setEmail(text)}
      />
      <Button
        title="Get Student Data"
        onPress={fetchData}
      /> */}