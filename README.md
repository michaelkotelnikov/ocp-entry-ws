# OpenShift Entry WorkShop

The purpose of this workshop is to provide developers / devops / platforms teams with basic orientation around the OpenShift platform.

The workshop allows users to provision a basic frontend -> backend application on OpenShift, use ArgoCD to maintain changes in a GitOps fashion and monitor critical parameters in the application's stack.

## Part 1

In this section, you will experience the with deployment of an application in a dedicated namespace in OpenShift by using the OpenShift user interface. You will deploy the application, investigate its resources and expose it to the internet.

Follow the next steps -

1. Navigate to the OpenShift console link and log into the cluster by using the link and credentials provided by the instructor.

2. Copy the next manifests -

```
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
  labels:
    app: backend
spec:
  selector:
    matchLabels:
      app: backend
  replicas: 1
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
        - name: backend
          image: docker.io/mkotelni/backend:0.0.4
          ports:
            - containerPort: 5000
              name: backend
          resources:
            requests:
              memory: "128Mi"
              cpu: "100m"
---
apiVersion: v1
kind: Service
metadata:
  labels:
    app: backend
  name: backend
spec:
  ports:
  - name: 5000-tcp
    port: 5000
    protocol: TCP
    targetPort: 5000
  selector:
    app: backend
  sessionAffinity: None
  type: ClusterIP
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
  labels:
    app: frontend
spec:
  selector:
    matchLabels:
      app: frontend
  replicas: 1
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
        - name: frontend
          image: docker.io/mkotelni/frontend:0.0.12
          ports:
            - containerPort: 3000
              name: frontend
          resources:
            requests:
              memory: "512Mi"
              cpu: "100m"
---
apiVersion: v1
kind: Service
metadata:
  labels:
    app: frontend
  name: frontend
spec:
  ports:
  - name: 3000-tcp
    port: 3000
    protocol: TCP
    targetPort: 3000
  selector:
    app: frontend
  sessionAffinity: None
  type: ClusterIP
```

3. Click on the '_+_' icon in the upper right corner of the OpenShift console. In the top left corner, change '_All Projects_' to the Project your user has been affiliated with.

4. Paste the manifests you copied and press '_Create_'.

5. In the top left corner of the console, switch the console mode from '_Developer_' to '_Administrator_'.

6. Navigate to '_Workloads' -> 'Pods_' to visualize your containers.

Your application is now running. In the next section you will expose the application externally -

1. Navigate to '_Networking_' -> '_Routes_'.

2. Click on '_Create Route_' in the top right corner.

3. In the '_Name_' tab, write - '__frontend__'

4. In the '_Service_' tab, select - '__frontend__'

5. In the '_Target Port_' tab, select - '__3000 -> 3000__'

6. Click on the '__Secure Route__' checkbox.

7. In the '_TLS termination_' section select '__Edge__'.

8. Press on '_Create_'.

9. Press on the link under '_Location_' to navigate to the application.

## Part 2

In this section, you will enroll the application into the OpenShift monitoring stack.

1. Import the manifests at '_k8s/monitoring/_' in this repository by following the same method you created the manifests in the previous part.

2. Navigate from '_Administrator_' to '_Developer_' in the top left of the OpenShift console.

3. Click on '_Observe_' in the slidebar.

4. Click on '_Metrics_' in the menu.

5. Click on '_Select query_' and press on '_Custom query_'.

6. Insert the next query into the search bar - '_get_requests_total_'.

7. The metric represents the number of requests that reached the backend. In the application, press '_Refresh Data_' until the metric reaches over 20 requests.

8. Navigate to the '_Alerts_' panel in OpenShift and explore the dashboard.

## Part 3

In this section, you will enroll the 'backend' component of the application into ArgoCD and utilize GitOps practices.

1. Fork this GitHub repository by using your GitHub account (No need to install git client on your workstation, everything can be done via the browser).

2. Log into the ArgoCD instance by browsing to the URL provided by the instructor. Use the OpenShift credentials.

3. In ArgoCD, click on '_Create Application_'.

4. Click on '_Edit as YAML_'.

5. Copy the next manifest into ArgoCD. Make sure to edit the '_name_', '_repoURL_', '_namespace_' and '_project_' fields with your information.

```
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: application-<your username | e.g - user-1>
  namespace: openshift-gitops
spec:
  destination:
    name: in-cluster
    namespace: <your username | e.g - user-1>
  project: <your username | e.g - user-1>
  source:
    path: k8s/backend
    repoURL: https://github.com/<your GitHub username | e.g - michaelkotelnikov>/ocp-entry-ws
    targetRevision: master
  syncPolicy:
    automated:
      prune: false
      selfHeal: true
```

6. Click on '_Save_' and then on '_Create_'.

7. Make sure the application is synced successfuly.

8. Change the manifest at '_k8s/backend/deployment.yaml_'. Modify the value at - '_cpu_' to '_150m_'. Make sure to push your commit.

9. Press on '_Refresh_' in the ArgoCD instance. Make sure the changes apply automatically.