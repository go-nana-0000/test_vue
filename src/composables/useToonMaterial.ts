
import * as THREE from 'three'

/* トゥーン用グラデーション生成 */
function createGradientMap() {
  const data = new Uint8Array([
    140, 100, 160, 255,
    220, 200, 255, 255,
    255, 255, 255, 255
  ])

  const texture = new THREE.DataTexture(data, 3, 1, THREE.RGBAFormat)

  texture.needsUpdate = true
  texture.minFilter = THREE.NearestFilter
  texture.magFilter = THREE.NearestFilter
  texture.generateMipmaps = false

  return texture
}

/* トゥーンマテリアル適用 */
export function applyToonMaterial(model: THREE.Object3D) {
  const gradientMap = createGradientMap()

  model.traverse((child: any) => {
    if (child.isMesh) {
      const oldMat = child.material

      if (child.geometry) {
        child.geometry.computeVertexNormals()
      }

      child.material = new THREE.MeshToonMaterial({
        map: oldMat?.map ?? null,
        transparent: oldMat?.transparent ?? false,
        alphaTest: oldMat?.alphaTest ?? 0,
        gradientMap,
        side: THREE.DoubleSide,
      })
    }
  })
}
