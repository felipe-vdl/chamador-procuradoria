import prisma from "../../db";

export default async function Counter(req, res) {
  if (req.method === "POST") {
    const { message } = req.body;

    const [updatedMessage, updatedCounter] = await prisma.$transaction([
      prisma.currentMessage.update({ where: { id: 1 }, data: { message } }),
      prisma.counter.update({ where: { id: 1 }, data: { counter: { increment: 1 } } })
    ]);

    // const updatedMessage = await prisma.currentMessage.update({where: {id: 1}, data: { message }});
    // const updatedCounter = await prisma.counter.update({ where: { id: 1 }, data: { counter: { increment: 1 } } });

    return res.status(200).json({ counter: updatedCounter.counter, message: updatedMessage });
  }

}