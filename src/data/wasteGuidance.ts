import type { WasteCategoryGuidance } from '../types'

export const MODEL_CLASSES = [
  'Plastic Bottles',
  'Other Plastic Packaging',
  'Paper/Cardboard',
  'Metal Can',
  'Mixed/Uncertain Waste',
  'Metal Bottles'
] as const

export const wasteGuidanceRegistry: Record<string, WasteCategoryGuidance> = {
  'Plastic Bottles': {
    className: 'Plastic Bottles',
    displayName: 'PET Plastic Bottle',
    subHeading: 'Rigid Polyethylene Terephthalate polymer drinkware & food containers',
    icon: 'local_drink',
    stream: 'Plastic Recycling',
    binBadge: 'Blue Recyclables Bin',
    colorToken: 'plastic',
    materialCode: '♳ Resin Code: PETE 01',
    biodegradability: 'Non-Biodegradable (~450 yrs)',
    categoryAccuracy: 96.8,
    precisionRating: '97.4% Precision • 96.1% Recall',
    datasetSamplesCount: 1558,
    keyOpticalFeatures: [
      'Translucent polymer reflections and specular highlights',
      'Cylindrical or fluted bottle contours with threaded neck',
      'Circular injection gate or concave base geometry'
    ],
    identification: 'Rigid clear or tinted beverage bottles, detergent flasks, and food jars made of Polyethylene Terephthalate polymer.',
    immediateAction: 'Empty remaining liquid, rinse out residue, and place into your designated dry recyclables bin.',
    preparation: 'Unscrew polypropylene (#5 PP) cap if local sorters process caps separately. Crush bottle flat to optimize transport volume.',
    nextStage: 'Municipal plastic recycling / Mechanical grinding into reclaimed PET flakes for textiles or new bottle preforms.',
    alternativeRoute: 'If contaminated with motor oil, paint, or hazardous chemicals, redirect immediately to municipal hazardous waste.',
    environmentalTip: 'Carrying a durable refillable flask prevents an estimated 167 single-use plastic bottles per person each year.',
    impactFact: 'Recycling 1 plastic bottle saves enough energy to power a 60W LED bulb for 3 continuous hours.',
    steps: [
      {
        step: 1,
        title: 'Empty & Rinse',
        action: 'Pour out remaining liquids and quickly rinse to prevent batch contamination.',
        icon: 'water_drop'
      },
      {
        step: 2,
        title: 'Separate Cap',
        action: 'Unscrew cap if local sorters process lighter caps separately from PET bodies.',
        icon: 'hdr_strong'
      },
      {
        step: 3,
        title: 'Crush Flat',
        action: 'Lightly compress to reduce transport volume and save bin space.',
        icon: 'compress'
      },
      {
        step: 4,
        title: 'Deposit in Blue Bin',
        action: 'Deposit loose into plastics recyclables bin. Do not tie inside opaque plastic bags.',
        icon: 'delete'
      }
    ]
  },

  'Other Plastic Packaging': {
    className: 'Other Plastic Packaging',
    displayName: 'Plastic Packaging & Film',
    subHeading: 'Flexible pouches, wrappers, thermoformed trays or dense polymer wrapping',
    icon: 'inventory_2',
    stream: 'Packaging Stream / Residual',
    binBadge: 'Yellow Bin / Store Drop-off',
    colorToken: 'plastic',
    materialCode: '♴/♶/♷ Resin Codes: PE-HD, PP, PS, Multi-Layer',
    biodegradability: 'Non-Biodegradable (~200–500 yrs)',
    categoryAccuracy: 91.4,
    precisionRating: '92.2% Precision • 90.6% Recall',
    datasetSamplesCount: 2312,
    keyOpticalFeatures: [
      'Flexible crinkled specular surface with film seams',
      'Thin multi-layer edge profile and heat-sealed edges',
      'Thermoformed tray indentations and flexible plastic sheeting'
    ],
    identification: 'Snack bags, flexible wrappers, food delivery thermoformed trays, bubble wrap, shrink film, or non-bottle containers.',
    immediateAction: 'Inspect the resin identification triangle on the back; check if your local facility accepts soft or rigid non-bottle plastics.',
    preparation: 'Wipe away grease, food remnants, and remove paper labels or peelable aluminium seals.',
    nextStage: 'Dedicated soft plastic supermarket drop-off collection, or packaging bins where accepted; otherwise residual waste.',
    alternativeRoute: 'Multi-layer composite foil pouches (such as metallic chips bags) belong in general residual waste if no specialist pyrolysis route exists.',
    environmentalTip: 'Prioritize buying in bulk or choosing mono-material packaging with verified local recyclability.',
    impactFact: 'Recycling high-density polyethylene consumes 88% less energy than refining virgin crude petroleum.',
    steps: [
      {
        step: 1,
        title: 'Wipe Clean',
        action: 'Ensure packaging is free of oil, sugar syrups, or crumbs.',
        icon: 'cleaning_services'
      },
      {
        step: 2,
        title: 'Check Resin Stamp',
        action: 'Look for #2 HDPE, #4 LDPE, or #5 PP on back label.',
        icon: 'qr_code'
      },
      {
        step: 3,
        title: 'Peel Foil Liners',
        action: 'Separate paper wraps or metallic peelable lids before sorting.',
        icon: 'content_cut'
      },
      {
        step: 4,
        title: 'Route to Proper Stream',
        action: 'Deposit clean film at drop-off stations or in designated packaging bins.',
        icon: 'move_to_inbox'
      }
    ]
  },

  'Paper/Cardboard': {
    className: 'Paper/Cardboard',
    displayName: 'Paper & Cardboard',
    subHeading: 'Fibre packaging, shipping boxes, paperboard cartons & clean stationery',
    icon: 'inventory_2',
    stream: 'Paper Recycling',
    binBadge: 'Yellow/Green Paper Bin',
    colorToken: 'paper',
    materialCode: 'PAP 20 / 21 Corrugated Cellulose Fibre',
    biodegradability: 'Biodegradable (2–6 weeks if unsoiled)',
    categoryAccuracy: 98.2,
    precisionRating: '98.6% Precision • 97.8% Recall',
    datasetSamplesCount: 2082,
    keyOpticalFeatures: [
      'Matte fibrous surface texture with fluted core ridges',
      'Natural kraft brown or bleached white paperboard matte finish',
      'Creased fold lines, carton flaps, and printed ink labels'
    ],
    identification: 'Corrugated cardboard shipping cartons, cereal cartons, clean kraft paper bags, office documents, and card packaging.',
    immediateAction: 'Keep completely clean and dry; flatten boxes before placing into the paper collection stream.',
    preparation: 'Remove plastic tape, shipping label pouches, polystyrene inserts, and tear away greasy sections.',
    nextStage: 'Pulping mill for re-processing into newsprint, kraft shipping cartons, or paper towels.',
    alternativeRoute: 'Grease-soaked paper (e.g. greasy pizza box bottoms) cannot be recycled; tear off clean lids for recycling and compost the oily base.',
    environmentalTip: 'Cardboard fibers can be recycled 5 to 7 times before the cellulose strands become too short for papermaking.',
    impactFact: 'Recycling 1 ton of cardboard saves 9 cubic yards of landfill space, 7,000 gallons of water, and 46 gallons of oil.',
    steps: [
      {
        step: 1,
        title: 'Remove Plastic Tape',
        action: 'Peel off packing tape and shipping invoice plastic sleeves.',
        icon: 'handyman'
      },
      {
        step: 2,
        title: 'Tear Oily Areas',
        action: 'Keep grease out of paper streams—oil destroys whole pulp batches.',
        icon: 'content_cut'
      },
      {
        step: 3,
        title: 'Flatten Flat',
        action: 'Slit corner tape seams and flatten to save bin capacity.',
        icon: 'compress'
      },
      {
        step: 4,
        title: 'Deposit Dry',
        action: 'Place in designated dry paper bin. Keep sheltered from rain.',
        icon: 'inventory_2'
      }
    ]
  },

  'Metal Can': {
    className: 'Metal Can',
    displayName: 'Aluminium & Tin Cans',
    subHeading: 'Aluminium beverage cans, tinplate food cans & metal containers',
    icon: 'sports_bar',
    stream: 'Metal Recycling',
    binBadge: 'Grey/Blue Metal Bin',
    colorToken: 'metal',
    materialCode: '♺ ALU 41 / FE 40 (Infinitely Recyclable)',
    biodegradability: 'Non-Biodegradable (80–200 yrs oxidation)',
    categoryAccuracy: 95.7,
    precisionRating: '96.3% Precision • 95.0% Recall',
    datasetSamplesCount: 1189,
    keyOpticalFeatures: [
      'Metallic sheen with circular pop-tab or rolled rim profile',
      'Cylindrical metallic wall with printed brand enamel',
      'Concave bottom dome (beverage cans) or corrugated sidewalls (food tins)'
    ],
    identification: 'Aluminium beverage cans, tinplate soup and pet food cans, steel food tins, and aerosol cans (fully discharged).',
    immediateAction: 'Empty completely, give a quick water swirl, and deposit into the metal or dry co-mingled recycling stream.',
    preparation: 'Rinse out food remains. Push sharp lids inside food cans or fold top closed to prevent handling injuries to sanitation personnel.',
    nextStage: 'Foundry re-smelting into aluminium ingots or steel sheets with 95% less energy than virgin bauxite ore smelting.',
    alternativeRoute: 'Do not crush cans if your municipality uses optical sorting conveyor sensors that detect 3D can shape.',
    environmentalTip: 'Aluminium is infinitely recyclable without any loss of structural quality—75% of all aluminium ever produced is still in active use today.',
    impactFact: 'Recycling 1 aluminium can saves enough electricity to run a laptop computer for up to 3 hours.',
    steps: [
      {
        step: 1,
        title: 'Empty Residuals',
        action: 'Pour out beverage dregs or scrape out food remnants.',
        icon: 'water_drop'
      },
      {
        step: 2,
        title: 'Quick Water Rinse',
        action: 'A rapid rinse prevents mold and keeps eddy-current sorters clean.',
        icon: 'cleaning_services'
      },
      {
        step: 3,
        title: 'Push Lid Inside',
        action: 'Tuck loose sharp lids inside the can body to prevent cuts.',
        icon: 'shield'
      },
      {
        step: 4,
        title: 'Place in Metal Bin',
        action: 'Deposit into metals or co-mingled recyclables container.',
        icon: 'delete'
      }
    ]
  },

  'Metal Bottles': {
    className: 'Metal Bottles',
    displayName: 'Reusable Metal Flasks',
    subHeading: 'Stainless steel insulated bottles, durable aluminium sports flasks',
    icon: 'sports_bar',
    stream: 'Reuse / Scrap Metal',
    binBadge: 'Scrap Depot / Reuse',
    colorToken: 'metal',
    materialCode: 'SS 304 / Grade 18/8 Stainless Steel / Alum',
    biodegradability: 'Non-Biodegradable (Decades of Durability)',
    categoryAccuracy: 94.1,
    precisionRating: '94.8% Precision • 93.3% Recall',
    datasetSamplesCount: 300,
    keyOpticalFeatures: [
      'Brushed stainless steel or matte powder-coated metal cylinder',
      'Heavy double-walled vacuum lip and threaded steel neck',
      'Solid metallic bottom base without plastic injection gate'
    ],
    identification: 'Insulated double-walled vacuum flasks, stainless steel sports bottles, aluminium drinkware, and durable metal canisters.',
    immediateAction: 'Inspect condition: prioritize cleaning and reuse or donation before considering disposal.',
    preparation: 'Separate plastic/silicone caps, drinking straws, and rubber protective boots from the stainless body.',
    nextStage: 'If damaged beyond repair, deliver to a municipal scrap metal recovery centre rather than standard curbside bins.',
    alternativeRoute: 'Working bottles can be sanitized and donated to community shelters or sports recreation groups.',
    environmentalTip: 'A single stainless steel bottle used for 3 years prevents over 500 single-use containers from entering landfills.',
    impactFact: 'Stainless steel scrap maintains high commercial value and is 100% recyclable into new surgical, aerospace, or kitchen steel.',
    steps: [
      {
        step: 1,
        title: 'Assess Reusability',
        action: 'Prioritize reuse or donation if insulation is intact.',
        icon: 'volunteer_activism'
      },
      {
        step: 2,
        title: 'Separate Gaskets',
        action: 'Remove silicone O-rings and plastic screw caps.',
        icon: 'tune'
      },
      {
        step: 3,
        title: 'Verify Alloy',
        action: 'Identify food-grade stainless steel (#304) or spun aluminium.',
        icon: 'verified'
      },
      {
        step: 4,
        title: 'Deliver to Scrap Depot',
        action: 'Take to scrap metal facility if dented beyond repair.',
        icon: 'warehouse'
      }
    ]
  },

  'Mixed/Uncertain Waste': {
    className: 'Mixed/Uncertain Waste',
    displayName: 'Mixed / Uncertain Waste',
    subHeading: 'Composite materials, contaminated items, or unverified multi-stream object',
    icon: 'question_mark',
    stream: 'Residual / General Waste',
    binBadge: 'Black Residual Bin',
    colorToken: 'uncertain',
    materialCode: 'Code 07 OTHER / Composite',
    biodegradability: 'Variable / Non-Biodegradable',
    categoryAccuracy: 88.6,
    precisionRating: '89.4% Precision • 87.8% Recall',
    datasetSamplesCount: 2128,
    keyOpticalFeatures: [
      'Multiple bonded materials (foil + plastic + paperboard)',
      'Uncertain or partially occluded object contours',
      'Food-soiled or heavily degraded irregular surfaces'
    ],
    identification: 'Uncertain material identification, multi-layered laminate, heavily soiled item, or blurred optical camera feed.',
    immediateAction: 'Perform a clean, well-lit rescan with only one item in frame; if still uncertain, inspect physical markings.',
    preparation: 'Separate identifiable components (e.g. peel off paper label, remove metal lid) to sort each piece individually.',
    nextStage: 'If materials cannot be separated or verified, dispose in general residual waste to prevent contaminating recycling batches.',
    alternativeRoute: 'Contact your municipal waste authority or check the local waste directory app for bespoke items.',
    environmentalTip: "When in doubt, do not contaminate the recycling stream ('wishcycling' causes entire truckloads of recyclables to be sent to landfill).",
    impactFact: 'Contamination rates over 10% force municipal sorting facilities to reject whole truckloads of recyclable paper and plastic.',
    steps: [
      {
        step: 1,
        title: 'Guided Rescan',
        action: 'Position item in central box with uniform lighting for 5 seconds.',
        icon: 'cached'
      },
      {
        step: 2,
        title: 'Separate Layers',
        action: 'Detach foil liners, tape, or plastic components if possible.',
        icon: 'call_split'
      },
      {
        step: 3,
        title: 'Check Label',
        action: 'Look for on-pack disposal symbols or manufacturer codes.',
        icon: 'search'
      },
      {
        step: 4,
        title: 'Use Residual Bin',
        action: 'If still uncertain, dispose in general waste to protect recycling streams.',
        icon: 'delete'
      }
    ]
  }
}

