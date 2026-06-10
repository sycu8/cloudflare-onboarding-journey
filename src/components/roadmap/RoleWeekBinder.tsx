import { useEffect } from 'react';
import { bindRoleWeekToggles } from './RoleRoadmapProgress';

type Props = { roleId: string };

export default function RoleWeekBinder({ roleId }: Props) {
  useEffect(() => {
    bindRoleWeekToggles(roleId);
  }, [roleId]);
  return null;
}
