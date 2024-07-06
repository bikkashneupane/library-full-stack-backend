# Backend for Library management

<!-- Auth middleware for server -->

1. receive jwt via authorization header
2. verify jwt is valid (not expired, secretkey) by decoding jwt
3. Check if the token exist in the DB, session table
4. Extract email from the decoded jwt obj
5. Get user by email
6. If user exist, they are now authorised

# 401- Unauthorised

# 403- Unauthenticated
