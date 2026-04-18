/* モーフを制御するcomposable */
import * as THREE from 'three'

export function useMorph(scene: THREE.Object3D) {

  function setMorph(name: string, value: number) {
    scene.traverse((child: THREE.Object3D) => {
        if (!(child instanceof THREE.Mesh)) return
        if (!child.morphTargetDictionary || !child.morphTargetInfluences) return

        const index = child.morphTargetDictionary[name]
        if (index !== undefined) {
        child.morphTargetInfluences[index] = value
        }
    })
  }

  function getMorphList() {
    const result: {
      name: string
      morphs: string[]
    }[] = []

    scene.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return
      if (!child.morphTargetDictionary) return
        if (!child.name) return

        result.push({
        name: child.name || "(unnamed mesh)",
        morphs: Object.keys(child.morphTargetDictionary)
        })
    })

    return result
    }
  return {
    setMorph,
    getMorphList
  }
}