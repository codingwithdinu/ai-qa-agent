const extensionId =
  import.meta.env.VITE_EXTENSION_ID;

export type RecorderMessage =
  | {
      type: "START_RECORDING";
      recordingId: string;
      url: string;
    }
  | {
      type: "STOP_RECORDING";
    };

export async function sendRecorderMessage(
  message: RecorderMessage
): Promise<void> {
  if (
    !window.chrome?.runtime?.sendMessage
  ) {
    throw new Error(
      "Recorder extension not available"
    );
  }

  await new Promise<void>(
    (resolve, reject) => {
      const send =
        extensionId
          ? (
              payload: RecorderMessage,
              callback: () => void
            ) =>
              window.chrome.runtime.sendMessage(
                extensionId,
                payload,
                callback
              )
          : window.chrome.runtime.sendMessage;

      send(message, () => {
        const lastError =
          window.chrome.runtime.lastError;
        if (lastError) {
          reject(
            new Error(lastError.message)
          );
          return;
        }
        resolve();
      });
    }
  );
}
