import { useAnimations, useGLTF } from '@react-three/drei'
import useStore from '../../Stores/store'
import React, { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Vector3, Quaternion, Matrix4, Mesh, Material, AnimationClip, SkinnedMesh, Bone } from 'three'

interface PlayerGLTF {
  nodes: {
    cosmonaut_1: SkinnedMesh
    cosmonaut_2: SkinnedMesh
    cosmonaut_3: SkinnedMesh
    Bone: Bone
    Bone_L004: Bone
    Bone_R004: Bone
  }
  materials: {
    orange: Material
    black: Material
    silver: Material
  }
  animations: AnimationClip[]
}

const truncateToFourDecimals = (num: number): number => {
  return Math.floor(num * 10000) / 10000
}

const isEvenToFourDecimals = (pointOne: Vector3, pointTwo: Vector3): boolean => {
  const isXMatch = truncateToFourDecimals(pointOne.x) === truncateToFourDecimals(pointTwo.x)
  const isYMatch = truncateToFourDecimals(pointOne.y) === truncateToFourDecimals(pointTwo.y)
  const isZMatch = truncateToFourDecimals(pointOne.z) === truncateToFourDecimals(pointTwo.z)
  return isXMatch && isYMatch && isZMatch
}

export default function Player() {
  const playerRef = useRef<Mesh>(null!)
  const { camera } = useThree()
  const { nodes, materials, animations } = useGLTF('./models/astronaut.glb') as unknown as PlayerGLTF
  const { actions } = useAnimations(animations, playerRef)
  const setPlayerPosition = useStore((store) => store.setPlayerPosition)
  const { handleInteraction, nextPlayerLocation, isFastTraveling } = useStore()
  const initPlayer = useStore((store) => store.initPlayer)

  useEffect(() => {
    initPlayer(playerRef.current, actions, setNewPlayerLocation)
    playerRef.current.position.set(0, 26.1, 0)
    playerRef.current.rotateY(2.5)
    camera.position.set(0, 45.1, 0)
  }, [])

  const setNewPlayerLocation = (newPosition: Vector3): void => {
    if (playerRef.current) {
      playerRef.current.position.copy(newPosition)
      const normal = playerRef.current.position.clone().normalize()
      playerRef.current.up.copy(normal)
      playerRef.current.rotation.setFromQuaternion(playerRef.current.quaternion)
    }
  }

  useFrame(() => {
    if (playerRef.current) {
      const normal = playerRef.current.position.clone().normalize()
      playerRef.current.up.copy(normal)
      playerRef.current.rotation.setFromQuaternion(playerRef.current.quaternion)

      const playerPosition = playerRef.current.position.clone()
      const playerQuaternion = playerRef.current.quaternion.clone()

      const cameraOffset = new Vector3(0, 20, -15)
      const offset = cameraOffset.clone().applyQuaternion(playerQuaternion)
      const targetPosition = playerPosition.add(offset)

      if (isFastTraveling) {
        console.log('fast travel')
        camera.position.copy(targetPosition)
      } else {
        //Camera follow speed
        camera.position.lerp(targetPosition, 0.008)
      }

      // Interpolate camera rotation
      const targetQuaternion = new Quaternion().setFromRotationMatrix(
        new Matrix4().lookAt(camera.position, playerRef.current.position, playerRef.current.up)
      )

      // camera rotate speed
      camera.quaternion.slerp(targetQuaternion, 0.001)

      camera.lookAt(playerRef.current.position)
      camera.up.copy(playerRef.current.position.clone().normalize())

      setPlayerPosition(playerRef.current.position)
      if (isEvenToFourDecimals(playerRef.current.position, nextPlayerLocation)) return
      playerRef.current.lookAt(nextPlayerLocation)
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
