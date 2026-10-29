export function isValidDateString(value) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function formatDate(dateString) {
  if (!dateString) return '';

  const date = new Date(`${dateString}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) return dateString;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export function isOverdue(dateString) {
  if (!dateString) return false;

  const dueDate = new Date(`${dateString}T23:59:59.999Z`);
  return dueDate < new Date();
}

export function todayString() {
  return new Date().toISOString().slice(0, 10);
}
