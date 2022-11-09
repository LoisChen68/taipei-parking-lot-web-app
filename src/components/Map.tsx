import style from './Map.module.css'
import {useJsApiLoader, GoogleMap, LoadScriptProps, Marker} from '@react-google-maps/api'
import {useState, useCallback, useMemo, useRef, useEffect} from 'react';
import positionIcon from '../assets/position.svg'

type LatLngLiteral = google.maps.LatLngLiteral
type MapOptions = google.maps.MapOptions

export default function MapBox() {
  const [center, setCenter] = useState<LatLngLiteral>({lat: 25.0476133, lng: 121.5174062})
  const [zoom] = useState(15)
  const [position, setPosition] = useState<LatLngLiteral>({lat: 0, lng: 0})
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
        </GoogleMap>
      </div>
    </>
  ) : <></>
}