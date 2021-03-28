import { makeStyles } from '@material-ui/core'

export const listed = makeStyles(theme => ({
  fullCard: {
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    },
    [theme.breakpoints.up('sm')]: {
      width: '500px'
    }
  },

  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  styledLink: {
    padding: theme.spacing(1),
    textDecoration: 'none'
  },

  camouflagedLink: {
    textDecoration: 'none',
    color: theme.palette.text.primary
  },

  topItem: {
    boxShadow: theme.shadows[2],
    backgroundColor: theme.palette.grey[200]
  },

  subItem: {
    boxShadow: theme.shadows[1]
  }
}))
