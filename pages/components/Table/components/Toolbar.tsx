import React, { useState } from 'react';

interface ToolbarProps {
  onSearch: (value: string) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ onSearch }) => {
  const [searchValue, setSearchValue] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
    onSearch(event.target.value);
  };

  return (
    <div style={{ marginBottom: '10px' }}>
      <input type="text" value={searchValue} onChange={handleChange} placeholder="Search..." />
    </div>
  );
};
