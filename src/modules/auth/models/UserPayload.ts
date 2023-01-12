export interface UserPayload {
  sub: number;
  email: string;
  cpf: string;
  name: string;
  iat?: number;
  ext?: number;
}
