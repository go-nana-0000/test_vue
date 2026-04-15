import { shallowRef } from 'vue'
import * as THREE from 'three'
import { useGLTF } from '@tresjs/cientos'

export async function useModel(path: string) {
  const model = shallowRef<THREE.Object3D | null>(null)

  const gltf = await useGLTF(path, { draco: true })
  model.value = gltf.scene

  return {
    model,
    gltf
  }
}