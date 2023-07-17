package events

import (
	"hackathon-backend/utils"
	"net/http"

	"github.com/labstack/echo/v5"
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
)

var userWhitelistCollectionName = "user_whitelist"

func isUserAcceptedToLogIn(app *pocketbase.PocketBase, username, email string) bool {
	records, err := app.Dao().FindRecordsByExpr(userWhitelistCollectionName,
		dbx.Or(dbx.HashExp{"username": username}, dbx.HashExp{"email": username}),
	)
	if len(records) == 0 || err != nil {
		return false
	}
	return true
}

func OnRecordBeforeAuth(app *pocketbase.PocketBase) {
	app.OnRecordBeforeAuthWithPasswordRequest().Add(func(e *core.RecordAuthWithPasswordEvent) error {
		disableLoginRec, _ := utils.GetGlobalValueByKey(app, utils.DisableLoginKey)
		isLoginDisabled := true
		if disableLoginRec != nil && disableLoginRec.GetString("value") == "false" {
			isLoginDisabled = false
		}

		if isLoginDisabled {
			return echo.NewHTTPError(http.StatusUnauthorized, "Login is temporarily disabled")
		}

		if !isUserAcceptedToLogIn(app, e.Identity, e.Identity) {
			return echo.NewHTTPError(http.StatusUnauthorized, "User is not in the whitelist")
		}

		return nil
	})
	app.OnRecordBeforeAuthWithOAuth2Request().Add(func(e *core.RecordAuthWithOAuth2Event) error {
		disableLoginRec, _ := utils.GetGlobalValueByKey(app, utils.DisableLoginKey)
		isLoginDisabled := true
		if disableLoginRec != nil && disableLoginRec.GetString("value") == "false" {
			isLoginDisabled = false
		}

		if isLoginDisabled {
			return echo.NewHTTPError(http.StatusUnauthorized, "Login is temporarily disabled")
		}

		if !isUserAcceptedToLogIn(app, e.OAuth2User.Username, e.OAuth2User.Email) {
			return echo.NewHTTPError(http.StatusUnauthorized, "User is not in the whitelist")
		}

		return nil
	})
}
