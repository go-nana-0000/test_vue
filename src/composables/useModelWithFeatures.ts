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
    initialAnimation: 'Anm_Idle',
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

  if (!model.value) return { model, play: null, Anim: null, setMorph: null, getMorphList: null }
  const loop = useLoopManager()

  // 見た目
  useModelAppearance(model.value, config)

  // モーフ
  let setMorph: ((name: string, value: number) => void) | null = null
  let getMorphList: (() => { name: string; morphs: string[]; }[]) | null = null
  if (config.morph) {
    const morphResult = useModelMorphSystem(gltf.scene, loop)
    setMorph = morphResult.setMorph
    getMorphList = morphResult.getMorphList
  }

  // アニメーション
  let play: ((anim: number | string) => void) | null = null
  let Anim: Record<string, number> | null = null
  if (config.animation) {
    const animResult = useModelAnimationSystem(
      gltf,
      loop,
      config.initialAnimation
    )
    play = animResult.play
    Anim = animResult.Anim
  }

  return {
    model,
    play,
    Anim,
    setMorph,
    getMorphList,
  }
}
