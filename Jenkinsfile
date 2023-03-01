pipeline {
    agent {
        label "master"
    }

    parameters { booleanParam(name: 'Bypass_Snyk_NonHigh', defaultValue: false, description: 'Option to bypass Snyk Non-high and Critical vulnerabilities')
                 choice(name: 'Snyk_Severity_Threshold', choices: ['high', 'medium', 'low', 'critical'], description: 'Synk scan threshold')
    }   
    environment {
        PROJECT_NAME = "hitide"
        PRODUCT = "hitide-ui"
        BRANCH = ""             
        SRC = "https://github.jpl.nasa.gov/podaac/hitide-ui.git"
        DOCKER_IMAGE = ""
        DOCKER_IMAGE_TAG = ""
        DOCKER_CONTAINER_NAME = ""
        BUNDLE_NAME = ""
        BUILD_VERSION = ""
        BASE_VERSION = ""
        NEXT_VERSION = ""        
        COMMIT_ID = ""        
        ARTIFACTORY_DOCKER_REPO = "${ARTIFACTORY_DOCKER_DEVELOP}"        
        USER_CREDENTIALS = credentials("cbanh-jpl-ldap")        
        ARTIFACTORY_CRED = credentials("jenkins.cae.artifactory")
        ARTIFACTORY_REPO = "${ARTIFACTORY_URL}"
        ENV = ""
        LD_LIBRARY_PATH = "/usr/local/lib"
        
        ARTIFACTORY_BASE_PATH_DEV = "general-develop/gov/nasa/podaac"
        ARTIFACTORY_BASE_PATH_STAGE = "general-stage/gov/nasa/podaac"
        ARTIFACTORY_BASE_PATH_RELEASE = "general/gov/nasa/podaac"

        ARTIFACTORY_DOCKER_REPO_DEV="${ARTIFACTORY_DOCKER_DEVELOP}"
        ARTIFACTORY_DOCKER_REPO_STAGE="${ARTIFACTORY_DOCKER_STAGE}"
        ARTIFACTORY_DOCKER_REPO_RELEASE="${ARTIFACTORY_DOCKER_RELEASE}"

        ARTIFACT_PATH = ""

        ARTIFACTORY_CREDENTIALS_ID = "jenkins.cae.artifactory"

        delimiter = "alpha"
        buildDeployScript = "/usr/local/daac/deploy-service/build-deploy.py"

        SNYK_TOKEN_ID = "snyk_api_key"
    }
    stages {
        stage("Checkout") {
            steps {
                cleanWs()                
                checkout scm                
                Init()
                script {
                    env.ARTIFACT_PATH = "${DOCKER_IMAGE_TAG}"
                }
            }
        }
        stage("Install Dependencies") {
            steps {
                nodejs(nodeJSInstallationName: 'node-6') {
                    sh 'npm install'
                }
            }
        }
        stage("Test"){
            stages {
                stage('Snyk Monitor') {
                    when {
                        anyOf {
                            branch 'develop'
                            branch 'release/*'
                            branch 'master'
                            branch 'main'
                        }
                    }                                    
                    steps {                        
                        withCredentials([string(credentialsId: env.SNYK_TOKEN_ID, variable: 'SNYK_TOKEN')]) {
                            sh """
                            docker run --rm --env SNYK_TOKEN -v ${WORKSPACE}:/app snyk/snyk:node \
                            snyk monitor \
                            --project-name=podaac/${PRODUCT} \
                            --org=po.daac
                            """		
                        }
        
                    }
                }
                stage('Snyk Normal Run') {
                    when {
                        allOf {
                            not { expression { return params.Bypass_Snyk_NonHigh} }
                            not {
                                anyOf {
                                    branch 'develop'
                                    branch 'release/*'
                                    branch 'master'
                                    branch 'main'
                                }
                            }
                        }
                    }
                    steps {                        
                        withCredentials([string(credentialsId: env.SNYK_TOKEN_ID, variable: 'SNYK_TOKEN')]) {
                            sh """
                            docker run --rm --env SNYK_TOKEN -v ${WORKSPACE}:/app snyk/snyk:node \
                            snyk test --severity-threshold=${params.Snyk_Severity_Threshold} \
                            --project-name=podaac/${PRODUCT} \
                            --json-file-output=snyk-report.json
                            """		
                        }                                        
                    }
                }
                stage('Snyk Non-high') {
                    when {
                        allOf {
                            expression { return params.Bypass_Snyk_NonHigh} 
                            not {
                                anyOf {
                                    branch 'develop'
                                    branch 'release/*'
                                    branch 'master'
                                    branch 'main'
                                }
                            }
                        }
                    }
                    steps {                        
                        withCredentials([string(credentialsId: env.SNYK_TOKEN_ID, variable: 'SNYK_TOKEN')]) {
                            sh """
                                docker run --rm --env SNYK_TOKEN -v ${WORKSPACE}:/app snyk/snyk:node \
                                snyk test --severity-threshold=${params.Snyk_Severity_Threshold} \
                                --project-name=podaac/${PRODUCT} \
                                --json-file-output=snyk-report.json \
                                --fail-on=all
                            """		
                        }
                    }
                }
            }
        }
        stage("Build") {
            steps {
                nodejs(nodeJSInstallationName: 'node-6') {
                    sh 'npm run build'
                }
            }
        }
        stage("Build Docker Image") {
            steps {
                sh "docker build -t ${DOCKER_IMAGE_TAG} -f ./docker/Dockerfile ."
            }
        }
        stage("Push Docker Image to Artifactory") {
            steps {
                /*
                script {
                    def rtServer = Artifactory.server 'ARTIFACTORY_CAE'
                    def rtDocker = Artifactory.docker server: rtServer
                    rtDocker.push "${DOCKER_IMAGE_TAG}", ''
                }*/

                withCredentials([usernamePassword(credentialsId: env.ARTIFACTORY_CREDENTIALS_ID, usernameVariable: 'ARTIFACTORY_USER', passwordVariable: 'ARTIFACTORY_PASSWORD')]){
                    sh("""
                        docker login --username "${ARTIFACTORY_USER}" --password "${ARTIFACTORY_PASSWORD}" "${ARTIFACTORY_DOCKER_REPO}"
                        docker push ${DOCKER_IMAGE_TAG}
                    """)
                }
            }
        }
        stage("Create Deployment Bundle") {
            steps {
                sh """
                    if [ -f ${BUNDLE_NAME}.tar.gz ]; then
                        rm -f ${BUNDLE_NAME}.tar.gz
                    fi
                    if [ -d ${BUNDLE_NAME} ]; then
                        rm -rf ${BUNDLE_NAME}
                    fi
                """
                sh "mkdir ${BUNDLE_NAME}"                
                sh "cp docker-compose.yml.cm ${BUNDLE_NAME}/docker-compose.yml.cm"
                sh "cp build.sh ${BUNDLE_NAME}/."
                sh "cp cmToEnv.sh ${BUNDLE_NAME}/."
                sh "cp src/hitideConfig.js.cm ${BUNDLE_NAME}/."
                ReplaceStringInFile("\$VERSION", "${BUILD_VERSION}", "${BUNDLE_NAME}/docker-compose.yml.cm")
                sh "cat ${BUNDLE_NAME}/docker-compose.yml.cm"

                dir("${BUNDLE_NAME}") {
                    sh "tar -czf ../${BUNDLE_NAME}.tar.gz *"
                }
            }
        }
        stage("Send Deployment Bundle to Artifactory") {
            steps {
                PushResourcePackage()
            }
        }
        stage("Update Release Database"){
            steps {
                UpdateReleaseDb()
            }
        }
        stage('CMR') {
            when {
                anyOf {
                    branch 'master'
                    changeRequest target: 'master'
                    changelog '/jenkins deploy-cmr'
                }
            }
            agent {
                dockerfile {
                    filename 'cmr.Dockerfile'
                    dir 'cmr'
                    label 'devops1-cm'
                    args '-v /home/cm/.aws:/home/dockeruser/.aws:ro -v /home/cm/certs/:/home/dockeruser/certs'
                }
            }
            steps {
                sh "${WORKSPACE}/cmr/run_ummt_updater.sh ${TF_VENUE} ${BUILD_VERSION} /home/dockeruser/certs/launchpad_token_ngap_${TF_VENUE}.json"
            }
        }
        stage("Cleanup") {
            steps {
                sh """
                    if [ -f ${BUNDLE_NAME}.tar.gz ]; then
                        rm -rf ${BUNDLE_NAME}.tar.gz
                    fi
                    if [ -d ${BUNDLE_NAME} ]; then
                        rm -rf ${BUNDLE_NAME}
                    fi
                """
                sh "docker rmi ${DOCKER_IMAGE_TAG} || echo ${DOCKER_IMAGE_TAG} does not exist"
            }
        }
        stage("Deploy") {            
            when { 
                branch "feature/*"

                // below expresssion can be used for testing
                // expression {
                //     BRANCH ==~ /feature\/.*/
                // }
            }
            steps {
                TriggerDeployment("HiTIDE-UI/HiTIDE-UI-Deploy", "feature", "${BUILD_VERSION}")
            }
        }
    }
    post {
        always {
            emailext mimeType: 'text/html',
                to: "${L2SS_RECIPIENT}", 
                recipientProviders: [[$class: 'CulpritsRecipientProvider'],[$class: 'RequesterRecipientProvider'], [$class: 'DevelopersRecipientProvider']],                             
                body: '${SCRIPT, template="podaac-html-1.groovy"}',
                subject: "Jenkins Build ${currentBuild.currentResult}: Job ${env.JOB_NAME}"

            // sh "snyk-to-html -i snyk-report.json -o results.html -a"

            // publishHTML([reportName: 'Snyk Report',
            // allowMissing: false,
            // alwaysLinkToLastBuild: false,
            // keepAll: true,
            // reportDir: ".",
            // reportFiles: 'results.html'])
        }
    }
}

