// prisma/seed.ts

import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();
const PASSWORD = "Ale120372!";

async function main() {
  console.log("Starting database seeding...");

  const hashedPassword = await bcrypt.hash(PASSWORD, 10);

  const permissionsToCreate = [
    "register_user",
    "read_users",
    "update_user_role",
    "delete_user",
    "create_product",
    "read_products",
    "update_product",
    "delete_product",
    "create_stock_movement",
    "read_stock_movements",
    "delete_stock_movement",
    "create_vendor",
    "read_vendors",
    "update_vendor",
    "delete_vendor",
    "create_location",
    "read_locations",
    "update_location",
    "delete_location",
  ];

  await prisma.permission.createMany({
    data: permissionsToCreate.map((name) => ({ name })),
    skipDuplicates: true,
  });

  const allPermissions = await prisma.permission.findMany();

  const adminRole = await prisma.role.create({
    data: {
      name: "Admin",
      description: "Superuser with full administrative access.",
      permissions: {
        create: allPermissions.map((perm) => ({ permissionId: perm.id })),
      },
    },
  });

  const adminUser = await prisma.user.create({
    data: {
      name: "System Admin",
      initials: "SA",
      email: "admin@yourdomain.com",
      password: hashedPassword,
      roleId: adminRole.id,
    },
  });

  console.log("Seeding complete!");
  console.log(`Admin user created: ${adminUser.email}`);
  console.log("All permissions and the 'Admin' role have been created.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
