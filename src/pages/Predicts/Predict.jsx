import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SymptomSelector from '/src/components/SymptomSelectors/SymptomSelector';

import './Predict.css'

function Predict() {
  const [allSymptoms, setAllSymptoms] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [predictions, setPredictions] = useState([]);

  // Gọi API lấy danh sách triệu chứng
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/symptoms")
      .then(res => {setAllSymptoms(res.data.symptoms)
        console.log("Triệu chứng từ API:", res.data.symptoms);

      })
      .catch(err => console.error("Lỗi tải triệu chứng:", err));
  }, []);

  // Gửi triệu chứng lên API
  const handlePredict = () => {
    if (selectedSymptoms.length === 0) return alert("Hãy chọn ít nhất 1 triệu chứng!");

    axios.post("http://127.0.0.1:8000/predict", {
      symptoms: selectedSymptoms
    })
      .then(res => setPredictions(res.data.predictions))
      .catch(err => console.error("Lỗi dự đoán:", err));
  };

  return (
    <div className="container mt-4">
      <span className='brainIcon'>🧠</span>
      <h2 className="webTitle mb-4 ">Dự đoán bệnh</h2>
      
      <SymptomSelector
        symptoms={allSymptoms}
        selectedSymptoms={selectedSymptoms}
        onChange={setSelectedSymptoms}
      />

      <button className="btn btn-primary" onClick={handlePredict}>
        Dự đoán bệnh 🔍
      </button>

      {predictions.length > 0 && (
        <div className="mt-4">
          <h4>Kết quả:</h4>
          <ul className="list-group">
            {predictions.map((p, index) => (
              <li key={index} className="list-group-item d-flex justify-content-between">
                <strong>{p.disease}</strong>
                <span>{p.probability}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Predict;
