import { shallowRef } from 'vue'
import * as THREE from 'three'
import { useGLTF } from '@tresjs/cientos'

export async function useModelLoader(path: string) {
  const model = shallowRef<THREE.Object3D | null>(null)

  const gltf = await useGLTF(path, { draco: true })
  model.value = gltf.scene
  console.log('Model loaded:', path)

  return {
    model,
    gltf
  }
}
