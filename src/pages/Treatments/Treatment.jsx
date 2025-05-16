import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import './Treatment.css';

function Treatment() {
  const [diseases, setDiseases] = useState([]);
  const [selectedDisease, setSelectedDisease] = useState(null); // đổi thành object
  const [treatmentInfo, setTreatmentInfo] = useState(null);

  // Lấy danh sách bệnh
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/treatments")
      .then(res => {
        setDiseases(res.data.treatments);
      })
      .catch(err => console.error("Lỗi tải danh sách bệnh:", err));
  }, []);

  // Chuẩn bị options cho react-select
  const options = diseases.map(d => ({
    value: d.disease,
    label: d.disease,
    info: d.infomation,
    treatment: d.treatment,
  }));

  // Xử lý chọn bệnh
  const handleChange = (selectedOption) => {
    setSelectedDisease(selectedOption);
    if(selectedOption) {
      setTreatmentInfo({
        infomation: selectedOption.info,
        treatment: selectedOption.treatment,
      });
    } else {
      setTreatmentInfo(null);
    }
  };

  return (
    <div className="container mt-4">
      <span className="pillIcon">💊</span>
      <h2 className="webTitle mb-4">Information and Treatment</h2>

      <div className="form-group mb-3">
        <Select
          options={options}
          value={selectedDisease}
          onChange={handleChange}
          placeholder="Enter disease name..."
          isClearable
          noOptionsMessage={({ inputValue }) =>
            inputValue.length < 2
              ? "Enter a character for suggestion..."
              : "Sorry but I can't find a disease that match your disease name!"
          }
        />
      </div>

      {treatmentInfo && (
        <div className="card p-3 mt-3">
          <h4>{selectedDisease.label}</h4>
          <p><strong>Information:</strong> {treatmentInfo.infomation}</p>
          <p><strong>Treatment:</strong> {treatmentInfo.treatment}</p>
        </div>
      )}
    </div>
  );
}

export default Treatment;
