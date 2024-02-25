package types

type Task struct {
	Id                  string `db:"id" json:"id"`
	Name                string `db:"task_name" json:"task_name"`
	EtalonResultContent string
	EtalonResultPath    string `db:"etalon_result" json:"etalon_result"`
}
