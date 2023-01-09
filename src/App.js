import React, { useState, useEffect } from "react";

function App() {
  const [customerPurchases, setCustomerPurchases] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://rewards.free.beeceptor.com/customers"
      );
      const data = await response.json();
      setCustomerPurchases(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <p>Loading data...</p>;
  }

  const customers = {};
  customerPurchases.forEach((purchase) => {
    let points = 0;
    if (purchase.amount > 100) {
      points += 2 * (purchase.amount - 100);
    }
    if (purchase.amount > 50) {
      points += 1 * (purchase.amount - 50);
    }
    if (!customers[purchase.customerId]) {
      customers[purchase.customerId] = {};
    }
    if (!customers[purchase.customerId][purchase.month]) {
      customers[purchase.customerId][purchase.month] = { points: 0 };
    }
    customers[purchase.customerId][purchase.month].points += points;
  });

  return (
    <div>
      {Object.keys(customers).map((customerId) => {
        let totalPoints = 0;
        return (
          <div key={customerId}>
            <h3>Customer {customerId}:</h3>
            {Object.keys(customers[customerId]).map((month) => {
              totalPoints += customers[customerId][month].points;
              return (
                <p key={month}>
                  Month: {month} - Points Earned:{" "}
                  {customers[customerId][month].points}
                </p>
              );
            })}
            <p>Total Points Earned: {totalPoints}</p>
          </div>
        );
      })}
    </div>
  );
}


export default App;
