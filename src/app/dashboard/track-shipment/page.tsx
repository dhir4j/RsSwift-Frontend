import { TrackShipmentForm } from '@/components/shipment/track-shipment-form';
import { Suspense } from 'react';

export default function TrackShipmentPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TrackShipmentForm />
    </Suspense>
  );
}
