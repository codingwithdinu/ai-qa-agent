const extensionId =
  import.meta.env.VITE_EXTENSION_ID;
const MESSAGE_SOURCE =
  "ai-qa-recorder";
const MESSAGE_TIMEOUT_MS = 1500;

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
  if (extensionId) {
    if (
      !window.chrome?.runtime?.sendMessage
    ) {
      throw new Error(
        "Recorder extension not available"
      );
    }

    await new Promise<void>(
      (resolve, reject) => {
        window.chrome.runtime.sendMessage(
          extensionId,
          message,
          () => {
            const lastError =
              window.chrome.runtime.lastError;
            if (lastError) {
              reject(
                new Error(lastError.message)
              );
              return;
            }
            resolve();
          }
        );
      }
    );
    return;
  }

  await new Promise<void>(
    (resolve, reject) => {
      const channel =
        new MessageChannel();
      const timeoutId =
        window.setTimeout(() => {
          channel.port1.onmessage = null;
          reject(
            new Error(
              "Recorder extension not detected"
            )
          );
        }, MESSAGE_TIMEOUT_MS);

      channel.port1.onmessage = (
        event
      ) => {
        window.clearTimeout(timeoutId);
        const data =
          event.data || {};
        if (data.ok) {
          resolve();
          return;
        }
        reject(
          new Error(
            data.error ||
              "Recorder extension not available"
          )
        );
      };

      window.postMessage(
        {
          source: MESSAGE_SOURCE,
          payload: message,
        },
        "*",
        [channel.port2]
      );
    }
  );
}
