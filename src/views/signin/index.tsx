import React, { ReactElement, useReducer } from 'react'
import { Helmet } from 'react-helmet'
import { RouteComponentProps } from 'react-router-dom'

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

const Copyright = () => (
  <Typography variant='body2' color='textSecondary' align='center'>
    {'Copyright © '}
    <Link color='inherit' href='https://material-ui.com/'>
      Your Website
    </Link>{' '}
    {new Date().getFullYear()}.
  </Typography>
)

enum ActionType {
  Password,
  Email
}
interface IAction {
  type: ActionType
  data: string
}

interface IState {
  email: string
  password: string
}

const SignIn = (_props: RouteComponentProps<IProps>): ReactElement => {
  const classes = useStyles()

  const [state, dispatch] = useReducer(
    ({ email, password }: IState, action: IAction) => {
      switch (action.type) {
        case ActionType.Password:
          return { email: email, password: action.data }
        case ActionType.Email:
          return { email: action.data, password }
      }
    },
    { email: '', password: '' } as IState
  )

  const onSubmit: React.FormEventHandler<HTMLFormElement> = e => {}

  const makeOnChange = (type: ActionType) => (e: React.ChangeEvent) => {
    dispatch({
      type,
      data: (e.currentTarget as HTMLInputElement).value.trim()
    })
  }

  return (
    <>
      <Helmet>
        <title>About {_props.match.path}</title>
      </Helmet>
      <Container component='main' maxWidth='xs'>
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component='h1' variant='h5'>
            Sign in
          </Typography>
          <form className={classes.form} onSubmit={onSubmit}>
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
            <Button type='submit' fullWidth variant='contained' color='primary' className={classes.submit}>
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
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
