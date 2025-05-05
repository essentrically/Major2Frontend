import React from "react";

const FormField = ({ field, value, onChange }) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium">
      {field.required && <span className="text-red-500">*</span>} {field.label}
    </label>
    <input
      type={field.type}
      name={field.name}
      required={field.required}
      value={value}
      onChange={onChange}
      className="w-full bg-zinc-800 border border-zinc-700 p-2 rounded text-white"
    />
  </div>
);

export default FormField;
