import { browser } from "$app/environment";

export interface VoiceRecorderState {
	isRecording: boolean;
	isPaused: boolean;
	duration: number; // seconds
	error: string | null;
}

const MIME_TYPE = "audio/webm;codecs=opus";
const FALLBACK_MIME = "audio/webm";

/**
 * Svelte 5 hook for voice recording using MediaRecorder API.
 * Uses runes for state management.
 */
export function useVoiceRecorder() {
	let isRecording = $state(false);
	let isPaused = $state(false);
	let duration = $state(0);
	let error = $state<string | null>(null);

	let mediaRecorder: MediaRecorder | null = null;
	let chunks: Blob[] = [];
	let stream: MediaStream | null = null;
	let timer: ReturnType<typeof setInterval> | null = null;
	let resolveStop: ((blob: Blob | null) => void) | null = null;

	const cleanup = () => {
		if (timer) {
			clearInterval(timer);
			timer = null;
		}
		if (stream) {
			stream.getTracks().forEach((track) => track.stop());
			stream = null;
		}
		mediaRecorder = null;
		chunks = [];
	};

	const startRecording = async () => {
		if (!browser) return;

		try {
			isRecording = false;
			isPaused = false;
			duration = 0;
			error = null;
			cleanup();

			const userStream = await navigator.mediaDevices.getUserMedia({ audio: true });
			stream = userStream;

			const mimeType = MediaRecorder.isTypeSupported(MIME_TYPE) ? MIME_TYPE : FALLBACK_MIME;
			const recorder = new MediaRecorder(stream, { mimeType });
			mediaRecorder = recorder;
			chunks = [];

			recorder.ondataavailable = (e) => {
				if (e.data.size > 0) {
					chunks.push(e.data);
				}
			};

			recorder.onstop = () => {
				const blob = new Blob(chunks, { type: mimeType });
				if (resolveStop) {
					resolveStop(blob);
					resolveStop = null;
				}
				cleanup();
				isRecording = false;
				isPaused = false;
			};

			recorder.onerror = () => {
				error = "Recording failed";
				cleanup();
			};

			recorder.start(100); // Collect data every 100ms

			// Start duration timer
			timer = setInterval(() => {
				duration = duration + 1;
			}, 1000);

			isRecording = true;
			isPaused = false;
			duration = 0;
			error = null;
		} catch (err) {
			const message = err instanceof Error ? err.message : "Microphone access denied";
			error = message;
			isRecording = false;
			isPaused = false;
			duration = 0;
		}
	};

	const stopRecording = (): Promise<Blob | null> => {
		return new Promise((resolve) => {
			if (!mediaRecorder || mediaRecorder.state === "inactive") {
				resolve(null);
				return;
			}
			resolveStop = resolve;
			mediaRecorder.stop();
		});
	};

	const pauseRecording = () => {
		if (mediaRecorder?.state === "recording") {
			mediaRecorder.pause();
			if (timer) {
				clearInterval(timer);
				timer = null;
			}
			isPaused = true;
		}
	};

	const resumeRecording = () => {
		if (mediaRecorder?.state === "paused") {
			mediaRecorder.resume();
			timer = setInterval(() => {
				duration = duration + 1;
			}, 1000);
			isPaused = false;
		}
	};

	const cancelRecording = () => {
		if (resolveStop) {
			resolveStop(null);
			resolveStop = null;
		}
		cleanup();
		isRecording = false;
		isPaused = false;
		duration = 0;
		error = null;
	};

	return {
		get isRecording() { return isRecording; },
		get isPaused() { return isPaused; },
		get duration() { return duration; },
		get error() { return error; },
		startRecording,
		stopRecording,
		pauseRecording,
		resumeRecording,
		cancelRecording,
	};
}
