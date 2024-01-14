import { useGLTF } from '@react-three/drei'
import useStore from '../../../Stores/store'
import { Select } from '@react-three/postprocessing'
import { useEffect, useRef, useState } from 'react'
import { Mesh, MeshBasicMaterial } from 'three'

export default function Interactable(props) {
  const { handleInteraction, setOverlayType, cursorType } = useStore()
  const [hovered, hover] = useState(false)
  const [isCursorLook, setIsCursorLook] = useState(false)
  const interactableRef = useRef()
  const duplicateRef = useRef()
  const soundFxRef = useRef()
  const glb = useGLTF(`./models/${props.model}.glb`)
  const glowMaterial = new MeshBasicMaterial({ color: '#ffff99', opacity: '.25', transparent: 'true' })

  useEffect(() => {
    if (interactableRef.current) {
      const duplicate = interactableRef.current.clone(true)
      duplicate.traverse((child) => {
        if (child.isMesh) {
          child.material = glowMaterial
        }
      })
      duplicate.scale.set(0, 0, 0)
      duplicateRef.current = duplicate
      interactableRef.current.parent.add(duplicate)
    }
  }, [interactableRef.current])

  useEffect(() => {
    if (soundFxRef.current) return
    soundFxRef.current = new Audio(`/audio/sound_fx/${props.sound}.mp3`)
  }, [])

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
    if (isCursorLook && soundFxRef.current) {
      soundFxRef.current.play()
      setOverlayType(props.model)
      document.getElementById('overlay').style.display = 'flex'
    }
  }

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
