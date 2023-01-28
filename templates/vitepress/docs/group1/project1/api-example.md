# Api Docs Example

## Get User Info: /user/:id

method: GET

Other api description...

### Parameters

#### Header

| name          | description | required |
| ------------- | ----------- | -------- |
| Authorization | jwt token   | true     |

#### Path parameters

| name | description      | required |
| ---- | ---------------- | -------- |
| id   | user indentifier | false    |

#### Query parameters

| name     | description  | type   | required |
| -------- | ------------ | ------ | -------- |
| username | user account | string | false    |

### Response

| name       | description  | type   |
| ---------- | ------------ | ------ |
| username   | user account | string |
| statusCode | 200,403,500  | number |

### Usage

balabala...

## User List: /users

method: GET

Other api description...

### Parameters

#### Header

| name          | description | required |
| ------------- | ----------- | -------- |
| Authorization | jwt token   | true     |

#### Path parameters

| name | description | required |
| ---- | ----------- | -------- |
|      |             |          |

#### Query parameters

| name | description | type | required |
| ---- | ----------- | ---- | -------- |
| xxx  | xxx         | xxx  | true     |

### Response

| name       | description      | type   |
| ---------- | ---------------- | ------ |
| userList   | list of use info | User[] |
| statusCode | 200,403,500      | number |

#### User

| name     | description  | type   |
| -------- | ------------ | ------ |
| username | user account | string |

### Usage

balabala...
