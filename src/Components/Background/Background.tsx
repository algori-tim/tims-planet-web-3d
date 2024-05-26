import { Stars } from '@react-three/drei'
import useStore from '../../Stores/store'
import * as THREE from 'three'
import React from 'react'

export default function Background() {
  const handleInteraction = useStore((store) => store.handleInteraction)

  return (
    <group>
      <mesh name='space' onClick={(e) => handleInteraction(e)}>
        <sphereGeometry args={[1000, 16, 16]} />
        <meshBasicMaterial opacity={0.5} transparent side={THREE.DoubleSide} />
      </mesh>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
    </group>
  )
}
