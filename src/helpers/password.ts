import bcrypt from 'bcryptjs';

async function isPasswordMatch(
  hashPassword: string,
  password: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashPassword);
}

async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);
  return passwordHash;
}

export { isPasswordMatch, hashPassword };
