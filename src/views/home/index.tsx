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
import { listed } from '@/styles/ts/common'

interface StateProps {
  locale: Locale
}

const mapState = (state: State): StateProps => ({
  locale: state.lang.dict
})

const makeLocalStyles = makeStyles(theme => ({
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
  },

  center: {
    marginLeft: 'auto',
    marginRight: 'auto'
  }
}))

const Home = ({ locale }: StateProps): React.ReactElement => {
  const styles = makeLocalStyles()
  const globalStyles = listed()

  return (
    <>
      <Helmet>
        <title>{locale.title.home}</title>
      </Helmet>
      <div className={`${globalStyles.container} ${globalStyles.fullCard} ${styles.center}`}>
        <Card variant='elevation' className={globalStyles.fullCard}>
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
