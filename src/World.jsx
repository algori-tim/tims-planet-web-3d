import { useGLTF } from '@react-three/drei';

export default function World() {
	const world = useGLTF('./models/world_0.glb');

	return <primitive object={world.scene} />;
}
