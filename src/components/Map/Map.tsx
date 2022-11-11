import style from './Map.module.css'
import {
  API_TAIPEI_PARKING_LOT,
  API_TAIPEI_PARKING_SPACE,
} from '../../global/constants'
import {
  useJsApiLoader,
  GoogleMap,
  LoadScriptProps,
  Marker,
} from '@react-google-maps/api'
import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import Card from '../Card/Card'
import positionIcon from '../../assets/position.svg'
import marker from '../../assets/marker.svg'
import { twd97_to_latlng } from '../../TWD97'
import SearchBar from '../SearchBar/SearchBar'
import FilterButton from '../FilterButton/FilterButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCrosshairs } from '@fortawesome/free-solid-svg-icons'

type LatLngLiteral = google.maps.LatLngLiteral
type MapOptions = google.maps.MapOptions

interface parkData {
  tw97x: number
  tw97y: number
  id?: number
  lanLng: object
  parkingSpace: object
  parkingSpaceUpdate: object
}

interface parkItem {
  id: number
}

export default function MapBox() {
  const googleDirApiUrl = 'https://www.google.com/maps/dir/?api=1&destination='
  const [center, setCenter] = useState<LatLngLiteral>({
    lat: 25.0476133,
    lng: 121.5174062,
  })
  const [zoom] = useState(15)
  const [position, setPosition] = useState<LatLngLiteral>({ lat: 0, lng: 0 })
  const [searchPosition, setSearchPosition] = useState<LatLngLiteral>({
    lat: 0,
    lng: 0,
  })
  const [filter, setFilter] = useState('')
  const [count, setCount] = useState(0)
  const [time, setTime] = useState(0)
  const [activeMarker, setActiveMarker] = useState(null)
  const [park, setPark] = useState([])
  const [libraries] = useState<LoadScriptProps['libraries']>(['places'])
  const options = useMemo<MapOptions>(
    () => ({
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: false,
      mapId: '538ff01c5725ea3e',
    }),
    []
  )
  const onLoad = useCallback((map: any) => (mapRef.current = map), [])
  const mapRef = useRef<GoogleMap>()

  const handleActiveMarker = (marker: null) => {
    if (marker === activeMarker) {
      return
    }
    setActiveMarker(marker)
  }

  // timer 0 -> 30s
  useEffect(() => {
    const timer = setInterval(() => {
      if (time < 30) {
        setTime((prevState) => prevState + 1)
      }
    }, 1000)
    if (time === 30) {
      setTime(0)
    }
    return () => {
      clearInterval(timer)
    }
  }, [time])

  const allSpace =
    filter === '' &&
    park
      .filter(
        (data: any) =>
          data.parkingSpace !== undefined &&
          data.parkingSpace?.availablecar > 0 &&
          data.parkingSpace?.availablemotor > 0
      )
      .map((data: any) => (
        <Marker
          key={data.id}
          position={data.lanLng}
          label={data.parkingSpace?.availablecar.toString()}
          icon={marker}
          onClick={() => {
            handleActiveMarker(data.id)
            mapRef.current?.panTo(data.lanLng)
          }}
        >
          {activeMarker === data.id && (
            <Card
              onCloseClick={() => setActiveMarker(null)}
              name={data.name}
              address={data.address}
              payex={data.payex}
              carSpace={data.parkingSpace?.availablecar}
              motorSpace={data.parkingSpace?.availablemotor}
              update={data.parkingSpaceUpdate}
              time={time}
              href={googleDirApiUrl + `${data.area}${data.name}`}
            />
          )}
        </Marker>
      ))

  const carSpace =
    filter === 'car' &&
    park
      .filter(
        (data: any) =>
          data.totalcar > 0 &&
          data.parkingSpace !== undefined &&
          data.parkingSpace?.availablecar > 0
      )
      .map((data: any) => (
        <Marker
          key={data.id}
          position={data.lanLng}
          label={data.parkingSpace?.availablecar.toString()}
          icon={marker}
          onClick={() => {
            handleActiveMarker(data.id)
            mapRef.current?.panTo(data.lanLng)
          }}
        >
          {activeMarker === data.id && (
            <Card
              onCloseClick={() => setActiveMarker(null)}
              name={data.name}
              address={data.address}
              payex={data.payex}
              carSpace={data.parkingSpace?.availablecar}
              motorSpace={data.parkingSpace?.availablemotor}
              update={data.parkingSpaceUpdate}
              time={time}
              href={googleDirApiUrl + `${data.area}${data.name}`}
            />
          )}
        </Marker>
      ))

  const motorSpace =
    filter === 'motor' &&
    park
      .filter(
        (data: any) =>
          data.totalcar > 0 &&
          data.parkingSpace !== undefined &&
          data.parkingSpace?.availablemotor > 0
      )
      .map((data: any) => (
        <Marker
          key={data.id}
          position={data.lanLng}
          label={data.parkingSpace?.availablemotor.toString()}
          icon={marker}
          onClick={() => {
            handleActiveMarker(data.id)
            mapRef.current?.panTo(data.lanLng)
          }}
        >
          {activeMarker === data.id && (
            <Card
              onCloseClick={() => setActiveMarker(null)}
              name={data.name}
              address={data.address}
              payex={data.payex}
              carSpace={data.parkingSpace?.availablecar}
              motorSpace={data.parkingSpace?.availablemotor}
              update={data.parkingSpaceUpdate}
              time={time}
              href={googleDirApiUrl + `${data.area}${data.name}`}
            />
          )}
        </Marker>
      ))

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY || '',
    libraries,
  })

  // user position
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setCenter({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      })
    })
  }, [])

  // user watchPosition
  useEffect(() => {
    navigator.geolocation.watchPosition((position) => {
      setPosition({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      })
    })
  }, [])

  // get park api data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [res1, res2] = await Promise.all([
          fetch(API_TAIPEI_PARKING_LOT),
          fetch(API_TAIPEI_PARKING_SPACE),
        ])
        const parkingLot = await res1.json()
        const parkingSpace = await res2.json()
        const result = parkingLot.data.park.map((p: parkData) => {
          const { ...data } = p
          data.lanLng = twd97_to_latlng(p.tw97x, p.tw97y)
          data.parkingSpace = parkingSpace.data.park.find(
            (item: parkItem) => item.id === p.id
          )
          data.parkingSpaceUpdate = parkingSpace.data.UPDATETIME.slice(11, 20)
          return data
        })
        return setPark(result)
      } catch (err) {
        return
      }
    }
    const id = setInterval(() => {
      setCount((prevState) => prevState + 1)
      fetchData()
    }, 30000)
    fetchData()
    return () => clearInterval(id)
  }, [count])

  if (!isLoaded) return <div>Loading...</div>

  return isLoaded ? (
    <>
      <div className={style.box}>
        <GoogleMap
          center={center}
          zoom={zoom}
          mapContainerStyle={{ width: '100%', height: '100%' }}
          options={options}
          onLoad={onLoad}
        >
          <FilterButton
            carClick={() => setFilter('car')}
            motorClick={() => setFilter('motor')}
            allClick={() => setFilter('')}
          />
          <div className={style.back}>
            <FontAwesomeIcon
              icon={faCrosshairs}
              className={style.icon}
              size="xl"
              onClick={() => {
                mapRef.current?.panTo(position)
              }}
            />
          </div>
          {/* user Marker */}
          <Marker position={position} icon={positionIcon} />
          {allSpace}
          {carSpace}
          {motorSpace}
          <SearchBar
            setPlace={(position) => {
              setSearchPosition(position)
              mapRef.current?.panTo(position)
            }}
          />
        </GoogleMap>
      </div>
    </>
  ) : (
    <></>
  )
}
