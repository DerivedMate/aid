import { Action } from 'redux'
import { User, UserActionType } from '../actions/user'

const defaultState: User = {
  loggedIn: false,
  info: undefined
}

const userReducer = (state: User = defaultState, action: Action<UserActionType>): User => {
  switch (action.type) {
    case UserActionType.LogOut:
      return { ...state, loggedIn: false, info: undefined }
    default:
      return state
  }
}

export default userReducer
