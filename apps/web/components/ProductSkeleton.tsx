import { Skeleton } from './ui/skeleton';
import { Card, CardContent, CardFooter } from './ui/card';

export default function ProductSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-square">
        <Skeleton className="h-full w-full" />
      </div>
      
      <CardContent className="p-4">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-2/3 mb-3" />
        
        <div className="flex items-center justify-between mb-3">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <div className="flex w-full gap-2">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-10" />
        </div>
      </CardFooter>
    </Card>
  );
}
