# PLUG CITY 225

Boutique statique de présentation et de commandes WhatsApp.

## Publication

Le site est publié avec GitHub Pages. Chaque changement des fichiers du dépôt est ensuite déployé par GitHub Pages.

## Modifier le catalogue

L’interface publique de gestion a été retirée. Pour modifier les produits, les prix ou les textes, il faut éditer le catalogue source dans `app-v2.js`, puis publier les changements sur GitHub. L’espace de gestion ne doit pas être remis dans le site public sans authentification côté serveur.

GitHub Pages héberge des fichiers statiques : les visiteurs peuvent consulter le code et les données livrés au navigateur. Les modifications faites dans les outils du navigateur ou le stockage local d’un client ne changent que sa propre copie du site. Pour une gestion privée synchronisée entre appareils, il faut connecter une API avec authentification et une base de données.