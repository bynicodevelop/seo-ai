# SEO-AI

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
curl http://localhost:3000/api/services/domain
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

## Déploiement 

Pour déployez le projet

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

## Lexite & Aide

_SDK Admin Firebase_ : 
Fichier disponible dans l'onglet `Paramètres du projet` de votre [console firebase](https://console.firebase.google.com/) puis `Compte de service` en cliquant sur `Générer une nouvelle clé privée`.