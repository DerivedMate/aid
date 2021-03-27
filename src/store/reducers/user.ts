import { User, UserAction, UserActionType } from '../actions/user'

const defaultState: User = {
  loggedIn: false,
  info: undefined
}

const userReducer = (state: User = defaultState, action: UserAction): User => {
  switch (action.type) {
    case UserActionType.LogOut:
      return { ...state, loggedIn: false, info: undefined }
    case UserActionType.LogIn:
      return { ...state, loggedIn: true, info: action.userInfo }
    default:
      return state
  }
}

export default userReducer
