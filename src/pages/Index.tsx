
import { useState } from 'react';
import CoordinateForm from '@/components/CoordinateForm';
import RouteResults from '@/components/RouteResults';
import { Coordinate, Direction, calculateDistance, calculateTime, sortCoordinates } from '@/utils/coordinates';

const Index = () => {
  const [results, setResults] = useState<{
    coordinates: Coordinate[];
    distances: number[];
    times: number[];
    totalDistance: number;
    totalTime: number;
  } | null>(null);

  const handleSubmit = (coordinates: Coordinate[], direction: Direction) => {
    const sortedCoordinates = sortCoordinates(coordinates, direction);
    const distances: number[] = [];
    const times: number[] = [];
    let totalDistance = 0;

    for (let i = 0; i < sortedCoordinates.length - 1; i++) {
      const distance = calculateDistance(sortedCoordinates[i], sortedCoordinates[i + 1]);
      const time = calculateTime(distance);
      
      distances.push(distance);
      times.push(time);
      totalDistance += distance;
    }

    const totalTime = times.reduce((acc, time) => acc + time, 0);

    setResults({
      coordinates: sortedCoordinates,
      distances,
      times,
      totalDistance,
      totalTime,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Route Planner</h1>
          <p className="text-muted-foreground">
            Plan your route by entering coordinates and choosing a starting direction
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-6">
            <CoordinateForm onSubmit={handleSubmit} />
          </div>
          
          <div className="space-y-6">
            {results && (
              <RouteResults
                coordinates={results.coordinates}
                distances={results.distances}
                times={results.times}
                totalDistance={results.totalDistance}
                totalTime={results.totalTime}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
