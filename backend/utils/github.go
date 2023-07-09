package utils

import (
	"errors"
	"hackathon-backend/types"
	"net/http"
	"os/exec"
)

func CheckRunIdIsValid(m types.GithubMetaType) error {
	getRunByIdUrl := "https://api.github.com/repos/" + m.Repository + "/actions/runs/" + m.RunId
	resp, err := http.Get(getRunByIdUrl)
	if err != nil || resp.StatusCode >= 400 {
		return errors.New("Server can't access the details of this run (" + m.RunId + ")")
	}
	return nil
}

func runCmd(cmd string) ([]byte, error) {
	out, err := exec.Command(cmd).Output()
	if err != nil {
		return nil, err
	}
	return out, nil
}

func updateBaseRepo() error {

}
