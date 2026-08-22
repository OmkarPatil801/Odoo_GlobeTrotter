import { motion } from 'motion/react'
import PageContainer from '../components/ui/PageContainer'
import Hero from '../components/dashboard/Hero'
import QuickActions from '../components/dashboard/QuickActions'
import TripsSection from '../components/dashboard/TripsSection'
import DestinationsSection from '../components/dashboard/DestinationsSection'
import BudgetHighlight from '../components/dashboard/BudgetHighlight'
import CTASection from '../components/dashboard/CTASection'
import { fadeSlideUp } from '../utils/motionVariants'

function Dashboard() {
  return (
    <div className="pb-24">
      <Hero />

      <PageContainer className="flex flex-col gap-16 pt-4 sm:gap-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeSlideUp}
        >
          <QuickActions />
        </motion.div>

        <TripsSection />
        <DestinationsSection />
        <BudgetHighlight />
        <CTASection />
      </PageContainer>
    </div>
  )
}

export default Dashboard
