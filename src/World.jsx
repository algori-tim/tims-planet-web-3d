import { useGLTF } from '@react-three/drei';
import useStore from './store';

export default function World() {
	const world = useGLTF('./models/world_0.glb');
	const handleInteraction = useStore((store) => store.handleInteraction);

	return (
		<group onClick={(e) => handleInteraction(e)}>
			<primitive object={world.scene} />;
		</group>
	);
}
