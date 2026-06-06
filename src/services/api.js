/**
 * CampusEV Intel Frontend - API Service Stubs
 * 
 * This file contains the stubbed out fetch calls for the AWS Lambda backend.
 * The teammate will implement the actual fetch logic here.
 */

import { fetchAuthSession } from 'aws-amplify/auth';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const submitAssessment = async (data) => {
  console.log("Submitting assessment data to AWS Lambda...", data);
  try {
    const session = await fetchAuthSession();
    const token = session.tokens?.idToken?.toString();

    const payload = {
      population: parseInt(data.studentPopulation) || 0,
      budget: parseInt(data.totalBudget) || 0,
      network_status: data.networkStatus,
      daily_grid_availability: parseInt(data.gridAvailability) || 0
    };

    const response = await fetch("https://xmnfgp10ge.execute-api.af-south-1.amazonaws.com/score", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Assessment result:", result);

    // Save to localStorage so Dashboard can read it
    localStorage.setItem('assessmentResult', JSON.stringify(result));

    return { success: true, message: result.message || "Assessment compiled successfully" };
  } catch (error) {
    console.error("Error submitting assessment:", error);
    return { success: false, error: error.message };
  }
};

export const fetchCampusProfile = async () => {
  console.log("Fetching campus profile from AWS Lambda...");
  try {
    const session = await fetchAuthSession();
    const token = session.tokens?.idToken?.toString();

    const response = await fetch("https://xmnfgp10ge.execute-api.af-south-1.amazonaws.com/campus-profile", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (response.status === 404) {
      return null; // Profile does not exist yet
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Fetched campus profile:", data);
    return data;
  } catch (error) {
    console.error("Error fetching campus profile:", error);
    return null;
  }
};

export const fetchDashboardMetrics = async () => {
  console.log("Fetching dashboard metrics from AWS Lambda...");
  await delay(500);

  const savedResultStr = localStorage.getItem('assessmentResult');
  let readinessScore = 0;
  let budgetAllocation = [
    { name: 'Chargers', value: 0 },
    { name: 'Solar Buffer', value: 0 },
    { name: 'Network', value: 0 },
    { name: 'Trenching', value: 0 }
  ];
  let schoolName = "";

  if (savedResultStr) {
    const savedResult = JSON.parse(savedResultStr);
    
    // Check if it's the direct assessment format or the campus-profile format
    if (savedResult.final_score !== undefined) {
      readinessScore = savedResult.final_score;
    }
    
    if (savedResult.split_budget) {
      budgetAllocation = [
        { name: 'Chargers', value: savedResult.split_budget.chargers || 0 },
        { name: 'Solar Buffer', value: savedResult.split_budget.solar_backup || 0 },
        { name: 'Network', value: savedResult.split_budget.wifi_access_points || 0 },
        { name: 'Trenching', value: savedResult.split_budget.trenching || 0 }
      ];
    }

    if (savedResult.school_name) {
      schoolName = savedResult.school_name;
    }
  }

  return {
    schoolName,
    readinessScore,
    votes: {
      total: 4,
      yes: 3,
      no: 1
    },
    budgetAllocation,
    telemetry: {
      voltage: 228,
      status: 'online'
    },
    bedrockAnalysis: savedResultStr
      ? `Assessment completed. Campus readiness score is ${readinessScore}%. View budget allocation charts for detailed physical deployment breakdown.`
      : `Awaiting live telemetry and deployment data...`
  };
};

export const submitStudentDemand = async ({ name, location, support }) => {
  console.log("Submitting student demand from mobile portal to AWS Lambda...");

  const payload = {
    poll_id: name,
    vote_type: support ? "yes" : "no"
  };

  try {
    const response = await fetch("https://xmnfgp10ge.execute-api.af-south-1.amazonaws.com/vote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Vote recorded successfully:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Error submitting student demand:", error);
    return { success: false, error: error.message };
  }
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
  try {
    const session = await fetchAuthSession();
    const token = session.tokens?.idToken?.toString();

    const response = await fetch("https://xmnfgp10ge.execute-api.af-south-1.amazonaws.com/chat", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ user_message: message })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { reply: data.ai_response };
  } catch (error) {
    console.error("Error sending copilot message:", error);
    return { reply: "Sorry, I am currently offline. Please check your network connection." };
  }
};

export const fetchPollVotes = async (pollId) => {
  console.log(`Fetching poll votes for ${pollId} from AWS Lambda...`);
  try {
    const response = await fetch(`https://xmnfgp10ge.execute-api.af-south-1.amazonaws.com/vote-total?poll_id=${encodeURIComponent(pollId)}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching poll votes:", error);
    return null;
  }
};

export const saveChargingStation = async (lat, lng) => {
  console.log(`Sending new charging station coordinates (${lat}, ${lng}) to AWS Lambda endpoint...`);
  try {
    const session = await fetchAuthSession();
    const token = session.tokens?.idToken?.toString();

    const payload = { lat, lon: lng };

    const response = await fetch("https://xmnfgp10ge.execute-api.af-south-1.amazonaws.com/calculate-trenching", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("AWS Error Body:", errText);
      throw new Error(`HTTP error! status: ${response.status}, body: ${errText}`);
    }

    const data = await response.json();
    console.log("Trenching cost calculated:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Error calculating trenching cost:", error);
    return { success: false, error: error.message };
  }
};
