import Hud from './Components/Hud/Hud'
import ContextModal from './Components/ContextModal/ContextModal'
import './index.css'
import Scene from './Scene/Scene'
import { Canvas } from '@react-three/fiber'
import useIsMobile from './Hooks/useIsMobile'
import MobileScene from './Scene/MobileScene'

const cameraOptions = {
  fov: 45,
  near: 0.1,
  far: 500,
}

export default function App() {
  const isMobile = useIsMobile()

  return (
    <>
      <Canvas camera={cameraOptions}>{!isMobile ? <Scene /> : <MobileScene />}</Canvas>
      <ContextModal />
      {!isMobile && (
        <>
          <Hud />
        </>
      )}
    </>
  )
}
