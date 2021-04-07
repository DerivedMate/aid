import { SupervisedListDisplay } from '%/query/supervised'
import { Locale } from '@/locale/model'
import { State } from '@/store/reducers'
import { listed } from '@/styles/ts/common'
import { Collapse, List, ListItem, ListItemText, makeStyles, Snackbar, Typography } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import React, { useEffect, useReducer } from 'react'
import { connect } from 'react-redux'
import { randomWalk } from './mockLocation'
import { MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet'
import { fetchDirections, geoJsonOfLeaflet, LatLong, Profile, DirectionFetchResult, leafletOfGeoJson } from './OrsApi'
import { APIKey } from './const'
import { LineString } from 'geojson'
import { divIcon, Point } from 'leaflet'

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
  SetSupervisedAddress
}

//#region
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
}

interface LocalActionTypeSetSupervisedAddress {
  type: LocalActionType.SetSupervisedAddress
  supervisedAddress: string
}

//#endregion
type LocalAction =
  | LocalActionInto
  | LocalActionFetchedLocation
  | LocalActionIntoError
  | LocalActionUpdateSupervised
  | LocalActionUpdateOwn
  | LocalActionCloseError
  | LocalActionIntoShowingRoute
  | LocalActionTypeSetSupervisedAddress

interface LocalState {
  stage: Stage
  route: LatLong[]
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
  centerButton: {
    textAlign: 'center',
    boxShadow: theme.shadows[1]
  },
  mapPopUp: {
    padding: theme.spacing(2)
  },

  semiFullCard: {
    width: `calc(100% - ${theme.spacing(1)}px)`,
    margin: `${theme.spacing(1)} ${theme.spacing(1)}`
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
    // @ts-ignore
    labelAnchor: [-6, 0],
    popupAnchor: [-6, -36],
    html: `<span style="${styles}" />`
  })
}

const Elem = ({ locale }: LocalProps & DispatchProps) => {
  const localStyles = makeLocalStyes()
  const globalStyles = listed()
  const PHSupervisedLocation: LatLong = [52.73101709012718, 15.23381079831591]
  const PHOwnLocation: LatLong = [52.72298324041586, 15.244774615480452]

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
        case LocalActionType.IntoShowingRoute:
          return { ...prev, stage: Stage.ShowingRoute, route: action.route }
        case LocalActionType.UpdateOwn:
          return { ...prev, ownLocation: action.location }
        case LocalActionType.UpdateSupervised:
          return { ...prev, supervisedLocation: action.supervisedLocation }
        case LocalActionType.SetSupervisedAddress:
          return { ...prev, supervisedAddress: action.supervisedAddress }
        default:
          return prev
      }
    },
    {
      stage: Stage.FetchingLocation,
      route: [],
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
      5000,
      state.supervisedLocation || PHSupervisedLocation
    )
  }, [state.supervisedLocation])

  const handleClosePopUp = () =>
    dispatch({
      type: LocalActionType.IntoPending
    })

  const calcRoute = (start: LatLong, end: LatLong, profile: Profile) => {
    fetchDirections(APIKey, [start, end].map(geoJsonOfLeaflet), profile).then(r => {
      switch (r.ok) {
        case DirectionFetchResult.Fail:
          return dispatch({
            type: LocalActionType.IntoError,
            message: r.message,
            stage: Stage.FetchingRouteError
          })
        case DirectionFetchResult.Success:
          return dispatch({
            type: LocalActionType.IntoShowingRoute,
            route: (r.res.features[0].geometry as LineString).coordinates.map(leafletOfGeoJson)
          })
      }
    })
  }

  const askOwn = () => {
    dispatch({
      type: LocalActionType.IntoRequiringLocation
    })

    navigator.geolocation.getCurrentPosition(
      p =>
        dispatch({
          type: LocalActionType.UpdateOwn,
          location: [p.coords.latitude, p.coords.longitude]
        }),
      e =>
        dispatch({
          type: LocalActionType.IntoError,
          stage: Stage.RequiringLocationError,
          message: e.message
        }),
      {
        enableHighAccuracy: true
      }
    )
  }

  const onCalcRoute = () => {
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

  /**
   * @TODO Handle lack of `ownLocation`
   */

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

  if (state.stage === Stage.FetchingLocation)
    return (
      <Typography variant='h5' align='center'>
        [PH] Fetching Ward's Location
      </Typography>
    )

  return (
    <div>
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
      <MapContainer className={`${localStyles.map}`} center={PHSupervisedLocation} zoom={13} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        <Polyline positions={state.route} pathOptions={{ color: '#2f2ff5' }} />
        <Marker icon={makeCustomMarker('#62d9fc')} position={state.supervisedLocation}>
          <Popup className={localStyles.mapPopUp}>
            [PH] Supervised <br />
            {state.supervisedAddress}
          </Popup>
        </Marker>
        {state.ownLocation && (
          <Marker icon={makeCustomMarker('#e3d091')} position={state.ownLocation}>
            <Popup className={localStyles.mapPopUp}>[PH] Your location</Popup>
          </Marker>
        )}
      </MapContainer>
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
            className={`${localStyles.centerButton} ${globalStyles.listItemDanger} ${globalStyles.fullCard}`}
          >
            <ListItemText primary='[PH] Cancel Route' />
          </ListItem>
        </Collapse>
      </List>
    </div>
  )
}

export default connect<DispatchProps>(mapProps)(Elem)
/**
 
 */
