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
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'column',
    height: '100%',
    overflowY: 'scroll',
    scrollPadding: 0,
    scrollbarWidth: 'thin'
  },

  styledLink: {
    padding: theme.spacing(1),
    textDecoration: 'none'
  },

  camouflagedLink: {
    textDecoration: 'none',
    color: theme.palette.text.primary
  },

  camouflagedLinkDanger: {
    textDecoration: 'none',
    color: theme.palette.error.light
  },

  listItemDanger: {
    textDecoration: 'none',
    color: theme.palette.error.light,
    '& .MuiListItemIcon-root': {
      color: theme.palette.error.light
    }
  },

  buttonedTopLinkPositive: {
    [theme.breakpoints.up('xs')]: {
      backgroundColor: '#29e594',
      position: 'absolute',
      '&:hover': {
        backgroundColor: '#66eca9'
      },
      bottom: theme.spacing(4)
    },
    [theme.breakpoints.down('sm')]: {
      right: theme.spacing(4)
    },
    [theme.breakpoints.up('sm')]: {
      right: `calc(50% - ${theme.spacing(3)}px)`
    }
  },

  topItem: {
    boxShadow: theme.shadows[2],
    backgroundColor: theme.palette.grey[200]
  },

  subItem: {
    boxShadow: theme.shadows[1]
  }
}))
