import { BottomNavigation, BottomNavigationAction } from '@material-ui/core'
import HomeIcon from '@material-ui/icons/Home'
import InfoIcon from '@material-ui/icons/Info'
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import React from 'react'
import { connect } from 'react-redux'
import { State } from '@/store/reducers'
import { AnyRecord } from '@/@types/common'
import { Locale } from '@/locale/model'
import { Link } from 'react-router-dom'
import { Routes } from '@/app.routes'
import styles from './styles.module.scss'
import AlertWatch from '../alert-watch'

interface IProps {
  children: React.ReactNode
}

interface StateProps {
  route: Routes
  locale: Locale
  auth: boolean
}

type DispatchProps = AnyRecord

const mapDispatch = () => ({})

const mapProps = (state: State) => {
  return {
    route: state.router.location.pathname as Routes,
    locale: state.lang.dict,
    auth: state.user.loggedIn
  }
}

interface NavProps {
  locale: Locale
  route: Routes
}

const AuthNav = ({ locale, route }: NavProps): React.ReactElement => (
  <BottomNavigation showLabels value={route}>
    <BottomNavigationAction
      label={locale.menu.supervised}
      value={Routes.Supervised}
      component={Link}
      to={Routes.Supervised}
      icon={<SupervisorAccountIcon />}
    />
    <BottomNavigationAction
      label={locale.menu.home}
      value={Routes.Dashboard}
      component={Link}
      to={Routes.Dashboard}
      icon={<HomeIcon />}
    />
    <BottomNavigationAction
      label={locale.menu.account}
      value={Routes.Account}
      component={Link}
      to={Routes.Account}
      icon={<AccountCircleIcon />}
    />
  </BottomNavigation>
)

const UnAuthNav = ({ locale, route }: NavProps): React.ReactElement => (
  <BottomNavigation showLabels value={route}>
    <BottomNavigationAction
      label={locale.menu.about}
      value={Routes.About}
      component={Link}
      to={Routes.About}
      icon={<InfoIcon />}
    />
    <BottomNavigationAction
      label={locale.menu.home}
      value={Routes.Home}
      component={Link}
      to={Routes.Home}
      icon={<HomeIcon />}
    />
    <BottomNavigationAction
      label={locale.menu.signIn}
      value={Routes.SignIn}
      component={Link}
      to={Routes.SignIn}
      icon={<LockOutlinedIcon />}
    />
  </BottomNavigation>
)

const Wrapper = ({ children, route, locale, auth }: StateProps & DispatchProps & IProps): React.ReactElement => {
  return (
    <>
      <div className={styles.wrapper}>
        <section className={styles.view}>{children}</section>
        <nav className={styles.navbar}>
          {auth ? <AuthNav locale={locale} route={route} /> : <UnAuthNav locale={locale} route={route} />}
        </nav>
      </div>
      <AlertWatch />
    </>
  )
}

export default connect<StateProps, DispatchProps, IProps>(mapProps, mapDispatch)(Wrapper)
