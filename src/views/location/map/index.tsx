import { Locale } from '@/locale/model'
import { State } from '@/store/reducers'
import { listed } from '@/styles/ts/common'
import { Collapse, List, ListItem, ListItemText, makeStyles, Snackbar, Tab, Tabs, Typography } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import DirectionsBikeIcon from '@material-ui/icons/DirectionsBike'
import DriveEtaIcon from '@material-ui/icons/DriveEta'
import DirectionsWalkIcon from '@material-ui/icons/DirectionsWalk'
import AccessibleIcon from '@material-ui/icons/Accessible'
import React, { useEffect, useReducer } from 'react'
import { connect } from 'react-redux'
import { MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet'
import { LineString } from 'geojson'
import { divIcon } from 'leaflet'
import Loader from '@/components/loader'
import { randomWalk } from './mockLocation'
import { fetchDirections, geoJsonOfLeaflet, LatLong, Profile, DirectionFetchResult, leafletOfGeoJson } from './OrsApi'
import { APIKey } from './const'
import { SupervisedListDisplay } from '%/query/supervised'
import CallButton from '../call'

enum Stage {
  FetchingLocation,
  FetchingLocationError,
  RequiringLocation,
  RequiringLocationError,
  FetchingRoute,
  FetchingRouteError,
  Pending,
  ShowingRoute
}

enum LocalActionType {
  IntoFetchingLocation,
  FetchedLocation,
  IntoRequiringLocation,
  IntoError,
  IntoPending,
  UpdateSupervised,
  UpdateOwn,
  IntoShowingRoute,
  SetSupervisedAddress,
  ChangeProfile
}

// #region
interface LocalActionInto {
  type: LocalActionType.IntoFetchingLocation | LocalActionType.IntoRequiringLocation | LocalActionType.IntoPending
}

interface LocalActionFetchedLocation {
  type: LocalActionType.FetchedLocation
  supervisedLocation: LatLong
}

interface LocalActionIntoError {
  type: LocalActionType.IntoError
  stage: Stage.FetchingLocationError | Stage.RequiringLocationError | Stage.FetchingRouteError
  message: string
}

interface LocalActionUpdateSupervised {
  type: LocalActionType.UpdateSupervised
  supervisedLocation: LatLong
}

interface LocalActionUpdateOwn {
  type: LocalActionType.UpdateOwn
  location: LatLong
}

interface LocalActionCloseError {
  type: LocalActionType.IntoPending
}

interface LocalActionIntoShowingRoute {
  type: LocalActionType.IntoShowingRoute
  route: LatLong[]
  distance: number
  duration: number
}

interface LocalActionTypeSetSupervisedAddress {
  type: LocalActionType.SetSupervisedAddress
  supervisedAddress: string
}

interface LocalActionChangeProfile {
  type: LocalActionType.ChangeProfile
  profile: Profile
}

// #endregion
type LocalAction =
  | LocalActionInto
  | LocalActionFetchedLocation
  | LocalActionIntoError
  | LocalActionUpdateSupervised
  | LocalActionUpdateOwn
  | LocalActionCloseError
  | LocalActionIntoShowingRoute
  | LocalActionTypeSetSupervisedAddress
  | LocalActionChangeProfile

interface Unitful {
  mag: number
  unit: string
}

interface LocalState {
  stage: Stage
  route: LatLong[]
  routePopup: {
    distance: Unitful
    duration: Unitful
  }
  supervisedLocation: LatLong
  supervisedAddress: string
  ownLocation: LatLong
  profile: Profile
  res: {
    show: boolean
    message: string
  }
}

interface LocalProps {
  supervised: SupervisedListDisplay
}

interface DispatchProps {
  locale: Locale
}

const mapProps = (state: State): DispatchProps => ({
  locale: state.lang.dict
})

const makeLocalStyes = makeStyles(theme => ({
  map: {
    height: '40vh'
  },
  mapSector: {
    marginBottom: theme.spacing(2)
  },

  centerButton: {
    textAlign: 'center'
    // boxShadow: theme.shadows[1]
  },

  mapPopUp: {
    padding: theme.spacing(2)
  },

  semiFullCard: {
    width: `calc(100% - ${theme.spacing(1)}px)`,
    margin: `${theme.spacing(1)} ${theme.spacing(1)}`
  },

  fullWidth: {
    width: '100%'
  },

  rootSpread: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },

  faintGray: {
    backgroundColor: theme.palette.grey[100]
  },

  callButton: {
    marginTop: theme.spacing(1)
  }
}))

