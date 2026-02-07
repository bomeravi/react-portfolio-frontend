# React Portfolio Deployment Steps

This guide covers build + push with Jenkins, then deploy via Argo CD using Helm.

## Prerequisites
- Jenkins with Docker available on the agent.
- Docker Hub account with public repo `bomeravi/react-portfolio`.
- Jenkins credentials created:
  - ID: `github-creds`
  - Type: Username with password
  - Username: your Docker Hub username
  - Password: your Docker Hub password or access token
- Argo CD installed in your cluster and reachable.
- Argo CD has access to the GitOps repo `git@github.com:bomeravi/k8s-react-portfolio.git` (SSH key or repo creds configured in Argo CD).

## Repo Layout
- App repo: `react-portfolio-frontend` (this repo)
- GitOps repo: `k8s-react-portfolio`
  - Helm chart: `k8s/helm/react-portfolio`
  - Argo CD app manifest: `k8s/argocd/react-portfolio-app.yaml`

## 1) Build and Push Image with Jenkins
1. Create a Jenkins pipeline job pointing to this repo.
2. Ensure the `Jenkinsfile` is used.
3. Run the job with the desired tag:
   - Parameter `IMAGE_TAG` (default: `v1.2.3`)
4. The pipeline will:
   - Build `bomeravi/react-portfolio:${IMAGE_TAG}`
   - Log in to Docker Hub using `github-creds`
   - Push the image

## 2) Update GitOps Repo for Desired Version
1. Open GitOps repo: `k8s-react-portfolio`.
2. Update the Helm values file:
   - File: `k8s/helm/react-portfolio/values.yaml`
   - Set:
     - `image.repository: bomeravi/react-portfolio`
     - `image.tag: v1.2.3` (or your desired tag)
3. Commit and push:
   - `git add k8s/helm/react-portfolio/values.yaml`
   - `git commit -m "Update image tag to v1.2.3"`
   - `git push`

## 3) Register the App in Argo CD
1. Apply the Argo CD Application manifest once:
   - `kubectl apply -f k8s/argocd/react-portfolio-app.yaml`
2. Argo CD will create the app:
   - App name: `react-portfolio`
   - Namespace: `react-portfolio` (auto-created)

## 4) Sync and Verify
1. In Argo CD UI, find `react-portfolio` and click **Sync**.
2. Confirm the Deployment and Service are healthy.
3. If you enabled Ingress in `values.yaml`, confirm the host resolves.

## Notes and Best Practices
- Helm is the recommended production approach for parameterized releases.
- Use immutable image tags (e.g., `v1.2.3`) for safe rollbacks.
- For frequent updates, consider automating image tag updates via CI.

## Alternatives (Optional)
- Kustomize:
  - `k8s/kustomize/overlays/prod`
- Raw manifests:
  - `k8s/manifests/`

These are examples only. The Argo CD Application is configured to use Helm.
