package types

type GithubMetaType struct {
	Repository string `json:"repository"`
	RunId      string `json:"run_id"`
}

type GithubTaskType struct {
	Output         string  `json:"output"`
	Execution_time float32 `json:"execution_time"`
}

type GithubRequestBody struct {
	Meta  GithubMetaType            `json:"meta"`
	Tasks map[string]GithubTaskType `json:"tasks"`
}

type GithubResponseBody struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
}
