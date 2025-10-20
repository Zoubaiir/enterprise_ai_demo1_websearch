import { sendEvaluateListingCommand } from "./messaging";
import { initFacebookExtractor } from "./facebook.extractor";

const currentUrl = window.location.href;

async function showAssessmentOverlay() {
  try {
  const response: any = await sendEvaluateListingCommand({ url: currentUrl });
  const assessment = response?.assessment;

    // Create a small overlay in the page to show the assessment summary
    const container = document.createElement("div");
    container.id = "ai-deal-insight-overlay";
    container.style.position = "fixed";
    container.style.top = "12px";
    container.style.right = "12px";
    container.style.zIndex = "999999";
    container.style.background = "rgba(0,0,0,0.85)";
    container.style.color = "#fff";
    container.style.padding = "10px 14px";
    container.style.borderRadius = "8px";
    container.style.fontFamily = "Arial, sans-serif";
    container.style.boxShadow = "0 6px 18px rgba(0,0,0,0.35)";
    container.style.maxWidth = "320px";

    if (!assessment) {
      container.innerText = "AI evaluation did not return a result.";
    } else {
      const title = document.createElement("div");
      title.style.fontWeight = "700";
      title.style.marginBottom = "6px";
      title.innerText = `Deal: ${assessment.verdict?.toUpperCase() ?? "N/A"}`;

      const score = document.createElement("div");
      score.style.fontSize = "22px";
      score.style.fontWeight = "800";
      score.style.marginBottom = "6px";
      score.innerText = `Score: ${Math.round(assessment.overallScore ?? 0)}`;

      const rationale = document.createElement("div");
      rationale.style.fontSize = "12px";
      rationale.style.opacity = "0.9";
      rationale.innerText = (assessment.rationale || []).slice(0, 3).join(" \n") || "No details";

      container.appendChild(title);
      container.appendChild(score);
      container.appendChild(rationale);
    }

    const closeBtn = document.createElement("button");
    closeBtn.innerText = "×";
    closeBtn.title = "Close";
    closeBtn.style.position = "absolute";
    closeBtn.style.top = "6px";
    closeBtn.style.right = "8px";
    closeBtn.style.background = "transparent";
    closeBtn.style.border = "none";
    closeBtn.style.color = "#fff";
    closeBtn.style.fontSize = "14px";
    closeBtn.style.cursor = "pointer";
    closeBtn.addEventListener("click", () => container.remove());

    container.appendChild(closeBtn);
    document.body.appendChild(container);
  } catch (error) {
    console.error("Failed to trigger evaluation", error);
  }
}

// Initialize extraction for Facebook Marketplace if applicable
try {
  initFacebookExtractor();
} catch (e) {
  // ignore errors from extractor
}

void showAssessmentOverlay();
