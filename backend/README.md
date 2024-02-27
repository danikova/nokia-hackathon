## pocketbase dev user password

testuser@test.com

before run:

- go mod tidy
- go run main.go migrate
- go run main.go

before first run:

- set db data
  - set _info_cards_
  - set _globals_
  - set _user_whitelist_
  - set _run_tasks_ accordingly

some usefull link:

- https://pocketbase.io/docs/go-migrations
