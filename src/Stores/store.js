import { create } from 'zustand'
import * as YUKA from 'yuka'
import * as THREE from 'three'
import { createConvexRegionHelper, createPathHelper, getPath, initPlayerVehicle } from '../Helpers/yukaHelpers'
import { CustomNavMesh } from '../CustomYukaObjects/CustomNavMesh'
import { handleQuipInteraction } from '../Data/interactions'
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
      duration: distance / 3,
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
  let nextPlayerLocation = new THREE.Vector3(0, 26.1, 0)
  let overlayType = 'help'
  let playerWalking = new Audio('/audio/sound_fx/walking.mp3')
  const setNextLocation = (next) => {
    set({ nextPlayerLocation: next })
  }
  return {
    entityManager,
    time,
    overlayType,
    cursorType,
    nextPlayerLocation,
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

    setPlayerPosition(position) {
      set({ playerPostion: position })
    },

    setOverlayType(overlay) {
      set({ overlayType: overlay })
    },

    handleInteraction(event) {
      event.stopPropagation()
      const cursorType = document.getElementById('root').getAttribute('data-cursor')

      handleQuipInteraction(cursorType, event.eventObject.name === '' ? event.object.name : event.eventObject.name)

      if (event.intersections.length < 1) return

      const walkableIntersections = ['grass', 'sand']
      const firstIntersect = event.intersections[0]
      if (walkableIntersections.includes(firstIntersect.object.name) && cursorType === 'walk') {
        if (playerAnim) {
          playerAnim.kill()
        }
        playerAnim = getAnimTimeline(navMesh, player, pathHelper, firstIntersect.point, setNextLocation)

        playerAnim.call(() => {
          //on animation end
          player.animations.walk.stop()
          playerWalking.pause()
        })

        playerWalking.loop = true
        playerWalking.playbackRate = 0.65
        playerWalking.volume = 0.8
        playerWalking.play()
        playerAnim.play()

        player.animations.walk.play()
        return
      }
    },
  }
})

export default useStore
