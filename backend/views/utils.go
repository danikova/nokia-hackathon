package views

import (
	"regexp"
	"strings"
)

var queryCleaner = regexp.MustCompile(`\s+`)

func minifyQueryStr(queryStr string) string {
	return strings.TrimSpace(queryCleaner.ReplaceAllString(queryStr, " "))
}
