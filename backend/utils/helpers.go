package utils

func Contains(s []string, str string) bool {
	for _, v := range s {
		if v == str {
			return true
		}
	}

	return false
}

func ContainsWithLambda[T any](s []T, fn func(value T) bool) bool {
	for _, v := range s {
		if fn(v) {
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
