export interface ServiceEntity {
  id: string;
  name: string;
  durationInMinutes: number;
  price: string;
  professionalId: string;
}

export interface CreateServiceDTO {
  name: string;
  durationInMinutes: number;
  price: number;
  professionalId: string;
}