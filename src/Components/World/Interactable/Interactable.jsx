import { useGLTF } from '@react-three/drei'
import useStore from '../../../Stores/store'
import { Select } from '@react-three/postprocessing'
import { useRef, useState } from 'react'
import { MeshBasicMaterial } from 'three'

export default function Interactable(props) {
  const handleInteraction = useStore((store) => store.handleInteraction)
  const [hovered, hover] = useState(false)
  const interactableRef = useRef()
  const glb = useGLTF(`./models/${props.model}.glb`)
  const whiteMaterial = new MeshBasicMaterial({ color: 'white' })

  const handlePointerOver = () => {
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

  const handlePointerOut = () => {
    hover(false)
    interactableRef.current.traverse((child) => {
      if (child.isMesh && child.userData.originalMaterial) {
        // Revert to the original material
        child.material = child.userData.originalMaterial
      }
    })
  }

  return (
    <Select enabled={hovered} onClick={(e) => handleInteraction(e)}>
      <primitive
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        object={glb.scene}
        ref={interactableRef}
      />
    </Select>
  )
}
