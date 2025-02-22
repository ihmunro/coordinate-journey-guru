
import React, { useState } from 'react';
import { Direction, parseCoordinates } from '../utils/coordinates';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface CoordinateFormProps {
  onSubmit: (coordinates: { lat: number; lng: number; }[], direction: Direction) => void;
}

const CoordinateForm: React.FC<CoordinateFormProps> = ({ onSubmit }) => {
  const [input, setInput] = useState('');
  const [direction, setDirection] = useState<Direction>('North');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const coordinates = parseCoordinates(input);
      if (coordinates.length > 15) {
        throw new Error('Maximum 15 coordinate pairs allowed');
      }
      if (coordinates.length < 2) {
        throw new Error('Please enter at least 2 coordinate pairs');
      }
      onSubmit(coordinates, direction);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Invalid input');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn">
      <div className="space-y-2">
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Enter Coordinates
        </label>
        <Textarea
          placeholder="Enter coordinates in any format:&#13;&#10;51.5074° N, 0.1278° W&#13;&#10;or&#13;&#10;51.5074, -0.1278"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="min-h-[120px] glass"
        />
        <p className="text-sm text-muted-foreground">
          Supports both formats:
          <br />
          • Google Maps format (51.5074° N, 0.1278° W)
          <br />
          • Simple format (51.5074, -0.1278)
          <br />
          Max 15 pairs
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Starting Direction
        </label>
        <Select
          value={direction}
          onValueChange={(value) => setDirection(value as Direction)}
        >
          <SelectTrigger className="w-full glass">
            <SelectValue placeholder="Select direction" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="North">North</SelectItem>
            <SelectItem value="South">South</SelectItem>
            <SelectItem value="East">East</SelectItem>
            <SelectItem value="West">West</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        type="submit"
        className="w-full glass hover:bg-accent transition-all duration-300"
        disabled={isLoading}
      >
        {isLoading ? 'Calculating...' : 'Calculate Route'}
      </Button>
    </form>
  );
};

export default CoordinateForm;
