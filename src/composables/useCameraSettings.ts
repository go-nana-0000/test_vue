/* カメラ設定を管理するComposable */
import { ref } from 'vue'

/* カメラ設定 */
export function useCameraSettings() {
    // 平行カメラ設定
    const aspect = window.innerWidth / window.innerHeight
    const size = 5
    const left = ref(-size * aspect)
    const right = ref(size * aspect)
    const top = ref(size)
    const bottom = ref(-size)

    // カメラのズーム設定
    const baseZoom = 250; // PCのときのzoom
    const baseWidth = 600; // PCの描画幅
    var scale = 1;
    if (window.innerWidth < baseWidth) {
      scale = window.innerWidth / baseWidth;
    }
    const cameraZoom = baseZoom * scale;

  return {
    left,
    right,
    top,
    bottom,
    cameraZoom,
  }
}
