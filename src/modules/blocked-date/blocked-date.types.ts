export interface BlockedDateEntity {
  id: string;
  date: Date;
  reason: string | null;
  professionalId: string;
}
export interface CreateBlockedDateDTO {
 date: string;
 reason?: string;
 professionalId: string;
}