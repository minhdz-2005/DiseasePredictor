import React, { useState } from 'react';
import Select from 'react-select';
import { useTranslation } from 'react-i18next';

import './SymptomSelector.css';

function SymptomSelector({ symptoms, selectedSymptoms, onChange }) {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState("");

  if (!symptoms || symptoms.length === 0) {
    console.warn('No symptoms provided to SymptomSelector');
    return null;
  }

  // Tạo options từ danh sách triệu chứng (value = key gốc, label = dịch)
  const allOptions = symptoms.map(symptom => ({
    value: symptom,                     // luôn giữ key gốc: abdominal_pain
    label: t(`symptom.${symptom}`)      // hiển thị theo ngôn ngữ hiện tại
  }));

  // Lọc options theo input (theo cả key gốc + label dịch)
  const filteredOptions = allOptions
    .filter(opt => {
      const input = inputValue.toLowerCase();
      return (
        opt.value.toLowerCase().includes(input) ||  // match theo key gốc
        opt.label.toLowerCase().includes(input)     // match theo label dịch
      );
    })
    .sort((a, b) => {
      const input = inputValue.toLowerCase();
      const aStarts = a.label.toLowerCase().startsWith(input);
      const bStarts = b.label.toLowerCase().startsWith(input);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return a.label.localeCompare(b.label);
    });

  const selectedOptions = allOptions.filter(opt =>
    selectedSymptoms.includes(opt.value)
  );

  const handleChange = selected => {
    const selectedValues = selected.map(option => option.value);
    onChange(selectedValues); // gửi về backend theo key gốc
  };

  return (
    <div className="mb-3">
      <label className="form-label">{t('symptomselector.label')}</label>
      <Select
        className="selectSymptom"
        classNamePrefix="custom"
        isMulti
        options={filteredOptions}
        value={selectedOptions}
        onChange={handleChange}
        onInputChange={value => setInputValue(value)}
        placeholder={t('symptomselector.placeholder')}
        noOptionsMessage={({ inputValue }) =>
          inputValue.length < 2
            ? t('symptomselector.moreCharacters')
            : t('symptomselector.notFound')
        }
      />
    </div>
  );
}

export default SymptomSelector;
