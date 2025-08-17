import React, { useEffect, useState } from 'react';

function App() {
  const [amberPrice, setAmberPrice] = useState(null);

  useEffect(() => {
    async function fetchAmberPrice() {
      try {
        // This is the key change: We now call our OWN secure backend function.
        const response = await fetch('/api/amber'); 
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        
        // Check for errors from our backend function
        if (data.error) {
          throw new Error(`API Error: ${data.error}`);
        }
        
        if (data && data.length > 0) {
          setAmberPrice(data[0].perKwh);
        } else {
          setAmberPrice('N/A');
        }
      } catch (error) {
        console.error('Failed to fetch Amber price:', error);
        setAmberPrice('Error');
      }
    }

    fetchAmberPrice();
    const interval = setInterval(fetchAmberPrice, 300000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const renderPrice = () => {
    if (amberPrice === null) return 'Loading...';
    if (amberPrice === 'Error' || amberPrice === 'N/A') return amberPrice;
    return `${amberPrice.toFixed(2)} ¢/kWh`;
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'Arial', backgroundColor: '#f0f0f0' }}>
      <div style={{ padding: '40px', borderRadius: '15px', backgroundColor: 'white', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', textAlign: 'center' }}>
        <h2 style={{margin: '0 0 10px 0'}}>Current Amber Price</h2>
        <p style={{ fontSize: '4em', margin: 0, fontWeight: 'bold' }}>
          {renderPrice()}
        </p>
      </div>
    </div>
  );
}

export default App;
