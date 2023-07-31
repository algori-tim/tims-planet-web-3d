import { create } from 'zustand';
import * as YUKA from 'yuka';
import * as THREE from 'three';
import { createConvexRegionHelper, createPathHelper } from '../CustomYukaObjects/navHelpers';
import { CustomVehicle } from '../CustomYukaObjects/CustomVehicle';
import { CustomNavMesh } from '../CustomYukaObjects/CustomNavMesh';
import { getInteractionMessage } from '../Data/interactions';

const sync = (entity, renderComponent) => {
	// console.log(renderComponent)
	renderComponent.matrix.copy(entity.worldMatrix);
};

const useStore = create((set, get) => {
	let cursorType = document.getElementById('root').getAttribute('data-cursor');
	let navMesh;
	let playerVehicle;
	let entityManager = new YUKA.EntityManager();
	let time = new YUKA.Time();
	let pathHelper = createPathHelper();
	let includeHelpers = false;

	return {
		entityManager,
		time,
		init(scene) {
			if (navMesh) return;
			includeHelpers = includeHelpers;
			const loader = new YUKA.NavMeshLoader();
			loader.load('./models/world_0_nav.glb').then((navigationMesh) => {
				navMesh = new CustomNavMesh(navigationMesh);
				scene.add(createConvexRegionHelper(navMesh));
				scene.add(pathHelper);
			});
		},
		setPlayerVehicle(playerMesh) {
			if (playerVehicle) return;

			playerVehicle = new CustomVehicle();
			playerVehicle.name = 'player';
			playerVehicle.navMesh = navMesh;
			playerVehicle.maxForce = 1;
			playerVehicle.maxSpeed = 1.5;
			playerVehicle.setRenderComponent(playerMesh, sync);
			const followPathBehavior = new YUKA.FollowPathBehavior();
			followPathBehavior.nextWaypointDistance = 1;
			followPathBehavior.active = false;
			playerVehicle.steering.add(followPathBehavior);
			entityManager.add(playerVehicle);
		},
		setCursor(cursor) {
			cursorType = cursor;
			console.log(`set ${cursorType}`);
		},
		handleInteraction(event) {
			event.stopPropagation();

			document.getElementById('hud-messages').innerHTML = getInteractionMessage(
				cursorType,
				event.object.name
			);

			const groundIntersect = event.intersections.find((x) => x.object.name === 'ground');
			if (groundIntersect && cursorType === 'walk') {
				const pathVectors = navMesh.findMidpointPath(
					playerVehicle.position,
					new YUKA.Vector3().copy(groundIntersect.point)
				);

				if (pathVectors.length < 2) return;

				pathHelper.visible = true;
				pathHelper.geometry.dispose();
				pathHelper.geometry = new THREE.BufferGeometry().setFromPoints(pathVectors);

				playerVehicle.toRegion = navMesh.getRegionForPoint(groundIntersect.point);
				playerVehicle.steering.behaviors[0].active = true;
				playerVehicle.steering.behaviors[0].path.clear();

				pathVectors.map((point) => playerVehicle.steering.behaviors[0].path.add(point));

				playerVehicle.steering.add(
					new YUKA.OnPathBehavior(playerVehicle.steering.behaviors[0].path)
				);
			} else {
				console.log('missed');
			}
		},
	};
});

export default useStore;
