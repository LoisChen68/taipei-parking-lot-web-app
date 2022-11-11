import { screen, render } from '@testing-library/react'
import Search from '../components/SearchBar/SearchBar'
const setPlace = jest.fn()

test('should render Search component', () => {
  render(<Search setPlace={setPlace} />)

  expect(screen.getByPlaceholderText(/輸入你想去的地點/i)).toBeInTheDocument
})
