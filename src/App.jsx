import { OrbitControls } from '@react-three/drei'
import World from './Components/World/World'
import Player from './Components/Player/Player'
import Background from './Components/Background/Background'
import { useRef } from 'react'
import useStore from './Stores/store'
import { useFrame, useThree } from '@react-three/fiber'

export default function App() {
  const { scene } = useThree()
  const init = useStore((s) => s.init)
  init(scene)
  const lightRef = useRef()

  useFrame(() => {
    if (lightRef) {
      lightRef.current.rotation.y = lightRef.current.rotation.y + 0.00005
    }
  })

  return (
    <>
      <OrbitControls />
      <group ref={lightRef}>
        <Background />
        <directionalLight position={[1, 2, 3]} intensity={2} />
      </group>
      <ambientLight intensity={0.9} />
      <World />
      <Player />
    </>
  )
}
