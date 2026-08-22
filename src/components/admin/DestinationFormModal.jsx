import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ImageIcon, X } from 'lucide-react'
import Field from '../ui/Field'
import Input from '../ui/Input'
import Button from '../ui/Button'
import {
  adminDestinationCategories,
  adminDestinationRegions,
  adminDestinationStatusOptions,
} from '../../data/adminDestinationsData'

const blank = {
  name: '',
  country: '',
  region: 'Europe',
  category: 'City',
  description: '',
  image: '',
  status: 'draft',
}

const selectClass =
  'w-full rounded-full border border-line bg-card px-4 py-3 text-sm text-fg outline-none transition-colors focus:border-brand-500/60'

export function DestinationFormModal({ open, initial, onSave, onClose }) {
  const [form, setForm] = useState(blank)
  const [errors, setErrors] = useState({})
  const [seeded, setSeeded] = useState(null)

  // Re-seed the form whenever a different record (or "new") is opened.
  if (open && seeded !== (initial?.id ?? 'new')) {
    setForm({ ...blank, ...initial })
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
    if (!form.name.trim()) next.name = 'Enter a destination name.'
    if (!form.country.trim()) next.country = 'Enter a country.'
    if (!form.description.trim()) next.description = 'Add a short description.'

    setErrors(next)
    if (Object.keys(next).length > 0) return

    onSave({
      ...form,
      name: form.name.trim(),
      country: form.country.trim(),
      description: form.description.trim(),
      image: form.image.trim(),
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
            aria-label={initial ? 'Edit destination' : 'Add destination'}
            className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-line bg-card shadow-lift"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
              <h2 className="font-display text-base font-semibold text-fg">
                {initial ? 'Edit destination' : 'Add destination'}
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
                <Field label="Destination name" htmlFor="d-name" error={errors.name}>
                  <Input
                    id="d-name"
                    value={form.name}
                    onChange={(e) => setValue('name', e.target.value)}
                    placeholder="e.g. Lisbon"
                  />
                </Field>

                <Field label="Country" htmlFor="d-country" error={errors.country}>
                  <Input
                    id="d-country"
                    value={form.country}
                    onChange={(e) => setValue('country', e.target.value)}
                    placeholder="e.g. Portugal"
                  />
                </Field>

                <Field label="Region" htmlFor="d-region">
                  <select
                    id="d-region"
                    value={form.region}
                    onChange={(e) => setValue('region', e.target.value)}
                    className={selectClass}
                  >
                    {adminDestinationRegions.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Category" htmlFor="d-category">
                  <select
                    id="d-category"
                    value={form.category}
                    onChange={(e) => setValue('category', e.target.value)}
                    className={selectClass}
                  >
                    {adminDestinationCategories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field
                  label="Description"
                  htmlFor="d-description"
                  error={errors.description}
                  className="sm:col-span-2"
                >
                  <textarea
                    id="d-description"
                    rows={2}
                    value={form.description}
                    onChange={(e) => setValue('description', e.target.value)}
                    placeholder="What makes this destination worth visiting?"
                    className="w-full resize-none rounded-2xl border border-line bg-card px-4 py-3 text-sm text-fg placeholder:text-muted outline-none transition-colors focus:border-brand-500/60"
                  />
                </Field>

                <Field
                  label="Image URL"
                  htmlFor="d-image"
                  hint="Paste a public image URL"
                  className="sm:col-span-2"
                >
                  <Input
                    id="d-image"
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

                <Field label="Status" htmlFor="d-status">
                  <select
                    id="d-status"
                    value={form.status}
                    onChange={(e) => setValue('status', e.target.value)}
                    className={selectClass}
                  >
                    {adminDestinationStatusOptions.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <div className="flex justify-end gap-2 border-t border-line p-5">
                <Button type="button" variant="secondary" size="md" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" size="md">
                  {initial ? 'Save changes' : 'Add destination'}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default DestinationFormModal
