import React from 'react'
import {
  Home as HomeRoute,
  NotFound as NotFoundRoute,
  SignIn as SignInRoute,
  SignUp as SignUpRoute,
  About as AboutRoute,
  Dashboard as DashboardRoute,
  Supervised as SupervisedRoute,
  Medicine as MedicineRoute,
  Account as AccountRoute,
  Location as LocationRoute,
  Info as InfoRoute
} from '@/views'
import { Redirect, Route, Switch } from 'react-router-dom'
import { connect } from 'react-redux'
import { DeGuardedRoute, GuardedRoute } from './components/guarded-route'
import { UUID } from '%/query/columnTypes'
import { State } from './store/reducers'
import { UserStage } from './store/actions/user'
import Loader from './components/loader'
import { Locale } from './locale/model'

export enum Routes {
  // General
  Home = '/',
  Null = '',
  // Not logged in
  SignIn = '/signin',
  SignUp = '/signup',
  About = '/about',
  // Logged in
  Supervised = '/supervised',
  Account = '/account',
  Dashboard = '/dashboard',
  MedicineBase = '/medicine',
  LocationBase = '/location',
  InfoBase = '/info'
}

export const makeIdUrlMaker = (route: Routes) => (supervised_id: UUID): string => `${route}/${supervised_id}`

export const makeMedicineUrl = makeIdUrlMaker(Routes.MedicineBase)
export const makeLocationUrl = makeIdUrlMaker(Routes.LocationBase)
export const makeInfoUrl = makeIdUrlMaker(Routes.InfoBase)

interface DispatchProps {
  auth: boolean
  authorizing: boolean
  locale: Locale
}

const mapProps = (state: State): DispatchProps => ({
  auth: state.user.loggedIn,
  authorizing: state.user.stage === UserStage.Authorizing,
  locale: state.lang.dict
})

export const routes = ({ auth, authorizing, locale }: DispatchProps): React.ReactElement => {
  console.log(auth)

  if (authorizing) return <Loader title={locale.medicine.common.loading.authorizing} />

  return (
    <>
      <Switch>
        <DeGuardedRoute
          auth={auth}
          deGuarded
          redirectTo={Routes.Dashboard}
          exact
          path={Routes.Home}
          key='home_/'
          component={HomeRoute}
        />
        <DeGuardedRoute
          auth={auth}
          deGuarded
          redirectTo={Routes.Dashboard}
          path={Routes.SignIn}
          key='signin_/signin'
          component={SignInRoute}
        />
        <DeGuardedRoute
          auth={auth}
          deGuarded
          redirectTo={Routes.Dashboard}
          path={Routes.SignUp}
          key='signup_/signup'
          component={SignUpRoute}
        />
        <GuardedRoute auth={auth} guarded path={Routes.About} key='about_/about' component={AboutRoute} />
        <GuardedRoute
          auth={auth}
          guarded
          path={Routes.Dashboard}
          key='dashboard_/dashboard'
          component={DashboardRoute}
        />
        <GuardedRoute
          auth={auth}
          guarded
          path={Routes.Supervised}
          key='supervised_/supervised'
          component={SupervisedRoute}
        />
        <GuardedRoute
          auth={auth}
          guarded
          path={`${Routes.MedicineBase}/:supervised_id`}
          key='medicine_/medicine'
          component={MedicineRoute}
        />
        <GuardedRoute
          auth={auth}
          guarded
          path={`${Routes.LocationBase}/:supervised_id`}
          key='location_/location'
          component={LocationRoute}
        />
        <GuardedRoute
          auth={auth}
          guarded
          path={`${Routes.InfoBase}/:supervised_id`}
          key='info_/info'
          component={InfoRoute}
        />
        <GuardedRoute
          auth={auth}
          path={Routes.Account}
          key='account_/account'
          component={AccountRoute}
          redirectTo={Routes.Home}
        />
        <Route path='/404' key='notFound_/404' component={NotFoundRoute} />
        <Redirect to='/404' />
      </Switch>
    </>
  )
}

export default connect<DispatchProps>(mapProps)(routes)
