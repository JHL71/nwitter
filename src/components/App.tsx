import { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { fbAuth } from "fbase";


function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState<fbAuth.User|null>(null);

  useEffect(() => {
    fbAuth.getAuth().onAuthStateChanged((user) => {
      if (user) {
        setUserObj(user);
      } 
      setInit(true);
    })
  }, [])
  return (
    <>
      {init ? <AppRouter isLoggedIn={Boolean(userObj)} userObj={userObj}/> : "Initializing..."} 
      <footer>&copy; {new Date().getFullYear()} Nwitter</footer>
    </>
  );
}

export default App;
