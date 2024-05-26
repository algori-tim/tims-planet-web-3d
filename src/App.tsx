import { OrbitControls } from '@react-three/drei'
import World from './Components/World/World'
import Player from './Components/Player/Player'
import Background from './Components/Background/Background'
import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Group } from 'three'
import useSceneStore from './Stores/sceneStore'

export default function App() {
  const { scene } = useThree()
  const { init } = useSceneStore()
  const lightRef = useRef<Group>(null!)

  init(scene, true)

  useFrame(() => {
    if (lightRef.current) {
      lightRef.current.rotation.y = lightRef.current.rotation.y + 0.00005
    }
  })

  return (
    <>
      <OrbitControls enableRotate={true} enableZoom={true} maxDistance={100} minDistance={50} />
      <group ref={lightRef}>
        <Background />
        <directionalLight castShadow position={[1, 2, 3]} intensity={2} />
      </group>
      <ambientLight intensity={0.7} />
      <World />
      <Player />
    </>
  )
}
