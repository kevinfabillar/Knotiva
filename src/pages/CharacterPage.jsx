import ThreeDStage from '../components/ThreeDStage.jsx';
import { buildKnotiva } from '../lib/knotiva-model.js';

export default function CharacterPage() {
  return (
    <ThreeDStage
      name="knotiva-mascot"
      background="#f4f0e9"
      autorotate
      onReady={(stage, THREE) => stage.setObject(buildKnotiva(THREE).model)}
      style={{ display: 'block', width: '100vw', height: '100vh' }}
    />
  );
}
