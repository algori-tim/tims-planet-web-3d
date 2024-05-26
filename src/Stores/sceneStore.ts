import { create } from 'zustand'
import * as YUKA from 'yuka'
import * as THREE from 'three'
import { createConvexRegionHelper, createPathHelper } from '../Helpers/yukaHelpers'
import { CustomNavMesh } from '../CustomYukaObjects/CustomNavMesh'
import { subscribeWithSelector } from 'zustand/middleware'

interface sceneState {
  pathHelper: THREE.Line
  navMesh: CustomNavMesh | undefined
  entityManager: YUKA.EntityManager
  init(scene: THREE.Scene, shouldAddHelpers: boolean): void
}

const useSceneStore = create<sceneState>()(
  subscribeWithSelector((set, get) => ({
    pathHelper: createPathHelper(),
    navMesh: undefined,
    entityManager: new YUKA.EntityManager(),
    init(scene: THREE.Scene, shouldAddHelpers: boolean = false) {
      const { navMesh, pathHelper } = get()
      if (navMesh) return
      const loader = new YUKA.NavMeshLoader()
      loader
        .load('./models/planet_nav.glb')
        .then((navigationMesh: YUKA.NavMesh) => {
          const navMesh = new CustomNavMesh(navigationMesh)
          if (shouldAddHelpers) {
            scene.add(createConvexRegionHelper(navMesh))
            scene.add(pathHelper)
          }
          set({ navMesh: navMesh })
        })
        .catch((error: any) => {
          console.error('Failed to load navigation mesh:', error)
        })
    },
  }))
)

export default useSceneStore
