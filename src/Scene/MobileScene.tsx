import Background from '../Components/Background/Background'
import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Group } from 'three'
import useSceneStore from '../Stores/sceneStore'
import { OrbitControls, useGLTF } from '@react-three/drei'

export default function MobileScene() {
  const { scene, camera } = useThree()
  const { init } = useSceneStore()
  const lightRef = useRef<Group>(null!)
  const planet = useGLTF('./models/planet_whole.glb')

  useEffect(() => {
    init(scene, false)
    camera.position.set(0, 200, 100)
  }, [init, scene])

  useFrame(() => {
    if (lightRef.current) {
      lightRef.current.rotation.y += 0.003
    }
  })

  return (
    <>
      <OrbitControls enableRotate={true} enableZoom={true} maxDistance={100} minDistance={50} />
      <Background />
      <directionalLight position={[1, 2, 3]} intensity={2} />
      <ambientLight intensity={0.7} />
      <primitive scale={0.7} ref={lightRef} object={planet.scene} />
    </>
  )
}
