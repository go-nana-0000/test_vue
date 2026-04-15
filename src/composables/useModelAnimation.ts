/* モデルアニメーションを管理するComposable */
import { shallowRef} from 'vue'
import * as THREE from 'three'
import { useRenderLoop } from '@tresjs/core'
import { useGLTF} from '@tresjs/cientos'

import { applyOutline } from './useOutline'
import { useModel } from './useModel'
import { useAnimation } from './useAnimation'

/* モデルとアニメーションの管理 */
export async function useModelAnimation(path: string) {
    const { model, gltf } = await useModel(path)

    // アウトラインの適用
    if (model.value) {
        applyOutline(model.value)
    }

    const { play, Anim } = useAnimation(gltf)

    return {
        model, 
        play,
        Anim
    }
}
