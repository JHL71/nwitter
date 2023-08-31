import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import styles from 'components/Navigation.module.css'

interface NavigationProps {
  userObj: User
}

const Navigation = ({ userObj }:NavigationProps) => {
  return (
    <nav>
      <ul className={styles.ul}>
        <li>
          <Link to='/' className={styles.homeLink}>
            <FontAwesomeIcon icon={faTwitter} color="#04AAFF" size="2x" />
          </Link>
        </li>
        <li>
          <Link to='/profile' className={styles.profileLink}>
            <FontAwesomeIcon icon={faUser} color="#04AAFF" size="2x" />
            <span>
              {userObj.displayName 
                ? `${userObj.displayName}'s Profile`
                : "Profile"}
            </span>
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navigation;