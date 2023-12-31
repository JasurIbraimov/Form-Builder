"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs";
import { formSchemaType, formSchema } from "../schemas/form";

class UserNotFoundError extends Error {}

export async function GetFormStats() {
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundError();
  }

  const stats = await prisma.form.aggregate({
    where: {
      userId: user.id,
    },
    _sum: {
      visits: true,
      submissions: true,
    },
  });

  const visits = stats._sum.visits || 0;
  const submissions = stats._sum.submissions || 0;

  let submissionRate = 0;
  let bounceRate = 0;

  if (visits > 0) {
    submissionRate = (submissions / visits) * 100;
    bounceRate = 100 - submissionRate;
  }

  return {
    visits,
    submissions,
    submissionRate,
    bounceRate,
  };
}

export async function CreateForm({ name, description }: formSchemaType) {
  const validation = formSchema.safeParse({ name, description });
  if (!validation.success) {
    throw new Error("Form not valid!");
  }

  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundError();
  }

  const form = await prisma.form.create({
    data: {
      userId: user.id,
      name,
      description,
    },
  });
  if (!form) {
    throw new Error("Something went wrong!");
  }
  return form.id;
}

export async function GetForms() {
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundError();
  }

  return await prisma.form.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
