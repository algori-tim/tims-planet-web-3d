import { useGLTF } from '@react-three/drei'
import useStore from '../../../Stores/store'
import { Select } from '@react-three/postprocessing'
import React, { useEffect, useRef, useState } from 'react'
import { Mesh, MeshBasicMaterial, Object3D } from 'three'
import useAudioStore from '../../../Stores/audioStore'

export interface InteractableProps {
  model: string
}

function isMesh(obj: Object3D): obj is Mesh {
  return (obj as Mesh).isMesh !== undefined
}

export default function Interactable(props: InteractableProps) {
  const { handleInteraction, setOverlayType, cursorType } = useStore()
  const [hovered, hover] = useState(false)
  const [isCursorLook, setIsCursorLook] = useState(false)
  const interactableRef = useRef<Mesh>(null!)
  const duplicateRef = useRef<Mesh>(null!)
  const glb = useGLTF(`./models/${props.model}.glb`)
  const glowMaterial = new MeshBasicMaterial({ color: '#ffff99', opacity: 0.25, transparent: true })
  const { handleShimmerUpSound: handleShimmerSound } = useAudioStore()

  useEffect(() => {
    if (interactableRef.current) {
      const duplicate = interactableRef.current.clone(true) as Mesh
      duplicate.traverse((child: Object3D) => {
        if (isMesh(child)) {
          child.material = glowMaterial
        }
      })
      duplicate.scale.set(0, 0, 0)
      duplicateRef.current = duplicate
      interactableRef.current.parent?.add(duplicate)
    }
  }, [interactableRef.current])

  useEffect(() => {
    setIsCursorLook(() => cursorType === 'look')
  }, [cursorType])

  const handlePointerOver = (e) => {
    if (isCursorLook) {
      if (duplicateRef.current) {
        console.log(duplicateRef.current)
        duplicateRef.current.scale.set(1, 1, 1)
      }
      hover(true)
    }
  }

  const handlePointerOut = () => {
    if (hovered) {
      if (duplicateRef.current) {
        duplicateRef.current.scale.set(0, 0, 0)
      }
      hover(false)
    }
  }

  const handleClick = () => {
    if (isCursorLook) {
      handleShimmerSound()
      setOverlayType(props.model)
      const overlay = document.getElementById('overlay') as HTMLElement
      overlay.style.display = 'flex'
    }
  }

  return (
    <>
      <Select enabled={hovered} onClick={(e) => handleInteraction(e)}>
        <primitive
          castShadow
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
          onClick={handleClick}
          object={glb.scene}
          ref={interactableRef}
        />
      </Select>
    </>
  )
}
