export type MatchRule =
  | { mode: 'exact' | 'normalized'; case_sensitive?: boolean; normalize_whitespace?: boolean }
  | { mode: 'regex'; pattern: string; case_sensitive?: boolean };

const normalize = (s: string, ws = true, cs = false) => {
  let t = s;
  if (ws) t = t.trim().replace(/\s+/g, ' ');
  if (!cs) t = t.toLowerCase();
  return t;
};

export const isAnswerValid = (
  input: string,
  validAnswers: string[],
  rule: MatchRule
): boolean => {
  if (rule.mode === 'regex') {
    const re = new RegExp(rule.pattern, rule.case_sensitive ? '' : 'i');
    return re.test(input);
  }
  if (rule.mode === 'normalized') {
    const i = normalize(input, rule.normalize_whitespace !== false, !!rule.case_sensitive);
    return validAnswers.some(a => normalize(a, rule.normalize_whitespace !== false, !!rule.case_sensitive) === i);
  }
  // exact (but optionally case-insensitive)
  const i = rule.case_sensitive ? input : input.toLowerCase();
  return validAnswers.some(a => (rule.case_sensitive ? a : a.toLowerCase()) === i);
};

