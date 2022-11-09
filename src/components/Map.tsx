import style from './Map.module.css'
import {useJsApiLoader, GoogleMap, LoadScriptProps} from '@react-google-maps/api'
import {useState, useCallback, useMemo, useRef} from 'react';

type LatLngLiteral = google.maps.LatLngLiteral
type MapOptions = google.maps.MapOptions

export default function MapBox() {
  const [center] = useState<LatLngLiteral>({lat: 25.0476133, lng: 121.5174062})
  const [zoom] = useState(15)
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
        </GoogleMap>
      </div>
    </>
  ) : <></>
}