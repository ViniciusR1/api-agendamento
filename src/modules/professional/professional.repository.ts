import { Professional, CreateProfessionalDTO } from "./professional.types";

export interface ProfessionalRepository {
  findAll(): Promise<Professional[]>;
  findById(id: string): Promise<Professional | null>;
  findByEmail(email: string): Promise<Professional | null>;
  create(data: CreateProfessionalDTO): Promise<Professional>;
}