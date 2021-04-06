import { SupervisedListDisplay } from '%/query/supervised'
import { Locale } from '@/locale/model'
import { State } from '@/store/reducers'
import { listed } from '@/styles/ts/common'
import { List, ListItem, ListItemText, makeStyles, Snackbar } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import React, { useEffect, useReducer } from 'react'
import { connect } from 'react-redux'
import { randomWalk } from './mockLocation'
import { MapContainer, Marker, Polyline, TileLayer } from 'react-leaflet'
import { fetchDirections, geoJsonOfLeaflet, LatLong, Profile, DirectionFetchResult, leafletOfGeoJson } from './OrsApi'
import { APIKey } from './const'
import { LineString } from 'geojson'

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
  IntoShowingRoute
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

//#endregion
type LocalAction =
  | LocalActionInto
  | LocalActionFetchedLocation
  | LocalActionIntoError
  | LocalActionUpdateSupervised
  | LocalActionUpdateOwn
  | LocalActionCloseError
  | LocalActionIntoShowingRoute

interface LocalState {
  stage: Stage
  route: LatLong[]
  supervisedLocation: LatLong
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
  }
}))

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
          return { ...prev, stage: Stage.Pending, res: { ...prev.res, show: false } }
        case LocalActionType.IntoRequiringLocation:
          return { ...prev, stage: Stage.RequiringLocation }
        case LocalActionType.IntoShowingRoute:
          return { ...prev, stage: Stage.ShowingRoute, route: action.route }
        case LocalActionType.UpdateOwn:
          return { ...prev, ownLocation: action.location }
        case LocalActionType.UpdateSupervised:
          return { ...prev, supervisedLocation: action.supervisedLocation }
        default:
          return prev
      }
    },
    {
      stage: Stage.FetchingLocation,
      route: [],
      supervisedLocation: PHSupervisedLocation,
      ownLocation: PHOwnLocation,
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
      },
      5000,
      state.supervisedLocation
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

  return (
    <>
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
      <MapContainer className={localStyles.map} center={PHSupervisedLocation} zoom={13} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        <Polyline positions={state.route} pathOptions={{ color: '#2f2ff5' }} />
        <Marker position={state.supervisedLocation} />
        {state.ownLocation && <Marker position={state.ownLocation} />}
      </MapContainer>
      <List className={globalStyles.container}>
        <ListItem button className={`${localStyles.centerButton} ${globalStyles.topItem}`} onClick={onCalcRoute}>
          <ListItemText primary={state.stage === Stage.ShowingRoute ? '[PH] Recalculate route' : '[PH] Calc route'} />
        </ListItem>
      </List>
    </>
  )
}

export default connect<DispatchProps>(mapProps)(Elem)
/**
 
 */
