import React, { useState } from 'react';
import { ElasticSlider } from './components/ElasticSlider';

function App() {
  const [assetsValue, setAssetsValue] = useState(25);
  const [salaryValue, setSalaryValue] = useState(184);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="space-y-4">
          <ElasticSlider
            value={assetsValue}
            onChange={setAssetsValue}
            label="test score 0-100"
            max={100}
          />
          
          <div className="flex gap-2 mt-2">
            {['1-5', '5-10', '11-25', '26-50', '51-99', '100'].map((range) => (
              <button
                key={range}
                className={`px-4 py-2 rounded-md text-sm ${
                  (range === '100' && assetsValue == 100)
                    ? 'bg-purple-500 text-white'
                    : 'bg-white/10 text-white/60'
                }`}
                onClick={() => setAssetsValue(parseInt(range.split('-')[0]))}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-8">
          <ElasticSlider
            value={salaryValue}
            onChange={setSalaryValue}
            label="test score with prefix"
            suffix="K"
            max={300}
          />
        </div>
      </div>
    </div>
  );
}

export default App;