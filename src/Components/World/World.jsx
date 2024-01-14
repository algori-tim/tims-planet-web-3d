import { useGLTF } from '@react-three/drei'
import useStore from '../../Stores/store'
import Interactables from './Interactables/Interactables'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export default function World() {
  const { nodes, materials } = useGLTF('./models/planet.glb')
  const trees = useGLTF('./models/planet_trees.glb')
  const rocks = useGLTF('./models/planet_rocks.glb')
  const satellite = useGLTF('./models/planet_satellite.glb')
  const satelliteRef = useRef()
  useFrame(() => {
    if (satelliteRef.current) {
      satelliteRef.current.rotation.y = satelliteRef.current.rotation.y + 0.001
    }
  })

  const handleInteraction = useStore((store) => store.handleInteraction)
  return (
    <group castShadow receiveShadow onClick={(e) => handleInteraction(e)} onPointerOver={(e) => e.stopPropagation()}>
      <mesh
        castShadow
        receiveShadow
        name='grass'
        geometry={nodes.planet_1.geometry}
        material={materials.planet_grass}
      ></mesh>
      <mesh castShadow receiveShadow geometry={nodes.planet_4.geometry} material={materials.na_planet_grass} />
      <mesh
        castShadow
        receiveShadow
        name='water'
        geometry={nodes.planet_2.geometry}
        material={materials.planet_water}
      ></mesh>
      <mesh
        castShadow
        receiveShadow
        name='dirt'
        geometry={nodes.planet_3.geometry}
        material={materials.planet_dirt}
      ></mesh>
      <mesh castShadow receiveShadow name='sand' geometry={nodes.planet_5.geometry} material={materials.planet_sand} />
      <primitive castShadow receiveShadow object={trees.scene} />
      <primitive castShadow receiveShadow object={rocks.scene} />
      <primitive ref={satelliteRef} castShadow receiveShadow object={satellite.scene} />
      <Interactables />
    </group>
  )
}
