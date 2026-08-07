import { PrismaClient, HelmetCertification } from "@prisma/client";

const prisma = new PrismaClient();

async function cleanDatabase() {
  console.log("🧹 Running database cleanup script...");

  const products = await prisma.product.findMany({
    include: { category: true },
  });

  console.log(`Found ${products.length} products in database.`);

  let updatedCount = 0;

  for (const p of products) {
    const catSlug = (p.category?.slug || "").toLowerCase();
    const isOilProduct =
      catSlug.includes("oil") ||
      catSlug.includes("additive") ||
      catSlug.includes("lubricant") ||
      p.name.toLowerCase().includes("oil") ||
      p.name.toLowerCase().includes("additive");

    const isHelmetProduct = catSlug.includes("helmet");

    let needsUpdate = false;
    let newSizes = [...p.sizes];
    let newCert = p.certification;

    // 1. Clean clothing sizes from oil products
    if (isOilProduct) {
      const apparelSizes = ["s", "m", "l", "xl", "xxl"];
      const filtered = newSizes.filter(
        (s) => !apparelSizes.includes(String(s).trim().toLowerCase())
      );
      if (filtered.length !== newSizes.length) {
        newSizes = filtered;
        needsUpdate = true;
      }

      // Ensure oil products don't have helmet certification
      if (newCert !== HelmetCertification.NONE) {
        newCert = HelmetCertification.NONE;
        needsUpdate = true;
      }
    }

    // 2. Clean fake helmet certifications from non-helmet items
    if (!isHelmetProduct && newCert !== HelmetCertification.NONE) {
      newCert = HelmetCertification.NONE;
      needsUpdate = true;
    }

    if (needsUpdate) {
      await prisma.product.update({
        where: { id: p.id },
        data: {
          sizes: newSizes,
          certification: newCert,
        },
      });
      console.log(`✓ Updated product [${p.sku}] ${p.name}: sizes=[${newSizes.join(", ")}], cert=${newCert}`);
      updatedCount++;
    }
  }

  console.log(`🎉 Database cleanup complete! Updated ${updatedCount} products.`);
}

cleanDatabase()
  .catch((e) => {
    console.error("Cleanup error:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
