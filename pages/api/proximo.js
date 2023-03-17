import prisma from "../../db";

export default async function ChamarProximo(req, res) {
  const { nextId, currentId, message } = req.body;

  //const updatedMessage = await prisma.currentMessage.update({where: {id: 1}, data: { message }});

  const nextPassword = await prisma.password.findUnique({
    where: {
      id: nextId
    }
  });

  if (nextPassword) {
    const [updatedMessage, updatedPassword] = await prisma.$transaction([
      prisma.currentMessage.update({where: {id: 1}, data: { message }}),
      prisma.currentPassword.update({
        where: { id: 1 },
        data: { password: nextPassword.id }
      })
    ]);

    // const updatedPassword = await prisma.currentPassword.update({
    //   where: { id: 1 },
    //   data: { password: nextPassword.id }
    // });

    return res.status(200).json({ id: updatedPassword.password });

  } else {
    const updatedMessage = await prisma.currentMessage.update({where: {id: 1}, data: { message }});
    return res.status(200).json({ id: currentId });
  }
}