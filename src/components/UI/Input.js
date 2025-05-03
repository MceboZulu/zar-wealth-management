import React from 'react';

function Input({ type, label, value, onChange, required }) {
  return (
    <div>
      <label htmlFor={label}>{label}</label>
      <input type={type} id={label} value={value} onChange={onChange} required={required} />
    </div>
  );
}

export default Input;