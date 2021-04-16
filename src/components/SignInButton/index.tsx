import { FaGithub } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';

import styles from './styles.module.scss';

export function SignInButton () {
  const isUserLoggedIn = false;

  return isUserLoggedIn ? (
    <button
      type="button"
      className={styles.signInButton}
    >
      <FaGithub className={styles.loggedInIcon} />
      Carlos Eduardo
      <FiX className={styles.signOutIcon} />
    </button>
  ) : (
    <button
      type="button"
      className={styles.signInButton}
    >
      <FaGithub className={styles.loggedOutIcon} />
      Sign in with GitHub
    </button>
  )
}