const express=require("express");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const nodemailer=require("nodemailer");
const crypto=require("crypto");

const app=express();
const port=8000;
const cors=require("cors")
app.use(cors());

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

const jwt=require("jsonwebtoken")





mongoose.connect("mongodb+srv://rafitech19:RafiAhmedKhan19@maindb.todge4c.mongodb.net/?retryWrites=true&w=majority",{
    useNewUrlParser:true,
    useUnifiedTopology:true,
}).then(()=>{
    console.log("Connect to database")
}).catch((err)=>{
    console.log("Error connecting to Mongodb",err);
})

const User=require("./models/user");
const Classroom=require("./models/classroomScema")
const FormStructure=require('./models/FormStructure')
const FormResponse=require("./models/FormResponse")

const sendVerificationEmail=async(email,verificationToken)=>{

    const transporter=nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:"rafi9641016156@gmail.com",
            pass:"otob egaq dhzo yevh",
        }
    })

    const mailOptions = {
        from: "Institute of Technical education and Research",
        to: email,
        subject: "Email Verification",
        text: `Please click the following link to verify your email: http://192.168.40.159:8000/verify/${verificationToken}`,
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log("Verification email sent successfully");
      } catch (error) {
        console.error("Error sending verification email:", error);
      }
}

app.post("/register",async(req,res)=>{
    
    try {
        const { name, email, password } = req.body;

    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("Email already registered:", email); // Debugging statement
      return res.status(400).json({ message: "Email already registered" });
    }

    const newUser=new User({name,email,password});

    newUser.verificationToken=crypto.randomBytes(20).toString("hex");
    console.log("New User:", newUser);
    await newUser.save();

    sendVerificationEmail(newUser.email,newUser.verificationToken);

    res.status(201).json({
        message:
          "Registration successful. Please check your email for verification.",
      });
        
    } catch (error) {
        console.log("Error during registration:", error); // Debugging statement
    res.status(500).json({ message: "Registration failed" });
    }
})

