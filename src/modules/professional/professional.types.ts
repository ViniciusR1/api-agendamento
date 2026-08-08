export interface Professional {
  id: string;
  name: string;
  email: string;
  timezone: string;
}

export interface CreateProfessionalDTO {
  name: string;
  email: string;
  timezone?: string;
}

