import { collection, db, deleteObject, fbAuth, getDocs, getDownloadURL, orderBy, query, ref, storage, uploadString, where } from "fbase";
import { DocumentData } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "routes/Profile.module.css";

interface ProfileProps {
  refreshUser: () => void,
  userObj: User,
}

const Profile = ({ refreshUser, userObj}: ProfileProps) => {
  const [profileImg, setProfileImg] = useState(userObj.photo);
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
    if (userObj.photo !== null && userObj.photo !== profileImg) {
      const photoRef = ref(storage, `${userObj.uid}/profile`);
      try {
        await deleteObject(photoRef);
      } catch (err) {
        console.log(err);
      }
      await uploadString(photoRef, profileImg as string, 'data_url');
      profileImgUrl  = await getDownloadURL(photoRef);
    }
    if (userObj.displayName !== newDisplayName || userObj.photo !== profileImg) {
      await fbAuth.updateProfile(fbAuth.getAuth().currentUser as fbAuth.User, {
        displayName: newDisplayName,
        photoURL: profileImgUrl ? profileImgUrl : userObj.photo
      })
      refreshUser();
    }
  }

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { target: { files }} = event;
    if (files) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = (finishEvent) => {
        if (finishEvent.target) {
          const { target: { result } } = finishEvent;
          setProfileImg(result as string);
        }
      }
      if (file) {
        reader.readAsDataURL(file)
      }
      
    }
  }


  useEffect(() => {
    getMyNweets();
  }, [])

  return (
    <div className={styles.wrap}>
      <div className={styles.container}>
        <div className={styles.profile}>
          <img 
            src={profileImg || "undefined"} 
            alt="profile" 
            className={styles.img}
            />
          <div className={styles.written}>
            written nweets {nweets.length} 
          </div>
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