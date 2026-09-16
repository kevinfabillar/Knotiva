import { buildKnotiva } from '../lib/knotiva-model.js';

const ASK = 'Looking for a wedding invitation?';
const PITCH =
  'I letter it, print it, seal it and tie the bow — all of it, myself. One pair of hands was never going to cut it.';

const START_X = -1.15;
const END_X = 0.06;

const ease = (t) => t * t * (3 - 2 * t);
const clamp01 = (t) => Math.min(1, Math.max(0, t));

/**
 * Knotiva walks in, turns, waves and types out her pitch.
 * `embed` holds on the finished pitch; otherwise the whole thing loops.
 */
export function startWalkIn(THREE, stage, { embed = false, bubble, askEl, pitchEl } = {}) {
  const deg = (d) => THREE.MathUtils.degToRad(d);
  const lerp = THREE.MathUtils.lerp;

  if (embed) {
    if (stage._toolbar) stage._toolbar.style.display = 'none';
    if (stage._controls) {
      stage._controls.enabled = false;
      stage._controls.autoRotate = false;
    }
    if (stage._renderer) stage._renderer.domElement.style.pointerEvents = 'none';
    stage.shadowRoot?.querySelectorAll('.note, .toolbar').forEach((n) => (n.style.display = 'none'));
  }

  const { model, parts } = buildKnotiva(THREE);
  const rig = new THREE.Group();
  rig.name = 'rig';
  rig.add(model);

  const root = new THREE.Group();
  root.name = 'knotiva_scene';
  root.add(rig);
  // Invisible volume so the stage frames the whole walk path, not just the body.
  const framing = new THREE.Mesh(new THREE.BoxGeometry(2.15, 1.86, 0.6), new THREE.MeshBasicMaterial());
  framing.name = 'framing_volume';
  framing.visible = false;
  framing.position.set(-0.42, 0.93, 0);
  root.add(framing);
  stage.setObject(root);

  // rest pose, captured so every phase blends back to it
  const REST = {};
  for (const k of ['ur', 'ul', 'lr', 'll']) {
    REST[k] = { arm: parts.arms[k].rotation.clone(), fore: parts.forearms[k].rotation.clone() };
  }
  const HEAD_Y = parts.head.position.y;

  const T = embed
    ? { walk: 3.3, turn: 4.1, wave: 5.6, type: 4.5, hold: 13.5, loop: 15.2 }
    : { walk: 3.3, turn: 4.1, wave: 5.6, type: 4.5, hold: 11.8, loop: 13.2 };

  const caret = document.createElement('span');
  caret.className = 'knotiva-caret';

  let t0 = performance.now() / 1000;
  const replay = () => {
    t0 = performance.now() / 1000;
  };

  const onMessage = (e) => {
    if (e && e.data === 'knotiva:replay') replay();
  };
  if (embed) window.addEventListener('message', onMessage);

  const headPos = new THREE.Vector3();
  function placeBubble() {
    parts.head.getWorldPosition(headPos);
    headPos.y += 0.34;
    headPos.x += 0.22;
    const p = headPos.clone().project(stage._camera);
    const w = stage.clientWidth;
    const h = stage.clientHeight;
    const x = (p.x * 0.5 + 0.5) * w;
    const y = (-p.y * 0.5 + 0.5) * h;
    const bw = bubble.offsetWidth;
    const bh = bubble.offsetHeight;
    bubble.style.left = `${Math.round(Math.min(Math.max(12, x + 26), Math.max(12, w - bw - 16)))}px`;
    bubble.style.top = `${Math.round(Math.max(12, y - bh - 14))}px`;
  }

  let raf;
  function frame() {
    const t = performance.now() / 1000 - t0;
    const tt = embed ? Math.min(t, T.hold - 0.01) : t % T.loop;

    // locomotion
    const wp = clamp01(tt / T.walk);
    rig.position.x = lerp(START_X, END_X, ease(wp));

    const striding = tt < T.walk ? 1 : clamp01(1 - (tt - T.walk) / 0.45);
    const cycle = tt * 7.6;
    const swing = Math.sin(cycle) * 0.58 * striding;
    parts.legs.right.rotation.x = swing;
    parts.legs.left.rotation.x = -swing;
    const bob = Math.abs(Math.cos(cycle)) * 0.035 * striding;
    rig.position.y = bob;
    rig.rotation.z = Math.sin(cycle) * 0.022 * striding;

    // turn to camera after the walk
    const turn = 1 - clamp01((tt - T.walk) / (T.turn - T.walk));
    rig.rotation.y = deg(72) * ease(turn);

    // arms: swing while walking, wave after the turn
    const waveIn = clamp01((tt - T.turn + 0.15) / 0.45);
    const waveOut = clamp01((tt - T.wave) / 0.6);
    const waving = ease(waveIn) * (1 - ease(waveOut));
    const flap = Math.sin((tt - T.turn) * 13) * 0.34;

    parts.arms.ur.rotation.x = lerp(REST.ur.arm.x + swing * 0.5 * striding, deg(-4), waving);
    parts.arms.ur.rotation.z = lerp(REST.ur.arm.z, deg(132), waving);
    parts.forearms.ur.rotation.z = REST.ur.fore.z + flap * waving;
    parts.forearms.ur.rotation.x = lerp(REST.ur.fore.x, deg(-22), waving);

    parts.arms.ul.rotation.x = REST.ul.arm.x - swing * 0.5 * striding;
    parts.arms.lr.rotation.x = REST.lr.arm.x - swing * 0.35 * striding;
    parts.arms.ll.rotation.x = REST.ll.arm.x + swing * 0.35 * striding;
    // the invitation gets lifted a touch while he pitches
    parts.arms.ul.rotation.z = lerp(REST.ul.arm.z, REST.ul.arm.z - deg(14), waving);

    // head: look ahead while walking, at you afterwards, with a breath
    const breathe = Math.sin(tt * 1.9) * 0.012;
    parts.head.position.y = HEAD_Y + breathe + bob * 0.2;
    parts.head.rotation.y = deg(-26) * ease(turn);
    parts.head.rotation.z = deg(6) * waving;
    parts.knot.rotation.z = Math.sin(cycle) * 0.12 * striding + Math.sin(tt * 2.4) * 0.05;

    // speech bubble
    const popIn = clamp01((tt - T.type) / 0.36);
    const fadeOut = embed ? 0 : clamp01((tt - T.hold) / 0.8);
    const vis = ease(popIn) * (1 - ease(fadeOut));
    bubble.style.opacity = vis.toFixed(3);
    bubble.style.transform = `scale(${(0.78 + 0.22 * ease(popIn)).toFixed(3)})`;

    const typed = Math.max(0, tt - T.type - 0.25) * 34;
    const a = Math.min(ASK.length, Math.round(typed));
    const b = Math.min(PITCH.length, Math.round(typed - ASK.length - 6));
    askEl.textContent = ASK.slice(0, a);
    pitchEl.textContent = b > 0 ? PITCH.slice(0, b) : '';
    const target = b > 0 ? pitchEl : askEl;
    if (vis > 0.2 && b < PITCH.length) target.appendChild(caret);
    else if (caret.parentNode) caret.remove();

    placeBubble();
    raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);

  return {
    replay,
    stop() {
      cancelAnimationFrame(raf);
      if (embed) window.removeEventListener('message', onMessage);
    },
  };
}
