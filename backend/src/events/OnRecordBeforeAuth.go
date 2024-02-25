package events

import (
	"hackathon-backend/src/utils"
	"net/http"

	"github.com/labstack/echo/v5"
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
)

var userWhitelistCollectionName = "user_whitelist"

func isUserAcceptedToLogIn(app *pocketbase.PocketBase, username, email string) bool {
	var expressions []dbx.Expression
	if username != "" {
		expressions = append(expressions, dbx.HashExp{"username": username})
	}
	if email != "" {
		expressions = append(expressions, dbx.HashExp{"email": email})
	}

	records, err := app.Dao().FindRecordsByExpr(userWhitelistCollectionName, dbx.Or(expressions[:]...))
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
