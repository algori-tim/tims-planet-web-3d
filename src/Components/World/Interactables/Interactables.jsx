import { Selection, EffectComposer, SelectiveBloom } from '@react-three/postprocessing'
import { useEffect, useState } from 'react'
import { useThree } from '@react-three/fiber'
import Interactable from '../Interactable/Interactable'

export default function Interactables() {
  const { scene } = useThree()
  const [lights, setLights] = useState([])

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
    <group>
      {lights && (
        <Selection>
          <EffectComposer multisampling={0}>
            <SelectiveBloom lights={lights} radius={1} luminanceThreshold={0.2} intensity={2} />
          </EffectComposer>
          <Interactable model='planet_sign' />
          <Interactable model='planet_observatory' />
          <Interactable model='planet_well' />
          <Interactable model='planet_factory' />
        </Selection>
      )}
    </group>
  )
}
