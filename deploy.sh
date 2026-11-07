#!/usr/bin/env bash
# Build, push, and deploy the Foodie app to Kubernetes.
# Usage: ./deploy.sh <dockerhub-username> <image-tag>
# Example: ./deploy.sh johndoe 1.0.0

set -euo pipefail

DOCKER_USER="${1:-YOUR_DOCKERHUB_USERNAME}"
TAG="${2:-1.0.0}"

BACKEND_IMAGE="${DOCKER_USER}/foodie-backend:${TAG}"
FRONTEND_IMAGE="${DOCKER_USER}/foodie-frontend:${TAG}"

echo "=== 1. Building backend image: ${BACKEND_IMAGE} ==="
docker build -t "${BACKEND_IMAGE}" ./backend

echo "=== 2. Building frontend image: ${FRONTEND_IMAGE} ==="
docker build -t "${FRONTEND_IMAGE}" ./frontend

echo "=== 3. Pushing images to Docker Hub ==="
docker push "${BACKEND_IMAGE}"
docker push "${FRONTEND_IMAGE}"

echo "=== 4. Updating k8s manifests with image references ==="
sed -i.bak "s#YOUR_DOCKERHUB_USERNAME/foodie-backend:1.0.0#${BACKEND_IMAGE}#g" k8s/06-backend-deployment.yaml
sed -i.bak "s#YOUR_DOCKERHUB_USERNAME/foodie-frontend:1.0.0#${FRONTEND_IMAGE}#g" k8s/09-frontend-deployment.yaml
rm -f k8s/*.bak

echo "=== 5. Applying manifests to the cluster ==="
kubectl apply -f k8s/00-namespace.yaml
kubectl apply -f k8s/ -n foodie

echo "=== 6. Waiting for rollouts ==="
kubectl rollout status deployment/mongo -n foodie
kubectl rollout status deployment/backend -n foodie
kubectl rollout status deployment/frontend -n foodie

echo "=== 7. Seeding sample restaurant data (run once) ==="
BACKEND_POD=$(kubectl get pod -n foodie -l app=backend -o jsonpath='{.items[0].metadata.name}')
kubectl exec -n foodie "${BACKEND_POD}" -- node seed.js || echo "Seeding failed or already seeded — check manually if needed."

echo "=== Done! ==="
echo "Check ingress: kubectl get ingress -n foodie"
echo "If using minikube: minikube service frontend-service -n foodie"
