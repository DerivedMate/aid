/* eslint-disable */
import { State } from '@/store/reducers'
import { ComponentType, ReactElement, useReducer } from 'react'
import { connect, GetProps, Matching } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { Dispatch } from 'redux'

export abstract class Module<LocalState, LocalAction, StateProps, DispatchProps, RouteProps> {
  state: LocalState
  dispatch: (action: LocalAction) => void

  constructor(initialState: LocalState) {
    const [state, dispatch] = useReducer(this.reducer, initialState)
    this.state = state
    this.dispatch = dispatch
  }
  abstract reducer(state: LocalState, action: LocalAction): LocalState
  abstract mapState(state: State): StateProps
  abstract mapDispatch(dispatch: Dispatch): DispatchProps

  abstract render(props: RouteComponentProps<RouteProps> & StateProps & DispatchProps): ReactElement
}

export const connectModel = <
  LocalState,
  LocalAction,
  StateProps,
  DispatchProps,
  RouteProps,
  T extends Module<LocalState, LocalAction, StateProps, DispatchProps, RouteProps> &
    ComponentType<Matching<StateProps & DispatchProps, GetProps<T>>>
>(
  mod: T
) => connect<StateProps, DispatchProps, RouteComponentProps<RouteProps>>(mod.mapState, mod.mapDispatch)(mod)
