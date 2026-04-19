/* モデルアニメーションを管理するComposable */

import { useModelLoader } from './useModelLoader'
import { useLoopManager } from './useLoopManager'
import { useModelMorphSystem } from './useModelMorphSystem'
import { useModelAppearance } from './useModelAppearance'
import { useModelAnimationSystem } from './useModelAnimationSystem'

type PresetKey = keyof typeof FEATURE_PRESETS

type Options = {
  preset?: PresetKey
  toon?: boolean
  outline?: boolean
  animation?: boolean
  shadow?: boolean
  morph?: boolean
  initialAnimation?: string
}

const FEATURE_PRESETS = {
  character: {
    toon: true,
    outline: false,
    animation: true,
    shadow: false,
    morph: true,
    initialAnimation: 'Idle',
  },
  static: {
    toon: true,
    outline: false,
    animation: false,
    shadow: false,
    morph: false,
    initialAnimation: null,
  },
} as const

export async function useModelWithFeatures(
  path: string,
  options: Options = {}
) {
  const preset = options.preset
    ? FEATURE_PRESETS[options.preset]
    : {}

  const config = {
    toon: false,
    outline: false,
    animation: false,
    shadow: false,
    morph: false,
    initialAnimation: null,
    ...preset,
    ...options, // 手動指定で上書き可能
  }

  const { model, gltf } = await useModelLoader(path)

  if (!model.value) return { model, play: null, Anim: null, morph: null }
  const loop = useLoopManager()

  // 見た目
  useModelAppearance(model.value, config)

  // モーフ
  let morphSystem = { setMorph: null, getMorphList: null }
  if (config.morph) {
    morphSystem = useModelMorphSystem(gltf.scene, loop)
  }

  // アニメーション
  let anim = { play: null, Anim: null }
  if (config.animation) {
    anim = useModelAnimationSystem(
      gltf,
      loop,
      config.initialAnimation
    )
  }

  const result = {
    model,
    ...anim,
    ...morphSystem,
  }

  return result
}
