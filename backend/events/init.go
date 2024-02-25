package events

import "github.com/pocketbase/pocketbase"

func InitializeEvents(app *pocketbase.PocketBase) {
    OnBeforeServe(app)
    OnAfterBootstrap(app)
    OnRecordAfterAuth(app)
    OnRecordBeforeAuth(app)
    OnRecordsListRequest(app)
    OnRecordAfterCreateRequest(app)
    OnRecordAfterUpdateRequest(app)
    OnRecordBeforeUpdateRequest(app)
    OnRecordBeforeCreateRequest(app)
}