const makeCustomMarker = (color: string) => {
  const styles = `
    background-color: ${color};
    width: 2rem;
    height: 2rem;
    display: block;
    left: -1.5rem;
    top: -1.5rem;
    position: relative;
    border-radius: 2rem 2rem 0;
    transform: rotate(45deg);
    border: 0.5px solid #FFFFFF;
    box-shadow: 0 0 1px 0.5px #2b2b2b;`

  return divIcon({
    className: '',
    iconAnchor: [0, 24],
    popupAnchor: [-8, -36],
    html: `<span style="${styles}" />`
  })
}

const PHSupervisedLocation: LatLong = [52.73101709012718, 15.23381079831591]

const Elem = ({ locale, supervised }: LocalProps & DispatchProps) => {
  const localStyles = makeLocalStyes()
  const globalStyles = listed()

  const [state, dispatch] = useReducer(
    (prev: LocalState, action: LocalAction): LocalState => {
      switch (action.type) {
        case LocalActionType.IntoError:
          return { ...prev, res: { ...prev.res, message: action.message, show: true }, stage: action.stage }
        case LocalActionType.FetchedLocation:
          return { ...prev, supervisedLocation: action.supervisedLocation }
        case LocalActionType.IntoFetchingLocation:
          return { ...prev, stage: Stage.FetchingLocation }
        case LocalActionType.IntoPending:
          return { ...prev, stage: Stage.Pending, res: { ...prev.res, show: false }, route: [] }
        case LocalActionType.IntoRequiringLocation:
          return { ...prev, stage: Stage.RequiringLocation }
        case LocalActionType.IntoShowingRoute: {
          const distInHigher = action.distance > 1000 // should convert to km?
          const durInHigher = action.duration > 3600 // should convert to hours?

          return {
            ...prev,
            stage: Stage.ShowingRoute,
            route: action.route,
            routePopup: {
              ...prev.routePopup,
              duration: {
                mag: Math.floor((durInHigher ? action.duration / 3600 : action.duration / 60) * 100) / 100,
                unit: durInHigher ? 'h' : 'min'
              },
              distance: {
                mag: Math.floor((distInHigher ? action.distance / 1000 : action.distance) * 100) / 100,
                unit: distInHigher ? 'km' : 'm'
              }
            }
          }
        }
        case LocalActionType.UpdateOwn:
          return { ...prev, ownLocation: action.location }
        case LocalActionType.UpdateSupervised:
          return { ...prev, supervisedLocation: action.supervisedLocation }
        case LocalActionType.SetSupervisedAddress:
          return { ...prev, supervisedAddress: action.supervisedAddress }
        case LocalActionType.ChangeProfile:
          return { ...prev, profile: action.profile }
        default:
          return prev
      }
    },
    {
      stage: Stage.FetchingLocation,
      route: [],
      routePopup: {
        distance: {
          mag: 0,
          unit: 'm'
        },
        duration: {
          mag: 0,
          unit: 'm'
        }
      },
      supervisedLocation: null,
      supervisedAddress: '',
      ownLocation: null,
      profile: Profile.DrivingCar,
      res: {
        show: false,
        message: ''
      }
    }
  )

  // Random Walk
  useEffect(() => {
    setTimeout(
      (p: LatLong) => {
        dispatch({
          type: LocalActionType.UpdateSupervised,
          supervisedLocation: randomWalk(p, 0.0001)
        })

        if (!state.supervisedLocation)
          dispatch({
            type: LocalActionType.IntoPending
          })
      },
      2000,
      state.supervisedLocation || PHSupervisedLocation
    )
  }, [state.supervisedLocation])

  const handleClosePopUp = () =>
    dispatch({
      type: LocalActionType.IntoPending
    })

  const calcRoute = (start: LatLong, end: LatLong, profile: Profile): void => {
    fetchDirections(APIKey, [start, end].map(geoJsonOfLeaflet), profile).then(r => {
      switch (r.ok) {
        case DirectionFetchResult.Success: {
          const f = r.res.features[0]

          return dispatch({
            type: LocalActionType.IntoShowingRoute,
            route: (f.geometry as LineString).coordinates.map(leafletOfGeoJson),
            distance: f.properties.summary.distance as number, // eslint-disable-line
            duration: f.properties.summary.duration as number // eslint-disable-line
          })
        }

        default:
          return dispatch({
            type: LocalActionType.IntoError,
            message: r.message,
            stage: Stage.FetchingRouteError
          })
      }
    })
  }

  const onCalcRoute = () => {
    if (state.stage === Stage.RequiringLocation) return

    dispatch({
      type: LocalActionType.IntoRequiringLocation
    })

    navigator.geolocation.getCurrentPosition(
      p => {
        const ownLocation: LatLong = [p.coords.latitude, p.coords.longitude]

        dispatch({
          type: LocalActionType.UpdateOwn,
          location: ownLocation
        })

        calcRoute(ownLocation, state.supervisedLocation, state.profile)
      },
      e => {
        dispatch({
          type: LocalActionType.IntoError,
          stage: Stage.RequiringLocationError,
          message: e.message
        })
      },
      {
        enableHighAccuracy: true
      }
    )
  }

  const closeRoute = () =>
    dispatch({
      type: LocalActionType.IntoPending
    })

  const handleProfileClick = (_: unknown, v: Profile) => {
    if (v !== state.profile) {
      dispatch({
        type: LocalActionType.ChangeProfile,
        profile: v
      })

      if (state.stage === Stage.ShowingRoute) calcRoute(state.ownLocation, state.supervisedLocation, v)
    }
  }

  const mapButtonText = (() => {
    switch (state.stage) {
      case Stage.FetchingLocation:
        return "[PH] Fetching ward's location"
      case Stage.FetchingRoute:
        return '[PH] Fetching Route'
      case Stage.FetchingRouteError:
        return '[PH] Retry Fetching Route'
      case Stage.RequiringLocation:
        return '[PH] Accept Location Inquiry'
      case Stage.ShowingRoute:
        return '[PH] Recalculate Route'
      default:
        return '[PH] Calculate Route'
    }
  })()

  if (state.stage === Stage.FetchingLocation) return <Loader title="[PH] Fetching Ward's Location" />

  return (
    <div className={localStyles.rootSpread}>
      <Snackbar
        anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
        open={state.res.show}
        autoHideDuration={6000}
        onClose={handleClosePopUp}
      >
        <Alert severity='error' onClose={handleClosePopUp}>
          {state.res.message}
        </Alert>
      </Snackbar>
      <section className={localStyles.mapSector}>
        <MapContainer className={`${localStyles.map}`} center={PHSupervisedLocation} zoom={13} scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          />
          <Polyline positions={state.route} pathOptions={{ color: '#2f2ff5' }}>
            <Popup maxWidth={250} maxHeight={80}>
              <Typography variant='body1'>
                [PH] dist: {state.routePopup.distance.mag} {state.routePopup.distance.unit}
              </Typography>
              <Typography variant='body2'>
                [PH] duration: {state.routePopup.duration.mag} {state.routePopup.duration.unit}
              </Typography>
            </Popup>
          </Polyline>

          <Marker icon={makeCustomMarker('#62d9fc')} position={state.supervisedLocation}>
            <Popup className={localStyles.mapPopUp}>
              <Typography variant='body1'>
                {supervised.name} {supervised.lastname}
              </Typography>
              <Typography variant='body2'>{supervised.supervised_id} </Typography>
              {state.supervisedAddress}
            </Popup>
          </Marker>
          {state.ownLocation && (
            <Marker icon={makeCustomMarker('#e3d091')} position={state.ownLocation}>
              <Popup className={localStyles.mapPopUp}>
                [PH] Your location; {locale.medicine.common.button.confirm}
              </Popup>
            </Marker>
          )}
        </MapContainer>
        <Tabs
          value={state.profile}
          onChange={handleProfileClick}
          indicatorColor='primary'
          variant='fullWidth'
          scrollButtons='auto'
          aria-label='Profiles'
          className={`${localStyles.fullWidth} ${globalStyles.topItem}`}
        >
          <Tab value={Profile.CyclingRegular} icon={<DirectionsBikeIcon />} />
          <Tab value={Profile.DrivingCar} icon={<DriveEtaIcon />} />
          <Tab value={Profile.FootWalking} icon={<DirectionsWalkIcon />} />
          <Tab value={Profile.Wheelchair} icon={<AccessibleIcon />} />
        </Tabs>
      </section>
      <List className={`${globalStyles.container} ${globalStyles.fullCard}`}>
        <ListItem
          button
          className={`${localStyles.centerButton} ${globalStyles.topItem} ${localStyles.semiFullCard}`}
          onClick={onCalcRoute}
        >
          <ListItemText primary={mapButtonText} />
        </ListItem>
        <Collapse in={state.stage === Stage.ShowingRoute} className={`${localStyles.semiFullCard}`}>
          <ListItem
            button
            onClick={closeRoute}
            className={`${localStyles.centerButton} ${globalStyles.listItemDanger} ${localStyles.faintGray}`}
          >
            <ListItemText primary='[PH] Cancel Route' />
          </ListItem>
        </Collapse>
        <CallButton
          buttonClassName={`${localStyles.centerButton} ${globalStyles.topItem} ${localStyles.semiFullCard} ${localStyles.callButton}`}
        />
      </List>
    </div>
  )
}

export default connect<DispatchProps>(mapProps)(Elem)
/**
 
 */
