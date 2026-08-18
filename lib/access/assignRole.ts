export function assignRole(existingUserCount: number) {
  if (existingUserCount === 0) return "owner"; // super-user
  return "user"; // full access
}
