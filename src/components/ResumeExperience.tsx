import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export type ExperienceItem = {
  company: string;
  role: string;
  period: string;
  location?: string;
  highlights: string[];
};

/**
 * 工作经历，用 Accordion 折叠。
 *
 * 必须整体放在一个 .tsx 里：AccordionItem/Trigger/Panel 都依赖 Base UI Accordion
 * 的 context，拆到 .astro 里会直接抛错。
 */
export default function ResumeExperience({ items }: { items: ExperienceItem[] }) {
  // 默认全部展开，避免访客还要逐条点开
  const defaultOpen = items.map((_, index) => `experience-${index}`);

  return (
    <Accordion defaultValue={defaultOpen}>
      {items.map((job, index) => (
        <AccordionItem key={`${job.company}-${index}`} value={`experience-${index}`}>
          <AccordionTrigger>
            <div className="flex flex-1 flex-col gap-0.5 pr-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
              <span className="font-medium">{job.company}</span>
              <span className="text-xs font-normal text-muted-foreground">
                {job.role} · {job.period}
                {job.location ? ` · ${job.location}` : ''}
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <ul className="flex flex-col gap-2 leading-relaxed">
              {job.highlights.map((line) => (
                <li key={line} className="flex gap-2">
                  <span className="mt-2 size-1 shrink-0 rounded-full bg-muted-foreground" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
