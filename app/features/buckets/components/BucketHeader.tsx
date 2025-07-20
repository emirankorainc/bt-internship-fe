import { ArrowLeft, Edit2, ChevronRight, Award, Target, Clock } from 'lucide-react';
import { Button } from '@app/components/ui/button';
import { Separator } from '@app/components/ui/separator';
import { AbilityContext, Can } from '@app/casl/AbilityContext';
import { useAbility } from '@casl/react';

interface BucketHeaderProps {
  title: string;
  description?: string;
  totalLevels?: number;
  onNavigateBack: () => void;
  breadcrumb?: string;
  onOpenUpdateBucket?: () => void;
}

export const BucketHeader = ({
  title,
  description,
  totalLevels,
  onNavigateBack,
  breadcrumb = 'Buckets',
  onOpenUpdateBucket,
}: BucketHeaderProps) => {
  const ability = useAbility(AbilityContext);

  return (
    <div className="bg-card border-b shadow-sm mb-6 sm:mb-8">
      <div className="flex items-center justify-between p-4 sm:p-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onNavigateBack} className="hover:bg-accent">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <span>{breadcrumb}</span>
            {title && (
              <>
                <ChevronRight className="h-4 w-4" />
                <span className="text-foreground font-medium">{title}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {title && (
        <div className="px-4 pb-4 sm:px-6 sm:pb-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 rounded-lg p-2">
                <Award className="text-primary h-6 w-6" />
              </div>
              <div>
                <h1 className="text-foreground text-2xl font-bold sm:text-3xl">{title}</h1>
                <p className="text-muted-foreground mt-1">{description}</p>
              </div>
            </div>
            <Can I="update" a="BucketCategory" ability={ability}>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onOpenUpdateBucket}>
                <Edit2 className="h-4 w-4" />
              </Button>
            </Can>
          </div>

          <div className="text-muted-foreground flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Target className="h-4 w-4" />
              <span>{totalLevels} Levels</span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>Progressive Development Path</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
