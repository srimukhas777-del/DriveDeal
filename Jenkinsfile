pipeline {
    agent any

    environment {
        IMAGE_NAME = "srimukh07/drivedeal-backend"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/srimukh07/drivedeal-backend.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                dir('backend') {
                    sh 'npm install'
                }
            }
        }

        stage('Run Tests') {
            steps {
                dir('backend') {
                    sh 'npm test'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                dir('backend') {
                    sh 'docker build -t $IMAGE_NAME:latest .'
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                withCredentials([
                    string(credentialsId: 'dockerhub-password', variable: 'DOCKER_PASS')
                ]) {
                    sh '''
                    echo $DOCKER_PASS | docker login -u srimukh07 --password-stdin
                    docker push $IMAGE_NAME:latest
                    '''
                }
            }
        }

        stage('Deploy Container') {
            steps {
                sh '''
                docker stop drivedeal-backend || true
                docker rm drivedeal-backend || true
                docker run -d -p 5000:5000 --name drivedeal-backend $IMAGE_NAME:latest
                '''
            }
        }
    }
}
