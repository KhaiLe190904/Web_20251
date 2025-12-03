const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const Student = require("./Student");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Kết nối MongoDB
mongoose
  .connect("mongodb://localhost:27017/student_db")
  .then(() => console.log("Đã kết nối MongoDB thành công"))
  .catch((err) => console.error("Lỗi kết nối MongoDB:", err));


// Bài 1: GET - Lấy danh sách tất cả học sinh
app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Bài 2: POST - Thêm học sinh mới
app.post("/api/students", async (req, res) => {
  try {
    const newStudent = await Student.create(req.body);
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Bài 3: PUT - Cập nhật thông tin học sinh
app.put("/api/students/:id", async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedStudent) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json(updatedStudent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Bài 4: DELETE - Xóa học sinh
app.delete("/api/students/:id", async (req, res) => {
  try {
    const deleted = await Student.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json({ message: "Đã xóa học sinh", id: deleted._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/", (req, res) => {
  res.json({ message: "Student Management API is running!" });
});

app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
