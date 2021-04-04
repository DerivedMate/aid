export enum UserStage {
  Authorizing = '@User:Stage:Authorizing',
  /** @description Either logged in or not */
  Authorized = '@User:Stage:Authorized'
}

export enum UserActionType {
  LogIn = '@User:Action:LogIn',
  LogOut = '@User:Action:LogOut',
  IntoAuthorized = '@User:Action:IntoAuthorized'
}
interface UserActionLogIn {
  type: UserActionType.LogIn
  userInfo: UserInfo
}
interface UserActionLogOut {
  type: UserActionType.LogOut
}
interface UserActionIntoAuthorized {
  type: UserActionType.IntoAuthorized
}
export type UserAction = UserActionLogIn | UserActionLogOut | UserActionIntoAuthorized

export interface UserInfo {
  name: string
  lastname: string
  email: string
}

export interface User {
  stage: UserStage
  loggedIn: boolean
  info?: UserInfo
}

export const logIn = (userInfo: UserInfo): UserActionLogIn => ({
  type: UserActionType.LogIn,
  userInfo
})

export const logOut = (): UserActionLogOut => ({
  type: UserActionType.LogOut
})

export const intoAuthorized = (): UserActionIntoAuthorized => ({
  type: UserActionType.IntoAuthorized
})
