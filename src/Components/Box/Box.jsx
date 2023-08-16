import { useGLTF } from '@react-three/drei';
import useStore from '../../Stores/store';
import { useRef } from 'react';
import { Vector3 } from 'three';

export default function Box() {
	const box = useGLTF('./models/box.glb');
	const boxRef = useRef(null);
	const handleInteraction = useStore((store) => store.handleInteraction);
	console.log(box);
	return (
		<group ref={boxRef} position={new Vector3(1, 0, 3)}>
			<mesh
				name='box'
				onClick={(e) => handleInteraction(e)}
				material={box.materials.grey}
				geometry={box.nodes.Cube.geometry}
			></mesh>
		</group>
	);
}
