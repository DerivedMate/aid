import React from 'react'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import { Button, Card, CardActions, CardContent, Grid, makeStyles, Typography } from '@material-ui/core'

import { Locale } from '@/locale/model'
import { State } from '@/store/reducers'
import { connect } from 'react-redux'
import { ignore } from '@/helpers/func'
import { AnyRecord } from '@/@types/common'
import { Routes } from '@/app.routes'

interface StateProps {
  locale: Locale
}

const mapState = (state: State): StateProps => ({
  locale: state.lang.dict
})

const makeLocalStyles = makeStyles(theme => ({
  fullCard: {
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    },
    [theme.breakpoints.up('sm')]: {
      width: '500px'
    }
  },

  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  },

  styledLink: {
    padding: theme.spacing(1),
    textDecoration: 'none'
  },

  buttonBox: {
    marginTop: theme.spacing(1)
  },

  gridButton: {
    alignContent: 'space-around',
    height: '2rem'
  },

  button: {
    width: '100%'
  },

  buttonLink: {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    height: 'fit-content',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1)
  }
}))

const Home = ({ locale }: StateProps): React.ReactElement => {
  const styles = makeLocalStyles()

  return (
    <>
      <Helmet>
        <title>Home</title>
      </Helmet>
      <div className={styles.container}>
        <Card variant='elevation' className={styles.fullCard}>
          <CardContent>
            <Typography variant='h4'>{locale.home.toAbout.title}</Typography>
            <Typography variant='h6'>{locale.home.toAbout.subtitle}</Typography>
            <Typography variant='body2'>{locale.home.toAbout.body}</Typography>
          </CardContent>
          <CardActions>
            <Link to='/about' className={styles.styledLink}>
              {locale.commonButtons.learnMore}
            </Link>
          </CardActions>
        </Card>
        <Grid container spacing={1} className={styles.buttonBox}>
          <Grid item xs={6} className={styles.gridButton}>
            <Button variant='contained' className={styles.button}>
              <Link className={styles.buttonLink} to={Routes.SignIn}>
                {locale.signIn.signIn}
              </Link>
            </Button>
          </Grid>
          <Grid item xs={6} className={styles.gridButton}>
            <Button variant='contained' className={styles.button}>
              <Link className={styles.buttonLink} to={Routes.SignUp}>
                {locale.signUp.signUp}
              </Link>
            </Button>
          </Grid>
        </Grid>
      </div>
    </>
  )
}

export default connect<StateProps, AnyRecord, AnyRecord>(mapState, ignore({}))(Home)
/*
  const onPressReg = () => {
    window.Notification.requestPermission()
      .then(notPerm => {
        if (notPerm !== 'granted') {
          throw new Error('Permission not granted for Notification')
        }
      })
      .catch(console.error)
  }

  navigator.serviceWorker.addEventListener('message', msg => {
    console.dir(msg)
  })

  const onNotify = () => {
    navigator.serviceWorker.getRegistration().then(
      r =>
        r &&
        r.active.postMessage(
          JSON.stringify({
            type: 'LO_QUE_SEA',
            title: 'Message title',
            body: 'El cuerpo o lo que sea, no sé'
          })
        )
    )
  }
  

  const onPressTrigger = () => {
    showLocalNotification('This better fucking work', 'Coño, te mataré si no funciona esta wea... te lo juro')
  }
  */

/*
const showLocalNotification = (title: string, body: string): void => {
  const options = {
    body
  }

  navigator.serviceWorker
    .getRegistration()
    .then(r => r && r.showNotification(title, options))
    .catch(e => {
      console.error(e)
    })
}
*/
