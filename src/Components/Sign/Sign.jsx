import { useGLTF } from '@react-three/drei'
import useStore from '../../Stores/store'
import { Selection, Select, EffectComposer, SelectiveBloom } from '@react-three/postprocessing'
import { useEffect, useState } from 'react'
import { useThree } from '@react-three/fiber'

export default function Sign() {
  const sign = useGLTF('./models/planet_sign.glb')
  const handleInteraction = useStore((store) => store.handleInteraction)
  const { scene } = useThree()
  const [lights, setLights] = useState([])
  const [hovered, hover] = useState(false)
  useEffect(() => {
    const allLights = []
    scene.traverse((object) => {
      if (object.isLight) {
        allLights.push(object)
      }
    })
    setLights(allLights)
  }, [scene])

  return (
    <group onClick={(e) => handleInteraction(e)}>
      {lights.length > 0 && (
        <Selection>
          <EffectComposer multisampling={0}>
            <SelectiveBloom lights={lights} radius={1} luminanceThreshold={0.2} intensity={2} />
          </EffectComposer>
          <Select enabled={hovered}>
            <primitive onPointerOver={() => hover(true)} onPointerOut={() => hover(false)} object={sign.scene} />
          </Select>
        </Selection>
      )}
    </group>
  )
}
