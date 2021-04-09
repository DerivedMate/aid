import React from 'react'
import { Helmet } from 'react-helmet'
import { Link, Redirect } from 'react-router-dom'
import { Card, CardActions, CardContent, Typography } from '@material-ui/core'
import { Locale } from '@/locale/model'
import { State } from '@/store/reducers'
import { connect } from 'react-redux'
import { ignore } from '@/helpers/func'
import { AnyRecord } from '@/@types/common'
import { Routes } from '@/app.routes'
import { listed } from '@/styles/ts/common'

interface StateProps {
  locale: Locale
  auth: boolean
}

const mapState = (state: State): StateProps => ({
  locale: state.lang.dict,
  auth: state.user.loggedIn
})

const Dashboard = ({ locale, auth }: StateProps): React.ReactElement => {
  const styles = listed()

  if (!auth) return <Redirect to={Routes.Home} />

  return (
    <>
      <Helmet>
        <title>{locale.title.home}</title>
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
