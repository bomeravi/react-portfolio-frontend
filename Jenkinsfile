pipeline {
  agent any

  options {
    timestamps()
  }

  parameters {
    string(name: 'IMAGE_TAG', defaultValue: 'v1.2.3', description: 'Docker image tag to build and push')
  }

  environment {
    IMAGE_REPO = 'bomeravi/react-portfolio'
    DOCKER_CREDENTIALS_ID = 'github-creds'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build Image') {
      steps {
        sh 'docker build -t ${IMAGE_REPO}:${IMAGE_TAG} .'
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
  }

  post {
    always {
      sh 'docker logout || true'
    }
  }
}
