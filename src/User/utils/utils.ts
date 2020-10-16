import * as bcrypt from 'bcrypt';

const saltRounds = 10;

export async function generateHashPassword(password: string) {
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

export async function compareHashPassword(password: string, hashedPassword: string) {
  const compare = await bcrypt.compare(password, hashedPassword);
  return compare;
}