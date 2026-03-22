import { useEffect, useRef, useState } from "react";

export function useCountdown(durationSec: number) {
	const [remaining, setRemaining] = useState(durationSec);
	const [running, setRunning] = useState(false);
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

	useEffect(() => {
		setRemaining(durationSec);
	}, [durationSec]);

	useEffect(() => {
		if (running) {
			intervalRef.current = setInterval(() => {
				setRemaining((r) => {
					if (r <= 1) {
						if (intervalRef.current) {
							clearInterval(intervalRef.current);
						}
						setRunning(false);
						return 0;
					}
					return r - 1;
				});
			}, 1000);
		} else if (intervalRef.current) {
			clearInterval(intervalRef.current);
		}
		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
	}, [running]);

	function toggle() {
		setRunning((v) => !v);
	}

	function reset() {
		setRunning(false);
		setRemaining(durationSec);
	}

	const minutes = Math.floor(remaining / 60);
	const seconds = remaining % 60;
	const progress = 1 - remaining / durationSec;
	const display = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

	return { display, running, toggle, reset, progress };
}
