import React, { useEffect, useState } from 'react'

// Your API Key and Site ID are now directly in the code
const AMBER_API_KEY = 'psk_c97ca862a28306694cbd262795ed7cc4'
const SITE_ID = '6102336833'

function App() {
  const [amberPrice, setAmberPrice] = useState(null)
  const [forecast, setForecast] = useState([])
  const [btcPrice, setBtcPrice] = useState(null)
  const [croPrice, setCroPrice] = useState(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const amberRes = await fetch(`https://api.amber.com.au/v1/sites/${SITE_ID}/prices/current`, {
          headers: { Authorization: `Bearer ${AMBER_API_KEY}` }
        })
        const amberData = await amberRes.json()
        setAmberPrice(amberData[0]?.perKwh)

        const forecastRes = await fetch(`https://api.amber.com.au/v1/sites/${SITE_ID}/prices`, {
          headers: { Authorization: `Bearer ${AMBER_API_KEY}` }
        })
        const forecastData = await forecastRes.json()
        setForecast(forecastData.slice(0, 24)) // Next 12 hours (30-min intervals)

        const btcRes = await fetch('https://api.coindesk.com/v1/bpi/currentprice/BTC.json')
        const btcJson = await btcRes.json()
        setBtcPrice(btcJson.bpi.USD.rate)

        const croRes = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=crypto-com-chain&vs_currencies=usd')
        const croJson = await croRes.json()
        setCroPrice(croJson['crypto-com-chain'].usd)
      } catch (err) {
        console.error(err)
      }
    }
    fetchData()
    // Refresh the data every 5 minutes
    const interval = setInterval(fetchData, 300000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gridTemplateRows: '1fr 1fr',
      gap: '20px',
      padding: '20px',
      fontFamily: 'Arial',
      color: '#333',
      backgroundColor: '#f4f4f4',
      height: '100vh',
      boxSizing: 'border-box'
    }}>
      <div style={{border: '1px solid #ccc', borderRadius: '12px', padding: '20px', backgroundColor: 'white'}}>
        <h2>Amber Price</h2>
        <p style={{fontSize: '2em', margin: 0}}>{amberPrice ? `${(amberPrice).toFixed(2)} ¢/kWh` : 'Loading...'}</p>
      </div>

      <div style={{border: '1px solid #ccc', borderRadius: '12px', padding: '20px', backgroundColor: 'white'}}>
        <h2>BTC Price</h2>
        <p style={{fontSize: '2em', margin: 0}}>{btcPrice ? `$${btcPrice}` : 'Loading...'}</p>
      </div>

      <div style={{border: '1px solid #ccc', borderRadius: '12px', padding: '20px', backgroundColor: 'white'}}>
        <h2>CRO Price</h2>
        <p style={{fontSize: '2em', margin: 0}}>{croPrice ? `$${croPrice.toFixed(4)}` : 'Loading...'}</p>
      </div>

      <div style={{border: '1px solid #ccc', borderRadius: '12px', padding: '20px', overflowY: 'auto', backgroundColor: 'white'}}>
        <h2>Next 12h Forecast</h2>
        <table style={{width: '100%', borderCollapse: 'collapse'}}>
          <thead>
            <tr>
              <th style={{borderBottom: '1px solid #ddd', textAlign: 'left', padding: '8px'}}>Time</th>
              <th style={{borderBottom: '1px solid #ddd', textAlign: 'right', padding: '8px'}}>Price (¢/kWh)</th>
            </tr>
          </thead>
          <tbody>
            {forecast.map((item, i) => (
              <tr key={i}>
                <td style={{padding: '8px'}}>{new Date(item.startTime).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</td>
                <td style={{textAlign: 'right', padding: '8px'}}>{(item.perKwh)?.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default App
