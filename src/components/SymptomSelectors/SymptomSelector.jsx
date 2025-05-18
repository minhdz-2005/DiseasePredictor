import React from 'react';
import Select from 'react-select';
import { useState } from 'react';
import './SymptomSelector.css'

function SymptomSelector({ symptoms, selectedSymptoms, onChange }) {

  const [inputValue, setInputValue] = useState("");

  // Sắp xếp theo startsWith trước, includes sau
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

  // 1. Tạo danh sách options từ symptoms & sắp xếp theo alphabet
  const options = filteredSymptoms
  .map(symptom => ({
    value: symptom,
    label: symptom
  }));

  // 2. Lọc ra những triệu chứng được chọn
  const selectedOptions = options.filter(opt =>
    selectedSymptoms.includes(opt.value)
  );

  const handleChange = selected => {
    const selectedValues = selected.map(option => option.value);
    onChange(selectedValues);
  };

  return (
    <div className="mb-3">
      <label className="form-label">Select symptoms</label>
      <Select
        className='selectSymptom'
        isMulti
        options={options}
        value={selectedOptions}
        onChange={handleChange}
        onInputChange={value => setInputValue(value)}
        placeholder="Enter your symptoms..."
        noOptionsMessage={({ inputValue }) =>
          inputValue.length < 2
            ? "Enter more character for suggestions..."
            : "Symptom not found !"
        }
        
      />
    </div>
  );
}

export default SymptomSelector;
