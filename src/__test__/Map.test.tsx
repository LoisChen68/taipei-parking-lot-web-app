import {screen, render} from '@testing-library/react'
import MapBox from '../components/Map/Map'
import * as ReactGoogleMapApi from '@react-google-maps/api'


describe('Map', () => {
  test('should shows loader', () => {
    jest
      .spyOn(ReactGoogleMapApi, 'useJsApiLoader')
      .mockReturnValue({
        isLoaded: false,
        loadError: undefined
      })
    render(<MapBox />)

    expect(screen.getByText(/Loading/i)).toBeInTheDocument()
  })
})