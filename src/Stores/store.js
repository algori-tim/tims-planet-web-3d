import { create } from 'zustand';
import * as YUKA from 'yuka';
import * as THREE from 'three';
import {
	createConvexRegionHelper,
	createPathHelper,
	getPath,
	initPlayerVehicle,
} from '../Helpers/yukaHelpers';
import { CustomNavMesh } from '../CustomYukaObjects/CustomNavMesh';
import { handleInteraction } from '../Data/interactions';
import { getDistance } from '../Helpers/mathHelpers';
import gsap from 'gsap';

const getAnimTimeline = (navMesh, player, pathHelper, target) => {
	const path = getPath(navMesh, player.mesh.position, target);

	if (pathHelper) {
		pathHelper.visible = true;
		pathHelper.geometry.dispose();
		pathHelper.geometry = new THREE.BufferGeometry().setFromPoints(path);
	}

	const tl = gsap.timeline();
	for (let i = 1; i < path.length; i++) {
		const next = new THREE.Vector3().copy(path[i]);
		var distance = getDistance(path[i - 1], path[i]);
		// console.log(distance);
		tl.to(player.mesh.position, {
			x: path[i].x,
			y: path[i].y,
			z: path[i].z,
			ease: 'none',
			duration: distance / 2,
			onStart: () => player.mesh.lookAt(next),
		});
	}
	return tl;
};

const useStore = create((set, get) => {
	let cursorType = document.getElementById('root').getAttribute('data-cursor');
	let navMesh;
	let playerVehicle;
	let player;
	let entityManager = new YUKA.EntityManager();
	let time = new YUKA.Time();
	let pathHelper = createPathHelper();
	let playerAnim;
	return {
		entityManager,
		time,
		init(scene) {
			if (navMesh) return;
			const loader = new YUKA.NavMeshLoader();
			loader.load('./models/world_0_nav.glb').then((navigationMesh) => {
				navMesh = new CustomNavMesh(navigationMesh);
				scene.add(createConvexRegionHelper(navMesh));
				scene.add(pathHelper);
			});
		},
		setYukaPlayer(playerMesh) {
			if (playerVehicle) return;

			playerVehicle = initPlayerVehicle(navMesh, playerMesh, entityManager);
		},
		setPlayer(playerMesh, playerAnimations) {
			player = {
				mesh: playerMesh,
				animations: playerAnimations,
				state: 'idle',
			};
			player.animations.idle.play();
		},

		setCursor(cursor) {
			cursorType = cursor;
			console.log(`set ${cursorType}`);
		},
		handleInteraction(event) {
			console.log(event.intersections);
			event.stopPropagation();

			handleInteraction(
				cursorType,
				event.eventObject.name === '' ? event.object.name : event.eventObject.name
			);

			const groundIntersect = event.intersections.find((x) => x.object.name === 'ground');
			if (groundIntersect && cursorType === 'walk') {
				if (playerAnim) {
					playerAnim.kill();
				}
				playerAnim = getAnimTimeline(navMesh, player, pathHelper, groundIntersect.point);
				playerAnim.call(() => player.animations.walk.stop());
				playerAnim.play();

				player.animations.walk.play();
			}
		},
	};
});

export default useStore;
