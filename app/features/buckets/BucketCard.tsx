import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface TempBucket {
  title: string;
  description: string;
  levels: string[];
}

export const BucketCard = ({ bucket }: { bucket: TempBucket }) => {
  const { title, description, levels } = bucket;
  const navigate = useNavigate();

  return (
    <Card
      className="w-full max-w-xs rounded-3xl border-2 p-2"
      onClick={() => navigate(title)}
    >
      <CardHeader className="pb-2">
        <h2 className="text-xl font-bold tracking-tight">{title}</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-muted-foreground space-y-2 text-sm">
          <p>{description}</p>
        </div>

        <div className="flex gap-2 pt-2">
          {levels.map((level) => (
            <Badge variant="outline" className="rounded-md" key={level}>
              {level}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full rounded-md">
          Edit Bucket
        </Button>
      </CardFooter>
    </Card>
  );
};
