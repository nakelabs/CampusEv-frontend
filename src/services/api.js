/**
 * CampusEV Intel Frontend - API Service Stubs
 * 
 * This file contains the stubbed out fetch calls for the AWS Lambda backend.
 * The teammate will implement the actual fetch logic here.
 */

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const submitAssessment = async (data) => {
  console.log("Submitting assessment data to AWS Lambda...", data);
  await delay(1000);
  return { success: true, message: "Assessment compiled successfully" };
};

export const fetchDashboardMetrics = async () => {
  console.log("Fetching dashboard metrics from AWS Lambda...");
  await delay(500);
  return {
    readinessScore: 68,
    votes: 1204,
    budgetAllocation: [
      { name: 'Chargers', value: 40 },
      { name: 'Solar Buffer', value: 35 },
      { name: 'Network', value: 15 },
      { name: 'Trenching', value: 10 }
    ],
    telemetry: {
      voltage: 218,
      status: 'nominal'
    },
    bedrockAnalysis: `Based on current campus grid patterns, the localized transformer (Node A) exhibits stable load parameters but lacks sufficient daytime overhead for Level 3 DC fast charging. It is recommended to deploy smart-throttling load balancers if peak charging overlaps with core academic hours. \n\nFurthermore, student polling indicates a high demand cluster near the engineering block, which currently suffers from patchy network connectivity. Establishing dedicated IoT relay points prior to charger installation will be critical for uptime reliability.\n\nProcurement modeling suggests a phased rollout: 4x Level 2 chargers coupled with an 80kWh battery buffer to smooth demand spikes, maintaining the overall 68% readiness score.`
  };
};

export const submitStudentDemand = async (locationData) => {
  console.log("Submitting student demand from mobile portal to AWS Lambda...", locationData);
  await delay(300);
  return { success: true, newTotalVotes: 1205 };
};

export const fetchHeatmapData = async () => {
  console.log("Fetching geospatial data from AWS Lambda...");
  await delay(500);
  return {
    campusCenter: [6.5244, 3.3792], // Example coordinate (Lagos, Nigeria)
    transformers: [],
    proposedChargers: []
  };
};

export const sendCopilotMessage = async (message) => {
  console.log("Sending message to Procurement Copilot AWS Lambda...", message);
  await delay(800);
  return { reply: "I can help model the procurement costs for that configuration. Would you like me to run a simulation?" };
};
