package events

import (
	"hackathon-backend/src/tables"
	"hackathon-backend/src/utils"
	"net/http"

	"github.com/labstack/echo/v5"
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
)

func OnRecordBeforeAuth(app *pocketbase.PocketBase) {
	app.OnRecordBeforeAuthWithPasswordRequest().Add(func(e *core.RecordAuthWithPasswordEvent) error {
		return checkLoginConditions(app, e.Identity, e.Identity)
	})
	app.OnRecordBeforeAuthWithOAuth2Request().Add(func(e *core.RecordAuthWithOAuth2Event) error {
		return checkLoginConditions(app, e.OAuth2User.Username, e.OAuth2User.Email)
	})
}

func isUserAcceptedToLogIn(app *pocketbase.PocketBase, username, email string) bool {
	var expressions []dbx.Expression
	if username != "" {
		expressions = append(expressions, dbx.HashExp{"username": username})
	}
	if email != "" {
		expressions = append(expressions, dbx.HashExp{"email": email})
	}

	records, err := app.Dao().FindRecordsByExpr(tables.UserWhitelistCollectionName, dbx.Or(expressions[:]...))
	if len(records) == 0 || err != nil {
		return false
	}
	return true
}

func checkLoginConditions(app *pocketbase.PocketBase, username, email string) error {
	if isLoginDisabled(app) {
		return echo.NewHTTPError(http.StatusUnauthorized, "Login is temporarily disabled")
	}

	if !isUserAcceptedToLogIn(app, username, email) {
		return echo.NewHTTPError(http.StatusUnauthorized, "User is not in the whitelist")
	}

	return nil
}

func isLoginDisabled(app *pocketbase.PocketBase) bool {
	disableLoginRec, _ := utils.GetGlobalValueByKey(app, utils.DisableLoginKey)
	return disableLoginRec == nil || disableLoginRec.GetString("value") == "false"
}
