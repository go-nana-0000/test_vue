/* モデルアニメーションを管理するComposable */
import { shallowRef} from 'vue'
import * as THREE from 'three'
import { useRenderLoop } from '@tresjs/core'
import { useGLTF} from '@tresjs/cientos'

/* モデルとアニメーションの管理 */
export async function useModelAnimation(path: string) {
    const model = shallowRef<THREE.Object3D | null>(null)
    const actions: Record<string, THREE.AnimationAction> = {}
    const gltf = await useGLTF(path, { draco: true })
    model.value = gltf.scene
    let mixer = new THREE.AnimationMixer(gltf.scene)

    // Animatinonの名前とインデックスをマッピング
    const Anim: Record<string, number> = {}
    gltf.animations.forEach((clip, index) => {
        Anim[clip.name] = index
    })
    console.log("Loaded animations:", Anim)

    // GLB内のanimetionを取得
    gltf.animations.forEach((clip) => {
        actions[clip.name] = mixer!.clipAction(clip)
    })

    /* アニメーション再生 */
    function play(anim: number) {
        if (!mixer) return
        
        const clip = gltf.animations[anim]
        if (!clip) return
        Object.values(actions).forEach(a => a.fadeOut(0.2))
        actions[clip.name].reset().fadeIn(0.2).play()
    }

    // ループ設定
    const { onLoop } = useRenderLoop()
    onLoop(({ delta }) => {
        if (mixer) mixer.update(delta)
    })

    return {
        model, 
        play,
        Anim
    }
}