app.get("/verify/:token", async (req, res) => {
    try {
      const token = req.params.token;
  
      //Find the user witht the given verification token
      const user = await User.findOne({ verificationToken: token });
      if (!user) {
        return res.status(404).json({ message: "Invalid verification token" });
      }
  
      //Mark the user as verified
      user.verified = true;
      user.verificationToken = undefined;
  
      await user.save();
  
      res.status(200).json({ message: "Email verified successfully" });
    } catch (error) {
      res.status(500).json({ message: "Email Verificatioion Failed" });
    }
  });

  const generateSecretKey = () => {
    const secretKey = crypto.randomBytes(32).toString("hex");
  
    return secretKey;
  };
  
  const secretKey = generateSecretKey();
  
  //endpoint to login the user!
  app.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
  
      //check if the user exists
      const user = await User.findOne({ email });
      // if(!user.verified){
      //   return res.status(401).json({ message: "Verify yourself to check your Gmail" });
      // }
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
  
      //check if the password is correct
      if (user.password !== password) {
        return res.status(401).json({ message: "Invalid password" });
      }
  
      //generate a token
      const token = jwt.sign({ userId: user._id }, secretKey);
      console.log(token);
      res.status(200).json({ token });
    } catch (error) {
      res.status(500).json({ message: "Login Failed" });
    }
  });

  

  app.post("/classrooms",async(req,res)=>{
    try {

      const{createdby,year,branch,section,subject}=req.body;
      if (!createdby||!year || !branch || !section||!subject ) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      const newClassroom=new Classroom({createdby,year,branch,section,subject});
      await newClassroom.save();

      res.status(201).json({
        message:"Classroom creation done Successfull",
        classroom:newClassroom
      })
      
    } catch (error) {
      console.log("Error during classroom creation");
      res.status(500).json({message:"Classroom creation faild"});

      
    }
  })


  app.delete('/classroomDelete', async (req, res) => {
    try {
      // Destructure parameters from request body
      const { createdby, subject, year, section, branch } = req.body;
  
      // Find and delete the classroom based on the provided parameters
      const deletedClassroom = await Classroom.findOneAndDelete({
        createdby,
        subject,
        year,
        section,
        branch
      });
     console.log(deletedClassroom);
      if (!deletedClassroom) {
        return res.status(404).json({ message: 'Classroom not found' });
      }
  
      res.status(200).json({ message: 'Classroom deleted successfully' });
    } catch (error) {
      console.error('Error deleting classroom:', error);
      res.status(500).json({ message: 'Server Error' });
    }
  });

  app.get("/createdClassrooms/:name", async (req, res) => {
    const name = req.params.name;
    try {
      const classrooms = await Classroom.find({ createdby: name });
      if (classrooms.length === 0) {
        return res.status(404).json({ message: "Classrooms not found" });
      }
      // console.log(classrooms)
      res.status(200).json({ classrooms });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
 

  

 


  app.post('/user-info', async (req, res) => {
    const { token } = req.body; // Get token from headers
    
    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }
    
    try {
      // Decode and verify the token
      const decodedToken =  jwt.decode(token);  // Assuming you have a JWT secret
    
      // Find user by ID
      const user = await User.findById(decodedToken.userId);
    
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
    
      // Return user information
      return res.json({ user });
    } catch (error) {
      console.error('Error decoding token:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });




  app.post('/addStudent', async (req, res) => {
    try {
        const { createdby,  subject, year, section, branch,studentData } = req.body;

        // Find the classroom by createdby
        const classroom = await Classroom.findOne({ createdby, subject, year, section, branch });

        if (!classroom) {
            return res.status(404).json({ message: "Classroom not found" });
        }

        // Add student details to the 'students' array
        classroom.students.push(studentData);

        // Save the updated classroom document
        await classroom.save();

        return res.status(200).json({ message: "Student details added successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});


app.get('/getStudents', async (req, res) => {
  try {
    const { createdby, subject, year, section, branch } = req.query;

    // Assuming you have the logic to filter students based on the provided parameters
    const classroom = await Classroom.findOne({ createdby, subject, year, section, branch });
    
    if (!classroom) {
      return res.status(404).json({ message: "Students not found" });
    }
   const studentDetails=classroom.students;
   
    return res.status(200).json({studentDetails});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});


app.put('/updateStudent/:createdby/:year/:subject/:branch/:section/:registrationNumber', async (req, res) => {
  try {
    const { dueAssignments, submittedAssignments } = req.body;
    const { createdby, year, subject, branch, section, registrationNumber } = req.params;

    // Find the classroom by createdby, year, subject, branch, section
    const classroom = await Classroom.findOne({ createdby, year, subject, branch, section });

    if (!classroom) {
      return res.status(404).json({ message: "Classroom not found" });
    }

    // Find the student by registrationNumber
    const student = classroom.students.find(student => student.registrationNumber === registrationNumber);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Update dueAssignments and submittedAssignments
    student.dueAssignments = dueAssignments;
    student.submittedAssignments = submittedAssignments;

    // Save the updated classroom document
    await classroom.save();

    return res.status(200).json({ message: "Student details updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});



  
app.get('/student/:registrationNumber', async (req, res) => {
  const { registrationNumber } = req.params;

  try {
    // Find all classrooms where the student with the given registration number exists
    const classrooms = await Classroom.find({
      'students.registrationNumber': registrationNumber
    });

    if (!classrooms || classrooms.length === 0) {
      return res.status(404).json({ error: 'Student not found in any classroom' });
    }

    const studentDetails = classrooms.map(classroom => {
      const { createdby, year, subject, branch, section } = classroom;
      const studentData = classroom.students.find(student => student.registrationNumber === registrationNumber);
      const { dueAssignments, submittedAssignments } = studentData;
      return { createdby, year, subject, branch, section, dueAssignments, submittedAssignments };
    });

    res.json(studentDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

app.delete('/deleteStudent', async (req, res) => {
  try {
    // Destructure parameters from request body
    const { createdby, subject, year, section, branch, registrationNumber } = req.body;

    // Find the classroom based on the provided parameters
    const classroom = await Classroom.findOne({
      createdby,
      subject,
      year,
      section,
      branch
    });

    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }

    // Find the index of the student with the provided registrationNumber
    const studentIndex = classroom.students.findIndex(student => student.registrationNumber === registrationNumber);

    if (studentIndex === -1) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Remove the student from the students array
    classroom.students.splice(studentIndex, 1);

    // Save the updated classroom document
    await classroom.save();

    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});


app.post("/studentRegistration",async(req,res)=>{
  
    
  try {
      const { registrationNumber, emailId } = req.body;

  
  const existingUser = await User.findOne({ email:emailId });
  if (!existingUser) {

    return res.status(404).json({ error: 'User not found' });
  }

 

  existingUser.registraionNumber=registrationNumber;
  await existingUser.save()
  res.json({ message: 'Registration number updated successfully' });
  } catch (error) {
      console.log("Error during registration:", error); // Debugging statement
  res.status(500).json({ message: "Registration failed" });
  }
})



//form creation

app.post('/createForm', async (req, res) => {
  try {
    // Extract data from request body
    const { createdBy,formName, formStructure } = req.body;

    // Create new FormStructure document
    const newForm = new FormStructure({
      createdBy,
      formName,
      formStructure
    });

    // Save the new form to the database
    const savedForm = await newForm.save();

    res.status(201).json(savedForm); // Respond with the saved form data
  } catch (error) {
    console.error('Error creating form:', error);
    res.status(500).json({ error: 'Error creating form' });
  }
});


app.get('/forms', async (req, res) => {
  const { createdBy } = req.query;

  try {
    // Find forms by createdBy
    const forms = await FormStructure.find({ createdBy }).select('createdBy formName formStructure');

    if (!forms) {
      return res.status(404).json({ error: 'No forms found for the given createdBy' });
    }

    res.status(200).json(forms);
  } catch (error) {
    console.error('Error fetching forms:', error);
    res.status(500).json({ error: 'Error fetching forms' });
  }
});



// app.post('/send-form-to-students', async (req, res) => {
//   try {
//     const { classroomId, formStructureId } = req.body;

//     // Validate if classroom exists
//     const classroom = await Classroom.findById(classroomId);
//     if (!classroom) {
//       return res.status(404).json({ message: 'Classroom not found' });
//     }

//     // Validate if form structure exists
//     const formStructure = await FormStructure.findById(formStructureId);
//     if (!formStructure) {
//       return res.status(404).json({ message: 'Form structure not found' });
//     }

//     // Extract registration numbers from the students in the classroom
//     const registrationNumbers = classroom.students.map(student => student.registrationNumber);

//     // Create a new FormResponse document
//     const formResponse = new FormResponse({
//       classroomId,
//       formId: formStructureId,
//       registrationNumber: registrationNumbers,
//       responses: [] 
//     });

//     // Save the FormResponse document
//     const savedFormResponse = await formResponse.save();

//     res.status(201).json(savedFormResponse);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

app.post('/send-form-to-students', async (req, res) => {
  try {
    const { classroomId, formStructureId } = req.body;

    // Validate if classroom exists
    const classroom = await Classroom.findById(classroomId);
    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }

    // Validate if form structure exists
    const formStructure = await FormStructure.findById(formStructureId);
    if (!formStructure) {
      return res.status(404).json({ message: 'Form structure not found' });
    }

    // Update registration numbers in form structure
    formStructure.registrationNumber = classroom.students.map(student => student.registrationNumber);

    // Save the updated FormStructure document
    const updatedFormStructure = await formStructure.save();

    res.status(201).json(updatedFormStructure);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
app.get('/form-details/:registrationNumber', async (req, res) => {
  const { registrationNumber } = req.params;

  try {
    // Find all FormStructures where the registration number exists in the registrationNumber array
    const formStructures = await FormStructure.find({ registrationNumber: registrationNumber });

    if (!formStructures.length) {
      return res.status(404).json({ message: 'No form structures found for the registration number' });
    }

    // Send the FormStructure details
    res.status(200).json({ formStructures });
  } catch (error) {
    console.error('Error retrieving form details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// app.post('/submit-response', async (req, res) => {
//   try {
//     const { formStructureId, formData } = req.body;

//     // Find the corresponding FormStructure document by ID
//     const formStructure = await FormStructure.findById(formStructureId);
//     console.log("got it")

//     if (!formStructure) {
//       return res.status(404).json({ message: 'Form structure not found for the provided ID.' });
//     }

//     // Create a new response object
//     const newResponse = {
//       emailId: formData.emailId,
//       registrationNumber:formData.registrationNumber,
//       serialNumber: formData.serialNumber,
//       section: formData.section,
//       answers: formData.formResponses.map(response => ({
//         questionNo: response.questionNo,
//         value: response.value
//       }))
//     };

//     // Add the new response to the responses array in the FormStructure document
//     formStructure.responses.push(newResponse);

//     // Save the updated FormStructure document
//     await formStructure.save();

   

//     res.status(201).json({ message: 'Form response submitted successfully.' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error.' });
//   }
// });


app.post('/submit-response', async (req, res) => {
  try {
    const { formStructureId, formData } = req.body;

    // Find the corresponding FormStructure document by ID
    const formStructure = await FormStructure.findById(formStructureId);

    if (!formStructure) {
      return res.status(404).json({ message: 'Form structure not found for the provided ID.' });
    }

    // Check if the registration number exists in the registrationNumber array
    const registrationIndex = formStructure.registrationNumber.indexOf(formData.registrationNumber);
    if (registrationIndex === -1) {
      return res.status(400).json({ message: 'Registration number not found in the form structure.' });
    }

    // Create a new response object
    const newResponse = {
      emailId: formData.emailId,
      registrationNumber: formData.registrationNumber,
      serialNumber: formData.serialNumber,
      section: formData.section,
      answers: formData.formResponses.map(response => ({
        questionNo: response.questionNo,
        value: response.value
      }))
    };

    // Add the new response to the responses array in the FormStructure document
    formStructure.responses.push(newResponse);

    // Remove the registration number from the registrationNumber array
    formStructure.registrationNumber.splice(registrationIndex, 1);

    // Save the updated FormStructure document
    await formStructure.save();

    res.status(201).json({ message: 'Form response submitted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});


app.get('/responses/:formStructureId', async (req, res) => {
  const { formStructureId } = req.params;

  try {
    // Find the form structure by its ID
    const formStructure = await FormStructure.findById(formStructureId);

    if (!formStructure) {
      return res.status(404).json({ message: 'Form structure not found' });
    }

    // If the form structure is found, return its responses
    const responses = formStructure.responses;
    res.status(200).json({ responses });
  } catch (error) {
    console.error('Error retrieving responses:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


  


  app.listen(port,()=>{
    console.log(`Server is running or port ${port}`)
})
