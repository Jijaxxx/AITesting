import { Progress } from '@radix-ui/react-progress';

interface ReadingProgressProps {
  value: number;
  max: number;
}

export default function ReadingProgress({ value, max }: ReadingProgressProps) {
  const progress = Math.round((value / max) * 100);

  return (
    <Progress.Root
      className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200"
      style={{
        transform: 'translateZ(0)',
      }}
      value={progress}
    >
      <Progress.Indicator
        className="h-full w-full bg-primary-600 transition-transform duration-500"
        style={{ transform: `translateX(-${100 - progress}%)` }}
      />
    </Progress.Root>
  );
}