/* モデルアニメーションを管理するComposable */
import { applyOutline } from './useOutline'
import { useModel } from './useModel'
import { useAnimation } from './useAnimation'
import { applyToonMaterial } from './useToonMaterial'
import { useMorph } from './useMorph'

type PresetKey = keyof typeof FEATURE_PRESETS

type Options = {
  preset?: PresetKey
  toon?: boolean
  outline?: boolean
  animation?: boolean
  shadow?: boolean
  morph?: boolean
}

const FEATURE_PRESETS = {
  character: {
    toon: true,
    outline: true,
    animation: true,
    shadow: false,
    morph: true,
  },
  static: {
    toon: true,
    outline: true,
    animation: false,
    shadow: false,
    morph: false,
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
    ...preset,
    ...options, // 手動指定で上書き可能
  }

  const { model, gltf } = await useModel(path)

  console.log('Model loaded:', path)

  if (!model.value) return { model, play: null, Anim: null, morph: null }

  if (config.toon) applyToonMaterial(model.value)
  if (config.outline) applyOutline(model.value)

  model.value.traverse((child: any) => {
    if (child.isMesh) {
      child.castShadow = config.shadow
      child.receiveShadow = config.shadow
    }
  })

  const morphMeshes = []

  const { setMorph, getMorphList } = useMorph(gltf.scene)
  setMorph("Blink", 1)
  const list = getMorphList()
  console.log(list)

  const anim = config.animation ? useAnimation(gltf) : { play: null, Anim: null }
  return {
    model,
    ...anim,
  }
}