import { fbAuth } from "fbase";
import { useState } from "react";
import styles from "components/AuthForm.module.css";

const AuthFrom = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState("");

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { target: {name, value} } = event;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  }

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      let data
      const auth = fbAuth.getAuth();
      if (newAccount) {
        data = await fbAuth.createUserWithEmailAndPassword(auth, email, password);
      } else {
        data = await fbAuth.signInWithEmailAndPassword(auth, email, password);
      }
      console.log(data);
    } catch (err) {
      if (err instanceof Error)
        setError(err.message);
    }
  }

  const toggleAccount = () => {
    setNewAccount(prev => !prev);
  }

  return (
    <>
      <form onSubmit={onSubmit} className={styles.form}>
        <input 
          name="email" 
          type="email" 
          placeholder="Email" 
          required 
          value={email} 
          onChange={onChange}
          className={styles.input}
        />
        <input
          name="password" 
          type="password" 
          placeholder="Password" 
          required 
          value={password} 
          onChange={onChange}
          className={styles.input}
        />
        <input 
          type="submit" 
          value={newAccount ? "Create Account" : "Log In"} 
          className={`${styles.submit} ${styles.input}`}
        />
        {error && <span className={styles.error}>{error}</span>}
      </form>
      <span onClick={toggleAccount} className={styles.span}>
        {newAccount ? "Sign In" : "Create Account"}
      </span>
    </>
  )
}

export default AuthFrom;