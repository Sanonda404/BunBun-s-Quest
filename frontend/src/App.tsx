import { useState, useEffect } from 'react';

function App() {
  const [status, setStatus] = useState('Waking up Bun Bun...');

  useEffect(() => {
    fetch('http://localhost:8000/health')
      .then(res => res.json())
      .then(data => setStatus(data.companion))
      .catch(() => setStatus('Backend sleeping (Check launcher)'));
  }, []);

  return (
    <div className="min-h-screen bg-base-100 flex flex-col items-center justify-center p-6 text-base-content">
      <div className="card w-96 bg-base-200 shadow-xl border-2 border-primary rounded-3xl">
        <div className="card-body items-center text-center">
          <h2 className="card-title text-3xl font-extrabold text-shade-rose">🐰 Bun Bun's Quest</h2>
          <p className="py-2 text-base-content/80 font-medium">Your cozy study companion sanctuary is online!</p>
          <div className="mt-4 px-4 py-2 rounded-full bg-accent text-base-content font-bold text-sm shadow-inner">
            {status}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;