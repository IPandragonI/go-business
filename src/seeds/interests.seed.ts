import { INestApplicationContext } from '@nestjs/common';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Interest } from '../modules/interests/entities/interest.entity';

export async function seedInterests(app: INestApplicationContext) {
  const interestRepository = app.get<Repository<Interest>>(getRepositoryToken(Interest));

  const existingInterests = await interestRepository.find();
  if (existingInterests.length > 0) {
    console.log(`Found ${existingInterests.length} existing interests. Removing them...`);
    await interestRepository.remove(existingInterests);
  }

  console.log('Seeding interests...');

  const interests: Partial<Interest>[] = [];
  const interestData = [
    { name: 'Technologie', description: 'Innovation technologique et développement logiciel' },
    { name: 'Numérique', description: 'Solutions numériques et transformation digitale' },
    { name: 'Intelligence Artificielle', description: 'Machine learning et intelligence artificielle' },
    { name: 'Cloud Computing', description: 'Infrastructure cloud et services en ligne' },

    { name: 'Énergies Renouvelables', description: 'Énergie solaire, éolienne et durable' },
    { name: 'Écologie', description: 'Environnement et développement durable' },
    { name: 'Biodiversité', description: 'Protection de la biodiversité et écosystèmes' },

    { name: 'FinTech', description: 'Services financiers innovants et blockchain' },
    { name: 'Investissement', description: 'Placements et gestion de patrimoine' },
    { name: 'Banque Digitale', description: 'Services bancaires numériques' },

    { name: 'Santé Digitale', description: 'Télémédecine et applications santé' },
    { name: 'Bien-être', description: 'Fitness, nutrition et bien-être personnel' },
    { name: 'Biotech', description: 'Biotechnologie et sciences de la vie' },

    { name: 'E-Learning', description: 'Plateforme d\'enseignement en ligne' },
    { name: 'Formation Professionnelle', description: 'Développement des compétences et formation' },
    { name: 'Éducation Tech', description: 'Technologie éducative et apprentissage' },

    { name: 'Commerce Électronique', description: 'Vente en ligne et e-commerce' },
    { name: 'Retail Digital', description: 'Commerce de détail numérisé' },
    { name: 'Logistique', description: 'Supply chain et gestion logistique' },

    { name: 'Immobilier Digital', description: 'PropTech et gestion immobilière' },
    { name: 'Habitat Innovant', description: 'Maisons intelligentes et domotique' },
    { name: 'Construction Durable', description: 'Bâtiments écologiques et durables' },

    { name: 'Mobilité Urbaine', description: 'Transport urbain et micromobilité' },
    { name: 'Véhicules Électriques', description: 'Électrification du transport' },
    { name: 'Smart Mobility', description: 'Solutions de mobilité intelligentes' },

    { name: 'AgriTech', description: 'Technologies agricoles et farming' },
    { name: 'Agriculture Durable', description: 'Pratiques agricoles écologiques' },
    { name: 'Agroalimentaire', description: 'Production et transformation alimentaire' },
  ];

  for (const data of interestData) {
    interests.push(interestRepository.create({
      name: data.name,
      description: data.description,
    } as Partial<Interest>));
  }

  const saved = await interestRepository.save(interests);
  console.log(`✓ Seeded ${saved.length} interests.`);

  return saved;
}

