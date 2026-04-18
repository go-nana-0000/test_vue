import { ShaderMaterial ,Matrix4} from 'three'
import * as THREE from 'three'

export class OutlineSkinnedMaterial extends THREE.ShaderMaterial {
  constructor(params: any) {
    super({
      uniforms: {
        outlineThickness: { value: params.outlineThickness },
        outlineColor: { value: params.outlineColor }
      },
    vertexShader: `
      #define USE_SKINNING

      uniform float outlineThickness;

      #include <common>
      #include <skinning_pars_vertex>

      void main() {
        #include <begin_vertex>
        #include <skinbase_vertex>
        #include <skinning_vertex>

        vec3 newPosition = transformed + normal * outlineThickness;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
      }
    `,
      fragmentShader: `
        uniform vec3 outlineColor;
        void main() {
          gl_FragColor = vec4(outlineColor, 1.0);
        }
      `,
      side: THREE.BackSide,
    })
  }
}