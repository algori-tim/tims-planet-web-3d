import { useGLTF } from '@react-three/drei'
import useStore from '../../../Stores/store'
import { Select } from '@react-three/postprocessing'
import { useEffect, useRef, useState } from 'react'
import { MeshBasicMaterial } from 'three'

export default function Interactable(props) {
  const { handleInteraction, setOverlayType, cursorType } = useStore()
  const [hovered, hover] = useState(false)
  const [isCursorLook, setIsCursorLook] = useState(false)
  const interactableRef = useRef()
  const glb = useGLTF(`./models/${props.model}.glb`)
  const whiteMaterial = new MeshBasicMaterial({ color: '#ffffe6' })

  useEffect(() => {
    setIsCursorLook(() => cursorType === 'look')
  }, [cursorType])

  const handlePointerOver = () => {
    if (isCursorLook) {
      hover(true)
      interactableRef.current.traverse((child) => {
        if (child.isMesh) {
          // Store the original material
          child.userData.originalMaterial = child.material
          // Apply the white material
          child.material = whiteMaterial
        }
      })
    }
  }

  const handlePointerOut = () => {
    if (hovered) {
      hover(false)
      interactableRef.current.traverse((child) => {
        if (child.isMesh && child.userData.originalMaterial) {
          // Revert to the original material
          child.material = child.userData.originalMaterial
        }
      })
    }
  }

  const handleClick = () => {
    if (isCursorLook) {
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
