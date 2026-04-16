/* モデルアニメーションを管理するComposable */
import { applyOutline } from './useOutline'
import { useModel } from './useModel'
import { useAnimation } from './useAnimation'
import { applyToonMaterial } from './useToonMaterial'

const FEATURE_PRESETS = {
  character: {
    toon: true,
    outline: true,
    animation: true,
    shadow: true,
  },
  static: {
    toon: true,
    outline: true,
    animation: false,
    shadow: true,
  },
} as const

export async function useModelWithFeatures(path: string, options: any = {}) {
  const preset = options.preset ? FEATURE_PRESETS[options.preset] : {}

  const config = {
    toon: false,
    outline: false,
    animation: false,
    shadow: false,
    ...preset,
    ...options, // 手動指定で上書き可能
  }

  const { model, gltf } = await useModel(path)

  if (!model.value) return { model, play: null, Anim: null }

  if (config.toon) applyToonMaterial(model.value)
  if (config.outline) applyOutline(model.value)

  model.value.traverse((child: any) => {
    if (child.isMesh) {
      child.castShadow = config.shadow
      child.receiveShadow = config.shadow
    }
  })

  const anim = config.animation ? useAnimation(gltf) : { play: null, Anim: null }

  return {
    model,
    ...anim,
  }
}