<template>
  <div>
      <h3>Courses</h3>
      <div class = "container">
          <table>
              <tr>
                  <th>Code</th>
                  <th>Title</th>
                  <th>Semester</th>
                  <th>Credits</th>
                  <th>Description</th>
                  <th>Multiplication test</th>
                  <th>Notes</th>
                  <th></th>
                  <th></th>
              </tr>
              <tr class="item" v-for="course in courses" :key = "course.id">
                <td class="code" @click="openDescription(course.id)">{{  course.code }}</td>
                <td>{{  course.title }}</td>
                <td><router-link :to="{ name: 'SemesterView', params: { semester: course.semester } }">
                    {{ course.semester }}
                    </router-link></td>
                <td class = "blue" v-if="course.credits < 6">{{  course.credits }}</td>
                <td class = "red" v-else>{{  course.credits }}</td>
                <td v-if="course.description !== null" >{{  course.description }}</td>
                <td v-else>No course description is provided</td>
                <td>{{ course.credits * 2 }}</td>
                <td>
                  <div v-if="courseNoteMap[course.id]">
                    <div><b>Notes:</b></div>
                      <div class="allNotes" v-for="note in courseNoteMap[course.id]" :key="note">{{ note }}</div>
                    </div>
                  <!--Problem: displays the same note in every input field before submitting-->
                  <!--Stored locally, not using database for notes-->
                  <input name="note" type="text" id="note" placeholder="Notes"  required v-model="ACourse.note">
                </td>
                <td><button class="addNote" @click="addNote(course.id)">Add Note</button></td>
                <td><button class="delete" @click="deleteCourse(course.id)">Delete</button></td>
              </tr>
          </table>
        </div>
          <h3>Add a Course</h3>
            <div class="container">
                    <td><input name="code" type="text" id="codeAdd" placeholder="Code" required v-model="ACourse.code"></td>
                    <td><input name="title" type="text" id="titleAdd" placeholder="Title" required v-model="ACourse.title"></td>
                    <td><input name="semester" type="text" id="semesterAdd" placeholder="Semester" required v-model="ACourse.semester"></td>
                    <td><input name="credits" type="number" id="creditsAdd" placeholder="Credits" required v-model="ACourse.credits"></td>
                    <td><input name="description" type="text" id="descriptionAdd" placeholder="Description"  required v-model="ACourse.description"></td>
            </div>
            <button class="add"  @click="addCourse(ACourse)"> Add Course </button>
      
      <div v-if="description!==''" class = "description">
              <p><b>Course description:</b> {{ description }}</p>
      </div>
  </div>
</template>

<script>
export default {
  name: "AllCourses",
  data() {
      return {
          courses: [],
          description: '',
          ACourse: {
            code: "",
            title: "",
            semester: "",
            credits: "",
            description: "",
            note: "",
          },
          courseNoteMap: {},
      };
  },
  methods: {
    fetchCourses() {
      fetch(`http://localhost:3000/api/courses/`)
        .then((response) => response.json())
        .then((data) => (this.courses = data))
        .catch((err) => console.log(err.message));
   },
    openDescription(postId) {
      fetch(`http://localhost:3000/api/courses/description/${postId}`)
        .then((response) => response.json())
        .then((data) => (this.description = data))
        .catch((err) => console.log(err.message));
    },
    addNote(postId) {
      const note = this.ACourse.note;
      if (!this.courseNoteMap[postId]) {
        this.courseNoteMap[postId] = [];
      }
      this.courseNoteMap[postId].push(note);
      this.ACourse.note = "";
    },
    addCourse(course) {
      fetch(`http://localhost:3000/api/courses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(course),
        })
        .then((response) => {
          window.location.reload();
        })
        .catch((e) => {
          console.log(e);
        });
    },
    deleteCourse(id) {
      fetch(`http://localhost:3000/api/courses/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => {
          window.location.reload();
        })
        .catch((e) => {
          console.log(e);
        });
    }, 
  },
  mounted() {
    this.fetchCourses();
    console.log("mounted");
  } 
};
</script>

<style scoped>
h3 {
    font-size: larger;
}
th {
    background-color: darkcyan;
}
td {
    background-color: cyan;
}
th, td {
  font-size: 15px;
  margin-bottom: 5px;
  padding: 8px 10px;
}
.container {
    background: #d5d7d8;
    box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.2);
    margin-bottom: 30px;
    padding: 10px 20px;
    margin: auto;
    width: 60%;
    display: flex;
    justify-content: center;
}
.red {
  background-color: red;
}
.blue {
  background-color: blue;
}
.description {
  background-color: yellow;
  margin-bottom: 30px;
  padding: 10px 20px;
  margin: auto;
  width: 60%;
  display: flex;
  justify-content: center;
}

.code:hover {
  background-color: yellow;
}
.add, .addNote, .delete {
  background-color: lightcyan;
}
</style>