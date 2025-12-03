import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:5000/api/students';

function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Bài 2 & 3: State cho form
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [studentClass, setStudentClass] = useState('');

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Bài 5: State cho tìm kiếm
  const [searchTerm, setSearchTerm] = useState('');

  // Bài 6: State cho sắp xếp
  const [sortAsc, setSortAsc] = useState(true);

  // Bài 1: Fetch danh sách học sinh
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setStudents(response.data);
      setError(null);
    } catch (error) {
      console.error("Lỗi khi fetch danh sách:", error);
      setError("Không thể kết nối đến server. Vui lòng kiểm tra backend.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setAge('');
    setStudentClass('');
    setEditingId(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    resetForm();
  };

  // Bài 2: Thêm học sinh mới
  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!name || !age || !studentClass) return;

    const newStudent = {
      name,
      age: Number(age),
      class: studentClass
    };

    try {
      const response = await axios.post(API_URL, newStudent);
      setStudents(prev => [...prev, response.data]);
      closeAddModal();
      alert('Thêm học sinh thành công!');
    } catch (error) {
      console.error("Lỗi khi thêm:", error);
      alert('Lỗi khi thêm học sinh!');
    }
  };

  // Bài 3: Mở modal chỉnh sửa
  const openEditModal = (student) => {
    setEditingId(student._id);
    setName(student.name);
    setAge(student.age);
    setStudentClass(student.class);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    resetForm();
  };

  // Bài 3: Cập nhật học sinh
  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    if (!editingId) return;

    const updatedStudent = {
      name,
      age: Number(age),
      class: studentClass
    };

    try {
      const response = await axios.put(`${API_URL}/${editingId}`, updatedStudent);
      setStudents(prev => prev.map(s => s._id === editingId ? response.data : s));
      closeEditModal();
      alert('Cập nhật thành công!');
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      alert('Lỗi khi cập nhật học sinh!');
    }
  };

  // Bài 4: Xóa học sinh
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa học sinh này?")) return;

    try {
      await axios.delete(`${API_URL}/${id}`);
      setStudents(prev => prev.filter(s => s._id !== id));
      alert('Xóa học sinh thành công!');
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
      alert('Lỗi khi xóa học sinh!');
    }
  };

  // Bài 5: Lọc danh sách theo tên
  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Bài 6: Sắp xếp danh sách
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    if (nameA < nameB) return sortAsc ? -1 : 1;
    if (nameA > nameB) return sortAsc ? 1 : -1;
    return 0;
  });

  return (
    <div className="App">
      <div className="container">
        <h1>Quản Lý Học Sinh</h1>

        {/* Nút thêm học sinh */}
        <div className="action-bar">
          <button onClick={openAddModal} className="btn-add-new">
            Thêm Học Sinh Mới
          </button>
        </div>

        {/* Bài 5: Tìm kiếm */}
        <div className="search-section">
          <input
            type="text"
            className="search-input"
            placeholder="Tìm kiếm theo tên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Bài 6: Sắp xếp */}
        <div className="sort-section">
          <button onClick={() => setSortAsc(prev => !prev)} className="btn-sort">
            Sắp xếp: {sortAsc ? 'A → Z' : 'Z → A'}
          </button>
          <span className="result-count">
            Hiển thị {sortedStudents.length} / {students.length} học sinh
          </span>
        </div>

        {/* Hiển thị danh sách */}
        {loading ? (
          <p className="message">Đang tải dữ liệu...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : sortedStudents.length === 0 ? (
          <p className="message">
            {searchTerm ? 'Không tìm thấy học sinh nào phù hợp.' : 'Chưa có học sinh nào trong danh sách.'}
          </p>
        ) : (
          <div className="table-container">
            <table className="students-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Họ và Tên</th>
                  <th>Tuổi</th>
                  <th>Lớp</th>
                  <th>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {sortedStudents.map((student, index) => (
                  <tr key={student._id}>
                    <td>{index + 1}</td>
                    <td>{student.name}</td>
                    <td>{student.age}</td>
                    <td>{student.class}</td>
                    <td className="action-buttons">
                      <button 
                        onClick={() => openEditModal(student)} 
                        className="btn-edit"
                      >
                        Sửa
                      </button>
                      <button 
                        onClick={() => handleDelete(student._id)} 
                        className="btn-delete"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Bài 2: Modal Thêm học sinh */}
      {showAddModal && (
        <div className="modal-overlay" onClick={closeAddModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Thêm Học Sinh Mới</h2>
              <button className="btn-close" onClick={closeAddModal}>✕</button>
            </div>
            <form onSubmit={handleAddStudent} className="modal-form">
              <div className="form-group">
                <label>Họ và Tên *</label>
                <input
                  type="text"
                  placeholder="Nhập họ và tên"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label>Tuổi *</label>
                <input
                  type="number"
                  placeholder="Nhập tuổi"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                  min="1"
                  max="100"
                />
              </div>
              <div className="form-group">
                <label>Lớp *</label>
                <input
                  type="text"
                  placeholder="Nhập lớp"
                  value={studentClass}
                  onChange={(e) => setStudentClass(e.target.value)}
                  required
                />
              </div>
              <div className="modal-footer">
                <button type="button" onClick={closeAddModal} className="btn-cancel">
                  Hủy
                </button>
                <button type="submit" className="btn-submit">
                  Thêm Học Sinh
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bài 3: Modal Chỉnh sửa học sinh */}
      {showEditModal && (
        <div className="modal-overlay" onClick={closeEditModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Chỉnh Sửa Học Sinh</h2>
              <button className="btn-close" onClick={closeEditModal}>✕</button>
            </div>
            <form onSubmit={handleUpdateStudent} className="modal-form">
              <div className="form-group">
                <label>Họ và Tên *</label>
                <input
                  type="text"
                  placeholder="Nhập họ và tên"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label>Tuổi *</label>
                <input
                  type="number"
                  placeholder="Nhập tuổi"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                  min="1"
                  max="100"
                />
              </div>
              <div className="form-group">
                <label>Lớp *</label>
                <input
                  type="text"
                  placeholder="Nhập lớp"
                  value={studentClass}
                  onChange={(e) => setStudentClass(e.target.value)}
                  required
                />
              </div>
              <div className="modal-footer">
                <button type="button" onClick={closeEditModal} className="btn-cancel">
                  Hủy
                </button>
                <button type="submit" className="btn-submit">
                  Cập Nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
