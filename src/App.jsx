import React, { useEffect, useState } from 'react'

const AMBER_API_KEY = 'psk_c97ca862a28306694cbd262795ed7cc4'
const SITE_ID = '6102336833'

function App() {
  const [amberPrice, setAmberPrice] = useState(null)
  const [forecast, setForecast] = useState([])
  const [btcPrice, setBtcPrice] = useState(null)
  const [croPrice, setCroPrice] = useState(null)

  useEffect(() => {
    // This line is now fixed
    async function fetchAllData() {
      // --- Fetch Amber Price ---
      try {
        const amberRes = await fetch(`https://api.amber.com.au/v1/sites/${SITE_ID}/prices/current`, {
          headers: { Authorization: `Bearer ${AMBER_API_KEY}` }
        })
        if (!amberRes.ok) throw new Error(`HTTP error ${amberRes.status}`)
        const amberData = await amberRes.json()
        setAmberPrice(amberData[0]?.perKwh)
      } catch (err) {
        console.error("Amber price fetch failed:", err)
        setAmberPrice("Error")
      }

      // --- Fetch Amber Forecast ---
      try {
        const forecastRes = await fetch(`https://api.amber.com.au/v1/sites/${SITE_ID}/prices`, {
          headers: { Authorization: `Bearer ${AMBER_API_KEY}` }
        })
        if (!forecastRes.ok) throw new Error(`HTTP error ${forecastRes.status}`)
        const forecastData = await forecastRes.json()
        setForecast(forecastData.slice(0, 24))
      } catch (err) {
        console.error("Amber forecast fetch failed:", err)
      }

      // --- Fetch BTC Price ---
      try {
        const btcRes = await fetch('https://api.coindesk.com/v1/bpi/currentprice/BTC.json')
        if (!btcRes.ok) throw new Error(`HTTP error ${btcRes.status}`)
        const btcJson = await btcRes.json()
        setBtcPrice(btcJson.bpi.USD.rate)
      } catch (err) {
        console.error("BTC price fetch failed:", err)
        setBtcPrice("Error")
      }

      // --- Fetch CRO Price ---
      try {
        const croRes = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=crypto-com-chain&vs_currencies=usd')
        if (!croRes.ok) throw new Error(`HTTP error ${croRes.status}`)
        const croJson = await croRes.json()
        if (croJson && croJson['crypto-com-chain']) {
          setCroPrice(croJson['crypto-com-chain'].usd)
        } else {
          setCroPrice("N/A") // Handle case where data might be missing
        }
      } catch (err) {
        console.error("CRO price fetch failed:", err)
        setCroPrice("Error")
      }
    }

    fetchAllData() // Run on initial load
    const interval = setInterval(fetchAllData, 300000) // Refresh every 5 minutes
    return () => clearInterval(interval) // Cleanup on exit
  }, [])

  // Helper function to format price or show status
  const renderPrice = (price, prefix = "$", toFixed = 2) => {
    if (price === null) return "Loading..."
    if (price === "Error" || price === "N/A") return price
    if (typeof price === 'string') return `${prefix}${price}` // For BTC
    return `${prefix}${price.toFixed(toFixed)}`
  }

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
        <p style={{fontSize: '2em', margin: 0}}>{renderPrice(amberPrice, "", 2) === "Error" ? "Error" : `${renderPrice(amberPrice, "", 2)} ¢/kWh`}</p>
      </div>

      <div style={{border: '1px solid #ccc', borderRadius: '12px', padding: '20px', backgroundColor: 'white'}}>
        <h2>BTC Price</h2>
        <p style={{fontSize: '2em', margin: 0}}>{renderPrice(btcPrice)}</p>
      </div>

      <div style={{border: '1px solid #ccc', borderRadius: '12px', padding: '20px', backgroundColor: 'white'}}>
        <h2>CRO Price</h2>
        <p style={{fontSize: '2em', margin: 0}}>{renderPrice(croPrice, "$", 4)}</p>
      </div>

      <div style={{border: '1px solid #ccc', borderRadius: '12px', padding: '20px', overflowY: 'auto', backgroundColor: 'white'}}>
        <h2>Next 12h Forecast</h2>
        {forecast.length > 0 ? (
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
        ) : (
          <p>Loading forecast...</p>
        )}
      </div>
    </div>
  )
}

export default App
