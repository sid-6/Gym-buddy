import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { readSession, sessionCookie } from "@/lib/auth";
import { routes } from "@/lib/routes";

export async function getSessionUser() {
  const jar = await cookies();
  const userId = readSession(jar.get(sessionCookie.name)?.value);
  if (!userId) return null;
  return prisma.user.findUnique({ where: { id: userId } });
}

export async function requireUser() {
  const user = await getSessionUser();
  if (!user) redirect(routes.login);
  return user;
}

export async function requireOnboardedUser() {
  const user = await requireUser();
  if (!user.onboardingCompletedAt || !user.goal) redirect(routes.goal);
  return user;
}
