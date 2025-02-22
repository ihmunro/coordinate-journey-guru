
import { Coordinate, formatDistance, formatTime } from '../utils/coordinates';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface RouteResultsProps {
  coordinates: Coordinate[];
  distances: number[];
  times: number[];
  totalDistance: number;
  totalTime: number;
}

const RouteResults: React.FC<RouteResultsProps> = ({
  coordinates,
  distances,
  times,
  totalDistance,
  totalTime,
}) => {
  return (
    <div className="space-y-6 animate-slideUp">
      <Card className="glass">
        <CardHeader>
          <CardTitle>Route Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Distance</p>
              <p className="text-2xl font-semibold">{formatDistance(totalDistance)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Time</p>
              <p className="text-2xl font-semibold">{formatTime(totalTime)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass">
        <CardHeader>
          <CardTitle>Route Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {coordinates.map((coord, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Point {index + 1}</span>
                    <span className="text-sm text-muted-foreground">
                      {coord.lat.toFixed(4)}°, {coord.lng.toFixed(4)}°
                    </span>
                  </div>
                  {index < coordinates.length - 1 && (
                    <div className="pl-4 border-l-2 border-muted py-2 space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Distance:</span>
                        <span>{formatDistance(distances[index])}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Time:</span>
                        <span>{formatTime(times[index])}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default RouteResults;
