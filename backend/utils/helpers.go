package utils

func Contains(s []string, str string) bool {
	for _, v := range s {
		if v == str {
			return true
		}
	}

	return false
}

func Min(a, b int) int {
	if a < b {
		return a
	}
	return b
}
