import React from 'react'
import { Backdrop, CircularProgress, makeStyles, Typography } from '@material-ui/core'

interface IProps {
  title?: string
}

const makeLocalStyles = makeStyles(theme => ({
  backdrop: {
    zIndex: 100000000,
    color: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed'
  },

  text: {
    color: '#fefefe',
    marginTop: theme.spacing(2)
  }
}))

export default function Loader({ title = '' }: IProps): JSX.Element {
  const styles = makeLocalStyles()

  return (
    <Backdrop open className={styles.backdrop}>
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
