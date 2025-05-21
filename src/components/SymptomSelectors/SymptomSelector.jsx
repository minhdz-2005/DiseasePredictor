import React, { useState } from 'react';
import Select from 'react-select';
import { useTranslation } from 'react-i18next';
import './SymptomSelector.css';

function SymptomSelector({ symptoms, selectedSymptoms, onChange }) {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState("");

  // Lọc và sắp xếp triệu chứng
  const filteredSymptoms = symptoms
    .filter(symptom => {
      const lower = symptom.toLowerCase();
      const input = inputValue.toLowerCase();
      return lower.includes(input);
    })
    .sort((a, b) => {
      const input = inputValue.toLowerCase();
      const aStarts = a.toLowerCase().startsWith(input);
      const bStarts = b.toLowerCase().startsWith(input);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return a.localeCompare(b);
    });

  // Tạo options từ danh sách triệu chứng
  const options = filteredSymptoms.map(symptom => ({
    value: symptom,
    label: t(`symptom.${symptom}`)
  }));

  const selectedOptions = options.filter(opt =>
    selectedSymptoms.includes(opt.value)
  );

  const handleChange = selected => {
    const selectedValues = selected.map(option => option.value);
    onChange(selectedValues);
  };

  return (
    <div className="mb-3">
      <label className="form-label">{t('symptomselector.label')}</label>
      <Select
        className="selectSymptom"
        isMulti
        options={options}
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
