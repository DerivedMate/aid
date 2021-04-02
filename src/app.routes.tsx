import React from 'react'
import {
  Home as HomeRoute,
  NotFound as NotFoundRoute,
  SignIn as SignInRoute,
  SignUp as SignUpRoute,
  About as AboutRoute,
  Dashboard as DashboardRoute,
  Supervised as SupervisedRoute,
  Medicine as MedicineRoute
} from '@/views'
import { Redirect, Switch } from 'react-router-dom'
import { DeGuardedRoute, GuardedRoute } from './components/guarded-route'
import { UUID } from '%/query/columnTypes'

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
  MedicineBase = '/medicine'
}

export const makeMedicineUrl = (supervised_id: UUID): string => `${Routes.MedicineBase}/${supervised_id}`

interface IProps {
  auth: boolean
}

export const routes = ({ auth }: IProps): React.ReactElement => {
  console.log(auth)
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
        <GuardedRoute auth={auth} path='/404' key='notFound_/404' component={NotFoundRoute} />
        <Redirect to='/404' />
      </Switch>
    </>
  )
}

export default routes
