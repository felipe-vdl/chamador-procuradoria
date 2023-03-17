import prisma from "../../db";

export default async function Current(req, res) {
  const currentPassword = await prisma.currentPassword.findUnique({
    where: { id: 1 }
  });

  const currentMessage = await prisma.currentMessage.findUnique({
    where: { id: 1 }
  });

  const currentCounter = await prisma.counter.findUnique({ where: { id: 1 } });

  return res.status(200).json({ message: currentMessage.message, password: currentPassword.password, counter: currentCounter.counter });
}