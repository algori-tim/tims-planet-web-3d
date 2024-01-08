import { OrbitControls } from '@react-three/drei'
import World from './Components/World/World'
import Player from './Components/Player/Player'
import Background from './Components/Background/Background'
import { useEffect, useRef, useState } from 'react'
import useStore from './Stores/store'
import { useFrame, useThree } from '@react-three/fiber'

export default function App() {
  const { scene, camera } = useThree()
  const init = useStore((s) => s.init)
  const cursorType = useStore((s) => s.cursorType)
  const playerPostion = useStore((s) => s.playerPostion)
  const lightRef = useRef()
  const orbitControlsRef = useRef()

  const [orbitEnabled, setOrbitEnabled] = useState(false)
  init(scene, true)

  // useEffect(() => {
  //   if (cursorType !== 'walk') {
  //     orbitControlsRef.current.target.copy(playerPostion)
  //     setOrbitEnabled(() => true)
  //   } else {
  //     setOrbitEnabled(() => false)
  //   }
  // }, [cursorType, setOrbitEnabled])

  useFrame(() => {
    if (lightRef) {
      lightRef.current.rotation.y = lightRef.current.rotation.y + 0.00005
    }
  })

  return (
    <>
      <OrbitControls
        enableRotate={false}
        enableZoom={false}
        maxDistance={100}
        minDistance={50}
        ref={orbitControlsRef}
      />
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
