"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import * as Contents from "./contents";

type PetalContent = {
  title: string;
  value: ComponentType;
};

type PetalAnimation = {
  mesh: THREE.Mesh;
  originalPosition: THREE.Vector3;
  targetPosition: THREE.Vector3;
  originalQuaternion: THREE.Quaternion;
  originalScale: THREE.Vector3;
  targetQuaternion: THREE.Quaternion;
  progress: number;
  viewed: boolean;
  returning: boolean;
  content: PetalContent;
};


export const PETAL_CONTENTS: Record<number, PetalContent> = {
  0: {
    title: "Cánh hoa hoài niệm",
    value: Contents.Content1,
  },
  1: {
    title: "Cánh hoa giải tích",
    value: Contents.Content2,
  },
  2: {
    title: "Cánh hoa ý nghĩa",
    value: Contents.Content3,
  },
  3: {
    title: "Cánh hoa bày tỏ",
    value: Contents.Content4,
  },
  4: {
    title: "Cánh hoa niềm vui",
    value: Contents.Content5,
  },
  5: {
    title: "Cánh hoa game(Con rắn)",
    value: Contents.Content6,
  },
  6: {
    title: "Cánh hoa đồ thị",
    value: Contents.Content7,
  },
  7: {
    title: "Cánh thơ hoa tình",
    value: Contents.Content8,
  },
  8: {
    title: "Cánh hoa dịp lễ",
    value: Contents.Content9,
  },
  9: {
    title: "Cánh hoa suy nghĩ",
    value: Contents.Content10,
  },
  10: {
    title: "Cánh hoa chở che",
    value: Contents.Content11,
  },
  11: {
    title: "Cánh hoa tâm tình",
    value: Contents.Content12,
  },
  12: {
    title: "Cánh hoa ma trận",
    value: Contents.Content13,
  },
  13: {
    title: "Cánh hoa thử thách",
    value: Contents.Content14,
  },
  14: {
    title: "Cánh hoa trưởng thành",
    value: Contents.Content15,
  },
  15: {
    title: "Cánh hoa câu đố",
    value: Contents.Content16,
  },
  16: {
    title: "Cánh hoa trái tim",
    value: Contents.Content17,
  },
  17: {
    title: "Cánh hoa dành riêng em",
    value: Contents.Content18,
  },
  18: {
    title: "Vẻ đẹp của tri thức",
    value: Contents.Content19,
  },
  19: {
    title: "Biết lắng nghe và thấu hiểu",
    value: Contents.Content20,
  },
  20: {
    title: "Sự chăm chỉ và kiên trì",
    value: Contents.Content21,
  },
  21: {
    title: "Có mục tiêu và hết mình theo đuổi",
    value: Contents.Content22,
  },
  22: {
    title: "Thảo là niềm vui nhỏ của Vũ",
    value: Contents.Content23,
  },
  23: {
    title: "Khi nào mệt thì nhớ có Vũ nha",
    value: Contents.Content24,
  },
  24: {
    title: "Vũ muốn cùng Thảo tạo thêm kỷ niệm",
    value: Contents.Content25,
  },
  25: {
    title: "Hai đứa mình cùng học cách yêu",
    value: Contents.Content26,
  },
  26: {
    title: "Có một người Vũ muốn dỗ dành",
    value: Contents.Content27,
  },
  27: {
    title: "Vũ trân trọng Thảo nhiều lắm",
    value: Contents.Content28,
  },
  28: {
    title: "Nếu được chọn lại...",
    value: Contents.Content29,
  },
};


