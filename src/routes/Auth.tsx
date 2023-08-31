import AuthFrom from "components/AuthForm";
import { fbAuth } from "fbase";
import { AuthProvider } from "firebase/auth";
import React from "react";

const Auth = () => {

  const onSocialClick = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const { name } = event.target as HTMLButtonElement;
    const auth = fbAuth.getAuth();
    let provider: AuthProvider | undefined;
    if (name === "google") {
      provider = new fbAuth.GoogleAuthProvider();
    } else if (name === "github") {
      provider = new fbAuth.GithubAuthProvider();
    } 
    if (provider) {
      const data = await fbAuth.signInWithPopup(auth, provider);
      console.log(data);
    } 
  }

  return (
    <div>
      <AuthFrom />
      <div>
        <button onClick={onSocialClick} name="google" >Continue with Google</button>
        <button onClick={onSocialClick} name="github" >Continue with Github</button>
      </div>
    </div>
  )
} 
export default Auth;