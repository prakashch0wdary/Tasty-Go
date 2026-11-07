# Foodie — Containerized Food Delivery App on Kubernetes
### (A Swiggy / Zomato–style clone: React + Node.js/Express + MongoDB)

A complete, deployable full-stack project demonstrating containerized application
deployment on Kubernetes: Docker images for frontend & backend, Kubernetes manifests
(Deployments, Services, ConfigMaps, Secrets, PVC, Ingress, HPA), and a local
docker-compose setup for quick testing.

---

## 1. Architecture

```
                         ┌───────────────────────────┐
                         │        Ingress (nginx)     │
                         │   foodie.local  → routes   │
                         └───────────┬───────────────┘
                     /api/*          │           /*
              ┌──────────────────────┴─────────────────────┐
              ▼                                             ▼
   ┌─────────────────────┐                     ┌─────────────────────────┐
   │  backend-service     │                     │  frontend-service        │
   │  (ClusterIP :5000)   │                     │  (ClusterIP :80)         │
   └──────────┬───────────┘                     └───────────┬─────────────┘
              │ 2+ pods (HPA 2-6)                            │ 2+ pods (HPA 2-5)
   ┌──────────▼───────────┐                     ┌───────────▼─────────────┐
   │  backend Deployment   │                     │  frontend Deployment     │
   │  Node.js / Express    │                     │  React build → Nginx     │
   │  (JWT auth, REST API) │                     │  (proxies /api to        │
   └──────────┬───────────┘                     │   backend-service)       │
              │                                  └───────────────────────────┘
   ┌──────────▼───────────┐
   │  mongo-service         │  (headless ClusterIP)
   │  MongoDB Deployment    │
   │  + PersistentVolume    │
   └────────────────────────┘
```

**Flow:** User hits Ingress → static React app served by Nginx → React calls
`/api/...` → Nginx proxies to `backend-service` → Express API → MongoDB
(persisted via PVC).

---

## 2. Project Structure

```
foodie-k8s-project/
├── backend/                  # Node.js + Express + MongoDB API
│   ├── src/
│   │   ├── server.js         # App entrypoint, health/ready endpoints
│   │   ├── config/db.js      # Mongoose connection (auto-retry)
│   │   ├── models/           # Restaurant, User, Order (Mongoose schemas)
│   │   ├── controllers/      # Business logic
│   │   ├── routes/           # /api/auth, /api/restaurants, /api/orders
│   │   └── middleware/auth.js
│   ├── seed.js                # Populates fifteen sample restaurants and menus
│   ├── Dockerfile             # Multi-stage, non-root, healthcheck
│   ├── .dockerignore
│   └── package.json
├── frontend/                  # React SPA
│   ├── src/
│   │   ├── components/        # Navbar, RestaurantList, MenuPage, Cart, Login, MyOrders
│   │   ├── api.js             # Axios instance (JWT auto-attached)
│   │   └── App.js             # Router
│   ├── nginx.conf             # Serves build + proxies /api to backend-service
│   ├── Dockerfile             # Multi-stage build → nginx:alpine runtime
│   └── package.json
├── k8s/                        # Kubernetes manifests (apply in numeric order)
│   ├── 00-namespace.yaml
│   ├── 01-secrets.yaml
│   ├── 02-mongo-pvc.yaml
│   ├── 03-mongo-deployment.yaml
│   ├── 04-mongo-service.yaml
│   ├── 05-backend-configmap.yaml
│   ├── 06-backend-deployment.yaml
│   ├── 07-backend-service.yaml
│   ├── 08-backend-hpa.yaml
│   ├── 09-frontend-deployment.yaml
│   ├── 10-frontend-service.yaml
│   ├── 11-frontend-hpa.yaml
│   └── 12-ingress.yaml
├── docker-compose.yaml         # Local dev/testing (no k8s needed)
├── deploy.sh                   # Build → push → apply → seed, end to end
└── README.md
```

---

## 3. Run locally with Docker Compose (fastest way to try it)

```bash
cd foodie-k8s-project
docker compose up --build -d
# add or update sample restaurants (safe to repeat)
docker compose exec backend node seed.js
```
- Frontend: http://localhost:8080
- Backend API: http://localhost:5000/api/restaurants

---

## 4. Deploy to Kubernetes

### Prerequisites
- A Kubernetes cluster (minikube, kind, EKS, GKE, AKS, etc.)
- `kubectl` configured to point at your cluster
- Docker Hub (or another registry) account
- An ingress controller installed, e.g.:
  ```bash
  helm install ingress-nginx ingress-nginx/ingress-nginx \
    -n ingress-nginx --create-namespace
  ```

### Option A — one-command script
```bash
chmod +x deploy.sh
./deploy.sh <your-dockerhub-username> 1.0.0
```
This builds both images, pushes them, patches the image references inside the
k8s manifests, applies everything, waits for rollouts, and seeds sample data.

