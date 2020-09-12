export interface User {
  userId: string;
  name?: string;
  password?: string;
}

export type LoginInput = {
  userId: string;
  password: string;
};
