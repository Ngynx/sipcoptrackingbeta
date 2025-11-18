import { IncidentInputI, IncidentOutputI } from "./incident.input.interface";
import { GenericMapper } from "./mapper.interface";

export const incidentMapper = new GenericMapper<IncidentInputI, Partial<IncidentOutputI>> ((incident) => ({
    _id: incident?._id,
    incidentCreationDate: incident?.incident_creation_date,
    incidentDescription: incident?.incident_description,
    incidentTicketNumber: incident?.incident_ticket_number,
    routeAddress: incident?.route_address ?? null,
    subcategoryId: incident?.subcategory_id ?? null,
    subcategoryNameResolved: incident?.subcategory_name_resolved,
    taxpayerLocationLatitude: incident?.taxpayer_location_latitude,
    taxpayerLocationLongitude: incident?.taxpayer_location_longitude,

    incidentVehicles: incident?.incident_vehicles?.map((vehicle: any) => ({
        _id: vehicle?._id,
        vehicleLicensePlate: vehicle?.vehicle_license_plate,
    })) || [],

    incidentUsers: incident?.incident_users?.map((user: any) => ({
        _id: user?._id,
        userDni: user?.user_dni,
        userFullname: user?.user_fullname,
        userName: user?.user_name,
        userLastname: user?.user_lastname,
    })) || [],

}));