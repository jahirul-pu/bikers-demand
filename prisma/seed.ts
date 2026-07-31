import { PrismaClient, HelmetCertification, StockStatus, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Bikers Demand database seeding...");

  // 1. Create Users
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@bikersdemand.com" },
    update: {},
    create: {
      name: "Bikers Demand Admin",
      email: "admin@bikersdemand.com",
      phone: "01700000000",
      passwordHash: "$2a$10$hashedpasswordforadmin", // placeholder hash
      role: Role.ADMIN,
    },
  });

  const customerUser = await prisma.user.upsert({
    where: { email: "rider@bikersdemand.com" },
    update: {},
    create: {
      name: "Tusher Rider",
      email: "rider@bikersdemand.com",
      phone: "01800000000",
      passwordHash: "$2a$10$hashedpasswordforcustomer",
      role: Role.CUSTOMER,
      addresses: {
        create: [
          {
            label: "Home",
            line1: "House 42, Road 11, Block D, Banani",
            city: "Dhaka",
            district: "Dhaka",
            isInsideDhaka: true,
            phone: "01800000000",
          },
        ],
      },
    },
  });

  console.log("✓ Users seeded");

  // 2. Create Categories
  const ridingGearCat = await prisma.category.upsert({
    where: { slug: "riding-gear" },
    update: {},
    create: {
      name: "Riding Gear",
      slug: "riding-gear",
      description: "Helmets, jackets, gloves, boots, and protection gear.",
    },
  });

  const partsModsCat = await prisma.category.upsert({
    where: { slug: "parts-mods" },
    update: {},
    create: {
      name: "Parts & Mods",
      slug: "parts-mods",
      description: "Exhausts, levers, brake pads, chain kits, and body mods.",
    },
  });

  const electronicsCat = await prisma.category.upsert({
    where: { slug: "electronics" },
    update: {},
    create: {
      name: "Electronics",
      slug: "electronics",
      description: "LED fog lights, phone mounts, GPS trackers, and horns.",
    },
  });

  const additivesCat = await prisma.category.upsert({
    where: { slug: "additives" },
    update: {},
    create: {
      name: "Additives & Oils",
      slug: "additives",
      description: "Synthetic engine oils, coolants, chain lubes, and engine additives.",
    },
  });

  const merchandiseCat = await prisma.category.upsert({
    where: { slug: "merchandise" },
    update: {},
    create: {
      name: "Merchandise",
      slug: "merchandise",
      description: "Apparel, riding backpacks, keychains, and accessories.",
    },
  });

  console.log("✓ Categories seeded");

  // 3. Create Bike Registry
  const bikesData = [
    { brand: "Yamaha", model: "FZS-Fi", variant: "v3", cc: 149, yearFrom: 2019 },
    { brand: "Yamaha", model: "FZS-Fi", variant: "v2", cc: 149, yearFrom: 2015 },
    { brand: "Yamaha", model: "R15", variant: "v4", cc: 155, yearFrom: 2021 },
    { brand: "Yamaha", model: "R15", variant: "v3", cc: 155, yearFrom: 2018 },
    { brand: "Yamaha", model: "MT-15", variant: "v2", cc: 155, yearFrom: 2022 },
    { brand: "Honda", model: "CB Hornet", variant: "160R ABS", cc: 162, yearFrom: 2018 },
    { brand: "Honda", model: "CBR", variant: "150R Tricolor", cc: 149, yearFrom: 2021 },
    { brand: "Honda", model: "XBlade", variant: "160 Dual Disc", cc: 162, yearFrom: 2020 },
    { brand: "Suzuki", model: "Gixxer", variant: "155 FI ABS", cc: 155, yearFrom: 2019 },
    { brand: "Suzuki", model: "Gixxer SF", variant: "155 FI ABS", cc: 155, yearFrom: 2019 },
    { brand: "Suzuki", model: "GSX-R150", variant: "Keyless ABS", cc: 147, yearFrom: 2018 },
    { brand: "Bajaj", model: "Pulsar N160", variant: "Dual Channel ABS", cc: 164, yearFrom: 2022 },
    { brand: "Bajaj", model: "Pulsar NS160", variant: "FI ABS", cc: 160, yearFrom: 2020 },
    { brand: "Bajaj", model: "Pulsar 150", variant: "Twin Disc", cc: 149, yearFrom: 2018 },
    { brand: "TVS", model: "Apache RTR 160 4V", variant: "Special Edition ABS", cc: 159, yearFrom: 2021 },
    { brand: "TVS", model: "Raider 125", variant: "Disc", cc: 124, yearFrom: 2022 },
  ];

  const seededBikes = [];
  for (const bike of bikesData) {
    const seeded = await prisma.bikeModel.upsert({
      where: {
        brand_model_variant: {
          brand: bike.brand,
          model: bike.model,
          variant: bike.variant,
        },
      },
      update: {},
      create: bike,
    });
    seededBikes.push(seeded);
  }

  console.log(`✓ ${seededBikes.length} Bike models seeded`);

  // Add primary bike to customer's garage
  const fzsv3 = seededBikes.find((b) => b.brand === "Yamaha" && b.model === "FZS-Fi" && b.variant === "v3");
  if (fzsv3) {
    await prisma.userBike.upsert({
      where: {
        userId_bikeModelId: {
          userId: customerUser.id,
          bikeModelId: fzsv3.id,
        },
      },
      update: {},
      create: {
        userId: customerUser.id,
        bikeModelId: fzsv3.id,
        nickname: "My Daily FZ",
        isPrimary: true,
      },
    });
  }

  // 4. Create Products & Assign Compatibility Matrix
  // Product 1: Exhaust (Parts & Mods)
  const exhaustProduct = await prisma.product.upsert({
    where: { sku: "PARTS-EXH-001" },
    update: {},
    create: {
      sku: "PARTS-EXH-001",
      name: "Performance Slip-On Racing Exhaust (Black Coated)",
      slug: "performance-slip-on-racing-exhaust-black",
      description: "High-flow stainless steel racing exhaust muffler designed for 150-160cc street bikes. Enhances exhaust note and reduces backpressure.",
      brand: "Akrapovič Replica",
      price: 6500,
      comparePrice: 7200,
      stockQty: 14,
      stockStatus: StockStatus.IN_STOCK,
      categoryId: partsModsCat.id,
      images: ["https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=500&auto=format&fit=crop&q=80"],
      isUniversal: false,
      certification: HelmetCertification.NONE,
      warrantyFlag: false,
      warrantyDuration: "No Warranty",
      returnPolicyNote: "Parts & Mods items are non-returnable once packaging is opened/torn.",
    },
  });

  // Product 2: Chain Kit (Parts & Mods)
  const chainProduct = await prisma.product.upsert({
    where: { sku: "PARTS-CHN-002" },
    update: {},
    create: {
      sku: "PARTS-CHN-002",
      name: "O-Ring Heavy Duty Chain & Sprocket Set (428H - 132L)",
      slug: "o-ring-heavy-duty-chain-sprocket-set-428h",
      description: "JIS certified hardened steel front sprocket, rear sprocket, and gold O-Ring chain for maximum durability.",
      brand: "DID Japan",
      price: 3450,
      stockQty: 8,
      stockStatus: StockStatus.IN_STOCK,
      categoryId: partsModsCat.id,
      images: ["https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=500&auto=format&fit=crop&q=80"],
      isUniversal: false,
      certification: HelmetCertification.NONE,
      warrantyFlag: false,
      warrantyDuration: "No Warranty",
      returnPolicyNote: "Parts & Mods items are non-returnable once packaging is opened/torn.",
    },
  });

  // Product 3: CNC Levers (Parts & Mods)
  const leverProduct = await prisma.product.upsert({
    where: { sku: "PARTS-LVR-003" },
    update: {},
    create: {
      sku: "PARTS-LVR-003",
      name: "Adjustable 6-Stage CNC Billet Aluminum Brake & Clutch Levers",
      slug: "adjustable-6-stage-cnc-billet-aluminum-levers",
      description: "6-position reach adjustment levers with folding pivot design to prevent breakage during drop.",
      brand: "Racing Boy (RCB)",
      price: 2200,
      comparePrice: 2500,
      stockQty: 3,
      stockStatus: StockStatus.LOW_STOCK,
      categoryId: partsModsCat.id,
      images: ["https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=500&auto=format&fit=crop&q=80"],
      isUniversal: false,
      certification: HelmetCertification.NONE,
      warrantyFlag: false,
      warrantyDuration: "No Warranty",
      returnPolicyNote: "Parts & Mods items are non-returnable once packaging is opened/torn.",
    },
  });

  // Product 4: Fog Lights (Electronics)
  const fogLightProduct = await prisma.product.upsert({
    where: { sku: "ELEC-FOG-004" },
    update: {},
    create: {
      sku: "ELEC-FOG-004",
      name: "Dual Lens High Power LED Fog Lights with Bracket & Relay Wire",
      slug: "dual-lens-high-power-led-fog-lights",
      description: "40W dual beam (yellow low / white high) waterproof IP67 LED fog lamps with wiring harness and crash-bar clamps.",
      brand: "Future Eye",
      price: 2950,
      stockQty: 22,
      stockStatus: StockStatus.IN_STOCK,
      categoryId: electronicsCat.id,
      images: ["https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=500&auto=format&fit=crop&q=80"],
      isUniversal: true,
      certification: HelmetCertification.NONE,
      warrantyFlag: true,
      warrantyDuration: "6 Months Replacement",
    },
  });

  // Product 5: Helmet (Riding Gear)
  const helmetProduct = await prisma.product.upsert({
    where: { sku: "GEAR-HLM-005" },
    update: {},
    create: {
      sku: "GEAR-HLM-005",
      name: "MT Thunder 4 SV Full Face Helmet (Matt Black)",
      slug: "mt-thunder-4-sv-full-face-helmet-matt-black",
      description: "ECE 22.06 & DOT certified polycarbonate full-face helmet with drop-down sun visor, Pinlock ready visor, and emergency quick release pads.",
      brand: "MT Helmets",
      price: 9800,
      comparePrice: 10500,
      stockQty: 9,
      stockStatus: StockStatus.IN_STOCK,
      categoryId: ridingGearCat.id,
      images: ["https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=500&auto=format&fit=crop&q=80"],
      isUniversal: true,
      certification: HelmetCertification.ECE_2206, // Mandatory certification per PRD 3.4
      warrantyFlag: true,
      warrantyDuration: "1 Year Manufacturer Warranty",
    },
  });

  // Map bike compatibility for parts
  // FZS-Fi v3 & v2, Hornet, Apache RTR 160 4V compatible with Exhaust & Chain
  const compatibleBikeIds = seededBikes
    .filter((b) => ["Yamaha", "Honda", "TVS"].includes(b.brand))
    .map((b) => b.id);

  for (const bikeId of compatibleBikeIds) {
    await prisma.productCompatibility.upsert({
      where: {
        productId_bikeModelId: {
          productId: exhaustProduct.id,
          bikeModelId: bikeId,
        },
      },
      update: {},
      create: {
        productId: exhaustProduct.id,
        bikeModelId: bikeId,
      },
    });

    await prisma.productCompatibility.upsert({
      where: {
        productId_bikeModelId: {
          productId: chainProduct.id,
          bikeModelId: bikeId,
        },
      },
      update: {},
      create: {
        productId: chainProduct.id,
        bikeModelId: bikeId,
      },
    });

    await prisma.productCompatibility.upsert({
      where: {
        productId_bikeModelId: {
          productId: leverProduct.id,
          bikeModelId: bikeId,
        },
      },
      update: {},
      create: {
        productId: leverProduct.id,
        bikeModelId: bikeId,
      },
    });
  }

  console.log("✓ Sample products & compatibility matrix seeded successfully");
  console.log("🚀 Database seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
