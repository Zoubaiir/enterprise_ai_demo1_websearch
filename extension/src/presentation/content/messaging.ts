import type { EvaluateListingPayload } from "@application/commands/evaluate-listing.command";

export function sendEvaluateListingCommand(payload: EvaluateListingPayload): Promise<unknown> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ type: "evaluate-listing", payload }, (response) => {
      const error = chrome.runtime.lastError;
      if (error) {
        reject(error);
        return;
      }
      resolve(response);
    });
  });
}
