import { useEffect, useState } from "react";

async function fetchCoins() {
  const response = await fetch("https://api.coinpaprika.com/v1/tickers");
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const json = await response.json();
  return json;
}

function App() {
  const [loading, setLoading] = useState(true);
  const [coins, setCoins] = useState([]);
  const [purchasableCoinQuantity, setPurchasableCoinQuantity] = useState(0);
  const [selectedCoin, setSelectedCoin] = useState(null);

  useEffect(() => {
    fetchCoins()
      .then((json) => {
        setLoading(false);
        setCoins(json);
        setSelectedCoin(json[0]);
      })
      .catch((error) => {
        console.error("Error fetching coins: ", error);
        setLoading(false);
      });
  }, []);

  const handlePurchasableCoinQuantityChange = (event) => {
    const value = event.target.value;
    if (value >= 0) {
      setPurchasableCoinQuantity((prevQuantity) => value);
    }
  };

  const handleCoinSelect = (event) => {
    const coin = coins.find((coin) => coin.name === event.target.value);
    setSelectedCoin((prevCoin) => coin);
  };

  return (
    <div>
      <h1>The Coins! {loading ? "" : `(${coins.length})`}</h1>
      {loading ? (
        <strong>Loading...</strong>
      ) : (
        <>
          <div>
            <label>Please enter the amount of USD you have: </label>
            <input
              onChange={handlePurchasableCoinQuantityChange}
              value={purchasableCoinQuantity}
              type="number"
            />
          </div>
          <div>
            <select onChange={handleCoinSelect}>
              {coins.map((coin) => (
                <option key={coin.id} value={coin.name}>
                  {coin.name} ({coin.symbol}): ${coin.quotes.USD.price} USD
                </option>
              ))}
            </select>
          </div>
          <div>
            {selectedCoin
              ? `With your current balance, you can purchase ${
                  purchasableCoinQuantity / selectedCoin.quotes.USD.price
                } of that coin.`
              : null}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
