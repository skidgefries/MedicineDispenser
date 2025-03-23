import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Medicines() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch medicines when the component mounts
    const fetchMedicines = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/medicines`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMedicines(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching medicines', error);
      }
    };

    fetchMedicines();
  }, []);

  const handleMarkAsConsumed = async (medicineId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${import.meta.env.VITE_API_URL}/medicines/${medicineId}`, { taken: true }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMedicines(medicines.map(medicine =>
        medicine._id === medicineId ? { ...medicine, taken: true } : medicine
      ));
    } catch (error) {
      console.error('Error marking as consumed', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Medicine Reminders</h2>
      <ul>
        {medicines.map((medicine) => (
          <li key={medicine._id}>
            <span>{medicine.name} - {medicine.time}</span>
            <button
              onClick={() => handleMarkAsConsumed(medicine._id)}
              disabled={medicine.taken}
            >
              {medicine.taken ? 'Consumed' : 'Mark as Consumed'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Medicines;
