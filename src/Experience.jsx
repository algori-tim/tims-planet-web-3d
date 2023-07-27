import { Stars, OrbitControls } from '@react-three/drei';
import World from './World';
import Player from './Player';

export default function Experience() {
	return (
		<>
			<Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
			<OrbitControls />
			<directionalLight position={[1, 2, 3]} intensity={1.5} />
			<ambientLight intensity={0.5} />
			<World />
			<Player />
		</>
	);
}
