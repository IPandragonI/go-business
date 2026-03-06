# Environnements Bruno

## 📁 Fichiers disponibles

- **local.bru** - Environnement de développement local
- **Production.bru** - Environnement de production

## 🔧 Configuration

### Local (Par défaut)
```
baseUrl: http://localhost:3000
accessToken: <à remplir après login>
```

### Production
```
baseUrl: https://api.go-business.com
accessToken: <à remplir après login>
```

## 🚀 Utilisation dans Bruno

1. **Ouvrir Bruno**
2. **Charger la collection** : File → Open Collection → Sélectionner le dossier `bruno/`
3. **Sélectionner l'environnement** : 
   - Cliquer sur le menu déroulant en haut à droite (à côté du nom de la collection)
   - Choisir `local` ou `Production`
4. **Obtenir le token** :
   - Exécuter la requête `Auth/01-Login-Admin.bru`
   - Copier le `access_token` de la réponse
5. **Configurer le token** :
   - Cliquer sur l'icône d'environnement (en haut à droite)
   - Coller le token dans la variable `accessToken`
6. **Tester les requêtes** : Toutes les requêtes utiliseront automatiquement le `baseUrl` et `accessToken` de l'environnement sélectionné

## 💡 Astuce

Vous pouvez créer d'autres environnements (staging, dev, etc.) en créant de nouveaux fichiers `.bru` dans ce dossier avec la même structure.

