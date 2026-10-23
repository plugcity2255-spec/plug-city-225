# PLUG CITY 225

Boutique de mode statique, conçue pour GitHub Pages : HTML, CSS et JavaScript sans dépendance à installer.

## Voir le site sur son ordinateur

Ouvre `index.html` dans un navigateur. Pour tester la commande WhatsApp, renseigne d’abord le numéro de la boutique dans **Gérer la boutique → Paramètres**.

## Publier sur GitHub Pages

1. Envoie les fichiers `index.html`, `styles.css`, `app.js` et `README.md` dans le dépôt GitHub.
2. Dans le dépôt, ouvre **Settings → Pages**.
3. Dans **Build and deployment**, choisis **Deploy from a branch**, puis ta branche principale et le dossier `/ (root)`.
4. Enregistre. GitHub Pages affichera l’adresse du site dans ce même écran après la publication.

Le site ne demande aucune installation. Le domaine GitHub Pages doit servir `index.html` depuis la racine du dépôt.

## Gérer les articles

Clique sur **Gérer la boutique** dans le pied de page. L’onglet **Produits** permet d’ajouter, modifier ou supprimer un article, sa photo, son prix, son prix promotionnel, sa catégorie, ses tailles et ses couleurs. L’onglet **Paramètres** permet de modifier le nom, le numéro WhatsApp, le slogan, le texte de présentation, la couleur d’accent et la bannière d’accueil.

Les photos sont réduites automatiquement avant leur enregistrement. Les articles, le panier et les paramètres sont conservés dans le stockage local du navigateur.

## Limite à connaître avant d’ouvrir la boutique au public

GitHub Pages héberge des fichiers statiques. La gestion de cette première version enregistre les changements uniquement dans le navigateur qui les effectue : elle ne met pas à jour le catalogue vu par les clients et ne synchronise pas les appareils. Le panneau de gestion n’a pas de connexion protégée. Pour administrer une boutique publiée, partager les changements avec tous les clients et protéger l’accès, il faudra raccorder un service de données et d’authentification (par exemple Supabase ou Firebase) avant la mise en production.

Le panier prépare un message WhatsApp ; il ne débite pas de paiement en ligne et ne calcule pas les frais de livraison.
