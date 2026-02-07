pipeline {
  agent any

  options {
    timestamps()
  }

  parameters {
    string(name: 'IMAGE_TAG', defaultValue: '', description: 'Docker image tag to build and push (leave empty to use v${BUILD_NUMBER})')
    password(name: 'VITE_PHONE', defaultValue: '', description: 'Optional override for VITE_PHONE in .env.production')
  }

  environment {
    IMAGE_REPO = 'bomeravi/react-portfolio'
    DOCKER_CREDENTIALS_ID = 'dockerhub-creds'
    K8S_REPO_URL = 'git@github.com:bomeravi/k8s-react-portfolio.git'
    K8S_REPO_BRANCH = 'main'
    K8S_REPO_DIR = 'k8s-react-portfolio'
    K8S_GIT_CREDENTIALS_ID = 'k8s-git-ssh'
    K8S_VALUES_FILE = 'k8s/helm/react-portfolio/values.yaml'
    K8S_CHART_FILE = 'k8s/helm/react-portfolio/Chart.yaml'
    GIT_USER_NAME = 'jenkins'
    GIT_USER_EMAIL = 'jenkins@local'
  }

  stages {
    stage('Resolve Tag') {
      steps {
        script {
          def tag = params.IMAGE_TAG?.trim()
          env.IMAGE_TAG = tag ? tag : "v${env.BUILD_NUMBER}"
        }
      }
    }

    stage('Checkout App') {
      steps {
        checkout scm
      }
    }

    stage('Prepare Env') {
      steps {
        sh '''
          set -eu
          if [ ! -f .env.production ]; then
            cp .env.example .env.production
          fi

          if [ -n "${VITE_PHONE:-}" ]; then
            if grep -q '^VITE_PHONE=' .env.production; then
              sed -i "s|^VITE_PHONE=.*|VITE_PHONE=${VITE_PHONE}|" .env.production
            else
              echo "VITE_PHONE=${VITE_PHONE}" >> .env.production
            fi
          fi
        '''
      }
    }

    stage('Build Image') {
      steps {
        sh '''
          export DOCKER_BUILDKIT=1
          docker build --progress=plain -t ${IMAGE_REPO}:${IMAGE_TAG} .
        '''
      }
    }

    stage('Login & Push') {
      steps {
        withCredentials([usernamePassword(credentialsId: env.DOCKER_CREDENTIALS_ID, usernameVariable: 'DOCKERHUB_USER', passwordVariable: 'DOCKERHUB_PASS')]) {
          sh 'echo "$DOCKERHUB_PASS" | docker login -u "$DOCKERHUB_USER" --password-stdin'
          sh 'docker push ${IMAGE_REPO}:${IMAGE_TAG}'
        }
      }
    }

    stage('Checkout K8s Repo') {
      steps {
        dir(env.K8S_REPO_DIR) {
          deleteDir()
          checkout([$class: 'GitSCM',
            branches: [[name: "*/${env.K8S_REPO_BRANCH}"]],
            userRemoteConfigs: [[url: env.K8S_REPO_URL, credentialsId: env.K8S_GIT_CREDENTIALS_ID]]
          ])
          sh 'git remote set-url origin ${K8S_REPO_URL}'
        }
      }
    }

    stage('Update K8s Image Tag') {
      steps {
        dir(env.K8S_REPO_DIR) {
          sh '''
            set -eu
            git config user.name "${GIT_USER_NAME}"
            git config user.email "${GIT_USER_EMAIL}"

            sed -i "s/^  tag:.*/  tag: ${IMAGE_TAG}/" "${K8S_VALUES_FILE}"
            sed -i "s/^appVersion:.*/appVersion: \\"${IMAGE_TAG}\\"/" "${K8S_CHART_FILE}"

            if [ -z "$(git status --porcelain)" ]; then
              echo "No changes to commit."
              exit 0
            fi

            git add "${K8S_VALUES_FILE}" "${K8S_CHART_FILE}"
            git commit -m "chore: bump image tag to ${IMAGE_TAG}"
          '''
          withCredentials([sshUserPrivateKey(credentialsId: env.K8S_GIT_CREDENTIALS_ID, keyFileVariable: 'SSH_KEY')]) {
            sh '''
              set -eu
              export GIT_SSH_COMMAND="ssh -i ${SSH_KEY} -o IdentitiesOnly=yes -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null"
              git push origin HEAD:${K8S_REPO_BRANCH}
            '''
          }
        }
      }
    }
  }

  post {
    always {
      sh 'docker logout || true'
    }
  }
}
