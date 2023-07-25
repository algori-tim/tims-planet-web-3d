import { useGLTF } from '@react-three/drei';

export default function Player() {
	const player = useGLTF('./models/player_0.glb');

	return <primitive object={player.scene} />;
}
