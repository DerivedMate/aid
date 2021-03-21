import React, { ReactElement, useReducer } from 'react'
import { Helmet } from 'react-helmet'
import { RouteComponentProps, useParams } from 'react-router-dom'

import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Link from '@material-ui/core/Link'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Slide from '@material-ui/core/Slide'
import Alert from '@material-ui/lab/Alert'
import Copyright from '@/components/copyright'
import { AppActionType, UserInfo } from '@/app'
import { DynamicRouteProps } from '@/app.routes'

interface IProps {
  name?: string
}

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
  Password,
  Email,
  HideAlert,
  ShowAlert,
  ShowSuccess
}
interface IAction {
  type: ActionType
  data: string
}

enum Severity {
  Error = 'error',
  Info = 'info',
  Warning = 'warning',
  Success = 'success'
}

interface IState {
  email: string
  password: string
  displayAlert: boolean
  alertMessage: string
  severity: Severity
}

const SignIn = (props: DynamicRouteProps<IProps>): ReactElement => {
  const classes = useStyles()

  const [state, dispatch] = useReducer(
    (prev: IState, action: IAction): IState => {
      switch (action.type) {
        case ActionType.Password:
          return { ...prev, password: action.data }
        case ActionType.Email:
          return { ...prev, email: action.data }
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
    { email: '', password: '', displayAlert: false, alertMessage: '', severity: Severity.Error } as IState
  )

  const onSubmit: React.FormEventHandler<HTMLFormElement> & React.MouseEventHandler<HTMLButtonElement> = (
    e: React.FormEvent<HTMLFormElement> & React.MouseEvent<HTMLButtonElement>
  ): void => {
    e.stopPropagation()
    e.preventDefault()

    // Implement
    const validate = (s: IState) => s.email !== '' && s.password !== ''

    if (!validate(state)) {
      dispatch({
        type: ActionType.ShowAlert,
        data: 'Incorrect data' // Improve: point to the erroneous field &c
      })

      return
    }

    fetch(`${window.location.port === '3000' ? 'https://localhost:3001' : ''}/api/signin`, {
      method: 'POST',
      body: JSON.stringify({
        email: state.email,
        password: state.password
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
        const { name, lastname, email } = JSON.parse(data)
        props.dispatch({
          type: AppActionType.LogIn,
          userInfo: {
            name,
            lastname,
            email
          }
        })
      })
      .catch(err => {
        dispatch({
          type: ActionType.ShowAlert,
          data: JSON.stringify(err)
        })
      })
  }

  const makeOnChange = (type: ActionType) => (e: React.ChangeEvent) => {
    dispatch({
      type,
      data: (e.currentTarget as HTMLInputElement).value.trim()
    })
  }

  const onClose = () =>
    dispatch({
      type: ActionType.HideAlert,
      data: ''
    })

  return (
    <>
      <Helmet>
        <title>Sign In</title>
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
            <LockOutlinedIcon />
          </Avatar>
          <Typography component='h1' variant='h5'>
            Sign in
          </Typography>
          <form className={classes.form}>
            <TextField
              variant='outlined'
              margin='normal'
              required
              fullWidth
              id='email'
              label='Email Address'
              name='email'
              autoComplete='email'
              autoFocus
              onChange={makeOnChange(ActionType.Email)}
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
              onChange={makeOnChange(ActionType.Password)}
            />
            <FormControlLabel control={<Checkbox value='remember' color='primary' />} label='Remember me' />
            <Button
              type='button'
              fullWidth
              variant='contained'
              color='primary'
              className={classes.submit}
              onClick={onSubmit}
            >
              Sign In
            </Button>
            <Grid container justify='space-between'>
              <Grid item>
                <Link href='/' variant='body2'>
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href='/' variant='body2'>
                  Don&apos;t have an account? Sign Up
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

export default SignIn
