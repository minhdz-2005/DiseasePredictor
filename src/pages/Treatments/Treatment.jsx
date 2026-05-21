import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import Select from 'react-select';

import './Treatment.css';

function Treatment() {
  const { t } = useTranslation();
  const [diseases, setDiseases] = useState([]);
  const [selectedDiseaseValue, setSelectedDiseaseValue] = useState(null);

  // Lấy danh sách bệnh từ backend
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/treatments/`)
      .then(res => {
        setDiseases(res.data.treatments);
      })
      .catch(err => console.error("Lỗi tải danh sách bệnh:", err));
  }, []);

  // Tạo danh sách options dịch mỗi lần render
  const options = diseases.map(d => ({
    value: d.disease,
    label: t(`disease.${d.disease}`),
  }));

  // Khi chọn bệnh
  const handleChange = (selectedOption) => {
    setSelectedDiseaseValue(selectedOption ? selectedOption.value : null);
  };

  // Tạo danh sách hiển thị
  const diseasesToDisplay = selectedDiseaseValue
    ? diseases.filter(d => d.disease === selectedDiseaseValue)
    : diseases;

  return (
    <div className='page-container'>
      <div className="treatment-container">
        <div className="treatment-header">
          <span className="pillIcon">💊</span>
          <h2 className="webTitle">{t("treatmentpage.title")}</h2>
        </div>

        <div className="treatment-searchbar">
          <Select
            className="selectSymptom"
            classNamePrefix="custom"
            options={options}
            value={options.find(opt => opt.value === selectedDiseaseValue) || null}
            onChange={handleChange}
            isClearable
            placeholder={t("treatmentpage.placeholder")}
            noOptionsMessage={({ inputValue }) =>
              inputValue.length < 2
                ? t("treatmentpage.noOptionsShort")
                : t("treatmentpage.noOptionsNotFound")
            }
          />
        </div>

        <div className="treatment-scrollable-list">
          {diseasesToDisplay.length === 0 ? (
            <p>{t("treatment.noInfo")}</p>
          ) : (
            diseasesToDisplay.map((d, index) => (
              <div className="card p-3 mb-3" key={index}>
                <h5>{t(`disease.${d.disease}`)}</h5>

                <div className="treatmentRow">
                  <strong className="itemLabel">{t("treatmentpage.info")}:</strong>
                  <span className="itemValue">{t(`information.${d.disease}`)}</span>
                </div>

                <div className="treatmentRow">
                  <strong className="itemLabel">{t("treatmentpage.treatment")}:</strong>
                  <span className="itemValue">{t(`treatment.${d.disease}`)}</span>
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
