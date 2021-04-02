import React from 'react'

import { ReactComponent as LoaderSVG } from '@/images/loader.svg'

import styles from './loader.module.scss'
import { Typography } from '@material-ui/core'

interface IProps {
  title?: string
}

export default function Loader({ title }: IProps): JSX.Element {
  return (
    <div className={styles.loaderContainer}>
      <LoaderSVG className={styles.loader} />
      {title && (
        <Typography variant='h5' color='textSecondary'>
          {title}
        </Typography>
      )}
    </div>
  )
}
