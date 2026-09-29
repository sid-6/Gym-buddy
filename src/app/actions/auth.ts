"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { hashPassword, signSession, sessionCookie, verifyPassword } from "@/lib/auth";
import { calorieTargets } from "@/lib/format";
import { routes } from "@/lib/routes";
import { getSessionUser } from "@/lib/session";
import { assignPlansForGoal } from "@/server/plans";

function emailOk(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function setCookie(userId: string) {
  const jar = await cookies();
  jar.set(sessionCookie.name, signSession(userId), sessionCookie.options);
}

export async function signupAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!name || !emailOk(email) || password.length < 6) {
    return { error: "Enter your name, a valid email, and a password of at least 6 characters." };
  }
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return { error: "An account with that email already exists." };
  const user = await prisma.user.create({
    data: { name, email, passwordHash: hashPassword(password) },
  });
  await setCookie(user.id);
  redirect(routes.goal);
}

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return { error: "Email or password is incorrect." };
  }
  await setCookie(user.id);
  redirect(user.onboardingCompletedAt ? routes.home : routes.goal);
}

export async function logoutAction() {
  const jar = await cookies();
  jar.delete(sessionCookie.name);
  redirect(routes.login);
}

export async function saveGoalAction(goal: string) {
  const user = await getSessionUser();
  if (!user) redirect(routes.login);
  const allowed = ["MUSCLE_GAIN", "WEIGHT_LOSS", "ENDURANCE", "FLEXIBILITY"];
  if (!allowed.includes(goal)) return { error: "Choose a goal." };
  const targets = calorieTargets(goal);
  await prisma.user.update({
    where: { id: user.id },
    data: {
      goal,
      ...targets,
      onboardingCompletedAt: new Date(),
    },
  });
  await assignPlansForGoal(user.id, goal);
  redirect(routes.home);
}

export async function forgotPasswordAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { error: "No account found for that email." };
  const token = `${user.id}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  await prisma.passwordReset.create({
    data: {
      userId: user.id,
      token,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60),
    },
  });
  return { resetPath: `${routes.resetPassword}?token=${encodeURIComponent(token)}` };
}

export async function resetPasswordAction(formData: FormData) {
  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  if (password.length < 6) return { error: "Password must be at least 6 characters." };
  if (password !== confirm) return { error: "Passwords do not match." };
  const row = await prisma.passwordReset.findUnique({ where: { token } });
  if (!row || row.expiresAt < new Date()) return { error: "This reset link is invalid or expired." };
  await prisma.user.update({
    where: { id: row.userId },
    data: { passwordHash: hashPassword(password) },
  });
  await prisma.passwordReset.delete({ where: { id: row.id } });
  redirect(routes.login);
}

export async function updateProfileAction(formData: FormData) {
  const user = await getSessionUser();
  if (!user) redirect(routes.login);
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const calorieGoal = Number(formData.get("calorieGoal") ?? user.calorieGoal);
  const proteinGoal = Number(formData.get("proteinGoal") ?? user.proteinGoal);
  const carbsGoal = Number(formData.get("carbsGoal") ?? user.carbsGoal);
  const fatGoal = Number(formData.get("fatGoal") ?? user.fatGoal);
  const weightKg = String(formData.get("weightKg") ?? "").trim();
  if (!name || !email) return { error: "Name and email are required." };
  const clash = await prisma.user.findFirst({ where: { email, NOT: { id: user.id } } });
  if (clash) return { error: "That email is already in use." };
  await prisma.user.update({
    where: { id: user.id },
    data: {
      name,
      email,
      calorieGoal: Number.isFinite(calorieGoal) ? calorieGoal : user.calorieGoal,
      proteinGoal: Number.isFinite(proteinGoal) ? proteinGoal : user.proteinGoal,
      carbsGoal: Number.isFinite(carbsGoal) ? carbsGoal : user.carbsGoal,
      fatGoal: Number.isFinite(fatGoal) ? fatGoal : user.fatGoal,
    },
  });
  if (weightKg) {
    const value = Number(weightKg);
    if (Number.isFinite(value) && value > 0) {
      const { todayKey } = await import("@/lib/format");
      const date = todayKey();
      await prisma.bodyMetric.upsert({
        where: { userId_date: { userId: user.id, date } },
        update: { weightKg: value },
        create: { userId: user.id, date, weightKg: value },
      });
    }
  }
  redirect(routes.profile);
}

export async function addWaterAction() {
  const user = await getSessionUser();
  if (!user) redirect(routes.login);
  const { todayKey } = await import("@/lib/format");
  const date = todayKey();
  const row = await prisma.hydrationLog.findUnique({
    where: { userId_date: { userId: user.id, date } },
  });
  await prisma.hydrationLog.upsert({
    where: { userId_date: { userId: user.id, date } },
    update: { glasses: (row?.glasses ?? 0) + 1 },
    create: { userId: user.id, date, glasses: 1 },
  });
  revalidatePath("/settings");
  revalidatePath("/profile");
  revalidatePath("/diet");
  revalidatePath("/home");
}
