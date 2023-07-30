import { useGLTF } from '@react-three/drei';
import useStore from './store';

export default function World() {
	const world = useGLTF('./models/world_0.glb');
	const handleInteraction = useStore((store) => store.handleInteraction);
	console.log(world.nodes);
	return (
		<group onClick={(e) => handleInteraction(e)}>
			<mesh
				name='ground'
				geometry={world.nodes.ground.geometry}
				material={world.materials.ground}
			></mesh>
			<mesh
				name='sub_ground'
				geometry={world.nodes.sub_ground.geometry}
				material={world.materials.dirt}
			></mesh>
			{/* <primitive object={world.scene} />; */}
		</group>
	);
}
