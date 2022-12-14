pipeline {
    agent any
    
    stages {

      stage ('Git pull') {
        steps {
          script {
            sh '''            
              ssh -o StrictHostKeyChecking=no root@shira.wearehorizontal.org "cd /home/shira-staging/shira-api ; git pull"
            '''
          }
        }
      }

      stage ('Build docker image') {
        steps {
          script {
            sh '''            
              ssh -o StrictHostKeyChecking=no root@shira.wearehorizontal.org "cd /home/shira-staging/shira-api ; docker-compose build prod ; docker-compose up -d prod"
            '''
          }
        }
      }
      
      stage ('Migrate if needed') {
        steps {
          script {
            sh '''            
              ssh -o StrictHostKeyChecking=no root@shira.wearehorizontal.org "cd /home/shira-staging/shira-api ; docker-compose exec -it prod npm run typeorm migration:run"
            '''
          }
        }
      }

      stage ('Clean unneccesary docker images') {
        steps{
            sh 'docker image prune -a -f'
        }
      }
    }
}