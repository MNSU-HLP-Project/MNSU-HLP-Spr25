// Student self-rating options (used on the Entry model)
export const SCORE_OPTIONS = [
  {
    value: 1,
    label: "Not Yet Implemented",
    description:
      "I have not attempted this HLP in my practice. I may be unfamiliar with the practice or unsure how it applies to my role. No evidence of intentional use.",
  },
  {
    value: 2,
    label: "Awareness",
    description:
      "I understand the purpose and definition of the HLP. I can describe what the practice should look like. I have not yet applied the practice or have only done so incidentally. Implementation is inconsistent or unintentional.",
  },
  {
    value: 3,
    label: "Beginning Implementation",
    description:
      "I have attempted the HLP in limited or low‑stakes situations. Implementation is inconsistent and may rely on trial and error. I am still building confidence and may need frequent support, prompts, or guidance. Evidence is minimal or informal.",
  },
  {
    value: 4,
    label: "Emerging Implementation",
    description:
      "I use the HLP intentionally and regularly, but not yet consistently across contexts. I can explain why and when I use the practice. Implementation may vary depending on time, setting, or complexity. I am beginning to reflect on effectiveness and make adjustments. Evidence is present but may not yet be systematic.",
  },
  {
    value: 5,
    label: "Proficient Implementation",
    description:
      "I implement the HLP consistently and effectively across settings. My use of the practice is intentional, data‑informed, and aligned to student needs. I can clearly articulate the impact on student learning, behavior, or collaboration. I independently refine my practice based on reflection and feedback. Evidence is clear, organized, and observable.",
  },
];

export const SCORE_LABELS = Object.fromEntries(
  SCORE_OPTIONS.map((o) => [o.value, o.label])
);

// Rubric score labels used per-criterion by supervisors (1–4)
export const RUBRIC_CRITERION_SCORE_OPTIONS = [
  { value: 4, label: "Exceeds Expectations", short: "Exceeds (4)" },
  { value: 3, label: "Meets Expectations", short: "Meets (3)" },
  { value: 2, label: "Approaching Expectations", short: "Approaching (2)" },
  { value: 1, label: "Does Not Yet Meet Expectations", short: "Does Not Yet Meet (1)" },
];
