# Photodrop - photographer API
## API endpoints:
#
### [POST] /auth/sign-up - using for register new users
### body: JSON
{
	"login": "test", // allowed: letters and underscore
	"password": "test", // allowed: letters and numbers
	"email": "test.test@test.com", // optional field
	"fullName": "Test Test" // optional field
}
#
### [POST] /auth/login
#### body: JSON
{
	"login": "test", // allowed: letters and underscore
	"password": "test", // allowed: letters and numbers
}
#### After login you will gain access token in response.body and refresh token in cookies. You should store access token in client side app in headers["authorization"].
#
### [POST] /auth/refresh
#### body: none
#### cookies: refreshToken - yourRefreshToken
#### After refreshing tokens you will gain new access token in response.body and new refresh token in cookies
#
### [GET] /auth/me
#### body: none
#### headers: ["authorization"]: access_token
- check access token expiration
#
### [GET] /user/get-all
- get all existing users (logins) from DB (for admins)
#
### [POST] /album/create-album
#### body: JSON
{
	"name": "New life2", // required field
	"location": "Glasgow", // required field
	"datapicker": "04 Dec 1995 00:12:00 GMT" // required field
}
#### headers: ["authorization"]: access_token
#### You will create new album with data from body
#
### [GET] /album/get-album/:album_id
#### body: none
#### headers: ["authorization"]: access_token
#### You will get your album with photos by album_id
#
### [GET] /album/all
#### body: none
#### headers: ["authorization"]: access_token
#### You will get all yours albums
#
### [POST] /album/upload-photos
#### body: multipart-form
{
  "clients": "32492347234,380509545671", // optional string of clients
  "album": "album_id", // required
  "files": file.jpg, // required at least 1 file
  "files": file2.png, // required at least 1 file
}
#### headers: ["authorization"]: access_token
#### Allow you to upload files to S3 from client side of application
#

