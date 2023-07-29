import { OrbitControls } from '@react-three/drei';
import World from './World';
import Player from './Player';
import Background from './Background';

export default function App() {
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
