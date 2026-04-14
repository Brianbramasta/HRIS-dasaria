Authentication and session management (Better Auth)
Auth
Role master data management (RBAC)
Roles
v1.0.0 OAS 3.0.3
RBAC Service – Dasaria - Ceria Luar Biasa
RBAC (Role-Based Access Control) backend service built with Elysia.js.
This service provides authentication, role management, and access control for internal
Dasaria Management.
Authentication is handled via Better Auth.
Server
https://qz97xl4p-3000.asse.devtunnels.ms
Client Libraries
Shell Curl
Shell Ruby Node.js PHP Python More
Download OpenAPI Document
Update feature
Access control and permission mapping
Access
Operations
POST /access/
GET /access/
GET /access/{id}
PATCH /access/{id}
DELETE /access/{id}
Body required application/json
Responses
Create access
features_id string · min length: 36 · max length: 36 required
array object[] required
Show Child Attributes
items
200
POST /access/ Shell Curl

1 curl https: /qz97xl4p-3000.asse.devtunnels.ms/access/ \
2 -request POST \
3 -header 'Content-Type: application/json' \
4 -data '{
5 "features_id": "c954cacf-4d18-46ce-865b-2ad5af758b6c",
6 "items": [
7 {
8 "name": "Access Xyz",
9 "describe": "This is access xyz"
10 },
11 {
12 "name": "Access Abc",


13 "describe": "This is access abc"
14 }
15 ]
16 }'
Test Request
Query Parameters
Responses
Get access list
q string
features_id string · min length: 36 · max length: 36
Any of string
page
string · numeric · default: 0
Any of string
per_page
string · numeric · default: 0
200
Path Parameters
Responses
Get access by id
id string · min length: 36 · max length: 36 required
GET /access/ Shell Curl
1 curl https: /qz97xl4p-3000.asse.devtunnels.ms/access/
Test Request
200
GET /access/{id} Shell Curl
1 curl 'https: /qz97xl4p-3000.asse.devtunnels.ms/access/{id}'
Test Request
Path Parameters
Body required application/json
Responses
Update access
id string · min length: 36 · max length: 36 required
describe string · min length: 1 · max length: 100
name string · min length: 1 · max length: 100
200
PATCH /access/{id} Shell Curl
1 curl 'https: /qz97xl4p-3000.asse.devtunnels.ms/access/{id}' \
2 -request PATCH \
3 -header 'Content-Type: application/json' \
4 -data '{
5 "name": "",
6 "describe": ""
7 }'
Test Request
Path Parameters
Delete access
Responses
id string · min length: 36 · max length: 36 required
200
DELETE /access/{id} Shell Curl
1 curl 'https: /qz97xl4p-3000.asse.devtunnels.ms/access/{id}' \
2 -request DELETE
Test Request
Application modules registered in RBAC
Modules
Operations
POST /modules/
GET /modules/
GET /modules/{id}
PATCH /modules/{id}
DELETE /modules/{id}
Body required application/json
Responses
Create module
apps_id string · min length: 36 · max length: 36 required
required
Any of string
name
string · min length: 1 · max length: 150
200
POST /modules/ Shell Curl
1 curl https: /qz97xl4p-3000.asse.devtunnels.ms/modules/ \
2 -request POST \
3 -header 'Content-Type: application/json' \
4 -data '{
5 "apps_id": "342dbb22-0f84-4996-80a8-750e55c362d2",
6 "name": [
7 "Module A",
8 "Module X"
9 ]
10 }'
Test Request
Query Parameters
Responses
Get modules
q string
apps_id string · min length: 36 · max length: 36
Any of string
page
string · numeric · default: 0
Any of string
per_page
string · numeric · default: 0
200
GET /modules/ Shell Curl
1 curl https: /qz97xl4p-3000.asse.devtunnels.ms/modules/
Test Request
Path Parameters
Responses
Get module by id
id string · min length: 36 · max length: 36 required
200
GET /modules/{id} Shell Curl
1 curl 'https: /qz97xl4p-3000.asse.devtunnels.ms/modules/{id}'
Test Request
Path Parameters
Body required application/json
Responses
Update module
id string · min length: 36 · max length: 36 required
name string · min length: 1 · max length: 150
200
PATCH /modules/{id} Shell Curl
1 curl 'https: /qz97xl4p-3000.asse.devtunnels.ms/modules/{id}' \
2 -request PATCH \
3 -header 'Content-Type: application/json' \
4 data '{
4 -data {
5 "name": "Module Xyz"
6 }'
Test Request
Path Parameters
Responses
Delete module
id string · min length: 36 · max length: 36 required
200
DELETE /modules/{id} Shell Curl
1 curl 'https: /qz97xl4p-3000.asse.devtunnels.ms/modules/{id}' \
2 -request DELETE
Test Request
Feature-level access definitions
Features
Operations
POST /features/
GET /features/
GET /features/{id}
PATCH /features/{id}
DELETE /features/{id}
Create feature
Body required application/json
Responses
modules_id string · min length: 36 · max length: 36 required
required
Any of string
name
string · min length: 1 · max length: 150
200
POST /features/ Shell Curl
1 curl https: /qz97xl4p-3000.asse.devtunnels.ms/features/ \
2 -request POST \
3 -header 'Content-Type: application/json' \
4 -data '{
5 "modules_id": "956f59ed-4d7b-4fab-8ab5-9a34ca064aee",
6 "name": [
7 "Feature Xyz",
8 "Feature ABC"
9 ]
10 }'
Test Request
Query Parameters
Get features
q string
modules_id string · min length: 36 · max length: 36
Any of string
page
string · numeric · default: 0
Any of string
per_page
string · numeric · default: 0
Responses
200
GET /features/ Shell Curl
1 curl https: /qz97xl4p-3000.asse.devtunnels.ms/features/
Test Request
Path Parameters
Responses
Get feature by id
id string · min length: 36 · max length: 36 required
200
GET /features/{id} Shell Curl
1 curl 'https: /qz97xl4p-3000.asse.devtunnels.ms/features/{id}'
Test Request
Path Parameters
Body required application/json
Responses
Update feature
id string · min length: 36 · max length: 36 required
name string · min length: 1 · max length: 150
200
PATCH /features/{id} Shell Curl
1 curl 'https: /qz97xl4p-3000.asse.devtunnels.ms/features/{id}' \
2 -request PATCH \
3 -header 'Content-Type: application/json' \
4 -data '{
5 "name": "Feature Xyz"
6 }'
Test Request
Path Parameters
Responses
Delete feature
id string · min length: 36 · max length: 36 required
200
DELETE /features/{id} Shell Curl
1 curl 'https: /qz97xl4p-3000.asse.devtunnels.ms/features/{id}' \
2 -request DELETE
Test Request
test
Operations
GET /
Show More
Apps
Operations
POST /apps/
GET /apps/
GET /apps/{id}
PATCH /apps/{id}
DELETE /apps/{id}
Body required application/json
Responses
Create app
name array string[] · 1… required
200
POST /apps/ Shell Curl
1 curl https: /qz97xl4p-3000.asse.devtunnels.ms/apps/ \
2 -request POST \
3 -header 'Content-Type: application/json' \
4 -data '{
5 "name": [
6 "App A",
7 "App B"
8 ]
9 }'
Test Request
Get apps
Query Parameters
Responses
q string
Any of string
page
string · numeric · default: 0
Any of string
per_page
string · numeric · default: 0
200
GET /apps/ Shell Curl
1 curl https: /qz97xl4p-3000.asse.devtunnels.ms/apps/
Test Request
Path Parameters
Responses
Get app by id
id string · min length: 36 · max length: 36 required
200
GET /apps/{id} Shell Curl
1 curl 'https: /qz97xl4p-3000.asse.devtunnels.ms/apps/{id}'
Test Request
Path Parameters
Body required application/json
Responses
Update app
id string · min length: 36 · max length: 36 required
name string · min length: 1 · max length: 150 required
200
PATCH /apps/{id} Shell Curl
1 curl 'https: /qz97xl4p-3000.asse.devtunnels.ms/apps/{id}' \
2 -request PATCH \
3 -header 'Content-Type: application/json' \
4 -data '{
5 "name": "App B Updated"
6 }'
Test Request
Path Parameters
Responses
Delete app
id string · min length: 36 · max length: 36 required
200
DELETE /apps/{id} Shell Curl
1 curl 'https: /qz97xl4p-3000.asse.devtunnels.ms/apps/{id}' \
2 -request DELETE
Test Request
Roles Access
Operations
POST /roles-access/
GET /roles-access/{id}
GET /roles-access/app-role
Body required application/json
Responses
Create or Replace Roles Access (Bulk)
array object[] required
Show Child Attributes
items
200
POST /roles-access/ Shell Curl


1 curl https: /qz97xl4p-3000.asse.devtunnels.ms/roles-access/ \
2 -request POST \
3 -header 'Content-Type: application/json' \
4 -data '{
5 "items": [
6 {
7 "id": null,
8 "name": "Admin",
9 "apps_id": "342dbb22-0f84-4996-80a8-750e55c362d2",
10 "accessIds": [
11 "164fdc5f-5565-4467-8bda-821ce546795d",
12 "6568ebb9-4343-4c02-a034-ad9a9b26aa27"
13 ]
14 }
15 ]

16 }' 
Test Request
Path Parameters
Responses
Get roles Access
id string · min length: 36 · max length: 36 required
200
GET /roles-access/{id} Shell Curl
1 curl 'https: /qz97xl4p-3000.asse.devtunnels.ms/roles-access/{id}'
Test Request
Responses
List apps per role
200
GET /roles-access/app-role Shell Curl
1 curl https: /qz97xl4p-3000.asse.devtunnels.ms/roles-access/app-role
Test Request