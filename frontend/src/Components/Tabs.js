import React, { useState } from 'react';

function Tabs() {
  const [activeTab, setActiveTab] = useState('Overall');

  const tabs = ['Overall', 'Food', 'Service', 'Ambience', 'Value'];

  return (
    <div className="tabs">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={activeTab === tab ? 'active' : ''}
          onClick={() => setActiveTab(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

export default Tabs;