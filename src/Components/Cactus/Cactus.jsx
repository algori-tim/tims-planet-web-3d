import { useGLTF } from '@react-three/drei';
import useStore from '../../Stores/store';
import { useRef } from 'react';

export default function Cactus() {
	const cactus = useGLTF('./models/foxy_cactus.glb');
	const cactusRef = useRef(null);
	const handleInteraction = useStore((store) => store.handleInteraction);

	return (
		<group ref={cactusRef}>
			<mesh
				name='cactus'
				onClick={(e) => handleInteraction(e)}
				material={cactus.nodes.cactus.material}
				geometry={cactus.nodes.cactus.geometry}
			></mesh>
			<mesh
				name='glasses'
				onClick={(e) => handleInteraction(e)}
				material={cactus.nodes.glasses.material}
				geometry={cactus.nodes.glasses.geometry}
			></mesh>
		</group>
	);
}
