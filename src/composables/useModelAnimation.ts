/* モデルアニメーションを管理するComposable */
import * as THREE from 'three'
import { applyOutline } from './useOutline'
import { useModel } from './useModel'
import { useAnimation } from './useAnimation'
import { applyToonMaterial } from './useToonMaterial'

/* モデルとアニメーションの管理 */
export async function useModelAnimation(path: string) {
    const { model, gltf } = await useModel(path)

    if (model.value) {
        applyToonMaterial(model.value)
        applyOutline(model.value)
        // model.value.traverse((child: any) => {
        //     if (child.isMesh) {
        //         child.castShadow = true
        //         child.receiveShadow = true
        //     }
        // })
    }
    const { play, Anim } = useAnimation(gltf)

    return {
        model, 
        play,
        Anim
    }
}
