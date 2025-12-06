// Household Type Definitions

export interface Household {
  $id?: string;
  $createdAt?: string;
  $updatedAt?: string;
  $permissions?: string[];
  
  headOfHouseholdId: string;
  householdCode: string;
  purokNo: string;
  houseNo: string;
  street: string;
  createdAt: string;
  updatedAt?: string;
}

export type MemberType = 'linked' | 'pending_registration';
export type MemberStatus = 'claimed' | 'active' | 'pending_verification';
export type Relationship = 'Head' | 'Spouse' | 'Child' | 'Parent' | 'Sibling' | 'Relative' | 'Other';

export interface HouseholdMember {
  $id?: string;
  $createdAt?: string;
  $updatedAt?: string;
  $permissions?: string[];
  
  householdId: string;
  linkedResidentId?: string;
  relationship: Relationship;
  memberType: MemberType;
  
  // For pending_registration members
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  
  status: MemberStatus;
  canClaimAccount: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface HouseholdWithMembers extends Household {
  members: HouseholdMemberWithResident[];
  totalMembers: number;
}

export interface HouseholdMemberWithResident extends HouseholdMember {
  residentInfo?: {
    firstName: string;
    lastName: string;
    middleName?: string;
    birthDate?: string;
    age?: number;
    gender?: string;
    contactNo?: string;
    email?: string;
    profileImage?: string;
  };
}

export interface AddHouseholdMemberRequest {
  householdId: string;
  linkedResidentId?: string;
  relationship: Relationship;
  memberType: MemberType;
  
  // Basic Information (required for pending_registration)
  firstName?: string;
  lastName?: string;
  middleName?: string;
  suffix?: string;
  
  // Personal Details (required for pending_registration)
  gender?: string;
  birthDate?: string;
  birthPlace?: string;
  civilStatus?: string;
  nationality?: string;
  religion?: string;
  educationalAttainment?: string;
  
  // Contact & Work (required for pending_registration)
  employmentStatus?: string;
  occupation?: string;
  monthlyIncome?: number | string;
  contactNo?: string;
  email?: string;
  
  // Address (auto-filled from household, optional override)
  purokNo?: string;
  houseNo?: string;
  street?: string;
  housingOwnership?: string;
  yearsInBarangay?: string;
  
  // Special Categories (required for pending_registration)
  pwd?: string;
  pwdIdNo?: string;
  soloParent?: string;
  soloParentIdNo?: string;
  seniorCitizen?: string;
  seniorCitizenIdNo?: string;
  indigent?: string;
  fourPsMember?: string;
  registeredVoter?: string;
  
  // Government IDs (optional)
  nationalIdNo?: string;
  votersIdNo?: string;
}

export interface SearchResidentResult {
  $id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  birthDate?: string;
  age?: number;
  gender?: string;
  contactNo?: string;
  purokNo?: string;
  alreadyInHousehold: boolean;
  isHouseholdHead: boolean;
}
