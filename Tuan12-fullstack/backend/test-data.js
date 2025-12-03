import mongoose from 'mongoose';
import Student from './Student';

mongoose.connect('mongodb://localhost:27017/student_db')
  .then(() => {
    console.log("Đã kết nối MongoDB thành công");
    return insertTestData();
  })
  .catch(err => {
    console.error("Lỗi kết nối MongoDB:", err);
    process.exit(1);
  });

async function insertTestData() {
  try {
    await Student.deleteMany({});

    const students = [
      { name: "Nguyễn Văn An", age: 20, class: "CNTT K65" },
      { name: "Trần Thị Bình", age: 19, class: "CNTT K65" },
      { name: "Lê Văn Cường", age: 21, class: "CNTT K64" },
      { name: "Phạm Thị Dung", age: 20, class: "CNTT K65" },
      { name: "Hoàng Văn Em", age: 22, class: "CNTT K64" },
      { name: "Vũ Thị Phương", age: 19, class: "CNTT K65" },
      { name: "Đặng Văn Giang", age: 21, class: "CNTT K64" },
      { name: "Bùi Thị Hoa", age: 20, class: "CNTT K65" }
    ];

    await Student.insertMany(students);
    console.log(`Đã thêm ${students.length} học sinh vào database`);

    const allStudents = await Student.find();
    console.log("Danh sách học sinh:");
    allStudents.forEach((student, index) => {
      console.log(`${index + 1}. ${student.name} - ${student.age} tuổi - ${student.class}`);
    });

    mongoose.connection.close();
    console.log("\nHoàn thành!");
  } catch (err) {
    console.error("Lỗi:", err);
    process.exit(1);
  }
}
