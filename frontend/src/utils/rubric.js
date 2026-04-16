// HLP Tracker Implementation Reflection Rubric
// Total Possible Score: 24 (6 criteria × 4 points each)

export const RUBRIC_SCORE_LABELS = {
  4: "Exceeds Expectations",
  3: "Meets Expectations",
  2: "Approaching Expectations",
  1: "Does Not Yet Meet Expectations",
};

export const RUBRIC_CRITERIA = [
  {
    key: "criterion_self_rating",
    label: "Self-Rating Alignment & Justification",
    scores: {
      4: "Self-rating is selected and well-justified with strong alignment between evidence and level of implementation.",
      3: "Self-rating is selected and generally supported by reflection evidence.",
      2: "Self-rating is selected but only partially supported by reflection.",
      1: "Self-rating is missing, unclear, or not supported.",
    },
  },
  {
    key: "criterion_hlp_alignment",
    label: "HLP Implementation & Look-For Alignment",
    scores: {
      4: "Reflection explicitly addresses the selected HLP Look-For with clear, observable examples and detailed explanation.",
      3: "Reflection addresses the Look-For with relevant examples and explanation.",
      2: "Look-For is referenced but explanation is vague or loosely connected.",
      1: "Look-For is not clearly addressed or is misaligned.",
    },
  },
  {
    key: "criterion_evidence_growth",
    label: "Evidence & Growth Over Time",
    scores: {
      4: "Clear demonstration of professional growth over time with specific evidence.",
      3: "Some growth is demonstrated with supporting evidence.",
      2: "Growth is mentioned but lacks depth or evidence.",
      1: "No growth over time demonstrated.",
    },
  },
  {
    key: "criterion_specific_evidence",
    label: "Use of Specific Evidence",
    scores: {
      4: "Multiple specific examples provide evidence to clearly support claims.",
      3: "At least one relevant specific example is provided to support claim.",
      2: "Evidence is general or insufficiently specific.",
      1: "Little to no evidence provided.",
    },
  },
  {
    key: "criterion_next_steps",
    label: "Next Steps for Continued Growth",
    scores: {
      4: "Next steps are clear, specific, and professionally relevant.",
      3: "Next steps are identified and relevant.",
      2: "Next steps are vague or generic.",
      1: "No next steps identified.",
    },
  },
  {
    key: "criterion_organization",
    label: "Organization & Professional Quality",
    scores: {
      4: "Writing is clear, well-organized, and professional at the expected level.",
      3: "Writing is organized and professional with minor issues.",
      2: "Organization or clarity interferes somewhat with understanding.",
      1: "Writing is unclear, disorganized, or unprofessional.",
    },
  },
];

export const RUBRIC_MAX_SCORE = RUBRIC_CRITERIA.length * 4; // 24

/**
 * Compute the total rubric score from a criteria scores object.
 * Returns null if no criteria have been scored yet.
 */
export function computeRubricTotal(criteriaScores) {
  const values = RUBRIC_CRITERIA.map((c) => criteriaScores[c.key]).filter(
    (v) => v != null && v > 0
  );
  if (values.length === 0) return null;
  return values.reduce((sum, v) => sum + v, 0);
}

/**
 * Returns a default all-zero criteria scores object.
 */
export function defaultCriteriaScores() {
  return Object.fromEntries(RUBRIC_CRITERIA.map((c) => [c.key, 0]));
}
