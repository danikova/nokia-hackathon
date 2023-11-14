package views

import (
	"os"
	"regexp"
	"strings"
)

var queryCleaner = regexp.MustCompile(`\s+`)

func minifyQueryStr(queryStr string) string {
	return strings.TrimSpace(queryCleaner.ReplaceAllString(queryStr, " "))
}

func readSqlQuery(path string) string {
	f, err := os.ReadFile(path)
	if err != nil {
		panic(err)
	}
	return minifyQueryStr(string(f))
}
