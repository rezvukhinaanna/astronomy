import styles from './error.module.css'
import { Link } from 'react-router'

export const Error = () => {
    return (
        <div className={styles.errorPage}>
            <div className={styles.errorContent}>
                <h1 className={styles.code}>404</h1>
                <p className={styles.message}>Oops! The page you're looking for doesn't exist.</p>
                <Link to="/" className={styles.backButton}>Go Back Home</Link>
            </div>
        </div>
    )
}
