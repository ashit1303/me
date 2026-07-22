import * as THREE from 'three';
import { appState } from './state.js';

export function setupRocket() {
  appState.rocketGroup = new THREE.Group();
  appState.flameGroup = new THREE.Group();

  const rocketCfg = appState.configData?.rocket || {};
  const bodyColor = new THREE.Color(rocketCfg.bodyColor || '#ffffffff');
  const finColor = new THREE.Color(rocketCfg.finColor || '#cc2233');
  const windowColor = new THREE.Color(rocketCfg.windowColor || '#4499dd');
  const exhaustColorVal = new THREE.Color(rocketCfg.exhaustColor || '#ff6a00');

  // ── Main Fuselage (classic tapered cylinder) ──
  const bodyGeo = new THREE.CylinderGeometry(0.5, 0.65, 3.2, 32);
  const bodyMat = new THREE.MeshStandardMaterial({ color: bodyColor, roughness: 0.12, metalness: 0.85 });
  appState.rocketGroup.add(new THREE.Mesh(bodyGeo, bodyMat));

  // ── Nose Cone (red, pointed) ──
  const noseGeo = new THREE.ConeGeometry(0.5, 1.8, 32);
  const noseMat = new THREE.MeshStandardMaterial({ color: finColor, roughness: 0.15, metalness: 0.7 });
  const nose = new THREE.Mesh(noseGeo, noseMat);
  nose.position.y = 2.5;
  appState.rocketGroup.add(nose);

  // ── Red Stripe Bands ──
  const stripeMat = new THREE.MeshStandardMaterial({ color: finColor, roughness: 0.15, metalness: 0.7 });

  const stripe1 = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.045, 8, 32), stripeMat);
  stripe1.position.y = 0.8;
  stripe1.rotation.x = Math.PI / 2;
  appState.rocketGroup.add(stripe1);

  const stripe2 = new THREE.Mesh(new THREE.TorusGeometry(0.61, 0.045, 8, 32), stripeMat);
  stripe2.position.y = -0.6;
  stripe2.rotation.x = Math.PI / 2;
  appState.rocketGroup.add(stripe2);

  // ── Cabin Window (single large blue porthole) ──
  const windowMat = new THREE.MeshStandardMaterial({
    color: windowColor, emissive: windowColor, emissiveIntensity: 0.6,
    roughness: 0.05, metalness: 0.3
  });

  // Window rim (silver ring)
  const rimMat = new THREE.MeshStandardMaterial({ color: 0xaaaabb, roughness: 0.2, metalness: 0.9 });
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.04, 12, 24), rimMat);
  rim.position.set(0, 0.2, 0.57);
  appState.rocketGroup.add(rim);

  // Window glass (blue disc)
  const cabinWindow = new THREE.Mesh(new THREE.CircleGeometry(0.24, 24), windowMat);
  cabinWindow.position.set(0, 0.2, 0.58);
  appState.rocketGroup.add(cabinWindow);

  // ── 3 Large Swept-Back Fins ──
  const finShape = new THREE.Shape();
  finShape.moveTo(0, 0);
  finShape.lineTo(0, -1.2);
  finShape.lineTo(0.85, -1.5);
  finShape.lineTo(0.2, -0.5);
  finShape.closePath();

  const finGeo = new THREE.ExtrudeGeometry(finShape, {
    depth: 0.08,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.02,
    bevelSegments: 2
  });
  const finMat = new THREE.MeshStandardMaterial({ color: finColor, roughness: 0.15, metalness: 0.8 });

  for (let i = 0; i < 3; i++) {
    const fin = new THREE.Mesh(finGeo, finMat);
    const angle = (i * Math.PI * 2) / 3;
    fin.position.y = -0.2;
    fin.position.x = Math.cos(angle) * 0.6;
    fin.position.z = Math.sin(angle) * 0.6;
    fin.rotation.y = -angle;
    appState.rocketGroup.add(fin);
  }

  // ── Main Nozzle ──
  const nozzleMat = new THREE.MeshStandardMaterial({ color: 0x333344, roughness: 0.4, metalness: 0.95 });
  const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.25, 0.4, 16), nozzleMat);
  nozzle.position.y = -1.8;
  appState.rocketGroup.add(nozzle);

  // ── Exhaust Ring (Glowing torus at nozzle mouth) ──
  const exhaustRingGeo = new THREE.TorusGeometry(0.33, 0.04, 12, 32);
  const exhaustRingMat = new THREE.MeshBasicMaterial({
    color: exhaustColorVal, transparent: true, opacity: 0.85
  });
  const exhaustRing = new THREE.Mesh(exhaustRingGeo, exhaustRingMat);
  exhaustRing.position.y = -2.0;
  exhaustRing.rotation.x = Math.PI / 2;
  appState.rocketGroup.add(exhaustRing);

  // ── Layered Flame Cones ──
  const innerFlameGeo = new THREE.ConeGeometry(0.2, 1.8, 12, 1, true);
  const innerFlameMat = new THREE.MeshBasicMaterial({
    color: 0xffffcc, transparent: true, opacity: 0.85, side: THREE.DoubleSide
  });
  const innerFlame = new THREE.Mesh(innerFlameGeo, innerFlameMat);
  innerFlame.position.y = -3.0;
  innerFlame.rotation.x = Math.PI;
  appState.flameGroup.add(innerFlame);

  const midFlameGeo = new THREE.ConeGeometry(0.35, 2.6, 12, 1, true);
  const midFlameMat = new THREE.MeshBasicMaterial({
    color: 0xff8800, transparent: true, opacity: 0.5, side: THREE.DoubleSide
  });
  const midFlame = new THREE.Mesh(midFlameGeo, midFlameMat);
  midFlame.position.y = -3.4;
  midFlame.rotation.x = Math.PI;
  appState.flameGroup.add(midFlame);

  const outerFlameGeo = new THREE.ConeGeometry(0.5, 3.5, 12, 1, true);
  const outerFlameMat = new THREE.MeshBasicMaterial({
    color: 0xff3300, transparent: true, opacity: 0.2, side: THREE.DoubleSide
  });
  const outerFlame = new THREE.Mesh(outerFlameGeo, outerFlameMat);
  outerFlame.position.y = -3.8;
  outerFlame.rotation.x = Math.PI;
  appState.flameGroup.add(outerFlame);

  appState.rocketGroup.add(appState.flameGroup);

  appState.rocketGroup.position.set(0, 0, 0);
  appState.scene.add(appState.rocketGroup);
}

