package utils

func Contains(s []string, str string) bool {
	for _, v := range s {
		if v == str {
			return true
		}
	}

	return false
}

func ContainsWithLambda[T any](s []T, fn func(value T) bool) *T {
	for _, v := range s {
		if fn(v) {
			return &v
		}
	}

	return nil
}

func Min(a, b int) int {
	if a < b {
		return a
	}
	return b
}

func Map[T, U any](ts []T, f func(T) U) []U {
	us := make([]U, len(ts))
	for i := range ts {
		us[i] = f(ts[i])
	}
	return us
}
