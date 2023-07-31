import { OrbitControls } from '@react-three/drei';
import World from './Components/World/World';
import Player from './Components/Player/Player';
import Background from './Components/Background/Background';
import { Suspense } from 'react';
import useStore from './Stores/store';
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
