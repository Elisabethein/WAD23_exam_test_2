const express = require('express');
const pool = require('./database');
const cors = require('cors')


const port = process.env.PORT || 3000;
const app = express();



app.use(cors({ origin: 'http://localhost:8080', credentials: true }));
app.use(express.json());

//getting courses
app.get('/api/courses', async(req, res) => {
    try {
        console.log("A get all request has arrived");
        const courses = await pool.query(
            "SELECT * FROM courses ORDER BY id"
        );
        res.json(courses.rows);
    } catch (err) {
        console.error(err.message);
    }
});
//getting semester courses
app.get('/api/courses/:semester', async(req, res) => {
    try {
        console.log("get a post with semester parameter request has arrived");
        const { semester } = req.params;
        const posts = await pool.query(
            "SELECT * FROM courses WHERE semester = $1", [semester]
        );
        res.json(posts.rows);
    } catch (err) {
        console.error(err.message);
    }
});
//getting description
app.get('/api/courses/description/:id', async(req, res) => {
    try {
        console.log("get a course description request has arrived");
        const { id } = req.params;
        const posts = await pool.query(
            "SELECT description FROM courses WHERE id = $1", [id]
        );
        res.json(posts.rows[0].description);
    } catch (err) {
        console.error(err.message);
    }
});
//adding course
app.post('/api/courses', async(req, res) => {
    try {
        console.log("A post request has arrived");
        const course = req.body;
        const newpost = await pool.query(
            "INSERT INTO courses (code, title, semester, credits, description) values ($1, $2, $3, $4, $5)    RETURNING*", [course.code, course.title, course.semester, course.credits, course.description]
        );
        res.json(newpost);
    } catch (err) {
        console.error(err.message);
    }
});
//deleting course
app.delete('/api/courses/:id', async(req, res) => {
    try {
        const { id } = req.params;
        console.log(" A delete request has arrived");
        const deletepost = await pool.query(
            "DELETE FROM courses WHERE id = $1 RETURNING*", [id]
        );
        res.json(deletepost);
    } catch (err) {
        console.error(err.message);
    }
});

app.listen(port, () => {
    console.log("Server is listening to port " + port)
});