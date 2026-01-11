import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

interface LoadAssetsGLBProps {
  url: string;
  scalar: number;
  isRotateY?: boolean;
}
export async function loadAssetsGLB({
  url,
  scalar,
  isRotateY,
}: LoadAssetsGLBProps) {
  const loader = new GLTFLoader();

  return new Promise<{
    model: THREE.Group;
    animations: THREE.AnimationClip[];
  }>((resolve, reject) => {
    loader.load(
      url,
      (gltf) => {
        const model = gltf.scene;
        model.scale.setScalar(scalar);
        if (isRotateY) {
          model.rotation.y = Math.PI;
        }

        resolve({
          model,
          animations: gltf.animations,
        });
      },
      undefined,
      reject
    );
  });
}
