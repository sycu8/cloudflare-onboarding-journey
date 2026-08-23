import type { RoleId } from '../../types/roadmap';
import { startRoleRoadmap } from './RoleRoadmapProgress';

type Props = {
  roleId: RoleId;
  firstStepId: string;
};

export default function RoleRoadmapStartButton({ roleId, firstStepId }: Props) {
  return (
    <button
      type="button"
      className="btn btn-primary"
      onClick={() => startRoleRoadmap(roleId, firstStepId)}
    >
      <span className="lang-vi">Bắt đầu roadmap này</span>
      <span className="lang-en">Start this roadmap</span>
      <span className="lang-km">ចាប់ផ្តើម roadmap</span>
    </button>
  );
}
