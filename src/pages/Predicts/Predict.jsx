import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SymptomSelector from '/src/components/SymptomSelectors/SymptomSelector';
import { useTranslation } from 'react-i18next';
import './Predict.css';

function Predict() {
  const { t } = useTranslation();
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
    if (selectedSymptoms.length === 0) return alert(t("predictpage.alert"));

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
              infomation: info?.infomation || t("predictpage.noInfo"),
              treatment: info?.treatment || t("predictpage.noTreatment")
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
        <h2 className="webTitle mb-3">{t("predictpage.title")}</h2>

        <div className="predict-layout">
          <div className="predict-left">
            <SymptomSelector
              symptoms={allSymptoms}
              selectedSymptoms={selectedSymptoms}
              onChange={setSelectedSymptoms}
            />

            <button className="predictButton btn btn-primary mt-2" onClick={handlePredict}>
              {t("predictpage.button")} 🔍
            </button>

            {predictions.length > 0 && (
              <div className="mt-4 resultTable">
                <h4>{t("predictpage.resultTitle")}</h4>
                <ul className="list-group">
                  {predictions.map((p, index) => (
                    <li key={index} className="list-group-item d-flex justify-content-between">
                      <strong>{t(`disease.${p.disease}`)}</strong>
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
                <h4>{t("predictpage.infoTreatment")}</h4>
                {treatmentsInfo.map((item, index) => (
                  <div key={index} className="card p-3 mb-3">
                    <h5>{t(`disease.${item.disease}`)}</h5>

                    <div className="treatmentRow">
                      <strong className="itemLabel">{t("predictpage.information")}:</strong>
                      <span className="itemValue">{t(`information.${item.disease}`)}</span>
                    </div>

                    <div className="treatmentRow">
                      <strong className="itemLabel">{t("predictpage.treatment")}:</strong>
                      <span className="itemValue">{t(`treatment.${item.disease}`)}</span>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <p>{t("predictpage.noResult")}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Predict;
