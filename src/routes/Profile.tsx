import { collection, db, fbAuth, getDocs, orderBy, query, where } from "fbase";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface ProfileProps {
  refreshUser: () => void,
  userObj: User
}

const Profile = ({ refreshUser, userObj }: ProfileProps) => {
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const navigate = useNavigate();
  
  
  const onLogOutClick = () => {
    fbAuth.getAuth().signOut();
    navigate("/");
  }

  const getMyNweets = useCallback(async () => {
    const collectionRef = collection(db, "nweets");
    const q = query(collectionRef, where("creatorId", "==", userObj.uid), orderBy("createdAt", "desc"));
    const nweets = await getDocs(q);
    nweets.docs.forEach((doc) => console.log(doc.data()));
  }, [userObj.uid]);

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
  }, [getMyNweets])
  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          onChange={onChange} 
          type="text" 
          placeholder="Display name"
          value={newDisplayName as string}
        />
        <input type="submit" value="Update Profile" />
      </form>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  )
}
export default Profile;