pipeline {
    agent any

    environment {
        IMAGE_NAME = "srimukhas777/drivedeal-backend"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/srimukhas777-del/DriveDeal.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat '''
                cd backend
                npm install
                '''
            }
        }

        stage('Run Tests') {
            steps {
                bat '''
                cd backend
                npm test
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                bat '''
                cd backend
                docker build -t %IMAGE_NAME%:latest .
                '''
            }
        }

        stage('Push Docker Image') {
            steps {
                withCredentials([
                    string(credentialsId: 'dockerhub-password', variable: 'DOCKER_PASS')
                ]) {
                    bat '''
                    cd backend
                    echo %DOCKER_PASS% | docker login -u srimukhas777 --password-stdin
                    docker push %IMAGE_NAME%:latest
                    '''
                }
            }
        }

        stage('Deploy Container') {
            steps {
                bat '''
                docker stop drivedeal || exit 0
                docker rm drivedeal || exit 0
                docker run -d -p 5000:5000 --name drivedeal %IMAGE_NAME%:latest
                '''
            }
        }
    }
}
