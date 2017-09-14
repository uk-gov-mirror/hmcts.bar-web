#!groovy
@Library('Reform')
import uk.gov.hmcts.Ansible
import uk.gov.hmcts.Packager
import uk.gov.hmcts.RPMTagger

properties(
  [[$class: 'GithubProjectProperty', projectUrlStr: 'http://git.reform.hmcts.net/bar/bar-web'],
   pipelineTriggers([[$class: 'GitHubPushTrigger']])]
)

Ansible ansible = new Ansible(this, 'bar_web')
Packager packager = new Packager(this, 'bar')

timestamps {
  milestone()
  lock(resource: "bar-web-${env.BRANCH_NAME}", inversePrecedence: true) {
    node('slave') {
      try {
        stage('Checkout') {
          deleteDir()
          checkout scm
        }

        stage('Setup') {
          sh '''
            yarn install
            yarn setup
          '''
        }

        stage('Lint') {
          sh "yarn run lint"
        }

        stage('Node security check') {
          try {
            sh "yarn test:nsp 2> nsp-report.txt"
          } catch (ignore) {
            sh "cat nsp-report.txt"
            archiveArtifacts 'nsp-report.txt'
            error "Node security check failed see the report for the errors"
          }
          sh "rm nsp-report.txt"
        }

        stage('Test') {
          try {
            sh "yarn test"
          } finally {
            archiveArtifacts 'mochawesome-report/unit.html'
          }
        }

        def barWebDockerVersion

        stage('Build Docker') {
          barWebDockerVersion = dockerImage imageName: 'bar/bar-web'
        }

//        stage("Trigger acceptance tests") {
//          build job: '/bar/bar-web-acceptance-tests/master', parameters: [
//            [$class: 'StringParameterValue', name: 'barWebDockerVersion', value: barWebDockerVersion]
//          ]
//        }

        onMaster {
          def rpmVersion

          stage('Publish RPM') {
            rpmVersion = packager.nodeRPM('bar-web')
            packager.publishNodeRPM('bar-web')
          }

          stage('Deploy (Dev)') {
            ansible.runDeployPlaybook("{bar_version: ${rpmVersion}}", 'dev')
            RPMTagger rpmTagger = new RPMTagger(this, 'bar-web', packager.rpmName('bar-web', rpmVersion), 'cc-local')
            rpmTagger.tagDeploymentSuccessfulOn('dev')
          }
        }
      } catch (Throwable err) {
        notifyBuildFailure channel: '#cc-payments-tech'
        throw err
      }
    }
    milestone()
  }
}
