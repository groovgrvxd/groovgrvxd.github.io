import React from 'react';

interface PlayerNameInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id: string;
}

const PlayerNameInput: React.FC<PlayerNameInputProps> = ({ label, value, onChange, placeholder, id }) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-[#22DFBF] mb-1">
        {label}
      </label>
      <input
        type="text"
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || 'Enter player name'}
        className="w-full px-3 py-2 bg-[#001301] border border-[#22DFBF]/70 rounded-md shadow-sm text-[#22DFBF] placeholder-[#22DFBF]/70 focus:outline-none focus:ring-2 focus:ring-[#22DFBF] focus:border-[#22DFBF]"
      />
    </div>
  );
};

export default PlayerNameInput;