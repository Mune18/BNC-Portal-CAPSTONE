export interface User {
    id: string;
    name: string;
    email: string;
    birthdate: string;
    birthplace: string;
    age: number;
    civilStatus: string;
    nationality: string;
    religion: string;
    occupation: string;
    contactNumber: string;
    familyMonthlyIncome: string;
    indigent: boolean;
    registeredVoter: boolean;
    address: Address;
    emergencyContact: EmergencyContact;
    identification: Identification;
}

export interface EmergencyContact {
    fullname: string;
    relationship: string;
    contactNumber: string;
    address: string;
}

export interface Identification {
    pwd: string;
    pwdId: string;
    soloParent: boolean;
    soloParentId: string;
    seniorCitizen: boolean;
    seniorCitizenId: string;
    fourPsMember: boolean;
}

export interface Address {
    purokNumber: string;
    houseNumber: string;
    street: string;
}
