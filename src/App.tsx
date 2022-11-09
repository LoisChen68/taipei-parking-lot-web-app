import './App.css'
import MapBox from './components/Map/Map'
import {Route, Routes, Navigate} from 'react-router-dom'

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Navigate to='/map' />} />
        <Route path='/map' element={<MapBox />} />
      </Routes>
    </>
  )
}

export default App