export function createExhaustParticle() {
  const mappedSpeed = appState.currentSpeed * 0.7;
  const count = Math.max(1, Math.floor(mappedSpeed / 2.5));
  const rocketCfg = appState.configData?.rocket || {};
  const exhaustColor = new THREE.Color(rocketCfg.exhaustColor || '#ff6a00');

  // Single main nozzle exhaust only (no side boosters)
  const spawnPoint = { x: 0, y: -2.2, z: 0, ringR: 0.3, spread: 0.2 };

  for (let k = 0; k < count; k++) {
    const size = 0.06 + Math.random() * 0.1;
    const geo = new THREE.SphereGeometry(size, 4, 4);

    const ringAngle = Math.random() * Math.PI * 2;
    const ringOffset = spawnPoint.ringR * (0.5 + Math.random() * 0.5);

    const colorMix = Math.random();
    const particleColor = exhaustColor.clone();
    if (colorMix > 0.6) particleColor.lerp(new THREE.Color(0xffff44), 0.5);
    if (colorMix > 0.85) particleColor.lerp(new THREE.Color(0xffffff), 0.4);

    const mat = new THREE.MeshBasicMaterial({ color: particleColor, transparent: true, opacity: 0.9 });
    const mesh = new THREE.Mesh(geo, mat);

    mesh.position.set(
      spawnPoint.x + Math.cos(ringAngle) * ringOffset + (Math.random() - 0.5) * spawnPoint.spread,
      spawnPoint.y,
      spawnPoint.z + Math.sin(ringAngle) * ringOffset + (Math.random() - 0.5) * spawnPoint.spread
    );

    const velocity = new THREE.Vector3(
      (Math.random() - 0.5) * 0.12 + Math.cos(ringAngle) * 0.05,
      -(1.0 + Math.random() * (0.6 + mappedSpeed * 0.06)),
      (Math.random() - 0.5) * 0.12 + Math.sin(ringAngle) * 0.05
    );

    appState.cometParticles.push({ mesh, velocity, age: 0, maxAge: 16 + Math.random() * 10, type: 'exhaust' });
    appState.scene.add(mesh);
  }
}

