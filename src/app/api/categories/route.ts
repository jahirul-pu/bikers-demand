import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEFAULT_CATEGORIES = [
  {
    name: "Helmets",
    slug: "helmets",
    description: "ECE 22.06 & DOT certified full face, modular, dual-sport helmets & replacement visors.",
    children: [
      { name: "Full Face Helmets", slug: "full-face", description: "Aerodynamic track & street helmets" },
      { name: "Modular & Flip-Up", slug: "modular", description: "Touring flip-up helmets" },
      { name: "Off-Road & Dual Sport", slug: "dual-sport", description: "Dirt bike & adventure helmets" },
      { name: "Visors & Anti-Fog Pinlocks", slug: "visors", description: "Replacement visors and Pinlocks" },
      { name: "Helmet Intercoms & Spares", slug: "helmet-spares", description: "Cheek pads, visors, mounts" },
    ],
  },
  {
    name: "Riding Gear",
    slug: "riding-gear",
    description: "CE Level 1 & Level 2 armored jackets, racing gloves, riding boots & rain suits.",
    children: [
      { name: "Armored Jackets", slug: "jackets", description: "CE Level 2 mesh & leather jackets" },
      { name: "Leather & Mesh Gloves", slug: "gloves", description: "Knuckle protected riding gloves" },
      { name: "Riding Boots & Shoes", slug: "boots", description: "Ankle & shin protected footwear" },
      { name: "Knee & Elbow Guards", slug: "protection", description: "Hard shell impact armor" },
      { name: "Rain Gear & Base Layers", slug: "rain-gear", description: "Waterproof rain suits & thermals" },
    ],
  },
  {
    name: "Parts",
    slug: "parts",
    description: "Performance exhausts, high-flow air filters, brake pads, chains & sprocket kits.",
    children: [
      { name: "Exhaust Systems & Slip-Ons", slug: "exhausts", description: "Full system & slip-on exhausts" },
      { name: "High-Flow Air Filters", slug: "filters", description: "Performance air filters" },
      { name: "Brake Pads & Rotors", slug: "brakes", description: "Sintered brake pads & wave discs" },
      { name: "Chains & Sprocket Kits", slug: "drivetrain", description: "O-ring & X-ring chain drive kits" },
      { name: "Handlebars & CNC Levers", slug: "controls", description: "Adjustable levers & handlebars" },
    ],
  },
  {
    name: "Accessories",
    slug: "accessories",
    description: "Mobile holders, bike covers, crash guards, frame sliders & pannier bags.",
    children: [
      { name: "Mobile Holders & Chargers", slug: "holders", description: "Vibration dampening phone mounts" },
      { name: "Bike Covers & Security Locks", slug: "covers", description: "Heavy duty covers & disc locks" },
      { name: "Crash Guards & Frame Sliders", slug: "guards", description: "Engine crash guards & sliders" },
      { name: "Panniers & Saddlebags", slug: "luggage", description: "Touring luggage & tank bags" },
      { name: "Decals & Keychains", slug: "decals", description: "Reflective rim tapes & tags" },
    ],
  },
  {
    name: "Electronics",
    slug: "electronics",
    description: "High power LED fog lights, intercoms, action camera mounts, GPS trackers, and chargers.",
    children: [
      { name: "Bluetooth Intercoms", slug: "intercoms", description: "Rider to rider communicators" },
      { name: "Action Cameras & Mounts", slug: "cameras", description: "Chin mounts & camera accessories" },
      { name: "Auxiliary LED Fog Lights", slug: "lights", description: "High lumen spot & fog lights" },
      { name: "Anti-Theft GPS Trackers", slug: "security", description: "Realtime GPS location trackers" },
    ],
  },
  {
    name: "Additives & Oils",
    slug: "additives",
    description: "100% full synthetic 4T engine oils, coolants, chain lube sprays & fuel additives.",
    children: [
      { name: "Full Synthetic Engine Oils", slug: "engine-oils", description: "10W-40, 10W-50 4T synthetic oils" },
      { name: "Chain Lubes & Cleaners", slug: "chain-care", description: "O-ring safe lube & de-greasers" },
      { name: "Radiator Coolants", slug: "coolants", description: "High boiling point engine coolants" },
      { name: "Fuel Additives", slug: "fuel-care", description: "Octane boosters & injector cleaners" },
    ],
  },
];

export async function GET() {
  try {
    let categories = await prisma.category.findMany({
      where: { parentId: null },
      include: {
        children: {
          include: {
            _count: { select: { products: true } },
          },
          orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        },
        _count: { select: { products: true } },
      },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });

    return NextResponse.json({ success: true, data: categories });
  } catch (error: any) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
