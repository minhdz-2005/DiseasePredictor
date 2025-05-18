import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SymptomSelector from '/src/components/SymptomSelectors/SymptomSelector';
import './Predict.css';

function Predict() {
  const [allSymptoms, setAllSymptoms] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [treatmentsInfo, setTreatmentsInfo] = useState([]);

  // Gọi API lấy danh sách triệu chứng
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/symptoms")
      .then(res => setAllSymptoms(res.data.symptoms))
      .catch(err => console.error("Error:", err));
  }, []);

  // Hàm gọi dự đoán
  const handlePredict = () => {
    if (selectedSymptoms.length === 0) return alert("Please choose at least one symptom!");

    axios.post("http://127.0.0.1:8000/predict", {
      symptoms: selectedSymptoms
    })
    .then(res => {
      const predicted = res.data.predictions;
      setPredictions(predicted);

      // Sau khi dự đoán xong, gọi thêm thông tin bệnh
      axios.get("http://127.0.0.1:8000/treatments")
        .then(treatmentRes => {
          const allTreatments = treatmentRes.data.treatments;

          // Lọc ra những bệnh được dự đoán
          const relatedTreatments = predicted.map(p => {
            const info = allTreatments.find(t => t.disease === p.disease);
            return {
              disease: p.disease,
              probability: p.probability,
              infomation: info?.infomation || "Information not found.",
              treatment: info?.treatment || "Treatment not found."
            };
          });

          setTreatmentsInfo(relatedTreatments);
        })
        .catch(err => console.error("Treatment loading failed:", err));
    })
    .catch(err => console.error("Predict error:", err));
  };

  return (
    <div className="page-wrapper">
      <div className="predict-container">
        <span className='brainIcon'>🧠</span>
        <h2 className="webTitle mb-3">Disease Prediction</h2>

        <div className="predict-layout">
          <div className="predict-left">
            <SymptomSelector
              symptoms={allSymptoms}
              selectedSymptoms={selectedSymptoms}
              onChange={setSelectedSymptoms}
            />

            <button className="predictButton btn btn-primary mt-2" onClick={handlePredict}>
              Predict 🔍
            </button>

            {predictions.length > 0 && (
              <div className="mt-4 resultTable">
                <h4>Prediction results:</h4>
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

          {/* Bên phải: hiện thông tin điều trị */}
          <div className="predict-right">
            {treatmentsInfo.length > 0 ? (
              <>
                <h4>Information & Treatment:</h4>
                {treatmentsInfo.map((item, index) => (
                  <div key={index} className="card p-3 mb-3">
                    <h5>{item.disease}</h5>

                    <div className="treatmentRow">
                      <strong className="itemLabel">Information:</strong>
                      <span className="itemValue">{item.infomation}</span>
                    </div>

                    <div className="treatmentRow">
                      <strong className="itemLabel">Treatment:</strong>
                      <span className="itemValue">{item.treatment}</span>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <p>No prediction results yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Predict;
