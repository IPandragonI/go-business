import { INestApplicationContext } from '@nestjs/common';
import { User } from '../modules/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Project } from '../modules/projects/entities/project.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Category } from '../modules/categories/entities/category.entity';

export async function seedProjects(app: INestApplicationContext, categories: Category[] = [], contractors: User[]) {
  const projectRepository = app.get<Repository<Project>>(getRepositoryToken(Project));

  const existingProjects = await projectRepository.find();
  if (existingProjects.length > 0) {
    console.log(`Found ${existingProjects.length} existing projects. Removing them...`);
    await projectRepository.remove(existingProjects);
  }

  console.log('Seeding projects...');

  const projects: Partial<Project>[] = [];

  const categoryMap = new Map(categories.map(c => [c.name, c]));

  const projectsData = [
    {
      title: 'Plateforme de Gestion de Projets Cloud',
      description: 'Développer une plateforme SaaS pour la gestion collaborative de projets avec synchronisation temps réel en cloud.',
      budget: 85000,
      categories: ['Développement Web', 'Infrastructure IT', 'Cloud Computing'],
    },
    {
      title: 'Application Mobile de Santé Digitale',
      description: 'Créer une app mobile pour le suivi de santé avec intégration AI pour les recommandations',
      budget: 120000,
      categories: ['Développement Mobile', 'Data & Analytics'],
    },
    {
      title: 'Système de Cybersécurité Avancée',
      description: 'Développer un système de détection des menaces en temps réel avec machine learning',
      budget: 150000,
      categories: ['Cybersécurité', 'Data & Analytics'],
    },
    {
      title: 'Dashboard Analytics en Temps Réel',
      description: 'Plateforme de visualisation de données avec prédictions basées sur l\'IA',
      budget: 75000,
      categories: ['Data & Analytics', 'Cloud Computing'],
    },
    {
      title: 'Marketplace E-Commerce B2B',
      description: 'Plateforme de commerce électronique pour connecter fournisseurs et acheteurs',
      budget: 95000,
      categories: ['Développement Web', 'Infrastructure IT'],
    },

    {
      title: 'Panneaux Solaires Nouvelle Génération',
      description: 'Recherche et développement de panneaux solaires haute performance avec rendement 25%+',
      budget: 250000,
      categories: ['Énergie Solaire'],
    },
    {
      title: 'Parc Éolien Offshore',
      description: 'Construction d\'un parc éolien offshore de 50MW dans la Manche',
      budget: 500000,
      categories: ['Énergie Éolienne'],
    },
    {
      title: 'Solution de Gestion des Déchets Intelligente',
      description: 'Système IoT pour optimiser la collecte et le tri des déchets',
      budget: 180000,
      categories: ['Gestion des Déchets', 'Data & Analytics'],
    },
    {
      title: 'Programme de Conservation des Forêts',
      description: 'Reforestation et préservation de 10,000 hectares de forêts tropicales',
      budget: 320000,
      categories: ['Conservation'],
    },
    {
      title: 'Batterie Écologique Haute Capacité',
      description: 'Développement de batteries sans lithium pour véhicules électriques',
      budget: 200000,
      categories: ['Énergie Éolienne', 'Véhicule Électrique'],
    },

    {
      title: 'Plateforme de Paiement P2P Décentralisée',
      description: 'Créer un système de paiement blockchain pour les transferts internationaux sans frais',
      budget: 160000,
      categories: ['Paiement Digital', 'Crypto & Blockchain'],
    },
    {
      title: 'Application de Gestion de Patrimoine IA',
      description: 'Robot-advisor pour optimiser le portefeuille d\'investissement avec IA',
      budget: 120000,
      categories: ['Gestion de Patrimoine', 'Data & Analytics'],
    },
    {
      title: 'Assurance Digitale Peer-to-Peer',
      description: 'Plateforme d\'assurance communautaire avec smart contracts',
      budget: 140000,
      categories: ['Assurance Digital', 'Crypto & Blockchain'],
    },
    {
      title: 'Exchange Crypto Régulé',
      description: 'Créer un exchange de cryptomonnaies conforme aux normes européennes',
      budget: 280000,
      categories: ['Crypto & Blockchain', 'Infrastructure IT'],
    },
    {
      title: 'Fintech pour PME - Facturation Instantanée',
      description: 'Service de facturation instantanée avec avances sur chiffre d\'affaires',
      budget: 100000,
      categories: ['Paiement Digital', 'Développement Web'],
    },

    {
      title: 'Clinique Virtuelle de Télémédecine',
      description: 'Plateforme de consultation médicale à distance avec IA diagnostic',
      budget: 110000,
      categories: ['Télémédecine', 'Data & Analytics'],
    },
    {
      title: 'Chaîne de Fitness Connectée',
      description: 'Réseau de salles de sport avec coaching IA personnalisé',
      budget: 180000,
      categories: ['Fitness & Wellness', 'Développement Mobile'],
    },
    {
      title: 'Dispositif Médical de Monitoring Continu',
      description: 'Développer un capteur portable pour la surveillance continue de la santé',
      budget: 220000,
      categories: ['Dispositifs Médicaux', 'Infrastructure IT'],
    },
    {
      title: 'Application Nutrition & Recettes Personnalisées',
      description: 'App avec recommandations nutritionnelles basées sur profil de santé',
      budget: 75000,
      categories: ['Nutrition', 'Data & Analytics'],
    },
    {
      title: 'Centre de Bien-être Holistique',
      description: 'Spa et centre de thérapies avec services wellness premium',
      budget: 150000,
      categories: ['Fitness & Wellness'],
    },

    {
      title: 'Plateforme E-Learning avec Certification',
      description: 'Créer une université en ligne avec courses certifiants en tech',
      budget: 95000,
      categories: ['Plateforme E-Learning', 'Numérique'],
    },
    {
      title: 'Bootcamp Coding Intensif',
      description: 'Programme de formation intensive 12 semaines pour développeurs junior',
      budget: 80000,
      categories: ['Formation Bootcamp', 'Développement Web'],
    },
    {
      title: 'Plateforme d\'Apprentissage Adaptatif par IA',
      description: 'Système d\'apprentissage personnalisé qui s\'adapte à chaque élève',
      budget: 130000,
      categories: ['EdTech Innovation', 'Data & Analytics'],
    },
    {
      title: 'Cours en Ligne Langues Étrangères',
      description: 'Plateforme de cours interactifs pour 15 langues différentes',
      budget: 70000,
      categories: ['Plateforme E-Learning'],
    },
    {
      title: 'Université d\'Entreprise Digital',
      description: 'Créer une académie interne pour les employés avec micro-certifications',
      budget: 105000,
      categories: ['Formation Professionnelle', 'Développement Web'],
    },

    {
      title: 'Marketplace Artisanale B2C',
      description: 'Plateforme de vente pour artisans locaux avec livraison intégrée',
      budget: 85000,
      categories: ['Plateforme E-Commerce', 'Logistique'],
    },
    {
      title: 'Service de Livraison Last-Mile par Drone',
      description: 'Livraison du dernier kilomètre par drones autonomes en zone urbaine',
      budget: 320000,
      categories: ['Last-Mile Delivery', 'Smart Mobility'],
    },
    {
      title: 'Logiciel de Gestion de Stock Cloud',
      description: 'Système centralisé de gestion d\'inventaire pour PME et ETI',
      budget: 60000,
      categories: ['Gestion de Stock', 'Cloud Computing'],
    },
    {
      title: 'Réseau de Fulfillment Centers Distribués',
      description: 'Créer 5 centres de distribution pour réduire les délais de livraison',
      budget: 450000,
      categories: ['Logistique'],
    },
    {
      title: 'Marketplace Mode Éthique',
      description: 'Plateforme e-commerce pour mode durable et éthique',
      budget: 110000,
      categories: ['Plateforme E-Commerce', 'Écologie'],
    },

    {
      title: 'Plateforme PropTech de Valuation',
      description: 'IA pour évaluation instantanée des biens immobiliers par données',
      budget: 140000,
      categories: ['PropTech', 'Data & Analytics'],
    },
    {
      title: 'Solution Domotique Complète',
      description: 'Système complet de maison intelligente avec contrôle centralisé',
      budget: 95000,
      categories: ['Domotique', 'Cloud Computing'],
    },
    {
      title: 'Immeuble Résidentiel Vert',
      description: 'Construction d\'un immeuble de 80 appartements avec certif. LEED',
      budget: 600000,
      categories: ['Construction Verte', 'Habitat Innovant'],
    },
    {
      title: 'App de Location Courte Durée',
      description: 'Airbnb-like pour location saisonnière avec gestion auto',
      budget: 75000,
      categories: ['PropTech', 'Numérique'],
    },
    {
      title: 'Centre Commercial Connecté',
      description: 'Shopping center avec app mobile, parking intelligent et analytics',
      budget: 280000,
      categories: ['Domotique', 'Retail Digital'],
    },

    {
      title: 'Startup de Véhicules Électriques',
      description: 'Production de voitures électriques compactes 100% recyclables',
      budget: 800000,
      categories: ['Véhicule Électrique', 'Infrastructure IT'],
    },
    {
      title: 'Service de Trottinettes Électriques Durables',
      description: 'Déployer 5000 e-scooters dans 10 villes françaises',
      budget: 200000,
      categories: ['Micromobilité', 'Mobilité Urbaine'],
    },
    {
      title: 'Système de Transport Urbain Intelligent',
      description: 'Optimisation du trafic urbain par IA et données temps réel',
      budget: 180000,
      categories: ['Transport Intelligent', 'Data & Analytics'],
    },
    {
      title: 'Plateforme de Covoiturage Longue Distance',
      description: 'Créer un Blablacar français avec meilleure commissions',
      budget: 120000,
      categories: ['Mobilité Urbaine', 'Développement Mobile'],
    },
    {
      title: 'Réseau de Bornes Recharge EV',
      description: 'Installer 500 bornes de recharge rapide en France',
      budget: 350000,
      categories: ['Véhicule Électrique', 'Énergies Renouvelables'],
    },

    {
      title: 'Plateforme Precision Farming par Satellite',
      description: 'Imagerie satellite + IA pour optimiser cultures et rendements',
      budget: 160000,
      categories: ['Precision Farming', 'Data & Analytics'],
    },
    {
      title: 'Coopérative Agriculture Biologique',
      description: 'Créer une coopérative de 50 agriculteurs bio certifiés',
      budget: 200000,
      categories: ['Agriculture Biologique', 'Agroalimentaire'],
    },
    {
      title: 'Usine de Transformation Alimentaire Local',
      description: 'Usine de transformation de produits fermiers locaux',
      budget: 280000,
      categories: ['Transformation Alimentaire', 'Agriculture Durable'],
    },
    {
      title: 'Marketplace Producteurs-Consommateurs',
      description: 'Vendre directement du producteur au consommateur sans intermédiaire',
      budget: 85000,
      categories: ['Plateforme E-Commerce', 'Agroalimentaire'],
    },
    {
      title: 'Robot Agricole Autonome',
      description: 'Développer robot autonome pour labourage et semis',
      budget: 240000,
      categories: ['Precision Farming', 'Technologie'],
    },
  ];

  let projectIndex = 0;
  for (let i = 0; i < contractors.length; i++) {
    const projectData = projectsData[projectIndex % projectsData.length];

    const projectCategories = projectData.categories
      .map(catName => categoryMap.get(catName))
      .filter(cat => cat !== undefined);

    const project = projectRepository.create({
      title: projectData.title,
      description: projectData.description,
      budget: projectData.budget,
      categories: projectCategories,
      owner: contractors[i],
    } as unknown as Partial<Project>);

    projects.push(project);
    projectIndex++;
  }

  const saved = await projectRepository.save(projects);
  console.log(`✓ Seeded ${saved.length} projects.`);

  return saved;
}