export function updateRocketAnimation(elapsed) {
  if (appState.rocketGroup) {
    if (appState.rocketState === 'idle') {
      appState.rocketGroup.position.x = 0;
      appState.rocketGroup.position.z = 0;
      appState.rocketGroup.position.y = Math.sin(elapsed * 1.5) * 0.08;
      appState.rocketGroup.rotation.x *= 0.9;
      appState.rocketGroup.rotation.z *= 0.9;
      appState.rocketGroup.rotation.y = Math.sin(elapsed * 0.3) * 0.04;
      appState.cameraFollowTarget.set(0, 0, 0);
    } else if (appState.rocketState === 'traveling' && appState.selectedSystem) {
      const sysPos = appState.selectedSystem.group.position;
      const orbitRadius = appState.selectedSystem.planetMeshes.length * 1.2 + 5;
      const targetPos = new THREE.Vector3(sysPos.x + orbitRadius, sysPos.y, sysPos.z);

      appState.rocketGroup.position.lerp(targetPos, 0.05);
      const dir = targetPos.clone().sub(appState.rocketGroup.position).normalize();

      if (appState.rocketGroup.position.distanceTo(targetPos) < 1.0) {
        appState.rocketState = 'orbiting';
      } else if (dir.lengthSq() > 0.001) {
        const up = new THREE.Vector3(0, 1, 0);
        const targetQuat = new THREE.Quaternion().setFromUnitVectors(up, dir);
        appState.rocketGroup.quaternion.slerp(targetQuat, 0.1);
      }
      appState.cameraFollowTarget.copy(sysPos);
    } else if (appState.rocketState === 'orbiting' && appState.selectedSystem) {
      const sysPos = appState.selectedSystem.group.position;
      const orbitRadiusX = appState.selectedSystem.planetMeshes.length * 1.2 + 5;
      const orbitRadiusZ = orbitRadiusX * 0.8;

      appState.rocketOrbitAngle += 0.02;

      const nextPos = new THREE.Vector3(
        sysPos.x + Math.cos(appState.rocketOrbitAngle) * orbitRadiusX,
        sysPos.y,
        sysPos.z + Math.sin(appState.rocketOrbitAngle) * orbitRadiusZ
      );

      const currentPos = appState.rocketGroup.position.clone();
      appState.rocketGroup.position.copy(nextPos);

      const dir = nextPos.clone().sub(currentPos).normalize();
      if (dir.lengthSq() > 0.001) {
        const up = new THREE.Vector3(0, 1, 0);
        const targetQuat = new THREE.Quaternion().setFromUnitVectors(up, dir);
        appState.rocketGroup.quaternion.slerp(targetQuat, 0.2);
      }
      appState.cameraFollowTarget.copy(sysPos);
    } else if (appState.rocketState === 'returning') {
      const targetPos = new THREE.Vector3(0, 0, 0);
      appState.rocketGroup.position.lerp(targetPos, 0.05);

      const dir = targetPos.clone().sub(appState.rocketGroup.position).normalize();
      if (appState.rocketGroup.position.distanceTo(targetPos) < 1.0) {
        appState.rocketState = 'idle';
      } else if (dir.lengthSq() > 0.001) {
        const up = new THREE.Vector3(0, 1, 0);
        const targetQuat = new THREE.Quaternion().setFromUnitVectors(up, dir);
        appState.rocketGroup.quaternion.slerp(targetQuat, 0.1);
      }
      appState.cameraFollowTarget.copy(appState.rocketGroup.position);
    }

    if (appState.currentSpeed > 0) createExhaustParticle();
  }

  const mappedSpeed = appState.currentSpeed * 0.7;
  if (appState.flameGroup) {
    const speedFactor = mappedSpeed / 20;
    const pulse = 0.85 + Math.sin(elapsed * 12) * 0.15;
    const flameScale = (0.4 + speedFactor * 0.6) * pulse;

    appState.flameGroup.children.forEach(child => {
      child.scale.set(flameScale, flameScale * (0.8 + speedFactor * 0.5), flameScale);
      child.material.opacity = child.material.opacity > 0.5
        ? (0.5 + speedFactor * 0.4) * pulse
        : (0.15 + speedFactor * 0.15) * pulse;
    });

    appState.flameGroup.rotation.y = elapsed * 3;
  }
}
