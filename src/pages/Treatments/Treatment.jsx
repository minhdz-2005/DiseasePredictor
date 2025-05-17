import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import './Treatment.css';

function Treatment() {
  const [diseases, setDiseases] = useState([]);
  const [selectedDisease, setSelectedDisease] = useState(null);

  // Lấy danh sách bệnh
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/treatments")
      .then(res => {
        setDiseases(res.data.treatments);
      })
      .catch(err => console.error("Lỗi tải danh sách bệnh:", err));
  }, []);

  // Tạo options cho react-select
  const options = diseases.map(d => ({
    value: d.disease,
    label: d.disease,
    infomation: d.infomation,
    treatment: d.treatment,
  }));

  // Khi chọn một bệnh
  const handleChange = (selectedOption) => {
    setSelectedDisease(selectedOption);
  };

  // Danh sách bệnh để hiển thị
  const diseasesToDisplay = selectedDisease
    ? [selectedDisease]
    : diseases.map(d => ({
        label: d.disease,
        infomation: d.infomation,
        treatment: d.treatment,
      }));

  return (
    <div className="treatment-container">
      {/* Header cố định */}
      <div className="treatment-header">
        <span className="pillIcon">💊</span>
        <h2 className="webTitle">Thông tin & Cách chữa bệnh</h2>
      </div>

      {/* Bố cục 2 cột: Select + Danh sách */}
      <div className="treatment-layout">
        {/* Bên trái: Select */}
        <div className="treatment-sidebar">
          <Select
            className="selectSymptom"
            options={options}
            value={selectedDisease}
            onChange={handleChange}
            isClearable
            placeholder="Nhập tên bệnh..."
            noOptionsMessage={({ inputValue }) =>
              inputValue.length < 2
                ? "Nhập thêm để hiện gợi ý..."
                : "Không tìm thấy bệnh nào!"
            }
          />
        </div>

        {/* Bên phải: Danh sách (cuộn riêng) */}
        <div className="treatment-scrollable-list">
          {diseasesToDisplay.length === 0 ? (
            <p>Không có thông tin bệnh nào.</p>
          ) : (
            diseasesToDisplay.map((d, index) => (
              <div className="card p-3 mb-3" key={index}>
                <h4>{d.label}</h4>
                <p><strong>Thông tin:</strong> {d.infomation}</p>
                <p><strong>Cách chữa:</strong> {d.treatment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>


  );
}

export default Treatment;
