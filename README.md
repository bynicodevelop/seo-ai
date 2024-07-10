# SEO-AI

## Techno

- Nuxt 3 
- Firebase (firestore, cloud functions)
- tailwind css

## Installation 

```batch
git clone REPO
cd DIR_NAME
npm i
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

### Serveur Firebase (firestore...)

```batch
firebase emulators:start
```

### Serveur Nuxt

```batch
npm run dev
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

## Lexite & Aide

_SDK Admin Firebase_ : 
Fichier disponible dans l'onglet `Paramètres du projet` de votre [console firebase](https://console.firebase.google.com/) puis `Compte de service` en cliquant sur `Générer une nouvelle clé privée`.