/////////////////////////////////////////////////////////////////////////////
//
//                              Helpers
//
/////////////////////////////////////////////////////////////////////////////
def Init()
{
    BRANCH = GetBranch()
    BASE_VERSION = GetBaseVersion()
    COMMIT_ID = GetCommitId()

    SetEnv("${BRANCH}")
    SetEnvPaths("${ENV}")

    // Increment version for all branches except master
    if (BRANCH.contains("release") || BRANCH.contains("develop")) {
        
        BUILD_VERSION = GetNextVersion(BRANCH)
    }
    else if (BRANCH.contains("master")) {
        BUILD_VERSION = BASE_VERSION
    }
    else {        
        BUILD_VERSION = GetNextVersion(BRANCH) + "_" + COMMIT_ID
    }

    DOCKER_IMAGE="${ARTIFACTORY_DOCKER_REPO}/poddac/${PROJECT_NAME}/${PRODUCT}:latest"
    DOCKER_IMAGE_TAG="${ARTIFACTORY_DOCKER_REPO}/podaac/${PROJECT_NAME}/${PRODUCT}:${BUILD_VERSION}"
    BUNDLE_NAME = "${PRODUCT}-${BUILD_VERSION}"
    DOCKER_CONTAINER_NAME = "${BUNDLE_NAME}"

    print("branch name is: " + BRANCH)
    print("Build Version is: " + BUILD_VERSION)

    UpdateVersionFile()
}

