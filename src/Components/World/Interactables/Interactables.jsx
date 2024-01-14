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
      {lights.length > 0 && (
        <Selection>
          <EffectComposer multisampling={0}>
            <SelectiveBloom lights={lights} radius={1} luminanceThreshold={0.1} intensity={0.25} />
          </EffectComposer>
          <Interactable model='planet_sign' sound={'hello'} />
          <Interactable model='planet_observatory' sound={'observatory'} />
          <Interactable model='planet_well' sound={'well'} />
          <Interactable model='planet_factory' sound={'factory'} />
          <Interactable model='planet_guitar' sound={'guitar'} />
          <Interactable model='planet_camper' sound={'camper'} />
        </Selection>
      )}
    </group>
  )
}
