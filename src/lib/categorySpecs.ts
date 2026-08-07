/**
 * Category Specifications Configuration
 * Defines dynamic specification fields per category for Admin Form & Frontend Storefront.
 */

export interface SpecFieldDef {
  key: string;
  label: string;
  type: "text" | "select" | "multiselect" | "number";
  placeholder?: string;
  options?: string[];
  unit?: string;
  description?: string;
}

export interface CategorySpecGroup {
  categorySlug: string;
  categoryName: string;
  showBikeCompatibility: boolean; // Whether to show Bike Compatibility Matrix selector for this category
  fields: SpecFieldDef[];
}

export const CATEGORY_SPECS: Record<string, CategorySpecGroup> = {
  helmets: {
    categorySlug: "helmets",
    categoryName: "Helmets & Headgear",
    showBikeCompatibility: false,
    fields: [
      {
        key: "sizes",
        label: "Available Sizes",
        type: "multiselect",
        options: ["S", "M", "L", "XL", "XXL"],
      },
    ],
  },

  "riding-gear": {
    categorySlug: "riding-gear",
    categoryName: "Riding Gear & Apparel",
    showBikeCompatibility: false,
    fields: [
      {
        key: "sizes",
        label: "Available Sizes",
        type: "multiselect",
        options: ["S", "M", "L", "XL", "XXL", "EU 39", "EU 40", "EU 41", "EU 42", "EU 43", "EU 44", "EU 45"],
      },
      {
        key: "protectionRating",
        label: "Armor & Protection Rating",
        type: "select",
        options: [
          "CE Level 2 Approved (Shoulders/Elbows/Back)",
          "CE Level 1 Approved",
          "TPU External Ankle & Knee Sliders",
          "Kevlar / Cordura Abrasion Reinforced",
          "Reflective Night Safety Piping",
        ],
      },
      {
        key: "material",
        label: "Primary Material / Fabric",
        type: "select",
        options: [
          "Heavy Duty 600D Cordura Textile",
          "1.2mm Full Grain Cowhide Leather",
          "3D Breathable Mesh Airflow",
          "Gore-Tex 100% Waterproof Membrane",
          "Ripstop Windbreaker Nylon",
        ],
      },
      {
        key: "weatherSeason",
        label: "Weather & Season Rating",
        type: "select",
        options: [
          "All-Weather 4-Season Rider",
          "Summer Breathable Air Mesh",
          "Winter Thermal Detachable Lined",
          "100% Monsoon Waterproof",
        ],
      },
    ],
  },

  additives: {
    categorySlug: "additives",
    categoryName: "Engine Oil, Lubricants & Additives",
    showBikeCompatibility: true,
    fields: [
      {
        key: "capacity",
        label: "Fluid Volume / Net Capacity (Litre)",
        type: "select",
        options: ["1 Litre (1L)", "1.2 Litres (1.2L)", "800 ml", "1.5 Litres", "4 Litres (4L)", "250 ml (Additive Pack)"],
      },
      {
        key: "viscosity",
        label: "Viscosity Grade",
        type: "select",
        options: [
          "10W-30",
          "10W-40",
          "15W-50",
          "20W-50",
          "10W-50",
          "5W-40",
          "75W-90 (Gear Oil)",
          "N/A (Chemical Additive / Cleaner)",
        ],
      },
      {
        key: "oilType",
        label: "Base Oil Composition & Quality Grade",
        type: "select",
        options: [
          "100% Fully Synthetic (ESTERA / PAO)",
          "Technosynthese / Semi-Synthetic",
          "Premium Mineral Oil",
          "Engine Flush & Fuel Additive",
        ],
      },
      {
        key: "engineType",
        label: "Engine & Vehicle Type Suitability",
        type: "select",
        options: [
          "4T 4-Stroke Manual Transmission Bikes",
          "4T Scooter / Automatic Transmission (JASO MB)",
          "2T 2-Stroke Performance Engines",
          "Universal Heavy Duty / High CC Bikes",
        ],
      },
      {
        key: "jasoApiRating",
        label: "JASO & API Standard Certification",
        type: "select",
        options: [
          "JASO MA2 / API SN (Wet Clutch Safe)",
          "JASO MA / API SL",
          "JASO MB / API SN (Scooters Only)",
          "API SP (Latest Standard)",
        ],
      },
    ],
  },

  "parts-mods": {
    categorySlug: "parts-mods",
    categoryName: "Parts, Modifications & Spares",
    showBikeCompatibility: true,
    fields: [
      {
        key: "material",
        label: "Material & Construction",
        type: "select",
        options: [
          "T6-6061 CNC Billet Aluminum",
          "Real 3K Carbon Fiber",
          "Stainless Steel 304 High-Flow",
          "High Impact ABS Fairing Plastic",
          "Sintered Metallic Compound",
        ],
      },
      {
        key: "fitmentType",
        label: "Fitment & Mounting Requirement",
        type: "select",
        options: [
          "Direct OEM Bolt-On Replacement",
          "Plug-and-Play Wiring Harness Included",
          "Custom Fit / Minor Modification May Be Required",
        ],
      },
    ],
  },

  electronics: {
    categorySlug: "electronics",
    categoryName: "Electronics, Lights & Mounts",
    showBikeCompatibility: true,
    fields: [
      {
        key: "voltage",
        label: "Operating Voltage",
        type: "select",
        options: ["12V DC Motorcycle Standard", "5V 2.1A QuickCharge USB", "Dual 12V/24V Support"],
      },
      {
        key: "powerOutput",
        label: "Wattage / Output Spec",
        type: "text",
        placeholder: "e.g. 60W LED / 110dB Horn / 5000mAh",
      },
      {
        key: "waterproofRating",
        label: "Water & Weather Resistance",
        type: "select",
        options: [
          "IP67 Fully Submersible Waterproof",
          "IP65 Heavy Rain Resistant",
          "Splashproof Weather Sealed",
          "Indoor / Dry Use Only",
        ],
      },
    ],
  },
};

/**
 * Resolves category specs configuration supporting slug aliases (e.g. oils-additives -> additives)
 */
export function getCategorySpec(categorySlug?: string | null): CategorySpecGroup | undefined {
  if (!categorySlug) return undefined;
  const slug = categorySlug.toLowerCase().trim();

  if (CATEGORY_SPECS[slug]) {
    return CATEGORY_SPECS[slug];
  }

  // Slug aliases lookup
  if (slug.includes("oil") || slug.includes("additive") || slug.includes("lubricant")) {
    return CATEGORY_SPECS["additives"];
  }

  if (slug.includes("gear") || slug.includes("apparel") || slug.includes("wear") || slug.includes("jacket") || slug.includes("boot")) {
    return CATEGORY_SPECS["riding-gear"];
  }

  if (slug.includes("part") || slug.includes("mod") || slug.includes("spare")) {
    return CATEGORY_SPECS["parts-mods"];
  }

  if (slug.includes("electronic") || slug.includes("accessor") || slug.includes("light") || slug.includes("gadget")) {
    return CATEGORY_SPECS["electronics"];
  }

  if (slug.includes("helmet") || slug.includes("headgear")) {
    return CATEGORY_SPECS["helmets"];
  }

  return undefined;
}
