import { User, UserAction, UserActionType, UserStage } from '../actions/user'

const defaultState: User = {
  stage: UserStage.Authorizing,
  loggedIn: false,
  info: undefined
}

const userReducer = (state: User = defaultState, action: UserAction): User => {
  switch (action.type) {
    case UserActionType.LogOut:
      return { ...state, loggedIn: false, info: undefined }
    case UserActionType.LogIn:
      return { ...state, loggedIn: true, info: action.userInfo }
    case UserActionType.IntoAuthorized:
      return { ...state, stage: UserStage.Authorized }
    default:
      return state
  }
}

export default userReducer
