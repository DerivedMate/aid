import { BottomNavigation, BottomNavigationAction } from '@material-ui/core'
import HomeIcon from '@material-ui/icons/Home'
import LocalHospitalIcon from '@material-ui/icons/LocalHospital'
import RecentActorsIcon from '@material-ui/icons/RecentActors'
import LocationOnIcon from '@material-ui/icons/LocationOn'
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import React from 'react'
import { connect } from 'react-redux'
import { State } from '@/store/reducers'
import { AnyRecord } from '@/@types/common'
import styles from './styles.module.scss'
import { findRV, Key, transposeDict } from '@/helpers/dicts'
import About from '@/views/about'
import { Locale } from '@/locale/model'
import { Link } from 'react-router-dom'

interface IProps {
  children: React.ReactNode
}

enum Routes {
  // General
  Home = 'home',
  Null = '',
  // Not logged in
  SignIn = 'signin',
  About = 'about',
  // Logged in
  Supervised = 'supervised',
  Account = 'account'
}

const __routeMap__ = {
  '/': Routes.Home,
  '/404': Routes.Null,
  '/about': Routes.About,
  '/signin': Routes.SignIn,
  '/supervised': Routes.Supervised,
  '/account': Routes.Account
}

const __routeMapRev__ = transposeDict(__routeMap__)

interface StateProps {
  route: Routes
  locale: Locale
  auth: boolean
}

type DispatchProps = AnyRecord

const mapDispatch = () => ({})

const mapProps = (state: State) => {
  return {
    route: findRV(__routeMap__, Routes.Null, state.router.location.pathname),
    locale: state.lang.dict,
    auth: state.user.loggedIn
  }
}

const Wrapper = ({ children, route, locale }: StateProps & DispatchProps & IProps): React.ReactElement => {
  return (
    <div className={styles.wrapper}>
      <section className={styles.view}>{children}</section>
      <nav className={styles.navbar}>
        <BottomNavigation showLabels value={route}>
          <BottomNavigationAction
            label={locale.menu.supervised}
            value={Routes.Supervised}
            component={Link}
            to='/supervised'
            icon={<SupervisorAccountIcon />}
          />
          <BottomNavigationAction
            label={locale.menu.home}
            value={Routes.Home}
            component={Link}
            to='/'
            icon={<HomeIcon />}
          />
          <BottomNavigationAction
            label={locale.menu.account}
            value={Routes.Account}
            component={Link}
            to='/about'
            icon={<AccountCircleIcon />}
          />
        </BottomNavigation>
      </nav>
    </div>
  )
}

export default connect<StateProps, DispatchProps, IProps>(mapProps, mapDispatch)(Wrapper)
