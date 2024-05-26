import { Selection, EffectComposer, SelectiveBloom } from '@react-three/postprocessing'
import React, { useEffect, useState } from 'react'
import { useThree } from '@react-three/fiber'
import Interactable from '../Interactable/Interactable'
import { Light, Object3D } from 'three'

function isLight(obj: Object3D): obj is Light {
  return (obj as Light).isLight !== undefined
}

export default function Interactables() {
  const { scene } = useThree()
  const [lights, setLights] = useState<Light[]>([])

  useEffect(() => {
    const allLights: Light[] = []
    scene.traverse((object: Object3D) => {
      if (isLight(object)) {
        allLights.push(object as Light)
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
          <Interactable model='planet_sign' />
          <Interactable model='planet_observatory' />
          <Interactable model='planet_well' />
          <Interactable model='planet_factory' />
          <Interactable model='planet_guitar' />
          <Interactable model='planet_camper' />
        </Selection>
      )}
    </group>
  )
}
