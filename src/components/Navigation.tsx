import { Link } from "react-router-dom";


interface NavigationProps {
  userObj: User
}

const Navigation = ({ userObj }:NavigationProps) => {
  return (
    <nav>
      <ul>
        <li>
          <Link to='/'>Home</Link>
        </li>
        <li>
          <Link to='/profile'>{userObj.displayName}'s Profile</Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navigation;