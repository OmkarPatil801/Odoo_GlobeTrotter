import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ImageIcon, X } from 'lucide-react'
import Field from '../ui/Field'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { adminActivityCategories, adminActivityStatuses } from '../../data/adminActivitiesData'

const blank = {
  name: '',
  destination: '',
  country: '',
  category: 'Landmark',
  price: '',
  duration: '',
  description: '',
  image: '',
  status: 'pending',
}

const selectClass =
  'w-full rounded-full border border-line bg-card px-4 py-3 text-sm text-fg outline-none transition-colors focus:border-brand-500/60'

export function ActivityFormModal({ open, initial, onSave, onClose }) {
  const [form, setForm] = useState(blank)
  const [errors, setErrors] = useState({})
  const [seeded, setSeeded] = useState(null)

  // Re-seed whenever a different record (or "new") is opened.
  if (open && seeded !== (initial?.id ?? 'new')) {
    setForm({
      ...blank,
      ...initial,
      price: initial?.price != null ? String(initial.price) : '',
      duration: initial?.duration != null ? String(initial.duration) : '',
    })
    setErrors({})
    setSeeded(initial?.id ?? 'new')
  }
  if (!open && seeded !== null) setSeeded(null)

  const setValue = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const next = {}
    if (!form.name.trim()) next.name = 'Enter an activity name.'
    if (!form.destination.trim()) next.destination = 'Enter a destination.'
    if (form.price === '' || Number(form.price) < 0) next.price = 'Enter a valid price.'
    if (form.duration === '' || Number(form.duration) <= 0) next.duration = 'Enter a duration.'
    if (!form.description.trim()) next.description = 'Add a short description.'

    setErrors(next)
    if (Object.keys(next).length > 0) return

    onSave({
      ...form,
      name: form.name.trim(),
      destination: form.destination.trim(),
      country: form.country.trim(),
      description: form.description.trim(),
      image: form.image.trim(),
      price: Number(form.price),
      duration: Number(form.duration),
    })
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="absolute inset-0 bg-[#08161f]/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={initial ? 'Edit activity' : 'Add activity'}
            className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-line bg-card shadow-lift"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
              <h2 className="font-display text-base font-semibold text-fg">
                {initial ? 'Edit activity' : 'Add activity'}
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="rounded-full p-1.5 text-muted transition-colors hover:bg-surface-alt hover:text-fg"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} noValidate className="flex min-h-0 flex-1 flex-col">
              <div className="grid flex-1 gap-4 overflow-y-auto p-5 sm:grid-cols-2">
                <Field
                  label="Activity name"
                  htmlFor="ac-name"
                  error={errors.name}
                  className="sm:col-span-2"
                >
                  <Input
                    id="ac-name"
                    value={form.name}
                    onChange={(e) => setValue('name', e.target.value)}
                    placeholder="e.g. Sagrada Familia Tour"
                  />
                </Field>

                <Field label="Destination" htmlFor="ac-destination" error={errors.destination}>
                  <Input
                    id="ac-destination"
                    value={form.destination}
                    onChange={(e) => setValue('destination', e.target.value)}
                    placeholder="e.g. Barcelona"
                  />
                </Field>

                <Field label="Country" htmlFor="ac-country">
                  <Input
                    id="ac-country"
                    value={form.country}
                    onChange={(e) => setValue('country', e.target.value)}
                    placeholder="e.g. Spain"
                  />
                </Field>

                <Field label="Category" htmlFor="ac-category">
                  <select
                    id="ac-category"
                    value={form.category}
                    onChange={(e) => setValue('category', e.target.value)}
                    className={selectClass}
                  >
                    {adminActivityCategories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Status" htmlFor="ac-status">
                  <select
                    id="ac-status"
                    value={form.status}
                    onChange={(e) => setValue('status', e.target.value)}
                    className={selectClass}
                  >
                    {adminActivityStatuses.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Price (₹)" htmlFor="ac-price" error={errors.price}>
                  <Input
                    id="ac-price"
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={(e) => setValue('price', e.target.value)}
                    placeholder="0"
                  />
                </Field>

                <Field label="Duration (hours)" htmlFor="ac-duration" error={errors.duration}>
                  <Input
                    id="ac-duration"
                    type="number"
                    min="0"
                    step="0.5"
                    value={form.duration}
                    onChange={(e) => setValue('duration', e.target.value)}
                    placeholder="0"
                  />
                </Field>

                <Field
                  label="Description"
                  htmlFor="ac-description"
                  error={errors.description}
                  className="sm:col-span-2"
                >
                  <textarea
                    id="ac-description"
                    rows={2}
                    value={form.description}
                    onChange={(e) => setValue('description', e.target.value)}
                    placeholder="What does this activity include?"
                    className="w-full resize-none rounded-2xl border border-line bg-card px-4 py-3 text-sm text-fg placeholder:text-muted outline-none transition-colors focus:border-brand-500/60"
                  />
                </Field>

                <Field
                  label="Image URL"
                  htmlFor="ac-image"
                  hint="Paste a public image URL"
                  className="sm:col-span-2"
                >
                  <Input
                    id="ac-image"
                    icon={ImageIcon}
                    value={form.image}
                    onChange={(e) => setValue('image', e.target.value)}
                    placeholder="https://images.unsplash.com/…"
                  />
                </Field>

                {form.image && (
                  <div className="sm:col-span-2">
                    <img
                      src={form.image}
                      alt=""
                      className="h-32 w-full rounded-xl border border-line object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 border-t border-line p-5">
                <Button type="button" variant="secondary" size="md" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" size="md">
                  {initial ? 'Save changes' : 'Add activity'}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ActivityFormModal
