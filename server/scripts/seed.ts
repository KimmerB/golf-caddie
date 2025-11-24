import { db } from '../src/lib/db';

const defaults = [
  { name: 'Driver', claimed_distance: 250 },
  { name: '4 Hybrid', claimed_distance: 210 },
  { name: '7 Iron', claimed_distance: 160 },
  { name: 'Pitching Wedge', claimed_distance: 110 }
];

for (const club of defaults) {
  const existing = db.prepare('SELECT id FROM clubs WHERE name = ?').get(club.name);
  if (!existing) {
    db.prepare('INSERT INTO clubs (name, claimed_distance) VALUES (@name, @claimed_distance)').run(club);
    console.log(`Added ${club.name}`);
  }
}

console.log('Seed complete');
