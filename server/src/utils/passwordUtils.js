import bcrypt from "bcrypt";

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;

export async function hashPassword(password) {
  if (typeof password !== "string" || password.length === 0) {
    throw new Error("password is required and must be a non-empty string");
  }
  const hash = await bcrypt.hash(password, SALT_ROUNDS);
  return hash;
}

export async function comparePassword(plain, hash) {
  if (typeof plain !== "string" || plain.length === 0) return false;
  if (typeof hash !== "string" || hash.length === 0) return false;
  const match = await bcrypt.compare(plain, hash);
  return match;
}

export default { hashPassword, comparePassword };
