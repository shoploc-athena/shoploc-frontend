# GLOP-95 — Prototype de conception du parcours commande

## Livrable et statut

Prototype React de conception retenu avec la demandeuse en remplacement des
maquettes Figma. Il prépare le développement du sprint 8 ; il ne constitue pas
un tunnel de commande fonctionnel. L'accord et la recette finale du PO restent
à consigner par l'équipe.

- Périmètre : panier, récapitulatif, créneaux par commerce, mode de paiement,
  attente de confirmation, confirmation avec code de retrait, historique,
  suivi et détail, demande d'annulation et remboursement dû.
- Données entièrement fictives et état conservé uniquement en mémoire.
- Aucun appel à une API, à Stripe ou à un service de commande dans le prototype.
- Aucune collecte de carte bancaire : l'emplacement Stripe est une illustration.
- Aucune création de commande, annulation ou opération financière réelle.
- Le catalogue statique ne remplace pas l'écran catalogue livré ; ses tests et
  l'outillage axe relèvent de GLOP-96 et ne font pas partie de cette branche.

## Ouvrir et parcourir le prototype

Depuis le dossier frontend :

```powershell
npm ci
npm run dev -- --host 127.0.0.1
```

Ouvrir l'adresse affichée par Vite. Aucun backend ni base de données requis.

Le sélecteur **Écran à prévisualiser** donne accès à chaque écran sans devoir
terminer un paiement. Les boutons **Réussite**, **Vide**, **Chargement** et
**Erreur** permettent sa recette visuelle. **Réinitialiser la démo** recharge le
panier et les commandes d'exemple après une simulation.

Parcours principal :

1. Panier regroupé par commerce ; modifier une quantité et vérifier le total.
2. Continuer vers le récapitulatif, les créneaux et le mode de paiement.
3. Sélectionner un créneau pour chaque commerce ; l'action suivante devient disponible.
4. Choisir le paiement en ligne et examiner l'illustration du futur champ Stripe.
5. Simuler l'attente, puis la confirmation ; relever le code fictif et les créneaux.
6. Suivre la commande depuis l'historique et ouvrir son détail.
7. Afficher les six statuts avec le contrôle de prévisualisation du détail.
8. Sur un statut non terminal, ouvrir la demande d'annulation, fermer avec Échap,
   puis soumettre une demande fictive.
9. Prévisualiser une commande annulée payée en ligne pour afficher le remboursement dû.
10. Réinitialiser avant de parcourir l'option de paiement au retrait.

## Matrice des écrans et états

La colonne « succès » désigne un affichage nominal, pas une opération réelle.
Chaque ligne doit être revue en mobile et en desktop.

| Écran | Succès / nominal | Vide | Chargement | Erreur |
|---|---|---|---|---|
| Panier | Groupes par commerce, quantités, total, action Continuer | Aucun article, retour aux commerces | Statut annoncé | Alerte et Réessayer |
| Retrait et paiement | Créneau par commerce, récapitulatif, choix du paiement et illustration Stripe | Aucune commande à payer | Statut annoncé | Alerte et Réessayer |
| Attente de confirmation | Simulation Stripe ou validation au retrait, bouton de confirmation fictive | État vide de l'écran paiement | Attente dédiée avec statut annoncé | État erreur de l'écran paiement |
| Confirmation | Référence, code fictif, commerce et créneau, suivi | Confirmation indisponible | Statut annoncé | Alerte et Réessayer |
| Historique | Liste des commandes, montant et statut textuel | Aucune commande | Statut annoncé | Alerte et Réessayer |
| Détail et suivi | Statut, étapes, créneaux, code, demande d'annulation | Détail indisponible | Statut annoncé | Alerte et Réessayer |
| Demande d'annulation | Dialogue, motif fictif facultatif, retour et simulation | Motif vide autorisé | Sans envoi réseau : attente représentée au niveau du détail | Erreur représentée au niveau du détail |
| Remboursement dû | Encart dans un détail annulé payé en ligne | Aucun encart si aucun remboursement dû | État chargement du détail | État erreur du détail |

## Statuts et règles à arbitrer

| Code demandé par le billet | Libellé de la maquette |
|---|---|
| `CONFIRMEE` | Confirmée |
| `EN_PREPARATION` | En préparation |
| `PRETE` | Prête à retirer |
| `COLLECTEE` | Collectée |
| `ANNULEE` | Annulée |
| `EXPIREE` | Expirée |

Le sélecteur de statut est un outil de revue, pas une implémentation de la
machine d'états. Il autorise volontairement l'examen de chaque état.
Les transitions métier et permissions ne sont pas validées par ce prototype.

