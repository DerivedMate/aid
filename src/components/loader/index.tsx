import React from 'react'

// import { ReactComponent as LoaderSVG } from '@/images/loader.svg'

import styles from './loader.module.scss'
import { Backdrop, CircularProgress, makeStyles, Typography } from '@material-ui/core'

interface IProps {
  title?: string
}

const styles_ = makeStyles(theme => ({
  backdrop: {
    zIndex: 100000000,
    color: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed'
  },

  text: {
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(2)
  }
}))

export default function Loader({ title }: IProps): JSX.Element {
  const styles = styles_()

  return (
    <Backdrop open={true} className={styles.backdrop}>
      <CircularProgress color='inherit' />
      {title && (
        <Typography variant='h5' className={styles.text}>
          {title}
        </Typography>
      )}
    </Backdrop>
  )
  /*
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
  */
}
