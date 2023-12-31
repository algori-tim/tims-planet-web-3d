import { useGLTF } from '@react-three/drei'
import useStore from '../../Stores/store'
import Interactables from './Interactables/Interactables'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export default function World() {
  const { nodes, materials } = useGLTF('./models/planet.glb')
  const trees = useGLTF('./models/planet_trees.glb')
  const rocks = useGLTF('./models/planet_rocks.glb')

  const handleInteraction = useStore((store) => store.handleInteraction)
  return (
    <group onClick={(e) => handleInteraction(e)}>
      <mesh castShadow receiveShadow name='grass' geometry={nodes.planet_1.geometry} material={materials.planet_grass}>
        {/* <meshStandardMaterial attach='material' color='#1BB81A' transparent={false} opacity={0.5} /> */}
      </mesh>
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
      {/* <primitive object={trees.scene} /> */}
      <primitive castShadow receiveShadow object={rocks.scene} />
      <Interactables />
    </group>
  )
}
