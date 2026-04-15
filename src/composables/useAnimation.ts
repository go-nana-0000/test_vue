import * as THREE from 'three'
import { useRenderLoop } from '@tresjs/core'

export function useAnimation(gltf: any) {
  const actions: Record<string, THREE.AnimationAction> = {}
  const mixer = new THREE.AnimationMixer(gltf.scene)

  const Anim: Record<string, number> = {}

  gltf.animations.forEach((clip: THREE.AnimationClip, index: number) => {
    Anim[clip.name] = index
    actions[clip.name] = mixer.clipAction(clip)
  })

  function play(animIndex: number) {
    const clip = gltf.animations[animIndex]
    if (!clip) return

    Object.values(actions).forEach(a => a.fadeOut(0.2))
    actions[clip.name].reset().fadeIn(0.2).play()
  }

  const { onLoop } = useRenderLoop()
  onLoop(({ delta }) => mixer.update(delta))

  return {
    play,
    Anim
  }
}