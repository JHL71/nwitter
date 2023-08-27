import fbAuth from "fbase";
import React from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const onLogOutClick = () => {
    fbAuth.getAuth().signOut();
    navigate("/");
  }
  return (
    <>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  )
}
export default Profile;