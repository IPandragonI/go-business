import { faker } from '@faker-js/faker';
import { INestApplicationContext } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Category } from '../modules/categories/entities/category.entity';
import { Interest } from '../modules/interests/entities/interest.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

export async function seedCategories(app: INestApplicationContext, interests: Interest[] = []) {
  const categoryRepository = app.get<Repository<Category>>(getRepositoryToken(Category));

  const existingCategories = await categoryRepository.find();
  if (existingCategories.length > 0) {
    console.log(`Found ${existingCategories.length} existing categories. Removing them...`);
    await categoryRepository.remove(existingCategories);
  }

  console.log('Seeding categories...');

  const categories: Partial<Category>[] = [];

  const categoryData = [
    { name: 'Développement Web', interests: ['Technologie', 'Numérique', 'Cloud Computing'] },
    { name: 'Développement Mobile', interests: ['Technologie', 'Numérique'] },
    { name: 'Data & Analytics', interests: ['Intelligence Artificielle', 'Numérique'] },
    { name: 'Cybersécurité', interests: ['Technologie', 'Numérique', 'Cloud Computing'] },
    { name: 'Infrastructure IT', interests: ['Cloud Computing', 'Numérique'] },

    { name: 'Énergie Solaire', interests: ['Énergies Renouvelables', 'Écologie'] },
    { name: 'Énergie Éolienne', interests: ['Énergies Renouvelables', 'Écologie'] },
    { name: 'Gestion des Déchets', interests: ['Écologie', 'Biodiversité'] },
    { name: 'Conservation', interests: ['Biodiversité', 'Écologie'] },

    { name: 'Paiement Digital', interests: ['FinTech', 'Technologie', 'Banque Digitale'] },
    { name: 'Gestion de Patrimoine', interests: ['Investissement', 'FinTech'] },
    { name: 'Crypto & Blockchain', interests: ['FinTech', 'Technologie'] },
    { name: 'Assurance Digital', interests: ['FinTech', 'Numérique'] },

    { name: 'Télémédecine', interests: ['Santé Digitale', 'Technologie'] },
    { name: 'Fitness & Wellness', interests: ['Bien-être', 'Santé Digitale'] },
    { name: 'Dispositifs Médicaux', interests: ['Biotech', 'Santé Digitale'] },
    { name: 'Nutrition', interests: ['Bien-être', 'Agroalimentaire'] },

    { name: 'Plateforme E-Learning', interests: ['E-Learning', 'Numérique', 'Technologie'] },
    { name: 'Formation Bootcamp', interests: ['Formation Professionnelle', 'Éducation Tech'] },
    { name: 'EdTech Innovation', interests: ['Éducation Tech', 'Technologie'] },

    { name: 'Plateforme E-Commerce', interests: ['Commerce Électronique', 'Numérique'] },
    { name: 'Last-Mile Delivery', interests: ['Logistique', 'Mobilité Urbaine'] },
    { name: 'Gestion de Stock', interests: ['Logistique', 'Numérique'] },

    { name: 'PropTech', interests: ['Immobilier Digital', 'Technologie'] },
    { name: 'Domotique', interests: ['Habitat Innovant', 'Technologie'] },
    { name: 'Construction Verte', interests: ['Construction Durable', 'Écologie'] },

    { name: 'Véhicule Électrique', interests: ['Véhicules Électriques', 'Énergies Renouvelables'] },
    { name: 'Micromobilité', interests: ['Mobilité Urbaine', 'Écologie'] },
    { name: 'Transport Intelligent', interests: ['Smart Mobility', 'Technologie'] },

    { name: 'Precision Farming', interests: ['AgriTech', 'Technologie'] },
    { name: 'Agriculture Biologique', interests: ['Agriculture Durable', 'Écologie'] },
    { name: 'Transformation Alimentaire', interests: ['Agroalimentaire', 'Numérique'] },
  ];

  for (const data of categoryData) {
    const categoryInterests = interests.filter(i => data.interests.includes(i.name));

    const category = categoryRepository.create({
      name: data.name,
      description: faker.lorem.sentence(),
      interests: categoryInterests,
    } as Partial<Category>);
    categories.push(category);
  }

  const saved = await categoryRepository.save(categories);
  console.log(`✓ Seeded ${saved.length} categories.`);

  return saved;
}