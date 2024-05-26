import { create } from 'zustand'
import * as YUKA from 'yuka'
import * as THREE from 'three'
import { createConvexRegionHelper, createPathHelper, getPath, initPlayerVehicle } from '../Helpers/yukaHelpers'
import { CustomNavMesh } from '../CustomYukaObjects/CustomNavMesh'
import { handleQuipInteraction } from '../Data/interactions'
import { getAnimTimeline } from '../Helpers/animationHelpers'

const useStore = create((set, get) => {
  let navMesh
  let playerVehicle
  let player
  let entityManager = new YUKA.EntityManager()
  let time = new YUKA.Time()
  let pathHelper = createPathHelper()
  let playerAnim
  let nextPlayerLocation = new THREE.Vector3(0, 26.1, 0)

  let setNewPlayerLocation
  let isFastTraveling = false

  const setNextLocation = (next) => {
    set({ nextPlayerLocation: next })
  }

  const setTravel = (destination, speedMultiplyer = 1) => {
    if (playerAnim) {
      playerAnim.kill()
    }
    playerAnim = getAnimTimeline(navMesh, player, pathHelper, destination, setNextLocation, speedMultiplyer)

    playerAnim.call(() => {
      //on animation end
      player.animations.walk.stop()
      set({ isFastTraveling: false })
      document.getElementById('hud').classList.remove('vr-overlay')
    })

    playerAnim.play()
    player.animations.walk.play()
    return
  }

  const handleInteraction = (event) => {
    event.stopPropagation()
    const cursorType = document.getElementById('root').getAttribute('data-cursor')

    handleQuipInteraction(cursorType, event.eventObject.name === '' ? event.object.name : event.eventObject.name)

    if (event.intersections.length < 1) return

    const walkableIntersections = ['grass', 'sand']
    const firstIntersect = event.intersections[0]
    if (walkableIntersections.includes(firstIntersect.object.name) && cursorType === 'walk') {
      setTravel(firstIntersect.point)
    }
  }
  return {
    entityManager,
    time,
    nextPlayerLocation,
    setNewPlayerLocation,
    isFastTraveling,
    handleInteraction,
    fastTravel(destination) {
      set({ isFastTraveling: true })
      setTravel(destination, 0.08)
    },
    setPlayerLocation(location) {
      player.mesh.position.copy(location)
      const normal = location.clone().normalize()
      player.mesh.up.copy(normal)
      player.mesh.rotation.setFromQuaternion(player.mesh.quaternion)
    },
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
    initPlayer(playerMesh, playerAnimations, setNewPlayerLocation) {
      set({ setNewPlayerLocation: setNewPlayerLocation })
      player = {
        mesh: playerMesh,
        animations: playerAnimations,
        state: 'idle',
      }
      player.animations.idle.play()
    },
    setPlayerPosition(position) {
      set({ playerPostion: position })
    },
  }
})

export default useStore
