/* eslint react/no-array-index-key: 0 */
import { Routes } from '@/app.routes'
import Loader from '@/components/loader'
import { getApiBase } from '@/helpers/url'
import { Locale } from '@/locale/model'
import { State } from '@/store/reducers'
import { listed } from '@/styles/ts/common'
import {
  AppBar,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  makeStyles,
  MenuItem,
  Snackbar,
  TextField,
  Toolbar,
  Typography
} from '@material-ui/core'
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft'
import { Alert } from '@material-ui/lab'
import React, { useEffect, useReducer } from 'react'
import { connect } from 'react-redux'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'
import { ValueOf } from 'type-fest'
import { AdditionalInfo, BloodType, SupervisedInfoRes } from '%/query/info.d'
import { GetInfoReqBody, GetInfoRes, GetInfoResFail, SaveInfoReqBody, SaveInfoRes, SaveInfoResFail } from '%/api/info.d'

interface MatchProps {
  supervised_id: string
}

enum Stage {
  Fetching,
  Saving,
  Displaying,
  Editing
}

enum LaType {
  Load,
  Save,
  Display,
  IntoEdit,
  EditInfo,
  EditAdditional,
  EditAdd,
  Error,
  Success,
  ClosePopup
}

// #region
interface LaLoad {
  type: LaType.Load
  info: SupervisedInfoRes
  additional: AdditionalInfo[]
}

interface LaDisplay {
  type: LaType.Display
}

interface LaIntoEdit {
  type: LaType.IntoEdit
}

interface LaEditInfo {
  type: LaType.EditInfo
  key: keyof SupervisedInfoRes
  value: ValueOf<SupervisedInfoRes>
}

enum AdtKind {
  Key,
  Value
}

interface LaEditAdditional {
  type: LaType.EditAdditional
  kind: AdtKind
  index: number
  value: string
}

interface LaEditAdd {
  type: LaType.EditAdd
  key: string
  value: string
}

interface LaError {
  type: LaType.Error
  message: string
}

interface LaSuccess {
  type: LaType.Success
  message: string
}

interface LaSaving {
  type: LaType.Save
}

interface LaClosePopup {
  type: LaType.ClosePopup
}
// #endregion

type LocalAction =
  | LaLoad
  | LaDisplay
  | LaIntoEdit
  | LaEditInfo
  | LaEditAdditional
  | LaEditAdd
  | LaError
  | LaSuccess
  | LaSaving
  | LaClosePopup

interface LocalState {
  stage: Stage
  info: SupervisedInfoRes
  additional: AdditionalInfo[]
  popup: {
    show: boolean
    ok: boolean
    message: string
  }
  editorial: {
    info: SupervisedInfoRes
    additional: AdditionalInfo[]
  }
}

interface DispatchProps {
  locale: Locale
}

const mapProps = (state: State): DispatchProps => ({
  locale: state.lang.dict
})

const makeLocalStyles = makeStyles(theme => ({
  topBar: {
    backgroundColor: theme.palette.grey[200],
    boxShadow: theme.shadows[2],
    width: '100%'
  },

  topBarTitle: {
    color: theme.palette.text.primary,
    marginRight: theme.spacing(3)
  },

  topBarSpace: {
    flexGrow: 1
  },

  keyList: {
    marginTop: theme.spacing(1)
  },

  listSection: {
    backgroundColor: 'inherit'
  },
  ul: {
    backgroundColor: 'inherit',
    padding: 0,
    marginBottom: 0
  },

  textEdit: {
    textAlign: 'right'
  }
}))

