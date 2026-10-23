# PLUG CITY 225

Boutique statique de mode, hébergée avec GitHub Pages. Le catalogue, le panier et la commande WhatsApp fonctionnent dans le navigateur; aucun paiement en ligne n’est connecté.

## Publier une modification

1. Modifie les fichiers dans Visual Studio Code.
2. Envoie les fichiers concernés dans le dépôt GitHub `plugcity2255-spec/plug-city-225` et valide le changement sur `main`.
3. GitHub Pages publie automatiquement la nouvelle version après la fin de son déploiement.

Pour voir le site sur l’ordinateur, ouvre `index.html` dans un navigateur. Vérifie aussi le rendu sur téléphone après chaque changement de style.

## Modifier les produits

Les produits de démonstration se trouvent dans le tableau `seedProducts` de `app-v2.js`. Modifie le nom, la catégorie, le prix, la description, les tailles et l’image, puis publie le fichier. Les photos locales doivent être placées dans le dépôt; la photo Air Force One optimisée est `air-force-one.webp` à la racine.

Le panneau public de gestion a été retiré. Le catalogue publié vient du code du site; le navigateur ne peut plus remplacer les prix officiels depuis son stockage local. Seul le panier du visiteur est conservé sur son appareil. Pour un véritable tableau de bord privé et synchronisé, il faut un service externe avec authentification, base de données et stockage d’images.

## Commandes et paiements

Le panier prépare une demande sur WhatsApp au numéro de la boutique. Le total est indicatif : le vendeur confirme le prix, la disponibilité et les frais de livraison avant validation. Le site ne traite pas les paiements et ne conserve pas les coordonnées des clients dans une base centrale. N’annonce aucun paiement Mobile Money comme actif tant qu’un prestataire n’est pas connecté et configuré.

## Limites de sécurité

GitHub Pages sert des fichiers publics. Les prix transmis depuis le navigateur ne sont pas une source officielle vérifiée côté serveur; ils ne doivent pas servir à valider un paiement. Ne place aucune clé privée ou donnée de compte dans les fichiers. Pour enregistrer des commandes, gérer les stocks ou confirmer un paiement, ajoute une API sécurisée avec authentification, validation côté serveur et journalisation.
