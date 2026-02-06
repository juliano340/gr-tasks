import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const premiumUsers = await prisma.user.findMany({
    where: {
      subscription: {
        plan: "premium",
      },
    },
    include: {
      subscription: true,
    },
  });

  console.log("Premium Users Count:", premiumUsers.length);
  premiumUsers.forEach((user) => {
    console.log(`- User: ${user.name} (${user.email}), Image: ${user.image}, Plan: ${user.subscription?.plan}`);
  });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
