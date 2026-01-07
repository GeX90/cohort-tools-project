const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors")
const mongoose = require("mongoose");
const Student = require("./models/studentModels");
const Cohort = require("./models/cohortModels");


mongoose
  .connect("mongodb://127.0.0.1:27017/cohort-tools-project")
  .then(x => console.log(`Connected to Database: "${x.connections[0].name}"`))
  .catch(err => console.error("Error connecting to MongoDB", err));

const PORT = 5005;

// STATIC DATA
// Devs Team - Import the provided files with JSON data of students and cohorts here:
// ...


// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();


// MIDDLEWARE
// Research Team - Set up CORS middleware here:
// ...
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  cors({
    origin: ['http://localhost:5173'],
  })
);


// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:
// ...
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});
//COHORTS ROUTES
app.get("/api/cohorts", (req, res) => {

  Cohort.find()
    .then((cohorts) => {

      res.json(cohorts)
    })
    .catch((err) => {
      console.log("Error getting cohorts", err);
      res.status(500).json({ error: "Error getting cohorts" })

    })

});

app.post(`/api/cohorts`, (req, res, next) => {
  const newCohort = req.body

  Cohort.create(newCohort)
    .then((cohortFromDB) => {
      res.status(201).json(cohortFromDB)
    })
    .catch((err) => {
      console.log("Error create new Cohort", err)
      res.status(500).json({ error: "Error create new Cohort" })
    })
})

app.get(`/api/cohorts/:cohortId`, (req, res, next) => {
  const { cohortId } = req.params

  Cohort.findById(cohortId)
    .then((cohortFromDB) => {
      res.json(cohortFromDB)
    })
    .catch((err) => {
      console.log("Error getting cohort ID from DB", err)
      res.status(500).json({ error: "Error getting cohort ID from DB" })
    })
})

app.put(`/api/cohorts/:cohortId`, (req, res, next) => {
  const { cohortId } = req.params
  const newcohort = req.body

  Cohort.findByIdAndUpdate(cohortId, newcohort, { new: true })
    .then((cohortFromDB) => {
      res.json(cohortFromDB)
    })
    .catch((err) => {
      console.log("Error updating cohort ID from DB", err)
      res.status(500).json({ error: "Error updating cohort ID from DB" })
    })
})

app.delete(`/api/cohorts/:cohortId`, (req, res, next) => {
  const { cohortId } = req.params

  Cohort.findByIdAndDelete(cohortId)
    .then((response) => {
      res.json(response)
    })
    .catch((err) => {
      console.log("Error deleting cohort ID from DB", err)
      res.status(500).json({ error: "Error deleting cohort ID from DB" })
    })
})

//STUDENTS ROUTES
app.get("/api/students", (req, res) => {

  Student.find()
    .populate("Cohort")
    .then((students) => {

      res.json(students)
    })
    .catch((err) => {
      console.log("Error getting students", err);
      res.status(500).json({ error: "Error getting students" })

    })

});

app.post(`/api/students`, (req, res, next) => {
  const newStudent = req.body

  Student.create(newStudent)
    .then((studentFromDB) => {
      res.status(201).json(studentFromDB)
    })
    .catch((err) => {
      console.log("Error create new Student", err)
      res.status(500).json({ error: "Error create new Student" })
    })
})

app.get(`/api/students/cohort/:cohortId`, (req, res, next) => {
  const { cohortId } = req.params

  Cohort.findeById(cohortId)
    .populate("Cohort")
    .then((cohortFromDB) => {
      res.json(cohortFromDB)
    })
    .catch((err) => {
      console.log("Error getting cohort ID from DB", err)
      res.status(500).json({ error: "Error getting cohort ID from DB" })
    })
})

app.get(`/api/students/:studentId`, (req, res, next) => {
  const { studentId } = req.params

  Student.findById(studentId)
    .populate("Cohort")
    .then((studentFromDB) => {
      res.json(studentFromDB)
    })
    .catch((err) => {
      console.log("Error getting student ID from DB", err)
      res.status(500).json({ error: "Error getting student ID from DB" })
    })
})

app.put(`/api/students/:studentId`, (req, res, next) => {
  const { studentId } = req.params
  const newStudent = req.body

  Student.findByIdAndUpdate(studentId, newStudent, { new: true })
    .then((studentFromDB) => {
      res.json(studentFromDB)
    })
    .catch((err) => {
      console.log("Error updating student ID from DB", err)
      res.status(500).json({ error: "Error updating student ID from DB" })
    })
})

app.delete(`/api/students/:studentId`, (req, res, next) => {
  const { studentId } = req.params

  Student.findByIdAndDelete(studentId)
    .then((response) => {
      res.json(response)
    })
    .catch((err) => {
      console.log("Error deleting student ID from DB", err)
      res.status(500).json({ error: "Error deleting student ID from DB" })
    })
})



// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});