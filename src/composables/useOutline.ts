import * as THREE from 'three'
import { OutlineSkinnedMaterial } from '@/shaders/OutlineSkinnedMaterial'

export function applyOutline(object: THREE.Object3D) {
  object.traverse((child) => {
    const skinned = child as THREE.SkinnedMesh

    if (!skinned.isSkinnedMesh) return
    if (skinned.userData.isOutline) return

    const outlineMesh = new THREE.SkinnedMesh(
      skinned.geometry,
      new OutlineSkinnedMaterial({
        outlineThickness: 0.007,
        outlineColor: new THREE.Color(0x84538c)
      })
    )

    outlineMesh.userData.isOutline = true
    outlineMesh.bind(skinned.skeleton, skinned.bindMatrix)

    outlineMesh.frustumCulled = false
    outlineMesh.renderOrder = -1

    skinned.add(outlineMesh)
  })
}
