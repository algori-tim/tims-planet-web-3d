import './index.css'
import ReactDOM from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import App from './App'
import Hud from './Components/Hud/Hud'
import ContextModal from './Components/ContextModal/ContextModal'

const root = ReactDOM.createRoot(document.querySelector('#root') as HTMLElement)
const cameraOptions = {
  fov: 45,
  near: 0.1,
  far: 500,
  // position: [-30, 20, 5],
}

root.render(
  <>
    <Canvas camera={cameraOptions}>
      <App />
    </Canvas>
    <Hud />
    <ContextModal />
  </>
)
