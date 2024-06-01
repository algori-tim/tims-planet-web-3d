import { useGLTF } from '@react-three/drei'
import usePlayerStore from '../../../Stores/playerStore'
import { Select } from '@react-three/postprocessing'
import { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import { Mesh, MeshBasicMaterial, Object3D } from 'three'
import useAudioStore from '../../../Stores/audioStore'
import useUIStore from '../../../Stores/uiStore'

export interface InteractableProps {
  model: string
}

function isMesh(obj: Object3D): obj is Mesh {
  return (obj as Mesh).isMesh !== undefined
}

export default function Interactable({ model }: InteractableProps) {
  const { setOverlayType, cursorType } = useUIStore()
  const { handleInteraction } = usePlayerStore()
  const [hovered, setHovered] = useState(false)
  const [isCursorLook, setIsCursorLook] = useState(false)
  const interactableRef = useRef<Mesh>(null!)
  const duplicateRef = useRef<Mesh>(null!)
  const glb = useGLTF(`./models/${model}.glb`)
  const glowMaterial = useMemo(() => new MeshBasicMaterial({ color: '#ffff99', opacity: 0.25, transparent: true }), [])
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
  }, [glowMaterial])

  useEffect(() => {
    setIsCursorLook(cursorType === 'look')
  }, [cursorType])

  const handlePointerOver = useCallback(() => {
    if (isCursorLook) {
      if (duplicateRef.current) {
        duplicateRef.current.scale.set(1, 1, 1)
      }
      setHovered(true)
    }
  }, [isCursorLook])

  const handlePointerOut = useCallback(() => {
    if (hovered) {
      if (duplicateRef.current) {
        duplicateRef.current.scale.set(0, 0, 0)
      }
      setHovered(false)
    }
  }, [hovered])

  const handleClick = useCallback(() => {
    if (isCursorLook) {
      handleShimmerSound()
      setOverlayType(model)
      const overlay = document.getElementById('overlay') as HTMLElement
      overlay.style.display = 'flex'
    }
  }, [isCursorLook, handleShimmerSound, setOverlayType, model])

  return (
    <>
      <Select enabled={hovered} onClick={(e) => handleInteraction(e)}>
        <primitive
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
