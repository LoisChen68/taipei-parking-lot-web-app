import style from './Map.module.css'
import {API_TAIPEI_PARKING_LOT, API_TAIPEI_PARKING_SPACE} from '../global/constants'
import {useJsApiLoader, GoogleMap, LoadScriptProps, Marker, MarkerClusterer} from '@react-google-maps/api'
import {useState, useCallback, useMemo, useRef, useEffect} from 'react';
import positionIcon from '../assets/position.svg'
import marker from '../assets/marker.svg'
import {twd97_to_latlng} from '../TWD97'

type LatLngLiteral = google.maps.LatLngLiteral
type MapOptions = google.maps.MapOptions

interface parkData {
  tw97x: number,
  tw97y: number,
  id?: number,
  lanLng: object,
  parkingSpace: object,
  parkingSpaceUpdate: object
}

interface parkItem {
  id: number
}


export default function MapBox() {
  const [center, setCenter] = useState<LatLngLiteral>({lat: 25.0476133, lng: 121.5174062})
  const [zoom] = useState(15)
  const [position, setPosition] = useState<LatLngLiteral>({lat: 0, lng: 0})
  const [park, setPark] = useState([])
  const [libraries] = useState<LoadScriptProps['libraries']>(['places'])
  const options = useMemo<MapOptions>(
    () => ({
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: false,
      mapId: '538ff01c5725ea3e'
    }),
    []
  );
  const onLoad = useCallback((map: any) => (mapRef.current = map), []);
  const mapRef = useRef<GoogleMap>();

  const {isLoaded} = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY || '',
    libraries
  })

  // user position
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      setCenter({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      })
    })
  }, [])

  // user watchPosition
  useEffect(() => {
    navigator.geolocation.watchPosition(position => {
      setPosition({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      })
    })
  }, [])

  // get park api data
  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        fetch(API_TAIPEI_PARKING_LOT),
        fetch(API_TAIPEI_PARKING_SPACE)
      ])
        .then(async ([res1, res2]) => {
          const parkingLot = await res1.json()
          const parkingSpace = await res2.json()
          const result = parkingLot.data.park.map((p: parkData) => {
            const {...data} = p
            data.lanLng = twd97_to_latlng(p.tw97x, p.tw97y)
            data.parkingSpace = parkingSpace.data.park.find((item: parkItem) => item.id === p.id)
            data.parkingSpaceUpdate = parkingSpace.data.UPDATETIME.slice(11, 20)
            return data
          })
          return setPark(result)
        })
    }
    fetchData()
  }, [])



  if (!isLoaded) return <div>Loading...</div>

  return isLoaded ? (
    <>
      <div className={style.box}>
        <GoogleMap
          center={center}
          zoom={zoom}
          mapContainerStyle={{width: '100%', height: '100%'}}
          options={options}
          onLoad={onLoad}
        >
          {/* user Marker */}
          <Marker
            position={position}
            icon={positionIcon}
          />
          {park
            .filter((data: any) =>
              data.parkingSpace !== undefined &&
              data.parkingSpace?.availablecar > 0 ||
              data.parkingSpace?.availablemotor > 0
            )
            .map((data: any) =>
              < Marker
                key={data.id}
                position={data.lanLng}
                label={data.parkingSpace?.availablecar.toString()}
                icon={marker}
              >
              </Marker>
            )}
        </GoogleMap>
      </div>
    </>
  ) : <></>
}