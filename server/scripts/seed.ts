import { db } from '../src/lib/db';

const defaults = [
  { name: 'Driver', claimed_distance: null },
  { name: 'Wood 3', claimed_distance: null },
  { name: 'Wood 5', claimed_distance: null },
  { name: 'Iron 4', claimed_distance: null },
  { name: 'Iron 5', claimed_distance: null },
  { name: 'Iron 6', claimed_distance: null },
  { name: 'Iron 7', claimed_distance: null },
  { name: 'Iron 8', claimed_distance: null },
  { name: 'Iron 9', claimed_distance: null },
  { name: 'Wedge 52°', claimed_distance: null },
  { name: 'Wedge 56°', claimed_distance: null },
  { name: 'Wedge 60°', claimed_distance: null }
];

for (const club of defaults) {
  const existing = db.prepare('SELECT id FROM clubs WHERE name = ?').get(club.name);
  if (!existing) {
    db.prepare('INSERT INTO clubs (name, claimed_distance) VALUES (@name, @claimed_distance)').run(club);
    console.log(`Added ${club.name}`);
  }
}

console.log('Seed complete');
