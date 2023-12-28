import { useAnimations, useGLTF } from '@react-three/drei'
import useStore from '../../Stores/store'
import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const truncateToFourDecimals = (num) => {
  return Math.floor(num * 10000) / 10000
}

const isEvenToFourDecimals = (pointOne, pointTwo) => {
  const isXMatch = truncateToFourDecimals(pointOne.x) === truncateToFourDecimals(pointTwo.x)
  const isYMatch = truncateToFourDecimals(pointOne.y) === truncateToFourDecimals(pointTwo.y)
  const isZMatch = truncateToFourDecimals(pointOne.z) === truncateToFourDecimals(pointTwo.z)
  return isXMatch && isYMatch && isZMatch
}

export default function Player() {
  const playerRef = useRef(null)
  const { camera } = useThree()
  const { nodes, materials, animations } = useGLTF('./models/astronaut.glb')
  const { actions } = useAnimations(animations, playerRef)
  const handleInteraction = useStore((store) => store.handleInteraction)
  const setPlayer = useStore((store) => store.setPlayer)
  const getNextLocation = useStore((store) => store.getNextLocation)

  const cameraOffset = new THREE.Vector3(0, 25, -25)

  useEffect(() => {
    setPlayer(playerRef.current, actions)
    playerRef.current.position.set(0, 27, 0)
    playerRef.current.rotateY(2)
    camera.position.set(0, 35, 0)
  }, [])

  useFrame(() => {
    if (playerRef.current) {
      const normal = playerRef.current.position.clone().normalize()
      const offset = cameraOffset.clone().applyQuaternion(playerRef.current.quaternion)
      const targetPosition = playerRef.current.position.clone().add(offset)
      camera.position.lerp(targetPosition, 0.01) // Adjust lerp factor as needed
      camera.lookAt(playerRef.current.position)
      camera.up.copy(normal)
      playerRef.current.up.copy(normal)
      playerRef.current.rotation.setFromQuaternion(playerRef.current.quaternion)
      if (isEvenToFourDecimals(playerRef.current.position, getNextLocation())) return
      playerRef.current.lookAt(getNextLocation())
    }
  })

  return (
    <mesh name='player' onClick={(e) => handleInteraction(e)} ref={playerRef}>
      <group>
        <skinnedMesh
          name='cosmonaut_1'
          geometry={nodes.cosmonaut_1.geometry}
          material={materials.orange}
          skeleton={nodes.cosmonaut_1.skeleton}
        />
        <skinnedMesh
          name='cosmonaut_2'
          geometry={nodes.cosmonaut_2.geometry}
          material={materials.black}
          skeleton={nodes.cosmonaut_2.skeleton}
        />
        <skinnedMesh
          name='cosmonaut_3'
          geometry={nodes.cosmonaut_3.geometry}
          material={materials.silver}
          skeleton={nodes.cosmonaut_3.skeleton}
        />
      </group>
      <primitive object={nodes.Bone} />
      <primitive object={nodes.Bone_L004} />
      <primitive object={nodes.Bone_R004} />
    </mesh>
  )
}
