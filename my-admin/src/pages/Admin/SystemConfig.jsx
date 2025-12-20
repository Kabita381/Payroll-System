import React, { useState } from "react";
import "./SystemConfig.css";

export default function SystemConfig() {
  const initialConfig = [
    { id: 1, key: "Basic Salary", value: "30000", description: "Default basic salary for employees", icon: "💰" },
    { id: 2, key: "Hourly Rate", value: "150", description: "Overtime hourly rate", icon: "⏱️" },
    { id: 3, key: "Overtime Rate", value: "1.5", description: "Overtime multiplier", icon: "⚡" },
    { id: 4, key: "Tax Rate", value: "10", description: "Income tax percentage", icon: "📊" },
    { id: 5, key: "Allowance HRA", value: "5000", description: "Housing allowance", icon: "🏠" },
  ];

  const [config, setConfig] = useState(initialConfig);

  const handleChange = (id, newValue) => {
    setConfig(config.map(item => item.id === id ? { ...item, value: newValue } : item));
  };

  const handleUpdate = (id) => {
    const item = config.find(c => c.id === id);
    alert(`Updated "${item.key}" to value: ${item.value}`);
  };

  return (
    <div className="system-config-page">

      <header className="config-header">
        <h1>System Configuration</h1>
        <p>Manage payroll and salary parameters centrally</p>
      </header>

      <div className="config-container">
        {/* LEFT COLUMN: CARDS */}
        <div className="config-cards">
          {config.map(item => (
            <div key={item.id} className="config-card">
              <div className="icon">{item.icon}</div>
              <h3>{item.key}</h3>
              <p>{item.value}</p>
            </div>
          ))}
        </div>

        {/* RIGHT COLUMN: TABLE */}
        <div className="config-table-container">
          <table className="config-table">
            <thead>
              <tr>
                <th>Parameter</th>
                <th>Value</th>
                <th>Description</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {config.map(item => (
                <tr key={item.id}>
                  <td>{item.key}</td>
                  <td>
                    <input
                      type="text"
                      value={item.value}
                      onChange={e => handleChange(item.id, e.target.value)}
                    />
                  </td>
                  <td>{item.description}</td>
                  <td>
                    <button onClick={() => handleUpdate(item.id)}>Update</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
