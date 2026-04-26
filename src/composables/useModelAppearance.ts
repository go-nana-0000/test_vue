import * as THREE from 'three'
import { applyOutline } from './useOutline'
import { applyToonMaterial } from './useToonMaterial'

export function useModelAppearance(model: THREE.Object3D, config: {
  toon: boolean
  outline: boolean
  shadow: boolean
}) {
  if (config.toon) applyToonMaterial(model)
  // if (config.outline) applyOutline(model)

  model.traverse((child: any) => {
    if (child.isMesh) {
      child.castShadow = config.shadow
      child.receiveShadow = config.shadow
    }
  })
}
