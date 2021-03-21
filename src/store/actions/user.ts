export enum UserActionType {
  LogIn,
  LogOut
}
interface UserActionLogIn {
  type: UserActionType.LogIn
  userInfo: UserInfo
}
interface UserActionLogOut {
  type: UserActionType.LogOut
}
export type UserAction = UserActionLogIn | UserActionLogOut

export interface UserInfo {
  name: string
  lastname: string
  email: string
}

export interface User {
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
