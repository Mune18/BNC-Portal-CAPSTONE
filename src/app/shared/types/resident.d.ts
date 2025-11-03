export interface ResidentInfo {
  // Appwrite document properties
  $id?: string;
  $createdAt?: string;
  $updatedAt?: string;
  $permissions?: string[];
  
  // Existing properties
  profileImage?: string;
  role?: string;
  uid?: string;
  personalInfo: {
    lastName: string;
    firstName: string;
    middleName: string;
    suffix?: string;
    gender: string;
    birthDate: string;
    birthPlace: string;
    age: number;
    civilStatus: string;
    nationality: string;
    religion: string;
    occupation: string;
    email: string;
    contactNo: string;
    pwd: string;
    pwdIdNo: string;
    monthlyIncome: number;
    indigent: string;
    soloParent: string;
    soloParentIdNo: string;
    seniorCitizen: string;
    seniorCitizenIdNo: string;
    fourPsMember: string;
    registeredVoter: string;
    purokNo: string;
    houseNo: string;
    street: string;
  };
  emergencyContact: {
    fullName: string;
    relationship: string;
    contactNo: string;
    address: string;
  };
  otherDetails: {
    nationalIdNo: string;
    votersIdNo: string;
    status: string;
    dateOfRegistration: string;
    approvalStatus?: string;
    approvedAt?: string;
  };
}
