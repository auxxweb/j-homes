export const stages = [
  { id: 'have-land', label: 'I have land' },
  { id: 'need-land', label: 'I need land' },
  { id: 'have-design', label: 'I have a design' },
  { id: 'turnkey', label: 'I want complete turnkey' },
] as const

export type StageId = (typeof stages)[number]['id']

export const budgetOptions = [
  { id: 'discuss', label: 'Prefer to discuss' },
  { id: 'under-25', label: 'Under ₹25 lakh' },
  { id: '25-50', label: '₹25–50 lakh' },
  { id: '50-100', label: '₹50 lakh–1 crore' },
  { id: 'above-100', label: 'Above ₹1 crore' },
] as const

export type BudgetId = (typeof budgetOptions)[number]['id']

export function stageLabel(id: string) {
  return stages.find((stage) => stage.id === id)?.label ?? id
}

export function budgetLabel(id: string) {
  return budgetOptions.find((option) => option.id === id)?.label ?? id
}

export function isStageId(value: string): value is StageId {
  return stages.some((stage) => stage.id === value)
}
