import { Locale } from '@/locale/model'
import { State } from '@/store/reducers'
import { listed } from '@/styles/ts/common'
import React from 'react'
import { connect } from 'react-redux'

enum Stage {
  Authenticating = '@Location:Stage:Authenticating',
  AuthError = '@Location:Stage:AuthError',
  Ready = '@Location:Stage:Ready',
  SearchingRoute = '@Location:Stage:SearchingRoute',
  SearchError = '@Location:Stage:SearchError'
}

interface LocalState {}

enum LocalActionType {
  IntoAuthError = '@Location:Action:IntoAuthError',
  IntoReady = '@Location:Action:IntoReady',
  IntoSearchingRoute = '@Location:Action:IntoSearchingRoute'
}

interface LocalActionIntoAuthError {
  type: LocalActionType.IntoAuthError
  status: number
  message: string
}

interface LocalActionIntoReady {
  type: LocalActionType.IntoReady
}

interface DispatchProps {
  locale: Locale
}

const mapProps = (state: State): DispatchProps => ({
  locale: state.lang.dict
})

const Route = (): React.ReactElement => {
  const styles = listed()
}

export default connect<DispatchProps>(mapProps)(Route)

// 52.73070818684601, 15.238668001154027
