import { useEffect, useState } from "react";
import { storage } from "./firebase";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { auth } from "./firebase";
// import { useAuthState } from "react-firebase-hooks/auth";

const Profile = () => {
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState(null);

  useEffect(() => {
    if (auth.currentUser) {
      getDownloadURL(ref(storage, `users/${auth.currentUser.uid}/image`))
        .then((url) => {
          setUrl(url);
        })
        .then(() => {
          console.log("success");
        });
    }
  }, []);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (!image) return;
    const imageRef = ref(storage, `users/${auth.currentUser.uid}/image`);
    uploadBytes(imageRef, image)
      .then(() => {
        getDownloadURL(imageRef)
          .then((url) => {
            setUrl(url);
          })
          .catch((error) => {
            console.log(error.message, "error getting the image url");
          });
        setImage(null);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const styles = {
    borderRadius: "10%",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.5)",
    margin: "10px",
  };

  return (
    <div className="App">
      <div>
        <img
          src={url || "https://via.placeholder.com/150"}
          alt="profile"
          width="250"
          height="300"
          style={styles}
        />
      </div>
      <input type="file" onChange={handleImageChange} />
      <br />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default Profile;
