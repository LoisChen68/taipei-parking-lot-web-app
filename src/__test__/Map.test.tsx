import {screen, render} from '@testing-library/react'
import MapBox from '../components/Map/Map'
import * as ReactGoogleMapApi from '@react-google-maps/api'
import {mockNavigatorGeolocation} from '../__mock__/mockNavigatorGeolocation'

describe('Map', () => {
  const {getCurrentPositionMock} = mockNavigatorGeolocation();
  getCurrentPositionMock.mockImplementation((success, rejected) =>
    rejected({
      code: '',
      message: '',
      PERMISSION_DENIED: '',
      POSITION_UNAVAILABLE: '',
      TIMEOUT: '',
    })

  )
  test('should shows loader', () => {
    jest.spyOn(ReactGoogleMapApi, 'useJsApiLoader').mockReturnValue({
      isLoaded: false,
      loadError: undefined,
    })
    render(<MapBox />)

    expect(screen.getByText(/Loading/i)).toBeInTheDocument()
  })
})
