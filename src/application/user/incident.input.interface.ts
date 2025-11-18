export class IncidentInputI {
    _id: string;
    incident_priority: string;
    category_name: string;
    category_name_resolved: string;
    subcategory_name: string;
    subcategory_name_resolved: string;
    subcategory_id: string; // esta informacion no esta en el incidente
    incident_ticket_number: string
    incident_description: string;
    incident_description_resolved: string;
    taxpayer_name: string;
    taxpayer_cellphone: number;
    taxpayer_dni: number
    referential_location: string;
    taxpayer_location_latitude: number;
    taxpayer_location_longitude: number
    taxpayer_id: string
    workgroup_name: string | null;
    workgroup_responsable: string;
    workgroup_contact_number: number;
    workgroup_responsable_dni: number;
    incident_creation_date: string;
    incident_latest_update: string;
    incident_state: string;
    incident_resolved_date: string;
    incident_jurisdiction: boolean;
    incident_district_signed: string;
    incident_vehicles: Array<any>; // VehicleD
    incident_users: Array<any>; // CreateUserDto
    incident_lawbreakers: Array<any>; // InfractionD
    operator_workgroup_name: string;
    operator_responsable: string;
    operator_dni: number
    route_address: string;
    incident_victims: Array<any>; // RegisterAVictimD
    exported_to_sipcop: boolean;
    shift_name: string;
    shift_id: string;
    shift_manager: string;
    shift_manager_id: string;
}

export class IncidentOutputI {
    route_address: string
    _id: string
    subcategory_name_resolved: string
    subcategory_id: string
    incident_ticket_number: string
    incident_description: string
    taxpayer_location_latitude: number
    taxpayer_location_longitude: number
    incident_creation_date: string
    incident_vehicles: {_id: string, vehicle_license_plate: string}[]
    incident_users: {_id: string, user_dni:number, user_fullname: string, user_name: string, user_lastname: string}[]
}