| Hypothèse de conception | Décision attendue du PO |
|---|---|
| Panier unique regroupé par commerce, un créneau indépendant par commerce | Confirmer panier multi-commerces, découpage et indisponibilité d'un article/créneau |
| Paiement au retrait proposé en alternative | Confirmer son autorisation et les moyens acceptés |
| Même code fictif présenté pour les commerces d'une commande | Confirmer code unique ou code distinct par commerce et règles d'expiration |
| Demande d'annulation distincte d'une annulation effective | Confirmer statuts éligibles, délais, acteur décideur et notifications |
| Annulation d'une commande payée en ligne : montant total affiché comme dû | Confirmer annulation partielle, calcul, frais, délais et suivi du remboursement |
| Liste des six codes du billet | Fournir la machine d'états de référence et valider les libellés |
| Composants et couleurs réutilisés du prototype sauvegardé | Fournir les maquettes auth/catalogue validées et confirmer l'alignement au design system |

## Annotations d'accessibilité

Ces annotations sont conservées dans ce dossier de conception uniquement ;
elles ne sont pas affichées dans les écrans du prototype.

- Document déclaré en français. Un titre principal par écran, sections nommées,
  titres par commerce et listes pour les articles et le suivi.
- Lien d'évitement vers le contenu. Au changement d'écran, focus sur le titre
  principal ; le sélecteur d'état conserve le focus pour comparer les états.
- Navigation native au clavier, focus visible, boutons de quantité nommés par produit.
  La nouvelle quantité est annoncée ; le montant est affiché en texte.
- Listes de créneaux nommées par commerce, consigne reliée par `aria-describedby`.
  Radios regroupées et nommées pour le paiement ; choix avec les touches fléchées.
- Confirmation : référence, créneaux et code de retrait disponibles en texte.
  Le code est fictif et ne doit pas être utilisé en commerce.
- Historique : chaque commande est un bouton accessible au clavier.
- Chargement en `role="status"`, erreur en `role="alert"`. Le statut de commande
  comporte un libellé et un code, sans dépendance exclusive à la couleur.
- Étape courante de suivi identifiée par `aria-current="step"`.
- Dialogue natif modal : nom et description accessibles, focus initial sur
  Fermer, tabulation contenue dans le dialogue, Échap pour fermer et retour
  au déclencheur s'il est toujours présent. Après soumission, focus sur le titre.
- Le faux champ Stripe ne contient aucun champ de saisie. L'accessibilité de la
  future intégration Stripe devra être vérifiée lors de son implémentation.
- Mise en page du tunnel en une colonne par défaut, deux colonnes à partir de
  761 px. Vérifier 320 px, 390 px, 1280 px et un zoom de 200 % sans perte de contenu.
- Les animations suivent `prefers-reduced-motion`. Les contrastes, la lisibilité,
  l'ordre de lecture et les cibles tactiles doivent faire partie de la revue visuelle.

## Remise, suivi et validation

### Vérifications techniques réalisées

- `npm test` : 4 tests existants réussis (données de commande et reducer produits).
  Ils ne constituent pas une couverture complète des composants du prototype.
- `npm run lint` et `npm run build` : réussis.
- Contrôle dans Chrome headless aux largeurs réelles de 320, 390 et 1280 px :
  6 écrans et 4 états, soit 72 combinaisons sans débordement horizontal ;
  présence des annonces de chargement et des alertes d'erreur vérifiée.
- Parcours simulés vérifiés : créneaux obligatoires, paiement en ligne et au
  retrait, attente, confirmation, demande d'annulation et remboursement dû.
- Dialogue vérifié au clavier : tabulation sans accès au contenu sous-jacent,
  fermeture par Échap, retour au déclencheur et focus sur le titre après soumission.
- Aucun appel à l'API backend ni exception JavaScript observés pendant ces parcours.

Ces contrôles ne remplacent ni un audit d'accessibilité complet, ni une recette
avec lecteurs d'écran, ni la validation du PO. Le zoom à 200 % et les autres
navigateurs restent à vérifier lors de la recette.

| Élément | État |
|---|---|
| Source de la maquette | [OrderFlow.jsx](../src/features/orders/OrderFlow.jsx), [styles](../src/features/orders/OrderFlow.css), [données fictives](../src/features/orders/orderFlowData.js) |
| Revue technique | Exécuter `npm test`, `npm run lint`, `npm run build` et le parcours ci-dessus |
| Support de revue | PR GLOP-95 et démonstration locale du prototype |
| Lien sur le site de suivi | À renseigner par l'équipe ; site non communiqué |
| Validation finale du PO | En attente ; consigner date, personne et remarques |
| Arbitrages métier et design system | En attente des références de l'équipe |
| Definition of Done « Gestion » | Non communiquée ; contrôler et joindre la preuve avant clôture |

Le livrable peut être soumis à la revue ; ne pas fermer le billet tant que la
validation PO, le rattachement au suivi et la DoD Gestion ne sont pas confirmés.
