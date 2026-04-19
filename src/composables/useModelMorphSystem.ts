import * as THREE from 'three'
import { useAutoBlink } from './useAutoBlink'
import { useLoopManager } from './useLoopManager'
import { useMorph } from './useMorph'

export function useModelMorphSystem(
  scene: THREE.Object3D,
  loop: ReturnType<typeof useLoopManager>
) {
  const morph = useMorph(scene)

  const setMorph = morph.setMorph
  const getMorphList = morph.getMorphList
  const list = getMorphList()
  console.log(list)

  // const blink = useAutoBlink(scene, setMorph)
  // loop.add(blink.update)

  return {
    setMorph,
    getMorphList,
  }
}
