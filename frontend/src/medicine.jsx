// import React, { useState, useEffect } from "react";
// import { jwtDecode } from "jwt-decode";
// import axios from "axios";
// import "./styles/Medicine.css";

// const Medicine = () => {
//   const [userId, setUserId] = useState(null);
//   const [medicines, setMedicines] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [newMedicine, setNewMedicine] = useState({ name: "", time: "" });

//   // Retrieve token and user ID from local storage
//   useEffect(() => {
//     const token = localStorage.getItem("token");

//     if (token) {
//       try {
//         const decodedToken = jwtDecode(token);
//         console.log("Decoded Token:", decodedToken);

//         // Assign userId properly
//         let userId = decodedToken.userId; // Normally should work

//         if (!userId) {
//           console.warn("userId is missing, checking properties manually...");

//           userId = decodedToken["userId"]; // Alternative way
//         }

//         console.log("Extracted userId:", userId);
//       } catch (error) {
//         console.error("Error decoding token:", error);
//       }
//     } else {
//       console.error("No token found in localStorage");
//     }
//   }, []);

//   useEffect(() => {
//     if (!userId || !token) return;

//     const fetchMedicines = async () => {
//       try {
//         const response = await axios.get(
//           `${import.meta.env.VITE_API_URL}/medicines/${userId}`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         setMedicines(response.data);
//       } catch (error) {
//         console.error("Error fetching medicines:", error);
//       }
//     };

//     fetchMedicines();
//   }, [userId]);

//   const handleChange = (e) => {
//     setNewMedicine({ ...newMedicine, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!newMedicine.name || !newMedicine.time) {
//       alert("Please fill all fields");
//       return;
//     }

//     try {
//         const rresponse = await axios.post(
//           `${import.meta.env.VITE_API_URL}/medicine`,
//           { userId, ...newMedicine },  // Ensure userId is correctly set
//           { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } } // Fix token reference
//         );

//         console.log("Response:", rresponse.data);

//       setShowModal(false);
//       setNewMedicine({ name: "", time: "" });

//       // Refresh medicines list
//       const response = await axios.get(
//         `${import.meta.env.VITE_API_URL}/medicines/${userId}`,
//         { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
//     );
//       setMedicines(response.data);
//     } catch (error) {
//       console.error("Error adding medicine:", error);
//     }
//   };

//   return (
//     <div className="medicine-container">
//       <h2>Your Medicines</h2>
//       <ul className="medicine-list">
//         {medicines.length > 0 ? (
//           medicines.map((med) => (
//             <li key={med._id}>
//               <strong>{med.name}</strong> - {med.time}
//             </li>
//           ))
//         ) : (
//           <p>No medicines added yet.</p>
//         )}
//       </ul>

//       {/* Floating "+" button */}
//       <button className="add-button" onClick={() => setShowModal(true)}>
//         +
//       </button>

//       {/* Modal for adding medicine */}
//       {showModal && (
//         <div className="modal-overlay">
//           <div className="modal">
//             <h3>Add Medicine</h3>
//             <form onSubmit={handleSubmit}>
//               <input
//                 type="text"
//                 name="name"
//                 placeholder="Medicine Name"
//                 value={newMedicine.name}
//                 onChange={handleChange}
//                 required
//               />
//               <input
//                 type="time"
//                 name="time"
//                 value={newMedicine.time}
//                 onChange={handleChange}
//                 required
//               />
//               <div className="modal-actions">
//                 <button type="submit" className="submit-btn">
//                   Add
//                 </button>
//                 <button
//                   type="button"
//                   className="cancel-btn"
//                   onClick={() => setShowModal(false)}
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Medicine;

import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirecting
import "./styles/Medicine.css";

const Medicine = () => {
  const [userId, setUserId] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newMedicine, setNewMedicine] = useState({ name: "", time: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserId(decodedToken.userId);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    } else {
      console.error("No token found in localStorage");
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchMedicines = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/medicines/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setMedicines(response.data);
      } catch (error) {
        console.error("Error fetching medicines:", error);
      }
    };

    fetchMedicines();
  }, [userId]);

  const handleChange = (e) => {
    setNewMedicine({ ...newMedicine, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMedicine.name || !newMedicine.time) {
      alert("Please fill all fields");
      return;
    }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/medicine`,
        { userId, ...newMedicine },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setShowModal(false);
      setNewMedicine({ name: "", time: "" });
      setMedicines([...medicines, response.data]);
    } catch (error) {
      console.error("Error adding medicine:", error);
    }
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear token from localStorage
    navigate("/login"); // Redirect to the login page (or home page if needed)
  };

  return (
    <div className="medicine-container">
      <h2>Your Medicines</h2>
      <ul className="medicine-list">
        {/* {medicines.length > 0 ? (
          medicines.map((med) => (
            <li key={med._id}>
              <strong>{med.name}</strong> - {med.time}
            </li>
          ))
        ) : (
          <p>No medicines added yet.</p>
        )} */}

        {medicines.length > 0 ? (
          medicines.map((med, index) => (
            <li key={med._id || index}>
              {" "}
              {/* Ensure a unique key */}
              <strong>{med.name}</strong> - {med.time}
            </li>
          ))
        ) : (
          <p>No medicines added yet.</p>
        )}
      </ul>
      <button className="add-button" onClick={() => setShowModal(true)}>
        +
      </button>

      {/* Logout button */}
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add Medicine</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Medicine Name"
                value={newMedicine.name}
                onChange={handleChange}
                required
              />
              <input
                type="time"
                name="time"
                value={newMedicine.time}
                onChange={handleChange}
                required
              />
              <div className="modal-actions">
                <button type="submit" className="submit-btn">
                  Add
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Medicine;
