import { Store } from 'redux'
import { Action } from '../actions'
import { logIn, UserInfo } from '../actions/user'
import { SubState } from '../reducers'

interface IsAuthSuccess {
  isAuth: true
  data: UserInfo
}

interface IsAuthFail {
  isAuth: false
}

type IsAuthReturn = IsAuthFail | IsAuthSuccess

const authUser = (store: Store<SubState, Action>): Promise<void> =>
  fetch(`${window.location.port === '3000' ? 'https://localhost:3001' : ''}/api/isauth`)
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

export default authUser
