pipeline {
    agent any

    stages {
      stage('Deploy production') {
          when {
            branch 'main'  
          }
          steps {
            script {
              sh '''            
                ssh -o StrictHostKeyChecking=no root@shira.app "cd /home/shira-production/shira-api ; git pull"
              '''
            }

            script {
              sh '''            
                ssh -o StrictHostKeyChecking=no root@shira.app "cd /home/shira-production/shira-api ; docker compose build prod ; docker compose up -d prod"
              '''
            }

            script {
              sh '''            
                ssh -o StrictHostKeyChecking=no root@shira.app "cd /home/shira-production/shira-api ; docker compose exec -it prod npm run typeorm migration:run"
              '''
            }

            script {
              sh '''            
                ssh -o StrictHostKeyChecking=no root@shira.app "cd /home/shira-production/shira-api ; docker image prune -a -f "
              '''
            }
          }
      }

      stage('Deploy staging') {
          when {
            branch 'development'  
          }
          steps {
            script {
              sh '''            
                ssh -o StrictHostKeyChecking=no root@beta.shira.app "cd /home/shira-staging/shira-api ; git pull"
              '''
            }

            script {
              sh '''            
                ssh -o StrictHostKeyChecking=no root@beta.shira.app "cd /home/shira-staging/shira-api ; docker-compose build staging ; docker-compose up -d staging"
              '''
            }

            script {
              sh '''            
                ssh -o StrictHostKeyChecking=no root@beta.shira.app "cd /home/shira-staging/shira-api ; docker-compose exec -it staging npm run typeorm migration:run"
              '''
            }

            script {
              sh '''            
                ssh -o StrictHostKeyChecking=no root@beta.shira.app "cd /home/shira-staging/shira-api ; docker image prune -a -f"
              '''
            }
          }
      }
    }
}