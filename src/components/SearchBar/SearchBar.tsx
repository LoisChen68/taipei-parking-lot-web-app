import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from '@reach/combobox'
import '@reach/combobox/styles.css'

import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete'
import style from './SearchBar.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons'

type PlacesProps = {
  setPlace: (position: google.maps.LatLngLiteral) => void
}

export default function Navbar({ setPlace }: PlacesProps) {
  const {
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete()

  const handleSelect = async (val: string) => {
    setValue(val, false)
    clearSuggestions()

    const results = await getGeocode({ address: val })
    const { lat, lng } = getLatLng(results[0])
    setPlace({ lat, lng })
  }

  return (
    <div className={style.bar}>
      <Combobox onSelect={handleSelect} className={style['search-bar']}>
        <ComboboxInput
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={style['combobox-input']}
          placeholder="輸入你想去的地點"
        ></ComboboxInput>
        <FontAwesomeIcon
          className={style.xIcon}
          icon={faXmark}
          onClick={() => setValue('')}
        />
        <FontAwesomeIcon
          className={style.searchIcon}
          icon={faMagnifyingGlass}
        />
        <ComboboxPopover>
          {/* 顯示地點清單 */}
          <ComboboxList>
            {status === 'OK' &&
              data.map(({ place_id, description }) => (
                <ComboboxOption key={place_id} value={description} />
              ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    </div>
  )
}
