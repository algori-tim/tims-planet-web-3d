import { useAnimations, useGLTF } from '@react-three/drei';
import useStore from '../../Stores/store';
import { useRef } from 'react';
import { useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';

export default function Player() {
	const playerRef = useRef(null);
	const { camera } = useThree();
	const { nodes, materials, animations } = useGLTF('./models/astronaut.glb');
	const { actions } = useAnimations(animations, playerRef);
	const handleInteraction = useStore((store) => store.handleInteraction);
	const setPlayer = useStore((store) => store.setPlayer);

	useEffect(() => {
		setPlayer(playerRef.current, actions);
	}, []);

	useFrame(() => {
		camera.position.set(
			playerRef.current.position.x + 15,
			playerRef.current.position.y + 15,
			playerRef.current.position.z + 15
		);
		camera.lookAt(playerRef.current.position);
	});

	return (
		<mesh name='player' onClick={(e) => handleInteraction(e)} ref={playerRef}>
			<group>
				<skinnedMesh
					name='cosmonaut_1'
					geometry={nodes.cosmonaut_1.geometry}
					material={materials.orange}
					skeleton={nodes.cosmonaut_1.skeleton}
				/>
				<skinnedMesh
					name='cosmonaut_2'
					geometry={nodes.cosmonaut_2.geometry}
					material={materials.black}
					skeleton={nodes.cosmonaut_2.skeleton}
				/>
				<skinnedMesh
					name='cosmonaut_3'
					geometry={nodes.cosmonaut_3.geometry}
					material={materials.silver}
					skeleton={nodes.cosmonaut_3.skeleton}
				/>
			</group>
			<primitive object={nodes.Bone} />
			<primitive object={nodes.Bone_L004} />
			<primitive object={nodes.Bone_R004} />
		</mesh>
	);
}
