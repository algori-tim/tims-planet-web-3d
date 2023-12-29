import { create } from 'zustand'
import * as YUKA from 'yuka'
import * as THREE from 'three'
import { createConvexRegionHelper, createPathHelper, getPath, initPlayerVehicle } from '../Helpers/yukaHelpers'
import { CustomNavMesh } from '../CustomYukaObjects/CustomNavMesh'
import { handleInteraction } from '../Data/interactions'
import { getDistance } from '../Helpers/mathHelpers'
import gsap from 'gsap'

const getAnimTimeline = (navMesh, player, pathHelper, target, setNextLocation) => {
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
      duration: distance / 2,
      onStart: () => setNextLocation(next),
    })
  }
  return tl
}

const useStore = create((set, get) => {
  let cursorType = document.getElementById('root').getAttribute('data-cursor')
  let navMesh
  let playerVehicle
  let player
  let entityManager = new YUKA.EntityManager()
  let time = new YUKA.Time()
  let pathHelper = createPathHelper()
  let playerAnim
  let nextPlayerLocation = new THREE.Vector3(0, 27, 0)
  let overlayType = 'sign'
  const setNextLocation = (next) => {
    nextPlayerLocation = next
  }

  const getNextLocation = () => {
    return nextPlayerLocation
  }

  return {
    entityManager,
    time,
    overlayType,
    cursorType,
    getNextLocation,
    init(scene, shouldAddHelpers = false) {
      if (navMesh) return
      const loader = new YUKA.NavMeshLoader()
      loader.load('./models/planet_nav.glb').then((navigationMesh) => {
        navMesh = new CustomNavMesh(navigationMesh)
        if (shouldAddHelpers) {
          scene.add(createConvexRegionHelper(navMesh))
          scene.add(pathHelper)
        }
      })
    },
    setYukaPlayer(playerMesh) {
      if (playerVehicle) return

      playerVehicle = initPlayerVehicle(navMesh, playerMesh, entityManager)
    },
    setPlayer(playerMesh, playerAnimations) {
      player = {
        mesh: playerMesh,
        animations: playerAnimations,
        state: 'idle',
      }
      player.animations.idle.play()
    },

    setCursor(cursor) {
      set({ cursorType: cursor })
    },
    handleInteraction(event) {
      event.stopPropagation()
      console.log(event.intersections)
      handleInteraction(cursorType, event.eventObject.name === '' ? event.object.name : event.eventObject.name)
      const groundIntersect = event.intersections.find((x) => x.object.name === 'grass')
      if (groundIntersect && cursorType === 'walk') {
        if (playerAnim) {
          playerAnim.kill()
        }
        playerAnim = getAnimTimeline(navMesh, player, pathHelper, groundIntersect.point, setNextLocation)
        playerAnim.call(() => player.animations.walk.stop())
        playerAnim.play()

        player.animations.walk.play()
        return
      }

      const signIntersect = event.intersections.find((x) => x.object.name.startsWith('tims_planet_sign'))
      if (signIntersect && cursorType === 'look') {
        set({ overlayType: 'sign' })
        document.getElementById('overlay').style.display = 'flex'
        return
      }

      const observatoryIntersect = event.intersections.find((x) => x.object.name.startsWith('observatory'))
      if (observatoryIntersect && cursorType === 'look') {
        set({ overlayType: 'observatory' })
        document.getElementById('overlay').style.display = 'flex'
        return
      }

      const factoryIntersect = event.intersections.find((x) => x.object.name.startsWith('factory'))
      if (factoryIntersect && cursorType === 'look') {
        set({ overlayType: 'factory' })
        document.getElementById('overlay').style.display = 'flex'
        return
      }

      const wellIntersect = event.intersections.find((x) => x.object.name.startsWith('well'))
      if (wellIntersect && cursorType === 'look') {
        set({ overlayType: 'well' })
        document.getElementById('overlay').style.display = 'flex'
        return
      }
    },
  }
})

export default useStore
