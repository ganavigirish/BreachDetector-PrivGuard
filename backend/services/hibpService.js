const axios = require("axios");

const checkEmailExposure = async (email) => {

    try {

        console.log(`🔍 Checking email: ${email}`);
        console.log(`🔑 Using API Key: ${process.env.LEAKCHECK_API_KEY ? "Present" : "Missing"}`);

        const response = await axios.get(
            `https://leakcheck.io/api/public?check=${email}`,
            {
                headers: {
                    "X-API-Key": process.env.LEAKCHECK_API_KEY
                }
            }
        );

        const result = response.data;
        console.log("📦 Raw API Response:", JSON.stringify(result, null, 2));

        const riskLevel =
    result.found > 100
        ? "HIGH"
        : result.found > 20
        ? "MEDIUM"
        : "LOW";

const exposureScore = Math.min(result.found || 0, 100);

const sensitiveFields = [
    "password",
    "phone",
    "ip",
    "credit_card"
];

const containsSensitiveData =
    result.fields?.some(field =>
        sensitiveFields.includes(field)
    ) || false;

const formattedResponse = {
    totalBreaches: result.found || 0,
    riskLevel,
    exposureScore,
    containsSensitiveData,
    leakedFields: result.fields || [],
    sources: (result.sources || []).map((source) => ({
        name: source.name,
        date: source.date || "Unknown"
    }))
};

console.log("✅ Formatted Response:", JSON.stringify(formattedResponse, null, 2));
return formattedResponse;

    } catch (error) {

        console.log(error.response?.data || error.message);

        throw new Error("Failed to fetch exposure data");

    }

};
const checkPhoneExposure = async (phone) => {

    try {

        console.log(`📱 Checking phone: ${phone}`);

        const response = await axios.get(
            `https://leakcheck.io/api/public?check=${phone}`,
            {
                headers: {
                    "X-API-Key": process.env.LEAKCHECK_API_KEY
                }
            }
        );

        const result = response.data;

        const riskLevel =
            result.found > 100
                ? "HIGH"
                : result.found > 20
                ? "MEDIUM"
                : "LOW";

        const exposureScore = Math.min(result.found || 0, 100);

        const sensitiveFields = [
            "password",
            "phone",
            "ip",
            "credit_card"
        ];

        const containsSensitiveData =
            result.fields?.some(field =>
                sensitiveFields.includes(field)
            ) || false;

        const formattedResponse = {
            totalBreaches: result.found || 0,
            riskLevel,
            exposureScore,
            containsSensitiveData,
            leakedFields: result.fields || [],
            sources: (result.sources || []).map((source) => ({
                name: source.name,
                date: source.date || "Unknown"
            }))
        };

        return formattedResponse;

    } catch (error) {

        console.log(error.response?.data || error.message);

        throw new Error("Failed to fetch phone exposure");

    }

};

module.exports = {
    checkEmailExposure,
    checkPhoneExposure
};