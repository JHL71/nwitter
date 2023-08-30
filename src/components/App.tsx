import { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { fbAuth } from "fbase";

declare global {
  interface User {
    displayName: string | null,
    uid: string,
    updateProfile: (args:User) => Promise<void>
  }
}

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState<User|null>(null);

  const refreshUser = () => {
    const user = fbAuth.getAuth().currentUser as fbAuth.User;
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      updateProfile: (args) => fbAuth.updateProfile(user, args)
    })
  };

  useEffect(() => {
    fbAuth.getAuth().onAuthStateChanged((user) => {
      if (user) {
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          updateProfile: (args) => fbAuth.updateProfile(user, args)
        });
      } 
      setInit(true);
    })
  }, [])
  return (
    <>
      {init ? <AppRouter refreshUser={refreshUser} isLoggedIn={Boolean(userObj)} userObj={userObj}/> : "Initializing..."} 
    </>
  );
}

export default App;
