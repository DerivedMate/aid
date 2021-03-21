import React, { ReactElement, useReducer } from 'react'
import { Helmet } from 'react-helmet'

import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import Link from '@material-ui/core/Link'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Slide from '@material-ui/core/Slide'
import Alert from '@material-ui/lab/Alert'
import Copyright from '@/components/copyright'
import { Dispatch } from 'redux'
import { logIn, UserInfo } from '@/store/actions/user'
import { Link as RouterLink, RouteComponentProps } from 'react-router-dom'
import { connect } from 'react-redux'
import { AnyRecord } from '@/@types/common'
import { State } from '@/store/reducers'

const useStyles = makeStyles(theme => ({
  paper: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    marginTop: theme.spacing(8)
  },

  avatar: {
    backgroundColor: theme.palette.secondary.main,
    margin: theme.spacing(1)
  },

  form: {
    marginTop: theme.spacing(1),
    width: '100%' // Fix IE 11 issue.
  },

  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}))

enum ActionType {
  UpdateField,
  HideAlert,
  ShowAlert,
  ShowSuccess
}
interface IAction {
  type: ActionType
  data: string
  key?: string
}

enum Severity {
  Error = 'error',
  Info = 'info',
  Warning = 'warning',
  Success = 'success'
}

interface Credentials {
  email: string
  password: string
  name: string
  lastname: string
}

interface IState {
  credentials: Credentials
  displayAlert: boolean
  alertMessage: string
  severity: Severity
}

interface StateProps {
  loggedIn: boolean
}
interface DispatchProps {
  logIn: (info: UserInfo) => void
}

const mapState = (state: State): StateProps => ({
  loggedIn: state.user.loggedIn
})
const mapDispatch = (dispatch: Dispatch): DispatchProps => ({
  logIn: info => dispatch(logIn(info))
})

const SignUp = (props: RouteComponentProps<AnyRecord> & StateProps & DispatchProps): ReactElement => {
  const classes = useStyles()

  const [state, dispatch] = useReducer(
    (prev: IState, action: IAction): IState => {
      switch (action.type) {
        case ActionType.UpdateField:
          return { ...prev, credentials: { ...prev.credentials, [action.key]: action.data } }
        case ActionType.HideAlert:
          return { ...prev, displayAlert: false }
        case ActionType.ShowAlert:
          return { ...prev, displayAlert: true, alertMessage: action.data, severity: Severity.Error }
        case ActionType.ShowSuccess:
          return { ...prev, displayAlert: true, alertMessage: action.data, severity: Severity.Success }
        default:
          return prev
      }
    },
    {
      credentials: { email: '', password: '', name: '', lastname: '' },
      displayAlert: false,
      alertMessage: '',
      severity: Severity.Error
    } as IState
  )

  const onSubmit: React.FormEventHandler<HTMLFormElement> & React.MouseEventHandler<HTMLButtonElement> = (
    e: React.FormEvent<HTMLFormElement> & React.MouseEvent<HTMLButtonElement>
  ): void => {
    e.stopPropagation()
    e.preventDefault()

    // Implement
    const validate = (c: Credentials) => Object.values(c).every(v => v !== '')

    if (!validate(state.credentials)) {
      dispatch({
        type: ActionType.ShowAlert,
        data: 'Incorrect data' // Improve: point to the erroneous field &c
      })

      return
    }

    fetch(`${window.location.port === '3000' ? 'https://localhost:3001' : ''}/api/signup`, {
      method: 'POST',
      body: JSON.stringify({
        email: state.credentials.email,
        password: state.credentials.password,
        name: state.credentials.name,
        lastname: state.credentials.lastname
      }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
      .then(r => {
        if (!r.ok) throw new Error(r.statusText)
        return r.text()
      })
      .then(data => {
        dispatch({
          type: ActionType.ShowSuccess,
          data
        })

        props.logIn({
          email: state.credentials.email,
          name: state.credentials.name,
          lastname: state.credentials.lastname
        })
      })
      .catch(err => {
        dispatch({
          type: ActionType.ShowAlert,
          data: JSON.stringify(err)
        })
      })
  }

  const makeOnChange = (key: string) => (e: React.ChangeEvent) => {
    dispatch({
      type: ActionType.UpdateField,
      data: (e.currentTarget as HTMLInputElement).value.trim(),
      key
    })
  }

  const onClose = () =>
    dispatch({
      type: ActionType.HideAlert,
      data: ''
    })

  const { loggedIn } = props

  return (
    <>
      <Helmet>
        <title>Sign Up [{String(loggedIn)}]</title>
      </Helmet>
      <Container component='main' maxWidth='xs'>
        <CssBaseline />
        <div className={classes.paper}>
          <Slide direction='down' in={state.displayAlert}>
            <Alert severity={state.severity} onClose={onClose}>
              {state.alertMessage}
            </Alert>
          </Slide>
          <Avatar className={classes.avatar}>
            <RouterLink className='clearLink' to='/'>
              <AssignmentIndIcon />
            </RouterLink>
          </Avatar>
          <Typography component='h1' variant='h5'>
            Sign Up
          </Typography>
          <form className={classes.form}>
            <TextField
              variant='outlined'
              margin='normal'
              required
              fullWidth
              id='name'
              label='First Name'
              name='name'
              autoFocus
              onChange={makeOnChange('name')}
            />
            <TextField
              variant='outlined'
              margin='normal'
              required
              fullWidth
              id='lastname'
              label='Last Name'
              name='lastname'
              onChange={makeOnChange('lastname')}
            />
            <TextField
              variant='outlined'
              margin='normal'
              required
              fullWidth
              id='email'
              label='Email Address'
              name='email'
              autoComplete='email'
              onChange={makeOnChange('email')}
            />
            <TextField
              variant='outlined'
              margin='normal'
              required
              fullWidth
              name='password'
              label='Password'
              type='password'
              id='password'
              autoComplete='current-password'
              onChange={makeOnChange('password')}
            />
            <Button
              type='button'
              fullWidth
              variant='contained'
              color='primary'
              className={classes.submit}
              onClick={onSubmit}
            >
              Sign Up
            </Button>
            <Grid container justify='space-between'>
              <Grid item>
                <Link href='/' variant='body2'>
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href='/' variant='body2'>
                  Already have an account? Sign In!
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
        <Box mt={8}>
          <Copyright />
        </Box>
      </Container>
    </>
  )
}

export default connect<StateProps, DispatchProps, RouteComponentProps<AnyRecord>>(mapState, mapDispatch)(SignUp)
