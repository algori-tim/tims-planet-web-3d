import { useGLTF } from '@react-three/drei'
import useStore from '../../Stores/store'

export default function World() {
  const { nodes, materials } = useGLTF('./models/planet.glb')
  const trees = useGLTF('./models/planet_trees.glb')
  const factory = useGLTF('./models/planet_factory.glb')
  const observatory = useGLTF('./models/planet_observatory.glb')
  const well = useGLTF('./models/planet_well.glb')
  const sign = useGLTF('./models/planet_sign.glb')

  const handleInteraction = useStore((store) => store.handleInteraction)
  return (
    <group onClick={(e) => handleInteraction(e)}>
      <mesh castShadow receiveShadow name='grass' geometry={nodes.planet_1.geometry}>
        <meshStandardMaterial attach='material' color='#1BB81A' />
      </mesh>
      <mesh
        castShadow
        receiveShadow
        name='water'
        geometry={nodes.planet_2.geometry}
        material={materials.planet_water}
      ></mesh>
      <mesh
        castShadow
        receiveShadow
        name='dirt'
        geometry={nodes.planet_3.geometry}
        material={materials.planet_dirt}
      ></mesh>
      <primitive object={trees.scene} />
      <primitive object={factory.scene} />
      <primitive object={observatory.scene} />
      <primitive object={well.scene} />
      <primitive object={sign.scene} />
    </group>
  )
}
