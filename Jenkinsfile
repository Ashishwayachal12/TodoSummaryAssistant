pipeline {
    agent any

    environment {
        BACKEND_IMAGE  = "ashishwayachal12/todosummaryassistant-backend"
        FRONTEND_IMAGE = "ashishwayachal12/todosummaryassistant-frontend"

        IMAGE_TAG = "${BUILD_NUMBER}"

        DOCKERHUB_CREDENTIALS = "dockerhub-creds"
        COMPOSE_PROJECT_NAME = "todo-summary-assistant"
    }

    stages {

        stage("CODE") {
            steps {
                echo "Cloning Todo Summary Assistant repository..."

                git branch: "main",
                    url: "https://github.com/Ashishwayachal12/TodoSummaryAssistant.git"
            }
        }

        stage("GET PUBLIC IP") {
            steps {
                script {
                    env.SERVER_IP = sh(
                        script: "curl -fsS --max-time 10 https://checkip.amazonaws.com",
                        returnStdout: true
                    ).trim()

                    echo "EC2 Public IP: ${env.SERVER_IP}"
                }
            }
        }

        stage("BUILD BACKEND") {
            steps {
                echo "Building backend Docker image..."

                sh '''
                    docker build \
                      -t todosummaryassistant-backend:${IMAGE_TAG} \
                      ./Backend/todo-summary-assistant
                '''
            }
        }

        stage("BUILD FRONTEND") {
            steps {
                echo "Building frontend Docker image..."

                sh '''
                    docker build \
                      --build-arg REACT_APP_API_BASE_URL="http://${SERVER_IP}:8080/api/todos" \
                      -t todosummaryassistant-frontend:${IMAGE_TAG} \
                      ./Frontend/todo
                '''
            }
        }

        stage("TAG") {
            steps {
                echo "Creating Docker Hub tags..."

                sh '''
                    docker tag \
                      todosummaryassistant-backend:${IMAGE_TAG} \
                      ${BACKEND_IMAGE}:${IMAGE_TAG}

                    docker tag \
                      todosummaryassistant-frontend:${IMAGE_TAG} \
                      ${FRONTEND_IMAGE}:${IMAGE_TAG}
                '''
            }
        }

        stage("PUSH") {
            steps {
                script {
                    echo "Pushing backend and frontend images to Docker Hub..."

                    withDockerRegistry(
                        credentialsId: 'e10327ae-3cbc-402c-97fb-529ac78825c3',
                        
                    ) {
                        sh '''
                            docker push ${BACKEND_IMAGE}:${IMAGE_TAG}
                            docker push ${FRONTEND_IMAGE}:${IMAGE_TAG}
                        '''
                    }
                }
            }
        }

        stage("DEPLOY") {
            steps {
                echo "Deploying application using Docker Compose..."

                sh '''
            export BACKEND_IMAGE="${BACKEND_IMAGE}"
            export FRONTEND_IMAGE="${FRONTEND_IMAGE}"
            export IMAGE_TAG="${IMAGE_TAG}"

            docker compose pull
            docker compose up -d --no-build --remove-orphans
            docker compose ps
                '''
            }
        }
    }

    post {
        success {
            echo """
            DEPLOYMENT SUCCESSFUL

            Build Number: ${BUILD_NUMBER}
            Backend Image: ${BACKEND_IMAGE}:${IMAGE_TAG}
            Frontend Image: ${FRONTEND_IMAGE}:${IMAGE_TAG}

            Frontend URL: http://${SERVER_IP}:3000
            Backend URL:  http://${SERVER_IP}:8080
            """
        }

        failure {
            echo """
            DEPLOYMENT FAILED

            Job: ${JOB_NAME}
            Build: ${BUILD_NUMBER}
            Check Jenkins Console Output:
            ${BUILD_URL}console
            """
        }

        always {
            sh 'docker logout || true'
        }
    }
}
