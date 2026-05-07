const db = require('./db.js');

const artifacts = [
  {
    name: 'Rosetta Stone',
    description: 'An ancient Egyptian stone stele inscribed with a decree issued at Memphis in 196 BC on behalf of King Ptolemy V.',
    country_id: 1,
    site: 'Rashid (Rosetta)',
    image_url: '/artifacts/rosetta_stone.png'
  },
  {
    name: 'Terracotta Soldier',
    description: 'A life-sized clay sculpture representing the armies of Qin Shi Huang, the first Emperor of China.',
    country_id: 6,
    site: 'Xi\'an',
    image_url: '/artifacts/terracotta_soldier.png'
  },
  {
    name: 'Bust of Nefertiti',
    description: 'A painted limestone bust of Nefertiti, the Great Royal Wife of the Egyptian Pharaoh Akhenaten.',
    country_id: 1,
    site: 'Amarna',
    image_url: '/artifacts/nefertiti_bust.png'
  },
  {
    name: 'Incan Ritual Vessel',
    description: 'A finely crafted ceramic vessel used in spiritual ceremonies at Machu Picchu.',
    country_id: 4,
    site: 'Machu Picchu',
    image_url: '/artifacts/machu_picchu_pottery.png'
  },
  {
    name: 'Parthenon Frieze Section',
    description: 'A high-relief marble sculpture that originally decorated the upper part of the Parthenon\'s naos.',
    country_id: 2,
    site: 'Athens',
    image_url: '/artifacts/parthenon_frieze.png'
  }
];

async function seed() {
  try {
    for (const art of artifacts) {
      await db.query(
        'INSERT INTO artifacts (name, description, country_id, site, image_url) VALUES (?, ?, ?, ?, ?)',
        [art.name, art.description, art.country_id, art.site, art.image_url]
      );
      console.log(`Inserted: ${art.name}`);
    }
    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding artifacts:', err);
    process.exit(1);
  }
}

seed();
