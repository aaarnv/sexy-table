const people = {
  Maya: { name: 'Maya Chen', avatar: '/assets/avatar-5.jpg' },
  Leo: { name: 'Leo Hartman', avatar: '/assets/avatar-12.jpg' },
  Priya: { name: 'Priya Raman', avatar: '/assets/avatar-16.jpg' },
  Harsh: { name: 'Harsh Singh', avatar: '/assets/avatar-harsh.webp' },
  Elena: { name: 'Elena Rossi', avatar: '/assets/avatar-26.jpg' },
  Tom: { name: 'Tom Okafor', avatar: '/assets/avatar-60.jpg' },
  Sam: { name: 'Sam Whitaker', avatar: '/assets/avatar-59.jpg' },
};
function issue(number, title, priority, state, estimate, label, due, assignees) {
  return { id: `issue-${number}`, title, priority, pull: { number, state }, estimate, label, due, assignees: assignees.map(name => people[name]) };
}
export const initialGroups = [
  { status: 'In Review', icon: 'in-review', issues: [
    issue(1184, 'Cache map tiles for the last region viewed', 'medium', 'open', 2, 'Performance', 'Mar 12', ['Maya', 'Leo']),
    issue(1179, 'Write the copy for the location prompt', 'low', 'open', 1, 'Design', 'Mar 6', ['Priya', 'Harsh']),
    issue(1172, 'Larger type in the route sheet', 'medium', 'draft', 1, 'Design', 'Mar 6', ['Harsh', 'Elena', 'Tom']),
  ] },
  { status: 'In Progress', icon: 'in-progress', issues: [
    issue(1168, 'Resolve pin conflicts between devices', 'urgent', 'open', 3, 'Bug', 'Mar 6', ['Leo', 'Maya']),
    issue(1161, 'Download regions over Wi-Fi only', 'high', 'draft', 2, 'Feature', 'Mar 9', ['Elena']),
    issue(1157, 'Invite people to a list by link', 'medium', 'closed', 2, 'Feature', 'Mar 11', ['Tom', 'Harsh', 'Sam']),
  ] },
  { status: 'Todo', icon: 'todo', issues: [
    issue(1150, 'Drop deleted pins after thirty days', 'medium', 'draft', 1, 'Sync', 'Apr 14', ['Sam', 'Priya']),
    issue(1146, 'Rotate the sync service’s signing keys', 'high', 'closed', 1, 'Sync', 'Apr 14', ['Harsh', 'Maya']),
    issue(1141, 'Check contrast on the night map style', 'low', 'draft', 1, 'Design', 'Apr 9', ['Priya']),
    issue(1137, 'Restore a backup to a fresh account', 'no', 'open', 2, 'Bug', 'Mar 18', ['Tom', 'Elena']),
  ] },
  { status: 'Done', icon: 'done', issues: [
    issue(1129, 'Measure the tile cache on a nearly full phone', 'medium', 'merged', 3, 'Performance', 'Mar 2', ['Leo', 'Harsh']),
    issue(1118, 'Pick a storage engine for saved places', 'high', 'merged', 1, 'Docs', 'Feb 26', ['Maya', 'Sam', 'Harsh']),
    issue(1104, 'Decide who can edit a shared list', 'low', 'merged', 1, 'Feature', 'Feb 20', ['Elena', 'Priya']),
  ] },
];
