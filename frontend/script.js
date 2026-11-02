
// Backend API URL
const API_URL = "http://localhost:8080/api/students";

// Get HTML elements
const studentForm = document.getElementById("studentForm");
const studentId = document.getElementById("studentId");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const courseInput = document.getElementById("course");
const tableBody = document.getElementById("studentTableBody");
const submitBtn = document.getElementById("submitBtn");


// READ: Fetch all students from database
async function displayStudents() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to fetch students");
        }

        const students = await response.json();

        tableBody.innerHTML = "";

        students.forEach(function(student) {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${student.id}</td>
                <td></td>
                <td></td>
                <td></td>
                <td>
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn">Delete</button>
                </td>
            `;

            row.cells[1].textContent = student.name;
            row.cells[2].textContent = student.email;
            row.cells[3].textContent = student.course;

            row.querySelector(".edit-btn").addEventListener("click", () => {
                editStudent(student);
            });

            row.querySelector(".delete-btn").addEventListener("click", () => {
                deleteStudent(student.id);
            });

            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error("Error:", error);
        alert("Unable to load students. Check whether backend is running.");
    }
}


// CREATE AND UPDATE STUDENT
studentForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const student = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        course: courseInput.value.trim()
    };

    const id = studentId.value;

    try {
        let response;

        if (id === "") {
            // CREATE
            response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(student)
            });

        } else {
            // UPDATE
            response = await fetch(`${API_URL}/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(student)
            });
        }

        if (!response.ok) {
            throw new Error("Operation failed");
        }

        alert(id === ""
            ? "Student added successfully!"
            : "Student updated successfully!"
        );

        studentForm.reset();
        studentId.value = "";
        submitBtn.textContent = "Add Student";

        displayStudents();

    } catch (error) {
        console.error("Error:", error);
        alert("Unable to save student.");
    }
});


// EDIT STUDENT
function editStudent(student) {
    studentId.value = student.id;
    nameInput.value = student.name;
    emailInput.value = student.email;
    courseInput.value = student.course;

    submitBtn.textContent = "Update Student";
}


// DELETE STUDENT
async function deleteStudent(id) {
    const confirmDelete = confirm(
        "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Delete failed");
        }

        alert("Student deleted successfully!");

        displayStudents();

    } catch (error) {
        console.error("Error:", error);
        alert("Unable to delete student.");
    }
}


// Load students when page opens
displayStudents();
