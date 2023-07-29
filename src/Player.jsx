import { useGLTF } from '@react-three/drei';
import useStore from './store';

export default function Player() {
	const player = useGLTF('./models/player_0.glb');
	const handleInteraction = useStore((store) => store.handleInteraction);

	return (
		<group onClick={(e) => handleInteraction(e)}>
			<primitive object={player.scene} />;
		</group>
	);
}
