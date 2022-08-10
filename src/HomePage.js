import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";

import "./HomePage.css";

import { auth, db, logout } from "./firebase";
import { updateProfile } from "firebase/auth";
import { query, collection, getDocs, where } from "firebase/firestore";

import Profile from "./Profile";

function Homepage() {
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const [newName, setNewName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    setName(user.displayName);
  }, [user, loading]);

  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data.name);
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };

  const updateUserName = async (newName) => {
    console.log(newName);
    await updateProfile(auth.currentUser, {
      displayName: newName,
    })
      .then(() => {
        setName(newName);
        setNewName("");
      })
      .catch((error) => {
        console.error(error);
        alert("An error occured while updating user data");
      })
      .then(() => {
        fetchUserName();
      })
      .catch((error) => {
        console.error(error);
        alert("An error occured while fetching user data");
      });
  };

  return (
    <div className="dashboard__container">
      <h1 className="dashboard__title">Welcome, {name}</h1>
      <input
        className="dashboard__textBox"
        placeholder="Type your new name here..."
        type="text"
        onChange={(e) => setNewName(e.target.value)}
      />
      <button
        className="dashboard__btn"
        onClick={() => updateUserName(newName)}
      >
        Edit Name
      </button>
      <Profile />
      <button className="dashboard__btn" onClick={logout}>
        Logout
      </button>
    </div>
  );
}

export default Homepage;
