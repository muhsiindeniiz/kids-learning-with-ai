import { Loader2 } from 'lucide-react'

import styles from './page-loading.module.scss'

const PageLoading = props => {
  const { children } = props

  return (
    <div className={styles.wrapper}>
      {children}
      <div className={styles.overlay}>
        <Loader2 className={styles.spinner} />
      </div>
    </div>
  )
}

export default PageLoading
