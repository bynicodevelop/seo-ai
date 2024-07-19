# SEO-AI

SEO-AI est un projet de création de site et génération de contenu optimisé pour le SEO 100% géré par intélligence artificielle.

## Techno

- Nuxt 3 
- Firebase (firestore, cloud functions)
- tailwind css

## Récupération du projet 

```batch
git clone REPO
cd DIR_NAME
```

## Pré-requis

- Avoir une installation de [firebase en local](https://firebase.google.com/docs/cli?hl=fr)
- Avoir créer un projet Firebase dans votre [console firebase](https://console.firebase.google.com/)
- Créer un fichier `firebase-config.json` à la racine avec la configuration _SDK Admin Firebase_.
- Créer un fichier `.firebaserc` à la racine.

## Commandes :

Voici une liste de commandes utiles pour le développement de l'application.

### `npm run bootstrap`

Installe toutes les dépendances du projet.

### `npm run clean`

Réinitialise tout le projet.

### `npm run dev` (Recommandé)

Démarre le projet Nuxt avec firebase.

### `npm run dev:restore`

Démarre le projet et firebase avec des données pré-enregistrées (dump).

### `npm run firebase:start`

Démarre l'émulateur firebase.

### `npm run build:nuxt`

Build le projet nuxt.

### `npm run build:nuxt:firebase`

Build le projet nuxt pour être déployé sur le hosting de Firebase.

### `npm run build:nuxt:watch`

Build le projet nuxt et écoute les modifications.

### `npm run build:functions`

Build les cloud functions.

### `npm run build:functions:watch`

Build les cloud functions et écoute les modifications.

### `npm run deploy`

Permet de déployer tout le projet sur Firebase.

### `npm run deploy:prepare`

Prépare le projet pour le déploiement pour firebase.

### `npm run deploy:firebase`

Déploie le projet.

### `npm run dev:nuxt`

Démarre le projet Nuxt.

### `npm run firebase:dump`

Créer un dump de Firestore de l'émulateur Firebase.

### `npm run firebase:restore`

Démarre Firebase avec les données de Firestore.

### `npm run test`

Execute les tests unitaires du projet.


## Contenu du fichier de configuration `.firebaserc`

Configuration minimal

```json
{
  "projects": {
    "default": "ID_PROJET"
  },
}
```

Configuration multi-site

```json
{
  "projects": {
    "default": "ID_PROJET"
  },
  "targets": {
    "ID_PROJET": {
      "hosting": {
        "site": [
          "SITE_NAME",
          "..."
        ]
      }
    }
  },
  "etags": {},
  "dataconnectEmulatorConfig": {}
}
```

## Contenu du fichier de configuration `firebase.json`

```json
{
  "functions": [
    {
      "source": ".output/server",
      "codebase": "website",
      "runtime": "nodejs20"
    },
    {
      "source": "functions",
      "codebase": "default",
      "ignore": [
        "node_modules",
        ".git",
        "firebase-debug.log",
        "firebase-debug.*.log",
        "*.local"
      ],
      "predeploy": [],
      "runtime": "nodejs20"
    }
  ],
  "hosting": [
    {
      "site": "SITE_NAME",
      "public": ".output/public",
      "cleanUrls": true,
      "rewrites": [
        {
          "source": "**",
          "function": "server"
        }
      ],
      "ignore": [
        "firebase.json",
        "**/.*",
        "**/node_modules/**"
      ]
    }
  ],
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  }
}

```

## Démarrer le projet

### Configuration firebase en local

Créer un fichier `.env` et ajoutez pour requête firestore en local pendant le développement : 

```
FIRESTORE_EMULATOR_HOST=localhost:8080
```

Firestore est accéssible sur : [http://localhost:4000](http://localhost:4000)

### Installer et démarrer le projet

Installation des dépendances

```batch
npm run bootstrap
```

Démarrage de la stack pour le développement.

```batch
npm run dev
```

Pour clean le projet : 

```batch
npm run clean
```

### Populer le projet en local

```batch
curl http://localhost:3000/api/services/domain?name=localhost
```

### Populer le projet en local avec fichier de configuration

```batch
curl -X POST http://localhost:3000/api/services/site -H "Content-Type: application/json" -d 'CONTENU_JSON_CONFIG'
```

Utilisez le fichier `config.json` à la racine du projet.

Le fichier de config : 

```ts
{
    // Permet de d'utilise OpenAI pour traduire les contenus
    "locales": ["en", "fr"], 
    // (requis) Point d'entrée pour la création d'un site
    "domain": "http://localhost:3000", 
    //  (requis) Titre principal du site
    "sitename": "Forex Trading - Magic Apex", 
    //  (requis) Mots clés utilisé pour le SEO (sera traduit en fonction des langues)
    "keywords": ["forex", "trading", "magic", "apex", "forex trading", "magic apex", "forex trading magic apex"],
    //  (require) Description du site (sera traduit en fonction des langues)
    "description": "Le site Forex Trading - Magic Apex est blog permettant de découvrir le monde du trading forex.",
    // (optionnel) Si non défini sera généré par l'AI
    "categories": [
        {
            // Titre du lien
            "title": "Forex", 
            // Url
            "slug": "forex", 
            // Description utilisé par l'AI
            "description": "Le forex est un marché financier qui permet de trader les devises."
        }
    ]
}
```

## Structure de la donnée

Par exemple pour un blog

_(En cours de dev)_

```
sites (collection)
  └── {domainId} (document)
      └── categories (sub-collection)
          └── {categoryId} (document)
              └── articles (sub-collection)
                  └── {articleId} (document)
```

Par exemple blog + produits

_(Pas pris en compte pour le moment)_

```
sites (collection)
  └── {domainId} (document)
      └── categories (sub-collection)
          └── {categoryId} (document)
              └── articles (sub-collection)
                  └── {articleId} (document)
              └── products (sub-collection)
                  └── {productId} (document)
```

## Utilisation de l'AI

Créer un fichier `.env.local` dans `/functions` avec les informations suivante : 

```
OPENAI_API=sk-proj-openai-key
```

## Utilisation de l'API

### GET `/services/domain`

Permet d'enregister un jeu de données dans Firestore.

Params :

- `name` (string, requis) : Le nom de domaine lié aux données créées.

Réponse : 

```json
{
    "success": Boolean, 
    "error": Object
}
```

### GET `/services/sites`

Permet de créer un site assisté par l'intelligence artificielle avec une configuration.

Params :

- Voir le fichier `config.json`

Réponse : 

```json

```json
{
  "message": String
}
```

### GET `/services/articles`

Permet de créer un article assisté par l'intélligence artificielle avec une configuration.

Params :

- `siteId` (string, requis) : Le nom de domaine sur lequel publier un article.
- `content` (string, requis) : Description ou résumé de l'article à rédiger

Réponse : 

```json

```json
{
  "message": String
}
```

## Déploiement 

Pour déployer le projet

```batch
npm run deploy
```

Pour juste péparer le projet au déploiement.

```batch
npm run deploy:prepare
```

Pour juste déployer le projet.

```batch
npm run deploy:firebase
```

## Règles github

### Formattage des branches

Format de création de branche `(feat|chore|test|refactor)/ID_ISSUE/NAME`

- `feat` : Ajout de fonctionnalité
- `chore` : Divers modifications sans rapport direct avec la fonctionnalité ou correctifs
- `test` : Ajout de tests
- `refactor` : Travraux de refactorisation de code

### Rédaction des commits

Un commit doit avoir quelques données pour mettre le maillage entre un commit et un ticket.

Commit simple : 

```
(feat|chore|test|refactor): #ID_ISSUE - MESSAGE
```

Commit avec précisions (avec une ligne vide) : 

```
(feat|chore|test|refactor): #ID_ISSUE - MESSAGE

MESSAGE DE PRÉCISIONS
```

Le `#ID_ISSUE` permettra de faire le lien avec le ticket associé au commit.


## Lexite & Aide

_SDK Admin Firebase_ : 
Fichier disponible dans l'onglet `Paramètres du projet` de votre [console firebase](https://console.firebase.google.com/) puis `Compte de service` en cliquant sur `Générer une nouvelle clé privée`.