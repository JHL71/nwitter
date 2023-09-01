import { collection, db, fbAuth, getDocs, orderBy, query, where } from "fbase";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "routes/Profile.module.css";

interface ProfileProps {
  refreshUser: () => void,
  userObj: User,
}

const Profile = ({ refreshUser, userObj}: ProfileProps) => {
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const navigate = useNavigate();
  
  
  const onLogOutClick = () => {
    fbAuth.getAuth().signOut();
    navigate("/");
  }

  const getMyNweets = async () => {
    const collectionRef = collection(db, "nweets");
    const q = query(collectionRef, where("creatorId", "==", userObj.uid), orderBy("createdAt", "desc"));
    const nweets = await getDocs(q);
    nweets.docs.forEach((doc) => console.log(doc.data()));
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { target: { value } } = event;
    setNewDisplayName(value);
  }

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      await fbAuth.updateProfile(fbAuth.getAuth().currentUser as fbAuth.User, {
        displayName: newDisplayName,
      })
      refreshUser();
    }
  }

  useEffect(() => {
    getMyNweets();
  }, [])
  return (
    <div className={styles.wrap}>
      <div className={styles.container}>
        <form onSubmit={onSubmit} className={styles.form}>
          <input
            onChange={onChange} 
            type="text" 
            autoFocus
            placeholder="Display name"
            value={newDisplayName as string}
            className={styles.input}
          />
          <input 
            type="submit" 
            value="Update Profile" 
            className={styles.btn}
          />
        </form>
        <span 
          onClick={onLogOutClick} 
          className={`${styles.btn} ${styles.cancel} ${styles.logOut}`}
        >
          Log Out
        </span>
      </div>
    </div>
  )
}
export default Profile;