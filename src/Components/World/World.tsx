import { useGLTF } from '@react-three/drei'
import usePlayerStore from '../../Stores/playerStore'
import Interactables from './Interactables/Interactables'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Material, Mesh } from 'three'

interface Planet {
  nodes: {
    planet_1: Mesh
    planet_2: Mesh
    planet_3: Mesh
    planet_4: Mesh
    planet_5: Mesh
  }
  materials: {
    planet_grass: Material
    na_planet_grass: Material
    planet_water: Material
    planet_dirt: Material
    planet_sand: Material
  }
}

export default function World() {
  const { nodes, materials } = useGLTF('./models/planet.glb') as unknown as Planet
  const trees = useGLTF('./models/planet_trees.glb')
  const rocks = useGLTF('./models/planet_rocks.glb')
  const satellite = useGLTF('./models/planet_satellite.glb')
  const satelliteRef = useRef<Mesh>(null!)

  useFrame(() => {
    if (satelliteRef.current) {
      satelliteRef.current.rotation.y = satelliteRef.current.rotation.y + 0.001
    }
  })

  const handleInteraction = usePlayerStore((store) => store.handleInteraction)
  return (
    <group onClick={(e) => handleInteraction(e)} onPointerOver={(e) => e.stopPropagation()}>
      <mesh name='grass' geometry={nodes.planet_1.geometry} material={materials.planet_grass}></mesh>
      <mesh geometry={nodes.planet_4.geometry} material={materials.na_planet_grass} />
      <mesh name='water' geometry={nodes.planet_2.geometry} material={materials.planet_water}></mesh>
      <mesh name='dirt' geometry={nodes.planet_3.geometry} material={materials.planet_dirt}></mesh>
      <mesh name='sand' geometry={nodes.planet_5.geometry} material={materials.planet_sand} />
      <primitive object={trees.scene} />
      <primitive object={rocks.scene} />
      <primitive ref={satelliteRef} object={satellite.scene} />
      <Interactables />
    </group>
  )
}