// SCM function can be used for debug/testing
def SCM() {
    checkout([
        $class: 'GitSCM',
        branches: [[name: 'feature/PODAAC-2393']],
        doGenerateSubmoduleConfigurations: false,
        extensions: [[$class: 'CleanCheckout', $class: 'LocalBranch', LocalBranch: "**"]],
        submoduleCfg: [],
        userRemoteConfigs: [[credentialsId: 'cbanh-jpl-ldap', url: "${SRC}"]]
    ])
}

def CleanWorkspace() {
    dir("${WORKSPACE}") {
        sh "rm -rf * && rm -rf .git"
    }
}

def GetBranch() {
    br = sh(script: "git rev-parse --abbrev-ref HEAD", returnStdout: true).trim()
    if (br.length() < 1 || br == "HEAD") {
        br = scm.branches[0].name
        
        if (br.length() < 1) {
            print("Error: cannot get branch name")
            return null
        }
    }
    else {
        return br
    }
    return br
}

def UpdateVersionFile() {
    print("Updating VERSION file...")
    sh "echo ${BUILD_VERSION} > VERSION"
}

def PushResourcePackage() {
    sh "curl -u ${ARTIFACTORY_CRED_USR}:${ARTIFACTORY_CRED_PSW} -X PUT ${ARTIFACTORY_PATH}/${PROJECT_NAME}/${PRODUCT}/${BUNDLE_NAME}.tar.gz -T ${BUNDLE_NAME}.tar.gz"
}

