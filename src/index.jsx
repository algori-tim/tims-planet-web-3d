import './index.css'
import ReactDOM from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import App from './App.jsx'
import Hud from './Components/Hud/Hud'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import ContextModal from './Components/ContextModal/ContextModal.jsx'

const root = ReactDOM.createRoot(document.querySelector('#root'))
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
