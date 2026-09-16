/* Knotiva mascot — built programmatically, named parts, y-up, meters.
   buildKnotiva(THREE) -> { model, parts } */

export function buildKnotiva(THREE) {
  const M = {
    linen:  new THREE.MeshStandardMaterial({ name: 'linen',  color: 0xf2e6d2, roughness: 0.85, metalness: 0 }),
    ink:    new THREE.MeshStandardMaterial({ name: 'ink',    color: 0x2b3a4f, roughness: 0.7,  metalness: 0.05 }),
    rope:   new THREE.MeshStandardMaterial({ name: 'rope',   color: 0xc9a06a, roughness: 0.95, metalness: 0 }),
    brass:  new THREE.MeshStandardMaterial({ name: 'brass',  color: 0xe6bf6a, roughness: 0.35, metalness: 0.35 }),
    blush:  new THREE.MeshStandardMaterial({ name: 'blush',  color: 0xd98c8c, roughness: 0.75, metalness: 0 }),
    jet:    new THREE.MeshStandardMaterial({ name: 'jet',    color: 0x241f1c, roughness: 0.45, metalness: 0 }),
    paper:  new THREE.MeshStandardMaterial({ name: 'paper',  color: 0xfbf7ef, roughness: 0.9,  metalness: 0 })
  };

  const deg = (d) => THREE.MathUtils.degToRad(d);
  function add(parent, name, geo, mat, pos = [0,0,0], rot = [0,0,0], scale = [1,1,1]) {
    const m = new THREE.Mesh(geo, mat);
    m.name = name;
    m.position.set(...pos); m.rotation.set(...rot); m.scale.set(...scale);
    m.castShadow = true; m.receiveShadow = true;
    parent.add(m);
    return m;
  }

  const model = new THREE.Group();
  model.name = 'knotiva_mascot';
  const parts = { legs: {}, arms: {}, forearms: {}, grips: {} };

  /* ---------- legs & shoes (hip-pivoted groups so they can swing) ---------- */
  for (const s of [-1, 1]) {
    const tag = s < 0 ? 'left' : 'right';
    const hip = new THREE.Group();
    hip.name = `leg_${tag}_grp`;
    hip.position.set(s * 0.15, 0.40, 0);
    model.add(hip);
    add(hip, `leg_${tag}`, new THREE.CylinderGeometry(0.085, 0.095, 0.30, 24), M.ink, [0, -0.16, 0]);
    add(hip, `sock_${tag}`, new THREE.TorusGeometry(0.09, 0.022, 12, 28), M.rope, [0, -0.28, 0], [deg(90), 0, 0]);
    add(hip, `shoe_${tag}`, new THREE.SphereGeometry(0.13, 28, 20), M.jet, [0, -0.34, 0.04], [0,0,0], [1, 0.5, 1.5]);
    parts.legs[tag] = hip;
  }

  /* ---------- torso ---------- */
  const torsoProfile = [
    [0.02, 0.00], [0.18, 0.015], [0.255, 0.10], [0.285, 0.26],
    [0.275, 0.40], [0.235, 0.52], [0.185, 0.59], [0.02, 0.62]
  ].map(([r, y]) => new THREE.Vector2(r, y));
  add(model, 'jacket', new THREE.LatheGeometry(torsoProfile, 48), M.ink, [0, 0.36, 0]);
  add(model, 'shirt_front', new THREE.BoxGeometry(0.13, 0.30, 0.09), M.linen, [0, 0.78, 0.215], [deg(-4), 0, 0]);
  add(model, 'button_top', new THREE.SphereGeometry(0.02, 16, 12), M.brass, [0, 0.80, 0.265]);
  add(model, 'button_low', new THREE.SphereGeometry(0.02, 16, 12), M.brass, [0, 0.72, 0.265]);
  add(model, 'lapel_left', new THREE.BoxGeometry(0.10, 0.28, 0.05), M.ink, [-0.105, 0.80, 0.225], [0,0,deg(9)]);
  add(model, 'lapel_right', new THREE.BoxGeometry(0.10, 0.28, 0.05), M.ink, [ 0.105, 0.80, 0.225], [0,0,deg(-9)]);

  /* tool belt — the jack-of-all-trades kit */
  add(model, 'belt', new THREE.TorusGeometry(0.268, 0.040, 14, 48), M.rope, [0, 0.66, 0], [deg(90), 0, 0]);
  add(model, 'belt_buckle', new THREE.BoxGeometry(0.13, 0.10, 0.05), M.brass, [0, 0.66, 0.255]);
  const pouch = new THREE.Group(); pouch.name = 'belt_pouch'; model.add(pouch);
  add(pouch, 'pouch_body', new THREE.BoxGeometry(0.15, 0.17, 0.10), M.rope, [0.24, 0.60, 0.19], [0, deg(-38), 0]);
  add(pouch, 'pouch_flap', new THREE.BoxGeometry(0.16, 0.06, 0.11), M.jet, [0.24, 0.68, 0.19], [0, deg(-38), 0]);
  add(pouch, 'pouch_needle', new THREE.CylinderGeometry(0.008, 0.008, 0.20, 10), M.brass, [0.27, 0.75, 0.21], [deg(10), 0, deg(-14)]);
  add(pouch, 'pouch_brush', new THREE.CylinderGeometry(0.014, 0.014, 0.19, 12), M.jet, [0.20, 0.74, 0.21], [deg(10), 0, deg(8)]);
  add(pouch, 'pouch_brush_tip', new THREE.ConeGeometry(0.022, 0.07, 14), M.blush, [0.205, 0.86, 0.215], [deg(10), 0, deg(8)]);

  /* wax stamp on the other hip */
  add(model, 'wax_stamp_handle', new THREE.CylinderGeometry(0.02, 0.026, 0.13, 16), M.rope, [-0.27, 0.56, 0.16], [0, 0, deg(6)]);
  add(model, 'wax_stamp_head', new THREE.CylinderGeometry(0.055, 0.05, 0.04, 24), M.brass, [-0.275, 0.48, 0.16]);
  add(model, 'wax_seal', new THREE.CylinderGeometry(0.05, 0.05, 0.016, 24), M.blush, [-0.277, 0.455, 0.16]);

  /* ---------- neck, bow tie, head ---------- */
  add(model, 'neck', new THREE.CylinderGeometry(0.095, 0.105, 0.10, 24), M.linen, [0, 1.01, 0]);
  add(model, 'collar', new THREE.TorusGeometry(0.105, 0.028, 12, 32), M.linen, [0, 0.99, 0], [deg(90), 0, 0]);
  add(model, 'bowtie_left',  new THREE.ConeGeometry(0.07, 0.11, 4), M.blush, [-0.10, 1.00, 0.16], [deg(90), 0, deg(90)]);
  add(model, 'bowtie_right', new THREE.ConeGeometry(0.07, 0.11, 4), M.blush, [ 0.10, 1.00, 0.16], [deg(90), 0, deg(-90)]);
  add(model, 'bowtie_knot',  new THREE.SphereGeometry(0.035, 20, 16), M.blush, [0, 1.00, 0.17]);

  const head = new THREE.Group(); head.name = 'head'; head.position.set(0, 1.32, 0); model.add(head);
  parts.head = head;
  add(head, 'head_shape', new THREE.SphereGeometry(0.28, 44, 34), M.linen, [0,0,0], [0,0,0], [1, 0.96, 0.95]);
  for (const s of [-1, 1]) {
    const tag = s < 0 ? 'left' : 'right';
    add(head, `ear_${tag}`, new THREE.SphereGeometry(0.055, 20, 16), M.linen, [s * 0.27, -0.01, 0], [0,0,0], [0.7, 1, 0.8]);
    add(head, `eye_${tag}`, new THREE.SphereGeometry(0.042, 24, 18), M.jet, [s * 0.105, 0.015, 0.245]);
    add(head, `eye_spark_${tag}`, new THREE.SphereGeometry(0.013, 14, 12), M.paper, [s * 0.115, 0.035, 0.275]);
    add(head, `brow_${tag}`, new THREE.BoxGeometry(0.085, 0.018, 0.02), M.jet, [s * 0.11, 0.095, 0.255], [0, 0, s * deg(-9)]);
    add(head, `cheek_${tag}`, new THREE.SphereGeometry(0.05, 20, 16), M.blush, [s * 0.175, -0.055, 0.195], [0,0,0], [1, 0.65, 0.4]);
  }
  add(head, 'nose', new THREE.SphereGeometry(0.036, 20, 16), M.blush, [0, -0.035, 0.268]);
  add(head, 'smile', new THREE.TorusGeometry(0.062, 0.013, 12, 28, Math.PI), M.jet, [0, -0.095, 0.24], [deg(8), 0, Math.PI]);

  const knot = new THREE.Group(); knot.name = 'signature_knot'; knot.position.set(0, 0.28, 0); head.add(knot);
  parts.knot = knot;
  add(knot, 'knot_rope', new THREE.TorusKnotGeometry(0.115, 0.042, 180, 20, 2, 3), M.rope, [0, 0.055, 0], [deg(90), 0, 0]);
  add(knot, 'knot_band', new THREE.TorusGeometry(0.075, 0.016, 12, 32), M.brass, [0, -0.02, 0], [deg(90), 0, 0]);
  add(head, 'hair_fringe', new THREE.SphereGeometry(0.26, 32, 20, 0, Math.PI * 2, 0, deg(58)), M.rope, [0, 0.045, -0.01], [deg(12), 0, 0], [1.03, 1, 1.02]);

  /* ---------- four arms: the all-rounder ---------- */
  function makeArm(key, name, side, shoulder, spread, pitch, twist, fwd) {
    const g = new THREE.Group(); g.name = name;
    g.position.set(...shoulder);
    g.rotation.set(deg(fwd), 0, side * deg(spread));
    model.add(g);
    add(g, `${name}_shoulder`, new THREE.SphereGeometry(0.085, 22, 18), M.ink, [0, 0, 0]);
    add(g, `${name}_upper`, new THREE.CylinderGeometry(0.072, 0.062, 0.24, 20), M.ink, [0, -0.13, 0]);
    add(g, `${name}_elbow`, new THREE.SphereGeometry(0.068, 20, 16), M.ink, [0, -0.26, 0]);
    const fg = new THREE.Group(); fg.name = `${name}_forearm_grp`;
    fg.position.set(0, -0.26, 0);
    fg.rotation.set(deg(pitch), 0, side * deg(twist));
    g.add(fg);
    add(fg, `${name}_forearm`, new THREE.CylinderGeometry(0.058, 0.05, 0.22, 20), M.ink, [0, -0.11, 0]);
    add(fg, `${name}_cuff`, new THREE.TorusGeometry(0.055, 0.018, 12, 26), M.linen, [0, -0.21, 0], [deg(90), 0, 0]);
    add(fg, `${name}_hand`, new THREE.SphereGeometry(0.072, 22, 18), M.linen, [0, -0.28, 0], [0,0,0], [1, 1.1, 0.9]);
    add(fg, `${name}_thumb`, new THREE.SphereGeometry(0.028, 14, 12), M.linen, [side * 0.055, -0.25, 0.03]);
    const anchor = new THREE.Group(); anchor.name = `${name}_grip`;
    anchor.position.set(0, -0.31, 0.02);
    fg.add(anchor);
    parts.arms[key] = g; parts.forearms[key] = fg; parts.grips[key] = anchor;
    return anchor;
  }

  const gripUR = makeArm('ur', 'arm_upper_right',  1, [ 0.26, 0.91, 0.01],  24, -56,  12, -12);
  const gripUL = makeArm('ul', 'arm_upper_left',  -1, [-0.26, 0.91, 0.01],  24, -56,  12, -12);
  const gripLR = makeArm('lr', 'arm_lower_right',  1, [ 0.27, 0.64, 0.00],  20, -16,  46, -8);
  const gripLL = makeArm('ll', 'arm_lower_left',  -1, [-0.27, 0.64, 0.00],  20, -16,  46, -8);

  /* quill pen — upper right hand */
  const quill = new THREE.Group(); quill.name = 'quill'; quill.rotation.set(deg(70), 0, deg(-22)); gripUR.add(quill);
  add(quill, 'quill_shaft', new THREE.CylinderGeometry(0.012, 0.008, 0.30, 14), M.paper, [0, 0.09, 0]);
  add(quill, 'quill_nib', new THREE.ConeGeometry(0.016, 0.07, 14), M.brass, [0, -0.09, 0], [Math.PI, 0, 0]);
  add(quill, 'quill_feather', new THREE.SphereGeometry(0.05, 22, 16), M.paper, [0.015, 0.26, 0], [0, 0, deg(-8)], [0.5, 2.6, 0.16]);
  add(quill, 'quill_ink_ring', new THREE.TorusGeometry(0.014, 0.006, 10, 20), M.blush, [0, -0.04, 0], [deg(90), 0, 0]);

  /* the wedding invitation — upper left hand */
  const card = new THREE.Group(); card.name = 'wedding_invitation'; card.rotation.set(deg(96), deg(-10), deg(8)); gripUL.add(card);
  parts.card = card;
  add(card, 'invitation_card', new THREE.BoxGeometry(0.30, 0.40, 0.010), M.paper, [0.02, 0.13, 0]);
  add(card, 'invitation_border', new THREE.BoxGeometry(0.26, 0.36, 0.008), M.brass, [0.02, 0.13, -0.005]);
  add(card, 'invitation_knot', new THREE.TorusKnotGeometry(0.038, 0.012, 120, 14, 2, 3), M.blush, [0.02, 0.20, 0.012], [deg(90), 0, 0]);
  add(card, 'invitation_line_1', new THREE.BoxGeometry(0.18, 0.016, 0.004), M.ink, [0.02, 0.10, 0.010]);
  add(card, 'invitation_line_2', new THREE.BoxGeometry(0.13, 0.012, 0.004), M.ink, [0.02, 0.065, 0.010]);
  add(card, 'invitation_line_3', new THREE.BoxGeometry(0.16, 0.012, 0.004), M.ink, [0.02, 0.03, 0.010]);
  add(card, 'invitation_ribbon', new THREE.TorusGeometry(0.05, 0.011, 10, 26, Math.PI), M.blush, [0.02, -0.02, 0.012], [0, 0, Math.PI]);

  /* scissors — lower right hand */
  const scissors = new THREE.Group(); scissors.name = 'scissors'; scissors.rotation.set(deg(6), 0, deg(84)); gripLR.add(scissors);
  add(scissors, 'scissor_blade_a', new THREE.BoxGeometry(0.022, 0.24, 0.006), M.brass, [0.013, 0.11, 0.004], [0, 0, deg(7)]);
  add(scissors, 'scissor_blade_b', new THREE.BoxGeometry(0.022, 0.24, 0.006), M.brass, [-0.013, 0.11, -0.004], [0, 0, deg(-7)]);
  add(scissors, 'scissor_pivot', new THREE.SphereGeometry(0.022, 18, 14), M.jet, [0, 0.0, 0]);
  add(scissors, 'scissor_ring_a', new THREE.TorusGeometry(0.042, 0.012, 12, 26), M.ink, [0.045, -0.10, 0.004], [0, 0, deg(18)]);
  add(scissors, 'scissor_ring_b', new THREE.TorusGeometry(0.042, 0.012, 12, 26), M.ink, [-0.045, -0.10, -0.004], [0, 0, deg(-18)]);

  /* ribbon spool — lower left hand */
  const spool = new THREE.Group(); spool.name = 'ribbon_spool'; spool.rotation.set(deg(6), 0, deg(-84)); gripLL.add(spool);
  add(spool, 'spool_core', new THREE.CylinderGeometry(0.072, 0.072, 0.07, 32), M.blush, [0, 0, 0]);
  add(spool, 'spool_flange_top', new THREE.CylinderGeometry(0.085, 0.085, 0.012, 32), M.rope, [0, 0.04, 0]);
  add(spool, 'spool_flange_bottom', new THREE.CylinderGeometry(0.085, 0.085, 0.012, 32), M.rope, [0, -0.04, 0]);
  add(spool, 'spool_pin', new THREE.CylinderGeometry(0.014, 0.014, 0.12, 14), M.brass, [0, 0, 0]);
  add(spool, 'ribbon_tail_a', new THREE.BoxGeometry(0.045, 0.004, 0.16), M.blush, [0.06, 0.0, 0.10], [deg(14), 0, 0]);
  add(spool, 'ribbon_tail_b', new THREE.BoxGeometry(0.045, 0.004, 0.13), M.blush, [0.055, 0.0, 0.24], [deg(-26), 0, 0]);

  return { model, parts, materials: M };
}
