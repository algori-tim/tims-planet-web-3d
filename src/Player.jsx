import { useGLTF } from '@react-three/drei';
import useStore from './store';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useEffect } from 'react';

export default function Player() {
	const player = useGLTF('./models/player_0.glb');
	console.log(player);
	const playerRef = useRef(null);
	const handleInteraction = useStore((store) => store.handleInteraction);
	const setPlayerVehicle = useStore((store) => store.setPlayerVehicle);
	const entityManager = useStore((store) => store.entityManager);
	const time = useStore((store) => store.time);

	useEffect(() => {
		setPlayerVehicle(playerRef.current);
	}, []);
	// useFrame(() => {
	// 	entityManager.update(time.update().getDelta());
	// });

	return (
		<group>
			<mesh
				name='player'
				matrixAutoUpdate={false}
				onClick={(e) => handleInteraction(e)}
				position-y={0.5}
				ref={playerRef}
				material={player.nodes.player.material}
				geometry={player.nodes.player.geometry}
			></mesh>
		</group>
	);
}
