import { useState } from 'react'
import { motion } from 'motion/react'
import { CalendarDays } from 'lucide-react'
import Card from '../ui/Card'
import Field from '../ui/Field'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { itinerarySectionTypes } from '../../data/mockData'

const blank = {
  title: '',
  type: 'activity',
  description: '',
  startDate: '',
  endDate: '',
  budget: '',
}

export function SectionForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(() => ({
    ...blank,
    ...initial,
    budget: initial?.budget != null ? String(initial.budget) : '',
  }))
  const [errors, setErrors] = useState({})

  const setValue = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const next = {}
    if (!form.title.trim()) next.title = 'Add a title.'
    if (!form.startDate) next.startDate = 'Choose a start date.'
    if (!form.endDate) next.endDate = 'Choose an end date.'
    if (form.startDate && form.endDate && form.endDate < form.startDate) {
      next.endDate = 'End date must be on or after the start date.'
    }
    if (form.budget === '' || Number(form.budget) < 0) next.budget = 'Enter a valid budget.'

    setErrors(next)
    if (Object.keys(next).length > 0) return

    onSave({
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      budget: Number(form.budget),
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card className="border-brand-500/40 p-5 sm:p-6">
        <form onSubmit={handleSubmit} noValidate className="grid gap-4 sm:grid-cols-2">
          <Field label="Title" htmlFor="sec-title" error={errors.title}>
            <Input
              id="sec-title"
              value={form.title}
              onChange={(e) => setValue('title', e.target.value)}
              placeholder="e.g. Seine River Cruise"
            />
          </Field>

          <Field label="Type" htmlFor="sec-type">
            <select
              id="sec-type"
              value={form.type}
              onChange={(e) => setValue('type', e.target.value)}
              className="w-full rounded-full border border-line bg-card px-4 py-3 text-sm text-fg outline-none transition-colors focus:border-brand-500/60"
            >
              {itinerarySectionTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Description" htmlFor="sec-desc" className="sm:col-span-2">
            <textarea
              id="sec-desc"
              rows={2}
              value={form.description}
              onChange={(e) => setValue('description', e.target.value)}
              placeholder="What happens during this part of the trip?"
              className="w-full resize-none rounded-2xl border border-line bg-card px-4 py-3 text-sm text-fg placeholder:text-muted outline-none transition-colors focus:border-brand-500/60"
            />
          </Field>

          <Field label="Start date" htmlFor="sec-start" error={errors.startDate}>
            <Input
              id="sec-start"
              type="date"
              icon={CalendarDays}
              value={form.startDate}
              onChange={(e) => setValue('startDate', e.target.value)}
            />
          </Field>

          <Field label="End date" htmlFor="sec-end" error={errors.endDate}>
            <Input
              id="sec-end"
              type="date"
              icon={CalendarDays}
              min={form.startDate || undefined}
              value={form.endDate}
              onChange={(e) => setValue('endDate', e.target.value)}
            />
          </Field>

          <Field label="Budget (₹)" htmlFor="sec-budget" error={errors.budget}>
            <Input
              id="sec-budget"
              type="number"
              min="0"
              value={form.budget}
              onChange={(e) => setValue('budget', e.target.value)}
              placeholder="0"
            />
          </Field>

          <div className="flex items-end gap-2.5">
            <Button type="submit" size="md">
              Save
            </Button>
            <Button type="button" variant="secondary" size="md" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  )
}

export default SectionForm
