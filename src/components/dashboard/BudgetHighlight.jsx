import SectionHeading from '../ui/SectionHeading'
import BudgetCard from './BudgetCard'
import { budgetSummary } from '../../data/mockData'

export function BudgetHighlight() {
  return (
    <section>
      <SectionHeading eyebrow="Budget snapshot" title="Your Travel Budget" />
      <BudgetCard summary={budgetSummary} className="mt-6" />
    </section>
  )
}

export default BudgetHighlight
