import { getApiBase } from '@/helpers/url'
import { Store } from 'redux'
import { Action } from '../actions'
import { logIn } from '../actions/user'
import { SubState } from '../reducers'
import { isAuthReturn } from '%/api/auth'

const authUser = (store: Store<SubState, Action>): Promise<void> =>
  fetch(`${getApiBase()}/api/isauth`)
    .then(r => {
      if (!r.ok) throw new Error('API ERROR')

      return r.text()
    })
    .then(t => {
      const d = JSON.parse(t) as isAuthReturn

      if (d.isAuth) {
        const { email, name, lastname } = d.data

        store.dispatch(
          logIn({
            email,
            name,
            lastname
          })
        )
      }
    })
    .catch(e => {
      console.dir(e)
      // End of story. The user is not authorized
    })

export default authUser
