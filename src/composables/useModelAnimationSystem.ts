import { useAnimation } from './useAnimation'
import { useLoopManager } from './useLoopManager'

export function useModelAnimationSystem(
  gltf: any,
  loop: ReturnType<typeof useLoopManager>,
  initialAnimation?: string | null
) {
  const anim = useAnimation(gltf)

  loop.add(anim.update)

  if (initialAnimation) {
    anim.play(initialAnimation)
  }

  return anim
}
