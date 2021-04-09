import { getApiBase } from '@/helpers/url'
import { Locale } from '@/locale/model'
import { State } from '@/store/reducers'
import { listed } from '@/styles/ts/common'
import { List, ListItem } from '@material-ui/core'
import React from 'react'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'

interface DispatchProps {
  locale: Locale
}

const mapProps = (state: State): DispatchProps => ({
  locale: state.lang.dict
})

const Elem = ({ locale }: DispatchProps): React.ReactElement => {
  const styles = listed()
  const onLogoutClick = () =>
    fetch(`${getApiBase()}/logout`, {
      method: 'DELETE'
    })
      .then(r => (r.ok ? window.location.reload() : console.error(r)))
      .catch(console.error)

  return (
    <>
      <Helmet>
        <title>{locale.title.account}</title>
      </Helmet>
      <div className={styles.container}>
        <List component='ul' className={styles.fullCard}>
          <ListItem className={styles.fullCard} onClick={onLogoutClick} button>
            {locale.account.logout}
          </ListItem>
        </List>
      </div>
    </>
  )
}

export default connect<DispatchProps>(mapProps)(Elem)
