pipeline {
    agent any

    environment {
        IMAGE_NAME = "srimukh07/drivedeal-backend"
        MONGO_URI = credentials('MONGO_URI')
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

        stage('Login & Push Docker Image') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-password',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )
                ]) {retry(3){
                    bat '''
                    echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin
                    docker push %IMAGE_NAME%:latest
                    '''
                     }
                }
            }
        }

       
      stage('Deploy Container') {
    steps {
        bat '''
        docker stop drivedeal-backend 2>nul || echo Not running
        docker rm drivedeal-backend 2>nul || echo Not present

        docker run -d ^
        -p 5000:5000 ^
        --name drivedeal-backend ^
        srimukh07/drivedeal-backend:latest
        '''
    }
}


    }
}
