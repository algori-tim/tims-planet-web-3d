import { OrbitControls } from '@react-three/drei'
import World from './Components/World/World'
import Player from './Components/Player/Player'
import Background from './Components/Background/Background'
import React, { useRef } from 'react'
import useStore from './Stores/store'
import { useFrame, useThree } from '@react-three/fiber'
import { Group } from 'three'

export default function App() {
  const { scene } = useThree()
  const init = useStore((s) => s.init)
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
      {/* <ambientLight intensity={0.9} /> */}
      <World />
      <Player />
    </>
  )
}
