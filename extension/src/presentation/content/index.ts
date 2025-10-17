import { sendEvaluateListingCommand } from "./messaging";

const currentUrl = window.location.href;

void sendEvaluateListingCommand({ url: currentUrl }).catch((error) =>
  console.error("Failed to trigger evaluation", error)
);