export const genericFallbackGuidance: WasteCategoryGuidance = {
  className: 'Unclassified Item',
  displayName: 'Unclassified Material',
  subHeading: 'Specific guidance is not calibrated for this detected label',
  icon: 'help_outline',
  stream: 'Manual Verification Required',
  binBadge: 'Check Local Waste Rules',
  colorToken: 'uncertain',
  materialCode: 'Uncalibrated Model Output',
  biodegradability: 'Unknown',
  categoryAccuracy: 80.0,
  precisionRating: 'Calibrating...',
  datasetSamplesCount: 500,
  keyOpticalFeatures: ['Unrecognized optical profile'],
  identification: 'The computer vision model output does not have a mapped disposal dossier in the guidance database.',
  immediateAction: 'Review the manufacturer label on the physical item and consult your municipality waste guidelines.',
  preparation: 'Empty contents, rinse, and separate distinct material parts where safe and practical.',
  nextStage: 'Use a verified municipal collection point or general residual waste as appropriate.',
  environmentalTip: 'Accurate segregation prevents contamination of verified circular recycling streams.',
  impactFact: 'Proper sorting at the point of disposal reduces overall municipal landfill volume by up to 35%.',
  steps: [
    {
      step: 1,
      title: 'Inspect Item Markings',
      action: 'Check for recycling symbols or resin codes.',
      icon: 'search'
    },
    {
      step: 2,
      title: 'Separate Layers',
      action: 'Detach plastic lids, foil wraps, or card liners.',
      icon: 'call_split'
    },
    {
      step: 3,
      title: 'Clean & Dry',
      action: 'Keep dry and free from food waste residue.',
      icon: 'cleaning_services'
    },
    {
      step: 4,
      title: 'Consult Local Rules',
      action: 'Follow municipal waste authority instructions.',
      icon: 'policy'
    }
  ]
}

export function getWasteGuidance(label: string): WasteCategoryGuidance {
  return wasteGuidanceRegistry[label] ?? {
    ...genericFallbackGuidance,
    className: label,
    displayName: label
  }
}
