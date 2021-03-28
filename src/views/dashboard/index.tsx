import React from 'react'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import { Card, CardActions, CardContent, makeStyles, Typography } from '@material-ui/core'

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

const styles_ = makeStyles(theme => ({
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
    justifyContent: 'center'
  },

  styledLink: {
    padding: theme.spacing(1),
    textDecoration: 'none'
  }
}))

const Dashboard = ({ locale }: StateProps): React.ReactElement => {
  const styles = styles_()
  return (
    <>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <div className={styles.container}>
        <Card variant='elevation' className={styles.fullCard}>
          <CardContent>
            <Typography variant='h4'>{locale.dashboard.toSupervised.title}</Typography>
            <Typography variant='body2'>{locale.dashboard.toSupervised.body}</Typography>
          </CardContent>
          <CardActions>
            <Link to={Routes.Supervised} className={styles.styledLink}>
              {locale.dashboard.toSupervised.button}
            </Link>
          </CardActions>
        </Card>
      </div>
    </>
  )
}

export default connect<StateProps, AnyRecord, AnyRecord>(mapState, ignore({}))(Dashboard)