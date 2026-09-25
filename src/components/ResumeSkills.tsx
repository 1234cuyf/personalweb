import { Badge } from '@/components/ui/badge';
import {
  Progress,
  ProgressValue,
} from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export type SkillGroup = {
  group: string;
  items: string[];
  /** 熟练度 0-100，留空则显示「—」 */
  level?: number;
};

/**
 * 简历的技能表。
 *
 * 必须整体放在一个 .tsx 里：ProgressLabel/ProgressValue 依赖 Base UI Progress 的
 * context，拆到 .astro 里会抛 useProgressRootContext 错误。
 */
export default function ResumeSkills({ groups }: { groups: SkillGroup[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-28">分组</TableHead>
          <TableHead>技能</TableHead>
          <TableHead className="w-36">熟练度</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {groups.map((group) => (
          <TableRow key={group.group}>
            <TableCell className="align-top font-medium">{group.group}</TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <Badge key={item} variant="secondary">
                    {item}
                  </Badge>
                ))}
              </div>
            </TableCell>
            <TableCell>
              {typeof group.level === 'number' ? (
                <Progress value={group.level}>
                  <ProgressValue />
                </Progress>
              ) : (
                <span className="text-xs text-muted-foreground">—</span>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
