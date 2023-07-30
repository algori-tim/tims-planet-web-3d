import { OrbitControls } from '@react-three/drei';
import World from './World';
import Player from './Player';
import Background from './Background';
import { Suspense } from 'react';
import useStore from './store';
import { useThree } from '@react-three/fiber';

export default function App() {
	const { scene } = useThree();
	const init = useStore((s) => s.init);
	init(scene, true);
	return (
		<>
			<Background />
			<OrbitControls />
			<directionalLight position={[1, 2, 3]} intensity={1.5} />
			<ambientLight intensity={0.5} />
			<World />
			<Player />
		</>
	);
}
