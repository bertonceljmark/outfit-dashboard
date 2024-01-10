const allowedTypes = ['crosspromo', 'liveops', 'app', 'ads'];

export const validateSave = (
  name: string,
  description: string,
  type: string,
  priority: number,
): string[] => {
  const errors: string[] = [];

  if (!name) {
    errors.push('Name is required');
  }

  if (!description) {
    errors.push('Description is required');
  }

  if (!type) {
    errors.push('Type is required');
  } else if (!allowedTypes.includes(type)) {
    errors.push('Invalid type');
  }

  if (!priority) {
    errors.push('Priority is required');
  } else if (priority < 1 || priority > 10) {
    errors.push('Priority must be between 1 and 10');
  }

  return errors;
};
