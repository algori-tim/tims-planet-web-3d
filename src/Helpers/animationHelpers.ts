import * as THREE from 'three'
import { getPath } from './yukaHelpers'
import { getDistance } from './mathHelpers'
import gsap from 'gsap'
import { Player } from '../Stores/playerStore'

export const getAnimTimeline = (
  navMesh: any,
  player: Player,
  pathHelper: THREE.Line,
  target: THREE.Vector3,
  setNextLocation: (location: THREE.Vector3) => void,
  speedMultiplyer = 0
) => {
  const path = getPath(navMesh, player.mesh.position, target)

  if (pathHelper) {
    pathHelper.visible = true
    pathHelper.geometry.dispose()
    pathHelper.geometry = new THREE.BufferGeometry().setFromPoints(path)
  }

  const tl = gsap.timeline()
  for (let i = 1; i < path.length; i++) {
    const next = new THREE.Vector3().copy(path[i])
    var distance = getDistance(path[i - 1], path[i])
    tl.to(player.mesh.position, {
      x: path[i].x,
      y: path[i].y,
      z: path[i].z,
      ease: 'none',
      duration: (distance / 3) * speedMultiplyer,
      onStart: () => setNextLocation(next),
    })
  }
  return tl
}
