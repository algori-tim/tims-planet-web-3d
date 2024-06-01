import { useAnimations, useGLTF } from '@react-three/drei'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { AnimationClip, Material, Mesh } from 'three'

interface Water {
  nodes: {
    water: Mesh
  }
  materials: {
    planet_water: Material
  }
  animations: AnimationClip[]
}

export default function Water() {
  const waterRef = useRef<Mesh>(null!)
  const { nodes, materials, animations } = useGLTF('./models/water.glb') as unknown as Water
  console.log(animations)

  const { actions } = useAnimations(animations, waterRef)
  console.log(actions)
  const satelliteRef = useRef<Mesh>(null!)

  useFrame(() => {
    if (satelliteRef.current) {
      satelliteRef.current.rotation.y = satelliteRef.current.rotation.y + 0.001
    }
  })

  return <mesh ref={waterRef} name='water' geometry={nodes.water.geometry} material={materials.planet_water}></mesh>
}
