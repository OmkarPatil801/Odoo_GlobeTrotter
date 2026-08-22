const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

export function formatCurrency(amount) {
  return currencyFormatter.format(amount)
}

const dateFormatter = new Intl.DateTimeFormat('en-IN', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

export function formatDate(dateString) {
  return dateFormatter.format(new Date(dateString))
}

export function formatDateRange(startDate, endDate) {
  return `${formatDate(startDate)} — ${formatDate(endDate)}`
}
