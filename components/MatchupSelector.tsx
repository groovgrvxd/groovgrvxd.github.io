import React from 'react';

interface MatchupSelectorProps {
  id: string;
  label: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  disabled?: boolean;
  placeholder?: string;
}

const MatchupSelector: React.FC<MatchupSelectorProps> = ({ id, label, value, onChange, options, disabled = false, placeholder = "Select Opponent" }) => {
  return (
    <div className="mb-6">
      <label htmlFor={id} className="block text-sm font-medium text-[#22DFBF] mb-1">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full px-3 py-2 bg-[#001301] border border-[#22DFBF]/70 rounded-md shadow-sm text-[#22DFBF] focus:outline-none focus:ring-2 focus:ring-[#22DFBF] focus:border-[#22DFBF] disabled:bg-[#001301]/50 disabled:text-[#22DFBF]/50 disabled:cursor-not-allowed"
      >
        <option value="" disabled={value !== ""} style={{ backgroundColor: '#001301', color: '#22DFBF' }}>{placeholder}</option>
        {options.map((optionName) => (
          <option key={optionName} value={optionName} style={{ backgroundColor: '#001301', color: '#22DFBF' }}>
            {optionName}
          </option>
        ))}
      </select>
    </div>
  );
};

export default MatchupSelector;