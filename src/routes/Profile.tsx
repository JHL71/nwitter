import { collection, db, fbAuth, getDocs, getDownloadURL, orderBy, query, ref, storage, uploadString, where } from "fbase";
import { DocumentData } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "routes/Profile.module.css";
import { v4 as uuidv4 } from "uuid";

interface ProfileProps {
  refreshUser: () => void,
  userObj: User,
}

const Profile = ({ refreshUser, userObj}: ProfileProps) => {
  const [profileImg, setProfileImg] = useState("");
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const [nweets, setNweets] = useState<DocumentData[]>([]);
  const navigate = useNavigate();
  
  
  const onLogOutClick = () => {
    fbAuth.getAuth().signOut();
    navigate("/");
  }

  const getMyNweets = async () => {
    const collectionRef = collection(db, "nweets");
    const q = query(collectionRef, where("creatorId", "==", userObj.uid), orderBy("createdAt", "desc"));
    const nweets = (await getDocs(q));
    setNweets(nweets.docs.map((el) => el.data()))
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { target: { value } } = event;
    setNewDisplayName(value);
  }

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let profileImgUrl = "";
    if (profileImg !== "") {
      const profileImgRef = ref(storage, `${userObj.uid}/${uuidv4()}`);
      await uploadString(profileImgRef, profileImg as string, 'data_url');
      profileImgUrl  = await getDownloadURL(profileImgRef);
    }
    if (userObj.displayName !== newDisplayName) {
      await fbAuth.updateProfile(fbAuth.getAuth().currentUser as fbAuth.User, {
        displayName: newDisplayName,
        photoURL: profileImgUrl
      })
      refreshUser();
    }
    setProfileImg("");
  }

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { target: { files }} = event;
    if (files) {

    }
  }


  useEffect(() => {
    getMyNweets();
  }, [])
  return (
    <div className={styles.wrap}>
      <div className={styles.container}>
        <div className={styles.profile}>
          <div>
            written nweets {nweets.length} 
          </div>
          <img 
            src={userObj.photo || "undefined"} 
            alt="profile" 
            className={styles.img}
          />
        </div>
        <form onSubmit={onSubmit} className={styles.form}>
          <input 
            type="file" 
            accept="image/*"
            onChange={onFileChange}
            className={styles.imgInput}
          />
          <input
            onChange={onChange} 
            type="text" 
            autoFocus
            placeholder="Display name"
            value={newDisplayName as string || ""}
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