def ReplaceStringInFile(initialString, finalString, filename) {
    sh "sed -i 's|${initialString}|${finalString}|g' ${filename}"
}

def GetBaseVersion() {
    def packageJson = readJSON file: './package.json'
    return packageJson["version"].split('-')[0]
}

def GetNextVersion(String branch) {
    nextVersion = sh(returnStdout: true, script: "python3 ${buildDeployScript} version --product ${PROJECT_NAME}-${PRODUCT} --branch ${BRANCH} --get-next --base-version ${BASE_VERSION} --delimiter ${delimiter}").trim()
    if (nextVersion == "None")
        nextVersion = BASE_VERSION + "-" + delimiter + ".1"
    return nextVersion
}

def GetCommitId() {
    return sh(returnStdout: true, script: "git rev-parse --short HEAD").trim()
}

def UpdateReleaseDb() {
    sh(returnStdout: true, script: "python3 ${buildDeployScript} add --product ${PROJECT_NAME}-${PRODUCT} --branch ${BRANCH} --version ${BUILD_VERSION} --env ${ENV}").trim()
}

def SetEnvPaths(String environ) {

    switch(environ) {
        case ["sit", "test", "uat"]:
            ARTIFACTORY_PATH = "${ARTIFACTORY_REPO}/${ARTIFACTORY_BASE_PATH_RELEASE}"
            ARTIFACTORY_DOCKER_REPO = "${ARTIFACTORY_DOCKER_REPO_RELEASE}"
            TF_VENUE = "uat"
            delimiter = "rc"
            sh "echo $ARTIFACTORY_PATH"
            break;
        case "feature":
            ARTIFACTORY_PATH = "${ARTIFACTORY_REPO}/${ARTIFACTORY_BASE_PATH_DEV}"
            ARTIFACTORY_DOCKER_REPO = "${ARTIFACTORY_DOCKER_REPO_DEV}"
            TF_VENUE = "uat"
            delimiter = "alpha"
            sh "echo $ARTIFACTORY_PATH"
            break;
        case ["dev"]:
            ARTIFACTORY_PATH = "${ARTIFACTORY_REPO}/${ARTIFACTORY_BASE_PATH_DEV}"
            ARTIFACTORY_DOCKER_REPO = "${ARTIFACTORY_DOCKER_REPO_DEV}"
            TF_VENUE = "uat"
            delimiter = "dev"
            sh "echo $ARTIFACTORY_PATH"
            break;
        case ["ops", "prod"]:
            ARTIFACTORY_PATH = "${ARTIFACTORY_REPO}/${ARTIFACTORY_BASE_PATH_RELEASE}"
            ARTIFACTORY_DOCKER_REPO = "${ARTIFACTORY_DOCKER_REPO_RELEASE}"
            TF_VENUE = "ops"
            sh "echo $ARTIFACTORY_PATH"
            delimiter = ""
            break;
        default:
            sh "echo NO VALID ENVIRONMENT: Defaulting to Dev"
            delimiter = "pr"
            ARTIFACTORY_DOCKER_REPO = "${ARTIFACTORY_DOCKER_REPO_DEV}"
            ARTIFACTORY_PATH = "${ARTIFACTORY_REPO}/${ARTIFACTORY_BASE_PATH_DEV}"
            TF_VENUE = "uat"
            break;
    }
}

def SetEnv(String branch) {
    switch(branch) {
        case ~/.*release.*/:
            ENV = "test"
            sh "echo $ENV"
            break;
        case ~/.*develop.*/:
            ENV = "dev"
            sh "echo $ENV"
            break;
        case ~/.*feature.*/:
            ENV = "feature"
            sh "echo $ENV"
            break;
        case ~/.*master.*/:
            ENV = "prod"
            sh "echo $ENV"
            break;
        default:
            ENV = "pr"
            echo "default ENV"
    }
}

def TriggerDeployment(jobName, environment, version) {
    //paramBuildVersion = "${BUILD_VERSION}"
    //paramEnv = "dev"
    build job: jobName, parameters: [[$class: 'StringParameterValue', name: 'VERSION', value: version], [$class: 'StringParameterValue', name: 'ENV', value: environment]]
}