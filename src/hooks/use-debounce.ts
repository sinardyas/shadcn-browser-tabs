import { useEffect, useState } from "react";

// biome-ignore lint/suspicious/noExplicitAny: This hook needs to be an `any` type
export function useDebounce<T = any>(value: T, delay: number) {
	const [debouncedValue, setDebouncedValue] = useState<T>(value);

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => {
			clearTimeout(handler);
		};
	}, [value, delay]);

	return debouncedValue;
}
