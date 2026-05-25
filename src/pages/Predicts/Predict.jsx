import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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

  
  // Test API connection, if this fails, alert the user and log the error
  axios.get(`${import.meta.env.VITE_API_URL}/treatments/`)
    .catch(err => {
      console.error("Error fetching treatments:", err);
      alert("Server needs a minute to wake up. Please try again in a moment.");
    });

  // Gọi API lấy danh sách triệu chứng
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/symptoms/`)
      .then(res => setAllSymptoms(res.data))
      .catch(err => console.error("Error:", err));
  }, []);

  // Hàm gọi dự đoán
  const handlePredict = () => {
  if (selectedSymptoms.length === 0) {
    toast.warning(t("predictpage.alert"), {
      position: "top-center",
      autoClose: 3000
    });
    return;
  }

  const userStr = localStorage.getItem("userDP");
  const payload = { symptoms: selectedSymptoms };
  let userId = null;

  if (userStr) {
    const user = JSON.parse(userStr);
    userId = user.user.id;
    payload.user = userId;
  }

  axios.post(`${import.meta.env.VITE_API_URL}/predict/`, payload)
    .then(res => {
      const predicted = res.data.predictions;
      setPredictions(predicted);

      console.log("data: " + res.data.predictions);
      // Gọi thêm API lưu lịch sử dự đoán nếu user đã đăng nhập
      if (userId) {
        const historyPayload = {
          user: userId,
          symptoms: selectedSymptoms,
          disease_1: predicted[0]?.disease || "",
          disease_2: predicted[1]?.disease || "",
          disease_3: predicted[2]?.disease || "",
          prob_1: parseFloat(predicted[0]?.probability) || 0,
          prob_2: parseFloat(predicted[1]?.probability) || 0,
          prob_3: parseFloat(predicted[2]?.probability) || 0,
        };

        console.log("pay: ", historyPayload);

        axios.post(`${import.meta.env.VITE_API_URL}/history/`, historyPayload)
          .then(() => console.log("Prediction history saved successfully"))
          .catch(err => console.log("Failed to save history:", err.response.data));
      }

      // Sau khi dự đoán xong, gọi thêm thông tin bệnh
      axios.get(`${import.meta.env.VITE_API_URL}/treatments/`)
        .then(treatmentRes => {
          const allTreatments = treatmentRes.data.treatments;

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
      <ToastContainer />
    </div>
  );
}

export default Predict;
