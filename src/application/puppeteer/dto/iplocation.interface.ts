export interface IPLocation {
    ipAddress: string;
    country: string;
    city: string;
    location: {
        latitude: number;
        longitude: number;
        timezone: string;
    };
    subdivision: {
        isoCode: string;
        name: string;
    }
    createdAt: Date;
    updatedAt: Date;
}