package utils

import (
	"errors"
	"hackathon-backend/types"
	"log"
	"net/http"
	"os"
	"os/exec"
	"strings"

	"github.com/pocketbase/pocketbase/models"
)

var git_folder = "pb_git_sandbox"

func CheckRunIdIsValid(m *types.GithubMetaType) error {
	getRunByIdUrl := "https://api.github.com/repos/" + m.Repository + "/actions/runs/" + m.RunId
	resp, err := http.Get(getRunByIdUrl)
	if err != nil || resp.StatusCode >= 400 {
		return errors.New("Server can't access the details of this run (" + m.RunId + ")")
	}
	return nil
}

func runCmd(cmd, dir string) bool {
	cmdList := strings.Split(cmd, " ")
	_cmd := exec.Command(cmdList[0], cmdList[1:]...)
	_cmd.Dir = dir
	out, err := _cmd.Output()
	log.Default().Println(cmd, string(out[:]), err)
	if werr, ok := err.(*exec.ExitError); ok {
		s := werr.Error()
		return s == "0"
	}
	return true
}

// with token
// git clone https://username:token@github.com/username/repo.git

// git clone https://github.com/danikova/example_project_2 danikova-example_project_2
// cd danikova-example_project_2
// git remote add -f primary https://github.com/danikova/example_project
// git remote update
// git --no-pager diff --exit-code origin/main remotes/primary/main .github/ >/dev/null
// echo $?
// 		o - ok | 1 - not ok

func CheckGithubFolderContent(m *types.GithubMetaType, primaryProject *models.Record) error {
	if _, err := os.ReadDir(git_folder); err != nil {
		if err := os.Mkdir(git_folder, os.ModePerm); err != nil {
			return err
		}
	}

	primaryProjectUrl := primaryProject.GetString("value")

	if primaryProjectUrl == "" {
		return errors.New("Please set primary_project url, contact with an admin")
	}

	currentRepoDir := strings.ReplaceAll(m.Repository, "/", "-")
	currentRepoPath := git_folder + "/" + currentRepoDir
	runCmd("git clone https://github.com/"+m.Repository+" "+currentRepoDir, git_folder)
	runCmd("git fetch", currentRepoPath)
	isRemoteAdded := runCmd("git remote add -f primary"+" "+primaryProjectUrl, currentRepoPath)
	if !isRemoteAdded {
		runCmd("git remote set-url primary"+" "+primaryProjectUrl, currentRepoPath)
	}
	isRepoDone := runCmd("git remote update", currentRepoPath)

	if !isRepoDone {
		return errors.New("Something went wrong with the repo initialization, contact with an admin")
	}

	githubDirChanged := runCmd("git --no-pager diff --exit-code origin/main remotes/primary/main .github/", currentRepoPath)

	if !githubDirChanged {
		return errors.New("Something changed in the .github/ folder, your solution should be based ont this project (as a template) " + primaryProjectUrl + ", please revert all the changes on the .github/ folder")
	}

	return nil
}