const Elem = ({ locale }: DispatchProps): React.ReactElement => {
  const { supervised_id } = useParams<MatchProps>()
  const localStyles = makeLocalStyles()
  const globalStyles = listed()

  console.log(locale.account)

  const [state, dispatch] = useReducer(
    (prev: LocalState, action: LocalAction): LocalState => {
      switch (action.type) {
        case LaType.Display:
          return { ...prev, stage: Stage.Displaying }
        case LaType.Save:
          return { ...prev, stage: Stage.Saving }
        case LaType.IntoEdit:
          return { ...prev, stage: Stage.Editing }
        case LaType.Error:
        case LaType.Success:
          return {
            ...prev,
            popup: { ...prev.popup, show: true, ok: action.type === LaType.Success, message: action.message }
          }
        case LaType.ClosePopup:
          return { ...prev, popup: { ...prev.popup, show: false } }
        case LaType.Load:
          return {
            ...prev,
            stage: Stage.Displaying,
            info: action.info,
            additional: action.additional,
            editorial: {
              info: action.info,
              additional: action.additional
            }
          }
        case LaType.EditInfo:
          return {
            ...prev,
            editorial: { ...prev.editorial, info: { ...prev.editorial.info, [action.key]: action.value } }
          }
        case LaType.EditAdditional: {
          let nv: AdditionalInfo = null

          if (action.kind === AdtKind.Key) nv = { ...prev.editorial.additional[action.index], key: action.value }
          else nv = { ...prev.editorial.additional[action.index], value: action.value }

          if (nv && !nv.key && !nv.value)
            return {
              ...prev,
              editorial: {
                ...prev.editorial,
                additional: prev.editorial.additional.filter((_, i) => i !== action.index)
              }
            }

          return {
            ...prev,
            editorial: {
              ...prev.editorial,
              additional: prev.editorial.additional.map((a, i) => (i === action.index ? nv : a))
            }
          }
        }
        case LaType.EditAdd:
          return {
            ...prev,
            editorial: {
              ...prev.editorial,
              additional: [
                ...prev.editorial.additional,
                {
                  add_info_id: '',
                  key: action.key,
                  value: action.value
                }
              ]
            }
          }
        default:
          console.warn(action)
          return prev
      }
    },
    {
      stage: Stage.Fetching,
      info: null,
      additional: null,
      popup: {
        show: false,
        ok: true,
        message: ''
      },
      editorial: {
        info: null,
        additional: null
      }
    }
  )

  useEffect(() => {
    fetch(`${getApiBase()}/info`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        supervised_id
      } as GetInfoReqBody)
    })
      .then(r =>
        r.json().then((j: GetInfoRes) => {
          if (!j.ok) {
            const { message } = j as GetInfoResFail

            return dispatch({
              type: LaType.Error,
              message: `(${r.status}) ${message}`
            })
          }

          return dispatch({
            type: LaType.Load,
            info: j.info,
            additional: j.additional
          })
        })
      )
      .catch(console.error)
  }, [supervised_id])

  const kpv: Record<keyof SupervisedInfoRes, string> = {
    name: '[PH] Name',
    blood_type: '[PH] Blood Type',
    hc_number: '[PH] Health Card Nr.',
    lastname: '[PH] Last name'
  }

  const handleChangeInfo = (key: keyof SupervisedInfoRes) => (e: React.ChangeEvent<HTMLInputElement>): void => {
    dispatch({
      type: LaType.EditInfo,
      key,
      value: e.target.value
    })
  }

  const handleChangeAdditional = (index: number, kind: AdtKind) => (e: React.ChangeEvent<HTMLInputElement>): void =>
    dispatch({
      type: LaType.EditAdditional,
      kind,
      index,
      value: e.currentTarget.value
    })

  const handleAddAdditional = (key: string, value: string) => (): void =>
    dispatch({
      type: LaType.EditAdd,
      key,
      value
    })

  const switchMode = (): void =>
    dispatch({
      type: LaType.IntoEdit
    })

  const saveChanges = (): void => {
    // send to the server
    // ok ? commit locally : show error
    dispatch({
      type: LaType.Save
    })

    fetch(`${getApiBase()}/info/save`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        supervised_id,
        info: state.editorial.info,
        additional: state.editorial.additional
      } as SaveInfoReqBody)
    }).then(async r => {
      const j: SaveInfoRes = await r
        .text()
        .then(t => JSON.parse(t) as SaveInfoRes)
        .catch(() => ({ ok: false, message: r.statusText } as SaveInfoResFail))

      if (j.ok === false)
        return dispatch({
          type: LaType.Error,
          message: j.message
        })

      dispatch({
        type: LaType.Success,
        message: '[PH] success'
      })

      return dispatch({
        type: LaType.Load,
        info: j.info,
        additional: j.additional
      })
    })
  }

  const handleClosePopUp = () =>
    dispatch({
      type: LaType.ClosePopup
    })

  const content = (() => {
    switch (state.stage) {
      case Stage.Displaying:
        return (
          <List subheader={<li />} className={`${globalStyles.fullCard} ${localStyles.keyList}`}>
            <li key='section-info' className={localStyles.listSection}>
              <ul className={localStyles.ul}>
                <ListSubheader>[PH] Info</ListSubheader>
                {Object.keys(state.info).map((k: keyof SupervisedInfoRes) => (
                  <ListItem divider key={k}>
                    <ListItemText>{kpv[k]}</ListItemText>
                    <Typography>{state.info[k]}</Typography>
                  </ListItem>
                ))}
              </ul>
            </li>
            <li key='section-additional' className={localStyles.listSection}>
              <ul className={localStyles.ul}>
                <ListSubheader>[PH] Additional</ListSubheader>
                {state.additional.map(({ key, value, add_info_id }) => (
                  <ListItem divider key={add_info_id}>
                    <ListItemText>{key}</ListItemText>
                    <Typography>{value}</Typography>
                  </ListItem>
                ))}
              </ul>
            </li>
          </List>
        )
      case Stage.Editing:
        return (
          <List subheader={<li />} className={`${globalStyles.fullCard} ${localStyles.keyList}`}>
            <li key='section-info' className={localStyles.listSection}>
              <ul className={localStyles.ul}>
                <ListSubheader>[PH] Info</ListSubheader>
                {Object.keys(state.editorial.info).map((k: keyof SupervisedInfoRes) => (
                  <ListItem divider key={k}>
                    <ListItemText>{kpv[k]}</ListItemText>
                    <TextField
                      id={k}
                      type='text'
                      value={state.editorial.info[k]}
                      className={localStyles.textEdit}
                      onChange={handleChangeInfo(k)}
                      select={k === 'blood_type'}
                    >
                      {k === 'blood_type' &&
                        ([
                          BloodType.Ap,
                          BloodType.Am,
                          BloodType.Bp,
                          BloodType.Bm,
                          BloodType.ABp,
                          BloodType.ABm,
                          BloodType.Op,
                          BloodType.Om
                        ] as BloodType[])
                          .map(String)
                          .map(t => (
                            <MenuItem key={t} value={t}>
                              {t}
                            </MenuItem>
                          ))}
                    </TextField>
                  </ListItem>
                ))}
              </ul>
            </li>
            <li key='section-additional' className={localStyles.listSection}>
              <ul className={localStyles.ul}>
                <ListSubheader>[PH] Additional</ListSubheader>
                {state.editorial.additional.map(({ add_info_id, key, value }, i) => (
                  <ListItem divider key={`${add_info_id}-${i}`}>
                    <ListItemText>
                      <TextField
                        id={`${add_info_id}-${i}-key`}
                        type='text'
                        value={key}
                        className={localStyles.textEdit}
                        onChange={handleChangeAdditional(i, AdtKind.Key)}
                      />
                    </ListItemText>
                    <TextField
                      id={`${add_info_id}-${i}-value`}
                      type='text'
                      value={value}
                      className={localStyles.textEdit}
                      onChange={handleChangeAdditional(i, AdtKind.Value)}
                    />
                  </ListItem>
                ))}
                <Button onClick={handleAddAdditional('[PH] Key', '[PH] Value')}>[PH] Add</Button>
              </ul>
            </li>
          </List>
        )
      default:
        return <Loader />
    }
  })()

  return (
    <div className={`${globalStyles.container} ${globalStyles.fullCard}`}>
      <Snackbar
        anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
        open={state.popup.show}
        autoHideDuration={6000}
        onClose={handleClosePopUp}
      >
        <Alert severity={state.popup.ok ? 'success' : 'error'} onClose={handleClosePopUp}>
          {state.popup.message}
        </Alert>
      </Snackbar>
      <AppBar component='header' position='static' className={localStyles.topBar}>
        <Toolbar>
          <IconButton edge='start' component={Link} to={Routes.Supervised}>
            <KeyboardArrowLeftIcon />
          </IconButton>
          <Typography variant='h6' className={localStyles.topBarTitle}>
            [PH] Details
          </Typography>
          <div className={localStyles.topBarSpace} />
          <div>
            <Button onClick={state.stage === Stage.Editing ? saveChanges : switchMode}>
              {state.stage === Stage.Editing ? '[PH] Save' : '[PH] Edit'}
            </Button>
          </div>
        </Toolbar>
      </AppBar>
      {content}
    </div>
  )
}

export default connect<DispatchProps>(mapProps)(Elem)
