import { ShipEngine } from 'shipengine';

export const shipengine = new ShipEngine(
    process.env.USPS_API_KEY!
);
