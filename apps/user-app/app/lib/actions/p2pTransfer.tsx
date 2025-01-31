"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

export const p2pTransfer = async (to: string, amount: number) => {
  const session = await getServerSession(authOptions);
  if (!session?.user || !session?.user?.id) {
    return {
      message: "Unauthenticated request",
    };
  }
  const toUser = await prisma.user.findFirst({
    where: {
      number: to,
    },
  });

  if (!toUser) {
    return {
      message: "User not found",
    };
  }
  const from = session?.user?.id;

  await prisma.$transaction(async (tx) => {
    // lock row for safety of hitting multiple concurrent requests
    await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${Number(from)} FOR UPDATE`;
    const fromBalance = await tx.balance.findUnique({
      where: {
        userId: Number(from),
      },
    });
    if (!fromBalance || fromBalance.amount < amount) {
      throw new Error("Insufficient amount!");
    }
    await tx.balance.update({
      where: {
        userId: Number(from),
      },
      data: { amount: { decrement: amount } },
    });
    await tx.balance.update({
      where: {
        userId: Number(toUser?.id),
      },
      data: { amount: { increment: amount } },
    });
  });
};
