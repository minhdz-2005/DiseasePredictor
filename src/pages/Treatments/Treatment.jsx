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
        <h2 className="webTitle">Information & Treatments</h2>
      </div>

      <div className="treatment-layout">
        <div className="treatment-sidebar">
          <Select
            className="selectSymptom"
            options={options}
            value={selectedDisease}
            onChange={handleChange}
            isClearable
            placeholder="Enter disease name..."
            noOptionsMessage={({ inputValue }) =>
              inputValue.length < 2
                ? "Enter more character for suggestions..."
                : "Disease not found!"
            }
          />
        </div>

        <div className="treatment-scrollable-list">
          {diseasesToDisplay.length === 0 ? (
            <p>No information.</p>
          ) : (
            diseasesToDisplay.map((d, index) => (
              <div className="card p-3 mb-3" key={index}>
                <h5>{d.label}</h5>
                <div className="treatmentRow">
                  <strong className="itemLabel">Information:</strong>
                  <span className="itemValue">{d.infomation}</span>
                </div>

                <div className="treatmentRow">
                  <strong className="itemLabel">Treatment:</strong>
                  <span className="itemValue">{d.treatment}</span>
                </div>

              </div>
            ))
          )}
        </div>
      </div>
    </div>


  );
}

export default Treatment;