export default function RoseViewer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);
  const explodedRef = useRef(false);
  const selectedPetalRef = useRef<THREE.Mesh | null>(null);
  const petalAnimationsRef = useRef<PetalAnimation[]>([]);

  const [started, setStarted] = useState(false);
  const [selectedContent, setSelectedContent] =
    useState<PetalContent | null>(null);
  const [neonBrightness, setNeonBrightness] = useState(70);
  const [petalThickness, setPetalThickness] = useState(100);
  const [showSettings, setShowSettings] = useState(false);

  const settingsShownRef = useRef(false);
  const neonBrightnessRef = useRef(70);
  const petalThicknessRef = useRef(100);

  neonBrightnessRef.current = neonBrightness;
  petalThicknessRef.current = petalThickness;

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#02030b");
    scene.fog = new THREE.FogExp2("#02030b", 0.012);

    const camera = new THREE.PerspectiveCamera(
      40,
      container.clientWidth / Math.max(container.clientHeight, 1),
      0.01,
      1000,
    );

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.85;

    Object.assign(renderer.domElement.style, {
      position: "absolute",
      inset: "0",
      width: "100%",
      height: "100%",
      cursor: "default",
      touchAction: "pan-y",
    });

    container.appendChild(renderer.domElement);

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(
        container.clientWidth,
        container.clientHeight,
      ),
      0.8,
      0.55,
      0.25,
    );

    composer.addPass(bloomPass);
    composer.addPass(new OutputPass());

    const controls = new OrbitControls(camera, renderer.domElement);

    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enablePan = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.35;

    scene.add(new THREE.HemisphereLight("#26365f", "#03040b", 0.65));

    const keyLight = new THREE.DirectionalLight("#ffb1d0", 1.5);
    keyLight.position.set(4, 7, 6);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight("#6b73ff", 0.85);
    fillLight.position.set(-4, 3, 2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight("#ff286f", 1.8);
    rimLight.position.set(0, 4, -5);
    scene.add(rimLight);

    const roseLight = new THREE.PointLight("#ff174f", 2.2, 12, 2);
    roseLight.position.set(0, 1, 2);
    scene.add(roseLight);

    const stemMaterial = new THREE.MeshStandardMaterial({
      color: "#087c40",
      emissive: "#00ff72",
      emissiveIntensity: 0.65,
      roughness: 0.45,
      metalness: 0.05,
      side: THREE.DoubleSide,
    });

    const leafMaterial = new THREE.MeshStandardMaterial({
      color: "#16894a",
      emissive: "#00ff68",
      emissiveIntensity: 0.5,
      roughness: 0.48,
      metalness: 0.02,
      side: THREE.DoubleSide,
    });

    const petalColors = [
      "#b90040",
      "#ed0757",
      "#ff174f",
      "#ff3b80",
      "#ff79b0",
    ];

    const petalEmissiveColors = [
      "#ff003c",
      "#ff064f",
      "#ff125f",
      "#ff267e",
      "#ff4d9d",
    ];

    const petalMaterials = petalColors.map((color, index) =>
      new THREE.MeshStandardMaterial({
        color,
        emissive: petalEmissiveColors[index],
        emissiveIntensity: 0.85,
        roughness: 0.38,
        metalness: 0.02,
        side: THREE.DoubleSide,
      }),
    );

    const starCount = 1800;
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);
    const starSizes = new Float32Array(starCount);

    const starPalette = [
      new THREE.Color("#ffffff"),
      new THREE.Color("#a8c7ff"),
      new THREE.Color("#ffb9dd"),
      new THREE.Color("#9b8cff"),
    ];

    for (let i = 0; i < starCount; i++) {
      const radius = 18 + Math.random() * 65;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      starPositions[i * 3] =
        radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = radius * Math.cos(phi);
      starPositions[i * 3 + 2] =
        radius * Math.sin(phi) * Math.sin(theta);

      const color =
        starPalette[Math.floor(Math.random() * starPalette.length)];

      starColors[i * 3] = color.r;
      starColors[i * 3 + 1] = color.g;
      starColors[i * 3 + 2] = color.b;

      starSizes[i] = 0.5 + Math.random() * 1.5;
    }

    const starGeometry = new THREE.BufferGeometry();

    starGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(starPositions, 3),
    );

    starGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(starColors, 3),
    );

    starGeometry.setAttribute(
      "size",
      new THREE.BufferAttribute(starSizes, 1),
    );

    const starMaterial = new THREE.PointsMaterial({
      size: 0.075,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const clock = new THREE.Clock();

    let model: THREE.Group | null = null;
    let animationFrame = 0;
    let disposed = false;
    let pointerDownX = 0;
    let pointerDownY = 0;

    const onPointerDown = (event: PointerEvent) => {
      pointerDownX = event.clientX;
      pointerDownY = event.clientY;
    };

    const getIntersections = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();

      if (!rect.width || !rect.height) return [];

      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);

      const meshes = petalAnimationsRef.current
        .filter((petal) => !petal.viewed && !petal.returning)
        .map((petal) => petal.mesh);

      return raycaster.intersectObjects(meshes, false);
    };

    const onPointerUp = (event: PointerEvent) => {
      if (!startedRef.current || !explodedRef.current) return;
      if (selectedPetalRef.current) return;

      const dx = event.clientX - pointerDownX;
      const dy = event.clientY - pointerDownY;

      if (dx * dx + dy * dy > 36) return;

      const intersections = getIntersections(event);

      if (intersections.length === 0) return;

      const clickedMesh = intersections[0].object as THREE.Mesh;

      const petal = petalAnimationsRef.current.find(
        (item) => item.mesh === clickedMesh,
      );

      if (!petal) return;

      selectedPetalRef.current = petal.mesh;
      setSelectedContent(petal.content);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!startedRef.current || !explodedRef.current) {
        renderer.domElement.style.cursor = "default";
        return;
      }

      const intersections = getIntersections(event);

      renderer.domElement.style.cursor =
        intersections.length > 0 ? "pointer" : "default";
    };

    const onPointerLeave = () => {
      renderer.domElement.style.cursor = "default";
    };

    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointerup", onPointerUp);
    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerleave", onPointerLeave);

    const loader = new GLTFLoader();

    loader.load(
      "/models/rose.glb",
      (gltf) => {
        if (disposed) {
          gltf.scene.traverse((object) => {
            if (object instanceof THREE.Mesh) {
              object.geometry.dispose();
            }
          });
          return;
        }

        model = gltf.scene;

        const meshList: THREE.Mesh[] = [];

        model.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            meshList.push(object);
          }
        });

        meshList.forEach((mesh, index) => {
          if (index <= 6) {
            mesh.material = index <= 1 ? stemMaterial : leafMaterial;
          } else {
            mesh.material =
              petalMaterials[(index - 7) % petalMaterials.length];
          }
        });

        const initialBounds = new THREE.Box3().setFromObject(model);
        const initialCenter = initialBounds.getCenter(new THREE.Vector3());
        const initialSize = initialBounds.getSize(new THREE.Vector3());

        const maxDimension = Math.max(
          initialSize.x,
          initialSize.y,
          initialSize.z,
        );

        model.position.sub(initialCenter);

        if (maxDimension > 0) {
          model.scale.setScalar(3 / maxDimension);
        }

        scene.add(model);
        model.updateMatrixWorld(true);

        const fittedBounds = new THREE.Box3().setFromObject(model);
        const fittedSize = fittedBounds.getSize(new THREE.Vector3());
        const fittedCenter = fittedBounds.getCenter(new THREE.Vector3());

        const maxSize = Math.max(
          fittedSize.x,
          fittedSize.y,
          fittedSize.z,
        );

        const distance =
          maxSize /
          (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)));

        camera.position.set(
          fittedCenter.x,
          fittedCenter.y,
          fittedCenter.z + distance * 2.6,
        );

        camera.near = Math.max(0.001, distance / 100);
        camera.far = Math.max(1000, distance * 100);
        camera.updateProjectionMatrix();

        controls.target.copy(fittedCenter);
        controls.update();

        camera.updateMatrixWorld(true);
        model.updateMatrixWorld(true);

        roseLight.position.set(
          fittedCenter.x,
          fittedCenter.y + maxSize * 0.15,
          fittedCenter.z + maxSize * 0.4,
        );

        const petals = meshList.slice(7);
        const count = petals.length;

        const sphereCenter = fittedBounds.getCenter(new THREE.Vector3());
        const sphereRadius = maxSize * 2.8;
        const goldenAngle = Math.PI * (3 - Math.sqrt(5));

        const directions: THREE.Vector3[] = [];

        for (let i = 0; i < count; i++) {
          const y = 1 - (2 * (i + 0.5)) / Math.max(count, 1);
          const horizontalRadius = Math.sqrt(1 - y * y);
          const angle = i * goldenAngle;

          directions.push(
            new THREE.Vector3(
              Math.cos(angle) * horizontalRadius,
              y,
              Math.sin(angle) * horizontalRadius,
            ),
          );
        }

        for (let i = directions.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));

          [directions[i], directions[j]] = [
            directions[j],
            directions[i],
          ];
        }

        petalAnimationsRef.current = petals.map((mesh, index) => {
          const originalPosition = mesh.position.clone();
          const originalQuaternion = mesh.quaternion.clone();
          const direction = directions[index];

          const radius =
            sphereRadius * (0.9 + Math.random() * 0.2);

          const targetWorldPosition = sphereCenter
            .clone()
            .addScaledVector(direction, radius);

          const targetPosition = targetWorldPosition.clone();

          if (mesh.parent) {
            mesh.parent.worldToLocal(targetPosition);
          }

          const randomRotation = new THREE.Quaternion().setFromEuler(
            new THREE.Euler(
              (Math.random() - 0.5) * Math.PI,
              (Math.random() - 0.5) * Math.PI * 2,
              (Math.random() - 0.5) * Math.PI,
            ),
          );

          const targetQuaternion = originalQuaternion
            .clone()
            .multiply(randomRotation);

          return {
            mesh,
            originalPosition,
            targetPosition,
            originalQuaternion,
            originalScale: mesh.scale.clone(),
            targetQuaternion,
            progress: 0,
            viewed: false,
            returning: false,
            content: PETAL_CONTENTS[index] ?? {
              title: `Nội dung ${index + 1}`,
              value: Contents.DefaultPetalContent,
            },
          };
        });
      },
      undefined,
      (error) => {
        console.error("Không thể tải model hoa hồng:", error);
      },
    );

    const resizeObserver = new ResizeObserver(() => {
      const width = container.clientWidth;
      const height = container.clientHeight;

      if (!width || !height) return;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
      composer.setSize(width, height);
      bloomPass.setSize(width, height);
    });

    const animate = () => {
      animationFrame = requestAnimationFrame(animate);

      const delta = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.elapsedTime;

      stars.rotation.y = elapsed * 0.003;
      stars.rotation.x = Math.sin(elapsed * 0.025) * 0.025;

      const glowPulse = 1 + Math.sin(elapsed * 1.5) * 0.08;

      const neon = neonBrightnessRef.current / 100;
      const thickness = petalThicknessRef.current / 100;

      petalMaterials.forEach((material) => {
        material.emissiveIntensity = 0.85 * glowPulse * neon;
      });

      stemMaterial.emissiveIntensity = 0.65 * glowPulse * neon;
      leafMaterial.emissiveIntensity = 0.5 * glowPulse * neon;
      roseLight.intensity = 2.2 * glowPulse * neon;
      bloomPass.strength = 0.8 * neon;

      for (const petal of petalAnimationsRef.current) {
        petal.mesh.scale.copy(petal.originalScale);
        petal.mesh.scale.z = petal.originalScale.z * thickness;

        if (selectedPetalRef.current === petal.mesh) continue;

        const targetProgress =
          explodedRef.current && !petal.viewed && !petal.returning
            ? 1
            : 0;

        petal.progress = THREE.MathUtils.damp(
          petal.progress,
          targetProgress,
          2.8,
          delta,
        );

        petal.mesh.position.lerpVectors(
          petal.originalPosition,
          petal.targetPosition,
          petal.progress,
        );

        petal.mesh.quaternion.slerpQuaternions(
          petal.originalQuaternion,
          petal.targetQuaternion,
          petal.progress,
        );

        if (
          petal.returning &&
          petal.progress < 0.005 &&
          petal.mesh.position.distanceToSquared(
            petal.originalPosition,
          ) < 0.0001
        ) {
          petal.progress = 0;
          petal.returning = false;
          petal.viewed = true;
          petal.mesh.position.copy(petal.originalPosition);
          petal.mesh.quaternion.copy(petal.originalQuaternion);
        }
      }

      if (
        explodedRef.current &&
        !settingsShownRef.current &&
        petalAnimationsRef.current.length > 0 &&
        petalAnimationsRef.current.every(
          (petal) =>
            petal.viewed &&
            !petal.returning &&
            petal.progress <= 0.02 &&
            petal.mesh.position.distanceToSquared(
              petal.originalPosition,
            ) < 0.0001,
        )
      ) {
        settingsShownRef.current = true;
        setShowSettings(true);
      }

      controls.update();
      composer.render();
    };

    animate();
    resizeObserver.observe(container);

    return () => {
      disposed = true;
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      controls.dispose();

      renderer.domElement.removeEventListener(
        "pointerdown",
        onPointerDown,
      );
      renderer.domElement.removeEventListener(
        "pointerup",
        onPointerUp,
      );
      renderer.domElement.removeEventListener(
        "pointermove",
        onPointerMove,
      );
      renderer.domElement.removeEventListener(
        "pointerleave",
        onPointerLeave,
      );

      model?.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
        }
      });

      stemMaterial.dispose();
      leafMaterial.dispose();
      petalMaterials.forEach((material) => material.dispose());

      starGeometry.dispose();
      starMaterial.dispose();

      composer.dispose();
      renderer.dispose();

      petalAnimationsRef.current = [];
      selectedPetalRef.current = null;

      renderer.domElement.remove();
    };
  }, []);

  const startExperience = () => {
    startedRef.current = true;
    explodedRef.current = true;
    setStarted(true);
  };

  const closeContent = () => {
    const selectedMesh = selectedPetalRef.current;

    const petal = petalAnimationsRef.current.find(
      (item) => item.mesh === selectedMesh,
    );

    if (petal) {
      petal.returning = true;
    }

    selectedPetalRef.current = null;
    setSelectedContent(null);
  };

  const SelectedContentComponent = selectedContent?.value;

  return (
    <main
      ref={containerRef}
      className="fixed inset-0 h-dvh w-screen overflow-hidden bg-[#02030b]"
    >
      {!started && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#02030b]">
          <button
            type="button"
            onClick={startExperience}
            className="rounded-full border border-rose-400/50 bg-rose-950/30 px-12 py-5 text-lg font-semibold text-rose-200 shadow-[0_0_35px_rgba(255,20,95,0.2)] backdrop-blur-md transition hover:scale-105 hover:border-rose-300 hover:bg-rose-900/40 hover:shadow-[0_0_50px_rgba(255,20,95,0.4)] active:scale-95"
          >
            🌹 Xem
          </button>
        </div>
      )}

      {started && (
        <div className="pointer-events-none absolute inset-x-0 top-8 z-10 text-center">
          <p className="text-sm font-medium tracking-[0.2em] text-rose-200/75 drop-shadow-[0_0_8px_rgba(255,50,120,0.65)]">
            Iuu Hoàng Thanh Thảo
          </p>
        </div>
      )}

      {started && showSettings && (
        <section
          aria-label="Điều chỉnh hiệu ứng hoa hồng"
          className="absolute bottom-5 left-5 z-20 w-72 max-w-[calc(100vw-2.5rem)] space-y-5 border border-rose-400/20 bg-[#0b0a19]/90 p-4 shadow-[0_0_30px_rgba(255,20,95,0.12)] backdrop-blur-xl"
        >
          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <label
                htmlFor="neon-brightness"
                className="text-sm font-medium text-rose-100"
              >
                ✨ Độ sáng neon
              </label>

              <output
                htmlFor="neon-brightness"
                className="text-xs tabular-nums text-rose-300"
              >
                {neonBrightness}%
              </output>
            </div>

            <input
              id="neon-brightness"
              type="range"
              min={0}
              max={200}
              step={5}
              value={neonBrightness}
              onChange={(event) =>
                setNeonBrightness(Number(event.target.value))
              }
              className="w-full cursor-pointer accent-rose-400"
            />

            <div className="flex justify-between text-xs text-slate-400">
              <span>Tắt</span>
              <span>Mặc định 70%</span>
              <span>200%</span>
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <label
                htmlFor="petal-thickness"
                className="text-sm font-medium text-rose-100"
              >
                🌸 Độ dày cánh hoa
              </label>

              <output
                htmlFor="petal-thickness"
                className="text-xs tabular-nums text-rose-300"
              >
                {petalThickness}%
              </output>
            </div>

            <input
              id="petal-thickness"
              type="range"
              min={50}
              max={200}
              step={5}
              value={petalThickness}
              onChange={(event) =>
                setPetalThickness(Number(event.target.value))
              }
              className="w-full cursor-pointer accent-rose-400"
            />

            <div className="flex justify-between text-xs text-slate-400">
              <span>Mỏng</span>
              <span>Mặc định</span>
              <span>Dày</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setNeonBrightness(70);
              setPetalThickness(100);
            }}
            className="w-full border border-rose-400/20 px-3 py-2 text-xs font-medium text-rose-200 transition hover:bg-rose-500/10"
          >
            Khôi phục mặc định
          </button>
        </section>
      )}

      {selectedContent && SelectedContentComponent && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#02030b]/65 p-6 backdrop-blur-md">
          <section
            role="dialog"
            aria-modal="true"
            aria-label={selectedContent.title}
            className="max-h-[85dvh] w-full max-w-5xl overflow-y-auto rounded-3xl border border-rose-400/30 bg-[#0b0a19]/95 p-8 shadow-[0_0_55px_rgba(255,20,95,0.2)]"
          >
            <div className="mb-4 text-center text-4xl drop-shadow-[0_0_15px_rgba(255,40,120,0.8)]">
              🌸
            </div>

            <h2 className="mb-5 text-center text-xl font-semibold text-rose-200">
              {selectedContent.title}
            </h2>

            <div className="text-sm leading-6 text-slate-300">
              <SelectedContentComponent />
            </div>

            <button
              type="button"
              onClick={closeContent}
              className="mt-7 w-full rounded-full border border-rose-400/30 bg-rose-600/80 px-7 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(255,20,95,0.25)] transition hover:bg-rose-500 active:scale-95"
            >
              Đóng và tiếp tục
            </button>
          </section>
        </div>
      )}
    </main>
  );
}