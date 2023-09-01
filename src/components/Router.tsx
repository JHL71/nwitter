import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Auth from "routes/Auth";
import Home from "routes/Home";
import Navigation from "components/Navigation";
import Profile from "routes/Profile";

interface AppRouterProps {
  refreshUser: () => void,
  isLoggedIn: boolean,
  userObj: User | null,
}

const AppRouter = ({ refreshUser, isLoggedIn, userObj }: AppRouterProps) => {
  
  return (
    <Router>
      {isLoggedIn && <Navigation userObj={userObj as User} />}
      <Routes>
        {isLoggedIn 
          ? 
            <>
              <Route 
                path="/" 
                element={
                  <Home 
                    userObj={userObj as User} 
                  />
                }
              />
              <Route 
                path="/profile" 
                element={
                  <Profile 
                    userObj={userObj as User} 
                    refreshUser={refreshUser}
                  />
                }
              />
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