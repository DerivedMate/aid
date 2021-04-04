import { getApiBase } from '@/helpers/url'
import { Store } from 'redux'
import { Action } from '../actions'
import { intoAuthorized, logIn } from '../actions/user'
import { SubState } from '../reducers'
import { IsAuthReturn } from '%/api/auth'

const authUser = (store: Store<SubState, Action>): Promise<void> =>
  fetch(`${getApiBase()}/isauth`)
    .then(r => {
      if (!r.ok) throw new Error('API ERROR')

      return r.text()
    })
    .then(t => {
      const d = JSON.parse(t) as IsAuthReturn

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
    .finally(() => store.dispatch(intoAuthorized()))

export default authUser
