import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Auth from "routes/Auth";
import Home from "routes/Home";
import Navigation from "components/Navigation";
import Profile from "routes/Profile";
import { fbAuth } from "fbase";

interface AppRouterProps {
  isLoggedIn: boolean,
  userObj: fbAuth.User | null,
}

const AppRouter = ({ isLoggedIn, userObj }: AppRouterProps) => {
  
  return (
    <Router>
      {isLoggedIn && <Navigation />}
      <Routes>
        {isLoggedIn 
          ? 
            <>
              <Route path="/" element={<Home userObj={userObj as fbAuth.User} />}/>
              <Route path="/profile" element={<Profile />}/>
              <Route path="*" element={<Navigate to="/" replace />} />
            </> 
          : 
            <>
              <Route path="/" element={<Auth />}/>
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
        }
      </Routes>
    </Router>
  )
}
export default AppRouter;