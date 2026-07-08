export const createStatus = ({
  member,
  task,
  activity,
  status,
  deliverable,
  comments,
}) => ({
  id: crypto.randomUUID(),
  member,
  task,
  activity,
  status,
  deliverable,
  comments,
  createdAt: new Date().toISOString(),
});