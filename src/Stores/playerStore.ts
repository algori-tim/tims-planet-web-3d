import { create } from 'zustand'
import * as THREE from 'three'
import { handleQuipInteraction } from '../Data/interactions'
import { getAnimTimeline } from '../Helpers/animationHelpers'
import useAudioStore from './audioStore'
import { ThreeEvent } from '@react-three/fiber'
import useSceneStore from './sceneStore'

export interface Player {
  mesh: THREE.Mesh
  animations: any
  state: string
}

interface PlaterState {
  player: Player | null
  nextPlayerLocation: THREE.Vector3
  isFastTraveling: boolean
  setNewPlayerLocation: ((location: THREE.Vector3) => void) | null
  handleInteraction(event: ThreeEvent<MouseEvent>): void
  fastTravel(destination: THREE.Vector3): void
  setPlayerLocation(location: THREE.Vector3): void
  initPlayer(
    playerMesh: THREE.Mesh,
    playerAnimations: any,
    setNewPlayerLocation: ((location: THREE.Vector3) => void) | null
  ): void
}

const usePlayerStore = create<PlaterState>((set, get) => {
  let playerAnim: any
  const nextPlayerLocation = new THREE.Vector3(0, 26.1, 0)

  const setNextLocation = (next: THREE.Vector3) => {
    set({ nextPlayerLocation: next })
  }

  const setTravel = (destination: THREE.Vector3, speedMultiplier: number = 1) => {
    const { handleStartPlayerWalking, handleEndPlayerWalking } = useAudioStore.getState()
    if (playerAnim) {
      playerAnim.kill()
    }
    const { player } = get()
    const { pathHelper, navMesh } = useSceneStore.getState()

    if (player) {
      playerAnim = getAnimTimeline(navMesh, player, pathHelper, destination, setNextLocation, speedMultiplier)
    }

    // On animation end
    playerAnim.call(() => {
      player?.animations.walk.stop()
      set({ isFastTraveling: false })
      handleEndPlayerWalking()
      document.getElementById('hud')?.classList.remove('vr-overlay')
    })

    handleStartPlayerWalking()
    playerAnim.play()
    player?.animations.walk.play()
  }

  const handleInteraction = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation()
    const cursorType = document.getElementById('root')?.getAttribute('data-cursor') as string

    handleQuipInteraction(cursorType, event.eventObject.name === '' ? event.object.name : event.eventObject.name)

    if (event.intersections.length < 1) return

    const walkableIntersections = ['grass', 'sand']
    const firstIntersect = event.intersections[0]
    if (walkableIntersections.includes(firstIntersect.object.name) && cursorType === 'walk') {
      setTravel(firstIntersect.point)
    }
  }

  return {
    player: null,
    nextPlayerLocation,
    setNewPlayerLocation: null,
    isFastTraveling: false,
    handleInteraction,
    fastTravel(destination: THREE.Vector3) {
      set({ isFastTraveling: true })
      setTravel(destination, 0.08)
    },
    setPlayerLocation(location: THREE.Vector3) {
      const { player } = get()
      if (player) {
        player.mesh.position.copy(location)
        const normal = location.clone().normalize()
        player.mesh.up.copy(normal)
        player.mesh.rotation.setFromQuaternion(player.mesh.quaternion)
      }
    },
    initPlayer(playerMesh, playerAnimations, setNewPlayerLocation) {
      set({
        setNewPlayerLocation,
        player: {
          mesh: playerMesh,
          animations: playerAnimations,
          state: 'idle',
        },
      })
      const { player } = get()
      player?.animations.idle.play()
    },
  }
})

export default usePlayerStore
