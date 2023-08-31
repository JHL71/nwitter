import { faGithub, faGoogle, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AuthFrom from "components/AuthForm";
import { fbAuth } from "fbase";
import { AuthProvider } from "firebase/auth";
import React from "react";
import styles from "routes/Auth.module.css";

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
    <div className={styles.container}>
      <FontAwesomeIcon
        icon={faTwitter}
        color="#04AAFF"
        size="3x"
        className={styles.icon}
      />
      <AuthFrom />
      <div className={styles.btns}>
        <button onClick={onSocialClick} name="google" className={styles.btn}>
          Continue with Google <FontAwesomeIcon icon={faGoogle} />
        </button>
        <button onClick={onSocialClick} name="github" className={styles.btn}>
          Continue with Github <FontAwesomeIcon icon={faGithub} />
        </button>
      </div>
    </div>
  )
} 
export default Auth;