### Option B — manual, step by step

**1. Build & push images**
```bash
docker build -t <user>/foodie-backend:1.0.0 ./backend
docker build -t <user>/foodie-frontend:1.0.0 ./frontend
docker push <user>/foodie-backend:1.0.0
docker push <user>/foodie-frontend:1.0.0
```

**2. Update image names** in
`k8s/06-backend-deployment.yaml` and `k8s/09-frontend-deployment.yaml`
(replace `YOUR_DOCKERHUB_USERNAME/...`).

**3. Apply manifests**
```bash
kubectl apply -f k8s/00-namespace.yaml
kubectl apply -f k8s/ -n foodie
```

**4. Verify**
```bash
kubectl get all -n foodie
kubectl get pvc -n foodie
kubectl get ingress -n foodie
```

**5. Seed sample restaurants (once)**
```bash
BACKEND_POD=$(kubectl get pod -n foodie -l app=backend -o jsonpath='{.items[0].metadata.name}')
kubectl exec -n foodie "$BACKEND_POD" -- node seed.js
```

**6. Access the app**
- With ingress + local cluster (minikube/kind): add `127.0.0.1 foodie.local`
  to `/etc/hosts`, then `minikube tunnel` (minikube) and open `http://foodie.local`.
- Or port-forward directly for a quick check:
  ```bash
  kubectl port-forward -n foodie svc/frontend-service 8080:80
  ```

---

## 5. Kubernetes concepts demonstrated

| Concept              | Where |
|----------------------|-------|
| Namespace isolation  | `00-namespace.yaml` |
| Secrets (creds, JWT) | `01-secrets.yaml` |
| ConfigMap            | `05-backend-configmap.yaml` |
| PersistentVolumeClaim| `02-mongo-pvc.yaml` (stateful DB storage) |
| Deployments          | mongo / backend / frontend |
| Services (ClusterIP, headless) | `04-mongo-service.yaml`, `07-`, `10-` |
| Liveness/Readiness probes | backend `/health` `/ready`, frontend `/health` |
| Horizontal Pod Autoscaler | `08-backend-hpa.yaml`, `11-frontend-hpa.yaml` |
| Ingress + path-based routing | `12-ingress.yaml` (`/api` → backend, `/` → frontend) |
| Resource requests/limits | set on every container |
| Non-root container users | backend Dockerfile |
| Multi-stage Docker builds | both Dockerfiles |

---

## 6. Scaling & operations

```bash
# Manual scale
kubectl scale deployment backend -n foodie --replicas=4

# Watch autoscaler
kubectl get hpa -n foodie -w

# Logs
kubectl logs -n foodie -l app=backend -f

# Rolling update after a new image push
kubectl set image deployment/backend backend=<user>/foodie-backend:1.1.0 -n foodie
kubectl rollout status deployment/backend -n foodie

# Rollback if something breaks
kubectl rollout undo deployment/backend -n foodie
```

For production, consider adding:
- **metrics-server** in-cluster (required for HPA to work)
- A managed MongoDB (Atlas) or a StatefulSet + replica set instead of a single Mongo pod
- TLS on the Ingress (cert-manager + Let's Encrypt)
- A private registry / CI-CD pipeline (GitHub Actions → build → push → `kubectl apply`)
- Network Policies to restrict pod-to-pod traffic
- Sealed Secrets or an external secrets manager instead of plain base64 Secrets

---

## 7. API Reference (backend)

| Method | Endpoint                  | Auth | Description |
|--------|----------------------------|------|--------------|
| POST   | `/api/auth/register`       | No   | Create account |
| POST   | `/api/auth/login`          | No   | Login, returns JWT |
| GET    | `/api/restaurants`         | No   | List restaurants (`?search=` matches names, cuisines, and menu items; `?cuisine=` filters cuisine) |
| GET    | `/api/restaurants/:id`     | No   | Restaurant detail + full menu |
| POST   | `/api/restaurants`         | No   | Create restaurant (admin/seed use) |
| POST   | `/api/orders`              | Yes  | Place an order |
| GET    | `/api/orders/my`           | Yes  | Current user's order history |
| GET    | `/health` / `/ready`       | No   | k8s probes |

---

## 8. Notes

- The frontend Dockerfile is intentionally split into a **build stage** (installs
  deps + `npm run build`) and a **runtime stage** (just nginx + the static build
  output), so the final image is small and doesn't ship Node.js or source.
- The backend never talks to Mongo with the credentials baked into code — they
  come from the `foodie-secrets` Secret at runtime.
- Sample data (`seed.js`) is for demo purposes; wire up a real admin flow for
  production restaurant onboarding.
- The seed includes fifteen Bengaluru restaurants with menus, delivery details,
  ratings, price estimates, and promotional offers. It adds or updates these
  samples without deleting other restaurant records.
