import { useGLTF } from '@react-three/drei'
import useStore from '../../../Stores/store'
import { Select } from '@react-three/postprocessing'
import { useState } from 'react'

export default function Interactable(props) {
  const handleInteraction = useStore((store) => store.handleInteraction)
  const [hovered, hover] = useState(false)
  const glb = useGLTF(`./models/${props.model}.glb`)

  return (
    <Select enabled={hovered} onClick={(e) => handleInteraction(e)}>
      <primitive onPointerOver={() => hover(true)} onPointerOut={() => hover(false)} object={glb.scene} />
    </Select>
  )
}
