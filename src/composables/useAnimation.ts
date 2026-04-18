import * as THREE from 'three'
import { useRenderLoop } from '@tresjs/core'

export function useAnimation(gltf: any) {
  const actions: Record<string, THREE.AnimationAction> = {}
  const mixer = new THREE.AnimationMixer(gltf.scene)

  const Anim: Record<string, number> = {}

  gltf.animations.forEach((clip: THREE.AnimationClip, index: number) => {
    Anim[clip.name] = index
    actions[clip.name] = mixer.clipAction(clip)
    console.log('Anime num:', '[', index, '],', clip.name)
  })

  function play(anim: number | string) {
    let index = -1

    if (typeof anim === 'number') {
      index = anim
    } else {
      index = gltf.animations.findIndex(c => c.name === anim)
    }

    const clip = gltf.animations[index]
    if (!clip) return

    Object.values(actions).forEach(a => a.fadeOut(0.2))
    actions[clip.name].reset().fadeIn(0.2).play()

    console.log('Playing animation:', clip.name)
  }

  function update(delta: number) {
    mixer.update(delta)
  }

  return {
    play,
    Anim,
    update: mixer.update.bind(mixer), // 常に存在
  }
}
