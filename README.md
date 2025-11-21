# Application Statistiques Handball

Application web full-stack pour l'analyse statistique de matchs de handball. Permet l'import de données Excel/CSV, le calcul automatique de statistiques offensives/défensives, et la visualisation via graphiques etc.

## Technologies

**Backend**
- Java 21 + Spring Boot 3.5
- PostgreSQL 16
- Spring Security + JWT

**Frontend**
- React 18 + Vite
- TailwindCSS
- Axios

## Installation

### Prérequis
- Java JDK 21
- Node.js 20+
- PostgreSQL 16+
- Maven 3.9+

### Backend

Configurer src/main/resources/application.properties en indiquant les identifiants de connexion à la base de données, ex avec Exemple.properties

mvn clean install
run Sae501BackendApplication.java

Backend : http://localhost:8080

### Frontend

npm install

VITE_SERVER_URL=http://localhost:8080
Frontend : http://localhost:5173

## Architecture

┌──────────────────────────────────┐
│ React  │ Interface
│ (Vite) │
└───────────────┬──────────────────┘
│ REST/JSON
┌────────────────────────────────────┐
│ Spring Boot │ API + logique métier
│ + JWT │
└────────────────┬───────────────────┘
│ JPA/Hibernate
┌────────────────────────────────────┐
│ PostgreSQL │ Données matchs/stats
└────────────────────────────────────┘

## Fonctionnalités

- Import fichiers Excel/CSV
- Authentification/Création de comptes pour les joueueses
- Stats générales (grand espace...)
- Stats sur les enclenchements
- Stats défensives
- Dashboard
- Carte de tirs/arrêts
- Page personnelle aux joueuses
  
## Choix techniques

**Pourquoi Spring Boot ?**
- Architecture REST robuste
- Sécurité intégrée
- JPA simplifie requêtes SQL

**Pourquoi React + Vite ?**
- Hot reload ultra-rapide
- Composants modulaires réutilisables
- Écosystème graphiques

**Pourquoi PostgreSQL ?**
- Relations complexes
- Requêtes agrégées performantes
- Transactions ACID pour imports massifs

## Auteurs

KRAJEWSKI Trystan 
SAUTIERE Adam
BENNADJI Rémi
HECQUET Bastien
DEGUELDRE DUPONT Noah
ANSSEAU Matthéo
LECONTE Rémy



