// EVS QUIZ - 01 Questions Data (Subject: Ecosystems)
// Acharya Institutes - Team 1
const QUIZ_DATA = {
  title: "EVS QUIZ - 01",
  subject: "Environmental Studies (EVS)",
  topic: "Ecosystem - Structure, Function, Services & Threats",
  totalQuestions: 15,
  passingScore: 8,
  questions: [
    {
      id: 1,
      question: "What is the primary definition of an ecosystem?",
      options: {
        A: "A community of only living organisms",
        B: "A self-sustaining functional unit where living organisms interact with each other and non-living components",
        C: "The total number of plants and animals in a region",
        D: "The climate patterns of a specific region"
      },
      correctAnswer: "B",
      explanation: "An ecosystem includes both biotic (living) and abiotic (non-living) components working together as a functional unit.",
      topic: "Ecosystem Definition & Components",
      difficulty: "Easy"
    },
    {
      id: 2,
      question: "Which of the following is NOT an abiotic component of an ecosystem?",
      options: {
        A: "Light and temperature",
        B: "Water and soil",
        C: "Bacteria and fungi",
        D: "Air and minerals"
      },
      correctAnswer: "C",
      explanation: "Bacteria and fungi are biotic components (living organisms) that act as decomposers. Abiotic components are non-living factors.",
      topic: "Ecosystem Definition & Components",
      difficulty: "Medium"
    },
    {
      id: 3,
      question: "In the structure of an ecosystem (APCD model), what do 'Producers' refer to?",
      options: {
        A: "Organisms that decompose dead matter",
        B: "Green plants and algae that prepare food through photosynthesis",
        C: "Herbivores and carnivores that consume other organisms",
        D: "Microorganisms found in soil"
      },
      correctAnswer: "B",
      explanation: "Producers are autotrophs that form the first trophic level by fixing solar energy through photosynthesis (P in APCD model).",
      topic: "Ecosystem Definition & Components",
      difficulty: "Medium"
    },
    {
      id: 4,
      question: "Which ecosystem is characterized by very low rainfall and extreme temperature differences between day and night?",
      options: {
        A: "Forest ecosystem",
        B: "Wetland ecosystem",
        C: "Desert ecosystem",
        D: "Riverine ecosystem"
      },
      correctAnswer: "C",
      explanation: "Deserts have minimal rainfall and significant temperature fluctuations due to lack of vegetation and water.",
      topic: "Specific Ecosystems (Desert)",
      difficulty: "Easy"
    },
    {
      id: 5,
      question: "What is a key adaptation of cacti in desert ecosystems?",
      options: {
        A: "Deep branching roots to absorb oxygen",
        B: "Water storage in stems and spines instead of broad leaves",
        C: "Thick leaves to trap moisture",
        D: "Production of flowers for photosynthesis"
      },
      correctAnswer: "B",
      explanation: "Cacti store water in their stems and have spines instead of broad leaves to minimize water loss through transpiration.",
      topic: "Specific Ecosystems (Desert)",
      difficulty: "Medium"
    },
    {
      id: 6,
      question: "Which of the following is an example of wetland areas?",
      options: {
        A: "Sand dunes and rocky plateaus",
        B: "Marshes, swamps and shallow lakes",
        C: "Dense forests and grasslands",
        D: "Mountain peaks and cliffs"
      },
      correctAnswer: "B",
      explanation: "Wetlands are water-saturated areas including marshes, swamps, and shallow water bodies where water covers or saturates the soil.",
      topic: "Specific Ecosystems (Wetland)",
      difficulty: "Easy"
    },
    {
      id: 7,
      question: "What is the primary function of wetland ecosystems?",
      options: {
        A: "Carbon production only",
        B: "Flood control, groundwater recharge, water purification and carbon storage",
        C: "Desert formation",
        D: "Ocean water salinity maintenance"
      },
      correctAnswer: "B",
      explanation: "Wetlands provide crucial ecosystem services including flood control, water purification, groundwater recharge, and carbon storage.",
      topic: "Specific Ecosystems (Wetland)",
      difficulty: "Medium"
    },
    {
      id: 8,
      question: "In a riverine ecosystem, how do energy and nutrients move through the system?",
      options: {
        A: "From land to the ocean",
        B: "Downstream with the flowing water",
        C: "From deep to shallow areas",
        D: "Upstream against the current"
      },
      correctAnswer: "B",
      explanation: "In riverine ecosystems, energy and nutrients flow downstream with the water current due to the unidirectional flow of rivers.",
      topic: "Specific Ecosystems (Riverine)",
      difficulty: "Medium"
    },
    {
      id: 9,
      question: "Which of the following is a typical producer in an oceanic ecosystem?",
      options: {
        A: "Fish and turtles",
        B: "Seabirds and marine mammals",
        C: "Phytoplankton and algae",
        D: "Bacteria and decomposers"
      },
      correctAnswer: "C",
      explanation: "Phytoplankton and algae are photosynthetic organisms forming the base of ocean food chains as primary producers.",
      topic: "Specific Ecosystems (Oceanic)",
      difficulty: "Easy"
    },
    {
      id: 10,
      question: "What happens to energy as it moves through successive trophic levels in an ecosystem?",
      options: {
        A: "Energy increases at each level",
        B: "Energy remains constant",
        C: "Energy decreases at successive levels",
        D: "Energy cycles indefinitely without loss"
      },
      correctAnswer: "C",
      explanation: "Energy decreases at each trophic level (approximately 10% efficiency), unlike nutrients which are recycled indefinitely.",
      topic: "Energy Flow & Food Chains",
      difficulty: "Difficult"
    },
    {
      id: 11,
      question: "Which of the following represents a correct food chain?",
      options: {
        A: "Hawk → Bird → Caterpillar → Leaves",
        B: "Leaves → Caterpillar → Bird → Hawk",
        C: "Caterpillar → Hawk → Bird → Leaves",
        D: "Bird → Leaves → Caterpillar → Hawk"
      },
      correctAnswer: "B",
      explanation: "Energy flows from producers (leaves) through primary consumers (caterpillar) to secondary consumers (bird) to top predators (hawk).",
      topic: "Energy Flow & Food Chains",
      difficulty: "Difficult"
    },
    {
      id: 12,
      question: "What is an example of a provisioning ecosystem service?",
      options: {
        A: "Climate regulation and pollination",
        B: "Nutrient cycling and soil formation",
        C: "Food, freshwater, timber and fish",
        D: "Water purification and flood control"
      },
      correctAnswer: "C",
      explanation: "Provisioning services provide direct resources like food, water, timber, and fisheries that humans utilize for survival and livelihood.",
      topic: "Ecosystem Services & Threats",
      difficulty: "Medium"
    },
    {
      id: 13,
      question: "Which of the following is a major threat to ecosystems?",
      options: {
        A: "Increased photosynthesis",
        B: "Deforestation, habitat destruction, pollution and climate change",
        C: "More biodiversity",
        D: "Better water circulation"
      },
      correctAnswer: "B",
      explanation: "Major threats include deforestation, pollution, habitat destruction, climate change, overexploitation of resources, and invasive species.",
      topic: "Ecosystem Services & Threats",
      difficulty: "Difficult"
    },
    {
      id: 14,
      question: "What is the main role of decomposers in an ecosystem?",
      options: {
        A: "Produce energy through photosynthesis",
        B: "Consume herbivores and other animals",
        C: "Break down dead matter and return nutrients to the environment",
        D: "Regulate water temperature"
      },
      correctAnswer: "C",
      explanation: "Decomposers (bacteria and fungi) are essential for nutrient cycling by breaking down dead organic matter and returning nutrients to soil.",
      topic: "Ecosystem Services & Threats",
      difficulty: "Medium"
    },
    {
      id: 15,
      question: "Which ecosystem is described as the largest aquatic ecosystem and plays a crucial role in climate regulation and oxygen production?",
      options: {
        A: "Riverine ecosystem",
        B: "Wetland ecosystem",
        C: "Forest ecosystem",
        D: "Oceanic ecosystem"
      },
      correctAnswer: "D",
      explanation: "The oceanic ecosystem is the largest and most productive, responsible for climate regulation and producing significant amounts of oxygen through phytoplankton photosynthesis.",
      topic: "Specific Ecosystems (Oceanic)",
      difficulty: "Easy"
    }
  ],
  difficultySummary: {
    Easy: [1, 4, 6, 9, 15],
    Medium: [2, 3, 5, 7, 8, 12, 14],
    Difficult: [10, 11, 13]
  },
  topics: [
    "Ecosystem Definition & Components",
    "Specific Ecosystems",
    "Energy Flow & Food Chains",
    "Ecosystem Services & Threats"
  ]
};

if (typeof window !== 'undefined') {
  window.QUIZ_DATA = QUIZ_DATA;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = QUIZ_DATA;
}
